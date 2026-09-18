import "./TechFilter.css";

export default function TechFilter({ options, selected, onToggle }) {
  return (
    <div className="tech-filter">
      {options.map((tech) => {
        const isActive = selected.includes(tech.slug);
        return (
          <button
            key={tech.id}
            type="button"
            className={`tech-filter__item${isActive ? " tech-filter__item--active" : ""}`}
            onClick={() => onToggle(tech.slug)}
          >
            {tech.name}
          </button>
        );
      })}
    </div>
  );
}
