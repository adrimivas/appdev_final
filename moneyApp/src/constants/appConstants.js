export const APP_NAME = "Example: Finance Planner (probs change it)"

export const DEBT_TYPES = [
    "High-interest credit cards",
    "Personal loans",
    "Student loans",
    "Mortgage",
];

export const ACCOUNT_TYPES = [
    "401(k)",
    "Roth IRA",
    "Brokerage Account",
    "HSA",
    "Emergency Fund",
];

export const defaultInvestmentProfile = {
  availableToInvest: "",
  emergencyFundReady: false,
  highInterestDebtPresent: false,
  timeHorizonYears: "",
  riskTolerance: "moderate",
  taxPreference: "tax-advantaged",
  age: "",
  annualIncome: "",
  hasEmployerRetirementPlan: false,
};

export const defaultCdInputs = {
    amount: "",
    termMonths: 12,
    apy:4.5,
}

export const defaultRothInputs = {
    monthlyContribution: "",
    expectedAnnualReturn: 7,
    yearsUntilWithdrawal: "",
};

export const defaultStockInputs = {
    symbol: "AAPL",
    budget: "",
    range: "1M",
};