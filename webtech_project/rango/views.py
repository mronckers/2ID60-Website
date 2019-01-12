from django.shortcuts import render
from .models import TodoList

from django.http import HttpResponse
def index(request):
    #context_dict = {'boldmessage': 'beautiful person'}
    lists = TodoList.objects.all()
    return render(request, 'rango/index.html',{'lists': lists}) #context = context_dict)
def about(request):
    return HttpResponse("Something about page and <a href='/rango/'>link to index)</a>")
