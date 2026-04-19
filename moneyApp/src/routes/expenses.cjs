const express = require("express");
const router = express.Router();
const connectDB = require("../../database/connect.cjs");
const { ObjectId } = require("mongodb");

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const db = await connectDB();
    const currentMonthStr = new Date().toISOString().slice(0, 7);
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user) return res.status(404).json({ error: "User not found" });
    let expenses = user.expenses || { one_time: [], monthly: [], recurring: [] };
    const monthExists = expenses.monthly.find(m => m.month === currentMonthStr);
    if (!monthExists && expenses.recurring.length > 0) {
      const newMonthEntry = {
        month: currentMonthStr,
        items: expenses.recurring.map(item => ({ ...item })) 
      };
      await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $push: { "expenses.monthly": newMonthEntry } }
      );
      expenses.monthly.push(newMonthEntry);
    }
    res.status(200).json(expenses);
  } catch (err) {
    console.error("Expense sync error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, amount, type, date } = req.body;
        const db = await connectDB();
        const newEntry = {
            name,
            amount: parseFloat(amount),
            date: date ? new Date(date) : new Date()
        };
        const targetField = type === "recurring" ? "expenses.recurring" : "expenses.one_time";
        await db.collection("users").updateOne(
            { _id: new ObjectId(userId) },
            { $push: { [targetField]: newEntry }}
        );
        res.status(200).json({ message: "Expense added successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to add expense" });
    }
});

module.exports = router;