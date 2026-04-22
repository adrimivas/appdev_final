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

function sectionCardStyle() {
  return {
    background: "#fff",
    padding: 32,
    borderRadius: 20,
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    width: "100%",
    maxWidth: 900,
    margin: "0 auto 32px auto",
  };
}

function inputStyle() {
  return {
    width: "100%",
    padding: "22px 28px",
    fontSize: 24,
    borderRadius: 20,
    border: "2px solid #b9b9b9",
    outline: "none",
    boxSizing: "border-box",
    background: "#fff",
  };
}

function labelStyle() {
  return {
    display: "block",
    marginBottom: 14,
    fontSize: 18,
    color: "#746c82",
    textAlign: "center",
    fontWeight: 500,
  };
}

function secondaryButtonStyle() {
  return {
    padding: "18px 28px",
    borderRadius: 20,
    border: "2px solid #b9b9b9",
    background: "#fff",
    cursor: "pointer",
    fontSize: 22,
    whiteSpace: "nowrap",
  };
}

function DebtCalculator({ debts = [], loadingDebts = false, debtMessage = "" }) {
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

  const clearSavedDebt = () => {
    setSelectedDebtId(null);
    setBalance(12000);
    setRate(18);
    setMinPay(300);
    setExtra(0);
  };

  const selectedDebt = debts.find((debt) => debt.id === selectedDebtId);

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
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "start",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div style={{ textAlign: "center", paddingLeft: 120 }}>
          <h2 style={{ margin: 0, fontSize: 32 }}>Debt Payoff Calculator</h2>

          {!selectedDebt && (
            <p
              style={{
                margin: "8px auto 0 auto",
                color: "#666",
                fontSize: 18,
                lineHeight: 1.5,
                maxWidth: 520,
              }}
            >
              Enter your debt details below to estimate payoff time and interest.
            </p>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
      </div>

      {selectedDebt && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 18,
              color: "#666",
            }}
          >
            Using saved debt: <strong>{selectedDebt.name}</strong>
          </p>

          <button
            type="button"
            onClick={clearSavedDebt}
            style={{
              background: "transparent",
              border: "none",
              color: "#9b7cf3",
              cursor: "pointer",
              fontSize: 16,
              padding: 0,
            }}
          >
            Remove saved debt
          </button>
        </div>
      )}

      {loadingDebts && (
        <p style={{ textAlign: "center", marginBottom: 16, color: "#666" }}>
          Loading saved debts...
        </p>
      )}

      {!loadingDebts && debtMessage && (
        <p style={{ textAlign: "center", marginBottom: 16, color: "#666" }}>
          {debtMessage}
        </p>
      )}

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
            Click one of your debts to autofill the calculator
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
                      <div>Current Balance: {formatMoney(debt.current_balance)}</div>
                      <div>Interest Rate: {Number(debt.interest_rate || 0)}%</div>
                      <div>Minimum Payment: {formatMoney(debt.minimum_payment)}</div>
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
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: 18,
              color: "#746c82",
              textAlign: "center",
            }}
          >
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
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: 18,
              color: "#746c82",
              textAlign: "center",
            }}
          >
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
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: 18,
              color: "#746c82",
              textAlign: "center",
            }}
          >
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
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: 18,
              color: "#746c82",
              textAlign: "center",
            }}
          >
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
              boxSizing: "border-box",
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
  const [savingsPct, setSavingsPct] = useState(50);
  const [spendingPct, setSpendingPct] = useState(20);

  const result = useMemo(() => {
    const leftover = income - expenses - debt;
    const safeLeftover = Math.max(leftover, 0);

    return {
      leftover,
      savings: safeLeftover * (savingsPct / 100),
      spending: safeLeftover * (spendingPct / 100),
    };
  }, [income, expenses, debt, savingsPct, spendingPct]);

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
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 32 }}>Monthly Budget Planner</h2>

        <p
          style={{
            margin: "8px auto 0 auto",
            color: "#666",
            fontSize: 14,
            lineHeight: 1.6,
            maxWidth: 520,
          }}
        >
          Balance your income against expenses to control spending and increase savings.
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
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: 18,
              color: "#746c82",
              textAlign: "center",
            }}
          >
            Monthly Take-Home Income
          </label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            style={{
              width: "100%",
              padding: 14,
              fontSize: 18,
              borderRadius: 10,
              border: "1px solid #aaa",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: 18,
              color: "#746c82",
              textAlign: "center",
            }}
          >
            Monthly Living Expenses
          </label>
          <input
            type="number"
            value={expenses}
            onChange={(e) => setExpenses(Number(e.target.value))}
            style={{
              width: "100%",
              padding: 14,
              fontSize: 18,
              borderRadius: 10,
              border: "1px solid #aaa",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: 18,
              color: "#746c82",
              textAlign: "center",
            }}
          >
            Monthly Debt Payments
          </label>
          <input
            type="number"
            value={debt}
            onChange={(e) => setDebt(Number(e.target.value))}
            style={{
              width: "100%",
              padding: 14,
              fontSize: 18,
              borderRadius: 10,
              border: "1px solid #aaa",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      <div
        style={{
          maxWidth: 520,
          margin: "24px auto 0 auto",
          padding: 16,
          borderRadius: 14,
          background: "#faf8ff",
          border: "1px solid #e3dbff",
        }}
      >
        <p
          style={{
            margin: "0 0 14px 0",
            textAlign: "center",
            color: "#666",
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          We suggest starting with these percentages of your remaining cash after bills. You can adjust them to try
          different planning options.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                textAlign: "center",
                fontSize: 16,
                color: "#746c82",
              }}
            >
              Savings %
            </label>
            <input
              type="number"
              value={savingsPct}
              onChange={(e) => setSavingsPct(Number(e.target.value))}
              style={{
                width: "100%",
                padding: 12,
                fontSize: 16,
                borderRadius: 10,
                border: "1px solid #aaa",
                textAlign: "center",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                textAlign: "center",
                fontSize: 16,
                color: "#746c82",
              }}
            >
              Flexible Spending %
            </label>
            <input
              type="number"
              value={spendingPct}
              onChange={(e) => setSpendingPct(Number(e.target.value))}
              style={{
                width: "100%",
                padding: 12,
                fontSize: 16,
                borderRadius: 10,
                border: "1px solid #aaa",
                textAlign: "center",
                boxSizing: "border-box",
              }}
            />
          </div>
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
              <td style={{ padding: "10px 0", fontSize: 18 }}>Money Left After Bills</td>
              <td style={{ padding: "10px 0", textAlign: "right", fontSize: 18 }}>
                {formatMoney(result.leftover)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px 0", fontSize: 18 }}>
                Suggested Savings ({savingsPct}%)
              </td>
              <td style={{ padding: "10px 0", textAlign: "right", fontSize: 18 }}>
                {formatMoney(result.savings)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px 0", fontSize: 18 }}>
                Suggested Flexible Spending ({spendingPct}%)
              </td>
              <td style={{ padding: "10px 0", textAlign: "right", fontSize: 18 }}>
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
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 32 }}>Emergency Fund Calculator</h2>

        <p
          style={{
            margin: "8px auto 0 auto",
            color: "#666",
            fontSize: 14,
            lineHeight: 1.6,
            maxWidth: 520,
          }}
        >
          An emergency fund should generally cover three to six months of essential
          living expenses.
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
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: 18,
              color: "#746c82",
              textAlign: "center",
            }}
          >
            Essential Monthly Expenses
          </label>
          <input
            type="number"
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value))}
            style={{
              width: "100%",
              padding: 14,
              fontSize: 18,
              borderRadius: 10,
              border: "1px solid #aaa",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: 18,
              color: "#746c82",
              textAlign: "center",
            }}
          >
            Emergency Savings Already Set Aside
          </label>
          <input
            type="number"
            value={saved}
            onChange={(e) => setSaved(Number(e.target.value))}
            style={{
              width: "100%",
              padding: 14,
              fontSize: 18,
              borderRadius: 10,
              border: "1px solid #aaa",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: 18,
              color: "#746c82",
              textAlign: "center",
            }}
          >
            Emergency Fund Goal (Months)
          </label>
          <input
            type="number"
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            style={{
              width: "100%",
              padding: 14,
              fontSize: 18,
              borderRadius: 10,
              border: "1px solid #aaa",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: 18,
              color: "#746c82",
              textAlign: "center",
            }}
          >
            Amount Saved Per Month
          </label>
          <input
            type="number"
            value={saveRate}
            onChange={(e) => setSaveRate(Number(e.target.value))}
            style={{
              width: "100%",
              padding: 14,
              fontSize: 18,
              borderRadius: 10,
              border: "1px solid #aaa",
              boxSizing: "border-box",
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
              <td style={{ padding: "10px 0", fontSize: 18 }}>Emergency Fund Target</td>
              <td style={{ padding: "10px 0", textAlign: "right", fontSize: 18 }}>
                {formatMoney(result.target)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px 0", fontSize: 18 }}>Amount Still Needed</td>
              <td style={{ padding: "10px 0", textAlign: "right", fontSize: 18 }}>
                {formatMoney(result.needed)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px 0", fontSize: 18 }}>Estimated Time to Reach Goal</td>
              <td style={{ padding: "10px 0", textAlign: "right", fontSize: 18 }}>
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
  const [debts, setDebts] = useState([]);
  const [loadingDebts, setLoadingDebts] = useState(true);
  const [debtMessage, setDebtMessage] = useState("");

  useEffect(() => {
    const fetchUserDebts = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          setDebtMessage("Log in to use saved debt autofill, or enter values manually.");
          setDebts([]);
          setLoadingDebts(false);
          return;
        }

        const response = await fetch(`http://localhost:5001/users/${userId}`);

        if (!response.ok) {
          setDebtMessage("Could not load saved debts. You can still enter values manually.");
          setDebts([]);
          setLoadingDebts(false);
          return;
        }

        const data = await response.json();
        const loadedUser = data.user;

        const monthlyExpenses = Array.isArray(loadedUser?.expenses?.monthly)
          ? loadedUser.expenses.monthly
          : [];

        const debtItems = monthlyExpenses
          .filter((item) => String(item?.category || "").toLowerCase().trim() === "debt")
          .map((item, index) => ({
            id: item?._id || `${item?.name || "debt"}-${index}`,
            name: item?.name || "Unnamed Debt",
            type: item?.type || "N/A",
            current_balance: Number(item?.current_balance || 0),
            interest_rate: Number(item?.interest_rate || 0),
            minimum_payment: Number(item?.minimum_payment || item?.amount || 0),
          }));

        setDebts(debtItems);

        if (debtItems.length === 0) {
          setDebtMessage("No saved debts found. You can still enter values manually.");
        } else {
          setDebtMessage("");
        }
      } catch (error) {
        console.error("Debt fetch error:", error);
        setDebtMessage("Failed to load saved debts. You can still enter values manually.");
        setDebts([]);
      } finally {
        setLoadingDebts(false);
      }
    };

    fetchUserDebts();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 24px 56px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1640,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginTop: 0,
            marginBottom: 12,
            fontSize: 42,
          }}
        >
          Financial Calculators
        </h1>

        <p
          style={{
            textAlign: "center",
            maxWidth: 920,
            margin: "0 auto 32px auto",
            color: "#555",
            lineHeight: 1.7,
            fontSize: 14,
          }}
        >
          <br />
          Disclaimer: Estimates are for informational purposes only and may not reflect
          exact results.
          <br />
          <br />
          The calculator page is designed to help users make smarter financial decisions
          by providing interactive tools for debt repayment, budgeting, and emergency
          fund planning. It gives users quick estimates and practical insights based on
          the numbers they enter.
        </p>

        <DebtCalculator
          debts={debts}
          loadingDebts={loadingDebts}
          debtMessage={debtMessage}
        />

        <BudgetCalculator />
        <EmergencyCalculator />
      </div>
    </div>
  );
}