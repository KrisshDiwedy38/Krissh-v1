from django.db import models
from core.validators import validate_image

class Experience(models.Model):
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('PUBLISHED', 'Published')
    ]

    EMPLOYMENT_TYPE_CHOICES = [
        ('FULL_TIME', 'Full-time'),
        ('PART_TIME', 'Part-time'),
        ('INTERNSHIP', 'Internship'),
        ('FREELANCE', 'Freelance'),
        ('CONTRACT', 'Contract'),
    ]

    company = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True)
    employment_type = models.CharField(max_length=50, choices=EMPLOYMENT_TYPE_CHOICES, default='FULL_TIME')
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    logo = models.ImageField(upload_to='experience/logos/', validators=[validate_image], null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-start_date']

    def __str__(self):
        return f"{self.role} at {self.company}"
