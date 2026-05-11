import { useEffect, useState } from "react";

export default function useFinnhubSymbolSearch(query) {
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState("");

    useEffect(() => {
        const trimmed = typeof query === "string" ? query?.trim() : "";

        if(!trimmed || trimmed.length < 2) {
            setResults([]);
            setSearchError("");
            return;
        }

        const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;
        if(!apiKey) {
            setSearchError("Missing Finnhub API key.");
            return;
        }

        const controller = new AbortController();

        async function run() {
            setSearching(true);
            setSearchError("");

            try {
                const response = await fetch(
                    `https://finnhub.io/api/v1/search?q=${encodeURIComponent(trimmed)}&token=${apiKey}`,
                    { signal: controller.signal }
                );

                const data = await response.json();

                const filtered = Array.isArray(data?.result)
                    ? data.result.filter((item) => item?.symbol && item?.description).slice(0, 8) : [];

                setResults(filtered);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setSearchError("Unable to search stock symbols.");
                }
            } finally {
                setSearching(false);
            }
        }

        const timeout = setTimeout(run, 300);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };

    }, [query]);

    return {
        results,
        searching,
        searchError,
    };
}