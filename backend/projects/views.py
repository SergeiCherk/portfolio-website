from django.db.models import Q
from rest_framework import generics

from .models import Project, TechStack
from .serializers import ProjectDetailSerializer, ProjectListSerializer, TechStackSerializer


class ProjectListView(generics.ListAPIView):
    """
    GET /api/projects/
    GET /api/projects/?search=названиеИлиОписание
    GET /api/projects/?tech=react,django   (slug технологий через запятую)
    """
    serializer_class = ProjectListSerializer

    def get_queryset(self):
        queryset = Project.objects.all().prefetch_related("tech_stack")

        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(short_description__icontains=search)
                | Q(description__icontains=search)
            )

        tech = self.request.query_params.get("tech")
        if tech:
            tech_slugs = [t.strip() for t in tech.split(",") if t.strip()]
            if tech_slugs:
                queryset = queryset.filter(tech_stack__slug__in=tech_slugs).distinct()

        return queryset


class ProjectDetailView(generics.RetrieveAPIView):
    """GET /api/projects/<slug>/"""
    queryset = Project.objects.all().prefetch_related("tech_stack", "gallery")
    serializer_class = ProjectDetailSerializer
    lookup_field = "slug"


class TechStackListView(generics.ListAPIView):
    """GET /api/tech-stack/  — список всех тегов для построения фильтра на фронте"""
    queryset = TechStack.objects.all()
    serializer_class = TechStackSerializer
