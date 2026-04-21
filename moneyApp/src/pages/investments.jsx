import InvestmentProfileForm from "../components/investments/InvestmentProfileForm";
import RecommendationSummary from "../components/investments/RecommendationSummary";
import CdCard from "../components/investments/CdCard";
import RothIraCard from "../components/investments/RothIraCard";
import StocksCard from "../components/investments/StocksCard";
import useSessionState from "../hooks/useSessionState";

import {
  defaultInvestmentProfile,
  defaultCdInputs,
  defaultRothInputs,
  defaultStockInputs,
} from "../constants/investmentDefaults";

export default function Investments() {
  const [profile, setProfile] = useSessionState("investment-profile", defaultInvestmentProfile);
  const [cdData, setCdData] = useSessionState("cd-data", defaultCdInputs);
  const [rothData, setRothData] = useSessionState("roth-data", defaultRothInputs);
  const [stocksData, setStocksData] = useSessionState("stocks-data", defaultStockInputs);

  return (
    <section className="page investments-page">
      <h1>Investments</h1>
      <p>
        Compare low-risk savings, retirement investing, and stock exposure using your current
        financial situation.
      </p>

      <InvestmentProfileForm profile={profile} setProfile={setProfile} />
      <RecommendationSummary profile={profile} />

      <div className="investment-grid">
        <CdCard cdInputs={cdData} setCdInputs={setCdData} />
        <RothIraCard rothInputs={rothData} setRothInputs={setRothData} />
        <StocksCard stockInputs={stocksData} setStockInputs={setStocksData} />
      </div>
    </section>
  );
}
