import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProject } from "../api/projects";
import Lightbox from "../components/Lightbox";
import useDocumentTitle from "../hooks/useDocumentTitle";
import "./ProjectDetail.css";

/** Страница одного проекта: описание, ссылки и лента фото с лайтбоксом. */
export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useDocumentTitle(project?.title ?? "Проект");

  useEffect(() => {
    fetchProject(slug)
      .then(setProject)
      .catch(() => setError("Проект не найден."));
  }, [slug]);

  if (error) {
    return (
      <section className="project-detail">
        <p style={{ color: "crimson" }}>{error}</p>
        <Link to="/projects">← Назад к проектам</Link>
      </section>
    );
  }

  if (!project) return <p style={{ padding: 32 }}>Загрузка...</p>;

  // Обложка + галерея — вместе, одной лентой, в едином формате для лайтбокса
  const photos = [
    ...(project.cover_image ? [{ src: project.cover_image, caption: "" }] : []),
    ...(project.gallery ?? []).map((img) => ({ src: img.image, caption: img.caption })),
  ];

  return (
    <section className="project-detail">
      <Link to="/projects" className="project-detail__back">
        ← Назад к проектам
      </Link>

      <h1>{project.title}</h1>

      <div className="project-detail__tags">
        {project.tech_stack.map((tech) => (
          <span key={tech.id} className="tag">
            {tech.name}
          </span>
        ))}
      </div>

      {photos.length > 0 && (
        <div className="photo-strip" role="list">
          {photos.map((photo, i) => (
            <button
              key={i}
              type="button"
              role="listitem"
              className="photo-strip__item"
              onClick={() => setLightboxIndex(i)}
              aria-label={`Открыть фото ${i + 1} из ${photos.length}`}
            >
              <img src={photo.src} alt={photo.caption || project.title} />
            </button>
          ))}
        </div>
      )}

      <p className="project-detail__description">{project.description}</p>

      <div className="project-detail__links">
        {project.github_url && (
          <a href={project.github_url} target="_blank" rel="noreferrer">
            GitHub →
          </a>
        )}
        {project.live_url && (
          <a href={project.live_url} target="_blank" rel="noreferrer">
            Живая версия →
          </a>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  );
}
