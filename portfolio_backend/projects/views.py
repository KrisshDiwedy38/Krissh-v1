from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Project
from .serializers import ProjectListSerializer, ProjectDetailSerializer, AdminProjectSerializer
from core.views import StatusToggleMixin

class PublicProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public API:
    - Lists only PUBLISHED projects
    - Uses lightweight serializer for list, detailed for retrieve
    """
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return Project.objects.filter(status='PUBLISHED').prefetch_related('images')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectListSerializer

class AdminProjectViewSet(StatusToggleMixin, viewsets.ModelViewSet):
    """
    Admin API:
    - Requires JWT Authentication (IsAuthenticated)
    - Full CRUD access to all projects (including DRAFT)
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = Project.objects.all()
    serializer_class = AdminProjectSerializer
