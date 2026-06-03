from django.urls import path

from tasks import views

urlpatterns = [
    path("", views.task_list, name="task-list"),
    path("<int:task_id>/", views.task_detail, name="task-detail"),
    path("<int:task_id>/complete/", views.task_complete, name="task-complete"),
    path("<int:task_id>/cancel/", views.task_cancel, name="task-cancel"),
    path("<int:task_id>/in-progress/", views.task_in_progress, name="task-in-progress"),
]
