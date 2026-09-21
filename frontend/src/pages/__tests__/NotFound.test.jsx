import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import NotFound from "../NotFound";

describe("NotFound", () => {
  it("показывает код 404 и ссылку на главную", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /вернуться на главную/i })).toHaveAttribute("href", "/");
  });

  it("рендерится для любого несуществующего маршрута", () => {
    render(
      <MemoryRouter initialEntries={["/что-то-несуществующее"]}>
        <Routes>
          <Route path="/" element={<div>Главная</div>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("404")).toBeInTheDocument();
  });
});
