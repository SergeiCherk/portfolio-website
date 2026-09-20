"""
Главный файл настроек проекта.

Все значения, которые различаются между локальной разработкой и продакшеном
(секретный ключ, домены, режим отладки), читаются из переменных окружения —
см. backend/.env.example.
"""

import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")


# --- Основные параметры -------------------------------------------------

# На проде обязательно свой уникальный ключ — см. .env.example, как его сгенерировать.
SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "django-insecure-CHANGE-ME-in-.env-file",
)

# True — для локальной разработки. На проде обязательно False.
DEBUG = os.environ.get("DJANGO_DEBUG", "True") == "True"

ALLOWED_HOSTS = [
    h.strip() for h in os.environ.get("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",") if h.strip()
]

# Путь к админке настраивается через .env (DJANGO_ADMIN_URL) — можно увести
# с дефолтного /admin/, который в первую очередь сканируют боты.
ADMIN_URL = os.environ.get("DJANGO_ADMIN_URL", "admin/")


# --- Приложения и middleware ---------------------------------------------

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'axes',       # блокировка после N неудачных попыток входа в админку
    'projects',   # наше приложение: проекты, технологии, галерея
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'axes.middleware.AxesMiddleware',  # обязательно последним в списке
]

ROOT_URLCONF = 'config.urls'
WSGI_APPLICATION = 'config.wsgi.application'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


# --- Защита от перебора пароля (django-axes) ------------------------------
# После AXES_FAILURE_LIMIT неверных попыток входа — блокировка на AXES_COOLOFF_TIME
# часов, отдельно по логину и по IP.

AUTHENTICATION_BACKENDS = [
    'axes.backends.AxesStandaloneBackend',  # обязательно первым в списке
    'django.contrib.auth.backends.ModelBackend',
]
AXES_FAILURE_LIMIT = 5
AXES_COOLOFF_TIME = 1  # час
AXES_LOCKOUT_PARAMETERS = ["username", "ip_address"]


# --- База данных -----------------------------------------------------------

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# --- Проверка сложности пароля (стандартные валидаторы Django) -------------

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# --- Язык и часовой пояс -----------------------------------------------------

LANGUAGE_CODE = 'ru-ru'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# --- Статика и медиафайлы ---------------------------------------------------

STATIC_URL = 'static/'

MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'  # сюда попадают фото, загруженные через админку

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# --- Django REST Framework --------------------------------------------------

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',  # API отдаёт данные всем, без авторизации
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 12,
}

# Разрешаем фронтенду (React/Vite на другом порту) обращаться к API
CORS_ALLOWED_ORIGINS = [
    o.strip() for o in os.environ.get(
        "CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",") if o.strip()
]

# Лимит на размер загружаемых файлов (фото проектов) — 5 МБ
DATA_UPLOAD_MAX_MEMORY_SIZE = 5 * 1024 * 1024
FILE_UPLOAD_MAX_MEMORY_SIZE = 5 * 1024 * 1024


# --- Продовые security-заголовки --------------------------------------------
# Включаются автоматически, как только DJANGO_DEBUG=False в .env.
# Перед включением убедись, что сайт реально доступен по HTTPS —
# иначе SECURE_SSL_REDIRECT заблокирует доступ.

if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 60 * 60 * 24 * 30  # 30 дней
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = "DENY"
