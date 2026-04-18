import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setMessage("Please log in to view your profile.");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5001/users/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
        } else {
          setMessage(data.message || "Could not load profile.");
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        setMessage("Failed to load profile.");
      }
    };

    fetchUser();
  }, []);

  if (message) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h2>{message}</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h2>Loading profile...</h2>
      </div>
    );
  }

  const fullName =
    user?.name && typeof user.name === "object"
      ? `${user.name.first || ""} ${user.name.last || ""}`.trim()
      : user?.name || "N/A";

  const monthlyExpenses = Array.isArray(user?.expenses?.monthly)
    ? user.expenses.monthly
    : [];

  const expensesTotal = monthlyExpenses.reduce((total, expense) => {
    return total + (Number(expense?.amount) || 0);
  }, 0);

  return (
    <div
      style={{
        maxWidth: "750px",
        margin: "40px auto",
        padding: "30px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "25px" }}>Profile</h1>

      <div style={{ lineHeight: "2", fontSize: "16px" }}>
        <p>
          <strong>Username:</strong> {user?.username || "N/A"}
        </p>

        <p>
          <strong>Name:</strong> {fullName || "N/A"}
        </p>

        <p>
          <strong>Email:</strong> {user?.email || "N/A"}
        </p>

        <p>
          <strong>Income:</strong> ${Number(user?.income || 0).toLocaleString()}
        </p>

        <p>
          <strong>Monthly Expenses Total:</strong> ${expensesTotal.toLocaleString()}
        </p>

        <p>
          <strong>Date of Birth:</strong> {user?.date_of_birth || "N/A"}
        </p>
      </div>

      {monthlyExpenses.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2>Monthly Expenses</h2>

          {monthlyExpenses.map((expense, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "15px",
              }}
            >
              <p>
                <strong>Name:</strong> {expense?.name || "N/A"}
              </p>

              <p>
                <strong>Amount:</strong> $
                {Number(expense?.amount || 0).toLocaleString()}
              </p>

              <p>
                <strong>Category:</strong> {expense?.category || "N/A"}
              </p>

              {expense?.category === "debt" && (
                <>
                  <p>
                    <strong>Debt Type:</strong> {expense?.type || "N/A"}
                  </p>
                  <p>
                    <strong>Current Balance:</strong> $
                    {Number(expense?.current_balance || 0).toLocaleString()}
                  </p>
                  <p>
                    <strong>Interest Rate:</strong> {expense?.interest_rate || 0}%
                  </p>
                  <p>
                    <strong>Minimum Payment:</strong> $
                    {Number(expense?.minimum_payment || 0).toLocaleString()}
                  </p>
                  <p>
                    <strong>Current Payment:</strong> $
                    {Number(expense?.current_payment || 0).toLocaleString()}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}