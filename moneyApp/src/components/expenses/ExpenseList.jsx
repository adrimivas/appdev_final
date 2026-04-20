export default function ExpenseList({ expenses }) {
  if (!expenses) return <p>Loading expenses...</p>;

  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const currentMonthData = expenses.monthly?.find(m => m.month === currentMonthStr);
  const [year, month] = currentMonthStr.split("-");
  const displayMonth = `${month}/${year}`;
  const cardStyle = {
    border: "1px solid white",
    borderRadius: "8px",
    padding: "10px",
    width: "150px",
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  };
  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    padding: "10px 0"
  };

  return (
    <div className="expense-sections">
      <div style={{ marginBottom: "20px" }}>
        <h3>Monthly Expenses ({displayMonth})</h3>
        <div style={containerStyle}>
            {currentMonthData?.items.length > 0 ? (
                currentMonthData.items.map((item, i) => (
                    <div key={i} style={cardStyle}>
                        <strong>{item.name}</strong>
                        <span>${item.amount.toFixed(2)}</span>
                    </div>
                ))
            ) : (
            <p>No monthly expenses for this month.</p>
            )}
        </div>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <h3>One-Time Expenses</h3>
        <div style={containerStyle}>
            {expenses.one_time?.length > 0 ? (
                expenses.one_time.map((exp, i) => (
                    <div key={i} style={cardStyle}>
                        <strong>{exp.name}</strong>
                        <span>${exp.amount.toFixed(2)}</span>
                        <small>{new Date(exp.date).toLocaleDateString()}</small>
                    </div>
                ))
            ) : (
            <p>No one-time expenses.</p>
            )}
        </div>
      </div>
    </div>
  );
}