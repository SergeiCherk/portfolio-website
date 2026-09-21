import { useEffect } from "react";

/**
 * Ставит заголовок вкладки браузера вида "Заголовок — Портфолио".
 * Возвращает исходный заголовок при размонтировании страницы.
 */
export default function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} — Портфолио` : "Портфолио";
    return () => {
      document.title = previous;
    };
  }, [title]);
}
