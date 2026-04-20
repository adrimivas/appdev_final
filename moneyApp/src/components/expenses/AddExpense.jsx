import { useState } from "react";

export default function AddExpense({ userId, refresh }) {
    const [formData, setFormData] = useState({
        name: "",
        amount: "",
        type: "one_time",
        date: new Date().toISOString().split('T')[0]
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5000/api/expenses/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                refresh();
                setFormData({ name: "", amount: "", type: "one_time" });
            }
        } catch (err) {
            console.error("Add expense error:", err);
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <input
                placeholder="Expense Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
            />
            <input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
            />
            <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
            <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
                <option value="one_time">One-Time</option>
                <option value="monthly">Monthly</option>
            </select>
            <button type="submit">Save Expense</button>
        </form>
    );
}