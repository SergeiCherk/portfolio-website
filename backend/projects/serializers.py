from rest_framework import serializers

from .models import Project, ProjectImage, TechStack


class TechStackSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechStack
        fields = ["id", "name", "slug"]


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ["id", "image", "caption", "order"]


class ProjectListSerializer(serializers.ModelSerializer):
    """Короткий сериализатор — для карточек на странице списка проектов"""
    tech_stack = TechStackSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            "id", "title", "slug", "short_description",
            "cover_image", "github_url", "live_url",
            "tech_stack", "is_featured",
        ]


class ProjectDetailSerializer(serializers.ModelSerializer):
    """Полный сериализатор — для страницы одного проекта"""
    tech_stack = TechStackSerializer(many=True, read_only=True)
    gallery = ProjectImageSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            "id", "title", "slug", "short_description", "description",
            "cover_image", "github_url", "live_url",
            "tech_stack", "gallery", "is_featured",
            "created_at", "updated_at",
        ]
