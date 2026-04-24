export function calculateCdReturn(amount, apy, termMonths) {
    const principal = Number(amount) || 0;
    const rate = (Number(apy) || 0) / 100;
    const years = (Number(termMonths) || 0) / 12;

    const endingBalance = principal * (1 + rate * years);
    const interestEarned = endingBalance - principal;

    return {
        principal,
        endingBalance,
        interestEarned,
    };
}

export function calculateRothProjection(monthlyContribution, expectedAnnualReturn, years) {
    const monthly = Number(monthlyContribution) || 0;
    const annualRate = (Number(expectedAnnualReturn) || 0) / 100;
    const months = (Number(years) || 0) * 12;
    const monthlyRate = annualRate / 12;

    let balance = 0;
    for (let i = 0; i < months; i += 1) {
        balance = (balance + monthly) * (1 + monthlyRate);
    }

    const totalContributed = monthly * months;

    return {
        totalContributed,
        projectedBalance: balance,
        estimatedGrowth: balance - totalContributed,
    };
}

export function getInvestmentSuggestion(profile) {
  //Current suggestions, can be modified
  if (profile.highInterestDebtPresent) {
    return {
    primary: "Pay down high-interest debts before making new investments.",
    secondary: "Keep emergency cash or employer-match contributions if applicable.",
    favored: "Debt first",
    };
  }

  if(!profile.emergencyFundReady) {
    return {
      primary: "Build emergency savings before taking on more investment risk.",
      secondary: "Short-term cash reserves or low-risk options.",
      favored: "Cash safety first",
    };
  }

  if(Number(profile.timeHorizonYears) <= 3 || profile.riskTolerance === "conservative"){
    return {
      primary: "CD is likely strongest fit right now.",
      secondary: "Lower volatility and clearer short-term planning.",
      favored: "CD"
    };
  }

  if (profile.taxPreference === "tax-advantaged") {
    return {
      primary: "Roth IRA most likely strongest fit right now.",
      secondary: "Long-term retirement growth with tax advantages.",
      favored: "Roth IRA",
    };
  }

  return {
    primary: "Stocks may fit best for long-term growth.",
    secondary: "Consider diversified investing and expect price swings.",
    favored: "Stock options"
  };

}