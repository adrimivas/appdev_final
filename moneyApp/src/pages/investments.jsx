import { useNavigate } from "react-router-dom";
import InvestmentProfileForm from "../components/investments/InvestmentProfileForm";
import RecommendationSummary from "../components/investments/RecommendationSummary";
import StockExplorer from "../components/investments/StockExplorer";
import CdCard from "../components/investments/CdCard";
import RothIraCard from "../components/investments/RothIraCard";
import StocksCard from "../components/investments/StocksCard";
import useSessionState from "../hooks/useSessionState";
import { calculateAge } from "../utils/ageCalc";
import { useEffect, useState } from "react";

import {
  defaultInvestmentProfile,
  defaultCdInputs,
  defaultRothInputs,
  defaultStockInputs,
} from "../constants/appConstants";

export default function Investments() {
  const navigate = useNavigate();
  const [profile, setProfile] = useSessionState("investment-profile", defaultInvestmentProfile);
  const [cdData, setCdData] = useSessionState("cd-data", defaultCdInputs);
  const [rothData, setRothData] = useSessionState("roth-data", defaultRothInputs);
  const [stocksData, setStocksData] = useSessionState("stocks-data", defaultStockInputs);
  const [user, setUser] = useState(null);

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
      } catch (err) {
        console.error("Investments user fetch error:", err);
      }
    }
    fetchUser();
  }, []);
  
  useEffect(() => {
    if (!user) return;
    const income = Number(user.income) || 0;
    const age = calculateAge(user.date_of_birth);
    setProfile((prev) => ({
      ...prev,
      annualIncome: income,
      age: age,
    }));
  }, [user]);

  return (
    <section className="page investments-page">
      <div className = "investments-hero">
        <h1>Investments</h1>
        <p text-style: center="true">
        Compare low-risk savings, retirement investing, and stock exposure using your current
        financial situation.
        </p>
      </div> 

      <InvestmentProfileForm profile={profile} setProfile={setProfile} />
      <RecommendationSummary profile={profile} />

      <div className="investment-grid">
        <CdCard cdInputs={cdData} setCdInputs={setCdData} />
        <RothIraCard rothInputs={rothData} setRothInputs={setRothData} />
        <StocksCard stockInputs={stocksData} setStockInputs={setStocksData} />
      </div>

      <StockExplorer stockInputs={stocksData} setStockInputs={setStocksData} />

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
