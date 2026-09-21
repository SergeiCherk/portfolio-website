// Подключает дополнительные matcher'ы (toBeInTheDocument, toHaveClass и т.д.)
// ко всем тестам автоматически — этот файл сам по себе тестов не содержит.
import "@testing-library/jest-dom";

// jsdom не реализует window.matchMedia — заглушка нужна компонентам,
// которые проверяют системную тему (ThemeContext и т.п.)
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // устаревший API, но некоторые библиотеки всё ещё его вызывают
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
