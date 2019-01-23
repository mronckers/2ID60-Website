from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User

#Standard django forms that can be extended

class SignUpForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('username', 'password1', 'password2', )

class LoginForm(AuthenticationForm):
    class Meta:
        model = User
        fields = ('username', 'password', )
