from rest_framework import serializers
from .models import AboutMe, SkillCategory, Skill

class BaseModelSerializer(serializers.ModelSerializer):
    """
    A base model serializer that sets default read_only_fields.
    """
    class Meta:
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']

class AboutMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutMe
        fields = ['id', 'bio', 'profile_image', 'resume', 'title', 'core_skill', 'weapon', 'base']

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'category', 'name', 'order']

class SkillCategorySerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)

    class Meta:
        model = SkillCategory
        fields = ['id', 'title', 'subtitle', 'order', 'skills']
