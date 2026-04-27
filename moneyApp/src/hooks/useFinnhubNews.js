import { useEffect, useState } from "react";

export default function useFinnhubNews(category = "general") {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;
    console.log("Finnhub key loaded:", !!apiKey);
    console.log("Finnhub key value:", apiKey);

    if (!apiKey) {
      setError("Missing Finnhub API key.");
      return;
    }

    async function fetchNews() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `https://finnhub.io/api/v1/news?category=${category}&token=${apiKey}`
        );

        const data = await response.json();
        console.log("Finnhub response status:", response.status);
        console.log("Finnhub response data:", data);

        if (!Array.isArray(data)) {
          console.error("Finnhub returned:", data);
          setError(data?.error || "invalid news response");
          return;
        }

        setArticles(data.slice(0, 8));
      } catch (err) {
        console.error("Finnhub news error:", err);
        setError("Unable to load finance news.");
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [category]);

  return {
    articles,
    loading,
    error,
  };
}