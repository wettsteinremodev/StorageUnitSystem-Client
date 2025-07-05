import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
  const location = useLocation();

  return (
    <nav style={{ marginBottom: "1rem" }}>
      <div className="navbar-container">
        <ul className="navbar-list">
          <li>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/admin"
              className={location.pathname === "/admin" ? "active" : ""}
            >
              Admin
            </Link>
          </li>

          <li>
            <Link
              to="/rentings"
              className={location.pathname === "/rentings" ? "active" : ""}
            >
              Rentings
            </Link>
          </li>

          <li>
            <Link
              to="/user"
              className={location.pathname === "/user" ? "active" : ""}
            >
              User
            </Link>
          </li>

          <li>
            <Link
              to="/impressum"
              className={location.pathname === "/impressum" ? "active" : ""}
            >
              Impressum
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
