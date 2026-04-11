const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("MONGO_URI is missing. Check your .env file.");
  process.exit(1);
}

const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    if (!db) {
      await client.connect();
      console.log("Connected to MongoDB");
      db = client.db("moneyApp");
    }
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  console.log("\nClosing MongoDB connection...");
  await client.close();
  process.exit(0);
});

module.exports = connectDB;