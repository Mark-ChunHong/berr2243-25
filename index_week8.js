require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Only require once
const saltRounds = 10;

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
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
});

app.post('/users', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const user = { ...req.body, password: hashedPassword, role: 'admin' };
    const result = await db.collection('users').insertOne(user);
    console.log('Created user with ID:', result.insertedId);
    res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ error: "Registration failed" });
  }
});

app.post('/auth/login', async (req, res) => {   
    const user = await db.collection('users').findOne({ email: req.body.email
   });   
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {   
      return res.status(401).json({ error: "Invalid credentials" });   
    }   
    const token = jwt.sign(   
      { userId: user._id, role: user.role },   
      process.env.JWT_SECRET,   
      { expiresIn: process.env.JWT_EXPIRES_IN }   
    );   
    res.status(200).json({ token }); // Return token to client   
  });  

  const authenticate = (req, res, next) => {   
  console.log('\nReceived headers:', req.headers); // Debug all headers
  
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('No authorization header found');
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(' ')[1];
  console.log('Extracted token:', token); // Debug token extraction
  
  if (!token) {
    console.log('Bearer token missing');
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);   
    console.log('Decoded token:', decoded); // Debug decoded content
    req.user = decoded;  
    next();   
  } catch (err) {   
    console.log('Token verification failed:', err.message);
    res.status(401).json({ 
      error: "Invalid token",
      details: err.message // Include specific error
      });   
    }   
  };

  const authorize = (roles) => (req, res, next) => {   
    if (!roles.includes(req.user.role))  
       return res.status(403).json({ error: "Forbidden" });   
    next();   
  };   

app.get('/admin/users', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const users = await db.collection('users').find({}).toArray();
    
    // For security, remove passwords from the response
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.status(200).json(usersWithoutPasswords);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.delete('/admin/users/:id', authenticate, authorize(['admin']), async (req, res) => {
  console.log("admin only");
  res.status(200).send("admin access");
});