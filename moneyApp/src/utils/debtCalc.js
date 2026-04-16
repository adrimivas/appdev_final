export function calculatePayoffMonths(balance, rate, payment) {
    let months = 0;
    let totalPaid = 0;
    while (balance > 0 && months < 600) {
        const interest = balance * (rate / 12);
        balance = balance + interest - payment;
        totalPaid += payment;
        months++;
        if (balance < 0) {
            totalPaid += balance;
            balance = 0;
        }
    }
    return { 
        months,
        totalPaid: parseFloat(totalPaid.toFixed(2)) 
    };
}