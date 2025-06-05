const { MongoClient, ObjectId } = require('mongodb');

const users = [
    {
        name: "Alice",
        email: "Alice@gmail.com",
        password: "A123",
        phone_number: "0123456789",
        status: "completed"
    },
    {
        name: "Bob",
        email: "Bob@gmail.com",
        password: "Bob123",
        phone_number: "0123456798",
        status: "completed"
    }
];

const rides = [
    {
        _id: "683e6d115b37b9cc1da14a3e",
        passenger: "Alice",
        driver: "John",
        fare: 23.5,
        distanceKm: 12.4,
        status: "completed",
        pickupTime: "2024-05-10T08:15:00.000Z",
        rating: 5
    },
    {
        _id: "683e6d115b37b9cc1da14a89",
        passenger: "Alice",
        driver: "Mark",
        fare: 14.3,
        distanceKm: 8.3,
        status: "completed",
        pickupTime: "2024-06-10T08:15:00.000Z",
        rating: 5
    },
    {
        _id: "683e6d115b37b9cc1da14a3f",
        passenger: "Bob",
        driver: "Maria",
        fare: 18.75,
        distanceKm: 9.8,
        status: "completed",
        pickupTime: "2024-05-11T14:20:00.000Z",
        rating: null
    },
    {
        _id: "688e6d115b37b9cc1da14a40",
        passenger: "Charlie",
        driver: "John",
        fare: 45,
        distanceKm: 25.3,
        status: "completed",
        pickupTime: "2024-05-12T17:45:00.000Z",
        rating: 4
    },
    {
        _id: "683e6d115b37b9cc1da14a41",
        passenger: "Dina",
        driver: "Lucy",
        fare: 32,
        distanceKm: 18.9,
        status: "completed",
        pickupTime: "2024-05-13T09:30:00.000Z",
        rating: 5
    }
];

async function main() {
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("testDB");

        const usersCollection = db.collection("users");
        const ridesCollection = db.collection("rides");

        // Insert users
        for (const user of users) {
            const result = await usersCollection.insertOne(user);
            console.log(`New user created with ID: ${result.insertedId}`);
        };

        // Insert rides with proper data conversion
        for (const ride of rides) {
            // Convert to MongoDB ObjectId
            const rideData = {
                ...ride,
                _id: new ObjectId(ride._id),
                pickupTime: new Date(ride.pickupTime)
            };
            const result = await ridesCollection.insertOne(rideData);
            console.log(`New ride created with ID: ${result.insertedId}`);
        };
        
    } catch (err) {
        console.error("Error during database operations:", err);
    } finally {
        await client.close();
    }
}

main();