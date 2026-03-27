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
                    <NavLink to="/constants" className={({ isActive }) => isActive ? "active" : ""}>
                        Variables/Inputs
                    </NavLink>
                    <NavLink to="/example" className={({ isActive }) => isActive ? "active" : ""}>
                        Example Page
                    </NavLink>
                    
                </nav>
            </div>
        </header>
    )
}