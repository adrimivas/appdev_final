import { useEffect, useState } from "react";
import { formatCandleData, getRangeParams } from "../utils/stockHelpers";

export default function useFinnhubStock(symbol, range) {
    const [quote, setQuote] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if(!symbol) return;

        const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;
        if(!apiKey) {
            setError("Missing Finnhub API key.");
            return;
        }

        const upperSymbol = symbol.toUpperCase().trim();
        const { from, to, resolution } = getRangeParams(range);

        async function run() {
            setLoading(true);
            setError("");

            try {
                const quoteRes = await fetch(
                    `https://finnhub.io/api/v1/quote?symbol=${upperSymbol}&token=${apiKey}`
                );
                const quoteJSON = await quoteRes.json();
                setQuote(quoteJSON);

                const candleRes = await fetch(
                    `https://finnhub.io/api/v1/stock/candle?symbol=${upperSymbol}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`
                );
                const candleJSON = await candleRes.json();
                setChartData(formatCandleData(candleJSON));
            } catch {
                setError("Unable to load stock data.");
            } finally {
                setLoading(false);
            }
        }

        run();
    }, [symbol, range]);

    return {
        quote,
        chartData,
        loading,
        error,
    };
}