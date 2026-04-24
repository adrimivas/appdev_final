export function calculatePayoffMonths(balance, rate, payment) {
    let months = 0;
    let totalPaid = 0;
    const monthlyRate = (rate / 100) / 12;
    while (balance > 0 && months < 600) {
        const interest = balance * monthlyRate;
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