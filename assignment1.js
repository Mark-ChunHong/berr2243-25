const { MongoClient, ObjectId } = require('mongodb');

// Sample data for all collections (5 documents each)
const users = [
    {
        userId: "USR1001",                   
        name: "Lim Wei Jie",                  
        email: "limweijie@student.utem.edu.my", 
        password: "Lim@2023",                 
        phone: "+60123456789",                
        deleteAccount: false,                 
        registrationDate: new Date("2023-01-15T09:30:00Z") 
    },
    {
        userId: "USR1002",
        name: "Nurul Aisyah",
        email: "nurul@student.utem.edu.my",
        password: "Nurul@123",
        phone: "+60198765432",
        deleteAccount: false,
        registrationDate: new Date("2023-02-20T14:15:00Z")
    },
    {
        userId: "USR1003",
        name: "Rajvinder Singh",
        email: "raj@student.utem.edu.my",
        password: "Raj@2023",
        phone: "+60168889900",
        deleteAccount: false,
        registrationDate: new Date("2023-03-05T11:45:00Z")
    },
    {
        userId: "USR1004",
        name: "Tan Mei Ling",
        email: "tan@student.utem.edu.my",
        password: "MeiLing@1",
        phone: "+60127778899",
        deleteAccount: false,
        registrationDate: new Date("2023-04-10T16:20:00Z")
    },
    {
        userId: "USR1005",
        name: "Ahmad Firdaus",
        email: "ahmad@student.utem.edu.my",
        password: "Ahmad@123",
        phone: "+60139998877",
        deleteAccount: false,
        registrationDate: new Date("2023-05-12T10:00:00Z")
    }
];

const rides = [
    {
        rideId: "RDE2001",                    
        userId: "USR1001",                    
        driverId: "DRV5001",                  
        pickUp: "UTeM Main Gate",             
        destination: "Melaka Mall",           
        status: "completed",                  
        startTime: new Date("2023-06-01T08:00:00Z"), 
        endTime: new Date("2023-06-01T08:25:00Z"),   
        distanceKm: 8.5,                      
        totalFare: 15.50                      
    },
    {
        rideId: "RDE2002",
        userId: "USR1002",
        driverId: "DRV5002",
        pickUp: "Faculty of Engineering",
        destination: "MITC",
        status: "completed",
        startTime: new Date("2023-06-02T14:15:00Z"),
        endTime: new Date("2023-06-02T14:35:00Z"),
        distanceKm: 6.2,
        totalFare: 12.00
    },
    {
        rideId: "RDE2003",
        userId: "USR1003",
        driverId: "DRV5003",
        pickUp: "UTeM Library",
        destination: "Ayer Keroh Bus Terminal",
        status: "completed",
        startTime: new Date("2023-06-03T18:30:00Z"),
        endTime: new Date("2023-06-03T19:00:00Z"),
        distanceKm: 6.5,
        totalFare: 20.00
    },
    {
        rideId: "RDE2004",
        userId: "USR1004",
        driverId: "DRV5001",
        pickUp: "Student Residence",
        destination: "Jonker Street",
        status: "completed",
        startTime: new Date("2023-06-04T09:05:00Z"),
        endTime: new Date("2023-06-04T09:40:00Z"),
        distanceKm: 9.0,
        totalFare: 18.75
    },
    {
        rideId: "RDE2005",
        userId: "USR1005",
        driverId: "DRV5004",
        pickUp: "Sports Complex",
        destination: "Mahkota Medical Center",
        status: "completed",
        startTime: new Date("2023-06-05T16:00:00Z"),
        endTime: new Date("2023-06-05T16:30:00Z"),
        distanceKm: 8.8,
        totalFare: 10.50
    }
];

const payments = [
    {
        paymentId: "PAY3001",                 
        rideId: "RDE2001",                    
        amount: 15.50,                        
        paymentMethod: "Touch 'n Go eWallet", 
        status: "Completed",                  
        transactionDate: new Date("2023-06-01T08:15:00Z") 
    },
    {
        paymentId: "PAY3002",
        rideId: "RDE2002",
        amount: 12.00,
        paymentMethod: "GrabPay",
        status: "Completed",
        transactionDate: new Date("2023-06-02T14:30:00Z")
    },
    {
        paymentId: "PAY3003",
        rideId: "RDE2003",
        amount: 20.00,
        paymentMethod: "Cash",
        status: "Completed",
        transactionDate: new Date("2023-06-03T18:45:00Z")
    },
    {
        paymentId: "PAY3004",
        rideId: "RDE2004",
        amount: 18.75,
        paymentMethod: "Credit Card",
        status: "Completed",
        transactionDate: new Date("2023-06-04T09:20:00Z")
    },
    {
        paymentId: "PAY3005",
        rideId: "RDE2005",
        amount: 10.50,
        paymentMethod: "Boost",
        status: "Completed",
        transactionDate: new Date("2023-06-05T16:10:00Z")
    }
];

const drivers = [
    {
        driverId: "DRV5001",                  
        driverName: "Ahmad bin Abdullah",     
        password: "Ahmad@123",                
        licenseInfo: "DL12345678",            
        vehicleId: "VHL6001",                 
        availability: true,                   
        rating: 4.8                           
    },
    {
        driverId: "DRV5002",
        driverName: "Siti Nurhaliza",
        password: "Siti@2023",
        licenseInfo: "DL87654321",
        vehicleId: "VHL6002",
        availability: false,
        rating: 4.5
    },
    {
        driverId: "DRV5003",
        driverName: "Rajesh Kumar",
        password: "Raj@2023",
        licenseInfo: "DL11223344",
        vehicleId: "VHL6003",
        availability: true,
        rating: 4.9
    },
    {
        driverId: "DRV5004",
        driverName: "Tan Mei Ling",
        password: "MeiLing@1",
        licenseInfo: "DL55667788",
        vehicleId: "VHL6004",
        availability: true,
        rating: 4.7
    },
    {
        driverId: "DRV5005",
        driverName: "Mohd Faisal",
        password: "Faisal@22",
        licenseInfo: "DL99887766",
        vehicleId: "VHL6005",
        availability: false,
        rating: 4.6
    }
];

const vehicles = [
    {
        vehicleId: "VHL6001",                 
        colour: "Red",                        
        plateNumber: "JKL 1234",              
        type: "Proton Saga"                   
    },
    {
        vehicleId: "VHL6002",
        colour: "Blue",
        plateNumber: "MEL 5678",
        type: "Perodua Myvi"
    },
    {
        vehicleId: "VHL6003",
        colour: "Silver",
        plateNumber: "PNJ 9012",
        type: "Honda City"
    },
    {
        vehicleId: "VHL6004",
        colour: "Black",
        plateNumber: "KUL 3456",
        type: "Toyota Vios"
    },
    {
        vehicleId: "VHL6005",
        colour: "White",
        plateNumber: "NSN 7890",
        type: "Proton X70"
    }
];

const earnings = [
    {
        earningId: "ERN4001",                
        driverId: "DRV5001",                 
        paymentId: "PAY3001",                
        totalEarn: 150.50,                   
        thisRideEarning: 12.40,              
        serviceFee: 3.10                      
    },
    {
        earningId: "ERN4002",
        driverId: "DRV5002",
        paymentId: "PAY3002",
        totalEarn: 220.00,
        thisRideEarning: 9.60,
        serviceFee: 2.40
    },
    {
        earningId: "ERN4003",
        driverId: "DRV5003",
        paymentId: "PAY3003",
        totalEarn: 95.25,
        thisRideEarning: 16.00,
        serviceFee: 4.00
    },
    {
        earningId: "ERN4004",
        driverId: "DRV5001",
        paymentId: "PAY3004",
        totalEarn: 180.75,
        thisRideEarning: 15.00,
        serviceFee: 3.75
    },
    {
        earningId: "ERN4005",
        driverId: "DRV5004",
        paymentId: "PAY3005",
        totalEarn: 310.00,
        thisRideEarning: 0.00,
        serviceFee: 0.00
    }
];

const admin = [
    {
        username: "admin",
        adminId: "ADM001",                    
        password: "Admin@123",                
        userIds: ["USR1001", "USR1002", "USR1003", "USR1004", "USR1005"], 
        rideIds: ["RDE2001", "RDE2002", "RDE2003", "RDE2004", "RDE2005"], 
        lastLogin: new Date()                 
    }
];
async function main() {
    const uri = "mongodb+srv://Database_Ass:Database_Ass2025@cluster0.i63ss4u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("Assignment");


        // Initialize all collections
        const usersCollection = db.collection("users");
        const ridesCollection = db.collection("rides");
        const paymentsCollection = db.collection("payments");
        const earningsCollection = db.collection("earning");
        const driversCollection = db.collection("drivers");
        const vehiclesCollection = db.collection("vehicles");
        const adminCollection = db.collection("admin");

        // Insert users
        for (const user of users) {
            const result = await usersCollection.insertOne(user);
            console.log(`New user created with ID: ${result.insertedId}`);
        };

        // Insert drivers
        for (const driver of drivers) {
            const result = await driversCollection.insertOne(driver);
            console.log(`New driver created with ID: ${result.insertedId}`);
        };

        // Insert vehicles
        for (const vehicle of vehicles) {
            const result = await vehiclesCollection.insertOne(vehicle);
            console.log(`New vehicle created with ID: ${result.insertedId}`);
        };

        // Insert rides
        for (const ride of rides) {
            const rideData = {
                ...ride,
                Start_Time: new Date(ride.Start_Time),
                End_Time: new Date(ride.End_Time)
            };
            const result = await ridesCollection.insertOne(rideData);
            console.log(`New ride created with ID: ${result.insertedId}`);
        };

        // Insert payments
        for (const payment of payments) {
            const paymentData = {
                ...payment,
                Transaction_Date: new Date(payment.Transaction_Date)
            };
            const result = await paymentsCollection.insertOne(paymentData);
            console.log(`New payment created with ID: ${result.insertedId}`);
        };

        // Insert earnings
        for (const earning of earnings) {
            const result = await earningsCollection.insertOne(earning);
            console.log(`New earning record created with ID: ${result.insertedId}`);
        };

        // Insert admin
        for (const adminDoc of admin) {
            const result = await adminCollection.insertOne(adminDoc);
            console.log(`Admin record created with ID: ${result.insertedId}`);
        };
        
    } catch (err) {
        console.error("Error during database operations:", err);
    } finally {
        await client.close();
    }
}

main();