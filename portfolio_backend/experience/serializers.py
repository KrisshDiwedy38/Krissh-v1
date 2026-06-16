from rest_framework import serializers
from .models import Experience
from core.serializers import BaseModelSerializer

class ExperienceSerializer(BaseModelSerializer):
    class Meta(BaseModelSerializer.Meta):
        model = Experience
        fields = BaseModelSerializer.Meta.read_only_fields + [
            'company', 'role', 'description', 'start_date', 'end_date',
            'logo', 'status', 'order'
        ]

class AdminExperienceSerializer(ExperienceSerializer):
    """
    Serializer used by admin endpoints to create/update experience.
    """
    pass
