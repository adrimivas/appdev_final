import { useState } from "react";

export default function AddDebt({ userId, refresh }) {
  const [form, setForm] = useState({
    name: "",
    type: "",
    original_amount: "",
    current_balance: "",
    interest_rate: "",
    minimum_payment: "",
    current_payment: "",
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

    if (!form.type) {
      setErrorMessage("Please select a debt type.");
      return;
    }

    const originalAmount = Number(form.original_amount) || 0;
    const currentBalance =
      form.current_balance !== ""
        ? Number(form.current_balance)
        : originalAmount;

    const currentPayment =
      form.current_payment !== ""
        ? Number(form.current_payment)
        : Number(form.minimum_payment) || 0;

    const debtData = {
      user_id: userId,
      name: form.name,
      type: form.type,
      original_amount: originalAmount,
      current_balance: currentBalance,
      interest_rate: Number(form.interest_rate) || 0,
      minimum_payment: Number(form.minimum_payment) || 0,
      current_payment: currentPayment,
    };

    try {
      const res = await fetch("http://localhost:5001/api/debts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(debtData),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to add debt:", text);
        setErrorMessage("Failed to add debt.");
        return;
      }

      setMessage("Debt successfully added.");

      setForm({
        name: "",
        type: "",
        original_amount: "",
        current_balance: "",
        interest_rate: "",
        minimum_payment: "",
        current_payment: "",
      });

      refresh();

      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (err) {
      console.error("Error adding debt:", err);
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
        placeholder="Debt Name"
        value={form.name}
        onChange={handleChange}
        style={inputStyle}
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        required
        style={inputStyle}
      >
        <option value="" disabled>Select Debt Type</option>
        <option value="Credit Card">Credit Card</option>
        <option value="Student Loan">Student Loan</option>
        <option value="Car Loan">Car Loan</option>
        <option value="Mortgage">Mortgage</option>
        <option value="Personal Loan">Personal Loan</option>
        <option value="Medical Debt">Medical Debt</option>
        <option value="Other">Other</option>
      </select>

      <input
        name="original_amount"
        type="number"
        placeholder="Original Balance"
        value={form.original_amount}
        onChange={handleChange}
        style={inputStyle}
      />

      <input
        name="current_balance"
        type="number"
        placeholder="Current Balance"
        value={form.current_balance}
        onChange={handleChange}
        style={inputStyle}
      />

      <input
        name="interest_rate"
        type="number"
        placeholder="Interest Rate (%)"
        value={form.interest_rate}
        onChange={handleChange}
        style={inputStyle}
      />

      <input
        name="minimum_payment"
        type="number"
        placeholder="Minimum Payment"
        value={form.minimum_payment}
        onChange={handleChange}
        style={inputStyle}
      />

      <input
        name="current_payment"
        type="number"
        placeholder="Current Monthly Payment"
        value={form.current_payment}
        onChange={handleChange}
        style={inputStyle}
      />

      <button type="submit" style={buttonStyle}>
        Save Debt
      </button>

      {message && (
        <p style={successStyle}>{message}</p>
      )}

      {errorMessage && (
        <p style={errorStyle}>{errorMessage}</p>
      )}
    </form>
  );
}

const inputStyle = {
  width: "100%",
  padding: 14,
  fontSize: 16,
  borderRadius: 10,
  border: "1px solid #aaa",
  boxSizing: "border-box",
};

const buttonStyle = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "1px solid #bbb",
  background: "#fff",
  cursor: "pointer",
  fontSize: 16,
};

const successStyle = {
  margin: 0,
  color: "#15803d",
  background: "#dcfce7",
  border: "1px solid #86efac",
  padding: "10px 12px",
  borderRadius: 10,
  textAlign: "center",
  fontSize: 14,
};

const errorStyle = {
  margin: 0,
  color: "#b91c1c",
  background: "#fee2e2",
  border: "1px solid #fca5a5",
  padding: "10px 12px",
  borderRadius: 10,
  textAlign: "center",
  fontSize: 14,
};