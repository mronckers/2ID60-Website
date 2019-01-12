from django.contrib import admin
from rango.models import TodoList, User, Task

# Register your models here.
admin.site.register(TodoList)
admin.site.register(User)
admin.site.register(Task)

