from django.contrib import admin
from .models import Project, ProjectImage

class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'category', 'order', 'created_at')
    list_filter = ('status', 'category')
    search_fields = ('title', 'description')
    inlines = [ProjectImageInline]
    prepopulated_fields = {'slug': ('title',)}
