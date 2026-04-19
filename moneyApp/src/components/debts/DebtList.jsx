export default function DebtList({ debts, onSelect }) {
    return (
        <div>
            <h3>All Debts</h3>
            {debts.length === 0 && <p>No debts found.</p>}
            {debts.map(debt => {
                const payments = debt.payments || [];
                const latestPayment = payments[payments.length - 1];
                return (
                    <div key={debt._id} onClick={() => onSelect(debt)}>
                        <p>{debt.name}</p>
                        <p>{new Date(debt.createdAt).toLocaleDateString()}</p>
                        <p>-${(latestPayment?.amount || debt.minimum_payment).toFixed(2)}/month</p>
                    </div>
                );
            })}
        </div>
    );
}