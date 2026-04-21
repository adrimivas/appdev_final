import { useEffect, useState } from "react";

/*export default */function Profile() {
  //const [user, setUser] = useState(null);
  //const [message, setMessage] = useState(""); 
  const [profile, setProfile] = useState(null);
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      //setMessage("Please log in to view your profile.");
      setLoading(false);
      return;
    }

    /*const fetchUser = async () => {
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
    }; */
    const fetchProfileData = async () => {
      try {
        const [profileRes, debtsRes] = await Promise.all([
          fetch(`http://localhost:5000/users/${userID}`),
          fetch(`http://localhost:5000/users/${userID}/debts`),
        ]);
        const profileData = await profileRes.json();
        const debtsData = await debtsRes.json();

        if (!profileRes.ok) {
          throw new Error(profileData.message || "Failed to lead profile");
        }
        if(!debtsRes.ok) {
          throw new Error(debtsData.message || "Failed to load debts");
        }
        setProfile(profileData);
        setDebts(debtsData);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.message || "Could not load profile data.");
      } finally {
        setLoading(false);
      }
    };

    //fetchUser();
    fetchProfileData();
  }, []);

  if(loading) {
    return <h2> Loading profile...</h2>;
  }

  if (!localStorage.getItem("userID")) {
    return <h2>Please log in to view your profile.</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  /*if (message) {
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
  } */
  

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
    /*<div
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
  */
 <div style={{ textAlign: "center", padding: "24px" }}>
      <h1>Profile</h1>
      <h2>Welcome, {profile?.username}.</h2>

      <div style={{ marginTop: "20px" }}>
        <p>
          <strong>Email:</strong> {profile?.email}
        </p>

        {profile?.name && (
          <p>
            <strong>Name:</strong> {profile.name.first} {profile.name.last}
          </p>
        )}

        <p>
          <strong>Income:</strong> ${profile?.income ?? 0}
        </p>

        {profile?.date_of_birth && (
          <p>
            <strong>Date of Birth:</strong> {profile.date_of_birth}
          </p>
        )}
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3>Your Debts</h3>

        {debts.length === 0 ? (
          <p>No debts found.</p>
        ) : (
          debts.map((debt) => (
            <div
              key={debt._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "12px",
                margin: "12px auto",
                maxWidth: "500px",
                textAlign: "left",
              }}
            >
              <p><strong>Name:</strong> {debt.name}</p>
              <p><strong>Type:</strong> {debt.type}</p>
              <p><strong>Amount:</strong> ${debt.amount}</p>
              <p><strong>Current Balance:</strong> ${debt.current_balance}</p>
              <p><strong>Interest Rate:</strong> {debt.interest_rate}%</p>
              <p><strong>Minimum Payment:</strong> ${debt.minimum_payment}</p>
              <p><strong>Current Payment:</strong> ${debt.current_payment}</p>
            </div>
          ))
        )}
      </div>
    </div>
 );
}

export default Profile;