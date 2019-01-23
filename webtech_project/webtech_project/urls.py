"""webtech_project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from rango import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    # Empty uri will redirect to list. If not signed in, list redirects login
    url(r'^$', views.list, name='list'),
    
    url(r'^list/$', views.list , name='list'),
    url(r'^signup/$', views.signup, name='signup'),
    url(r'^admin/', admin.site.urls),
    url(r'^login/$', views.login, name='login'),
    url(r'^logout/$', auth_views.LogoutView.as_view(),{'next_page': '/'}, name='logout'),
    url(r'^accounts/', include('django.contrib.auth.urls')),
    url(r'^auth/', include('social_django.urls', namespace='social')),
    url(r'^add_list/', views.add_list, name = 'add_list'),
    url(r'^delete_list/', views.delete_list, name = 'delete_list'),
    url(r'^add_task/', views.add_task, name = 'add_task'),
    url(r'^delete_task', views.delete_task, name = 'delete_task'),
    url(r'^search_list', views.search_list, name = 'search_list' ),
    url(r'^toggle_open_status', views.toggle_open_status, name = 'toggle_open_status')
    ]
