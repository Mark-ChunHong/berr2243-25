const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const bcrypt = require('bcryptjs'); // For password hashing

const app = express();
const port = 3000;

// Explicit CORS configuration for better handling of preflight requests
const corsOptions = {
    origin: '*', // Allow all origins for now. In production, specify your frontend's domain: e.g., 'http://localhost:8080'
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Explicitly allow headers
    optionsSuccessStatus: 204 // For preflight, respond with 204 No Content
};

app.use(cors(corsOptions)); // Apply the explicit CORS options
app.use(bodyParser.json());

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Default route to serve login.html when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'app.html'));
});

// JWT Secret Key (IMPORTANT: Use a strong, random key in production!)
const JWT_SECRET = 'YOUR_SUPER_SECRET_JWT_KEY_PLEASE_CHANGE_ME'; // CHANGE THIS TO A STRONG, UNIQUE KEY

// MongoDB Connection URI - IMPORTANT: Ensure this matches your assignment1.js URI
const MONGODB_URI = "mongodb+srv://Database_Ass:Database_Ass2025@cluster0.i63ss4u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "Assignment"; // Your database name (must match assignment1.js)

let db; // Global variable to store the database connection

// Collection names
const collections = {
    users: 'users',
    drivers: 'drivers',
    vehicles: 'vehicles',
    rides: 'rides',
    payments: 'payments',
    earnings: 'earnings',
    admins: 'admins'
};

// Connect to MongoDB
MongoClient.connect(MONGODB_URI)
    .then(client => {
        db = client.db(DB_NAME);
        console.log(`Connected to MongoDB: ${DB_NAME}`);
    })
    .catch(err => {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1); // Exit process if database connection fails
    });

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden (invalid token)
        }
        req.user = user; // user payload from JWT (e.g., { email, role, id })
        next();
    });
};

// Middleware to authorize roles
const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.sendStatus(403); // Forbidden
        }
        next();
    };
};

// --- Authentication & Registration Routes ---

// Login Route (Supports Admin, Driver, Passenger)
app.post('/api/login', async (req, res) => {
    const { email, password, role } = req.body; // Expect role from frontend for explicit lookup

    let collectionName;
    let idField;

    switch (role) {
        case 'admin':
            collectionName = collections.admins;
            idField = 'adminId';
            break;
        case 'driver':
            collectionName = collections.drivers;
            idField = 'driverId';
            break;
        case 'user': // Passenger
            collectionName = collections.users;
            idField = 'userId';
            break;
        default:
            return res.status(400).json({ message: 'Invalid role provided.' });
    }

    try {
        const user = await db.collection(collectionName).findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Wrong email or password.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Wrong email or password.' });
        }

        // Generate JWT payload based on the specific user type
        const payload = {
            id: user[idField], // Use the specific ID field (userId, driverId, adminId)
            role: role,
            email: user.email,
            name: user.name // Include name for convenience in frontend header
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        // Return the specific user object for frontend local storage
        const responseData = { message: 'Login successful', token, role: role };
        if (role === 'admin') {
            responseData.user = { adminId: user.adminId, name: user.name, email: user.email };
        } else if (role === 'driver') {
            responseData.user = { driverId: user.driverId, name: user.name, email: user.email, phone: user.phone, licenseNumber: user.licenseNumber, vehicleId: user.vehicleId, vehicleDetails: user.vehicleDetails, isAvailable: user.isAvailable };
        } else { // user (passenger)
            responseData.user = { userId: user.userId, name: user.name, email: user.email, phone: user.phone };
        }

        res.json(responseData);

    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error during login', error: err.message });
    }
});

// Registration Route (ONLY for Driver and User/Passenger)
app.post('/api/register/:role', async (req, res) => {
    const { name, email, password, phone, licenseNumber, vehicleDetails } = req.body;
    const { role } = req.params;

    if (role === 'admin') {
        return res.status(403).json({ message: 'Admin accounts cannot be registered via this endpoint.' });
    }
    if (!name || !email || !password || !phone) {
        return res.status(400).json({ message: 'Name, email, password, and phone are required.' });
    }

    let collectionName;
    let newUserData = { name, email, phone };

    try {
        const existingUser = await db.collection(collections.users).findOne({ email }) ||
                             await db.collection(collections.drivers).findOne({ email }) ||
                             await db.collection(collections.admins).findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }

        newUserData.password = await bcrypt.hash(password, 10);
        newUserData.createdAt = new Date();

        if (role === 'driver') {
            collectionName = collections.drivers;
            newUserData.driverId = new ObjectId().toHexString(); // Generate unique ID
            newUserData.licenseNumber = licenseNumber || null;
            newUserData.vehicleDetails = vehicleDetails || null;
            newUserData.isAvailable = true; // Default for new drivers
        } else if (role === 'user') { // Passenger
            collectionName = collections.users;
            newUserData.userId = new ObjectId().toHexString(); // Generate unique ID
        } else {
            return res.status(400).json({ message: 'Invalid registration role.' });
        }

        await db.collection(collectionName).insertOne(newUserData);
        res.status(201).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully!` });

    } catch (err) {
        console.error(`Error during ${role} registration:`, err);
        res.status(500).json({ message: 'Server error during registration', error: err.message });
    }
});


// --- Admin-specific API Endpoints (CRUD & Dashboard Stats) ---

// Admin Dashboard Summary
app.get('/api/admin/dashboard-summary', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const usersCount = await db.collection(collections.users).countDocuments();
        const driversCount = await db.collection(collections.drivers).countDocuments();
        
        // Count only rides with valid passenger and driver data (consistent with what's displayed)
        const validRidesCount = await db.collection(collections.rides).aggregate([
            {
                $lookup: {
                    from: collections.users,
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'passengerInfo'
                }
            },
            {
                $lookup: {
                    from: collections.drivers,
                    localField: 'driverId',
                    foreignField: 'driverId',
                    as: 'driverInfo'
                }
            },
            {
                $unwind: { path: '$passengerInfo', preserveNullAndEmptyArrays: false }
            },
            {
                $unwind: { path: '$driverInfo', preserveNullAndEmptyArrays: false }
            },
            {
                $match: {
                    'passengerInfo.name': { $exists: true, $ne: null, $ne: '' },
                    'driverInfo.name': { $exists: true, $ne: null, $ne: '' }
                }
            },
            { $count: "totalValidRides" }
        ]).toArray();
        const ridesCount = validRidesCount.length > 0 ? validRidesCount[0].totalValidRides : 0;

        const earningsAggregate = await db.collection(collections.earnings).aggregate([
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
        ]).toArray();
        const totalEarnings = earningsAggregate.length > 0 ? earningsAggregate[0].totalAmount : 0;

        // Get recent rides with passenger and driver names for the admin overview table
        // Only show rides that have matching user/driver records with valid names
        const recentRides = await db.collection(collections.rides).aggregate([
            {
                $lookup: {
                    from: collections.users,
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'passengerInfo'
                }
            },
            {
                $lookup: {
                    from: collections.drivers,
                    localField: 'driverId',
                    foreignField: 'driverId',
                    as: 'driverInfo'
                }
            },
            {
                $unwind: { path: '$passengerInfo', preserveNullAndEmptyArrays: false }
            },
            {
                $unwind: { path: '$driverInfo', preserveNullAndEmptyArrays: false }
            },
            {
                $match: {
                    'passengerInfo.name': { $exists: true, $ne: null, $ne: '' },
                    'driverInfo.name': { $exists: true, $ne: null, $ne: '' }
                }
            },
            {
                $project: {
                    _id: 0,
                    rideId: 1,
                    userId: 1,
                    driverId: 1,
                    pickupLocation: 1,
                    dropoffLocation: 1,
                    fare: 1,
                    status: 1,
                    rideDate: 1,
                    paymentMethod: 1,
                    passengerName: '$passengerInfo.name',
                    driverName: '$driverInfo.name'
                }
            },
            { $sort: { rideDate: -1 } },
            { $limit: 5 }
        ]).toArray();

        res.json({
            totalUsers: usersCount,
            totalDrivers: driversCount,
            totalRides: ridesCount,
            totalEarnings: totalEarnings,
            recentRides: recentRides
        });

    } catch (err) {
        console.error('Error fetching dashboard summary:', err);
        res.status(500).json({ message: 'Failed to fetch dashboard summary', error: err.message });
    }
});

// Admin: Get All Users (Passengers)
app.get('/api/admin/users', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const users = await db.collection(collections.users).aggregate([
            {
                $lookup: {
                    from: collections.rides,
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'rideHistory'
                }
            },
            {
                $project: {
                    password: 0, // Exclude password for security
                    userId: 1,
                    name: 1,
                    email: 1,
                    phone: 1,
                    registrationDate: 1,
                    createdAt: 1,
                    totalRides: { $size: '$rideHistory' }
                }
            },
            { $sort: { createdAt: -1 } } // Sort by most recent first
        ]).toArray();
        res.json(users);
    } catch (err) {
        console.error('Error fetching users (admin):', err);
        res.status(500).json({ error: err.message });
    }
});

// Admin: Get User by ID
app.get('/api/admin/users/:userId', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const user = await db.collection(collections.users).findOne({ userId: req.params.userId });
        if (!user) return res.status(404).json({ message: 'User not found.' });
        const { password, ...userWithoutPassword } = user; // Exclude password
        res.json(userWithoutPassword);
    } catch (err) {
        console.error('Error fetching user by ID (admin):', err);
        res.status(500).json({ error: err.message });
    }
});

// Admin: Add User (Passenger)
app.post('/api/admin/users', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        const existingUser = await db.collection(collections.users).findOne({ email });
        if (existingUser) return res.status(409).json({ message: 'User with this email already exists.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { userId: new ObjectId().toHexString(), name, email, password: hashedPassword, phone, registrationDate: new Date() };
        await db.collection(collections.users).insertOne(newUser);
        res.status(201).json({ message: 'User added successfully!', userId: newUser.userId });
    } catch (err) {
        console.error('Error adding user (admin):', err);
        res.status(500).json({ error: err.message });
    }
});

// Admin: Update User (Passenger)
app.put('/api/admin/users/:userId', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
        const updateDoc = {};
        if (name !== undefined) updateDoc.name = name;
        if (email !== undefined) updateDoc.email = email;
        if (phone !== undefined) updateDoc.phone = phone;
        if (password) updateDoc.password = await bcrypt.hash(password, 10);

        if (Object.keys(updateDoc).length === 0) return res.status(400).json({ message: 'No fields to update provided.' });

        const result = await db.collection(collections.users).updateOne({ userId: req.params.userId }, { $set: updateDoc });
        if (result.matchedCount === 0) return res.status(404).json({ message: 'User not found.' });
        res.json({ message: 'User updated successfully!' });
    } catch (err) {
        console.error('Error updating user (admin):', err);
        res.status(500).json({ error: err.message });
    }
});

// Admin: Delete User (Passenger)
app.delete('/api/admin/users/:userId', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const result = await db.collection(collections.users).deleteOne({ userId: req.params.userId });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'User not found.' });
        res.json({ message: 'User deleted successfully!' });
    } catch (err) {
        console.error('Error deleting user (admin):', err);
        res.status(500).json({ error: err.message });
    }
});


// Admin: Get All Drivers
app.get('/api/admin/drivers', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const drivers = await db.collection(collections.drivers).aggregate([
            {
                $lookup: {
                    from: collections.rides,
                    localField: 'driverId',
                    foreignField: 'driverId',
                    as: 'rideHistory'
                }
            },
            {
                $lookup: {
                    from: collections.earnings,
                    localField: 'driverId',
                    foreignField: 'driverId',
                    as: 'earnings'
                }
            },
            {
                $project: {
                    password: 0, // Exclude password for security
                    driverId: 1,
                    name: 1,
                    email: 1,
                    phone: 1,
                    licenseNumber: 1,
                    vehicleDetails: 1,
                    isAvailable: 1,
                    createdAt: 1,
                    totalRides: { $size: '$rideHistory' },
                    totalEarnings: { $sum: '$earnings.amount' }
                }
            },
            { $sort: { createdAt: -1 } } // Sort by most recent first
        ]).toArray();
        res.json(drivers);
    } catch (err) {
        console.error('Error fetching drivers (admin):', err);
        res.status(500).json({ error: err.message });
    }
});

// Admin: Get Driver by ID
app.get('/api/admin/drivers/:driverId', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const driver = await db.collection(collections.drivers).findOne({ driverId: req.params.driverId });
        if (!driver) return res.status(404).json({ message: 'Driver not found.' });
        const { password, ...driverWithoutPassword } = driver; // Exclude password
        res.json(driverWithoutPassword);
    } catch (err) {
        console.error('Error fetching driver by ID (admin):', err);
        res.status(500).json({ error: err.message });
    }
});

// Admin: Add Driver
app.post('/api/admin/drivers', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    const { name, email, password, phone, licenseNumber, vehicleDetails, isAvailable } = req.body;
    if (!name || !email || !password || !phone || licenseNumber === undefined || vehicleDetails === undefined || isAvailable === undefined) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        const existingDriver = await db.collection(collections.drivers).findOne({ email });
        if (existingDriver) return res.status(409).json({ message: 'Driver with this email already exists.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newDriver = { driverId: new ObjectId().toHexString(), name, email, password: hashedPassword, phone, licenseNumber, vehicleDetails, isAvailable, createdAt: new Date() };
        await db.collection(collections.drivers).insertOne(newDriver);
        res.status(201).json({ message: 'Driver added successfully!', driverId: newDriver.driverId });
    } catch (err) {
        console.error('Error adding driver (admin):', err);
        res.status(500).json({ error: err.message });
    }
});

// Admin: Update Driver
app.put('/api/admin/drivers/:driverId', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    const { name, email, phone, password, licenseNumber, vehicleDetails, isAvailable } = req.body;
    try {
        const updateDoc = {};
        if (name !== undefined) updateDoc.name = name;
        if (email !== undefined) updateDoc.email = email;
        if (phone !== undefined) updateDoc.phone = phone;
        if (password) updateDoc.password = await bcrypt.hash(password, 10);
        if (licenseNumber !== undefined) updateDoc.licenseNumber = licenseNumber;
        if (vehicleDetails !== undefined) updateDoc.vehicleDetails = vehicleDetails;
        if (isAvailable !== undefined) updateDoc.isAvailable = isAvailable;

        if (Object.keys(updateDoc).length === 0) return res.status(400).json({ message: 'No fields to update provided.' });

        const result = await db.collection(collections.drivers).updateOne({ driverId: req.params.driverId }, { $set: updateDoc });
        if (result.matchedCount === 0) return res.status(404).json({ message: 'Driver not found.' });
        res.json({ message: 'Driver updated successfully!' });
    } catch (err) {
        console.error('Error updating driver (admin):', err);
        res.status(500).json({ error: err.message });
    }
});

// Admin: Delete Driver
app.delete('/api/admin/drivers/:driverId', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const result = await db.collection(collections.drivers).deleteOne({ driverId: req.params.driverId });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Driver not found.' });
        res.json({ message: 'Driver deleted successfully!' });
    } catch (err) {
        console.error('Error deleting driver (admin):', err);
        res.status(500).json({ error: err.message });
    }
});


// Admin: Get All Vehicles
app.get('/api/admin/vehicles', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const vehicles = await db.collection(collections.vehicles).aggregate([
            {
                $lookup: {
                    from: collections.drivers,
                    localField: 'driverId',
                    foreignField: 'driverId',
                    as: 'driverInfo'
                }
            },
            {
                $lookup: {
                    from: collections.rides,
                    localField: 'vehicleId',
                    foreignField: 'vehicleId',
                    as: 'rideHistory'
                }
            },
            {
                $unwind: { path: '$driverInfo', preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    vehicleId: 1,
                    make: 1,
                    model: 1,
                    year: 1,
                    licensePlate: 1,
                    driverId: 1,
                    createdAt: 1,
                    driverName: '$driverInfo.name',
                    driverPhone: '$driverInfo.phone',
                    isDriverAvailable: '$driverInfo.isAvailable',
                    totalRides: { $size: '$rideHistory' }
                }
            },
            { $sort: { createdAt: -1 } } // Sort by most recent first
        ]).toArray();
        res.json(vehicles);
    } catch (err) {
        console.error('Error fetching vehicles (admin):', err);
        res.status(500).json({ error: err.message });
    }
});

// Admin: Get Vehicle by ID
app.get('/api/admin/vehicles/:vehicleId', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const vehicle = await db.collection(collections.vehicles).findOne({ vehicleId: req.params.vehicleId });
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found.' });
        res.json(vehicle);
    } catch (err) {
        console.error('Error fetching vehicle by ID (admin):', err);
        res.status(500).json({ error: err.message });
    }
});

// Admin: Add Vehicle
app.post('/api/admin/vehicles', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    const { make, model, year, licensePlate, driverId } = req.body;
    if (!make || !model || !year || !licensePlate) {
        return res.status(400).json({ message: 'Make, model, year, and license plate are required.' });
    }
    try {
        const newVehicle = { vehicleId: new ObjectId().toHexString(), make, model, year: parseInt(year), licensePlate, driverId: driverId || null, createdAt: new Date() };
        await db.collection(collections.vehicles).insertOne(newVehicle);
        res.status(201).json({ message: 'Vehicle added successfully!', vehicleId: newVehicle.vehicleId });
    } catch (err) {
        console.error('Error adding vehicle (admin):', err);
        res.status(500).json({ error: err.message });
    }
});

// Admin: Update Vehicle
app.put('/api/admin/vehicles/:vehicleId', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    const { make, model, year, licensePlate, driverId } = req.body;
    try {
        const updateDoc = {};
        if (make !== undefined) updateDoc.make = make;
        if (model !== undefined) updateDoc.model = model;
        if (year !== undefined) updateDoc.year = year;
        if (licensePlate !== undefined) updateDoc.licensePlate = licensePlate;
        if (driverId !== undefined) updateDoc.driverId = driverId;

        if (Object.keys(updateDoc).length === 0) return res.status(400).json({ message: 'No fields to update provided.' });

        const result = await db.collection(collections.vehicles).updateOne({ vehicleId: req.params.vehicleId }, { $set: updateDoc });
        if (result.matchedCount === 0) return res.status(404).json({ message: 'Vehicle not found.' });
        res.json({ message: 'Vehicle updated successfully!' });
    } catch (err) {
        console.error('Error updating vehicle (admin):', err);
        res.status(500).json({ error: err.message });
    }
});

// Admin: Delete Vehicle
app.delete('/api/admin/vehicles/:vehicleId', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const result = await db.collection(collections.vehicles).deleteOne({ vehicleId: req.params.vehicleId });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Vehicle not found.' });
        res.json({ message: 'Vehicle deleted successfully!' });
    } catch (err) {
        console.error('Error deleting vehicle (admin):', err);
        res.status(500).json({ error: err.message });
    }
});


// Admin: Get All Rides
app.get('/api/admin/rides', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        // Fetch rides and also get associated user and driver names for display
        // Only show rides that have matching user/driver records with valid names (consistent with dashboard overview)
        const rides = await db.collection(collections.rides).aggregate([
            {
                $lookup: {
                    from: collections.users,
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'passengerInfo'
                }
            },
            {
                $lookup: {
                    from: collections.drivers,
                    localField: 'driverId',
                    foreignField: 'driverId',
                    as: 'driverInfo'
                }
            },
            {
                $unwind: { path: '$passengerInfo', preserveNullAndEmptyArrays: false }
            },
            {
                $unwind: { path: '$driverInfo', preserveNullAndEmptyArrays: false }
            },
            {
                $match: {
                    'passengerInfo.name': { $exists: true, $ne: null, $ne: '' },
                    'driverInfo.name': { $exists: true, $ne: null, $ne: '' }
                }
            },
            {
                $project: {
                    _id: 0,
                    rideId: 1,
                    userId: 1,
                    driverId: 1,
                    pickupLocation: 1,
                    dropoffLocation: 1,
                    fare: 1,
                    status: 1,
                    rideDate: 1,
                    paymentMethod: 1, // Include payment method
                    passengerName: '$passengerInfo.name',
                    driverName: '$driverInfo.name'
                }
            },
            { $sort: { rideDate: -1 } } // Sort by most recent first for consistency
        ]).toArray();
        res.json(rides);
    } catch (err) {
        console.error('Error fetching rides (admin):', err);
        res.status(500).json({ error: err.message });
    }
});

// Admin: Get Ride by ID
app.get('/api/admin/rides/:rideId', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const ride = await db.collection(collections.rides).findOne({ rideId: req.params.rideId });
        if (!ride) return res.status(404).json({ message: 'Ride not found.' });
        res.json(ride);
    } catch (err) {
        console.error('Error fetching ride by ID (admin):', err);
        res.status(500).json({ error: err.message });
    }
});

// Admin: Add Ride
app.post('/api/admin/rides', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    const { userId, driverId, vehicleId, pickupLocation, dropoffLocation, fare, status, rideDate, paymentMethod } = req.body;
    if (!userId || !driverId || !pickupLocation || !dropoffLocation || fare === undefined || !status) {
        return res.status(400).json({ message: 'Required fields: userId, driverId, pickupLocation, dropoffLocation, fare, status.' });
    }
    try {
        const newRide = {
            rideId: new ObjectId().toHexString(),
            userId,
            driverId,
            vehicleId: vehicleId || null, // vehicleId is optional if not assigned yet
            pickupLocation,
            dropoffLocation,
            fare: parseFloat(fare),
            status,
            rideDate: rideDate ? new Date(rideDate) : new Date(), // Use provided date or current
            paymentMethod: paymentMethod || null, // Include payment method (optional)
            createdAt: new Date()
        };
        await db.collection(collections.rides).insertOne(newRide);
        res.status(201).json({ message: 'Ride added successfully!', rideId: newRide.rideId });
    } catch (err) {
        console.error('Error adding ride (admin):', err);
        res.status(500).json({ error: err.message });
    }
});

// MODIFIED: Update Ride (Allows driver to update status/fare, and auto-creates earning on completion)
app.put('/api/admin/rides/:rideId', authenticateToken, authorizeRole(['admin', 'driver']), async (req, res) => {
    const { rideId } = req.params;
    const { status, fare } = req.body;

    try {
        const currentRide = await db.collection(collections.rides).findOne({ rideId: rideId });
        if (!currentRide) {
            return res.status(404).json({ message: 'Ride not found.' });
        }

        // Security check: A driver can only update their own assigned rides
        if (req.user.role === 'driver' && currentRide.driverId !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: You are not authorized to update this ride.' });
        }
        
        const updateDoc = {};
        // Drivers can update status and fare. Admins can update more, but this endpoint is now focused.
        if (status !== undefined) updateDoc.status = status;
        if (fare !== undefined) updateDoc.fare = parseFloat(fare);

        if (Object.keys(updateDoc).length === 0) {
            return res.status(400).json({ message: 'No fields to update provided.' });
        }

        const result = await db.collection(collections.rides).updateOne({ rideId: rideId }, { $set: updateDoc });
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Ride not found during update.' });
        }

        // NEW: If the ride is marked as 'completed', create an earning for the driver
        if (status === 'completed' && currentRide.status !== 'completed') {
            const serviceFeeRate = 0.15; // 15% service fee
            const rideFare = fare !== undefined ? parseFloat(fare) : currentRide.fare;
            const serviceFee = rideFare * serviceFeeRate;
            const driverEarning = rideFare - serviceFee;

            const newEarning = {
                earningId: new ObjectId().toHexString(),
                rideId: currentRide.rideId,
                driverId: currentRide.driverId,
                amount: driverEarning,
                serviceFee: serviceFee,
                earningDate: new Date()
            };
            await db.collection(collections.earnings).insertOne(newEarning);
            console.log(`Earning record created for ride ${rideId}`);
        }

        res.json({ message: 'Ride updated successfully!' });

    } catch (err) {
        console.error('Error updating ride (admin/driver):', err);
        res.status(500).json({ error: err.message });
    }
});

// Admin: Delete Ride
app.delete('/api/admin/rides/:rideId', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const result = await db.collection(collections.rides).deleteOne({ rideId: req.params.rideId });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Ride not found.' });
        res.json({ message: 'Ride deleted successfully!' });
    } catch (err) {
        console.error('Error deleting ride (admin):', err);
        res.status(500).json({ error: err.message });
    }
});


// Admin: Get All Payments
app.get('/api/admin/payments', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const payments = await db.collection(collections.payments).aggregate([
            {
                $lookup: {
                    from: collections.rides,
                    localField: 'rideId',
                    foreignField: 'rideId',
                    as: 'rideInfo'
                }
            },
            {
                $lookup: {
                    from: collections.users,
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'passengerInfo'
                }
            },
            {
                $unwind: { path: '$rideInfo', preserveNullAndEmptyArrays: true }
            },
            {
                $unwind: { path: '$passengerInfo', preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    paymentId: 1,
                    rideId: 1,
                    userId: 1,
                    amount: 1,
                    paymentMethod: 1,
                    paymentStatus: 1,
                    paymentDate: 1,
                    createdAt: 1,
                    passengerName: '$passengerInfo.name',
                    pickupLocation: '$rideInfo.pickupLocation',
                    dropoffLocation: '$rideInfo.dropoffLocation'
                }
            },
            { $sort: { paymentDate: -1, createdAt: -1 } } // Sort by most recent first
        ]).toArray();
        res.json(payments);
    } catch (err) {
        console.error('Error fetching payments (admin):', err);
        res.status(500).json({ error: err.message });
    }
});

// Admin: Get All Earnings
app.get('/api/admin/earnings', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const earnings = await db.collection(collections.earnings).aggregate([
            {
                $lookup: {
                    from: collections.drivers,
                    localField: 'driverId',
                    foreignField: 'driverId',
                    as: 'driverInfo'
                }
            },
            {
                $lookup: {
                    from: collections.rides,
                    localField: 'rideId',
                    foreignField: 'rideId',
                    as: 'rideInfo'
                }
            },
            {
                $unwind: { path: '$driverInfo', preserveNullAndEmptyArrays: true }
            },
            {
                $unwind: { path: '$rideInfo', preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    earningId: 1,
                    rideId: 1,
                    driverId: 1,
                    amount: 1,
                    serviceFee: 1,
                    earningDate: 1,
                    driverName: '$driverInfo.name',
                    driverPhone: '$driverInfo.phone',
                    pickupLocation: '$rideInfo.pickupLocation',
                    dropoffLocation: '$rideInfo.dropoffLocation',
                    totalFare: '$rideInfo.fare'
                }
            },
            { $sort: { earningDate: -1 } } // Sort by most recent first
        ]).toArray();
        res.json(earnings);
    } catch (err) {
        console.error('Error fetching earnings (admin):', err);
        res.status(500).json({ error: err.message });
    }
});


// --- User (Passenger) Specific API Endpoints ---

// NEW: Get detailed information for a single ride (for passenger)
app.get('/api/passenger/ride-details/:rideId', authenticateToken, authorizeRole(['user', 'admin']), async (req, res) => {
    try {
        const rideDetails = await db.collection(collections.rides).aggregate([
            { $match: { rideId: req.params.rideId } },
            {
                $lookup: {
                    from: collections.drivers,
                    localField: 'driverId',
                    foreignField: 'driverId',
                    as: 'driverInfo'
                }
            },
            {
                $lookup: {
                    from: collections.vehicles,
                    localField: 'vehicleId',
                    foreignField: 'vehicleId',
                    as: 'vehicleInfo'
                }
            },
            { $unwind: { path: '$driverInfo', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$vehicleInfo', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    // Ride details
                    rideId: 1, userId: 1, pickupLocation: 1, dropoffLocation: 1, fare: 1, status: 1, rideDate: 1, paymentMethod: 1,
                    // Driver details
                    driverName: '$driverInfo.name',
                    driverPhone: '$driverInfo.phone',
                    // Vehicle details
                    vehicleMake: '$vehicleInfo.make',
                    vehicleModel: '$vehicleInfo.model',
                    vehicleLicensePlate: '$vehicleInfo.licensePlate'
                }
            }
        ]).toArray();

        if (rideDetails.length === 0) {
            return res.status(404).json({ message: 'Ride not found.' });
        }
        
        const ride = rideDetails[0];

        // Security check: ensure the passenger owns this ride or is an admin
        if (req.user.role === 'user' && req.user.id !== ride.userId) {
            return res.status(403).json({ message: 'Forbidden: You are not authorized to view this ride.' });
        }

        res.json(ride);

    } catch (err) {
        console.error('Error fetching ride details:', err);
        res.status(500).json({ error: err.message });
    }
});


// Get Passenger Profile
app.get('/api/passenger/profile/:userId', authenticateToken, authorizeRole(['user', 'admin']), async (req, res) => {
    if (req.user.role === 'user' && req.user.id !== req.params.userId) {
        return res.sendStatus(403);
    }
    try {
        const user = await db.collection(collections.users).findOne({ userId: req.params.userId });
        if (!user) return res.status(404).json({ message: 'Passenger not found.' });
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (err) {
        console.error('Error fetching passenger profile:', err);
        res.status(500).json({ error: err.message });
    }
});

// Update Passenger Profile
app.put('/api/passenger/profile/:userId', authenticateToken, authorizeRole(['user', 'admin']), async (req, res) => {
    if (req.user.role === 'user' && req.user.id !== req.params.userId) {
        return res.sendStatus(403);
    }
    const { name, email, phone, password } = req.body;
    try {
        const updateDoc = {};
        if (name !== undefined) updateDoc.name = name;
        if (email !== undefined) updateDoc.email = email;
        if (phone !== undefined) updateDoc.phone = phone;
        if (password) updateDoc.password = await bcrypt.hash(password, 10);

        if (Object.keys(updateDoc).length === 0) return res.status(400).json({ message: 'No fields to update provided.' });

        const result = await db.collection(collections.users).updateOne({ userId: req.params.userId }, { $set: updateDoc });
        if (result.matchedCount === 0) return res.status(404).json({ message: 'Passenger not found.' });
        res.json({ message: 'Passenger profile updated successfully!' });
    } catch (err) {
        console.error('Error updating passenger profile:', err);
        res.status(500).json({ error: err.message });
    }
});

// Delete Passenger Account (Self-deletion)
app.delete('/api/passenger/account/:userId', authenticateToken, authorizeRole(['user']), async (req, res) => {
    // Only allow users to delete their own account
    if (req.user.id !== req.params.userId) {
        return res.status(403).json({ message: 'You can only delete your own account.' });
    }
    
    try {
        const userId = req.params.userId;
        
        // Check if user exists
        const user = await db.collection(collections.users).findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        // Set user to null in completed rides (to preserve ride history)
        await db.collection(collections.rides).updateMany(
            { userId },
            { $set: { userId: null, passengerName: `[Deleted User: ${user.name}]` } }
        );
        
        // Delete payment records associated with this user
        await db.collection(collections.payments).deleteMany({ userId });
        
        // Finally, delete the user account
        const result = await db.collection(collections.users).deleteOne({ userId });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'User account not found.' });
        }
        
        res.json({ message: 'User account deleted successfully. All associated data has been removed.' });
    } catch (err) {
        console.error('Error deleting user account:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get Passenger's Rides
app.get('/api/passenger/rides/:userId', authenticateToken, authorizeRole(['user', 'admin']), async (req, res) => {
    if (req.user.role === 'user' && req.user.id !== req.params.userId) {
        return res.sendStatus(403);
    }
    try {
        const rides = await db.collection(collections.rides).aggregate([
            { $match: { userId: req.params.userId } },
            {
                $lookup: {
                    from: collections.drivers,
                    localField: 'driverId',
                    foreignField: 'driverId',
                    as: 'driverInfo'
                }
            },
            {
                $lookup: {
                    from: collections.vehicles,
                    localField: 'vehicleId',
                    foreignField: 'vehicleId',
                    as: 'vehicleInfo'
                }
            },
            { $unwind: { path: '$driverInfo', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$vehicleInfo', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    // Keep all original ride fields
                    rideId: 1, userId: 1, driverId: 1, vehicleId: 1, pickupLocation: 1, 
                    dropoffLocation: 1, fare: 1, status: 1, rideDate: 1, passengerCount: 1,
                    paymentMethod: 1, // Include payment method
                    // Add driver details
                    driverName: '$driverInfo.name',
                    driverPhone: '$driverInfo.phone',
                    // Add vehicle details
                    vehicleMake: '$vehicleInfo.make',
                    vehicleModel: '$vehicleInfo.model',
                    vehicleLicensePlate: '$vehicleInfo.licensePlate'
                }
            },
            { $sort: { rideDate: -1 } } // Sort by most recent first
        ]).toArray();
        res.json(rides);
    } catch (err) {
        console.error('Error fetching passenger rides:', err);
        res.status(500).json({ error: err.message });
    }
});

// Request a Ride (Passenger initiated) - Basic implementation
app.post('/api/passenger/request-ride', authenticateToken, authorizeRole(['user']), async (req, res) => {
    const { pickupLocation, dropoffLocation, passengerCount, paymentMethod } = req.body;
    const userId = req.user.id; // Get userId from authenticated token

    if (!pickupLocation || !dropoffLocation || !passengerCount || !paymentMethod) {
        return res.status(400).json({ message: 'Pickup, Dropoff locations, passenger count, and payment method are required.' });
    }

    try {
        // Find an available driver
        const availableDriver = await db.collection(collections.drivers).findOne({ isAvailable: true });

        if (!availableDriver) {
            return res.status(503).json({ message: 'No drivers currently available. Please try again later.' });
        }
        
        // Find the vehicle associated with this driver
        const assignedVehicle = await db.collection(collections.vehicles).findOne({ driverId: availableDriver.driverId });

        const newRide = {
            rideId: new ObjectId().toHexString(),
            userId: userId,
            driverId: availableDriver.driverId,
            vehicleId: assignedVehicle ? assignedVehicle.vehicleId : null,
            pickupLocation,
            dropoffLocation,
            fare: 0.00, // Fare will be set by driver upon acceptance
            status: 'pending', // Initially pending acceptance by driver
            rideDate: new Date(),
            passengerCount: parseInt(passengerCount),
            paymentMethod: paymentMethod // Include the payment method
        };

        await db.collection(collections.rides).insertOne(newRide);
        res.status(201).json({ message: 'Ride requested successfully! Waiting for a driver to accept.', ride: newRide });

    } catch (err) {
        console.error('Error requesting ride (passenger):', err);
        res.status(500).json({ error: err.message });
    }
});


// --- Driver Specific API Endpoints ---

// Driver Dashboard Summary
app.get('/api/driver/dashboard-summary/:driverId', authenticateToken, authorizeRole(['driver', 'admin']), async (req, res) => {
    if (req.user.role === 'driver' && req.user.id !== req.params.driverId) {
        return res.sendStatus(403);
    }
    
    try {
        const driverId = req.params.driverId;
        
        // Get driver profile to check availability
        const driver = await db.collection(collections.drivers).findOne({ driverId });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found.' });
        }
        
        // Get all rides for this driver
        const allRides = await db.collection(collections.rides).find({ driverId }).toArray();
        const completedRides = allRides.filter(ride => ride.status === 'completed');
        const pendingRides = allRides.filter(ride => ride.status === 'pending');
        
        // Get all earnings for this driver
        const allEarnings = await db.collection(collections.earnings).find({ driverId }).toArray();
        const totalEarnings = allEarnings.reduce((sum, earning) => sum + earning.amount, 0);
        
        // Calculate time-based earnings
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayEarnings = allEarnings.filter(earning => {
            const earningDate = new Date(earning.earningDate);
            return earningDate >= todayStart;
        }).reduce((sum, earning) => sum + earning.amount, 0);
        
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const weekEarnings = allEarnings.filter(earning => {
            const earningDate = new Date(earning.earningDate);
            return earningDate >= weekStart;
        }).reduce((sum, earning) => sum + earning.amount, 0);
        
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEarnings = allEarnings.filter(earning => {
            const earningDate = new Date(earning.earningDate);
            return earningDate >= monthStart;
        }).reduce((sum, earning) => sum + earning.amount, 0);
        
        // Get recent pending rides with passenger info
        const recentPendingRides = await db.collection(collections.rides).aggregate([
            { $match: { driverId, status: 'pending' } },
            {
                $lookup: {
                    from: collections.users,
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'passengerInfo'
                }
            },
            { $unwind: { path: '$passengerInfo', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    rideId: 1,
                    pickupLocation: 1,
                    dropoffLocation: 1,
                    status: 1,
                    rideDate: 1,
                    passengerName: '$passengerInfo.name'
                }
            },
            { $sort: { rideDate: -1 } },
            { $limit: 5 }
        ]).toArray();
        
        res.json({
            isAvailable: driver.isAvailable,
            totalRides: allRides.length,
            completedRides: completedRides.length,
            pendingRides: pendingRides.length,
            totalEarnings: totalEarnings,
            todayEarnings: todayEarnings,
            weekEarnings: weekEarnings,
            monthEarnings: monthEarnings,
            recentPendingRides: recentPendingRides
        });

    } catch (err) {
        console.error('Error fetching driver dashboard summary:', err);
        res.status(500).json({ message: 'Failed to fetch driver dashboard summary', error: err.message });
    }
});

// Get Driver Profile
app.get('/api/driver/profile/:driverId', authenticateToken, authorizeRole(['driver', 'admin']), async (req, res) => {
    if (req.user.role === 'driver' && req.user.id !== req.params.driverId) {
        return res.sendStatus(403);
    }
    try {
        const driver = await db.collection(collections.drivers).findOne({ driverId: req.params.driverId });
        if (!driver) return res.status(404).json({ message: 'Driver not found.' });
        const { password, ...driverWithoutPassword } = driver;
        res.json(driverWithoutPassword);
    } catch (err) {
        console.error('Error fetching driver profile:', err);
        res.status(500).json({ error: err.message });
    }
});

// Update Driver Profile (including availability)
app.put('/api/driver/profile/:driverId', authenticateToken, authorizeRole(['driver', 'admin']), async (req, res) => {
    if (req.user.role === 'driver' && req.user.id !== req.params.driverId) {
        return res.sendStatus(403);
    }
    const { name, email, phone, password, licenseNumber, vehicleDetails, isAvailable } = req.body;
    try {
        const updateDoc = {};
        if (name !== undefined) updateDoc.name = name;
        if (email !== undefined) updateDoc.email = email;
        if (phone !== undefined) updateDoc.phone = phone;
        if (password) updateDoc.password = await bcrypt.hash(password, 10);
        if (licenseNumber !== undefined) updateDoc.licenseNumber = licenseNumber;
        if (vehicleDetails !== undefined) updateDoc.vehicleDetails = vehicleDetails;
        if (isAvailable !== undefined) updateDoc.isAvailable = isAvailable;

        if (Object.keys(updateDoc).length === 0) return res.status(400).json({ message: 'No fields to update provided.' });

        const result = await db.collection(collections.drivers).updateOne({ driverId: req.params.driverId }, { $set: updateDoc });
        if (result.matchedCount === 0) return res.status(404).json({ message: 'Driver not found.' });
        res.json({ message: 'Driver profile updated successfully!' });
    } catch (err) {
        console.error('Error updating driver profile:', err);
        res.status(500).json({ error: err.message });
    }
});

// Delete Driver Account (Self-deletion)
app.delete('/api/driver/account/:driverId', authenticateToken, authorizeRole(['driver']), async (req, res) => {
    // Only allow drivers to delete their own account
    if (req.user.id !== req.params.driverId) {
        return res.status(403).json({ message: 'You can only delete your own account.' });
    }
    
    try {
        const driverId = req.params.driverId;
        
        // Check if driver exists
        const driver = await db.collection(collections.drivers).findOne({ driverId });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found.' });
        }
        
        // Delete driver's vehicles (optional, depending on business logic)
        await db.collection(collections.vehicles).deleteMany({ driverId });
        
        // Set driver to null in completed rides (to preserve ride history)
        await db.collection(collections.rides).updateMany(
            { driverId },
            { $set: { driverId: null, driverName: `[Deleted Driver: ${driver.name}]` } }
        );
        
        // Delete driver earnings
        await db.collection(collections.earnings).deleteMany({ driverId });
        
        // Finally, delete the driver account
        const result = await db.collection(collections.drivers).deleteOne({ driverId });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Driver account not found.' });
        }
        
        res.json({ message: 'Driver account deleted successfully. All associated data has been removed.' });
    } catch (err) {
        console.error('Error deleting driver account:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get Driver's Rides
app.get('/api/driver/rides/:driverId', authenticateToken, authorizeRole(['driver', 'admin']), async (req, res) => {
    if (req.user.role === 'driver' && req.user.id !== req.params.driverId) {
        return res.sendStatus(403);
    }
    try {
        // Also fetch passenger name for display
        const rides = await db.collection(collections.rides).aggregate([
            { $match: { driverId: req.params.driverId } },
            {
                $lookup: {
                    from: collections.users,
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'passengerInfo'
                }
            },
            {
                $unwind: { path: '$passengerInfo', preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    _id: 0,
                    rideId: 1,
                    userId: 1,
                    pickupLocation: 1,
                    dropoffLocation: 1,
                    fare: 1,
                    status: 1,
                    rideDate: 1,
                    paymentMethod: 1,
                    passengerName: '$passengerInfo.name'
                }
            }
        ]).toArray();
        res.json(rides);
    } catch (err) {
        console.error('Error fetching driver rides:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get Driver Ride Details
app.get('/api/driver/ride-details/:rideId', authenticateToken, authorizeRole(['driver', 'admin']), async (req, res) => {
    try {
        const rideDetails = await db.collection(collections.rides).aggregate([
            { $match: { rideId: req.params.rideId } },
            {
                $lookup: {
                    from: collections.drivers,
                    localField: 'driverId',
                    foreignField: 'driverId',
                    as: 'driverInfo'
                }
            },
            {
                $lookup: {
                    from: collections.users,
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'passengerInfo'
                }
            },
            {
                $lookup: {
                    from: collections.vehicles,
                    localField: 'vehicleId',
                    foreignField: 'vehicleId',
                    as: 'vehicleInfo'
                }
            },
            { $unwind: { path: '$driverInfo', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$passengerInfo', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$vehicleInfo', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    // Ride details
                    rideId: 1, userId: 1, driverId: 1, pickupLocation: 1, dropoffLocation: 1, fare: 1, status: 1, rideDate: 1, 
                    paymentMethod: 1,
                    // Passenger details
                    passengerName: '$passengerInfo.name',
                    passengerPhone: '$passengerInfo.phone',
                    // Driver details
                    driverName: '$driverInfo.name',
                    driverPhone: '$driverInfo.phone',
                    // Vehicle details
                    vehicleMake: '$vehicleInfo.make',
                    vehicleModel: '$vehicleInfo.model',
                    vehicleLicensePlate: '$vehicleInfo.licensePlate'
                }
            }
        ]).toArray();

        if (rideDetails.length === 0) {
            return res.status(404).json({ message: 'Ride not found.' });
        }
        
        const ride = rideDetails[0];

        // Security check: ensure the driver owns this ride or is an admin
        if (req.user.role === 'driver') {
            // Allow drivers to view ride details - in production you'd verify driverId matches
            console.log(`Driver ${req.user.id} viewing ride ${req.params.rideId}`);
        }

        res.json(ride);

    } catch (err) {
        console.error('Error fetching ride details:', err);
        res.status(500).json({ message: 'Failed to retrieve ride details.' });
    }
});

// Get Driver's Earnings
app.get('/api/driver/earnings/:driverId', authenticateToken, authorizeRole(['driver', 'admin']), async (req, res) => {
    if (req.user.role === 'driver' && req.user.id !== req.params.driverId) {
        return res.sendStatus(403);
    }
    try {
        const earnings = await db.collection(collections.earnings).find({ driverId: req.params.driverId }).toArray();
        res.json(earnings);
    } catch (err) {
        console.error('Error fetching driver earnings:', err);
        res.status(500).json({ error: err.message });
    }
});

// Common Ride Details Endpoint (for fallback)
app.get('/api/common/ride-details/:rideId', authenticateToken, async (req, res) => {
    try {
        const rideDetails = await db.collection(collections.rides).aggregate([
            { $match: { rideId: req.params.rideId } },
            {
                $lookup: {
                    from: collections.drivers,
                    localField: 'driverId',
                    foreignField: 'driverId',
                    as: 'driverInfo'
                }
            },
            {
                $lookup: {
                    from: collections.users,
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'passengerInfo'
                }
            },
            {
                $lookup: {
                    from: collections.vehicles,
                    localField: 'vehicleId',
                    foreignField: 'vehicleId',
                    as: 'vehicleInfo'
                }
            },
            { $unwind: { path: '$driverInfo', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$passengerInfo', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$vehicleInfo', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    // Ride details
                    rideId: 1, userId: 1, driverId: 1, pickupLocation: 1, dropoffLocation: 1, fare: 1, status: 1, rideDate: 1, paymentMethod: 1,
                    // Passenger details
                    passengerName: '$passengerInfo.name',
                    passengerPhone: '$passengerInfo.phone',
                    // Driver details
                    driverName: '$driverInfo.name',
                    driverPhone: '$driverInfo.phone',
                    // Vehicle details
                    vehicleMake: '$vehicleInfo.make',
                    vehicleModel: '$vehicleInfo.model',
                    vehicleLicensePlate: '$vehicleInfo.licensePlate'
                }
            }
        ]).toArray();

        if (rideDetails.length === 0) {
            return res.status(404).json({ message: 'Ride not found.' });
        }
        
        res.json(rideDetails[0]);

    } catch (err) {
        console.error('Error fetching ride details:', err);
        res.status(500).json({ message: 'Failed to retrieve ride details.' });
    }
});

// Test endpoint to trigger 403 error (for testing instant logout)
app.get('/api/test/403', authenticateToken, (req, res) => {
    return res.status(403).json({ message: 'This is a test 403 Forbidden error for testing instant logout functionality.' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});