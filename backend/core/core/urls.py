from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("user/", include("authentication.urls")),
    path("category/", include("categories.urls")),
    path("task/", include("tasks.urls")),
    path("habit/", include("habits.urls")),
    path("tracking/", include("tracking.urls")),
    path("achievement/", include("achievements.urls")),
    path("challenge/", include("challenges.urls")),
    path("notification/", include("notifications.urls")),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="api-token-refresh"),
]
