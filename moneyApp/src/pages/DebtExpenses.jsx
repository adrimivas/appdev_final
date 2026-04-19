import { useEffect, useState } from "react";
import DebtList from "../components/debts/DebtList";
import DebtDetail from "../components/debts/DebtDetail";
import AddDebt from "../components/debts/AddDebt";

export default function Expenses() {
  const [userId, setUserId] = useState(null);
  const [debts, setDebts] = useState([]);
  const [selectedDebt, setSelectedDebt] = useState(null);

  const fetchDebts = async (id) => {
    const activeId = id || userId;
    if(!activeId) return;
    fetch(`http://localhost:5000/api/debts/${activeId}`)
      .then(res => res.json())
      .then(data => setDebts(data))
      .catch(err => console.error("Fetch error:", err));
  };

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const actualId = loggedInUser?.id || loggedInUser?._id;
    if(actualId) {
      setUserId(actualId);
      fetchDebts(actualId);
    }
  }, []);

  return (
    <div>
      <h1>All Expenses & Debts</h1>
      {!selectedDebt ? (
        <>
          {userId && <AddDebt userId={userId} refresh={fetchDebts} />}
          <DebtList debts={debts} onSelect={setSelectedDebt} />
        </>
      ) : (
        <DebtDetail debt={selectedDebt} goBack={() => setSelectedDebt(null)} />
      )}
    </div>
  );
}
