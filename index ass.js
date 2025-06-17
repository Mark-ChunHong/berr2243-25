const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const basicAuth = require('express-basic-auth');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

let db;

// Connect to MongoDB
async function connectToMongoDB() {
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        db = client.db("testDB");
    } catch (err) {
        console.error("Error:", err);
    }
}
connectToMongoDB();

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


// Role-based access control middleware
const roleAuth = (roles) => {
    return (req, res, next) => {
        const userRole = req.auth ? req.auth.role : 'guest';
        if (roles.includes(userRole)) {
            next();
        } else {
            res.status(403).json({ error: "Forbidden: Insufficient permissions" });
        }
    };
};

// Basic authentication for admin endpoints
const adminAuth = basicAuth({
    users: { 'admin': 'Admin@123' },
    challenge: true,
    unauthorizedResponse: 'Unauthorized: Admin access required'
});

// --------------------- AUTHENTICATION ---------------------

// POST /auth/login – User login
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.collection('users').findOne({ email });
        if (!user || user.Password !== password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        res.status(200).json({ 
            message: "Login successful", 
            userId: user._id,
            role: 'user'
        });
    } catch (err) {
        res.status(500).json({ error: "Server error during login" });
    }
});

// POST /auth/driver/login – Driver login
app.post('/auth/driver/login', async (req, res) => {
    const { driverId, password } = req.body;
    try {
        const driver = await db.collection('drivers').findOne({ Driver_ID: driverId });
        if (!driver || driver.Password !== password) {
            return res.status(401).json({ error: "Invalid driver ID or password" });
        }
        res.status(200).json({ 
            message: "Login successful", 
            driverId: driver._id,
            role: 'driver'
        });
    } catch (err) {
        res.status(500).json({ error: "Server error during login" });
    }
});

// --------------------- USER ENDPOINTS ---------------------

// POST /users – Register a new user
app.post('/users', async (req, res) => {
    try {
        // Basic validation
        if (!req.body.Email || !req.body.Password || !req.body.Name) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if user already exists
        const existingUser = await db.collection('users').findOne({ Email: req.body.Email });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }

        const result = await db.collection('users').insertOne({
            ...req.body,
            Registration_Date: new Date(),
            Delete_Account: false
        });
        res.status(201).json({ id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: "Error creating user" });
    }
});

// GET /users/:id – View profile
app.get('/users/:id', roleAuth(['user', 'admin']), async (req, res) => {
    try {
        const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Don't return password in response
        const { Password, ...userData } = user;
        res.status(200).json(userData);
    } catch (err) {
        res.status(400).json({ error: "Invalid user ID" });
    }
});

// DELETE /users/:id – Delete account
app.delete('/users/:id', roleAuth(['user', 'admin']), async (req, res) => {
    try {
        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { Delete_Account: true } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: "Invalid user ID" });
    }
});

// --------------------- DRIVER ENDPOINTS ---------------------

// PATCH /drivers/:id/status – Update driver availability
app.patch('/drivers/:id/status', roleAuth(['driver', 'admin']), async (req, res) => {
    const { status } = req.body;

    try {
        const result = await db.collection('drivers').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { availability: status } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Driver not found or no change" });
        }

        res.status(200).json({ updated: result.modifiedCount });
    } catch (err) {
        res.status(400).json({ error: "Invalid driver ID or status" });
    }
});

// GET /drivers/:id/earnings – View driver earnings
app.get('/drivers/:id/earnings', roleAuth(['driver', 'admin']), async (req, res) => {
    try {
        const earnings = await db.collection('earning').find({ Driver_ID: req.params.id }).toArray();
        if (!earnings || earnings.length === 0) {
            return res.status(404).json({ error: "No earnings found for this driver" });
        }
        
        const totalEarnings = earnings.reduce((sum, earning) => sum + earning.Total_Earn, 0);
        res.status(200).json({ earnings, totalEarnings });
    } catch (err) {
        res.status(400).json({ error: "Invalid driver ID" });
    }
});

// --------------------- ADMIN ENDPOINTS ---------------------

// DELETE /admin/users/:id – Block user
app.delete('/admin/users/:id', adminAuth, async (req, res) => {
    try {
        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { blocked: true } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "User not found or already blocked" });
        }

        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: "Invalid user ID" });
    }
});

// GET /admin/analytics – View system analytics
app.get('/admin/analytics', adminAuth, async (req, res) => {
    try {
        const usersCount = await db.collection('users').countDocuments();
        const driversCount = await db.collection('drivers').countDocuments();
        const ridesCount = await db.collection('rides').countDocuments();
        const paymentsCount = await db.collection('payments').countDocuments();
        
        // Get total earnings
        const earnings = await db.collection('earning').find().toArray();
        const totalEarnings = earnings.reduce((sum, earning) => sum + earning.Total_Earn, 0);

        res.status(200).json({
            users: usersCount,
            drivers: driversCount,
            rides: ridesCount,
            payments: paymentsCount,
            totalEarnings: totalEarnings
        });
    } catch (err) {
        res.status(500).json({ error: "Error fetching analytics" });
    }
});

// --------------------- RIDE ENDPOINTS ---------------------

// GET /rides
app.get('/rides', roleAuth(['user', 'driver', 'admin']), async (req, res) => {
    try {
        const rides = await db.collection('rides').find().toArray();
        res.status(200).json(rides);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch rides" });
    }
});

// POST /rides - Create a new ride
app.post('/rides', roleAuth(['user']), async (req, res) => {
    try {
        // Validate required fields
        if (!req.body.User_ID || !req.body.Pick_up || !req.body.Destination) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if user exists
        const user = await db.collection('users').findOne({ User_ID: req.body.User_ID });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Create ride with default status
        const rideData = {
            ...req.body,
            Status: "pending",
            Start_Time: new Date(),
            Created_At: new Date()
        };

        const result = await db.collection('rides').insertOne(rideData);
        res.status(201).json({ id: result.insertedId });
    } catch (err) {
        res.status(400).json({ error: "Invalid ride data" });
    }
});

// PATCH /rides/:id - Update ride status
app.patch('/rides/:id', roleAuth(['driver', 'admin']), async (req, res) => {
    try {
        // Validate status
        const validStatuses = ["pending", "accepted", "in-progress", "completed", "cancelled"];
        if (!req.body.status || !validStatuses.includes(req.body.status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        const result = await db.collection('rides').updateOne(
            { _id: new ObjectId(req.params.id) },
            { 
                $set: { 
                    status: req.body.status,
                    ...(req.body.status === "completed" && { End_Time: new Date() }),
                    ...(req.body.status === "in-progress" && { Start_Time: new Date() })
                } 
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Ride not found" });
        }

        res.status(200).json({ updated: result.modifiedCount });
    } catch (err) {
        res.status(400).json({ error: "Invalid ride ID or data" });
    }
});

// DELETE /rides/:id - Cancel a ride
app.delete('/rides/:id', roleAuth(['user', 'admin']), async (req, res) => {
    try {
        // First check if the ride exists
        const ride = await db.collection('rides').findOne({ _id: new ObjectId(req.params.id) });
        if (!ride) {
            return res.status(404).json({ error: "Ride not found" });
        }

        // Only allow cancellation if ride is pending or accepted
        if (ride.Status === "completed" || ride.Status === "in-progress") {
            return res.status(400).json({ error: "Cannot cancel a ride that's already in progress or completed" });
        }

        const result = await db.collection('rides').deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Ride not found" });
        }

        res.status(200).json({ deleted: result.deletedCount });
    } catch (err) {
        res.status(400).json({ error: "Server error during deletion" });
    }
});