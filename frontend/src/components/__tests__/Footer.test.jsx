import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Footer from "../Footer";

// Подменяем реальный контент сайта на предсказуемые тестовые данные
vi.mock("../../content/site", () => ({
  default: {
    name: "Тестовое Имя",
    email: "test@example.com",
    socials: [
      { label: "GitHub", url: "https://github.com/test" },
      { label: "Telegram", url: "https://t.me/test" },
    ],
  },
}));

describe("Footer", () => {
  it("показывает имя из конфига", () => {
    render(<Footer />);
    expect(screen.getAllByText("Тестовое Имя").length).toBeGreaterThan(0);
  });

  it("показывает все ссылки на соцсети", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/test"
    );
    expect(screen.getByRole("link", { name: "Telegram" })).toHaveAttribute(
      "href",
      "https://t.me/test"
    );
  });

  it("показывает email как mailto-ссылку", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "test@example.com" })).toHaveAttribute(
      "href",
      "mailto:test@example.com"
    );
  });

  it("показывает текущий год в копирайте", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText((text) => text.includes(year))).toBeInTheDocument();
  });
});
