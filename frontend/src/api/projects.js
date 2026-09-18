import request from "./client";

/**
 * Получить список проектов с опциональным поиском и фильтром по стеку.
 * @param {{ search?: string, tech?: string[] }} params
 */
export function fetchProjects({ search = "", tech = [] } = {}) {
  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (tech.length) query.set("tech", tech.join(","));

  const qs = query.toString();
  return request(`/projects/${qs ? `?${qs}` : ""}`);
}

export function fetchProject(slug) {
  return request(`/projects/${slug}/`);
}

export function fetchTechStack() {
  return request("/tech-stack/");
}
