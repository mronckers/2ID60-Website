import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'webtech_project.settings')
import django
django.setup()
from rango.models import TodoList, User, Task

def populate():
    tasks1 = ["I have to do this",
              "I have to do that"]
    tasks2 = ["I have to clean this",
              "I have to cook that"]
    tasks3 = []
    tasks4 = ["I have to drink air"]
    lists1 = [
            {"name":"List 1", "colour":"red", "tasks": tasks1},
            {"name":"List 2", "colour":"blue", "tasks": tasks2}]
    lists2 = [
            {"name":"List 3", "colour":"green", "tasks": tasks3},
            {"name":"List 4", "colour":"yellow", "tasks": tasks4}]
    users = [
            {"name":"Lucia", "email":"luciaasen@gmail.com","lists":lists1},
            {"name":"Mieke", "email":"mieke.ronckers@gmail.com", "lists":lists2}]


    for user in users:
        u = add_user(user["name"], user["email"])
        for todo_list in user["lists"]:
            l = add_list(u, todo_list["name"], todo_list["colour"])
            for task in todo_list["tasks"]:
                add_task(l, task)

def add_user(name, email):
    u = User.objects.get_or_create(name = name, email = email)[0]
    u.save()
    return u

def add_list(owner, name = "", colour = "white"):
    l = TodoList.objects.get_or_create(name = name, colour = colour, owner = owner)[0]
    l.save()
    return l

def add_task(parent_list, content = ""):
    t = Task.objects.get_or_create(content = content, parent_list = parent_list)

if __name__ == '__main__':
    populate()