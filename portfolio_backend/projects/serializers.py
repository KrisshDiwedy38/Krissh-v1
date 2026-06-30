from rest_framework import serializers
from .models import Project, ProjectImage
from core.serializers import BaseModelSerializer, SluggedModelSerializer

class ProjectImageSerializer(BaseModelSerializer):
    class Meta(BaseModelSerializer.Meta):
        model = ProjectImage
        fields = BaseModelSerializer.Meta.read_only_fields + ['project', 'image', 'order']

class ProjectListSerializer(SluggedModelSerializer):
    class Meta(SluggedModelSerializer.Meta):
        model = Project
        fields = SluggedModelSerializer.Meta.read_only_fields + [
            'title', 'short_description', 'description', 'tech_stack', 'github_url', 'live_url',
            'thumbnail', 'status', 'category', 'featured', 'order'
        ]

class ProjectDetailSerializer(ProjectListSerializer):
    images = ProjectImageSerializer(many=True, read_only=True)

    class Meta(ProjectListSerializer.Meta):
        fields = ProjectListSerializer.Meta.fields + ['images']

class AdminProjectSerializer(ProjectDetailSerializer):
    """
    Serializer used by admin endpoints to create/update projects.
    Allows writable nested fields if necessary, or just standard fields.
    """
    pass
