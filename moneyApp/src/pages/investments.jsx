import { useNavigate } from "react-router-dom";
import InvestmentProfileForm from "../components/investments/InvestmentProfileForm";
import RecommendationSummary from "../components/investments/RecommendationSummary";
import CdCard from "../components/investments/CdCard";
import RothIraCard from "../components/investments/RothIraCard";
import StocksCard from "../components/investments/StocksCard";
import useSessionState from "../hooks/useSessionState";
import { calculateAge } from "../utils/ageCalc";
import { useEffect, useMemo, useState } from "react";

import {
  defaultInvestmentProfile,
  defaultCdInputs,
  defaultRothInputs,
  defaultStockInputs,
} from "../constants/appConstants";

function getDebtLevel(totalDebt) {
  if (totalDebt <= 0) return "No saved debt found.";
  if (totalDebt < 5000) return `Your saved debt amount is considered low: $${totalDebt.toLocaleString()}.`;
  if (totalDebt < 20000) return `Your saved debt amount is considered moderate: $${totalDebt.toLocaleString()}.`;
  return `Your saved debt amount is considered high: $${totalDebt.toLocaleString()}.`;
}

export default function Investments() {
  const navigate = useNavigate();
  const [profile, setProfile] = useSessionState("investment-profile", defaultInvestmentProfile);
  const [cdData, setCdData] = useSessionState("cd-data", defaultCdInputs);
  const [rothData, setRothData] = useSessionState("roth-data", defaultRothInputs);
  const [stocksData, setStocksData] = useSessionState("stocks-data", defaultStockInputs);
  const [user, setUser] = useState(null);
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    async function fetchUser() {
      try {
        const response = await fetch(`http://127.0.0.1:5001/users/${userId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load user");
        }

        setUser(data.user);

        const monthlyExpenses = Array.isArray(data?.user?.expenses?.monthly)
          ? data.user.expenses.monthly
          : [];

        const debtItems = monthlyExpenses
          .filter((item) => String(item?.category || "").toLowerCase().trim() === "debt")
          .map((item, index) => ({
            id: item?._id || `${item?.name || "debt"}-${index}`,
            name: item?.name || "Unnamed Debt",
            current_balance: Number(item?.current_balance || item?.balance || 0),
            interest_rate: Number(item?.interest_rate || 0),
          }));

        setDebts(debtItems);
      } catch (err) {
        console.error("Investments user fetch error:", err);
      }
    }

    fetchUser();
  }, []);

  const hasHighInterestDebt = useMemo(() => {
    return debts.some((debt) => Number(debt.interest_rate || 0) > 8);
  }, [debts]);

  const totalDebt = useMemo(() => {
    return debts.reduce((sum, debt) => sum + Number(debt.current_balance || 0), 0);
  }, [debts]);

  const debtLevelComment = useMemo(() => {
    if (hasHighInterestDebt) {
      return "One or more saved debts has an interest rate above 8%, so this box is checked automatically and cannot be unchecked until that debt changes.";
    }

    return getDebtLevel(totalDebt);
  }, [hasHighInterestDebt, totalDebt]);

  useEffect(() => {
    if (!user) return;

    const income = Number(user.income) || 0;
    const age = calculateAge(user.date_of_birth);

    setProfile((prev) => ({
      ...prev,
      annualIncome: income,
      age,
      highInterestDebtPresent: hasHighInterestDebt
        ? true
        : !!prev.highInterestDebtPresent,
    }));
  }, [user, hasHighInterestDebt, setProfile]);

  return (
    <section className="page investments-page">
      <div className="investments-hero">
        <h1>Investments</h1>
        <p>
          Compare low-risk savings, retirement investing, and stock exposure using your current
          financial situation.
        </p>
      </div>

      <InvestmentProfileForm
        profile={profile}
        setProfile={setProfile}
        hasHighInterestDebt={hasHighInterestDebt}
        debtLevelComment={debtLevelComment}
      />

      <RecommendationSummary profile={profile} />

      <div className="investment-grid">
        <CdCard cdInputs={cdData} setCdInputs={setCdData} />
        <RothIraCard rothInputs={rothData} setRothInputs={setRothData} />
        <StocksCard stockInputs={stocksData} setStockInputs={setStocksData} />
      </div>
      <button
        onClick={() => navigate("/investment-links")}
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          background: "#b380e0",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Useful Links
      </button>
    </section>
  );
}