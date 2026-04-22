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

function DebtCalculator() {
  const [balance, setBalance] = useState(12000);
  const [rate, setRate] = useState(18);
  const [minPay, setMinPay] = useState(300);
  const [extra, setExtra] = useState(0);

  const calculatePayoff = (principal, annualRate, monthlyPayment) => {
    const safePrincipal = Number(principal) || 0;
    const monthlyRate = (Number(annualRate) || 0) / 100 / 12;
    const payment = Number(monthlyPayment) || 0;

    if (safePrincipal <= 0 || payment <= 0) {
      return {
        months: 0,
        interest: 0,
        total: 0,
        payment: 0,
        canPayOff: false,
      };
    }

    if (monthlyRate > 0 && payment <= safePrincipal * monthlyRate) {
      return {
        months: Infinity,
        interest: Infinity,
        total: Infinity,
        payment,
        canPayOff: false,
      };
    }

    let remaining = safePrincipal;
    let months = 0;
    let interest = 0;

    while (remaining > 0 && months < 1000) {
      const monthlyInterest = remaining * monthlyRate;
      interest += monthlyInterest;
      remaining = remaining + monthlyInterest - payment;
      months++;
    }

    if (remaining > 0) {
      return {
        months: Infinity,
        interest: Infinity,
        total: Infinity,
        payment,
        canPayOff: false,
      };
    }

    return {
      months,
      interest,
      total: safePrincipal + interest,
      payment,
      canPayOff: true,
    };
  };

  const baseResult = useMemo(() => {
    return calculatePayoff(balance, rate, minPay);
  }, [balance, rate, minPay]);

  const result = useMemo(() => {
    const totalPayment = (Number(minPay) || 0) + (Number(extra) || 0);
    return calculatePayoff(balance, rate, totalPayment);
  }, [balance, rate, minPay, extra]);

  const savings = useMemo(() => {
    if (!result.canPayOff || !baseResult.canPayOff) {
      return {
        totalSaved: 0,
        interestSaved: 0,
        monthsSaved: 0,
      };
    }

    return {
      totalSaved: Math.max(baseResult.total - result.total, 0),
      interestSaved: Math.max(baseResult.interest - result.interest, 0),
      monthsSaved: Math.max(baseResult.months - result.months, 0),
    };
  }, [baseResult, result]);

  return (
    <section
      style={{
        background: "#fff",
        padding: 32,
        borderRadius: 20,
        boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
        width: "100%",
        maxWidth: 900,
        margin: "0 auto 32px auto",
        fontSize: 14,
      }}
    >
      <div style={{ marginBottom: 20, textAlign: "center" }}>
        <h2 style={{ margin: 0, fontSize: 32 }}>Debt Payoff Calculator</h2>
        <p style={{ margin: "8px 0 0 0", color: "#666" }}>
          Enter your debt details below to estimate payoff time and interest.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: 16,
          maxWidth: 520,
          margin: "0 auto",
        }}
      >
        <div>
          <label style={{ display: "block", marginBottom: 8, fontSize: 18 }}>
            Current Debt Balance
          </label>
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            style={{
              width: "100%",
              padding: 14,
              fontSize: 18,
              borderRadius: 10,
              border: "1px solid #aaa",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 8, fontSize: 18 }}>
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            style={{
              width: "100%",
              padding: 14,
              fontSize: 18,
              borderRadius: 10,
              border: "1px solid #aaa",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 8, fontSize: 18 }}>
            Required Monthly Payment
          </label>
          <input
            type="number"
            value={minPay}
            onChange={(e) => setMinPay(Number(e.target.value))}
            style={{
              width: "100%",
              padding: 14,
              fontSize: 18,
              borderRadius: 10,
              border: "1px solid #aaa",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 8, fontSize: 18 }}>
            Extra Monthly Payment
          </label>
          <input
            type="number"
            value={extra}
            onChange={(e) => setExtra(Number(e.target.value))}
            style={{
              width: "100%",
              padding: 14,
              fontSize: 18,
              borderRadius: 10,
              border: "1px solid #aaa",
            }}
          />
        </div>
      </div>

      <div
        style={{
          maxWidth: 520,
          margin: "28px auto 0 auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ padding: "10px 0", fontSize: 18 }}>Total Monthly Payment</td>
              <td style={{ padding: "10px 0", textAlign: "right", fontSize: 18 }}>
                {formatMoney(result.payment)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px 0", fontSize: 18 }}>Estimated Payoff Time</td>
              <td style={{ padding: "10px 0", textAlign: "right", fontSize: 18 }}>
                {result.canPayOff ? formatMonths(result.months) : "Payment too low"}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px 0", fontSize: 18 }}>Estimated Interest Paid</td>
              <td style={{ padding: "10px 0", textAlign: "right", fontSize: 18 }}>
                {result.canPayOff ? formatMoney(result.interest) : "N/A"}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px 0", fontSize: 18 }}>Estimated Total Paid</td>
              <td style={{ padding: "10px 0", textAlign: "right", fontSize: 18 }}>
                {result.canPayOff ? formatMoney(result.total) : "N/A"}
              </td>
            </tr>
          </tbody>
        </table>

        {Number(extra) > 0 && result.canPayOff && baseResult.canPayOff && (
          <div
            style={{
              marginTop: 24,
              padding: 18,
              borderRadius: 14,
              background: "#f3f0ff",
              border: "1px solid #d8cffc",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 18,
                lineHeight: 1.6,
                color: "#4b3f72",
                textAlign: "center",
              }}
            >
              By paying an extra <strong>{formatMoney(extra)}</strong> each month, you save{" "}
              <strong>{formatMoney(savings.totalSaved)}</strong> overall, including{" "}
              <strong>{formatMoney(savings.interestSaved)}</strong> in interest, and pay off
              your debt <strong>{formatMonths(savings.monthsSaved)}</strong> sooner.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function BudgetCalculator() {
  const [income, setIncome] = useState(4000);
  const [expenses, setExpenses] = useState(2000);
  const [debt, setDebt] = useState(500);

  const result = useMemo(() => {
    const leftover = income - expenses - debt;
    return {
      leftover,
      savings: leftover * 0.5,
      spending: leftover * 0.2,
    };
  }, [income, expenses, debt]);

  return (
    <section
      style={{
        background: "#fff",
        padding: 32,
        borderRadius: 20,
        boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
        width: "100%",
        maxWidth: 900,
        margin: "0 auto 32px auto",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Monthly Budget Planner</h2>

<p
  style={{
    maxWidth: 520,
    margin: "8px auto 20px auto",
    color: "#555",
    textAlign: "center",
    lineHeight: 1.6,
    fontSize: 14,
  }}
>
  Balance your income against expenses to control spending and increase savings.
</p>

      <div style={{ display: "grid", gap: 16, maxWidth: 520, margin: "0 auto" }}>
        <div>
          <label style={{ display: "block", marginBottom: 8 }}>Monthly Take-Home Income</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            style={{ width: "100%", padding: 14, borderRadius: 10, border: "1px solid #aaa" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 8 }}>Monthly Living Expenses</label>
          <input
            type="number"
            value={expenses}
            onChange={(e) => setExpenses(Number(e.target.value))}
            style={{ width: "100%", padding: 14, borderRadius: 10, border: "1px solid #aaa" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 8 }}>Monthly Debt Payments</label>
          <input
            type="number"
            value={debt}
            onChange={(e) => setDebt(Number(e.target.value))}
            style={{ width: "100%", padding: 14, borderRadius: 10, border: "1px solid #aaa" }}
          />
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "28px auto 0 auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ padding: "10px 0" }}>Money Left After Bills</td>
              <td style={{ padding: "10px 0", textAlign: "right" }}>
                {formatMoney(result.leftover)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px 0" }}>Suggested Savings Amount</td>
              <td style={{ padding: "10px 0", textAlign: "right" }}>
                {formatMoney(result.savings)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px 0" }}>Suggested Flexible Spending</td>
              <td style={{ padding: "10px 0", textAlign: "right" }}>
                {formatMoney(result.spending)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

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
    <section
      style={{
        background: "#fff",
        padding: 32,
        borderRadius: 20,
        boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Emergency Fund Calculator</h2>

      <p
        style={{
          maxWidth: 520,
          margin: "0 auto 20px auto",
          color: "#555",
          textAlign: "center",
          lineHeight: 1.6,
          fontSize: 14,
        }}
      >
        An emergency fund should generally cover three to six months of essential living
        expenses.
      </p>

      <div style={{ display: "grid", gap: 16, maxWidth: 520, margin: "0 auto" }}>
        <div>
          <label style={{ display: "block", marginBottom: 8 }}>Essential Monthly Expenses</label>
          <input
            type="number"
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value))}
            style={{ width: "100%", padding: 14, borderRadius: 10, border: "1px solid #aaa" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 8 }}>
            Emergency Savings Already Set Aside
          </label>
          <input
            type="number"
            value={saved}
            onChange={(e) => setSaved(Number(e.target.value))}
            style={{ width: "100%", padding: 14, borderRadius: 10, border: "1px solid #aaa" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 8 }}>Emergency Fund Goal (Months)</label>
          <input
            type="number"
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            style={{ width: "100%", padding: 14, borderRadius: 10, border: "1px solid #aaa" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 8 }}>Amount Saved Per Month</label>
          <input
            type="number"
            value={saveRate}
            onChange={(e) => setSaveRate(Number(e.target.value))}
            style={{ width: "100%", padding: 14, borderRadius: 10, border: "1px solid #aaa" }}
          />
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "28px auto 0 auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ padding: "10px 0" }}>Emergency Fund Target</td>
              <td style={{ padding: "10px 0", textAlign: "right" }}>
                {formatMoney(result.target)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px 0" }}>Amount Still Needed</td>
              <td style={{ padding: "10px 0", textAlign: "right" }}>
                {formatMoney(result.needed)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px 0" }}>Estimated Time to Reach Goal</td>
              <td style={{ padding: "10px 0", textAlign: "right" }}>
                {result.time} months
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function CalculatorPage() {
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
          maxWidth: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1 style={{ textAlign: "center", marginTop: 0, marginBottom: 12 }}>
          Financial Calculators
        </h1>

        <p
          style={{
            textAlign: "center",
            maxWidth: 700,
            margin: "32px auto 28px auto",
            color: "#555",
            lineHeight: 1.6,
            fontSize: 12,
          }}
        >
          Disclaimer: Estimates are for informational purposes only and may not
          reflect exact results.
          <br />
          <br />
          The calculator page is designed to help users make smarter financial
          decisions by providing interactive tools for debt repayment,
          budgeting, and emergency fund planning. It gives users quick
          estimates and practical insights based on the numbers they enter.
        </p>

        <DebtCalculator />
        <BudgetCalculator />
        <EmergencyCalculator />
      </div>
    </div>
  );
}