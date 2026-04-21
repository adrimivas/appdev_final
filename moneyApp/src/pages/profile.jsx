import { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <h2>Please log in to view your profile.</h2>;
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
      </div>
    </div>
  );
}

export default Profile;