from django.urls import path

from achievements import views

urlpatterns = [
    path("", views.achievement_list, name="achievement-list"),
    path("my/", views.my_achievements, name="my-achievements"),
    path("<int:achievement_id>/", views.achievement_detail, name="achievement-detail"),
]
