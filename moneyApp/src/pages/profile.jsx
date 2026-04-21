import { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("Loading profile...");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          setMessage("Please log in to view your profile.");
          return;
        }

        const response = await fetch(`http://localhost:5001/users/${userId}`);
        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Failed to load profile.");
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error("Profile fetch error:", error);
        setMessage("Failed to load profile.");
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <h2>{message}</h2>;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Profile</h1>

      <h2>Welcome, {user.username}.</h2>

      <div style={{ marginTop: "20px" }}>
        <p><strong>Email:</strong> {user.email}</p>

        {user.name && (
          <p>
            <strong>Name:</strong> {user.name.first} {user.name.last}
          </p>
        )}

        <p><strong>Income:</strong> ${user.income}</p>

        {user.date_of_birth && (
          <p><strong>Date of Birth:</strong> {user.date_of_birth}</p>
        )}
      </div>
    </div>
  );
}

export default Profile;