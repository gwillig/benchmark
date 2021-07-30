"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from django.views.generic.base import RedirectView
from django.contrib.staticfiles.storage import staticfiles_storage
from rest_framework import routers
from todo import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('home.urls')),
    path('', TemplateView.as_view(template_name='index.html')),
    # Links for pwa
    path('favicon.ico', RedirectView.as_view(url=staticfiles_storage.url('img/favicon.ico'))),
    path('manifest.json', RedirectView.as_view(url=staticfiles_storage.url('manifest.json'))),
    path('static/logo192.png', RedirectView.as_view(url=staticfiles_storage.url('img/logo192.png'))),
    path('static/logo512.png', RedirectView.as_view(url=staticfiles_storage.url('img/logo512.png'))),
]
