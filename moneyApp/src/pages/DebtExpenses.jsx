import { useEffect, useState } from "react";
import DebtList from "../components/debts/DebtList";
import DebtDetail from "../components/debts/DebtDetail";
import AddDebt from "../components/debts/AddDebt";
import ExpenseList from "../components/expenses/ExpenseList";
import AddExpense from "../components/expenses/AddExpense";

export default function Expenses() {
  const [userId, setUserId] = useState(null);
  const [debts, setDebts] = useState([]);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const [showDebtForm, setShowDebtForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const fetchData = async (id) => {
    const activeId = id || userId;
    if(!activeId) return;
    try{
      const [debtRes, expenseRes] = await Promise.all([
        fetch(`http://localhost:5000/api/debts/${activeId}`),
        fetch(`http://localhost:5000/api/expenses/${activeId}`)
      ]);
      const debtData = await debtRes.json();
      const expenseData = await expenseRes.json();
      setDebts(debtData);
      setExpenses(expenseData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const actualId = loggedInUser?.id || loggedInUser?._id;
    if(actualId) {
      setUserId(actualId);
      fetchData(actualId);
    }
  }, []);

  return (
    <div>
      <h1>All Expenses & Debts</h1>
      {!selectedDebt ? (
        <>
          <section style={{ marginBottom: "40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <h2>Debts</h2>
              <button onClick={() => setShowDebtForm(!showDebtForm)}>
                {showDebtForm ? "Cancel" : "Add Debt"}
              </button>
            </div>
            {showDebtForm && (
              <AddDebt
                userId={userId}
                refresh={() => { fetchData(userId); setShowDebtForm(false); }}
              />
            )}
            <DebtList debts={debts} onSelect={setSelectedDebt} />
          </section>
          <hr />
          <section style={{ marginTop: "40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <h2>Expenses</h2>
              <button onClick={() => setShowExpenseForm(!showExpenseForm)}>
                {showExpenseForm ? "Cancel" : "Add Expense"}
              </button>
            </div>
            {showExpenseForm && (
              <AddExpense
                userId={userId}
                refresh={() => { fetchData(userId); setShowExpenseForm(false); }}
              />
            )}
            <ExpenseList expenses={expenses} />
          </section>
        </>
      ) : (
        <DebtDetail debt={selectedDebt} goBack={() => setSelectedDebt(null)} />
      )}
    </div>
  );
}
