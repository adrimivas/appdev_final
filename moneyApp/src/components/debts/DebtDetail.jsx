import { calculatePayoffMonths } from "../../utils/debtCalc";

export default function DebtDetail({ debt, goBack }) {
    const latestPayment = debt.payments[debt.payments.length - 1];
    const paymentAmount = latestPayment?.amount || debt.minimum_payment;
    const { months, totalPaid } = calculatePayoffMonths(
        debt.current_balance,
        debt.interest_rate,
        paymentAmount
    );
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return (
        <div>
            <button onClick={goBack}>Back</button>
            <h2>{debt.name}</h2>
            <p>Balance: ${debt.current_balance.toFixed(2)}</p>
            <p>Original: ${debt.original_amount.toFixed(2)}</p>
            <p>Interest: {(debt.interest_rate * 100).toFixed(2)}%</p>
            <p>Minimum Payment: ${debt.minimum_payment.toFixed(2)}</p>
            <p>Current Payment: ${paymentAmount.toFixed(2)}</p>
            <h3>Payoff Time</h3>
            <p>
                {months} months (~
                {years > 0 && `${years} ${years === 1 ? "year" : "years"} `}
                {remainingMonths > 0 && `${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`}
                )
            </p>
            <h3>Total Paid</h3>
            <p>${totalPaid.toFixed(2)}</p>
        </div>
    );
}