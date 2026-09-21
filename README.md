# 🗂 Портфолио

Личный сайт-портфолио с каталогом проектов: поиск, фильтр по технологиям,
галерея фото и собственная админ-панель на русском языке.

![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-6.1-092E20?logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## ✨ Возможности

- **Главная страница** — короткий рассказ о себе и подборка лучших проектов
- **Каталог проектов** — поиск по названию/описанию и фильтр по стеку технологий
- **Страница проекта** — описание, ссылка на GitHub, горизонтальная лента фото с полноэкранным просмотром
- **Админ-панель на русском** — добавление проектов, технологий и фото без единой строчки кода
- **Светлая/тёмная тема** — переключатель в шапке, выбор запоминается
- **Готово к продакшену** — защита от перебора пароля, лимиты на загрузку файлов, продовые security-заголовки «из коробки»

## 🛠 Технологии

| Слой | Стек |
|---|---|
| Backend | Django · Django REST Framework · SQLite · django-axes |
| Frontend | React · Vite · React Router |
| Дизайн | Собственная дизайн-система (CSS-переменные), Fraunces + Inter |
| Тесты | Django TestCase / DRF APITestCase · Vitest + React Testing Library |

## 🚀 Быстрый старт

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # затем открой .env и заполни значения — см. ниже

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend поднимется на `http://127.0.0.1:8000/`.
Админка — по адресу из `DJANGO_ADMIN_URL` в твоём `.env` (по умолчанию `http://127.0.0.1:8000/admin/`).
API — `http://127.0.0.1:8000/api/projects/`.

> **Важно про `.env`:** для локальной разработки `DJANGO_DEBUG` должен быть `True`.
> Значение `False` включает принудительный редирект на HTTPS, а локальный
> `runserver` его не поддерживает — сайт перестанет открываться. Ставь `False`
> только на реальном хостинге с настоящим SSL-сертификатом.

### Frontend

В новом терминале:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Сайт откроется на `http://localhost:5173/`.

## ✍️ Как сделать сайт своим

Личный контент вынесен в **один файл** — трогать компоненты не нужно:

```
frontend/src/content/site.js
```

Здесь редактируются имя, роль, текст «обо мне», email и ссылки на соцсети —
изменения сразу применятся в шапке, на главной и в подвале.

Дальше — заходишь в админку и наполняешь сайт:

1. **Технологии** → добавь теги стека (React, Django, PostgreSQL...)
2. **Проекты** → **Добавить проект**: название, описания, ссылка на GitHub, обложка, теги
3. Отметь галочку **«Показывать на главной»** у 2–4 лучших проектов — они появятся в блоке «Лучшие проекты»

## 🎨 Тема оформления

Переключатель светлой/тёмной темы — в шапке сайта (иконка ☾ / ☀︎).
Все цвета и шрифты собраны в одном месте:

```
frontend/src/styles/tokens.css
```

## 🔒 Безопасность

Что уже встроено:

- Секреты (`SECRET_KEY` и другие) читаются из `.env`, сам файл не попадает в git
- Защита от перебора пароля в админке ([django-axes](https://github.com/jazzband/django-axes)): 5 неудачных попыток → блокировка на час, по логину и по IP
- Загрузка фото ограничена форматами `jpg/jpeg/png/webp/gif` и размером до 5 МБ
- API отдаёт данные только на чтение — менять контент можно исключительно через админку под логином
- Продовые security-заголовки (HSTS, secure cookies, редирект на HTTPS) включаются автоматически при `DJANGO_DEBUG=False`

<details>
<summary><strong>Чек-лист перед выкладкой на прод</strong></summary>

1. Выстави `DJANGO_DEBUG=False`
2. Сгенерируй новый ключ:
   ```bash
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```
   и пропиши его в `DJANGO_SECRET_KEY`
3. Укажи реальный домен в `DJANGO_ALLOWED_HOSTS`
4. Укажи реальный домен фронтенда в `CORS_ALLOWED_ORIGINS`
5. Убедись, что сайт работает по HTTPS (Render/Railway дают это «из коробки»)
6. Поставь сильный пароль на `createsuperuser`
7. При желании смени `DJANGO_ADMIN_URL` на что-то непредсказуемое
8. Прогони `python manage.py check --deploy` — команда сама покажет пробелы

</details>

## 📁 Структура проекта

```
portfolio-website/
├── backend/                 # Django-проект
│   ├── config/               # настройки, корневые URL
│   └── projects/              # приложение: модели, API, админка
├── frontend/                # React-приложение (Vite)
│   └── src/
│       ├── pages/             # Home, Projects, ProjectDetail
│       ├── components/        # Navbar, Footer, ProjectCard, Lightbox...
│       ├── content/            # site.js — весь личный контент
│       ├── context/            # переключатель темы
│       └── styles/             # design-токены
└── README.md
```

## 🌐 API

| Метод | URL | Описание |
|---|---|---|
| GET | `/api/projects/` | список проектов |
| GET | `/api/projects/?search=текст` | поиск по названию/описанию |
| GET | `/api/projects/?tech=react,django` | фильтр по тегам стека |
| GET | `/api/projects/?featured=true` | только избранные проекты |
| GET | `/api/projects/<slug>/` | детальная информация о проекте |
| GET | `/api/tech-stack/` | список всех технологий |

## 📌 Статус разработки

- [x] Каркас проекта, `.gitignore`
- [x] Модели, API, админка на русском
- [x] Главная, каталог проектов, страница проекта с галереей
- [x] Дизайн-система (light/dark), собственная типографика
- [x] Адаптив под мобильные устройства
- [x] Базовая безопасность
- [x] Тесты (backend + frontend)
- [ ] Наполнение реальным контентом
- [ ] Деплой

## 🧪 Тесты

```bash
# Backend (Django) — 20 тестов: модели, slug, API-фильтры, валидация фото
cd backend
python manage.py test

# Frontend (Vitest + React Testing Library) — 32 теста: компоненты, тема, поиск/фильтр
cd frontend
npm run test          # разовый прогон
npm run test:watch    # в режиме наблюдения при разработке
```

## 📄 Лицензия

MIT — используй свободно как основу для своего сайта.
