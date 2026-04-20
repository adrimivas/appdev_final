import { useState, useEffect } from "react";
import { calculatePayoffMonths } from "../../utils/debtCalc";

export default function DebtDetail({ debt, goBack, userId, refresh }) {
    if (!debt) return null;
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: debt.name || "",
        current_balance: debt.current_balance || 0,
        interest_rate: debt.interest_rate || 0,
        minimum_payment: debt.minimum_payment || 0,
        current_payment: debt.current_payment || debt.minimum_payment
    });
    useEffect(() => {
        setEditData({
            name: debt.name,
            current_balance: debt.current_balance,
            interest_rate: debt.interest_rate,
            minimum_payment: debt.minimum_payment,
            current_payment: debt.current_payment || debt.minimum_payment
        });
    }, [debt]);
    const { months, totalPaid } = calculatePayoffMonths(
        debt.current_balance || 0,
        debt.interest_rate || 0,
        debt.current_payment || debt.minimum_payment || 0
    );
    const totalInterest = totalPaid - (debt.current_balance || 0);
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${debt.name}?`)) return;
        try {
            const res = await fetch(`http://localhost:5000/api/debts/${userId}/${debt._id}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json" }
            });
            if (res.ok) refresh();
        } catch (err) {
            console.error("Delete error:", err);
        }
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5000/api/debts/${userId}/${debt._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newData: editData })
            });
            if (res.ok) {
                setIsEditing(false);
                refresh();
            }
        } catch (err) {
            console.error("Update error:", err);
        }
    };
    return (
        <div>
            <button onClick={goBack}>Back</button>
            {isEditing ? (
                <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
                    <h2>Edit {debt.name}</h2>
                    <label>Name</label>
                    <input type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} />
                    <label>Current Balance</label>
                    <input type="number" value={editData.current_balance} onChange={e => setEditData({...editData, current_balance: e.target.value})} />
                    <label>Interest Rate (%)</label>
                    <input type="number" step="0.01" value={editData.interest_rate} onChange={e => setEditData({...editData, interest_rate: e.target.value})} />
                    <label>Minimum Payment</label>
                    <input type="number" value={editData.minimum_payment} onChange={e => setEditData({...editData, minimum_payment: e.target.value})} />
                    <label>Current Payments</label>
                    <input type="number" value={editData.current_payment} onChange={e => setEditData({...editData, current_payment: e.target.value})} />
                    <div style={{ marginTop: "10px" }}>
                        <button type="submit" style={{ backgroundColor: "green", color: "white", marginRight: "10px" }}>Save Changes</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </form>
            ) : (
                <>
                    <h2>{debt.name}</h2>
                    <p>Balance: ${ (debt.current_balance || 0).toFixed(2)}</p>
                    <p>Original: ${ (debt.original_amount || 0).toFixed(2)}</p>
                    <p>Interest: { (debt.interest_rate || 0).toFixed(2)}%</p>
                    <p>Minimum Payment: ${ (debt.minimum_payment || 0).toFixed(2)}</p>
                    <p>Current Payment: ${ (debt.current_payment || 0).toFixed(2)}</p>
                    <hr />
                    <h3>Payoff Time</h3>
                    <p>
                        {months} months (~
                        {years > 0 && `${years} ${years === 1 ? "year" : "years"} `}
                        {remainingMonths > 0 && `${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`}
                        )
                    </p>
                    <h3>Total Paid</h3>
                    <p>${totalPaid.toFixed(2)}</p>
                    <h3>Total Interest</h3>
                    <p>${totalInterest.toFixed(2)}</p>
                    <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
                        <button onClick={() => setIsEditing(true)}>Edit Debt</button>
                        <button onClick={handleDelete} style={{ backgroundColor: "red", color: "white", border: "none", padding: "8px 16px", borderRadius: "4px" }}>
                            Delete Debt
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}