import { Link } from "react-router-dom";
import "./ProjectCard.css";

export default function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.slug}`} className="project-card">
      {project.cover_image && (
        <img
          className="project-card__image"
          src={project.cover_image}
          alt={project.title}
        />
      )}
      <div className="project-card__body">
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.short_description}</p>
        <div className="project-card__tags">
          {project.tech_stack.map((tech) => (
            <span key={tech.id} className="tag">
              {tech.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
