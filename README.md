# berr2243-2025
# Installation steps
1. Install VSCode from code.visualstudio.com with extensions: MongoDB for VSCode. 

2. Install NodeJS & npm from nodejs.org. 
Verify installation:	
node -v
npm -v

3. Install MongoDB 
- Download the installer.
Download the MongoDB Community .msi installer from https://www.mongodb.com/try/download/community?tck=docs_server

- In the Version dropdown, select the version of MongoDB to download.
- In the Platform dropdown, select Windows.
- In the Package dropdown, select msi.
- Click Download.

- Run the MongoDB installer.
- Follow the MongoDB Community Edition installation wizard. The wizard steps you through the installation of MongoDB and MongoDB Compass.

- Choose Setup Type
You can choose either the Complete (recommended for most users) or Custom setup type. The Complete setup option installs MongoDB and the MongoDB tools to the default location. The Custom setup option allows you to specify which executables are installed and where.

- MongoDB Service Configuration
You can configure and start MongoDB as a Windows service during the install, and the MongoDB service is started upon successful installation.
- Select Install MongoD as a Service.
- Select Run the service as Network Service user (Default)
- Service Name. Specify the service name. Default name is MongoDB. If you already have a service with the specified name, you must choose another name.
- Data Directory. Specify the data directory, which corresponds to the --dbpath. If the directory does not exist, the installer will create the directory and sets the directory access to the service user.
- Log Directory. Specify the Log directory, which corresponds to the --logpath. If the directory does not exist, the installer will create the directory and sets the directory access to the service user.

- Install MongoDB Compass from https://www.mongodb.com/products/compass

- Start MongoDB service 

4. Install Git Download from git-scm.com. 

5. Create GitHub Account and new Git Repository 


# Step to create README.md file to document
echo "# berr2243-2025" >> README.md   
- Create a README.md file and add the text "# berr2243-2025" to it
  
git init                               
- Initialize a new Git repository in the current directory
  
git commit -m "first commit"          
- Stage and commit changes with the message "first commit"
  
git branch -M main
- Rename the current branch to "main"
  
git remote add origin https://github.com/Mark-ChunHong/berr2243-25.git  
- Add a remote repository and link it to the GitHub URL
  
git push -u origin main                                              
- Push the changes to the "main" branch on the remote repository and set upstream tracking

# Step to create a "Hello MongoDB" NodeJS Script
npm init -y 
- initialize a NodeJS Project

npm install mongodb 
- install MongoDB Driver

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



# create a new file "index.js" and paste the code
node index.js
- run the script

# Next step check testDB database
