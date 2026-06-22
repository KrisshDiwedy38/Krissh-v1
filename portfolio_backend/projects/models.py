from django.db import models
from django.utils.text import slugify
from core.validators import validate_image

class Project(models.Model):
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('PUBLISHED', 'Published')
    ]
    CATEGORY_CHOICES = [
        ('WEB', 'Web'),
        ('ML', 'ML'),
        ('OTHER', 'Other')
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True, max_length=255)
    short_description = models.CharField(max_length=255, blank=True)
    description = models.TextField()
    tech_stack = models.JSONField(default=list)  # stored as JSON array, e.g. ["Python", "React"]
    github_url = models.URLField(blank=True, null=True)
    live_url = models.URLField(blank=True, null=True)
    thumbnail = models.ImageField(upload_to='projects/thumbnails/', validators=[validate_image])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='OTHER')
    featured = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Project.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class ProjectImage(models.Model):
    project = models.ForeignKey(Project, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='projects/images/', validators=[validate_image])
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.project.title} - Image {self.id}"
