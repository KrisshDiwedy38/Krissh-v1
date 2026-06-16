from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from core.views import StandaloneImageUploadView

from projects.urls import public_router as projects_public, admin_router as projects_admin
from experience.urls import public_router as exp_public, admin_router as exp_admin

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Auth
    path('api/auth/', include('accounts.urls')),
    
    # Public endpoints (no auth)
    path('api/projects/', include(projects_public.urls)),
    path('api/experience/', include(exp_public.urls)),
    
    # Admin endpoints (auth required)
    path('api/admin/projects/', include(projects_admin.urls)),
    path('api/admin/experience/', include(exp_admin.urls)),
    
    # Standalone image upload
    path('api/admin/upload/image/', StandaloneImageUploadView.as_view(), name='admin_upload_image'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
