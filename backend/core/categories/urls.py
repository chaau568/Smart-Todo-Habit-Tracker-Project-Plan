from django.urls import path

from categories import views

urlpatterns = [
    path("", views.category_list, name="category-list"),
    path("<int:category_id>/", views.category_detail, name="category-detail"),
]
