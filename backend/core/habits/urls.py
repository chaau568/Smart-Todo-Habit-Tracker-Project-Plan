from django.urls import path

from habits import views

urlpatterns = [
    path("", views.habit_list, name="habit-list"),
    path("<int:habit_id>/", views.habit_detail, name="habit-detail"),
    path("<int:habit_id>/check-in/", views.habit_check_in, name="habit-check-in"),
    path("<int:habit_id>/skip/", views.habit_skip, name="habit-skip"),
    path("<int:habit_id>/history/", views.habit_history, name="habit-history"),
]
