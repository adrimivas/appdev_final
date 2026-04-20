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
    const currentMonthStr = new Date(date).toISOString().slice(0, 7);
    const newEntry = { name, amount: parseFloat(amount), date: new Date(date) };
    if (type === "monthly" || type === "recurring") {
      await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $push: { "expenses.recurring": newEntry }}
      );
      await db.collection("users").updateOne(
        { _id: new ObjectId(userId), "expenses.monthly.month": currentMonthStr },
        { $push: { "expenses.monthly.$.items": newEntry }}
      );
    } else {
      await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $push: { "expenses.one_time": newEntry }}
      );
    }
    res.status(200).json({ message: "Added" });
  } catch (err) { res.status(500).send(err); }
});

router.delete("/:userId/:expenseName", async (req, res) => {
  try {
    const { userId, expenseName } = req.params;
    const { category, date } = req.body;
    const db = await connectDB();
    console.log(`Attempting to delete ${expenseName} in category: ${category}`);
    if (category === "one_time") {
      await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { "expenses.one_time": { name: expenseName } } }
      );
    } else {
      const targetMonth = new Date(date).toISOString().slice(0, 7);
      await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { "expenses.monthly.$[m].items": { name: expenseName } } },
        { arrayFilters: [{ "m.month": targetMonth }] }
      );
    }
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

router.put("/:userId/:oldName", async (req, res) => {
  try {
    const { userId, oldName } = req.params;
    const { newData, category } = req.body;
    const db = await connectDB();
    if (category === "one_time") {
      const result = await db.collection("users").updateOne(
        { _id: new ObjectId(userId), "expenses.one_time.name": oldName },
        { $set: { 
            "expenses.one_time.$.name": newData.name,
            "expenses.one_time.$.amount": parseFloat(newData.amount),
            "expenses.one_time.$.date": new Date(newData.date)
        }}
      );
      console.log("Edit One-Time Matched:", result.matchedCount);
    } else {
      const targetMonth = new Date(newData.date).toISOString().slice(0, 7);
      await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $set: { 
            "expenses.monthly.$[m].items.$[i].name": newData.name,
            "expenses.monthly.$[m].items.$[i].amount": parseFloat(newData.amount),
            "expenses.monthly.$[m].items.$[i].date": new Date(newData.date)
        }},
        { arrayFilters: [{ "m.month": targetMonth }, { "i.name": oldName }] }
      );
    }
    res.status(200).json({ message: "Updated" });
  } catch (err) { res.status(500).json({ error: "Failed" }); }
});

module.exports = router;