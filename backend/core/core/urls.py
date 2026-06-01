from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/categories/', include('categories.urls')),
    path('api/tasks/', include('tasks.urls')),
]
