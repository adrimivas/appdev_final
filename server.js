const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
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
let debtsCollection;

async function startServer() {
  try {
    await client.connect();

    const db = client.db(process.env.DB_NAME || "moneyApp");
    usersCollection = db.collection("users");
    debtsCollection = db.collection("debts");

    console.log("Connected to MongoDB");

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

        const monthlyExpenses = Array.isArray(expenses?.monthly)
          ? expenses.monthly
          : [];

        const nonDebtExpenses = monthlyExpenses.filter(
          (item) => item.category !== "debt"
        );

        const debtExpenses = monthlyExpenses.filter(
          (item) => item.category === "debt"
        );

        const newUser = {
          username: username.trim(),
          name: {
            first: name.first.trim(),
            last: name.last.trim(),
          },
          email: email.trim().toLowerCase(),
          password, // later replace with bcrypt hash
          income: Number(income) || 0,
          expenses: {
            monthly: nonDebtExpenses,
          },
          date_of_birth: date_of_birth || null,
          createdAt: new Date(),
        };

        const userResult = await usersCollection.insertOne(newUser);
        const userId = userResult.insertedId;

        if (debtExpenses.length > 0) {
          const debtDocs = debtExpenses.map((debt) => ({
            user_id: userId,
            name: debt.name || "",
            type: debt.type || "",
            amount: Number(debt.amount) || 0,
            current_balance: Number(debt.current_balance) || 0,
            interest_rate: Number(debt.interest_rate) || 0,
            minimum_payment: Number(debt.minimum_payment) || 0,
            current_payment: Number(debt.current_payment) || 0,
            createdAt: new Date(),
          }));

          await debtsCollection.insertMany(debtDocs);
        }

        console.log("Registered user with id:", userId);

        return res.status(201).json({
          message: "Account created successfully!",
          userId,
        });
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
            id: user._id,
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

    app.get("/users/:id/debts", async (req, res) => {
      try {
        const { id } = req.params;

        const debts = await debtsCollection.find({
          user_id: new ObjectId(id),
        }).toArray();

        return res.status(200).json(debts);
      } catch (error) {
        console.error("Get debts error:", error);
        return res.status(500).json({ message: "Server error fetching debts" });
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