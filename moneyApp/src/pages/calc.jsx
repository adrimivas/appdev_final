import { useMemo, useState } from "react";

function formatMoney(value) {
  return Number(value || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function formatMonths(months) {
  if (!months || !Number.isFinite(months)) return "N/A";
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years === 0) return `${rem} months`;
  return `${years}y ${rem}m`;
}

/* =========================
   DEBT CALCULATOR
========================= */
function DebtCalculator() {
  const [balance, setBalance] = useState(12000);
  const [rate, setRate] = useState(18);
  const [minPay, setMinPay] = useState(300);
  const [extra, setExtra] = useState(100);

  const result = useMemo(() => {
    const principal = Number(balance) || 0;
    const r = (Number(rate) || 0) / 100 / 12;
    const payment = (Number(minPay) || 0) + (Number(extra) || 0);

    if (principal <= 0 || payment <= 0) {
      return { months: 0, interest: 0, total: 0 };
    }

    let remaining = principal;
    let months = 0;
    let interest = 0;

    while (remaining > 0 && months < 1000) {
      const i = remaining * r;
      interest += i;
      remaining = remaining + i - payment;
      months++;
    }

    return {
      months,
      interest,
      total: principal + interest,
      payment,
    };
  }, [balance, rate, minPay, extra]);

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2>Debt Payoff Calculator</h2>

      <div>
        <label>Balance</label>
        <input type="number" value={balance} onChange={e => setBalance(e.target.value)} />
      </div>

      <div>
        <label>Interest Rate (%)</label>
        <input type="number" value={rate} onChange={e => setRate(e.target.value)} />
      </div>

      <div>
        <label>Minimum Payment</label>
        <input type="number" value={minPay} onChange={e => setMinPay(e.target.value)} />
      </div>

      <div>
        <label>Extra Payment</label>
        <input type="number" value={extra} onChange={e => setExtra(e.target.value)} />
      </div>

      <table>
        <tbody>
          <tr>
            <td>Monthly Payment</td>
            <td>{formatMoney(result.payment)}</td>
          </tr>
          <tr>
            <td>Time to Payoff</td>
            <td>{formatMonths(result.months)}</td>
          </tr>
          <tr>
            <td>Total Interest</td>
            <td>{formatMoney(result.interest)}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

/* =========================
   BUDGET CALCULATOR
========================= */
function BudgetCalculator() {
  const [income, setIncome] = useState(4000);
  const [expenses, setExpenses] = useState(2000);
  const [debt, setDebt] = useState(500);

  const result = useMemo(() => {
    const leftover = income - expenses - debt;
    return {
      leftover,
      savings: leftover * 0.5,
      debtExtra: leftover * 0.3,
      spending: leftover * 0.2,
    };
  }, [income, expenses, debt]);

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2>Budget Calculator</h2>

      <div>
        <label>Income</label>
        <input type="number" value={income} onChange={e => setIncome(e.target.value)} />
      </div>

      <div>
        <label>Expenses</label>
        <input type="number" value={expenses} onChange={e => setExpenses(e.target.value)} />
      </div>

      <div>
        <label>Debt Payments</label>
        <input type="number" value={debt} onChange={e => setDebt(e.target.value)} />
      </div>

      <table>
        <tbody>
          <tr>
            <td>Leftover</td>
            <td>{formatMoney(result.leftover)}</td>
          </tr>
          <tr>
            <td>Savings</td>
            <td>{formatMoney(result.savings)}</td>
          </tr>
          <tr>
            <td>Extra Debt</td>
            <td>{formatMoney(result.debtExtra)}</td>
          </tr>
          <tr>
            <td>Spending</td>
            <td>{formatMoney(result.spending)}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

/* =========================
   EMERGENCY FUND
========================= */
function EmergencyCalculator() {
  const [monthly, setMonthly] = useState(2000);
  const [saved, setSaved] = useState(3000);
  const [months, setMonths] = useState(6);
  const [saveRate, setSaveRate] = useState(300);

  const result = useMemo(() => {
    const target = monthly * months;
    const needed = Math.max(target - saved, 0);
    const time = saveRate > 0 ? Math.ceil(needed / saveRate) : 0;

    return { target, needed, time };
  }, [monthly, saved, months, saveRate]);

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2>Emergency Fund Calculator</h2>

      <div>
        <label>Monthly Expenses</label>
        <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} />
      </div>

      <div>
        <label>Current Savings</label>
        <input type="number" value={saved} onChange={e => setSaved(e.target.value)} />
      </div>

      <div>
        <label>Months Goal</label>
        <input type="number" value={months} onChange={e => setMonths(e.target.value)} />
      </div>

      <div>
        <label>Monthly Saving</label>
        <input type="number" value={saveRate} onChange={e => setSaveRate(e.target.value)} />
      </div>

      <table>
        <tbody>
          <tr>
            <td>Target Fund</td>
            <td>{formatMoney(result.target)}</td>
          </tr>
          <tr>
            <td>Still Needed</td>
            <td>{formatMoney(result.needed)}</td>
          </tr>
          <tr>
            <td>Months to Goal</td>
            <td>{result.time} months</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

/* =========================
   PAGE
========================= */
export default function CalculatorPage() {
  return (
    <div>
      <h1>Financial Calculators</h1>

      <DebtCalculator />
      <BudgetCalculator />
      <EmergencyCalculator />
    </div>
  );
}