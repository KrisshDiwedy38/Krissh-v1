from django.contrib import admin
from .models import Experience

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('role', 'company', 'status', 'start_date', 'end_date')
    list_filter = ('status',)
    search_fields = ('role', 'company', 'description')
