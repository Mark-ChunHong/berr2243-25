const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing

// MongoDB Connection URI - IMPORTANT: Ensure this matches your index.js URI
const MONGODB_URI = "mongodb+srv://Database_Ass:Database_Ass2025@cluster0.i63ss4u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "Assignment"; // Your database name (must match index.js)

// Sample data for all collections
const createSampleData = async () => {
    // Generate hashed passwords for all roles
    const hashedPasswordAdmin = await bcrypt.hash('adminpassword', 10);
    const hashedPasswordUser1 = await bcrypt.hash('Lim@2023', 10);
    const hashedPasswordUser2 = await bcrypt.hash('Nurul@123', 10);
    const hashedPasswordUser3 = await bcrypt.hash('Raj@2023', 10);
    const hashedPasswordUser4 = await bcrypt.hash('MeiLing@1', 10);
    const hashedPasswordUser5 = await bcrypt.hash('Ahmad@123', 10);

    const hashedPasswordDriver1 = await bcrypt.hash('DriverAhmad@123', 10); // Specific password for driver
    const hashedPasswordDriver2 = await bcrypt.hash('DriverSiti@2023', 10);
    const hashedPasswordDriver3 = await bcrypt.hash('DriverRaj@2023', 10);
    const hashedPasswordDriver4 = await bcrypt.hash('DriverMeiLing@1', 10);
    const hashedPasswordDriver5 = await bcrypt.hash('DriverFaisal@22', 10);


    const users = [
        {
            userId: "USR1001",
            name: "Lim Wei Jie",
            email: "limweijie@example.com",
            password: hashedPasswordUser1,
            phone: "+60123456789",
            registrationDate: new Date("2023-01-15T09:30:00Z")
        },
        {
            userId: "USR1002",
            name: "Nurul Aisyah",
            email: "nurulaisyah@example.com",
            password: hashedPasswordUser2,
            phone: "+60198765432",
            registrationDate: new Date("2023-02-20T14:15:00Z")
        },
        {
            userId: "USR1003",
            name: "Rajvinder Singh",
            email: "rajvinder@example.com",
            password: hashedPasswordUser3,
            phone: "+60168889900",
            registrationDate: new Date("2023-03-05T11:45:00Z")
        },
        {
            userId: "USR1004",
            name: "Tan Mei Ling",
            email: "tanmeiling@example.com",
            password: hashedPasswordUser4,
            phone: "+60127778899",
            registrationDate: new Date("2023-04-10T16:20:00Z")
        },
        {
            userId: "USR1005",
            name: "Ahmad Firdaus",
            email: "ahmadfirdaus@example.com",
            password: hashedPasswordUser5,
            phone: "+60139998877",
            registrationDate: new Date("2023-05-12T10:00:00Z")
        }
    ];

    const drivers = [
        {
            driverId: "DRV5001",
            name: "Ahmad bin Abdullah",
            email: "ahmad.driver@example.com", // Email for login
            password: hashedPasswordDriver1,
            phone: "+60112345678",
            licenseNumber: "DL12345678",
            vehicleId: "VHL6001", // Linked below
            vehicleDetails: "Proton Saga, JKL 1234",
            isAvailable: true,
            rating: 4.8,
            createdAt: new Date("2023-01-20T09:00:00Z")
        },
        {
            driverId: "DRV5002",
            name: "Siti Nurhaliza",
            email: "siti.driver@example.com",
            password: hashedPasswordDriver2,
            phone: "+60129876543",
            licenseNumber: "DL87654321",
            vehicleId: "VHL6002",
            vehicleDetails: "Perodua Myvi, MEL 5678",
            isAvailable: false,
            rating: 4.5,
            createdAt: new Date("2023-02-25T14:00:00Z")
        },
        {
            driverId: "DRV5003",
            name: "Rajesh Kumar",
            email: "rajesh.driver@example.com",
            password: hashedPasswordDriver3,
            phone: "+60178889900",
            licenseNumber: "DL11223344",
            vehicleId: "VHL6003",
            vehicleDetails: "Honda City, PNJ 9012",
            isAvailable: true,
            rating: 4.9,
            createdAt: new Date("2023-03-10T11:00:00Z")
        },
        {
            driverId: "DRV5004",
            name: "Tan Mei Ling",
            email: "tan.driver@example.com",
            password: hashedPasswordDriver4,
            phone: "+60137778899",
            licenseNumber: "DL55667788",
            vehicleId: "VHL6004",
            vehicleDetails: "Toyota Vios, KUL 3456",
            isAvailable: true,
            rating: 4.7,
            createdAt: new Date("2023-04-15T10:00:00Z")
        },
        {
            driverId: "DRV5005",
            name: "Mohd Faisal",
            email: "faisal.driver@example.com",
            password: hashedPasswordDriver5,
            phone: "+60199988776",
            licenseNumber: "DL99887766",
            vehicleId: "VHL6005",
            vehicleDetails: "Proton X70, NSN 7890",
            isAvailable: false,
            rating: 4.6,
            createdAt: new Date("2023-05-20T15:00:00Z")
        }
    ];

    const vehicles = [
        {
            vehicleId: "VHL6001",
            make: "Proton",
            model: "Saga",
            year: 2020,
            licensePlate: "JKL 1234",
            driverId: "DRV5001" // Linked to DRV5001
        },
        {
            vehicleId: "VHL6002",
            make: "Perodua",
            model: "Myvi",
            year: 2018,
            licensePlate: "MEL 5678",
            driverId: "DRV5002"
        },
        {
            vehicleId: "VHL6003",
            make: "Honda",
            model: "City",
            year: 2021,
            licensePlate: "PNJ 9012",
            driverId: "DRV5003"
        },
        {
            vehicleId: "VHL6004",
            make: "Toyota",
            model: "Vios",
            year: 2019,
            licensePlate: "KUL 3456",
            driverId: "DRV5004"
        },
        {
            vehicleId: "VHL6005",
            make: "Proton",
            model: "X70",
            year: 2022,
            licensePlate: "NSN 7890",
            driverId: "DRV5005"
        }
    ];

    const rides = [
        {
            rideId: "RDE2001",
            userId: "USR1001",
            driverId: "DRV5001",
            vehicleId: "VHL6001",
            pickupLocation: "UTeM Main Gate",
            dropoffLocation: "Melaka Mall",
            status: "completed",
            fare: 15.50,
            rideDate: new Date("2023-06-01T08:00:00Z")
        },
        {
            rideId: "RDE2002",
            userId: "USR1002",
            driverId: "DRV5002",
            vehicleId: "VHL6002",
            pickupLocation: "Faculty of Engineering",
            dropoffLocation: "MITC",
            status: "completed",
            fare: 12.00,
            rideDate: new Date("2023-06-02T14:15:00Z")
        },
        {
            rideId: "RDE2003",
            userId: "USR1003",
            driverId: "DRV5003",
            vehicleId: "VHL6003",
            pickupLocation: "UTeM Library",
            dropoffLocation: "Ayer Keroh Bus Terminal",
            status: "completed",
            fare: 20.00,
            rideDate: new Date("2023-06-03T18:30:00Z")
        },
        {
            rideId: "RDE2004",
            userId: "USR1004",
            driverId: "DRV5001", // DRV5001 takes another ride
            vehicleId: "VHL6001",
            pickupLocation: "Student Residence",
            dropoffLocation: "Jonker Street",
            status: "completed",
            fare: 18.75,
            rideDate: new Date("2023-06-04T09:05:00Z")
        },
        {
            rideId: "RDE2005",
            userId: "USR1005",
            driverId: "DRV5004",
            vehicleId: "VHL6004",
            pickupLocation: "Sports Complex",
            dropoffLocation: "Mahkota Medical Center",
            status: "completed",
            fare: 10.50,
            rideDate: new Date("2023-06-05T16:00:00Z")
        },
        {
            rideId: "RDE2006",
            userId: "USR1001",
            driverId: "DRV5003", // An ongoing ride for DRV5003
            vehicleId: "VHL6003",
            pickupLocation: "Cyberjaya",
            dropoffLocation: "Kuala Lumpur City Centre",
            status: "in_progress",
            fare: 45.00,
            rideDate: new Date("2024-06-24T10:00:00Z") // Future ride
        },
        {
            rideId: "RDE2007",
            userId: "USR1002",
            driverId: "DRV5001",
            vehicleId: "VHL6001",
            pickupLocation: "Petaling Jaya",
            dropoffLocation: "Subang Airport",
            status: "pending", // A pending ride
            fare: 25.00,
            rideDate: new Date("2024-06-24T12:00:00Z") // Future ride
        }
    ];

    const payments = [
        {
            paymentId: "PAY3001",
            rideId: "RDE2001",
            userId: "USR1001",
            amount: 15.50,
            method: "Touch 'n Go eWallet",
            status: "Completed",
            paymentDate: new Date("2023-06-01T08:15:00Z")
        },
        {
            paymentId: "PAY3002",
            rideId: "RDE2002",
            userId: "USR1002",
            amount: 12.00,
            method: "GrabPay",
            status: "Completed",
            paymentDate: new Date("2023-06-02T14:30:00Z")
        },
        {
            paymentId: "PAY3003",
            rideId: "RDE2003",
            userId: "USR1003",
            amount: 20.00,
            method: "Cash",
            status: "Completed",
            paymentDate: new Date("2023-06-03T18:45:00Z")
        },
        {
            paymentId: "PAY3004",
            rideId: "RDE2004",
            userId: "USR1004",
            amount: 18.75,
            method: "Credit Card",
            status: "Completed",
            paymentDate: new Date("2023-06-04T09:20:00Z")
        },
        {
            paymentId: "PAY3005",
            rideId: "RDE2005",
            userId: "USR1005",
            amount: 10.50,
            method: "Boost",
            status: "Completed",
            paymentDate: new Date("2023-06-05T16:10:00Z")
        }
    ];

    const earnings = [
        {
            earningId: "ERN4001",
            driverId: "DRV5001",
            rideId: "RDE2001",
            amount: 12.40,
            serviceFee: 3.10,
            earningDate: new Date("2023-06-01T08:25:00Z")
        },
        {
            earningId: "ERN4002",
            driverId: "DRV5002",
            rideId: "RDE2002",
            amount: 9.60,
            serviceFee: 2.40,
            earningDate: new Date("2023-06-02T14:35:00Z")
        },
        {
            earningId: "ERN4003",
            driverId: "DRV5003",
            rideId: "RDE2003",
            amount: 16.00,
            serviceFee: 4.00,
            earningDate: new Date("2023-06-03T19:00:00Z")
        },
        {
            earningId: "ERN4004",
            driverId: "DRV5001",
            rideId: "RDE2004",
            amount: 15.00,
            serviceFee: 3.75,
            earningDate: new Date("2023-06-04T09:40:00Z")
        },
        {
            earningId: "ERN4005",
            driverId: "DRV5004",
            rideId: "RDE2005",
            amount: 8.00,
            serviceFee: 2.50,
            earningDate: new Date("2023-06-05T16:30:00Z")
        }
    ];

    const admins = [
        {
            adminId: "ADM001",
            name: "Main Admin",
            email: "admin@example.com", // This email is used for login
            password: hashedPasswordAdmin, // Hashed password
            createdAt: new Date("2023-01-01T00:00:00Z")
        }
    ];

    return { users, rides, payments, drivers, vehicles, earnings, admins };
};


async function main() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db(DB_NAME);

        // Drop existing collections to ensure a clean slate each run
        console.log("Dropping existing collections...");
        const collectionNames = ["users", "rides", "payments", "earnings", "drivers", "vehicles", "admins"];
        for (const name of collectionNames) {
            try {
                await db.collection(name).drop();
                console.log(`Collection '${name}' dropped.`);
            } catch (error) {
                if (error.code === 26) { // 26 means collection doesn't exist
                    console.log(`Collection '${name}' does not exist, skipping drop.`);
                } else {
                    throw error;
                }
            }
        }

        const { users, rides, payments, drivers, vehicles, earnings, admins } = await createSampleData();

        console.log("Inserting new data...");

        await db.collection("users").insertMany(users);
        console.log(`Inserted ${users.length} users.`);

        await db.collection("drivers").insertMany(drivers);
        console.log(`Inserted ${drivers.length} drivers.`);

        await db.collection("vehicles").insertMany(vehicles);
        console.log(`Inserted ${vehicles.length} vehicles.`);

        await db.collection("rides").insertMany(rides);
        console.log(`Inserted ${rides.length} rides.`);

        await db.collection("payments").insertMany(payments);
        console.log(`Inserted ${payments.length} payments.`);

        await db.collection("earnings").insertMany(earnings);
        console.log(`Inserted ${earnings.length} earnings.`);

        await db.collection("admins").insertMany(admins);
        console.log(`Inserted ${admins.length} admins.`);

        console.log("Database seeding complete!");

    } catch (err) {
        console.error("Error during database operations:", err);
    } finally {
        await client.close();
    }
}

main();