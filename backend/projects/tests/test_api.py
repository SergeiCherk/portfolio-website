from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from projects.models import Project, TechStack


class ProjectListAPITests(APITestCase):
    def setUp(self):
        self.react = TechStack.objects.create(name="React")
        self.django = TechStack.objects.create(name="Django")

        self.project_a = Project.objects.create(
            title="Сайт-визитка",
            short_description="Простой лендинг",
            description="Подробное описание лендинга",
            is_featured=True,
        )
        self.project_a.tech_stack.add(self.react)

        self.project_b = Project.objects.create(
            title="Внутренняя CRM",
            short_description="Система учёта клиентов",
            description="Подробное описание CRM",
            is_featured=False,
        )
        self.project_b.tech_stack.add(self.django)

    def test_list_returns_all_projects(self):
        response = self.client.get(reverse("project-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 2)

    def test_search_filters_by_title(self):
        response = self.client.get(reverse("project-list"), {"search": "визитка"})
        titles = [p["title"] for p in response.data["results"]]
        self.assertEqual(titles, ["Сайт-визитка"])

    def test_search_filters_by_description(self):
        response = self.client.get(reverse("project-list"), {"search": "CRM"})
        titles = [p["title"] for p in response.data["results"]]
        self.assertEqual(titles, ["Внутренняя CRM"])

    def test_search_with_no_matches_returns_empty(self):
        response = self.client.get(reverse("project-list"), {"search": "несуществующий-запрос-xyz"})
        self.assertEqual(response.data["count"], 0)

    def test_filter_by_single_tech_slug(self):
        response = self.client.get(reverse("project-list"), {"tech": "react"})
        titles = [p["title"] for p in response.data["results"]]
        self.assertEqual(titles, ["Сайт-визитка"])

    def test_filter_by_multiple_tech_slugs_combines_with_or(self):
        response = self.client.get(reverse("project-list"), {"tech": "react,django"})
        self.assertEqual(response.data["count"], 2)

    def test_featured_filter_returns_only_featured(self):
        response = self.client.get(reverse("project-list"), {"featured": "true"})
        titles = [p["title"] for p in response.data["results"]]
        self.assertEqual(titles, ["Сайт-визитка"])

    def test_search_and_tech_filter_can_combine(self):
        response = self.client.get(reverse("project-list"), {"search": "лендинг", "tech": "django"})
        self.assertEqual(response.data["count"], 0)  # лендинг есть, но не на Django


class ProjectDetailAPITests(APITestCase):
    def setUp(self):
        self.project = Project.objects.create(
            title="Тестовый проект",
            short_description="Кратко",
            description="Полное описание",
            github_url="https://github.com/example/example",
        )

    def test_detail_returns_full_project_data(self):
        response = self.client.get(reverse("project-detail", args=[self.project.slug]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Тестовый проект")
        self.assertEqual(response.data["github_url"], "https://github.com/example/example")

    def test_detail_for_unknown_slug_returns_404(self):
        response = self.client.get(reverse("project-detail", args=["does-not-exist"]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TechStackListAPITests(APITestCase):
    def test_returns_all_tech_tags(self):
        TechStack.objects.create(name="Vue")
        TechStack.objects.create(name="FastAPI")
        response = self.client.get(reverse("tech-stack-list"))
        self.assertEqual(response.data["count"], 2)
