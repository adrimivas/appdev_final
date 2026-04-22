import { useState, useEffect } from "react";
import { calculatePayoffMonths } from "../../utils/debtCalc";

function getMonthlyInterestAmount(balance, annualRate) {
  return Number(balance || 0) * (Number(annualRate || 0) / 100 / 12);
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

export default function DebtDetail({ debt, goBack, userId, refresh }) {
  const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState({
    name: debt?.name || "",
    type: debt?.type || "",
    original_amount: debt?.original_amount || 0,
    current_balance: debt?.current_balance || 0,
    interest_rate: debt?.interest_rate || 0,
    minimum_payment: debt?.minimum_payment || 0,
    current_payment: debt?.current_payment || debt?.minimum_payment || 0,
  });

  useEffect(() => {
    if (!debt) return;

    setEditData({
      name: debt.name || "",
      type: debt.type || "",
      original_amount: debt.original_amount || 0,
      current_balance: debt.current_balance || 0,
      interest_rate: debt.interest_rate || 0,
      minimum_payment: debt.minimum_payment || 0,
      current_payment: debt.current_payment || debt.minimum_payment || 0,
    });
  }, [debt]);

  if (!debt) return null;

  const paymentAmount = Number(debt.current_payment || debt.minimum_payment || 0);

  const { months, totalPaid } = calculatePayoffMonths(
    Number(debt.current_balance || 0),
    Number(debt.interest_rate || 0),
    paymentAmount
  );

  const totalInterest = totalPaid - Number(debt.current_balance || 0);
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${debt.name}?`)) return;

    try {
      const res = await fetch(`http://localhost:5001/api/debts/${userId}/${debt._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) refresh();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5001/api/debts/${userId}/${debt._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newData: {
            ...editData,
            original_amount: Number(editData.original_amount),
            current_balance: Number(editData.current_balance),
            interest_rate: Number(editData.interest_rate),
            minimum_payment: Number(editData.minimum_payment),
            current_payment: Number(editData.current_payment),
          },
        }),
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
            <h2 style={{ textAlign: "center", marginBottom: 8 }}>Edit {debt.name}</h2>

            <label>Name</label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />

            <label>Type</label>
            <input
              type="text"
              value={editData.type}
              onChange={(e) => setEditData({ ...editData, type: e.target.value })}
            />

            <label>Original Balance</label>
            <input
              type="number"
              value={editData.original_amount}
              onChange={(e) =>
                setEditData({ ...editData, original_amount: e.target.value })
              }
            />

            <label>Current Balance</label>
            <input
              type="number"
              value={editData.current_balance}
              onChange={(e) =>
                setEditData({ ...editData, current_balance: e.target.value })
              }
            />

            <label>Interest Rate (%)</label>
            <input
              type="number"
              step="0.01"
              value={editData.interest_rate}
              onChange={(e) =>
                setEditData({ ...editData, interest_rate: e.target.value })
              }
            />

            <label>Minimum Payment</label>
            <input
              type="number"
              value={editData.minimum_payment}
              onChange={(e) =>
                setEditData({ ...editData, minimum_payment: e.target.value })
              }
            />

            <label>Current Payment</label>
            <input
              type="number"
              value={editData.current_payment}
              onChange={(e) =>
                setEditData({ ...editData, current_payment: e.target.value })
              }
            />

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
            <h2 style={{ textAlign: "center", marginTop: 0 }}>{debt.name}</h2>

            <div
              style={{
                maxWidth: 520,
                margin: "0 auto",
                color: "#555",
                lineHeight: 1.8,
                fontSize: 18,
              }}
            >
              <p>Type: {debt.type || "N/A"}</p>
              <p>Current Balance: {formatMoney(debt.current_balance || 0)}</p>
              <p>Original Balance: {formatMoney(debt.original_amount || 0)}</p>
              <p>Interest: {(debt.interest_rate || 0).toFixed(2)}%</p>
              <p>Minimum Payment: {formatMoney(debt.minimum_payment || 0)}</p>
              <p>Current Payment: {formatMoney(paymentAmount)}</p>

              <hr style={{ margin: "20px 0" }} />

              <h3>Payoff Time</h3>
              <p>
                {months} months (~
                {years > 0 && `${years} ${years === 1 ? "year" : "years"} `}
                {remainingMonths > 0 &&
                  `${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`}
                )
              </p>

              <h3>Total Paid</h3>
              <p>{formatMoney(totalPaid)}</p>

              <h3>Total Interest</h3>
              <p>{formatMoney(totalInterest)}</p>
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
                Edit Debt
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
                Delete Debt
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}