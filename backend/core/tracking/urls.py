from django.urls import path

from tracking import views

urlpatterns = [
    path("summary/", views.tracking_summary, name="tracking-summary"),
    path("dashboard/", views.tracking_dashboard, name="tracking-dashboard"),
    path("task/<int:task_id>/", views.task_tracking_detail, name="task-tracking-detail"),
    path("habit/<int:habit_id>/", views.habit_tracking_detail, name="habit-tracking-detail"),
]
