from rest_framework import serializers
from .models import Experience
from core.serializers import BaseModelSerializer

class ExperienceSerializer(BaseModelSerializer):
    class Meta:
        model = Experience
        fields = [
            'id', 'company', 'role', 'location', 'employment_type', 'description', 'start_date', 'end_date',
            'logo', 'status', 'order', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class AdminExperienceSerializer(ExperienceSerializer):
    """
    Serializer used by admin endpoints to create/update experience.
    """
    pass
