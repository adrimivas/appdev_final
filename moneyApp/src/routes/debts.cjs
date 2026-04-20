const express = require("express");
const { ObjectId } = require("mongodb");
const connectDB = require("../../database/connect.cjs");

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const db = await connectDB();
    const debts = await db
      .collection("debts")
      .find({ 
        $or: [
          {user_id: userId },
          { user_id: new ObjectId(userId) }
        ]
      }).toArray();

    res.status(200).json(debts);
  } catch (err) {
    console.error("Get debts error:", err);
    res.status(500).json({ error: "Server error fetching debts" });
  }
});

router.post("/add", async (req, res) => {
  try {
    const db = await connectDB();

    const newDebt = {
      ...req.body,
      user_id: new ObjectId(req.body.user_id),
      payments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await db.collection("debts").insertOne(newDebt);
    res.status(201).json({ ...newDebt, _id: result.insertedId });
  } catch (err) {
    console.error("Add debt error:", err);
    res.status(500).json({ error: "Server error adding debt" });
  }
});

router.post("/pay", async (req, res) => {
  try {
    const { debtId, amount } = req.body;
    const db = await connectDB();
    const debt = await db
      .collection("debts")
      .findOne({ _id: new ObjectId(debtId) });
    if (!debt) return res.status(404).json({ error: "Debt not found" });
    const payment = { amount: Number(amount), date: new Date() };
    const newBalance = (debt.current_balance || 0) - payment.amount;
    await db.collection("debts").updateOne(
      { _id: new ObjectId(debtId) },
      {
        $push: { payments: payment },
        $set: { current_balance: newBalance, updatedAt: new Date() }
      }
    );
    res.status(200).json({ message: "Payment added", new_balance: newBalance });
  } catch (err) {
    console.error("Add payment error:", err);
    res.status(500).json({ error: "Server error adding payment" });
  }
});

router.delete("/:userId/:debtId", async (req, res) => {
  try {
    const { debtId } = req.params;
    const db = await connectDB();
    const result = await db.collection("debts").deleteOne({ 
      _id: new ObjectId(debtId) 
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Debt not found" });
    }
    res.status(200).json({ message: "Debt deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

router.put("/:userId/:debtId", async (req, res) => {
  try {
    const { debtId } = req.params;
    const { newData } = req.body;
    const db = await connectDB();
    const result = await db.collection("debts").updateOne(
      { _id: new ObjectId(debtId) },
      { 
        $set: { 
          name: newData.name,
          current_balance: parseFloat(newData.current_balance),
          interest_rate: parseFloat(newData.interest_rate),
          minimum_payment: parseFloat(newData.minimum_payment),
          current_payment: parseFloat(newData.current_payment),
          updatedAt: new Date()
        } 
      }
    );
    res.status(200).json({ message: "Debt updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;