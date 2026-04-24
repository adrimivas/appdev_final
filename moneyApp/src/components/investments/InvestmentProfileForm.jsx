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
                    Annual Income:
                </label>

                <label>
                    Available to invest now:
                </label>

                <label>
                    Age:
                </label>

                <label>
                    Time horizon (in years)
                    <input
                        name="timeHorizonYears"
                        type="number"
                        value={profile.timeHorizonYears}
                        onChange={updateField}
                        placeholder="10"
                    />
                </label>

                <label>
                    Risk Tolerance
                    <select name="riskTolerance" value={profile.riskTolerance} onChange={updateField}>
                        <option value="conservative">Conservative</option>
                        <option value="moderate">Moderate</option>
                        <option value="aggressive">Aggressive</option>
                    </select>
                </label>

                <label>
                    Tax preference
                    <select name="taxPreference" value={profile.taxPreference} onChange={updateField}>
                        <option value="tax-advantaged">Tax-advantaged</option>
                        <option value="flexible">Flexible</option>
                    </select>
                </label>

                <label className="checkbox-row">
                    <input
                        name="emergencyFundRead"
                        type="checkbox"
                        checked={profile.emergencyFundReady}
                        onChange={updateField}
                    />
                    Emergency fund already built
                </label>

                <label className="checkbox-row">
                    <input
                        name="highInterestDebtPresent"
                        type="checkbox"
                        checked={profile.highInterestDebtPresent}
                        onChange={updateField}
                    />
                    High-interest debt is present
                </label>

                <label className="checkbox-row">
                    <input
                        name="hasEmployerRetirementPlan"
                        type="checkbox"
                        checked={profile.hasEmployerRetirementPlan}
                        onChange={updateField}
                    />
                    Has employer retirement plan
                </label>
            </div>
        </section>
    )
}