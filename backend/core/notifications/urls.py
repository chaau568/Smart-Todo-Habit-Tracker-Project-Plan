from django.urls import path

from notifications import views

urlpatterns = [
    path("", views.notification_list, name="notification-list"),
    path("unread-count/", views.unread_count, name="notification-unread-count"),
    path("read-all/", views.notification_read_all, name="notification-read-all"),
    path("<int:notification_id>/", views.notification_detail, name="notification-detail"),
    path("<int:notification_id>/read/", views.notification_mark_read, name="notification-mark-read"),
]
