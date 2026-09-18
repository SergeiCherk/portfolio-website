from django.urls import path

from .views import ProjectDetailView, ProjectListView, TechStackListView

urlpatterns = [
    path("projects/", ProjectListView.as_view(), name="project-list"),
    path("projects/<slug:slug>/", ProjectDetailView.as_view(), name="project-detail"),
    path("tech-stack/", TechStackListView.as_view(), name="tech-stack-list"),
]
