import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__brand">Моё портфолио</div>
      <div className="navbar__links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          Главная
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => (isActive ? "active" : "")}>
          Проекты
        </NavLink>
      </div>
    </nav>
  );
}
