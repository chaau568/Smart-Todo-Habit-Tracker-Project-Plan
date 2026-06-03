from django.urls import path

from challenges import views

urlpatterns = [
    path("", views.challenge_list, name="challenge-list"),
    path("<int:challenge_id>/", views.challenge_detail, name="challenge-detail"),
    path("<int:challenge_id>/join/", views.challenge_join, name="challenge-join"),
    path("<int:challenge_id>/leave/", views.challenge_leave, name="challenge-leave"),
    path("<int:challenge_id>/leaderboard/", views.challenge_leaderboard, name="challenge-leaderboard"),
]
