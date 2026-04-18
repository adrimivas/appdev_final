import { NavLink, useNavigate } from "react-router-dom";

export default function Header() {
    const isLoggedIn = !!localStorage.getItem("userId");
    const navigate = useNavigate();

    console.log("HEADER RENDERING");
    console.log("isLoggedIn:", isLoggedIn);
    console.log("stored user:", localStorage.getItem("userId"));

    const handleLogout = () => {
        localStorage.removeItem("userId");
        navigate("/");
    };

    return (
        <header className="site-header">
            <div className="container nav">
                <h1 className="brand">Got the Dough?</h1>

                <nav className="nav-links">
                    {!isLoggedIn && (
                        <>
                            <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
                                Home
                            </NavLink>
                            <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>
                                Login
                            </NavLink>
                            <NavLink to="/create-account" className={({ isActive }) => isActive ? "active" : ""}>
                                Create Account
                            </NavLink>
                        </>
                    )}

                    {isLoggedIn && (
                        <>
                            <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>
                                Profile
                            </NavLink>
                            <NavLink to="/investments" className={({ isActive }) => isActive ? "active" : ""}>
                                Investments
                            </NavLink>
                            <NavLink to="/debt" className={({ isActive }) => isActive ? "active" : ""}>
                                Debt
                            </NavLink>
                            <NavLink to="/calculator" className={({ isActive }) => isActive ? "active" : ""}>
                                Calculator
                            </NavLink>

                            <button type="button" className="logout-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}