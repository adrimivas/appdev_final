const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

const users = [];

app.post("/register", (req, res) => {
  try {
    const { username, name, email, password, income, expenses, date_of_birth } = req.body;

    if (!username || !name?.first || !name?.last || !email || !password || income === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = users.find(
      (user) => user.username === username || user.email === email
    );

    if (existingUser) {
      return res.status(409).json({ message: "Username or email already exists" });
    }

    const newUser = {
      username,
      name,
      email,
      password,
      income,
      expenses: expenses || { monthly: [] },
      date_of_birth: date_of_birth || null,
    };

    users.push(newUser);
    console.log("Registered user:", newUser);

    res.status(201).json({ message: "Account created successfully!" });
  } catch (error) {
    console.error("Register route error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

app.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;

    const user = users.find(
      (user) => user.username === username && user.password === password
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login route error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
