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
        $or: [{ user_id: userId }, { user_id: new ObjectId(userId) }],
      })
      .toArray();

    res.status(200).json(debts);
  } catch (err) {
    console.error("Get debts error:", err);
    res.status(500).json({ error: "Server error fetching debts" });
  }
});

router.post("/add", async (req, res) => {
  try {
    const db = await connectDB();

    const originalAmount = Number(req.body.original_amount) || 0;
    const currentBalance =
      req.body.current_balance !== undefined &&
      req.body.current_balance !== null &&
      req.body.current_balance !== ""
        ? Number(req.body.current_balance)
        : originalAmount;

    const newDebt = {
      user_id: new ObjectId(req.body.user_id),
      name: req.body.name || "",
      type: req.body.type || "",
      amount: Number(req.body.amount) || 0,
      original_amount: originalAmount,
      current_balance: currentBalance,
      interest_rate: Number(req.body.interest_rate) || 0,
      minimum_payment: Number(req.body.minimum_payment) || 0,
      current_payment:
        Number(req.body.current_payment) ||
        Number(req.body.minimum_payment) ||
        0,
      payments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("debts").insertOne(newDebt);

    res.status(201).json({
      message: "Debt added successfully",
      debt: { ...newDebt, _id: result.insertedId },
    });
  } catch (err) {
    console.error("Add debt error:", err);
    res.status(500).json({
      error: "Server error adding debt",
      details: err.message,
    });
  }
});

router.post("/pay", async (req, res) => {
  try {
    const { debtId, amount } = req.body;
    const db = await connectDB();

    const debt = await db.collection("debts").findOne({
      _id: new ObjectId(debtId),
    });

    if (!debt) {
      return res.status(404).json({ error: "Debt not found" });
    }

    const payment = {
      amount: Number(amount),
      date: new Date(),
    };

    const newBalance = Math.max(
      (Number(debt.current_balance) || 0) - payment.amount,
      0
    );

    await db.collection("debts").updateOne(
      { _id: new ObjectId(debtId) },
      {
        $push: { payments: payment },
        $set: {
          current_balance: newBalance,
          updatedAt: new Date(),
        },
      }
    );

    res.status(200).json({
      message: "Payment added",
      new_balance: newBalance,
    });
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
      _id: new ObjectId(debtId),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Debt not found" });
    }

    res.status(200).json({ message: "Debt deleted" });
  } catch (err) {
    console.error("Delete debt error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

router.put("/:userId/:debtId", async (req, res) => {
  try {
    const { debtId } = req.params;
    const { newData } = req.body;
    const db = await connectDB();

    await db.collection("debts").updateOne(
      { _id: new ObjectId(debtId) },
      {
        $set: {
          name: newData.name || "",
          type: newData.type || "",
          original_amount: Number(newData.original_amount) || 0,
          current_balance: Number(newData.current_balance) || 0,
          interest_rate: Number(newData.interest_rate) || 0,
          minimum_payment: Number(newData.minimum_payment) || 0,
          current_payment: Number(newData.current_payment) || 0,
          updatedAt: new Date(),
        },
      }
    );

    res.status(200).json({ message: "Debt updated" });
  } catch (err) {
    console.error("Update debt error:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;