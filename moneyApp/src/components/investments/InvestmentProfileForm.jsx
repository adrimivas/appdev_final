export default function InvestmentProfileForm({
  profile,
  setProfile,
  hasHighInterestDebt = false,
  debtLevelComment = "",
}) {
  function updateField(event) {
    const { name, value, type, checked } = event.target;

    if (name === "highInterestDebtPresent" && hasHighInterestDebt) return;

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

        {!profile.emergencyFundReady && (
          <p style={{ gridColumn: "1 / -1", color: "#b45309", margin: 0 }}>
<<<<<<< HEAD
            If fund isint built, build one in the calculator page.
=======
            If fund isn't built, build one in the calculator page.
>>>>>>> 96ca488 (fixed typo in InvestmentProfileForm)
          </p>
        )}

        <label className="checkbox-row">
          <input
            name="highInterestDebtPresent"
            type="checkbox"
            checked={hasHighInterestDebt || !!profile.highInterestDebtPresent}
            disabled={hasHighInterestDebt}
            onChange={updateField}
          />
          High-interest debt is present
        </label>

        {debtLevelComment && (
          <p style={{ gridColumn: "1 / -1", color: "#555", margin: 0 }}>
            {debtLevelComment}
          </p>
        )}

        <label className="checkbox-row">
          <input
            name="hasEmployerRetirementPlan"
            type="checkbox"
            checked={!!profile.hasEmployerRetirementPlan}
            onChange={updateField}
          />
          Has employer retirement plan
        </label>

        {profile.hasEmployerRetirementPlan && (
          <>
            <label>
              Employer match percentage:
              <input
                name="employerMatchPercent"
                type="number"
                value={profile.employerMatchPercent || ""}
                onChange={updateField}
                placeholder="4"
              />
            </label>

            <label>
              Your yearly contribution percentage:
              <input
                name="retirementContributionPercent"
                type="number"
                value={profile.retirementContributionPercent || ""}
                onChange={updateField}
                placeholder="6"
              />
            </label>

            <label>
              Vesting period in years:
              <input
                name="vestingYears"
                type="number"
                value={profile.vestingYears || ""}
                onChange={updateField}
                placeholder="3"
              />
            </label>
          </>
        )}
      </div>
    </section>
  );
}