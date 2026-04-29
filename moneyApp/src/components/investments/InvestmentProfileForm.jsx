export default function InvestmentProfileForm({ profile, setProfile }) {
  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  return (
    <section className="page-section">
      <h2>Investment Profile</h2>

      <div className="form-grid">
        <label>
          Monthly Income:
          <input
            name="monthlyIncome"
            type="number"
            value={profile.monthlyIncome || ""}
            onChange={updateField}
            placeholder="6250"
          />
        </label>

        <label>
          Available to invest now:
          <input
            name="availableToInvestNow"
            type="number"
            value={profile.availableToInvestNow || ""}
            onChange={updateField}
            placeholder="10000"
          />
        </label>

        <label>
          Age:
          <input
            name="age"
            type="number"
            value={profile.age || ""}
            onChange={updateField}
            placeholder="30"
          />
        </label>

        <label>
          Time horizon (in years):
          <input
            name="timeHorizon"
            type="number"
            value={profile.timeHorizon || ""}
            onChange={updateField}
            placeholder="10"
          />
        </label>

        <label>
          Monthly Savings Goal:
          <input
            name="monthlySavings"
            type="number"
            value={profile.monthlySavings || ""}
            onChange={updateField}
            placeholder="500"
          />
        </label>

        <label>
          Fun Money:
          <input
            name="funMoney"
            type="number"
            value={profile.funMoney || ""}
            onChange={updateField}
            placeholder="300"
          />
        </label>

        <label>
          Risk Tolerance:
          <select
            name="riskTolerance"
            value={profile.riskTolerance || "moderate"}
            onChange={updateField}
          >
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </label>

        <label>
          Tax preference:
          <select
            name="taxPreference"
            value={profile.taxPreference || "tax-advantaged"}
            onChange={updateField}
          >
            <option value="tax-advantaged">Tax-advantaged</option>
            <option value="flexible">Flexible</option>
          </select>
        </label>

        <label className="checkbox-row">
          <input
            name="emergencyFundReady"
            type="checkbox"
            checked={!!profile.emergencyFundReady}
            onChange={updateField}
          />
          Emergency fund already built
        </label>

        <label className="checkbox-row">
          <input
            name="highInterestDebtPresent"
            type="checkbox"
            checked={!!profile.highInterestDebtPresent}
            onChange={updateField}
          />
          High-interest debt is present
        </label>

        <label className="checkbox-row">
          <input
            name="hasEmployerRetirementPlan"
            type="checkbox"
            checked={!!profile.hasEmployerRetirementPlan}
            onChange={updateField}
          />
          Has employer retirement plan
        </label>
      </div>
    </section>
  );
}