import { useEffect, useState } from "react";
import { fetchProjects, fetchTechStack } from "../api/projects";
import ProjectCard from "../components/ProjectCard";
import TechFilter from "../components/TechFilter";
import useDocumentTitle from "../hooks/useDocumentTitle";
import "./Projects.css";

/** Каталог проектов: живой поиск с debounce, фильтр по стеку и постраничная навигация. */
export default function Projects() {
  useDocumentTitle("Проекты");

  const [projects, setProjects] = useState([]);
  const [techOptions, setTechOptions] = useState([]);
  const [selectedTech, setSelectedTech] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Список всех технологий для фильтра — загружаем один раз
  useEffect(() => {
    fetchTechStack()
      .then((data) => setTechOptions(data.results ?? data))
      .catch(() => {
        /* фильтр не критичен — молча игнорируем ошибку */
      });
  }, []);

  // Смена поиска или фильтра — всегда возвращаемся на первую страницу результатов
  useEffect(() => {
    setPage(1);
  }, [search, selectedTech]);

  // Проекты — перезагружаем при смене поиска, фильтра или страницы
  useEffect(() => {
    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => {
      fetchProjects({ search, tech: selectedTech, page })
        .then((data) => {
          setProjects(data.results ?? data);
          setHasNext(Boolean(data.next));
          setHasPrevious(Boolean(data.previous));
        })
        .catch(() => setError("Не удалось загрузить проекты. Проверь, запущен ли backend."))
        .finally(() => setLoading(false));
    }, 300); // небольшой debounce для поля поиска

    return () => clearTimeout(timeoutId);
  }, [search, selectedTech, page]);

  // Добавляет/убирает тег из фильтра — можно выбрать сразу несколько технологий
  function toggleTech(slug) {
    setSelectedTech((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  return (
    <section className="projects-page">
      <h1>Проекты</h1>

      <input
        type="text"
        className="projects-page__search"
        placeholder="Поиск по названию или описанию..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {techOptions.length > 0 && (
        <TechFilter options={techOptions} selected={selectedTech} onToggle={toggleTech} />
      )}

      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && projects.length === 0 && (
        <p>Ничего не найдено — попробуй изменить запрос или фильтр.</p>
      )}

      <div className="projects-page__grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {!loading && !error && (hasPrevious || hasNext) && (
        <div className="projects-page__pagination">
          <button
            type="button"
            onClick={() => setPage((p) => p - 1)}
            disabled={!hasPrevious}
          >
            ← Назад
          </button>
          <span className="projects-page__page-number">Страница {page}</span>
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasNext}
          >
            Далее →
          </button>
        </div>
      )}
    </section>
  );
}
