import uuid

from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from django.db import models
from django.utils.text import slugify

ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"]
MAX_IMAGE_SIZE_MB = 5

# Django's slugify() не транслитерирует кириллицу — "Мой проект" даёт пустой slug.
# Своя таблица транслитерации решает это до вызова slugify().
_CYRILLIC_TO_LATIN = {
    "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "e", "ж": "zh",
    "з": "z", "и": "i", "й": "y", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o",
    "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f", "х": "h", "ц": "ts",
    "ч": "ch", "ш": "sh", "щ": "sch", "ъ": "", "ы": "y", "ь": "", "э": "e", "ю": "yu",
    "я": "ya",
}


def transliterate(text):
    """Кириллица → латиница, посимвольно. Всё остальное (латиница, цифры) не трогаем."""
    return "".join(_CYRILLIC_TO_LATIN.get(char, char) for char in text.lower())


def generate_unique_slug(value, model_cls, exclude_pk=None):
    """
    Транслитерация + slugify. Если после этого ничего не осталось (например,
    название состоит только из эмодзи) — используем короткий случайный slug.
    Если такой slug уже занят другой записью — добавляем -2, -3, ... пока не
    найдётся свободный (защита от IntegrityError при одинаковых названиях).
    """
    base_slug = slugify(transliterate(value)) or uuid.uuid4().hex[:8]

    slug = base_slug
    counter = 2
    queryset = model_cls.objects.all()
    if exclude_pk:
        queryset = queryset.exclude(pk=exclude_pk)

    while queryset.filter(slug=slug).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1

    return slug


def validate_image_size(file):
    """Отклоняет файлы тяжелее MAX_IMAGE_SIZE_MB — защита от заливки гигантских файлов."""
    limit_bytes = MAX_IMAGE_SIZE_MB * 1024 * 1024
    if file.size > limit_bytes:
        raise ValidationError(f"Файл слишком большой — максимум {MAX_IMAGE_SIZE_MB} МБ.")


class TechStack(models.Model):
    """Тег технологии (React, Django, PostgreSQL и т.д.)"""
    name = models.CharField("Название", max_length=50, unique=True)
    slug = models.SlugField("Slug (для URL и фильтра)", max_length=50, unique=True, blank=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Технология"
        verbose_name_plural = "Технологии"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(self.name, TechStack, exclude_pk=self.pk)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Project(models.Model):
    """Проект в портфолио"""
    title = models.CharField("Название", max_length=120)
    slug = models.SlugField("Slug (для URL)", max_length=140, unique=True, blank=True)
    short_description = models.CharField(
        "Краткое описание",
        max_length=250,
        help_text="Показывается на карточке проекта в списке"
    )
    description = models.TextField(
        "Полное описание",
        help_text="Показывается на странице проекта"
    )
    github_url = models.URLField("Ссылка на GitHub", blank=True)
    live_url = models.URLField("Ссылка на живую версию", blank=True, help_text="Если проект где-то развёрнут")
    cover_image = models.ImageField(
        "Обложка",
        upload_to="projects/covers/",
        blank=True,
        null=True,
        help_text=f"Главное фото для карточки проекта. Форматы: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}. До {MAX_IMAGE_SIZE_MB} МБ.",
        validators=[FileExtensionValidator(ALLOWED_IMAGE_EXTENSIONS), validate_image_size],
    )
    tech_stack = models.ManyToManyField(TechStack, related_name="projects", blank=True, verbose_name="Технологии")
    is_featured = models.BooleanField(
        "Показывать на главной",
        default=False,
        help_text="Проект попадёт в блок «Лучшие проекты» на главной странице"
    )
    order = models.PositiveIntegerField(
        "Порядок сортировки",
        default=0,
        help_text="Чем меньше число, тем выше в списке"
    )
    created_at = models.DateTimeField("Дата создания", auto_now_add=True)
    updated_at = models.DateTimeField("Дата обновления", auto_now=True)

    class Meta:
        ordering = ["order", "-created_at"]
        verbose_name = "Проект"
        verbose_name_plural = "Проекты"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(self.title, Project, exclude_pk=self.pk)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ProjectImage(models.Model):
    """Дополнительные фото проекта (галерея на странице проекта)"""
    project = models.ForeignKey(Project, related_name="gallery", on_delete=models.CASCADE, verbose_name="Проект")
    image = models.ImageField(
        "Изображение",
        upload_to="projects/gallery/",
        help_text=f"Форматы: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}. До {MAX_IMAGE_SIZE_MB} МБ.",
        validators=[FileExtensionValidator(ALLOWED_IMAGE_EXTENSIONS), validate_image_size],
    )
    caption = models.CharField("Подпись", max_length=200, blank=True)
    order = models.PositiveIntegerField("Порядок", default=0)

    class Meta:
        ordering = ["order"]
        verbose_name = "Фото проекта"
        verbose_name_plural = "Фото проектов"

    def __str__(self):
        return f"{self.project.title} — фото {self.order}"
