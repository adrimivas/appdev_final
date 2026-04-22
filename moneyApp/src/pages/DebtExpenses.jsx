import { useEffect, useState } from "react";
import DebtDetail from "../components/debts/DebtDetail";
import AddDebt from "../components/debts/AddDebt";
import AddExpense from "../components/expenses/AddExpense";
import ExpenseDetail from "../components/expenses/ExpenseDetail";
import { calculatePayoffMonths } from "../utils/debtCalc";

function formatMoney(value) {
  return Number(value || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function getProjectedInterest(debt) {
  const currentBalance = Number(debt?.current_balance ?? 0);
  const interestRate = Number(debt?.interest_rate ?? 0);
  const paymentAmount = Number(
    debt?.current_payment ?? debt?.minimum_payment ?? 0
  );

  if (currentBalance <= 0 || paymentAmount <= 0) {
    return 0;
  }

  const { totalPaid } = calculatePayoffMonths(
    currentBalance,
    interestRate,
    paymentAmount
  );

  return Math.max(totalPaid - currentBalance, 0);
}

function getOriginalBalance(debt) {
  return Number(debt?.original_amount ?? debt?.current_balance ?? 0);
}

function getCurrentBalance(debt) {
  return Number(debt?.current_balance ?? debt?.balance ?? 0);
}

function getInterestRate(debt) {
  return Number(debt?.interest_rate ?? 0);
}

function getMinimumPayment(debt) {
  return Number(debt?.minimum_payment ?? debt?.amount ?? 0);
}

function getMonthlyInterestAmount(debt) {
  const currentBalance = getCurrentBalance(debt);
  const annualRate = getInterestRate(debt);
  return currentBalance * (annualRate / 100 / 12);
}

function getDebtProgress(debt) {
  const originalBalance = getOriginalBalance(debt);
  const currentBalance = getCurrentBalance(debt);
  const projectedInterest = getProjectedInterest(debt);

  const paidAmount = Math.max(originalBalance - currentBalance, 0);
  const remainingAmount = Math.max(currentBalance, 0);
  const interestAmount = Math.max(projectedInterest, 0);

  const total = paidAmount + remainingAmount + interestAmount;

  if (total <= 0) {
    return {
      paidPercent: 0,
      remainingPercent: 100,
      interestPercent: 0,
      paidAmount: 0,
      remainingAmount: 0,
      interestAmount: 0,
    };
  }

  return {
    paidPercent: (paidAmount / total) * 100,
    remainingPercent: (remainingAmount / total) * 100,
    interestPercent: (interestAmount / total) * 100,
    paidAmount,
    remainingAmount,
    interestAmount,
  };
}

function getMonthlyPaymentBreakdown(debt) {
  const currentBalance = getCurrentBalance(debt);
  const annualRate = getInterestRate(debt);
  const paymentAmount = Number(
    debt?.current_payment ?? debt?.minimum_payment ?? 0
  );

  const monthlyInterest = currentBalance * (annualRate / 100 / 12);
  const interestPortion = Math.min(monthlyInterest, paymentAmount);
  const principalPortion = Math.max(paymentAmount - interestPortion, 0);

  return {
    principalPortion,
    interestPortion,
  };
}

function pageWrapStyle() {
  return {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "32px 20px 48px",
    display: "flex",
    justifyContent: "center",
  };
}

function pageInnerStyle() {
  return {
    width: "100%",
    maxWidth: 1000,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };
}

function sectionCardStyle() {
  return {
    background: "#fff",
    padding: 32,
    borderRadius: 20,
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
    width: "100%",
    maxWidth: 900,
    margin: "0 auto 32px auto",
  };
}

function sectionHeaderRowStyle() {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 20,
  };
}

function titleBlockStyle() {
  return {
    textAlign: "center",
    width: "100%",
    marginBottom: 8,
  };
}

function actionButtonStyle() {
  return {
    padding: "10px 16px",
    borderRadius: 10,
    border: "1px solid #bbb",
    background: "#fff",
    cursor: "pointer",
    fontSize: 16,
    whiteSpace: "nowrap",
  };
}

function gridListStyle() {
  return {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
  };
}

function itemCardStyle() {
  return {
    border: "1px solid #e3e3e3",
    borderRadius: 16,
    padding: 18,
    background: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
    cursor: "pointer",
  };
}

function progressTrackStyle() {
  return {
    width: "100%",
    height: 12,
    borderRadius: 999,
    overflow: "hidden",
    display: "flex",
    background: "#e5e7eb",
    marginTop: 10,
    marginBottom: 10,
  };
}

function EmptyState({ text }) {
  return (
    <div
      style={{
        textAlign: "center",
        color: "#666",
        padding: "20px 0 4px",
      }}
    >
      {text}
    </div>
  );
}

function DebtCard({ debt, onSelect }) {
  const currentBalance = getCurrentBalance(debt);
  const minimumPayment = getMinimumPayment(debt);
  const interestRate = getInterestRate(debt);
  const originalBalance = getOriginalBalance(debt);
  const paymentAmount = Number(
    debt?.current_payment ?? debt?.minimum_payment ?? 0
  );
  const projectedInterest = getProjectedInterest(debt);
  const monthlyInterestAmount = getMonthlyInterestAmount(debt);

  const {
    paidPercent,
    remainingPercent,
    interestPercent,
    paidAmount,
    remainingAmount,
    interestAmount,
  } = getDebtProgress(debt);

  const { principalPortion } = getMonthlyPaymentBreakdown(debt);

  return (
    <button
      type="button"
      onClick={() => onSelect(debt)}
      style={{
        ...itemCardStyle(),
        textAlign: "left",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
        {debt?.name || "Unnamed Debt"}
      </div>

      <div style={{ color: "#666", fontSize: 14, lineHeight: 1.7 }}>
        <div>Type: {debt?.type || "N/A"}</div>
        <div>Current Balance: {formatMoney(currentBalance)}</div>
        <div>Interest Rate: {interestRate}%</div>
        <div>Interest Per Month: {formatMoney(monthlyInterestAmount)}</div>
        <div>Minimum Payment: {formatMoney(minimumPayment)}</div>
        <div>Current Monthly Payment: {formatMoney(paymentAmount)}</div>
        {originalBalance > 0 && (
          <div>Original Balance: {formatMoney(originalBalance)}</div>
        )}
      </div>

      <div style={{ marginTop: 14 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#746c82",
            marginBottom: 4,
          }}
        >
          Lifetime Cost Breakdown
        </div>

        <div style={progressTrackStyle()}>
          <div
            style={{
              width: `${paidPercent}%`,
              background: "#22c55e",
            }}
          />
          <div
            style={{
              width: `${remainingPercent}%`,
              background: "#d1d5db",
            }}
          />
          <div
            style={{
              width: `${interestPercent}%`,
              background: "#ef4444",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gap: 4,
            fontSize: 13,
            color: "#555",
          }}
        >
          <div>
            <span style={{ color: "#22c55e", fontWeight: 600 }}>Paid:</span>{" "}
            {formatMoney(paidAmount)}
          </div>
          <div>
            <span style={{ color: "#6b7280", fontWeight: 600 }}>Left to pay:</span>{" "}
            {formatMoney(remainingAmount)}
          </div>
          <div>
            <span style={{ color: "#22c55e", fontWeight: 600 }}>
              Principal this month:
            </span>{" "}
            {formatMoney(principalPortion)}
          </div>
          <div>
            <span style={{ color: "#ef4444", fontWeight: 600 }}>
              Interest per month:
            </span>{" "}
            {formatMoney(monthlyInterestAmount)}
          </div>
          <div>
            <span style={{ color: "#ef4444", fontWeight: 600 }}>
              Total interest on current plan:
            </span>{" "}
            {formatMoney(interestAmount)}
          </div>
          <div>
            <span style={{ color: "#746c82", fontWeight: 600 }}>
              Payment used:
            </span>{" "}
            {formatMoney(paymentAmount)}
          </div>
        </div>
      </div>
    </button>
  );
}

function ExpenseCard({ expense, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(expense)}
      style={{
        ...itemCardStyle(),
        textAlign: "left",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
        {expense?.name || "Unnamed Expense"}
      </div>

      <div style={{ color: "#666", fontSize: 14, lineHeight: 1.7 }}>
        <div>Category: {expense?.category || "N/A"}</div>
        <div>Amount: {formatMoney(expense?.amount || 0)}</div>
        {expense?.type && <div>Type: {expense.type}</div>}
        {expense?.frequency && <div>Frequency: {expense.frequency}</div>}
      </div>
    </button>
  );
}

export default function Expenses() {
  const [userId, setUserId] = useState(null);
  const [debts, setDebts] = useState([]);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [showDebtForm, setShowDebtForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const fetchData = async (id) => {
    const activeId = id || userId;
    if (!activeId) return;

    try {
      const response = await fetch(`http://localhost:5001/users/${activeId}`);
      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch user data:", data);
        setDebts([]);
        setExpenses([]);
        return;
      }

      const monthlyExpenses = Array.isArray(data?.user?.expenses?.monthly)
        ? data.user.expenses.monthly
        : [];

      const debtItems = monthlyExpenses.filter(
        (item) => String(item?.category || "").toLowerCase().trim() === "debt"
      );

      const nonDebtExpenses = monthlyExpenses.filter(
        (item) => String(item?.category || "").toLowerCase().trim() !== "debt"
      );

      setDebts(debtItems);
      setExpenses(nonDebtExpenses);
    } catch (err) {
      console.error("Error fetching data:", err);
      setDebts([]);
      setExpenses([]);
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (storedUserId) {
      setUserId(storedUserId);
      fetchData(storedUserId);
    } else {
      console.error("No userId found in localStorage");
    }
  }, []);

  if (selectedDebt) {
    return (
      <DebtDetail
        debt={selectedDebt}
        userId={userId}
        goBack={() => setSelectedDebt(null)}
        refresh={() => {
          fetchData(userId);
          setSelectedDebt(null);
        }}
      />
    );
  }

  if (selectedExpense) {
    return (
      <ExpenseDetail
        expense={selectedExpense}
        userId={userId}
        goBack={() => setSelectedExpense(null)}
        refresh={() => {
          fetchData(userId);
          setSelectedExpense(null);
        }}
      />
    );
  }

  return (
    <div style={pageWrapStyle()}>
      <div style={pageInnerStyle()}>
        <h1 style={{ textAlign: "center", marginTop: 0, marginBottom: 12 }}>
          All Expenses & Debts
        </h1>

        <p
          style={{
            textAlign: "center",
            maxWidth: 700,
            margin: "0 auto 28px auto",
            color: "#555",
            lineHeight: 1.6,
            fontSize: 14,
          }}
        >
          <br />
          Review your debts and expenses in one place, track payoff progress, and
          manage monthly obligations more clearly.
        </p>

        <section style={sectionCardStyle()}>
          <div style={sectionHeaderRowStyle()}>
            <div style={titleBlockStyle()}>
              <h2 style={{ margin: 0, fontSize: 32 }}>Debts</h2>
              <p
                style={{
                  margin: "8px 0 0 0",
                  color: "#666",
                  fontSize: 14,
                }}
              >
                Select a debt to view details, update it, or review payoff progress.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDebtForm((prev) => !prev)}
              style={actionButtonStyle()}
            >
              {showDebtForm ? "Cancel" : "Add Debt"}
            </button>
          </div>

          {showDebtForm && (
            <div style={{ marginBottom: 24 }}>
              <AddDebt
                userId={userId}
                refresh={() => {
                  fetchData(userId);
                  setShowDebtForm(false);
                }}
              />
            </div>
          )}

          {debts.length === 0 ? (
            <EmptyState text="No debts added yet." />
          ) : (
            <div style={gridListStyle()}>
              {debts.map((debt, index) => (
                <DebtCard
                  key={debt?._id || debt?.id || `${debt?.name || "debt"}-${index}`}
                  debt={debt}
                  onSelect={setSelectedDebt}
                />
              ))}
            </div>
          )}

          <div
            style={{
              marginTop: 20,
              display: "flex",
              justifyContent: "center",
              gap: 18,
              flexWrap: "wrap",
              fontSize: 13,
              color: "#666",
            }}
          >
            <div>
              <span style={{ color: "#22c55e", fontWeight: 700 }}>■</span> Paid
            </div>
            <div>
              <span style={{ color: "#9ca3af", fontWeight: 700 }}>■</span> Remaining balance
            </div>
            <div>
              <span style={{ color: "#ef4444", fontWeight: 700 }}>■</span> Total interest on plan
            </div>
          </div>
        </section>

        <section style={sectionCardStyle()}>
          <div style={sectionHeaderRowStyle()}>
            <div style={titleBlockStyle()}>
              <h2 style={{ margin: 0, fontSize: 32 }}>Expenses</h2>
              <p
                style={{
                  margin: "8px 0 0 0",
                  color: "#666",
                  fontSize: 14,
                }}
              >
                View and manage your non-debt monthly expenses.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowExpenseForm((prev) => !prev)}
              style={actionButtonStyle()}
            >
              {showExpenseForm ? "Cancel" : "Add Expense"}
            </button>
          </div>

          {showExpenseForm && (
            <div style={{ marginBottom: 24 }}>
              <AddExpense
                userId={userId}
                refresh={() => {
                  fetchData(userId);
                  setShowExpenseForm(false);
                }}
              />
            </div>
          )}

          {expenses.length === 0 ? (
            <EmptyState text="No expenses added yet." />
          ) : (
            <div style={gridListStyle()}>
              {expenses.map((expense, index) => (
                <ExpenseCard
                  key={
                    expense?._id || expense?.id || `${expense?.name || "expense"}-${index}`
                  }
                  expense={expense}
                  onSelect={setSelectedExpense}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}