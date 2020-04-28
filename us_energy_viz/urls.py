from django.urls import path

from . import views

app_name = 'us_energy_viz'

urlpatterns = [
    path('', views.index, name='index'),
    path('about_us/', views.about, name='about_us'),
    path('charts/', views.charts, name='charts'),
    path('license/', views.license, name='license'),
    path('contact/', views.contact, name='contact'),
]
