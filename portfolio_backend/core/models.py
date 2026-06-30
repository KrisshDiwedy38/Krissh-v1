from django.db import models
from core.validators import validate_image

class AboutMe(models.Model):
    bio = models.TextField()
    profile_image = models.ImageField(upload_to='about/', validators=[validate_image], null=True, blank=True)
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    title = models.CharField(max_length=100, default='The Architect')
    core_skill = models.CharField(max_length=100, default='Celestial Neobrutalism')
    weapon = models.CharField(max_length=100, default='Modern Frontend & Shaders')
    base = models.CharField(max_length=100, default='Digital Nebula 0x4')

    class Meta:
        verbose_name_plural = "About Me"

    def __str__(self):
        return "About Me Configuration"

    def save(self, *args, **kwargs):
        self.pk = 1
        super(AboutMe, self).save(*args, **kwargs)

class SkillCategory(models.Model):
    title = models.CharField(max_length=100)
    subtitle = models.CharField(max_length=100, blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name_plural = "Skill Categories"

    def __str__(self):
        return self.title

class Skill(models.Model):
    category = models.ForeignKey(SkillCategory, related_name='skills', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.name
