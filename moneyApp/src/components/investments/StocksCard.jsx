import useFinnhubStock from "../../hooks/useFinnhubStock";

export default function StocksCard({ stockInputs, setStockInputs }) {
  function updateField(event) {
    const { name, value } = event.target;
    setStockInputs((prev) => ({ ...prev, [name]: value }));
  }

  const { quote, chartData, loading, error } = useFinnhubStock(
    stockInputs.symbol,
    stockInputs.range
  );

  return (
    <section className="investment-card">
      <h3>Stocks</h3>

      <div className="form-grid">
        <label>
          Symbol
          <input
            name="symbol"
            value={stockInputs.symbol}
            onChange={updateField}
            placeholder="AAPL"
          />
        </label>

        <label>
          Budget
          <input
            name="budget"
            type="number"
            value={stockInputs.budget}
            onChange={updateField}
            placeholder="500"
          />
        </label>

        <label>
          Range
          <select name="range" value={stockInputs.range} onChange={updateField}>
            <option value="1W">1 Week</option>
            <option value="1M">1 Month</option>
            <option value="3M">3 Months</option>
            <option value="1Y">1 Year</option>
          </select>
        </label>
      </div>

      {loading && <p>Loading stock data…</p>}
      {error && <p>{error}</p>}

      {quote && !loading && !error && (
        <div className="result-box">
          <p><strong>Current price:</strong> ${quote.c}</p>
          <p><strong>Day high:</strong> ${quote.h}</p>
          <p><strong>Day low:</strong> ${quote.l}</p>
          <p><strong>Previous close:</strong> ${quote.pc}</p>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="chart-placeholder">
          <h4>Recent close prices</h4>
          <div className="stock-list">
            {chartData.slice(-10).map((point) => (
              <div key={`${point.date}-${point.close}`} className="stock-row">
                <span>{point.date}</span>
                <span>${Number(point.close).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}