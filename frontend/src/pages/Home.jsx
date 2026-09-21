import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProjects } from "../api/projects";
import siteConfig from "../content/site";
import useDocumentTitle from "../hooks/useDocumentTitle";
import "./Home.css";

/**
 * Главная страница: краткое представление (из content/site.js)
 * и подборка проектов, отмеченных «избранными» в админке.
 */
export default function Home() {
  useDocumentTitle(null); // на главной — просто "Портфолио", без приставки

  const [featured, setFeatured] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Показываем максимум 4 избранных проекта — больше на "полке" не нужно
  useEffect(() => {
    fetchProjects({ featured: true })
      .then((data) => setFeatured((data.results ?? data).slice(0, 4)))
      .catch(() => setFeatured([])) // тихо скрываем блок, если API недоступен
      .finally(() => setLoaded(true));
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__intro">
          <p className="hero__role">{siteConfig.role}</p>
          <h1 className="hero__name">{siteConfig.name}</h1>

          {siteConfig.about.map((paragraph, i) => (
            <p key={i} className="hero__about">
              {paragraph}
            </p>
          ))}

          <div className="hero__actions">
            <Link to="/projects" className="hero__cta">
              {siteConfig.ctaText}
            </Link>
            <div className="hero__socials">
              {siteConfig.socials.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="hero__shelf">
          <span className="hero__shelf-label">Лучшие проекты</span>

          {loaded && featured.length === 0 && (
            <p className="hero__shelf-empty">
              Здесь появятся проекты, отмеченные «избранными» в админке.
            </p>
          )}

          <ul className="shelf-list">
            {featured.map((project) => (
              <li key={project.id} className="shelf-item">
                <Link to={`/projects/${project.slug}`} className="shelf-item__link">
                  <span className="shelf-item__title">{project.title}</span>
                  <span className="shelf-item__desc">{project.short_description}</span>
                  <span className="shelf-item__tags">
                    {project.tech_stack.map((t) => t.name).join(" · ")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
