from django.shortcuts import render
from .models import TodoList
from .models import Task

from django.http import HttpResponse
def base(request):
    return render(request, 'rango/base.html', {})
def list(request):
    lists = TodoList.objects.all()
    tasks = Task.objects.all()
    return render(request, 'rango/list.html', {'lists': lists, 'tasks': tasks})
