from django.conf.urls import url
from rango import views

urlpatterns = [
    url(r'^$', views.base, name='base'),
    url(r'^$', views.list, name='list'),
]
