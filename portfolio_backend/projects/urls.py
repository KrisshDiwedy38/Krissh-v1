from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PublicProjectViewSet, AdminProjectViewSet

public_router = DefaultRouter()
public_router.register(r'', PublicProjectViewSet, basename='public-project')

admin_router = DefaultRouter()
admin_router.register(r'', AdminProjectViewSet, basename='admin-project')

urlpatterns = [
    # Will be included via root urls.py
]
