from rango import views 
from django.conf.urls import url, include 
from django.contrib import admin

urlpatterns = [
    #TODO why is this here? Same regex
    url(r'^$', views.base, name='base'),
    url(r'^$', views.list, name='list'),
]

