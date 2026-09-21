import { Link } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";
import "./NotFound.css";

/** Показывается на любом маршруте, не описанном в App.jsx (см. Route path="*"). */
export default function NotFound() {
  useDocumentTitle("Страница не найдена");

  return (
    <section className="not-found">
      <span className="not-found__code">404</span>
      <h1>Страница не найдена</h1>
      <p>Такой страницы не существует — возможно, ссылка устарела или в адресе опечатка.</p>
      <Link to="/" className="not-found__link">
        ← Вернуться на главную
      </Link>
    </section>
  );
}
