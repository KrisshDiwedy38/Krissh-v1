from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Project
from .serializers import ProjectListSerializer, ProjectDetailSerializer, AdminProjectSerializer

class PublicProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public API:
    - Lists only PUBLISHED projects
    - Uses lightweight serializer for list, detailed for retrieve
    """
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return Project.objects.filter(status='PUBLISHED')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectListSerializer

class AdminProjectViewSet(viewsets.ModelViewSet):
    """
    Admin API:
    - Requires JWT Authentication (IsAuthenticated)
    - Full CRUD access to all projects (including DRAFT)
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = Project.objects.all()
    serializer_class = AdminProjectSerializer

    @action(detail=True, methods=['patch'], url_path='status')
    def toggle_status(self, request, pk=None):
        project = self.get_object()
        new_status = request.data.get('status')
        if new_status not in [choice[0] for choice in Project.STATUS_CHOICES]:
            return Response({"error": "Invalid status value."}, status=status.HTTP_400_BAD_REQUEST)
        
        project.status = new_status
        project.save()
        return Response({'status': project.status})
