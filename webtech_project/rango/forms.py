from django import openFormList
from django.contrib.auth.models import User

class SignUpForm(forms.ModelForm):

    class Meta:
        model = User
        fields = ('username', 'password', 'passwordsecond',)
