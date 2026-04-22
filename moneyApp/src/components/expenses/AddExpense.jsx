import { useState } from "react";

export default function AddExpense({ userId, refresh }) {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    type: "",
    frequency: "monthly",
  });

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    const expenseData = {
      name: form.name,
      amount: Number(form.amount) || 0,
      category: "expense",
      type: form.type,
      frequency: form.frequency || "monthly",
    };

    try {
      const res = await fetch(`http://localhost:5001/api/expenses/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to add expense:", text);
        setErrorMessage("Failed to add expense.");
        return;
      }

      setMessage("Expense added successfully.");

      setForm({
        name: "",
        amount: "",
        type: "",
        frequency: "monthly",
      });

      refresh();

      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (err) {
      console.error("Add expense error:", err);
      setErrorMessage("Could not connect to the server.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: 12,
        maxWidth: 520,
        margin: "0 auto",
      }}
    >
      <input
        name="name"
        placeholder="Expense Name"
        value={form.name}
        onChange={handleChange}
        style={{
          width: "100%",
          padding: 14,
          fontSize: 16,
          borderRadius: 10,
          border: "1px solid #aaa",
          boxSizing: "border-box",
        }}
      />

      <input
        name="amount"
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        style={{
          width: "100%",
          padding: 14,
          fontSize: 16,
          borderRadius: 10,
          border: "1px solid #aaa",
          boxSizing: "border-box",
        }}
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        required
        style={{
          width: "100%",
          padding: 14,
          fontSize: 16,
          borderRadius: 10,
          border: "1px solid #aaa",
          boxSizing: "border-box",
          background: "#fff",
        }}
      >
        <option value="" disabled>
          Select Expense Type
        </option>
        <option value="Living">Living</option>
        <option value="Subscriptions">Subscriptions</option>
        <option value="Personal">Personal</option>
        <option value="Other">Other</option>
      </select>

      <select
        name="frequency"
        value={form.frequency}
        onChange={handleChange}
        style={{
          width: "100%",
          padding: 14,
          fontSize: 16,
          borderRadius: 10,
          border: "1px solid #aaa",
          boxSizing: "border-box",
          background: "#fff",
        }}
      >
        <option value="monthly">Monthly</option>
        <option value="weekly">Weekly</option>
        <option value="yearly">Yearly</option>
      </select>

      <button
        type="submit"
        style={{
          padding: "10px 16px",
          borderRadius: 10,
          border: "1px solid #bbb",
          background: "#fff",
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        Save Expense
      </button>

      {message && (
        <p
          style={{
            margin: 0,
            color: "#15803d",
            background: "#dcfce7",
            border: "1px solid #86efac",
            padding: "10px 12px",
            borderRadius: 10,
            textAlign: "center",
            fontSize: 14,
          }}
        >
          {message}
        </p>
      )}

      {errorMessage && (
        <p
          style={{
            margin: 0,
            color: "#b91c1c",
            background: "#fee2e2",
            border: "1px solid #fca5a5",
            padding: "10px 12px",
            borderRadius: 10,
            textAlign: "center",
            fontSize: 14,
          }}
        >
          {errorMessage}
        </p>
      )}
    </form>
  );
}