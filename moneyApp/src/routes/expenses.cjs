const express = require("express");
const { ObjectId } = require("mongodb");
const connectDB = require("../../database/connect.cjs");

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const db = await connectDB();

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const user = await db.collection("users").findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const monthlyExpenses = Array.isArray(user?.expenses?.monthly)
      ? user.expenses.monthly.filter(
          (item) => String(item?.category || "").toLowerCase().trim() !== "debt"
        )
      : [];

    return res.status(200).json(monthlyExpenses);
  } catch (err) {
    console.error("Get expenses error:", err);
    return res.status(500).json({
      error: "Server error fetching expenses",
      details: err.message,
    });
  }
});

router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const db = await connectDB();

    console.log("Incoming expense userId:", userId);
    console.log("Incoming expense body:", req.body);

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const user = await db.collection("users").findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newExpense = {
      _id: new ObjectId(),
      name: req.body.name || "",
      amount: Number(req.body.amount) || 0,
      category: "expense",
      type: req.body.type || "",
      frequency: req.body.frequency || "monthly",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $push: {
          "expenses.monthly": newExpense,
        },
      }
    );

    console.log("Expense update result:", result);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(201).json({
      message: "Expense added successfully",
      expense: newExpense,
    });
  } catch (err) {
    console.error("Add expense error:", err);
    return res.status(500).json({
      error: "Server error adding expense",
      details: err.message,
    });
  }
});

router.put("/:userId/:expenseId", async (req, res) => {
  try {
    const { userId, expenseId } = req.params;
    const { newData } = req.body;
    const db = await connectDB();

    if (!ObjectId.isValid(userId) || !ObjectId.isValid(expenseId)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const result = await db.collection("users").updateOne(
      {
        _id: new ObjectId(userId),
        "expenses.monthly._id": new ObjectId(expenseId),
      },
      {
        $set: {
          "expenses.monthly.$.name": newData.name || "",
          "expenses.monthly.$.amount": Number(newData.amount) || 0,
          "expenses.monthly.$.category": "expense",
          "expenses.monthly.$.type": newData.type || "",
          "expenses.monthly.$.frequency": newData.frequency || "monthly",
          "expenses.monthly.$.updatedAt": new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    return res.status(200).json({ message: "Expense updated" });
  } catch (err) {
    console.error("Update expense error:", err);
    return res.status(500).json({
      error: "Update failed",
      details: err.message,
    });
  }
});

router.delete("/:userId/:expenseId", async (req, res) => {
  try {
    const { userId, expenseId } = req.params;
    const db = await connectDB();

    if (!ObjectId.isValid(userId) || !ObjectId.isValid(expenseId)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $pull: {
          "expenses.monthly": { _id: new ObjectId(expenseId) },
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "Expense deleted" });
  } catch (err) {
    console.error("Delete expense error:", err);
    return res.status(500).json({
      error: "Delete failed",
      details: err.message,
    });
  }
});

module.exports = router;