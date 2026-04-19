export default function DebtList({ debts, onSelect }) {
    const containerStyle = {
        display: "flex",
        flexWrap: "wrap",
        gap: "15px",
        padding: "10px 0"
    };
    const cardStyle = {
        border: "1px solid white",
        borderRadius: "8px",
        padding: "15px",
        width: "180px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "5px"
    };
    return (
        <div>
            <h3>All Debts</h3>
            <div style={containerStyle}>
                {debts.length === 0 && <p>No debts found.</p>}
                {debts.map(debt => {
                    const payments = debt.payments || [];
                    const latestPayment = payments[payments.length - 1];
                    return (
                        <div key={debt._id} onClick={() => onSelect(debt)} style={cardStyle}>
                            <strong>{debt.name}</strong>
                            <small>{new Date(debt.createdAt).toLocaleDateString()}</small>
                            <span>-${(latestPayment?.amount || debt.minimum_payment).toFixed(2)}/month</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}