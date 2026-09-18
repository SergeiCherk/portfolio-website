import { useEffect, useState } from "react";
import { fetchProjects, fetchTechStack } from "../api/projects";
import ProjectCard from "../components/ProjectCard";
import TechFilter from "../components/TechFilter";
import "./Projects.css";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [techOptions, setTechOptions] = useState([]);
  const [selectedTech, setSelectedTech] = useState([]);
  const [search, setSearch] = useState("");
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

  // Проекты — перезагружаем при смене поиска или фильтра
  useEffect(() => {
    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => {
      fetchProjects({ search, tech: selectedTech })
        .then((data) => setProjects(data.results ?? data))
        .catch(() => setError("Не удалось загрузить проекты. Проверь, запущен ли backend."))
        .finally(() => setLoading(false));
    }, 300); // небольшой debounce для поля поиска

    return () => clearTimeout(timeoutId);
  }, [search, selectedTech]);

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
    </section>
  );
}
