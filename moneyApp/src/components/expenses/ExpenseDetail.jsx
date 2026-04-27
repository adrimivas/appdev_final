import { useEffect, useState } from "react";

function formatMoney(value) {
  return Number(value || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

export default function ExpenseDetail({ expense, userId, goBack, refresh }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: expense?.name || "",
    amount: expense?.amount || 0,
    type: expense?.type || "",
    frequency: expense?.frequency || "monthly",
  });

  useEffect(() => {
    if (!expense) return;

    setEditData({
      name: expense.name || "",
      amount: expense.amount || 0,
      type: expense.type || "",
      frequency: expense.frequency || "monthly",
    });
  }, [expense]);

  if (!expense) return null;

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${expense.name}"?`)) {
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5001/api/expenses/${userId}/${expense._id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.ok) {
        refresh();
      } else {
        const data = await res.json();
        console.error("Failed to delete expense:", data);
        alert("Failed to delete expense.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:5001/api/expenses/${userId}/${expense._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newData: {
              name: editData.name,
              amount: Number(editData.amount) || 0,
              type: editData.type,
              frequency: editData.frequency,
            },
          }),
        }
      );

      if (res.ok) {
        setIsEditing(false);
        refresh();
      } else {
        const data = await res.json();
        console.error("Failed to update expense:", data);
        alert("Failed to update expense.");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "32px 20px 48px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          background: "#fff",
          padding: 32,
          borderRadius: 20,
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
        }}
      >
        <button
          onClick={goBack}
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #bbb",
            background: "#fff",
            cursor: "pointer",
            fontSize: 16,
            marginBottom: 20,
          }}
        >
          Back
        </button>

        {isEditing ? (
          <form
            onSubmit={handleUpdate}
            style={{
              display: "grid",
              gap: 12,
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            <h2 style={{ textAlign: "center", marginBottom: 8 }}>
              Edit Expense
            </h2>

            <input
              type="text"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              placeholder="Expense Name"
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
              type="number"
              value={editData.amount}
              onChange={(e) =>
                setEditData({ ...editData, amount: e.target.value })
              }
              placeholder="Amount"
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
              value={editData.type}
              onChange={(e) =>
                setEditData({ ...editData, type: e.target.value })
              }
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
              <option value="">Select Expense Type</option>
              <option value="Living">Living</option>
              <option value="Subscriptions">Subscriptions</option>
              <option value="Personal">Personal</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={editData.frequency}
              onChange={(e) =>
                setEditData({ ...editData, frequency: e.target.value })
              }
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

            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
              <button
                type="submit"
                style={{
                  backgroundColor: "green",
                  color: "white",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "1px solid #bbb",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2 style={{ textAlign: "center", marginTop: 0 }}>{expense.name}</h2>

            <div
              style={{
                maxWidth: 520,
                margin: "0 auto",
                color: "#555",
                lineHeight: 1.8,
                fontSize: 18,
              }}
            >
              <p>Amount: {formatMoney(expense.amount || 0)}</p>
              <p>Type: {expense.type || "N/A"}</p>
              <p>Frequency: {expense.frequency || "monthly"}</p>
            </div>

            <div
              style={{
                marginTop: 30,
                display: "flex",
                gap: 10,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "1px solid #bbb",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Edit Expense
              </button>

              <button
                onClick={handleDelete}
                style={{
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Delete Expense
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}