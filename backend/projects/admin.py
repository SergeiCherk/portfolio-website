from django.contrib import admin
from django.utils.html import format_html

from .models import Project, ProjectImage, TechStack


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1
    fields = ("image", "caption", "order", "preview")
    readonly_fields = ("preview",)

    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:60px;border-radius:4px;" />', obj.image.url)
        return "—"

    preview.short_description = "Превью"


@admin.register(TechStack)
class TechStackAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "project_count")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}

    def project_count(self, obj):
        return obj.projects.count()

    project_count.short_description = "Кол-во проектов"


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "cover_preview", "tech_list", "is_featured", "order", "created_at")
    list_filter = ("is_featured", "tech_stack")
    search_fields = ("title", "short_description", "description")
    filter_horizontal = ("tech_stack",)
    prepopulated_fields = {"slug": ("title",)}
    inlines = [ProjectImageInline]
    fieldsets = (
        ("Основное", {
            "fields": ("title", "slug", "short_description", "description")
        }),
        ("Ссылки", {
            "fields": ("github_url", "live_url")
        }),
        ("Медиа и стек", {
            "fields": ("cover_image", "tech_stack")
        }),
        ("Отображение", {
            "fields": ("is_featured", "order")
        }),
    )

    def cover_preview(self, obj):
        if obj.cover_image:
            return format_html('<img src="{}" style="height:50px;border-radius:4px;" />', obj.cover_image.url)
        return "—"

    cover_preview.short_description = "Обложка"

    def tech_list(self, obj):
        return ", ".join(t.name for t in obj.tech_stack.all())

    tech_list.short_description = "Стек"
