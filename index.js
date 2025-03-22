const { MongoClient }= require('mongodb');

async function main() {
    // Replace <connection-string> with your MongoDB URIconst uri ="mongodb://localhost:27017"const client = new Mongoclient(uri);
    const uri = "mongodb://localhost:27017"
    const client = new MongoClient(uri);

    try {
        await client.connect();
    console.log("connected to MongoDB!");

    const db = client.db("testDB");
    const collection = db.collection("users");
    
    // Insert a document
    await collection.insertOne({ name:"Yun",age: 21 });
    console.log("Document inserted!");

    // Query the document
    const result= await collection.findOne({ name:"Yun" });
    console.log("Query result:", result);
    } catch(err) {
    console.error("Error:", err);
    } finally {
        await client.close();
    }
}


main();