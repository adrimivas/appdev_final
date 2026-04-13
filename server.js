const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

const client = new MongoClient(process.env.MONGO_URI);

let usersCollection;

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(process.env.DB_NAME || "moneyApp");
    usersCollection = db.collection("users");

    app.post("/register", async (req, res) => {
      try {
        const {
          username,
          name,
          email,
          password,
          income,
          expenses,
          date_of_birth,
        } = req.body;

        if (
          !username ||
          !name?.first ||
          !name?.last ||
          !email ||
          !password ||
          income === undefined
        ) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        const existingUser = await usersCollection.findOne({
          $or: [{ username }, { email }],
        });

        if (existingUser) {
          return res
            .status(409)
            .json({ message: "Username or email already exists" });
        }

        const newUser = {
          username,
          name,
          email,
          password,
          income,
          expenses: expenses || { monthly: [] },
          date_of_birth: date_of_birth || null,
          createdAt: new Date(),
        };

        const result = await usersCollection.insertOne(newUser);

        console.log("Registered user with id:", result.insertedId);

        return res
          .status(201)
          .json({ message: "Account created successfully!" });
      } catch (error) {
        console.error("Register route error:", error);
        return res
          .status(500)
          .json({ message: "Server error during registration" });
      }
    });

    app.post("/login", async (req, res) => {
      try {
        const { username, password } = req.body;

        if (!username || !password) {
          return res
            .status(400)
            .json({ message: "Username and password are required" });
        }

        const user = await usersCollection.findOne({ username, password });

        if (!user) {
          return res
            .status(401)
            .json({ message: "Invalid username or password" });
        }

        return res.status(200).json({
          message: "Login successful",
          user: {
            username: user.username,
            email: user.email,
            name: user.name,
          },
        });
      } catch (error) {
        console.error("Login route error:", error);
        return res.status(500).json({ message: "Server error during login" });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

startServer();
