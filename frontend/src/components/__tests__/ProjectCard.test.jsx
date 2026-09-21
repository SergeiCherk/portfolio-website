import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ProjectCard from "../ProjectCard";

const baseProject = {
  id: 1,
  slug: "moy-proekt",
  title: "Мой проект",
  short_description: "Короткое описание",
  cover_image: null,
  tech_stack: [
    { id: 1, name: "React" },
    { id: 2, name: "Django" },
  ],
};

// ProjectCard использует <Link>, поэтому рендерим внутри MemoryRouter
function renderCard(project) {
  return render(
    <MemoryRouter>
      <ProjectCard project={project} />
    </MemoryRouter>
  );
}

describe("ProjectCard", () => {
  it("показывает название и описание проекта", () => {
    renderCard(baseProject);
    expect(screen.getByText("Мой проект")).toBeInTheDocument();
    expect(screen.getByText("Короткое описание")).toBeInTheDocument();
  });

  it("показывает все теги стека", () => {
    renderCard(baseProject);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Django")).toBeInTheDocument();
  });

  it("ведёт на страницу проекта по правильному slug", () => {
    renderCard(baseProject);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/projects/moy-proekt");
  });

  it("показывает картинку, если задана обложка", () => {
    renderCard({ ...baseProject, cover_image: "https://example.com/photo.jpg" });
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "https://example.com/photo.jpg");
  });

  it("показывает плейсхолдер, если обложки нет", () => {
    renderCard(baseProject);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
