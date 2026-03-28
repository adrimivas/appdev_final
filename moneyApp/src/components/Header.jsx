import { NavLink } from "react-router-dom";

export default function Header() {
    return (
        <header className="site-header">
            <div className="container nav">
                <h1 className="brand">Potential Header: Got's the Dough?</h1>

                <nav className="nav-links">
                    <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
                        Home
                    </NavLink>
                    <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>
                        Login
                    </NavLink>
                    <NavLink to="/income" className={({ isActive }) => isActive ? "active" : ""}>
                        Income
                    </NavLink>
                    <NavLink to="/investments" className={({ isActive }) => isActive ? "active" : ""}>
                        Investments
                    </NavLink>
                    <NavLink to="/expenses" className={({ isActive }) => isActive ? "active" : ""}>
                        Expenses
                    </NavLink>
                    <NavLink to="/links" className={({ isActive }) => isActive ? "active" : ""}>
                        Links
                    </NavLink>
                    
                </nav>
            </div>
        </header>
    )
}