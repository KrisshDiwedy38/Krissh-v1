import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from .validators import validate_image
from django.core.files.storage import default_storage

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
