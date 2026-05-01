import { useEffect, useMemo, useState } from "react";
import useFinnhubNews from "../hooks/useFinnhubNews";
const API_BASE = "http://127.0.0.1:5001";

function buildPieGradient(data, colors) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (!total) {
    return "conic-gradient(#e5e7eb 0deg 360deg)";
  }

  let currentAngle = 0;

  const segments = data.map((item, index) => {
    const sliceAngle = (item.value / total) * 360;
    const start = currentAngle;
    const end = currentAngle + sliceAngle;
    currentAngle = end;

    return `${colors[index % colors.length]} ${start}deg ${end}deg`;
  });

  return `conic-gradient(${segments.join(", ")})`;
}

function DebtPieChart({ data, colors }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const background = buildPieGradient(data, colors);

  return (
    <div style={styles.customChartSection}>
      <div
        style={{
          ...styles.customPie,
          background,
        }}
      />
      <ul style={styles.customLegend}>
        {data.map((item, index) => {
          const percent = total ? ((item.value / total) * 100).toFixed(0) : 0;

          return (
            <li key={`${item.name}-${index}`} style={styles.customLegendItem}>
              <span
                style={{
                  ...styles.legendColor,
                  backgroundColor: colors[index % colors.length],
                }}
              />
              <span>
                {item.name}: ${item.value.toLocaleString()} ({percent}%)
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Profile() {
  console.log("API_BASE is:", API_BASE);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    articles,
    loading: newsLoading,
    error: newsError,
  } = useFinnhubNews("general");

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("Please log in to view your profile.");
      setLoading(false);
      return;
    }

    async function fetchUser() {
      try {
        console.log("Profile fetch URL:", `${API_BASE}/users/${userId}`);
        const response = await fetch(`${API_BASE}/users/${userId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load user profile");
        }

        setUser(data.user);
      } catch (err) {
        console.error("Profile error:", err);
        setError(err.message || "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const monthlyItems = user?.expenses?.monthly || [];

  const debts = useMemo(() => {
    return monthlyItems.filter((item) => item.category === "debt");
  }, [monthlyItems]);

  const nonDebtExpenses = useMemo(() => {
    return monthlyItems.filter((item) => item.category !== "debt");
  }, [monthlyItems]);

  const totalDebt = useMemo(() => {
    return debts.reduce(
      (sum, debt) => sum + (Number(debt.current_balance) || Number(debt.amount) || 0),
      0
    );
  }, [debts]);

  const totalExpenses = useMemo(() => {
    return monthlyItems.reduce((sum, item) => {
      if (item.category === "debt") {
        return sum + (Number(item.current_payment) || Number(item.minimum_payment) || 0);
      }

      return sum + (Number(item.amount) || 0);
    }, 0);
  }, [monthlyItems]);

  const income = Number(user?.income) || 0;

  const expenseRatio = useMemo(() => {
    if (!income) return 0;
    return (totalExpenses / income) * 100;
  }, [totalExpenses, income]);

  const debtChartData = useMemo(() => {
    return debts.map((debt, index) => {
      const value = Number(debt?.current_balance ?? debt?.amount ?? 0);

      return {
        name: debt?.name?.trim() || debt?.type?.trim() || `Debt ${index + 1}`,
        value: Number.isFinite(value) ? value : 0,
      };
    })
    .filter((item) => item.value > 0);
  }, [debts]);
    

  const COLORS = ["#4f46e5", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

  if (loading) {
    return <div style={{ padding: "24px" }}>Loading profile...</div>;
  }

  if (error) {
    return <div style={{ padding: "24px" }}>{error}</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.main}>
        <section style={styles.card}>
          <h1 style={styles.title}>Profile</h1>
          <h2 style={styles.subtitle}>Welcome, {user?.username}</h2>

          <div style={styles.statsGrid}>
            <div style={styles.statBox}>
              <span style={styles.label}>Income</span>
              <span>${income.toLocaleString()}</span>
            </div>

            <div style={styles.statBox}>
              <span style={styles.label}>Total Monthly Expenses</span>
              <span>${totalExpenses.toLocaleString()}</span>
            </div>

            <div style={styles.statBox}>
              <span style={styles.label}>Expense to Income Ratio</span>
              <span>{expenseRatio.toFixed(1)}%</span>
            </div>

            <div style={styles.statBox}>
              <span style={styles.label}>Total Debt</span>
              <span>${totalDebt.toLocaleString()}</span>
            </div>
          </div>
        </section>

        <section style={styles.card}>
          <h3>Debt Breakdown</h3>

          {debtChartData.length === 0 ? (
            <p>No debt data available.</p>
          ) : (
            <div style = {styles.chartWrapper}>
              <DebtPieChart data = {debtChartData} colors = {COLORS} />
            </div>
          )}
        </section>

        <section style={styles.card}>
          <h3>Monthly Expenses</h3>

          {nonDebtExpenses.length === 0 ? (
            <p>No non-debt monthly expenses found.</p>
          ) : (
            <ul style={styles.list}>
              {nonDebtExpenses.map((expense, index) => (
                <li key={`${expense.name || expense.category}-${index}`} style={styles.listItem}>
                  <span>{expense.name || expense.category || "Expense"}</span>
                  <span>${Number(expense.amount || 0).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <aside style={styles.sidebar}>
        <section style={styles.card}>
          <h3>Finance News</h3>
          
          {newsLoading && <p>Loading finance news...</p>}
          {newsError && <p>{newsError}</p>}

          {!newsLoading && !newsError && articles.length === 0 && (
            <p>No finance news available.</p>
          )}

          <ul style={styles.newsList}>
            {articles.map((article, index) => (
              <li key={article.url || index} style={styles.newsItem}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.newsLink}
                >
                  {article.headline}
                </a>
                <div style={styles.newsSource}>{article.source}</div>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  );
}

const styles = {
  page: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "24px",
    padding: "24px",
    alignItems: "start",
  },
  main: {
    display: "grid",
    gap: "24px",
  },
  sidebar: {
    display: "grid",
    gap: "24px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  },
  title: {
    margin: 0,
  },
  subtitle: {
    marginTop: "8px",
    fontWeight: 500,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginTop: "20px",
  },
  statBox: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "12px",
  },
  label: {
    fontSize: "0.9rem",
    color: "#6b7280",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: "12px 0 0 0",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },
  newsList: {
    listStyle: "none",
    padding: 0,
    margin: "12px 0 0 0",
    display: "grid",
    gap: "14px",
  },
  newsItem: {
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
  },
  newsLink: {
    textDecoration: "none",
    color: "#111827",
    fontWeight: 600,
  },
  newsSource: {
    marginTop: "4px",
    fontSize: "0.85rem",
    color: "#6b7280",
  },
  chartWrapper: {
  width: "100%",
  minHeight: 320,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  },
  customChartSection: {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "20px",
  width: "100%",
},

customPie: {
  width: "220px",
  height: "220px",
  borderRadius: "50%",
  border: "12px solid #fff",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
},

customLegend: {
  listStyle: "none",
  padding: 0,
  margin: 0,
  width: "100%",
  maxWidth: "420px",
  display: "grid",
  gap: "10px",
},

customLegendItem: {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "0.95rem",
},

legendColor: {
  width: "14px",
  height: "14px",
  borderRadius: "4px",
  flexShrink: 0,
},
};

export default Profile;