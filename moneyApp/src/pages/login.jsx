import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);

      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("About to fetch:", "http://localhost:5001/login");

    try {
      const response = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const text = await response.text();
      console.log("Login raw response:", text);

      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { message: text || "Invalid server response" };
      }

     if (response.ok) {
  const userToStore = data.user || data;
  localStorage.setItem("userId", data.user.id);
navigate("/profile");
} else {
  setMessage(data.message || "Login failed");
}
    } catch (error) {
      console.error("Login error:", error);
      setMessage(`Login failed: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Login</h1>

      {message && (
        <div
          style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "10px",
            maxWidth: "300px",
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <br />

        <button type="submit">Login</button>
      </form>

      <br />

      <button type="button" onClick={() => navigate("/create-account")}>
        Create Account
      </button>
    </div>
  );
}

export default Login;