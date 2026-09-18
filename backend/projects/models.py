from django.db import models


class TechStack(models.Model):
    """Тег технологии (React, Django, PostgreSQL и т.д.)"""
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True, blank=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Технология"
        verbose_name_plural = "Технологии"

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Project(models.Model):
    """Проект в портфолио"""
    title = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    short_description = models.CharField(
        max_length=250,
        help_text="Краткое описание для карточки проекта"
    )
    description = models.TextField(
        help_text="Полное описание, показывается на странице проекта"
    )
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True, help_text="Ссылка на живую версию проекта, если есть")
    cover_image = models.ImageField(
        upload_to="projects/covers/",
        blank=True,
        null=True,
        help_text="Главное фото для карточки проекта"
    )
    tech_stack = models.ManyToManyField(TechStack, related_name="projects", blank=True)
    is_featured = models.BooleanField(
        default=False,
        help_text="Показывать на главной странице"
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Чем меньше число, тем выше в списке"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "-created_at"]
        verbose_name = "Проект"
        verbose_name_plural = "Проекты"

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ProjectImage(models.Model):
    """Дополнительные фото проекта (галерея на странице проекта)"""
    project = models.ForeignKey(Project, related_name="gallery", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="projects/gallery/")
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        verbose_name = "Фото проекта"
        verbose_name_plural = "Фото проектов"

    def __str__(self):
        return f"{self.project.title} — фото {self.order}"
