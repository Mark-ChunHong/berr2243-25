const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

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

// --------------------- CUSTOMER ---------------------

// POST /users – Register a new user (already implemented)
app.post('/users', async (req, res) => {
    try {
        const result = await db.collection('users').insertOne(req.body);
        res.status(201).json({ id: result.insertedId });
    } catch (err) {
        res.status(400).json({ error: "Invalid user data" });
    }
});

// GET /users/:id – View profile (already implemented)
app.get('/users/:id', async (req, res) => {
    try {
        const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ error: "Invalid user ID" });
    }
});

// POST /auth/login – Customer login
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.collection('users').findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        res.status(200).json({ message: "Login successful", userId: user._id });
    } catch (err) {
        res.status(401).json({ error: "Server error during login" });
    }
});

// --------------------- DRIVER ---------------------

// PATCH /drivers/:id/status – Update driver availability
app.patch('/drivers/:id/status', async (req, res) => {
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
        res.status(404).json({ error: "Invalid driver ID or status" });
    }
});

// GET /drivers/:id/earnings – View driver earnings
app.get('/drivers/:id/earnings', async (req, res) => {
    try {
        const driver = await db.collection('drivers').findOne({ _id: new ObjectId(req.params.id) });

        if (!driver) {
            return res.status(404).json({ error: "Driver not found" });
        }

        res.status(200).json({ earnings: driver.earnings || 0 });
    } catch (err) {
        res.status(400).json({ error: "Invalid driver ID" });
    }
});

// --------------------- ADMIN ---------------------

// DELETE /admin/users/:id – Block user
app.delete('/admin/users/:id', async (req, res) => {
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
        res.status(403).json({ error: "Invalid user ID" });
    }
});

// GET /admin/analytics – View system analytics
app.get('/admin/analytics', async (req, res) => {
    try {
        const usersCount = await db.collection('users').countDocuments();
        const driversCount = await db.collection('drivers').countDocuments();
        const ridesCount = await db.collection('rides').countDocuments();

        res.status(200).json({
            users: usersCount,
            drivers: driversCount,
            rides: ridesCount
        });
    } catch (err) {
        res.status(500).json({ error: "Error fetching analytics" });
    }
});

// --------------------- EXISTING RIDE ENDPOINTS ---------------------

// GET /rides
app.get('/rides', async (req, res) => {
    try {
        const rides = await db.collection('rides').find().toArray();
        res.status(200).json(rides);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch rides" });
    }
});

// POST /rides
app.post('/rides', async (req, res) => {
    try {
        const result = await db.collection('rides').insertOne(req.body);
        res.status(201).json({ id: result.insertedId });
    } catch (err) {
        res.status(400).json({ error: "Invalid ride data" });
    }
});

// PATCH /rides/:id
app.patch('/rides/:id', async (req, res) => {
    try {
        const result = await db.collection('rides').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { status: req.body.status } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Ride not found" });
        }

        res.status(200).json({ updated: result.modifiedCount });
    } catch (err) {
        res.status(400).json({ error: "Invalid ride ID or data" });
    }
});

// DELETE /rides/:id
app.delete('/rides/:id', async (req, res) => {
    try {
        const result = await db.collection('rides').deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Ride not found" });
        }

        res.status(200).json({ deleted: result.deletedCount });
    } catch (err) {
        res.status(400).json({ error: "Server error during deletion" });
    }
});
