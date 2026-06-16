from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Experience
from .serializers import ExperienceSerializer, AdminExperienceSerializer

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

class AdminExperienceViewSet(viewsets.ModelViewSet):
    """
    Admin API:
    - Requires JWT Authentication (IsAuthenticated)
    - Full CRUD access to all experience
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = Experience.objects.all()
    serializer_class = AdminExperienceSerializer

    @action(detail=True, methods=['patch'], url_path='status')
    def toggle_status(self, request, pk=None):
        experience = self.get_object()
        new_status = request.data.get('status')
        if new_status not in [choice[0] for choice in Experience.STATUS_CHOICES]:
            return Response({"error": "Invalid status value."}, status=status.HTTP_400_BAD_REQUEST)
        
        experience.status = new_status
        experience.save()
        return Response({'status': experience.status})
