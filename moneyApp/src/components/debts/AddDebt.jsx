import { useState } from "react";

export default function AddDebt({ userId, refresh }) {
    const [form, setForm] = useState({
        name: "",
        type: "",
        original_amount: "",
        interest_rate: "",
        minimum_payment: ""
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.type) {
            alert("Please select a debt type");
            return;
        }
        const debtData = {
            ...form,
            user_id: userId,
            original_amount: Number(form.original_amount),
            interest_rate: Number(form.interest_rate),
            minimum_payment: Number(form.minimum_payment),
            current_balance: Number(form.original_amount)
        };
        try {
            const res = await fetch("http://localhost:5000/api/debts/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(debtData)
            });
            if (res.ok) {
                refresh();
                setForm({
                    name: "",
                    type: "",
                    original_amount: "",
                    interest_rate: "",
                    minimum_payment: ""
                });
            } else {
                console.error("Failed to add debt");
            }
        } catch (err) {
            console.error("Error adding debt:", err);
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
            />
            <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
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
                placeholder="Amount"
                value={form.original_amount}
                onChange={handleChange}
            />
            <input
                name="interest_rate"
                type="number"
                placeholder="Interest Rate"
                value={form.interest_rate}
                onChange={handleChange}
            />
            <input
                name="minimum_payment"
                type="number"
                placeholder="Minimum Payment"
                value={form.minimum_payment}
                onChange={handleChange}
            />
            <button type="submit">Add Debt</button>
        </form>
    );
}