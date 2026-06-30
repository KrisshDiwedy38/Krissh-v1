from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Experience
from .serializers import ExperienceSerializer, AdminExperienceSerializer
from core.views import StatusToggleMixin

class PublicExperienceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public API:
    - Lists only PUBLISHED experience
    """
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Experience.objects.filter(status='PUBLISHED')

    def get_serializer_class(self):
        return ExperienceSerializer

class AdminExperienceViewSet(StatusToggleMixin, viewsets.ModelViewSet):
    """
    Admin API:
    - Requires JWT Authentication (IsAuthenticated)
    - Full CRUD access to all experience
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = Experience.objects.all()
    serializer_class = AdminExperienceSerializer
