# Портфолио — сайт с проектами и админ-панелью

Стек: **Django + Django REST Framework** (backend, SQLite, встроенная админка) и **React (Vite)** (frontend).

## Структура

```
portfolio-website/
├── backend/     # Django-проект: API, модели, админка
└── frontend/    # React-приложение
```

## Быстрый старт

### 1. Backend (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # и при желании поменяй значения

python manage.py migrate
python manage.py createsuperuser   # создать логин/пароль для админки
python manage.py runserver
```

Backend поднимется на `http://127.0.0.1:8000/`.
Админ-панель — `http://127.0.0.1:8000/admin/`.
API — `http://127.0.0.1:8000/api/projects/`.

### 2. Frontend (React)

В новом терминале:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Сайт откроется на `http://localhost:5173/`.

## Как добавить проект в портфолио

1. Зайди в `http://127.0.0.1:8000/admin/`.
2. Раздел **Технологии** — добавь теги стека (React, Django, PostgreSQL...), если их ещё нет.
3. Раздел **Проекты** → **Добавить проект**: заполни название, описания, ссылку на GitHub, обложку, выбери технологии.
4. Проект сразу появится на странице `/projects` на сайте — с поиском и фильтром по стеку.

## API-эндпоинты

| Метод | URL | Описание |
|---|---|---|
| GET | `/api/projects/` | список проектов |
| GET | `/api/projects/?search=текст` | поиск по названию/описанию |
| GET | `/api/projects/?tech=react,django` | фильтр по тегам стека (slug через запятую) |
| GET | `/api/projects/<slug>/` | детальная информация о проекте |
| GET | `/api/tech-stack/` | список всех технологий (для построения фильтра) |

## Статус разработки

- [x] Каркас проекта (backend + frontend), `.gitignore`
- [x] Модели проектов, технологий, галереи
- [x] Django Admin для управления контентом
- [x] API: список / поиск / фильтр / детальная страница
- [x] Frontend: страница проектов с поиском и фильтром, страница проекта
- [ ] Главная страница — наполнение контентом
- [ ] Финальная стилизация / адаптивность
- [ ] Деплой (backend + frontend)
