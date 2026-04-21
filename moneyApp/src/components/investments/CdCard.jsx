import {calculateCdReturn } from "../../utils/investmentCalculations";

export default function CdCard({ cdInputs, setCdInputs }) {
    function updateField(event) {
        const { name, value } = event.target;
        setCdInputs((prev) => ({ ...prev, [name]: value }));
    }

    const result = calculateCdReturn(cdInputs.amount, cdInputs,AppLayout, cdInputs.termMonths);

    return (
        <section className="investment-card">
            <h3>Certificate of Deposti (CD)</h3>

            <div className="form-grid">
                <label>
                    Amount
                    <input name="amount" type="number" value={cdInputs.amount} onChange={updateField} />
                </label>

                <label>
                    APY %
                    <input name="apy" type="number" value={cdInputs.apy} onChange={updateField} />
                </label>

                <label>
                    Term in months
                    <input
                        name="termMonths"
                        type="number"
                        value={cdInputs.termMonths}
                        onChange={updateField}
                    />
                </label>
            </div>

            <div className="result-box">
                <p><strong>Projected ending balance:</strong> ${result.endingBalance.toFixed(2)}</p>
                <p><strong>Estimated interest earned:</strong> ${result.interestEarned.toFixed(2)}</p>
            </div>
        </section>
    );
}