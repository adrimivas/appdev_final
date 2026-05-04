import { useEffect, useMemo, useState } from "react";
import useSessionState from "../hooks/useSessionState";
import { calculatePayoffMonths } from "../utils/debtCalc";
import {
  defaultInvestmentProfile,
  defaultCdInputs,
  defaultRothInputs,
  defaultStockInputs,
} from "../constants/appConstants";

function money(value) {
  return Number(value || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function percent(value, digits = 1) {
  return `${Number(value || 0).toFixed(digits)}%`;
}

function getCurrentBalance(debt) {
  return Number(debt?.current_balance ?? debt?.balance ?? 0);
}

function getInterestRate(debt) {
  return Number(debt?.interest_rate ?? 0);
}

function getMinimumPayment(debt) {
  return Number(
    debt?.minimum_payment ??
    debt?.minimumPayment ??
    debt?.monthly_payment ??
    debt?.monthlyPayment ??
    0
  );
}

function getCurrentPayment(debt) {
  return Number(
    debt?.current_payment ??
    debt?.currentPayment ??
    debt?.minimum_payment ??
    debt?.minimumPayment ??
    debt?.monthly_payment ??
    debt?.monthlyPayment ??
    0
  );
}

function getMonthlyInterest(debt) {
  return getCurrentBalance(debt) * (getInterestRate(debt) / 100 / 12);
}

function getProjectedInterest(debt) {
  const balance = getCurrentBalance(debt);
  const rate = getInterestRate(debt);
  const payment = getCurrentPayment(debt);

  if (balance <= 0 || payment <= 0) return 0;

  const { totalPaid } = calculatePayoffMonths(balance, rate, payment);
  return Math.max(totalPaid - balance, 0);
}

function normalizeDebt(item) {
  return {
    ...item,
    id: item?._id || item?.id || item?.name,
    name: item?.name || "Unnamed Debt",
    type: item?.type || "Debt",
    balance: getCurrentBalance(item),
    apr: getInterestRate(item),
    minimumPayment: getMinimumPayment(item),
    currentPayment: getCurrentPayment(item),
    monthlyInterest: getMonthlyInterest(item),
    projectedInterest: getProjectedInterest(item),
  };
}

function getRiskLevel(profile) {
  const raw = String(
    profile?.riskTolerance ??
      profile?.risk_tolerance ??
      profile?.risk ??
      profile?.investorType ??
      "moderate"
  )
    .toLowerCase()
    .trim();

  if (["low", "conservative", "very low"].includes(raw)) return "low";
  if (["high", "aggressive", "very high"].includes(raw)) return "high";
  return "moderate";
}

function getTimelineYears(profile) {
  const candidates = [
    profile?.timeHorizon,
    profile?.timeHorizonYears,
    profile?.time_horizon,
    profile?.investmentHorizon,
    profile?.yearsToWithdraw,
    profile?.years,
  ];

  for (const value of candidates) {
    const num = Number(value);
    if (Number.isFinite(num) && num > 0) return num;
  }

  const raw = String(
    profile?.timeHorizon ??
      profile?.timeHorizonYears ??
      profile?.time_horizon ??
      ""
  ).toLowerCase();

  if (raw.includes("short")) return 3;
  if (raw.includes("long")) return 15;
  if (raw.includes("medium")) return 7;
  return 7;
}

function getLiquidityNeed(profile) {
  const raw = String(
    profile?.liquidityNeed ?? profile?.liquidity_need ?? "moderate"
  )
    .toLowerCase()
    .trim();

  if (["high", "need access", "very high"].includes(raw)) return "high";
  if (["low", "locked up is fine"].includes(raw)) return "low";
  return "moderate";
}

function getAge(profile) {
  const candidates = [profile?.age, profile?.userAge, profile?.currentAge];
  for (const value of candidates) {
    const num = Number(value);
    if (Number.isFinite(num) && num > 0) return num;
  }
  return null;
}

function getHasHouse(profile) {
  const value = profile?.hasHouse ?? profile?.ownsHome ?? profile?.homeowner;
  if (typeof value === "boolean") return value;
  const raw = String(value ?? "").toLowerCase().trim();
  if (["yes", "true", "owner", "owns", "homeowner"].includes(raw)) return true;
  if (["no", "false", "rent", "renter", "does not own"].includes(raw))
    return false;
  return null;
}

function getHomeGoalYears(profile) {
  const candidates = [
    profile?.homeGoalYears,
    profile?.yearsToBuyHouse,
    profile?.houseTimeline,
    profile?.yearsUntilHomePurchase,
  ];

  for (const value of candidates) {
    const num = Number(value);
    if (Number.isFinite(num) && num > 0) return num;
  }

  const raw = String(
    profile?.houseTimeline ?? profile?.homeGoalTimeline ?? ""
  ).toLowerCase();
  if (raw.includes("soon") || raw.includes("short")) return 3;
  if (raw.includes("medium")) return 5;
  if (raw.includes("long")) return 8;
  return null;
}

function wantsRetirementFocus(profile) {
  const value =
    profile?.retirementPriority ??
    profile?.prioritizeRetirement ??
    profile?.retirement_focus;
  if (typeof value === "boolean") return value;
  const raw = String(value ?? "").toLowerCase().trim();
  return ["yes", "true", "high", "retirement first"].includes(raw);
}

function getRothContributionRoom(rothData) {
  const max = Number(
    rothData?.annualContributionLimit ?? rothData?.maxContribution ?? 7000
  );
  const current = Number(
    rothData?.currentAnnualContribution ??
      rothData?.contributionSoFar ??
      rothData?.annualContribution ??
      0
  );
  return Math.max(max - current, 0);
}

function getInvestmentReturnAssumptions(profile, cdData, rothData, stocksData) {
  const risk = getRiskLevel(profile);
  const years = getTimelineYears(profile);

  const cdRate = Number(cdData?.apy ?? cdData?.rate ?? cdData?.interestRate ?? 4.5);
  const rothExpected = Number(
    rothData?.expectedReturn ?? rothData?.rate ?? rothData?.annualReturn ?? 7
  );
  const stockExpected = Number(
    stocksData?.expectedReturn ?? stocksData?.rate ?? stocksData?.annualReturn ?? 9
  );

  let expected = rothExpected;
  if (risk === "low") expected = cdRate;
  if (risk === "high") expected = stockExpected;

  if (years <= 3) expected = Math.min(expected, Math.max(cdRate, 4));
  if (years >= 10 && risk !== "low") expected = Math.max(expected, rothExpected);

  const uncertaintyPenalty =
    risk === "high" ? 2.0 : risk === "moderate" ? 1.25 : 0.5;
  const netComparableReturn = Math.max(expected - uncertaintyPenalty, 0);

  return {
    risk,
    years,
    cdRate,
    rothExpected,
    stockExpected,
    expectedReturn: expected,
    uncertaintyPenalty,
    comparableReturn: netComparableReturn,
  };
}

function buildAdvice(debts, assumptions, monthlyExtraCash, profile, rothData) {
  const totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMin = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  const totalCurrent = debts.reduce((sum, debt) => sum + debt.currentPayment, 0);
  const totalProjectedInterest = debts.reduce(
    (sum, debt) => sum + debt.projectedInterest,
    0
  );

  const weightedApr =
    totalBalance > 0
      ? debts.reduce((sum, debt) => sum + debt.balance * debt.apr, 0) /
        totalBalance
      : 0;

  const highInterestDebts = debts.filter((debt) => debt.apr >= 8);
  const lowInterestDebts = debts.filter((debt) => debt.apr > 0 && debt.apr < 5);
  const urgentDebts = debts.filter(
    (debt) => debt.currentPayment <= debt.monthlyInterest + 5
  );

  const age = getAge(profile);
  const hasHouse = getHasHouse(profile);
  const homeGoalYears = getHomeGoalYears(profile);
  const retirementFocus = wantsRetirementFocus(profile);
  const rothRoomAnnual = getRothContributionRoom(rothData);
  const rothRoomMonthly = rothRoomAnnual / 12;
  const youngInvestor = age !== null && age <= 30;
  const homeSavingsPriority =
    hasHouse === false && homeGoalYears !== null && homeGoalYears <= 5;
  const longRunRetirementPriority =
    assumptions.years >= 10 && (youngInvestor || retirementFocus);

  let strategy = "mixed";
  let headline = "Use a balanced debt-paydown and investing approach.";
  let why =
    "Your debt costs and expected investing returns are close enough that splitting extra money is likely the most practical choice.";
  let split = { debt: 50, roth: 25, cd: 10, stocks: 15 };

  if (monthlyExtraCash <= 0) {
    strategy = "cash-flow-first";
    headline = "Stabilize your cash flow before allocating extra money.";
    why =
      "There is no leftover money after income, bills, minimum debt payments, savings, and fun money, so the first priority is improving cash flow rather than reallocating surplus.";
    split = { debt: 0, roth: 0, cd: 0, stocks: 0 };
  } else if (
    urgentDebts.length > 0 ||
    highInterestDebts.length > 0 ||
    weightedApr - assumptions.comparableReturn >= 2
  ) {
    strategy = "pay-debt-first";
    headline = "Pay off high-interest debt first, then build investments.";
    why =
      "At least one debt is expensive enough that the guaranteed savings from faster payoff likely beat your realistic risk-adjusted investing return.";
    split = { debt: 85, roth: 10, cd: 5, stocks: 0 };
  } else if (homeSavingsPriority && weightedApr < 7) {
    strategy = "home-fund-first";
    headline =
      "Build a house fund in safer accounts while paying debts on schedule.";
    why =
      "Because you do not own a home and may need the money within the next few years, preserving down-payment money in CDs or other low-volatility savings is usually more appropriate than taking heavy stock risk.";
    split = { debt: 35, roth: 20, cd: 35, stocks: 10 };
  } else if (
    longRunRetirementPriority &&
    rothRoomAnnual > 0 &&
    weightedApr <= assumptions.rothExpected - 1.5
  ) {
    strategy = "roth-first";
    headline =
      "Prioritize maxing out your Roth IRA, then invest additional money strategically.";
    why =
      "You appear to have a long time horizon, which makes Roth IRA space especially valuable because the long-run tax-free growth can be hard to replace later.";
    split = { debt: 25, roth: 50, cd: 5, stocks: 20 };
  } else if (
    weightedApr <= assumptions.comparableReturn - 2 &&
    lowInterestDebts.length === debts.length
  ) {
    strategy = "invest-first";
    headline = "Pay debts normally and put most extra money into investing.";
    why =
      "Your debts are relatively low-cost compared with your expected long-term investing return, so keeping debt payments normal and investing most of your surplus is likely stronger.";
    split = { debt: 20, roth: 35, cd: 10, stocks: 35 };
  }

  const topDebt = [...debts].sort((a, b) => b.apr - a.apr)[0] || null;
  const debtExtraAmount = (monthlyExtraCash * split.debt) / 100;
  let rothAmount = (monthlyExtraCash * split.roth) / 100;
  const cdAmount = (monthlyExtraCash * split.cd) / 100;
  let stockAmount = (monthlyExtraCash * split.stocks) / 100;

  if (rothRoomAnnual > 0 && rothAmount > rothRoomMonthly) {
    const overflow = rothAmount - rothRoomMonthly;
    rothAmount = rothRoomMonthly;
    stockAmount += overflow;
  }

  const orderedDebts = [...debts].sort((a, b) => {
    if (b.apr !== a.apr) return b.apr - a.apr;
    return b.balance - a.balance;
  });

  const allocationSummary = [
    { label: "Debt", percent: split.debt, amount: debtExtraAmount },
    { label: "Roth IRA", percent: split.roth, amount: rothAmount },
    { label: "CD / house fund", percent: split.cd, amount: cdAmount },
    { label: "Stocks / taxable investing", percent: split.stocks, amount: stockAmount },
  ];

  const actionItems =
    monthlyExtraCash <= 0
      ? [
          "You currently have no true leftover money to allocate.",
          "Reduce expenses, lower savings/fun targets temporarily, or raise income before optimizing debt payoff and investing.",
          topDebt
            ? `Keep making at least the minimum payment on ${topDebt.name} while you improve cash flow.`
            : "Keep making minimum payments on all debts while you improve cash flow.",
        ]
      : [
          totalCurrent > totalMin
            ? `You are already paying ${money(totalCurrent - totalMin)} above minimums.`
            : "You are currently close to minimum payments, so extra cash allocation matters more.",
          topDebt
            ? `If you add extra debt payments, focus on ${topDebt.name} first because it has the highest APR at ${percent(topDebt.apr)}.`
            : "Add a debt before generating debt-specific advice.",
          rothAmount > 0
            ? `Direct about ${money(rothAmount)} per month toward Roth IRA contributions${
                rothRoomAnnual > 0
                  ? ` until you use up roughly ${money(rothRoomAnnual)} of remaining annual room.`
                  : "."
              }`
            : "No Roth contribution is prioritized in the current recommendation.",
          cdAmount > 0
            ? `Set aside about ${money(cdAmount)} per month in CDs or another guaranteed savings vehicle${
                homeSavingsPriority
                  ? " to support a future home down payment"
                  : " for stability and near-term goals"
              }.`
            : "No dedicated CD allocation is prioritized in the current recommendation.",
          stockAmount > 0
            ? `Invest about ${money(stockAmount)} per month in higher-growth assets after debt and Roth priorities are covered.`
            : "No extra stock allocation is prioritized right now.",
        ];

  const reasoning = [
    `Weighted average debt APR: ${percent(weightedApr)}.`,
    `Risk-adjusted comparable investment return: ${percent(
      assumptions.comparableReturn
    )}.`,
    `Projected interest on your current debt plan: ${money(
      totalProjectedInterest
    )}.`,
    age !== null
      ? `Age considered in the recommendation: ${age}. Younger users with long time horizons may benefit more from protecting Roth IRA contribution space.`
      : "No age was found in the profile, so life-stage retirement prioritization is based mostly on timeline and risk profile.",
    hasHouse === false
      ? homeGoalYears !== null
        ? `You do not appear to own a home, and your estimated home-buying timeline is about ${homeGoalYears} years, which can make guaranteed savings vehicles more useful for down-payment money.`
        : "You do not appear to own a home, so the page may reserve some money for safer house-fund savings if your timeline is near or medium term."
      : hasHouse === true
      ? "You appear to already own a home, so the advice leans less heavily toward down-payment savings vehicles."
      : "No homeownership data was found, so the page uses only debt and investment profile signals for housing-related advice.",
  ];

  return {
    strategy,
    headline,
    why,
    split,
    weightedApr,
    totalBalance,
    totalMin,
    totalCurrent,
    totalProjectedInterest,
    debtExtraAmount,
    rothAmount,
    cdAmount,
    stockAmount,
    rothRoomAnnual,
    allocationSummary,
    orderedDebts,
    reasoning,
    actionItems,
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
    maxWidth: 1100,
    display: "flex",
    flexDirection: "column",
    gap: 24,
  };
}

function cardStyle() {
  return {
    background: "#fff",
    borderRadius: 20,
    padding: 24,
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
  };
}

function sectionTitleStyle() {
  return {
    margin: 0,
    fontSize: 28,
  };
}

function mutedStyle() {
  return {
    color: "#5f6470",
    lineHeight: 1.6,
    fontSize: 14,
  };
}

function metricCardStyle(borderColor) {
  return {
    ...cardStyle(),
    border: `1px solid ${borderColor}`,
    padding: 20,
  };
}

function badgeStyle(bg, color) {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    padding: "8px 12px",
    background: bg,
    color,
    fontWeight: 700,
    fontSize: 13,
  };
}

function RecommendationBadge({ strategy }) {
  if (strategy === "cash-flow-first") {
    return <div style={badgeStyle("#fff7ed", "#c2410c")}>Cash-flow first</div>;
  }
  if (strategy === "pay-debt-first") {
    return <div style={badgeStyle("#fef2f2", "#b91c1c")}>Debt-first strategy</div>;
  }
  if (strategy === "invest-first") {
    return <div style={badgeStyle("#eff6ff", "#1d4ed8")}>Invest-first strategy</div>;
  }
  if (strategy === "roth-first") {
    return <div style={badgeStyle("#ecfeff", "#0f766e")}>Roth-first strategy</div>;
  }
  if (strategy === "home-fund-first") {
    return <div style={badgeStyle("#fff7ed", "#c2410c")}>House-fund strategy</div>;
  }
  return <div style={badgeStyle("#f5f3ff", "#6d28d9")}>Mixed strategy</div>;
}

function ProgressSplit({ debtPercent, rothPercent, cdPercent, stockPercent }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 8,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <span>Actual leftover money allocation</span>
        <span>
          Debt {debtPercent}% / Roth {rothPercent}% / CD {cdPercent}% / Stocks{" "}
          {stockPercent}%
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: 14,
          background: "#e5e7eb",
          borderRadius: 999,
          overflow: "hidden",
          display: "flex",
        }}
      >
        <div style={{ width: `${debtPercent}%`, background: "#ef4444" }} />
        <div style={{ width: `${rothPercent}%`, background: "#14b8a6" }} />
        <div style={{ width: `${cdPercent}%`, background: "#f59e0b" }} />
        <div style={{ width: `${stockPercent}%`, background: "#2563eb" }} />
      </div>
    </div>
  );
}

function DebtPriorityList({ debts }) {
  if (!debts.length) {
    return <div style={{ color: "#666" }}>No debts found yet.</div>;
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {debts.map((debt, index) => (
        <div
          key={debt.id || `${debt.name}-${index}`}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            padding: 16,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.4fr) repeat(4, minmax(90px, 1fr))",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontWeight: 700 }}>
              {index + 1}. {debt.name}
            </div>
            <div style={{ color: "#666", fontSize: 13 }}>{debt.type}</div>
          </div>
          <div>
            <div style={{ color: "#666", fontSize: 12 }}>Balance</div>
            <div style={{ fontWeight: 700 }}>{money(debt.balance)}</div>
          </div>
          <div>
            <div style={{ color: "#666", fontSize: 12 }}>APR</div>
            <div style={{ fontWeight: 700 }}>{percent(debt.apr)}</div>
          </div>
          <div>
            <div style={{ color: "#666", fontSize: 12 }}>Min</div>
            <div style={{ fontWeight: 700 }}>{money(debt.minimumPayment)}</div>
          </div>
          <div>
            <div style={{ color: "#666", fontSize: 12 }}>Interest/mo</div>
            <div style={{ fontWeight: 700 }}>{money(debt.monthlyInterest)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdvicePage() {
  const [userId, setUserId] = useState(null);
  const [debts, setDebts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState(0);
  const [loading, setLoading] = useState(true);

  const [profile] = useSessionState(
    "investment-profile",
    defaultInvestmentProfile
  );
  const [cdData] = useSessionState("cd-data", defaultCdInputs);
  const [rothData] = useSessionState("roth-data", defaultRothInputs);
  const [stocksData] = useSessionState("stocks-data", defaultStockInputs);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchFinancials = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5001/users/${userId}`);
        const data = await response.json();
        setIncome((Number(data?.user?.income) || 0) / 12);

        if (!response.ok) {
          console.error("Failed to fetch user data:", data);
          setDebts([]);
          setExpenses([]);
          setLoading(false);
          return;
        }

        const monthlyExpenses = Array.isArray(data?.user?.expenses?.monthly)
          ? data.user.expenses.monthly
          : [];

        const debtItems = monthlyExpenses
          .filter(
            (item) =>
              String(item?.category || "").toLowerCase().trim() === "debt"
          )
          .map(normalizeDebt)
          .filter((item) => item.balance > 0);

        const nonDebtItems = monthlyExpenses.filter(
          (item) =>
            String(item?.category || "").toLowerCase().trim() !== "debt"
        );

        setDebts(debtItems);
        setExpenses(nonDebtItems);
      } catch (error) {
        console.error("Error fetching financial data:", error);
        setDebts([]);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancials();
  }, [userId]);

  const assumptions = useMemo(() => {
    return getInvestmentReturnAssumptions(profile, cdData, rothData, stocksData);
  }, [profile, cdData, rothData, stocksData]);

  const cashFlow = useMemo(() => {
    const pickNumber = (values) => {
      for (const value of values) {
        const num = Number(value);
        if (Number.isFinite(num) && num >= 0) return num;
      }
      return 0;
    };

const profileIncome = pickNumber([
  profile?.monthlyIncome,
  profile?.income,
  profile?.takeHomePay,
  profile?.monthly_take_home,
  profile?.netMonthlyIncome,
]);

const annualMonthlyIncome =
  Number(profile?.annualIncome) > 0
    ? Number(profile.annualIncome) / 12
    : 0;

const monthlyIncome = income || profileIncome || annualMonthlyIncome;

    const plannedSavings = pickNumber([
      profile?.monthlySavings,
      profile?.savings,
      profile?.savingsGoal,
      profile?.monthlySavingsGoal,
    ]);

    const funMoney = pickNumber([
      profile?.funMoney,
      profile?.monthlyFunMoney,
      profile?.discretionarySpending,
      profile?.monthlyDiscretionary,
      profile?.wantsBudget,
    ]);

    const nonDebtExpenses = expenses.reduce((sum, expense) => {
      const amount = Number(expense?.amount ?? 0);
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);

    const minimumDebtPayments = debts.reduce(
      (sum, debt) => sum + debt.minimumPayment,
      0
    );
    const leftover =
  monthlyIncome -
  nonDebtExpenses -
  minimumDebtPayments -
  plannedSavings -
  funMoney;

    return {
      income: monthlyIncome,
      plannedSavings,
      funMoney,
      nonDebtExpenses,
      minimumDebtPayments,
      leftover,
      allocatable: Math.max(leftover, 0),
    };
  }, [profile, expenses, debts, income]);

  const advice = useMemo(() => {
    return buildAdvice(
      debts,
      assumptions,
      cashFlow.allocatable,
      profile,
      rothData
    );
  }, [debts, assumptions, cashFlow.allocatable, profile, rothData]);

  const liquidityNeed = getLiquidityNeed(profile);

  return (
    <div style={pageWrapStyle()}>
      <div style={pageInnerStyle()}>
        <section style={cardStyle()}>
          <div style={{ textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
            <h1 style={{ margin: 0, fontSize: 38 }}>
              Debt vs. Investing Advice
            </h1>
            <p style={{ ...mutedStyle(), marginTop: 12, marginBottom: 16 }}>
              This page tells you exactly how to allocate your leftover
              monthly money after bills, minimum debt payments, savings, and fun
              money are already accounted for.
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <RecommendationBadge strategy={advice.strategy} />
            </div>
          </div>
        </section>

        {loading ? (
          <section style={cardStyle()}>
            <p style={{ ...mutedStyle(), margin: 0 }}>
              Loading your debt and investment data...
            </p>
          </section>
        ) : debts.length === 0 ? (
          <section style={cardStyle()}>
            <h2 style={sectionTitleStyle()}>No debt data yet</h2>
            <p style={{ ...mutedStyle(), marginBottom: 0 }}>
              Add at least one debt on your Expenses & Debts page to generate
              personalized advice.
            </p>
          </section>
        ) : (
          <>
            <section style={cardStyle()}>
              <h2 style={sectionTitleStyle()}>{advice.headline}</h2>
              <p style={{ ...mutedStyle(), marginTop: 10 }}>{advice.why}</p>
              <div style={{ marginTop: 18 }}>
                <ProgressSplit
                  debtPercent={advice.split.debt}
                  rothPercent={advice.split.roth}
                  cdPercent={advice.split.cd}
                  stockPercent={advice.split.stocks}
                />
              </div>
            </section>

            <section style={cardStyle()}>
              <h2 style={sectionTitleStyle()}>
                Monthly leftover money calculation
              </h2>
              <div
                style={{
                  marginTop: 18,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                }}
              >
                <div style={metricCardStyle("#e5e7eb")}>
                  <div style={{ color: "#666", fontSize: 13 }}>
                    Monthly income
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 24, marginTop: 6 }}>
                    {money(cashFlow.income)}
                  </div>
                </div>
                <div style={metricCardStyle("#e5e7eb")}>
                  <div style={{ color: "#666", fontSize: 13 }}>
                    Non-debt expenses
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 24, marginTop: 6 }}>
                    {money(cashFlow.nonDebtExpenses)}
                  </div>
                </div>
                <div style={metricCardStyle("#e5e7eb")}>
                  <div style={{ color: "#666", fontSize: 13 }}>
                    Minimum debt payments
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 24, marginTop: 6 }}>
                    {money(cashFlow.minimumDebtPayments)}
                  </div>
                </div>
                <div style={metricCardStyle("#e5e7eb")}>
                  <div style={{ color: "#666", fontSize: 13 }}>
                    Savings goal (taken from investments)
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 24, marginTop: 6 }}>
                    {money(cashFlow.plannedSavings)}
                  </div>
                </div>
                <div style={metricCardStyle("#e5e7eb")}>
                  <div style={{ color: "#666", fontSize: 13 }}>Fun money</div>
                  <div style={{ fontWeight: 800, fontSize: 24, marginTop: 6 }}>
                    {money(cashFlow.funMoney)}
                  </div>
                </div>
                <div
                  style={metricCardStyle(
                    cashFlow.leftover >= 0 ? "#bbf7d0" : "#fecaca"
                  )}
                >
                  <div style={{ color: "#666", fontSize: 13 }}>
                    True leftover money
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 24, marginTop: 6 }}>
                    {money(cashFlow.leftover)}
                  </div>
                </div>
              </div>
            </section>

            <section style={cardStyle()}>
              <h2 style={sectionTitleStyle()}>
                What this recommendation is based on
              </h2>
              <div
                style={{
                  marginTop: 18,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: 16,
                }}
              >
                <div style={metricCardStyle("#fee2e2")}>
                  <div style={{ color: "#666", fontSize: 13 }}>
                    Weighted average APR
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 22, marginTop: 6 }}>
                    {percent(advice.weightedApr)}
                  </div>
                </div>
                <div style={metricCardStyle("#dbeafe")}>
                  <div style={{ color: "#666", fontSize: 13 }}>
                    Comparable investing return
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 22, marginTop: 6 }}>
                    {percent(assumptions.comparableReturn)}
                  </div>
                </div>
                <div style={metricCardStyle("#ccfbf1")}>
                  <div style={{ color: "#666", fontSize: 13 }}>
                    Remaining Roth IRA room
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 22, marginTop: 6 }}>
                    {money(advice.rothRoomAnnual)}
                  </div>
                </div>
                <div style={metricCardStyle("#e5e7eb")}>
                  <div style={{ color: "#666", fontSize: 13 }}>
                    Investment timeline
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 22, marginTop: 6 }}>
                    {assumptions.years} years
                  </div>
                </div>
                <div style={metricCardStyle("#e5e7eb")}>
                  <div style={{ color: "#666", fontSize: 13 }}>
                    Risk tolerance
                  </div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 22,
                      marginTop: 6,
                      textTransform: "capitalize",
                    }}
                  >
                    {assumptions.risk}
                  </div>
                </div>
                <div style={metricCardStyle("#e5e7eb")}>
                  <div style={{ color: "#666", fontSize: 13 }}>
                    Liquidity need
                  </div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 22,
                      marginTop: 6,
                      textTransform: "capitalize",
                    }}
                  >
                    {liquidityNeed}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 20, display: "grid", gap: 10 }}>
                {advice.reasoning.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 12,
                      padding: "12px 14px",
                      color: "#344054",
                      background: "#fafafa",
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section style={cardStyle()}>
              <h2 style={sectionTitleStyle()}>
                Recommended allocation of your leftover money
              </h2>
              <div
                style={{
                  marginTop: 18,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                }}
              >
                {advice.allocationSummary.map((item) => (
                  <div key={item.label} style={metricCardStyle("#e5e7eb")}>
                    <div style={{ color: "#666", fontSize: 13 }}>
                      {item.label}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 24, marginTop: 6 }}>
                      {money(item.amount)}
                    </div>
                    <div style={{ color: "#666", fontSize: 13, marginTop: 4 }}>
                      {item.percent}% of leftover money
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section style={cardStyle()}>
              <h2 style={sectionTitleStyle()}>Recommended action plan</h2>
              <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
                {advice.actionItems.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      padding: 14,
                      borderRadius: 14,
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 999,
                        background: "#111827",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </div>
                    <div style={{ lineHeight: 1.55 }}>{item}</div>
                  </div>
                ))}
              </div>
            </section>

            <section style={cardStyle()}>
              <h2 style={sectionTitleStyle()}>Debt payoff priority</h2>
              <p style={{ ...mutedStyle(), marginTop: 10 }}>
                If you send extra money to debt, use the avalanche method by
                targeting the highest APR debt first while paying minimums on the
                rest.
              </p>
              <div style={{ marginTop: 18 }}>
                <DebtPriorityList debts={advice.orderedDebts} />
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}