import { useEffect, useMemo, useState } from "react";

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

function DebtCalculator({ debts = [] }) {
  const [balance, setBalance] = useState(12000);
  const [rate, setRate] = useState(18);
  const [minPay, setMinPay] = useState(300);
  const [extra, setExtra] = useState(0);
  const [showDebtPicker, setShowDebtPicker] = useState(false);
  const [selectedDebtId, setSelectedDebtId] = useState(null);

  const applyDebt = (debt) => {
    setBalance(Number(debt.current_balance || 0));
    setRate(Number(debt.interest_rate || 0));
    setMinPay(Number(debt.minimum_payment || 0));
    setSelectedDebtId(debt.id);
    setShowDebtPicker(false);
  };

  const selectedDebt = debts.find((debt) => debt.id === selectedDebtId);

  const result = useMemo(() => {
    const principal = Number(balance) || 0;
    const monthlyRate = (Number(rate) || 0) / 100 / 12;
    const minimumPayment = Number(minPay) || 0;
    const extraPayment = Number(extra) || 0;
    const payment = minimumPayment + extraPayment;

    if (principal <= 0 || payment <= 0) {
      return {
        months: 0,
        interest: 0,
        total: 0,
        payment: 0,
      };
    }

    let remaining = principal;
    let months = 0;
    let interest = 0;

    while (remaining > 0 && months < 1000) {
      const monthlyInterest = remaining * monthlyRate;
      interest += monthlyInterest;
      remaining = remaining + monthlyInterest - payment;
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 32 }}>Debt Payoff Calculator</h2>
          {selectedDebt ? (
            <p style={{ margin: "8px 0 0 0", color: "#666" }}>
              Using saved debt: <strong>{selectedDebt.name}</strong>
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setShowDebtPicker((prev) => !prev)}
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #bbb",
            background: "#fff",
            cursor: "pointer",
            fontSize: 16,
            whiteSpace: "nowrap",
          }}
        >
          {showDebtPicker ? "Close" : "Test with your debt(s)"}
        </button>
      </div>

      {showDebtPicker && (
        <div
          style={{
            border: "1px solid #e3e3e3",
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            background: "#fafafa",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: 16,
              textAlign: "center",
              fontSize: 22,
            }}
          >
            Click one of your debts to test various payment scenarios
          </h3>

          {debts.length === 0 ? (
            <p style={{ textAlign: "center", margin: 0, color: "#666" }}>
              No saved debts found.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 14,
              }}
            >
              {debts.map((debt) => {
                const isSelected = selectedDebtId === debt.id;

                return (
                  <button
                    key={debt.id}
                    type="button"
                    onClick={() => applyDebt(debt)}
                    style={{
                      textAlign: "left",
                      padding: 16,
                      borderRadius: 14,
                      border: isSelected ? "2px solid #4f46e5" : "1px solid #d7d7d7",
                      background: isSelected ? "#eef2ff" : "#fff",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>
                      {debt.name || "Unnamed Debt"}
                    </div>

                    <div style={{ color: "#666", fontSize: 14, lineHeight: 1.6 }}>
                      <div>Type: {debt.type || "N/A"}</div>
                      <div>
                        Current Balance: {formatMoney(debt.current_balance)}
                      </div>
                      <div>Interest Rate: {Number(debt.interest_rate || 0)}%</div>
                      <div>
                        Minimum Payment: {formatMoney(debt.minimum_payment)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

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
            onChange={(e) => setBalance(e.target.value)}
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
            onChange={(e) => setRate(e.target.value)}
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
            onChange={(e) => setMinPay(e.target.value)}
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
            onChange={(e) => setExtra(e.target.value)}
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
                {formatMonths(result.months)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px 0", fontSize: 18 }}>Estimated Interest Paid</td>
              <td style={{ padding: "10px 0", textAlign: "right", fontSize: 18 }}>
                {formatMoney(result.interest)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px 0", fontSize: 18 }}>Estimated Total Paid</td>
              <td style={{ padding: "10px 0", textAlign: "right", fontSize: 18 }}>
                {formatMoney(result.total)}
              </td>
            </tr>
          </tbody>
        </table>
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
      debtExtra: leftover * 0.3,
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
              <td style={{ padding: "10px 0", textAlign: "right" }}>{formatMoney(result.leftover)}</td>
            </tr>
            <tr>
              <td style={{ padding: "10px 0" }}>Suggested Savings Amount</td>
              <td style={{ padding: "10px 0", textAlign: "right" }}>{formatMoney(result.savings)}</td>
            </tr>
            <tr>
              <td style={{ padding: "10px 0" }}>Suggested Extra Debt Payment</td>
              <td style={{ padding: "10px 0", textAlign: "right" }}>{formatMoney(result.debtExtra)}</td>
            </tr>
            <tr>
              <td style={{ padding: "10px 0" }}>Suggested Flexible Spending</td>
              <td style={{ padding: "10px 0", textAlign: "right" }}>{formatMoney(result.spending)}</td>
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
              <td style={{ padding: "10px 0", textAlign: "right" }}>{formatMoney(result.target)}</td>
            </tr>
            <tr>
              <td style={{ padding: "10px 0" }}>Amount Still Needed</td>
              <td style={{ padding: "10px 0", textAlign: "right" }}>{formatMoney(result.needed)}</td>
            </tr>
            <tr>
              <td style={{ padding: "10px 0" }}>Estimated Time to Reach Goal</td>
              <td style={{ padding: "10px 0", textAlign: "right" }}>{result.time} months</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function CalculatorPage() {
  const [user, setUser] = useState(null);
  const [debts, setDebts] = useState([]);
  const [loadingDebts, setLoadingDebts] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setMessage("Please log in to use the calculators.");
      setLoadingDebts(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5001/users/${userId}`);
        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Could not load calculator data.");
          setLoadingDebts(false);
          return;
        }

        const loadedUser = data.user;
        setUser(loadedUser);

        const monthlyExpenses = Array.isArray(loadedUser?.expenses?.monthly)
          ? loadedUser.expenses.monthly
          : [];

        const debtItems = monthlyExpenses
          .filter(
            (item) => String(item?.category || "").toLowerCase().trim() === "debt"
          )
          .map((item, index) => ({
            id: item?._id || item?.id || `${item?.name || "debt"}-${index}`,
            name: item?.name || item?.type || "Unnamed Debt",
            type: item?.type || "N/A",
            current_balance: Number(item?.current_balance || 0),
            interest_rate: Number(item?.interest_rate || 0),
            minimum_payment: Number(item?.minimum_payment || item?.amount || 0),
          }));

        setDebts(debtItems);
      } catch (error) {
        console.error("Calculator fetch error:", error);
        setMessage("Failed to load calculator data.");
      } finally {
        setLoadingDebts(false);
      }
    };

    fetchUser();
  }, []);

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
      <div style={{ width: "100%", maxWidth: 1000 }}>
        <h1 style={{ textAlign: "center", marginTop: 0, marginBottom: 28 }}>
          Financial Calculators
        </h1>

        {message ? (
          <p style={{ textAlign: "center" }}>{message}</p>
        ) : loadingDebts ? (
          <p style={{ textAlign: "center" }}>Loading saved debts...</p>
        ) : (
          <DebtCalculator debts={debts} />
        )}

        <BudgetCalculator />
        <EmergencyCalculator />
      </div>
    </div>
  );
}