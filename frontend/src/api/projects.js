import request from "./client";

/**
 * Получить список проектов с опциональным поиском, фильтром по стеку и признаком "избранное".
 * @param {{ search?: string, tech?: string[], featured?: boolean }} params
 */
export function fetchProjects({ search = "", tech = [], featured = false } = {}) {
  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (tech.length) query.set("tech", tech.join(","));
  if (featured) query.set("featured", "true");

  const qs = query.toString();
  return request(`/projects/${qs ? `?${qs}` : ""}`);
}

export function fetchProject(slug) {
  return request(`/projects/${slug}/`);
}

export function fetchTechStack() {
  return request("/tech-stack/");
}
