const { MongoClient, ObjectId } = require('mongodb');

// Sample data for all collections (5 documents each)
const users = [
    {
        User_ID: "USR1001",
        Name: "Lim Wei Jie",
        Email: "limweijie@student.utem.edu.my",
        Password: "Lim@2023",
        Phone: "+60123456789",
        Delete_Account: false,
        Registration_Date: new Date("2023-01-15T09:30:00Z")
    },
    {
        User_ID: "USR1002",
        Name: "Nurul Aisyah",
        Email: "nurul@student.utem.edu.my",
        Password: "Nurul@123",
        Phone: "+60198765432",
        Delete_Account: false,
        Registration_Date: new Date("2023-02-20T14:15:00Z")
    },
    {
        User_ID: "USR1003",
        Name: "Rajvinder Singh",
        Email: "raj@student.utem.edu.my",
        Password: "Raj@2023",
        Phone: "+60168889900",
        Delete_Account: false,
        Registration_Date: new Date("2023-03-05T11:45:00Z")
    },
    {
        User_ID: "USR1004",
        Name: "Tan Mei Ling",
        Email: "tan@student.utem.edu.my",
        Password: "MeiLing@1",
        Phone: "+60127778899",
        Delete_Account: false,
        Registration_Date: new Date("2023-04-10T16:20:00Z")
    },
    {
        User_ID: "USR1005",
        Name: "Ahmad Firdaus",
        Email: "ahmad@student.utem.edu.my",
        Password: "Ahmad@123",
        Phone: "+60139998877",
        Delete_Account: false,
        Registration_Date: new Date("2023-05-12T10:00:00Z")
    }
];

const rides = [
    {
        Rides_ID: "RDE2001",
        User_ID: "USR1001",
        Driver_ID: "DRV5001",
        Pick_up: "UTeM Main Gate",
        Destination: "Melaka Mall",
        Status: "completed",
        Start_Time: "2023-06-01T08:00:00Z",
        End_Time: "2023-06-01T08:25:00Z",
        Distance_KM: 8.5,
        Total_Fare: 15.50
    },
    {
        Rides_ID: "RDE2002",
        User_ID: "USR1002",
        Driver_ID: "DRV5002",
        Pick_up: "Faculty of Engineering",
        Destination: "MITC",
        Status: "completed",
        Start_Time: "2023-06-02T14:15:00Z",
        End_Time: "2023-06-02T14:35:00Z",
        Distance_KM: 6.2,
        Total_Fare: 12.00
    },
    {
        Rides_ID: "RDE2003",
        User_ID: "USR1003",
        Driver_ID: "DRV5003",
        Pick_up: "UTeM Library",
        Destination: "Ayer Keroh Bus Terminal",
        Status: "completed",
        Start_Time: "2023-06-03T18:30:00Z",
        End_Time: "2023-06-03T19:00:00Z",
        Distance_KM: 6.5,
        Total_Fare: 20.00
    },
    {
        Rides_ID: "RDE2004",
        User_ID: "USR1004",
        Driver_ID: "DRV5001",
        Pick_up: "Student Residence",
        Destination: "Jonker Street",
        Status: "completed",
        Start_Time: "2023-06-04T09:05:00Z",
        End_Time: "2023-06-04T09:40:00Z",
        Distance_KM: 9.0,
        Total_Fare: 18.75
    },
    {
        Rides_ID: "RDE2005",
        User_ID: "USR1005",
        Driver_ID: "DRV5004",
        Pick_up: "Sports Complex",
        Destination: "Mahkota Medical Center",
        Status: "completed",
        Start_Time: "2023-06-05T16:00:00Z",
        End_Time: "2023-06-05T16:30:00Z",
        Distance_KM: 8.8,
        Total_Fare: 10.50
    }
];

const payments = [
    {
        Payments_ID: "PAY3001",
        Rides_ID: "RDE2001",
        Amount: 15.50,
        Payment_method: "Touch 'n Go eWallet",
        Status: "Completed",
        Transaction_Date: "2023-06-01T08:15:00Z"
    },
    {
        Payments_ID: "PAY3002",
        Rides_ID: "RDE2002",
        Amount: 12.00,
        Payment_method: "GrabPay",
        Status: "Completed",
        Transaction_Date: "2023-06-02T14:30:00Z"
    },
    {
        Payments_ID: "PAY3003",
        Rides_ID: "RDE2003",
        Amount: 20.00,
        Payment_method: "Cash",
        Status: "Completed",
        Transaction_Date: "2023-06-03T18:45:00Z"
    },
    {
        Payments_ID: "PAY3004",
        Rides_ID: "RDE2004",
        Amount: 18.75,
        Payment_method: "Credit Card",
        Status: "Completed",
        Transaction_Date: "2023-06-04T09:20:00Z"
    },
    {
        Payments_ID: "PAY3005",
        Rides_ID: "RDE2005",
        Amount: 10.50,
        Payment_method: "Boost",
        Status: "Completed",
        Transaction_Date: "2023-06-05T16:10:00Z"
    }
];

const drivers = [
    {
        Driver_ID: "DRV5001",
        Driver_Name: "Ahmad bin Abdullah",
        Password: "Ahmad@123",
        License_info: "DL12345678",
        Vehicle_ID: "VHL6001",
        availability: true,
        Rating: 4.8
    },
    {
        Driver_ID: "DRV5002",
        Driver_Name: "Siti Nurhaliza",
        Password: "Siti@2023",
        License_info: "DL87654321",
        Vehicle_ID: "VHL6002",
        availability: false,
        Rating: 4.5
    },
    {
        Driver_ID: "DRV5003",
        Driver_Name: "Rajesh Kumar",
        Password: "Raj@2023",
        License_info: "DL11223344",
        Vehicle_ID: "VHL6003",
        availability: true,
        Rating: 4.9
    },
    {
        Driver_ID: "DRV5004",
        Driver_Name: "Tan Mei Ling",
        Password: "MeiLing@1",
        License_info: "DL55667788",
        Vehicle_ID: "VHL6004",
        availability: true,
        Rating: 4.7
    },
    {
        Driver_ID: "DRV5005",
        Driver_Name: "Mohd Faisal",
        Password: "Faisal@22",
        License_info: "DL99887766",
        Vehicle_ID: "VHL6005",
        availability: false,
        Rating: 4.6
    }
];

const vehicles = [
    {
        Vehicle_ID: "VHL6001",
        Colour: "Red",
        Plate_Number: "JKL 1234",
        Type: "Proton Saga"
    },
    {
        Vehicle_ID: "VHL6002",
        Colour: "Blue",
        Plate_Number: "MEL 5678",
        Type: "Perodua Myvi"
    },
    {
        Vehicle_ID: "VHL6003",
        Colour: "Silver",
        Plate_Number: "PNJ 9012",
        Type: "Honda City"
    },
    {
        Vehicle_ID: "VHL6004",
        Colour: "Black",
        Plate_Number: "KUL 3456",
        Type: "Toyota Vios"
    },
    {
        Vehicle_ID: "VHL6005",
        Colour: "White",
        Plate_Number: "NSN 7890",
        Type: "Proton X70"
    }
];

const earnings = [
    {
        Earning_ID: "ERN4001",
        Driver_ID: "DRV5001",
        Payments_ID: "PAY3001",
        Total_Earn: 150.50,
        This_Ride_Earning: 12.40,
        Service_Fee: 3.10
    },
    {
        Earning_ID: "ERN4002",
        Driver_ID: "DRV5002",
        Payments_ID: "PAY3002",
        Total_Earn: 220.00,
        This_Ride_Earning: 9.60,
        Service_Fee: 2.40
    },
    {
        Earning_ID: "ERN4003",
        Driver_ID: "DRV5003",
        Payments_ID: "PAY3003",
        Total_Earn: 95.25,
        This_Ride_Earning: 16.00,
        Service_Fee: 4.00
    },
    {
        Earning_ID: "ERN4004",
        Driver_ID: "DRV5001",
        Payments_ID: "PAY3004",
        Total_Earn: 180.75,
        This_Ride_Earning: 15.00,
        Service_Fee: 3.75
    },
    {
        Earning_ID: "ERN4005",
        Driver_ID: "DRV5004",
        Payments_ID: "PAY3005",
        Total_Earn: 310.00,
        This_Ride_Earning: 0.00,
        Service_Fee: 0.00
    }
];

const admin = [
    {
        Admin_ID: "ADM001",
        Password: "Admin@123",
        User_ID: ["USR1001", "USR1002", "USR1003", "USR1004", "USR1005"],
        Rides_ID: ["RDE2001", "RDE2002", "RDE2003", "RDE2004", "RDE2005"],
        Last_Login: new Date()
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