from rango import views
from django.conf.urls import url, include
from django.contrib import admin
from django.urls import path

urlpatterns = [
    url(r'^$', views.base, name='base'),
    url(r'^$', views.list, name='list'),
]
