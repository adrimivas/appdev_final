import { useState } from "react";

export default function ExpenseDetail({ expense, userId, goBack, refresh }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: expense.name,
    amount: expense.amount,
    date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : ""
  });
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${expense.name}"?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/expenses/${userId}/${encodeURIComponent(expense.name)}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          category: expense.category,
          date: expense.date
        })
      });
      if (res.ok) {
        refresh();
      } else {
        alert("Failed to delete expense.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/expenses/${userId}/${encodeURIComponent(expense.name)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          newData: editData, 
          category: expense.category 
        })
      });
      if (res.ok) {
        setIsEditing(false);
        refresh();
      } else {
        alert("Failed to update expense.");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };
  return (
    <div>
      <button onClick={goBack} style={{ marginBottom: "20px" }}>Back</button>
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <h2>Edit Expense</h2>
          <div style={{ marginBottom: "10px" }}>
            <label>Name: </label>
            <input 
              type="text" 
              value={editData.name} 
              onChange={(e) => setEditData({...editData, name: e.target.value})} 
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Amount: </label>
            <input 
              type="number" 
              value={editData.amount} 
              onChange={(e) => setEditData({...editData, amount: e.target.value})} 
            />
          </div>
          <button type="submit" style={{ marginRight: "10px", backgroundColor: "green", color: "white" }}>
            Save Changes
          </button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <h2>{expense.name}</h2>
          <h3>Expense Details</h3>
          <p>Amount: <strong>${expense.amount.toFixed(2)}</strong></p>
          <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
          <p>Type: {expense.category === 'one_time' ? 'One-Time Expense' : 'Monthly Recurring'}</p>
          <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
            <button onClick={() => setIsEditing(true)}>
              Edit Expense
            </button>
            <button 
              onClick={handleDelete} 
              style={{ backgroundColor: "red", color: "white", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" }}
            >
              Delete Expense
            </button>
          </div>
        </>
      )}
    </div>
  );
}