const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

const mongoUri = 'mongodb://localhost:27017';
const dbName = 'testDB';

app.use(express.json());

// ✅ Updated endpoint to match lab requirements
app.get('/analytics/passengers', async (req, res) => {
  let client;

  try {
    client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    const pipeline = [
      {
        "$match": {
          "name": { "$in": ["Alice", "Bob"] }
        }
      },
      {
        "$lookup": {
          "from": "rides",
          "localField": "name",
          "foreignField": "passenger",
          "as": "userRides"
        }
      },
      {
        "$unwind": {
          "path": "$userRides",
          "preserveNullAndEmptyArrays": true
        }
      },
      {
        "$group": {
          "_id": "$_id",
          "name": { "$first": "$name" },
          "totalRides": {
            "$sum": {
              "$cond": [
                { "$ifNull": ["$userRides", false] },
                1,
                0
              ]
            }
          },
          "totalFare": { "$sum": "$userRides.fare" },
          "totalDistance": { "$sum": "$userRides.distanceKm" }
        }
      },
      {
        "$project": {
          "_id": 0,
          "name": 1,
          "totalRides": 1,
          "totalFare": { "$round": ["$totalFare", 2] },
          "avgDistance": {
            "$round": [
              {
                "$cond": [
                  { "$eq": ["$totalRides", 0] },
                  null,
                  { "$divide": ["$totalDistance", "$totalRides"] }
                ]
              },
              2
            ]
          }
        }
      }
    ];

    const result = await usersCollection.aggregate(pipeline).toArray();

    res.status(200).json({
      success: true,
      data: result,
      count: result.length
    });

  } catch (error) {
    console.error('Error in passenger analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Passenger analytics endpoint: http://localhost:${port}/analytics/passengers`); // ✅ Updated log
});