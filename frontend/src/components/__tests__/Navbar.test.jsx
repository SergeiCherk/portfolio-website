import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ThemeProvider } from "../../context/ThemeContext";
import Navbar from "../Navbar";

function renderNavbar() {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe("Navbar", () => {
  it("показывает ссылки «Главная» и «Проекты»", () => {
    renderNavbar();
    expect(screen.getByRole("link", { name: "Главная" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Проекты" })).toBeInTheDocument();
  });

  it("мобильное меню закрыто по умолчанию", () => {
    renderNavbar();
    const links = screen.getByRole("link", { name: "Проекты" }).closest(".navbar__links");
    expect(links).not.toHaveClass("navbar__links--open");
  });

  it("открывает меню по клику на бургер", async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.click(screen.getByRole("button", { name: "Открыть меню" }));

    const links = screen.getByRole("link", { name: "Проекты" }).closest(".navbar__links");
    expect(links).toHaveClass("navbar__links--open");
  });

  it("закрывает меню при клике на ссылку", async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.click(screen.getByRole("button", { name: "Открыть меню" }));
    await user.click(screen.getByRole("link", { name: "Проекты" }));

    const links = screen.getByRole("link", { name: "Проекты" }).closest(".navbar__links");
    expect(links).not.toHaveClass("navbar__links--open");
  });

  it("переключает подпись кнопки темы по клику", async () => {
    const user = userEvent.setup();
    renderNavbar();

    const button = screen.getByLabelText("Включить тёмную тему");
    await user.click(button);

    expect(screen.getByLabelText("Включить светлую тему")).toBeInTheDocument();
  });
});
