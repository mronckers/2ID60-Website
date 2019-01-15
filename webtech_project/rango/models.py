from __future__ import unicode_literals
from django.contrib.auth.models import User 
from django.db import models

# Create your models here.
#class User(models.Model):
#    email = models.EmailField(max_length = 254, unique = True)
#    name = models.CharField(max_length=128)
#    def __str__(self):
#        return self.name
#    def __unicode__(self):
#        return self.name
#
class TodoList(models.Model):
    name = models.CharField(max_length = 128, unique = True)
    colour = models.CharField(max_length = 128, default = 'white')
    owner = models.ForeignKey(User, on_delete = models.CASCADE)
    def __str__(self):
        return self.name
    def __unicode__(self):
        return self.name

class Task(models.Model):
    content = models.TextField(default = '')
    parent_list = models.ForeignKey(TodoList,on_delete = models.CASCADE )
    def __str__(self):
        return self.content
    def __unicode__(self):
        return self.content
