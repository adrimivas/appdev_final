// load .env variables
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function connectDB() {
    try {
        // connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");
        // return the database
        const db = client.db("moneyApp");
        return db;
    } catch (error) {
        // exit if cannot connect
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}
// close MongoDB connection when closing the app
process.on('SIGINT', async () => {
    console.log("\nClosing MongoDB connection...");
    await client.close();
    process.exit(0);
});

module.exports = connectDB;