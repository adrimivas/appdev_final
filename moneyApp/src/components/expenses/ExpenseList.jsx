export default function ExpenseList({ expenses }) {
  if (!expenses) return <p>Loading expenses...</p>;

  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const currentMonthData = expenses.monthly?.find(m => m.month === currentMonthStr);

  return (
    <div className="expense-sections">
      <div style={{ marginBottom: "20px" }}>
        <h3>Monthly Expenses ({currentMonthStr})</h3>
        {currentMonthData?.items.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {currentMonthData.items.map((item, i) => (
              <li key={i} style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                <strong>{item.name}</strong>: ${item.amount.toFixed(2)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No monthly expenses for this month.</p>
        )}
      </div>
      <div style={{ marginBottom: "20px" }}>
        <h3>One-Time Expenses</h3>
        {expenses.one_time?.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {expenses.one_time.map((exp, i) => (
              <li key={i} style={{ padding: "8px", borderBottom: "1px solid #eee", color: "#555" }}>
                <span>{exp.name}</span>: <strong>${exp.amount.toFixed(2)}</strong>
                <br />
                <small>{new Date(exp.date).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No one-time expenses.</p>
        )}
      </div>
    </div>
  );
}