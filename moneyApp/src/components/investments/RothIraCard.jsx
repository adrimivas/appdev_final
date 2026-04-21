import { calculateRothProjection } from "../../utils/investmentCalculations";

export default function RothIraCard({ rothInputs, setRothInputs }) {
  function updateField(event) {
    const { name, value } = event.target;
    setRothInputs((prev) => ({ ...prev, [name]: value }));
  }

  const result = calculateRothProjection(
    rothInputs.monthlyContribution,
    rothInputs.expectedAnnualReturn,
    rothInputs.yearsUntilWithdrawal
  );

  return (
    <section className="investment-card">
      <h3>Roth IRA</h3>

      <div className="form-grid">
        <label>
          Monthly contribution
          <input
            name="monthlyContribution"
            type="number"
            value={rothInputs.monthlyContribution}
            onChange={updateField}
          />
        </label>

        <label>
          Expected annual return %
          <input
            name="expectedAnnualReturn"
            type="number"
            value={rothInputs.expectedAnnualReturn}
            onChange={updateField}
          />
        </label>

        <label>
          Years until withdrawal
          <input
            name="yearsUntilWithdrawal"
            type="number"
            value={rothInputs.yearsUntilWithdrawal}
            onChange={updateField}
          />
        </label>
      </div>

      <div className="result-box">
        <p><strong>Total contributed:</strong> ${result.totalContributed.toFixed(2)}</p>
        <p><strong>Projected balance:</strong> ${result.projectedBalance.toFixed(2)}</p>
        <p><strong>Estimated growth:</strong> ${result.estimatedGrowth.toFixed(2)}</p>
      </div>
    </section>
  );
}