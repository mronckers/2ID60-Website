from django.shortcuts import render

from django.http import HttpResponse
def index(request):
    context_dict = {'boldmessage': 'beautiful person'}
    return render(request, 'rango/index.html', context = context_dict)
def about(request):
    return HttpResponse("Something about page and <a href='/rango/'>link to index)</a>")
