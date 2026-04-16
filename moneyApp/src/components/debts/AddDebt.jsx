import { useState } from "react";

export default function AddDebt({ userId, refresh }) {
    const [form, setForm] = useState({
        name: "",
        type: "",
        original_amount: "",
        interest_rate: "",
        minimum_payment: ""
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
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
                placeholder="Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input
                placeholder="Type"
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
            />
            <input
                type="number"
                placeholder="Amount"
                value={form.original_amount}
                onChange={e => setForm({ ...form, original_amount: e.target.value })}
            />
            <input
                type="number"
                placeholder="Interest Rate"
                value={form.interest_rate}
                onChange={e => setForm({ ...form, interest_rate: e.target.value })}
            />
            <input
                type="number"
                placeholder="Minimum Payment"
                value={form.minimum_payment}
                onChange={e => setForm({ ...form, minimum_payment: e.target.value })}
            />
            <button type="submit">Add Debt</button>
        </form>
    );
}