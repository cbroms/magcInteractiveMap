from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('details/<slug:id>/', views.details, name='details'),
    path('about-credits', views.about_credits, name='about-credits'),
]