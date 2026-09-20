import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import siteConfig from "../content/site";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";

/**
 * Шапка сайта: имя (из site.js), переключатель темы и навигация.
 * На узких экранах навигация сворачивается в бургер-меню.
 */
export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  // Пока мобильное меню открыто — блокируем скролл фона и слушаем Esc для закрытия
  useEffect(() => {
    if (!menuOpen) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") closeMenu();
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar__brand" onClick={closeMenu}>
        {siteConfig.name}
      </NavLink>

      <div className="navbar__right">
        <div className={`navbar__links${menuOpen ? " navbar__links--open" : ""}`}>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")} onClick={closeMenu}>
            Главная
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => (isActive ? "active" : "")} onClick={closeMenu}>
            Проекты
          </NavLink>
        </div>

        <button
          type="button"
          className="navbar__theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
        >
          {theme === "dark" ? "☀︎" : "☾"}
        </button>

        <button
          type="button"
          className={`navbar__burger${menuOpen ? " navbar__burger--open" : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen && <button className="navbar__backdrop" aria-hidden="true" onClick={closeMenu} />}
    </nav>
  );
}
