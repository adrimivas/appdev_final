import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); 
  const location = useLocation();

  // display success message after account creation
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

    try {
      const response = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("username", data.user.username);
        window.location.href = "/profile";
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Something went wrong");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {/* success message styling */}
{message && (
  <div
    style={{
      backgroundColor: "#d4edda",
      color: "#155724",
      padding: "10px",
      borderRadius: "5px",
      marginBottom: "10px",
      maxWidth: "300px"
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
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

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