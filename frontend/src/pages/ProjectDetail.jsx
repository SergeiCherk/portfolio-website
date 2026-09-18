import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProject } from "../api/projects";
import "./ProjectDetail.css";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

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

  return (
    <section className="project-detail">
      <Link to="/projects" className="project-detail__back">
        ← Назад к проектам
      </Link>

      <h1>{project.title}</h1>

      {project.cover_image && (
        <img className="project-detail__cover" src={project.cover_image} alt={project.title} />
      )}

      <div className="project-detail__tags">
        {project.tech_stack.map((tech) => (
          <span key={tech.id} className="tag">
            {tech.name}
          </span>
        ))}
      </div>

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

      {project.gallery?.length > 0 && (
        <div className="project-detail__gallery">
          {project.gallery.map((img) => (
            <img key={img.id} src={img.image} alt={img.caption || project.title} />
          ))}
        </div>
      )}
    </section>
  );
}
