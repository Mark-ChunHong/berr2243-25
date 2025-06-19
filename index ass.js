// server.js
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000;
let db;

// Connect to MongoDB Atlas
const uri = "mongodb+srv://Database_Ass:Database_Ass2025@cluster0.i63ss4u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");
        db = client.db("Assignment");
    } catch (err) {
        console.error("Connection error:", err);
    }
}
connectToMongoDB();

// Middleware
app.use(express.json());
app.use(cors());

// Role-based Access
const roleAuth = (roles) => {
    return (req, res, next) => {
        const role = req.headers['x-role'];
        if (roles.includes(role)) next();
        else res.status(403).json({ error: "Forbidden: Insufficient permissions" });
    };
};

// ---------- AUTHENTICATION ----------
app.post('/auth/admin/login', async (req, res) => {
    const { Username, Password } = req.body;
    try {
        const admin = await db.collection('admin').findOne({ Username });
        if (!admin || admin.Password !== Password) {
            return res.status(401).json({ error: "Invalid admin credentials" });
        }
        res.status(200).json({
            message: "Admin login successful",
            adminId: admin._id,
            role: "admin"
        });
    } catch (err) {
        res.status(500).json({ error: "Server error during admin login" });
    }
});

app.post('/auth/login', async (req, res) => {
    const { Email, Password } = req.body;
    try {
        const user = await db.collection('users').findOne({ Email });
        if (!user || user.Password !== Password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        res.status(200).json({
            message: "Login successful",
            userId: user._id,
            role: "user"
        });
    } catch (err) {
        res.status(500).json({ error: "Server error during login" });
    }
});

app.post('/auth/driver/login', async (req, res) => {
    const { driverId, Password } = req.body;
    try {
        const driver = await db.collection('drivers').findOne({ Driver_ID: driverId });
        if (!driver || driver.Password !== Password) {
            return res.status(401).json({ error: "Invalid driver ID or password" });
        }
        res.status(200).json({
            message: "Login successful",
            driverId: driver._id,
            role: "driver"
        });
    } catch (err) {
        res.status(500).json({ error: "Server error during login" });
    }
});

// ---------- USERS ----------
app.post('/users', async (req, res) => {
    const { Email, Password, Name } = req.body;
    if (!Email || !Password || !Name) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    const existingUser = await db.collection('users').findOne({ Email });
    if (existingUser) {
        return res.status(409).json({ error: "User already exists" });
    }
    const result = await db.collection('users').insertOne({
        Email, Password, Name, Registration_Date: new Date(), Delete_Account: false
    });
    res.status(201).json({ id: result.insertedId });
});

app.get('/users/:id', roleAuth(['user', 'admin']), async (req, res) => {
    try {
        const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
        if (!user) return res.status(404).json({ error: "User not found" });
        const { Password, ...userData } = user;
        res.status(200).json(userData);
    } catch (err) {
        res.status(400).json({ error: "Invalid user ID" });
    }
});

app.delete('/users/:id', roleAuth(['user', 'admin']), async (req, res) => {
    const result = await db.collection('users').updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { Delete_Account: true } }
    );
    if (result.modifiedCount === 0) return res.status(404).json({ error: "User not found" });
    res.status(204).send();
});

// ---------- DRIVERS ----------
app.patch('/drivers/:id/status', roleAuth(['driver', 'admin']), async (req, res) => {
    const { status } = req.body;
    const result = await db.collection('drivers').updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { availability: status } }
    );
    if (result.modifiedCount === 0) return res.status(404).json({ error: "Driver not found or no update" });
    res.status(200).json({ updated: result.modifiedCount });
});

app.get('/drivers/:id/earnings', roleAuth(['driver', 'admin']), async (req, res) => {
    const earnings = await db.collection('earning').find({ Driver_ID: req.params.id }).toArray();
    if (!earnings.length) return res.status(404).json({ error: "No earnings found" });
    const total = earnings.reduce((sum, e) => sum + e.Total_Earn, 0);
    res.status(200).json({ earnings, total });
});

app.get('/drivers/:id', roleAuth(['user', 'admin']), async (req, res) => {
    const driver = await db.collection('drivers').findOne({ _id: new ObjectId(req.params.id) });
    if (!driver) return res.status(404).json({ error: "Driver not found" });
    const { Password, ...driverData } = driver;
    res.status(200).json(driverData);
});

// ---------- PASSENGERS FOR DRIVER ----------
app.get('/passengers/:id', roleAuth(['driver', 'admin']), async (req, res) => {
    const passenger = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
    if (!passenger) return res.status(404).json({ error: "Passenger not found" });
    const { Password, ...data } = passenger;
    res.status(200).json(data);
});

// ---------- ADMIN ----------
app.get('/admin/analytics', roleAuth(['admin']), async (req, res) => {
    const users = await db.collection('users').countDocuments();
    const drivers = await db.collection('drivers').countDocuments();
    const rides = await db.collection('rides').countDocuments();
    const payments = await db.collection('payments').countDocuments();
    const earnings = await db.collection('earning').find().toArray();
    const totalEarnings = earnings.reduce((sum, e) => sum + e.Total_Earn, 0);
    res.status(200).json({ users, drivers, rides, payments, totalEarnings });
});

// ---------- RIDES ----------
app.get('/rides', roleAuth(['user', 'driver', 'admin']), async (req, res) => {
    const rides = await db.collection('rides').find().toArray();
    res.status(200).json(rides);
});

app.post('/rides', roleAuth(['user']), async (req, res) => {
    const { User_ID, Pick_up, Destination } = req.body;
    if (!User_ID || !Pick_up || !Destination) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    const user = await db.collection('users').findOne({ User_ID });
    if (!user) return res.status(404).json({ error: "User not found" });

    const ride = {
        User_ID, Pick_up, Destination,
        Status: "pending",
        Start_Time: new Date(),
        Created_At: new Date()
    };
    const result = await db.collection('rides').insertOne(ride);
    res.status(201).json({ id: result.insertedId });
});

app.patch('/rides/:id', roleAuth(['driver', 'admin']), async (req, res) => {
    const validStatuses = ["pending", "accepted", "in-progress", "completed", "cancelled"];
    const { status } = req.body;
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
    }

    const update = {
        $set: {
            status,
            ...(status === "completed" && { End_Time: new Date() }),
            ...(status === "in-progress" && { Start_Time: new Date() })
        }
    };
    const result = await db.collection('rides').updateOne({ _id: new ObjectId(req.params.id) }, update);
    if (result.modifiedCount === 0) return res.status(404).json({ error: "Ride not found" });
    res.status(200).json({ updated: result.modifiedCount });
});

app.delete('/rides/:id', roleAuth(['user', 'admin']), async (req, res) => {
    const ride = await db.collection('rides').findOne({ _id: new ObjectId(req.params.id) });
    if (!ride) return res.status(404).json({ error: "Ride not found" });
    if (["completed", "in-progress"].includes(ride.Status)) {
        return res.status(400).json({ error: "Cannot cancel a ride already in progress or completed" });
    }

    const result = await db.collection('rides').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Ride not found" });
    res.status(200).json({ deleted: result.deletedCount });
});

// ---------- START SERVER ----------
app.listen(port, () => {
    console.log(`MyTaxi backend running at http://localhost:${port}`);
});
