from .models import TodoList, Task
from django.contrib.auth.models import User
from django.contrib import auth
from django.http import HttpResponse
from django.http import *
from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, login
from rango.forms import SignUpForm, LoginForm
import json

# render the base of the website if this view is asked
def base(request):
    return render(request, 'rango/base.html', {})

#"standard" render of the website, only if authenticated
def list(request):
    # in case user has logged in
    if request.user.is_authenticated:
        user = User.objects.get(username=request.user)
        lists = TodoList.objects.filter(owner = user)
        tasks = Task.objects.all()
        return render(request, 'rango/list.html', {'lists': lists, 'tasks': tasks, 'name' : user.first_name})
    # if not, redirect to login
    else :
        return redirect('login')

#login the user by using the loginForm
def login_user(request):
    if request.method == 'Post':
        form = LoginForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            login(request, user)
            return redirect('list')
    else:
        form = LoginForm()
    return render(request, 'registration/login.html', {'form': form})

#signup the user by using the SignUpForm
def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('list')
    else:
        form = SignUpForm()
    return render(request, 'rango/signup.html', {'form': form})



# Some basic checking for AJAX request used for adding/deleting/searching tasks/lists and toggling open_status (authenticated and well formed requests)
# The second argument tells the function what keys should be searched for in the POST
# (for example, keys = ['name'] if we need request.POST['name'])
def AJAX_checking(request, keys):
    if request.user.is_authenticated == False:
        return HttpResponse(content = "User needs to be authenticated", status = 401)
    if request.method != 'POST':
        return HttpResponse(content = "Method not allowed", status = 405)
    for key in keys:
        if key not in request.POST.keys():
            return HttpResponse(content = "Malformed request", status = 400)
    #if list_or_task == 'task' and 'parent_list' not in request.POST.keys():
    #    return HttpResponse(content = "Malformed request", status = 400)
    return HttpResponse(content_type = 'text/plain', status = 200)



# Post request must contain request.POST['name', 'colour'] with the list name and color to be added
def add_list(request):
    response = AJAX_checking(request, ['name', 'colour'])
    # In case of error
    if response.status_code != 200:
        return response

    # If not, try to access db
    try:
        l = TodoList.objects.get_or_create(name = request.POST['name'], colour = request.POST['colour'], owner = request.user)[0]
        l.save()
        return response
    except:
        return HttpResponse(content = "Saving list at the db raised an Exception", status = 500)



# Post request must contain request.POST['name', 'colour'] with the list name to be deleted
# Colour is mainly empty
def delete_list(request):
    response = AJAX_checking(request, ['name', 'colour'])
    # In case of error
    if response.status_code != 200:
        return response

    # If not, try to access db
    try:
        l = TodoList.objects.get(name = request.POST['name'], owner = request.user).delete()
        return response
    except:
        return HttpResponse(content = "Deleting list from the db raised an Exception", status = 500)



# Post request must contain request.POST['name'] and request.POST['parent_list'] with the
# content of the task to be added and the name of the list containing the task
def add_task(request):
    response = AJAX_checking(request, ['name', 'parent_list'])
    # In case of error
    if response.status_code != 200:
        return response

    # If not, try to access db
    try:
        parent = TodoList.objects.get(name = request.POST['parent_list'], owner = request.user)
        task = Task.objects.get_or_create(content = request.POST['name'], parent_list = parent)[0]
        task.save()
        return response
    except Exception as inst:
        return HttpResponse(content = "Adding task to the db raised an Exception", status = 500)



# Post request must contain request.POST['name'] and request.POST['parent_list'] with the
# content of the task to be deleted and the name of the list containing the task
def delete_task(request):
    response = AJAX_checking(request, ['name', 'parent_list'])
    # In case of error
    if response.status_code != 200:
        return response

    # If not, try to access db
    try:
        parent = TodoList.objects.get(name = request.POST['parent_list'], owner = request.user)
        tasks = Task.objects.filter(content = request.POST['name'], parent_list = parent)
        tasks.delete()
        return response
    except:
        return HttpResponse(content = "Deleting task from the db raised an Exception", status = 500)



# POST request must contain the POST['string'] to be searched
# Returns a json with this information of all lists that don't contain the searched input:
#    {
#        'lists' : [
#            {
#                'name' : ,
#             }
#        ]
#    }
def search_list(request):
    response = AJAX_checking(request, ['string'])
    # In case of error
    if response.status_code != 200:
        return response

    # If not, access db to retrieve requested lists
    try:
        # Search all list names that contain the request
        containingLists = TodoList.objects.filter(owner = request.user, name__contains = request.POST['string'])
        allLists = TodoList.objects.filter(owner = request.user)

        #search all tasks that contain the request
        listsWithContainingTasks = []
        for list in allLists:
            containingTasks = Task.objects.filter(parent_list = list, content__contains = request.POST['string'])
            if len(containingTasks) > 0:
                listsWithContainingTasks.append(list)

        #Create array with all lists that do not contain the request (or in their tasks)
        lists = set(allLists)-set(containingLists)-set(listsWithContainingTasks)
        result = {'lists' : []}
        for todo_list in lists:
            list_dict = {
                    'name' : todo_list.name
                    }
            result['lists'].append(list_dict)
        result_json = json.dumps(result)
        return HttpResponse(result_json, content_type = 'application/json', status = 200)
    except:
        return HttpResponse(content = "Searching at db raised an Exception", status = 500)



# POST request must contain 'name' of the list to be toggled
def toggle_open_status(request):
    response = AJAX_checking(request, ['name'])
    # In case of error
    if response.status_code != 200:
        return response

        
    # If not, access db to toggle open_status of requested list
    try:
        todo_list = TodoList.objects.get(owner = request.user, name = request.POST['name'])
        if todo_list.open_status == True:
            new_status = False
        else:
            new_status = True
        todo_list.open_status = new_status
        todo_list.save(update_fields = ['open_status'])
        return HttpResponse(content_type = 'text/plain', status = 200)
    except:
        return HttpResponse(content = "Searching at db raised an Exception", status = 500)
