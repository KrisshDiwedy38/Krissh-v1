from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AboutMePublicView, AboutMeAdminView, SkillCategoryPublicViewSet, SkillCategoryAdminViewSet, SkillAdminViewSet

public_router = DefaultRouter()
public_router.register(r'', SkillCategoryPublicViewSet, basename='public-skill-category')

admin_router = DefaultRouter()
admin_router.register(r'categories', SkillCategoryAdminViewSet, basename='admin-skill-category')
admin_router.register(r'items', SkillAdminViewSet, basename='admin-skill-item')

urlpatterns = [
    path('api/about/', AboutMePublicView.as_view(), name='public-about'),
    path('api/skills/', include(public_router.urls)),
    
    path('api/admin/about/', AboutMeAdminView.as_view(), name='admin-about'),
    path('api/admin/skills/', include(admin_router.urls)),
]
