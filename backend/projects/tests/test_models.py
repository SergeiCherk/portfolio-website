import io

from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from PIL import Image

from projects.models import Project, TechStack, validate_image_size


def make_test_image(size_kb=1, name="test.png"):
    """Генерирует настоящий валидный PNG-файл нужного примерного размера — для тестов загрузки."""
    image = Image.new("RGB", (10, 10), color="red")
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    content = buffer.getvalue()
    # Дополняем до нужного размера, чтобы проверить лимит по весу файла
    padding = max(0, size_kb * 1024 - len(content))
    return SimpleUploadedFile(name, content + b"\0" * padding, content_type="image/png")


class TechStackModelTests(TestCase):
    def test_slug_generates_automatically_from_name(self):
        tech = TechStack.objects.create(name="React")
        self.assertEqual(tech.slug, "react")

    def test_slug_is_not_overwritten_if_provided(self):
        tech = TechStack.objects.create(name="Node.js", slug="custom-slug")
        self.assertEqual(tech.slug, "custom-slug")

    def test_str_returns_name(self):
        tech = TechStack.objects.create(name="Django")
        self.assertEqual(str(tech), "Django")


class ProjectModelTests(TestCase):
    def test_slug_transliterates_cyrillic_title(self):
        project = Project.objects.create(
            title="Мой Крутой Проект",
            short_description="Кратко",
            description="Полностью",
        )
        self.assertEqual(project.slug, "moy-krutoy-proekt")

    def test_duplicate_titles_get_unique_slugs(self):
        first = Project.objects.create(title="Портфолио", short_description="x", description="x")
        second = Project.objects.create(title="Портфолио", short_description="x", description="x")
        self.assertEqual(first.slug, "portfolio")
        self.assertEqual(second.slug, "portfolio-2")

    def test_default_ordering_by_order_then_newest_first(self):
        first = Project.objects.create(title="A", short_description="x", description="x", order=1)
        second = Project.objects.create(title="B", short_description="x", description="x", order=0)
        projects = list(Project.objects.all())
        self.assertEqual(projects[0], second)  # order=0 показывается первым
        self.assertEqual(projects[1], first)

    def test_str_returns_title(self):
        project = Project.objects.create(title="Мой проект", short_description="x", description="x")
        self.assertEqual(str(project), "Мой проект")


class ImageValidatorTests(TestCase):
    def test_small_image_passes_validation(self):
        small_file = make_test_image(size_kb=100)  # 100 КБ — намного меньше лимита
        try:
            validate_image_size(small_file)
        except ValidationError:
            self.fail("Файл в пределах лимита не должен вызывать ValidationError")

    def test_oversized_image_is_rejected(self):
        huge_file = make_test_image(size_kb=6 * 1024)  # 6 МБ — больше лимита в 5 МБ
        with self.assertRaises(ValidationError):
            validate_image_size(huge_file)
