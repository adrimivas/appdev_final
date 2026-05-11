import {useMemo, useState } from "react";
import useFinnhubStock from "../../hooks/useFinnhubStock";
import useFinnhubSymbolSearch from "../../hooks/useFinnhubSymbolSearch";
import StockPriceChart from "./StockPriceChart";

export default function StockExplorer({ stockInputs, setStockInputs }) {
    const [searchQuery, setSearchQuery] = useState("");

    const { quote, chartData, loading, error } = useFinnhubStock(
        stockInputs.symbol,
        stockInputs.range
    );

    const { results, searching, searchError } = useFinnhubSymbolSearch(searchQuery);

    const estimatedShares = useMemo(() => {
        const budget = Number(stockInputs.budget || 0);
        const price = Number(quote?.c || 0);
        if (!budget || !price) return 0;
        return budget / price;
    }, [stockInputs.budget, quote]);

    function updateField(event) {
        const { name, value } = event.target;
        setStockInputs((prev) => ({ ...prev, [name]: value }));
    }

    function chooseSymbol(symbol) {
        setStockInputs((prev) => ({ ...prev, symbol }));
        setSearchQuery("");
    }

    return (
        <section className="page-section stock-explorer">
            <h2>Stock Explorer</h2>
            <p>Look up a company, choose a ticker, and view recent price history.</p>

            <div className="form-grid stock-explorer-grid">
            <label>
                Search Company or Ticker
                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Apple, Tesla, NVDA, etc."
                />
            </label>

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

            {searching && <p>Searching symbols...</p>}
            {searchError && <p>{searchError}</p>}

            {!!results.length && (
                <div className="result-box">
                    <strong>Matches</strong>
                    <div className="stock-list" style={{ marginTop: "0.75rem" }}>
                        {results.map((item) => (
                            <button
                                key={`${item.symbol}-${item.description}`}
                                type="button"
                                className="stock-row"
                                onClick={() => chooseSymbol(item.symbol)}
                                style={{
                                    width: "100%",
                                    textAlign: "left",
                                    background: "#ffffff",
                                    color: "#0f172a",
                                    border: "1px solid var(--border)",
                                    cursor: "pointer",
                                    padding: "0.5rem 0",
                                }}
                            >
                                <span>
                                    <strong>{item.symbol}</strong> - {item.description}
                                </span>
                                <span>{item.type || ""}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {loading && <p>Loading stock data....</p>}
            {error && <p>{error}</p>}

            {quote && !loading && !error && (
                <div className="result-box">
                    <p><strong>Current price:</strong> ${Number(quote.c).toFixed(2)}</p>
                    <p><strong>Day high:</strong> ${Number(quote.h).toFixed(2)}</p>
                    <p><strong>Day low:</strong> ${Number(quote.l).toFixed(2)}</p>
                    <p><strong>Previous close:</strong> ${Number(quote.pc).toFixed(2)}</p>
                    {!!estimatedShares && (
                        <p><strong>Estimated shares from budget:</strong> {estimatedShares.toFixed(2)}</p>
                    )}
                </div>
            )}

            {chartData.length > 0 && (
                <div className="chart-placeholder">
                    <h4>{stockInputs.symbol?.toUpperCase()} recent close prices</h4>
                    <StockPriceChart data={chartData} />
                </div>
            )}
        </section>
    );
}