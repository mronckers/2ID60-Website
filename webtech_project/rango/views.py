from django.shortcuts import render
from .models import TodoList
from .models import Task
from django.contrib.auth.models import User
from django.http import HttpResponse
def base(request):
    return render(request, 'rango/base.html', {})
def list(request):
    # in case user has logged in
    if request.user.is_authenticated:
        user = User.objects.get(username=request.user)
        lists = TodoList.objects.filter(owner = user)
        tasks = Task.objects.all()
        return render(request, 'rango/list.html', {'lists': lists, 'tasks': tasks, 'name' : user.first_name})
    # if not, redirect to login
    else :
        return render(request, 'registration/login.html')
def home(request):
    return render(request, 'rango/home.html')
