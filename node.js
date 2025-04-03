const { MongoClient }= require('mongodb');

//update an array of drivers
const drivers = [
    {
        name: "John Doe",
        vehicleType: "Sedan",
        isAvailable: true,
        rating: 4.8
    },
    {
        name: "John Doe",
        vehicleType: "SUV",
        isAvailable: false,
        rating: 4.5
    }
];

//show the data in the console
console.log(drivers);

// add additional driver to the drivers array
const count = drivers.push(
    {        
    name: "Smith",
    vehicleType: "Proton",
    isAvailable: true,
    rating: 4.0
    },
    {
    name: "Mark",
    vehicleType: "Sedan",
    isAvailable: true,
    rating: 4.6
    }
);

async function main() {
// Replace <connection-string> with your MongoDB URIconst uri ="mongodb://localhost:27017"const client = new Mongoclient(uri);
    const uri = "mongodb://localhost:27017"
    const client = new MongoClient(uri);

    try {
    await client.connect();
    const db = client.db("testDB");

    const driversCollection = db.collection("drivers");

    for (const driver of drivers){
        const result = await driversCollection.insertOne(driver);
        console.log(`New driver created with result: ${result.insertedId}`);
    };

    const availableDrivers = await db.collection('drivers').find({
        isAvailable: true,
        rating: { $gte: 4.5}
    }).toArray();
    console.log("\nAvailable drivers:", availableDrivers)

    const updateResult = await db.collection('drivers').updateMany(
        { name: "John Doe" },
        { $inc: { rating: 0.1 } }
    );
    
    console.log(`Driver updated with result: ${updateResult}`);

    const deleteResult = await db.collection('drivers').deleteMany({ isAvailable: true });
    console.log(`Driver deleted with result: ${JSON.stringify(deleteResult)}`);
    
    } finally {
        await client.close();
    }

  
    
}

main();
