import request from "./client";

/**
 * Получить список проектов с опциональным поиском, фильтром по стеку,
 * признаком "избранное" и номером страницы (backend отдаёт по 12 на страницу).
 * @param {{ search?: string, tech?: string[], featured?: boolean, page?: number }} params
 */
export function fetchProjects({ search = "", tech = [], featured = false, page = 1 } = {}) {
  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (tech.length) query.set("tech", tech.join(","));
  if (featured) query.set("featured", "true");
  if (page > 1) query.set("page", String(page));

  const qs = query.toString();
  return request(`/projects/${qs ? `?${qs}` : ""}`);
}

export function fetchProject(slug) {
  return request(`/projects/${slug}/`);
}

export function fetchTechStack() {
  return request("/tech-stack/");
}
