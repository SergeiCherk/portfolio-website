// Базовый адрес Django API.
// В разработке — локальный сервер, на проде задаётся через .env (VITE_API_URL)
export const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export default request;
