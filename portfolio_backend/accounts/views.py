from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response

class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        # If successfully generated tokens
        if response.status_code == 200:
            refresh_token = response.data.get('refresh')
            # remove refresh from the response body for security
            if refresh_token:
                del response.data['refresh']
                
                # set refresh token in httpOnly cookie
                response.set_cookie(
                    key='refresh_token',
                    value=refresh_token,
                    max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
                    httponly=True,
                    samesite='Lax', # adjust to 'None' and secure=True in production with cross-domain
                    secure=False    # set True in production
                )
        return response

class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        # The frontend won't send the refresh token in the body, it's in the cookie
        refresh_token = request.COOKIES.get('refresh_token')
        
        if refresh_token:
            # manually inject it into data for simplejwt serializer
            request.data['refresh'] = refresh_token
            
        response = super().post(request, *args, **kwargs)
        
        # simplejwt rotate_refresh_tokens will generate a new refresh token
        if response.status_code == 200:
            new_refresh_token = response.data.get('refresh')
            if new_refresh_token:
                del response.data['refresh']
                
                response.set_cookie(
                    key='refresh_token',
                    value=new_refresh_token,
                    max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
                    httponly=True,
                    samesite='Lax',
                    secure=False
                )
        return response

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"detail": "Successfully logged out."})
        response.delete_cookie('refresh_token')
        return response
