from rest_framework.routers import DefaultRouter
from .views import PublicExperienceViewSet, AdminExperienceViewSet

public_router = DefaultRouter()
public_router.register(r'', PublicExperienceViewSet, basename='public-experience')

admin_router = DefaultRouter()
admin_router.register(r'', AdminExperienceViewSet, basename='admin-experience')

urlpatterns = [
    # Included via root urls.py
]
