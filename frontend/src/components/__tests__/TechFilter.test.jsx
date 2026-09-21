import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TechFilter from "../TechFilter";

const options = [
  { id: 1, name: "React", slug: "react" },
  { id: 2, name: "Django", slug: "django" },
];

describe("TechFilter", () => {
  it("показывает все переданные технологии", () => {
    render(<TechFilter options={options} selected={[]} onToggle={() => {}} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Django")).toBeInTheDocument();
  });

  it("выделяет выбранные теги активным классом", () => {
    render(<TechFilter options={options} selected={["react"]} onToggle={() => {}} />);
    expect(screen.getByText("React")).toHaveClass("tech-filter__item--active");
    expect(screen.getByText("Django")).not.toHaveClass("tech-filter__item--active");
  });

  it("вызывает onToggle с правильным slug при клике", async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(<TechFilter options={options} selected={[]} onToggle={onToggle} />);

    await user.click(screen.getByText("Django"));

    expect(onToggle).toHaveBeenCalledWith("django");
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
