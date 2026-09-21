import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "../../api/projects";
import Projects from "../Projects";

// Мокаем весь модуль API — страница не должна ходить в реальную сеть в тестах
vi.mock("../../api/projects");

const reactTech = { id: 1, name: "React", slug: "react" };
const djangoTech = { id: 2, name: "Django", slug: "django" };

const siteProject = {
  id: 1,
  slug: "sайт",
  title: "Сайт-визитка",
  short_description: "Простой лендинг",
  cover_image: null,
  tech_stack: [reactTech],
};

const crmProject = {
  id: 2,
  slug: "crm",
  title: "Внутренняя CRM",
  short_description: "Учёт клиентов",
  cover_image: null,
  tech_stack: [djangoTech],
};

function renderProjects() {
  return render(
    <MemoryRouter>
      <Projects />
    </MemoryRouter>
  );
}

describe("Projects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.fetchTechStack.mockResolvedValue({ results: [reactTech, djangoTech] });
    api.fetchProjects.mockResolvedValue({ results: [siteProject, crmProject] });
  });

  it("показывает загрузку, а затем список проектов", async () => {
    renderProjects();

    expect(screen.getByText("Загрузка...")).toBeInTheDocument();

    expect(await screen.findByText("Сайт-визитка")).toBeInTheDocument();
    expect(screen.getByText("Внутренняя CRM")).toBeInTheDocument();
  });

  it("показывает сообщение, если проектов не найдено", async () => {
    api.fetchProjects.mockResolvedValue({ results: [] });
    renderProjects();

    expect(
      await screen.findByText("Ничего не найдено — попробуй изменить запрос или фильтр.")
    ).toBeInTheDocument();
  });

  it("показывает понятную ошибку, если backend недоступен", async () => {
    api.fetchProjects.mockRejectedValue(new Error("network error"));
    renderProjects();

    expect(
      await screen.findByText("Не удалось загрузить проекты. Проверь, запущен ли backend.")
    ).toBeInTheDocument();
  });

  it("отправляет поисковый запрос в API после ввода текста", async () => {
    const user = userEvent.setup();
    renderProjects();
    await screen.findByText("Сайт-визитка");

    await user.type(screen.getByPlaceholderText("Поиск по названию или описанию..."), "CRM");

    await waitFor(() => {
      expect(api.fetchProjects).toHaveBeenLastCalledWith(
        expect.objectContaining({ search: "CRM" })
      );
    });
  });

  it("передаёт выбранный тег стека в API при клике на фильтр", async () => {
    const user = userEvent.setup();
    renderProjects();
    await screen.findByText("Сайт-визитка");

    await user.click(screen.getByRole("button", { name: "React" }));

    await waitFor(() => {
      expect(api.fetchProjects).toHaveBeenLastCalledWith(
        expect.objectContaining({ tech: ["react"] })
      );
    });
  });
});
