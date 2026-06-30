import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from .validators import validate_image
from django.core.files.storage import default_storage
from rest_framework import viewsets
from .models import AboutMe, SkillCategory, Skill
from .serializers import AboutMeSerializer, SkillCategorySerializer, SkillSerializer
from rest_framework.decorators import action
from rest_framework import status as drf_status

class StatusToggleMixin:
    @action(detail=True, methods=['patch'], url_path='status')
    def toggle_status(self, request, pk=None):
        obj = self.get_object()
        new_status = request.data.get('status')
        model_class = self.get_queryset().model
        if new_status not in [choice[0] for choice in model_class.STATUS_CHOICES]:
            return Response({"error": "Invalid status value."}, status=drf_status.HTTP_400_BAD_REQUEST)
        
        obj.status = new_status
        obj.save()
        return Response({'status': obj.status})

class AboutMePublicView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        about, created = AboutMe.objects.get_or_create(id=1)
        serializer = AboutMeSerializer(about, context={'request': request})
        return Response(serializer.data)

class AboutMeAdminView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get(self, request):
        about, created = AboutMe.objects.get_or_create(id=1)
        serializer = AboutMeSerializer(about, context={'request': request})
        return Response(serializer.data)
        
    def patch(self, request):
        about, created = AboutMe.objects.get_or_create(id=1)
        serializer = AboutMeSerializer(about, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class SkillCategoryPublicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SkillCategory.objects.prefetch_related('skills')
    serializer_class = SkillCategorySerializer
    permission_classes = [AllowAny]

class SkillCategoryAdminViewSet(viewsets.ModelViewSet):
    queryset = SkillCategory.objects.all()
    serializer_class = SkillCategorySerializer
    permission_classes = [IsAuthenticated]

class SkillAdminViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]

class StandaloneImageUploadView(APIView):
    """
    POST /api/admin/upload/image/
    Accepts multipart file 'image', validates it, saves to media/uploads/, returns URL.
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, format=None):
        file = request.FILES.get('image')
        if not file:
            return Response({"error": "No image file provided."}, status=400)
            
        try:
            validate_image(file)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
            
        # Save file
        path = default_storage.save(f'uploads/{file.name}', file)
        url = request.build_absolute_uri(settings.MEDIA_URL + path)
        
        return Response({"url": url})

import resend
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit

class ContactView(APIView):
    """
    POST /api/contact/
    Accepts name, email, message. Sends email via Resend. Rate limited to 5/hour per IP.
    """
    permission_classes = [AllowAny]

    @method_decorator(ratelimit(key='ip', rate='2/h', method='POST', block=True))
    @method_decorator(ratelimit(key='ip', rate='3/d', method='POST', block=True))
    def post(self, request, format=None):
        name = request.data.get('name')
        email = request.data.get('email')
        message = request.data.get('message')

        if not all([name, email, message]):
            return Response({"error": "Name, email, and message are required."}, status=400)

        from django.core.validators import validate_email
        from django.core.exceptions import ValidationError
        from django.utils.html import escape

        try:
            validate_email(email)
        except ValidationError:
            return Response({"error": "Invalid email format."}, status=400)

        name = escape(name)
        email = escape(email)
        message = escape(message)

        from decouple import config
        resend.api_key = config('RESEND_API_KEY', default='')
        receiver_email = config('RECEIVER_EMAIL', default='')

        if not resend.api_key or not receiver_email:
            return Response({"error": "Server configuration error."}, status=500)

        html_content = f"""
            <div style="font-family: monospace; background-color: #050515; color: #00dddd; padding: 20px; border: 3px solid #ffffff; box-shadow: 6px 6px 0px 0px #ffabf3;">
              <h2 style="color: #ffabf3; text-transform: uppercase;">Incoming Subspace Transmission</h2>
              <hr style="border-color: #00dddd;" />
              <p><strong>CALLSIGN:</strong> {name}</p>
              <p><strong>FREQUENCY (Email):</strong> {email}</p>
              <hr style="border-color: #00dddd;" />
              <p><strong>PAYLOAD:</strong></p>
              <div style="background-color: #000; padding: 15px; border-left: 4px solid #ffabf3; color: #ffffff;">
                {message}
              </div>
              <p style="margin-top: 20px; font-size: 12px; color: #666;">Transmitted via Celestial Neobrutalism Portfolio</p>
            </div>
        """

        try:
            r = resend.Emails.send({
                "from": "Acme <onboarding@resend.dev>",
                "to": receiver_email,
                "subject": f"Incoming transmission from {name}",
                "html": html_content
            })
            return Response({"success": "Transmission sent.", "id": r.get('id')})
        except Exception as e:
            return Response({"error": str(e)}, status=500)
