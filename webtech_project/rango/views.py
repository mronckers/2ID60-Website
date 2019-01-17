from django.shortcuts import render
from .models import TodoList, Task
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

def signup(request):
    return render(request, 'rango/signup.html')

def login(request):
    return render(request, 'registration/login.html')



# Some basic checking for all AJAX request (authenticated and well formed requests)
# The second argument tells the function whether the request is for modifying
# lists or tasks : list_or_task = 'list'|'task'
def AJAX_checking(request, list_or_task):
    if request.user.is_authenticated == False:
        return HttpResponse(content = "User needs to be authenticated", status = 401)
    if request.method != 'POST':
        return HttpResponse(content = "Method not allowed", status = 405)
    if 'name' not in request.POST.keys():
        return HttpResponse(content = "Malformed request", status = 400)
    if list_or_task == 'task' and 'parent_list' not in request.POST.keys():
        return HttpResponse(content = "Malformed request", status = 400)
    return HttpResponse(content_type = 'text/plain', status = 200)


# Post request must contain request.POST['name'] with the list name to be added
def add_list(request):
    response = AJAX_checking(request, 'list')
    # In case of error
    if response.status_code != 200:
        return response
    # If not, try to access db
    try:
        l = TodoList.objects.get_or_create(name = request.POST['name'], colour = "white", owner = request.user)[0]
        l.save()
        return response
    except:
        return HttpResponse(content = "Saving list at the db raised an Exception", status = 500)

# Post request must contain request.POST['name'] with the list name to be deleted
def delete_list(request):
    response = AJAX_checking(request, 'list')
    # In case of error
    if response.status_code != 200:
        return response
    # If not, try to access db
    try:
        l = TodoList.objects.get(name = request.POST['name'], owner = request.user).delete()
        return response
    except:
        return HttpResponse(content = "Deleting list from the db raised an Exception", status = 500)

# Post request must contain request.POST['task'] and request.POST['parent_list'] with the
# content of the task to be added and the name of the list containing the task
def add_task(request):
    response = AJAX_checking(request, 'task')
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

# Post request must contain request.POST['task'] and request.POST['parent_list'] with the
# content of the task to be deleted and the name of the list containing the task
def delete_task(request):
    response = AJAX_checking(request, 'task')
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
