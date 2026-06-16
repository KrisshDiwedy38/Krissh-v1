from rest_framework import serializers

class BaseModelSerializer(serializers.ModelSerializer):
    """
    A base model serializer that sets default read_only_fields.
    """
    class Meta:
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
