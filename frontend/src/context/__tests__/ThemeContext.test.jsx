import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeProvider, useTheme } from "../ThemeContext";

// Маленький компонент-«зонд» — показывает текущую тему и кнопку для её переключения
function Probe() {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </>
  );
}

function renderProbe() {
  return render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>
  );
}

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("по умолчанию использует светлую тему, если ничего не сохранено", () => {
    renderProbe();
    expect(screen.getByTestId("theme-value")).toHaveTextContent("light");
  });

  it("переключает тему по клику и обновляет data-theme на <html>", async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByText("toggle"));

    expect(screen.getByTestId("theme-value")).toHaveTextContent("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("запоминает выбор в localStorage между перерендерами", async () => {
    const user = userEvent.setup();
    const { unmount } = renderProbe();

    await user.click(screen.getByText("toggle"));
    expect(localStorage.getItem("theme")).toBe("dark");

    unmount();
    renderProbe();
    expect(screen.getByTestId("theme-value")).toHaveTextContent("dark");
  });

  it("подхватывает ранее сохранённую тему при загрузке", () => {
    act(() => localStorage.setItem("theme", "dark"));
    renderProbe();
    expect(screen.getByTestId("theme-value")).toHaveTextContent("dark");
  });
});
