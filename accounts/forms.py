from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from .models import CustomUser, Codes


class CustomUserCreationForm(UserCreationForm):
    code = forms.IntegerField()

    class Meta:
        model = CustomUser
        fields = ("username", "email", "code")

    # def clean(self):
    #     clean_data = super().clean()
    #     code = clean_data.get('code')

    #     valid_code = Codes.objects.filter(value=code)

    #     if not valid_code.exists():
    #         self.add_error("code", "code not valid")

    #     print(CustomUser.objects.filter(email=clean_data.get('email')))

    #     if CustomUser.objects.filter(email=clean_data.get('email')).exists():
    #         self.add_error("email", "email already used")

    #     valid_code.delete()

    #     return clean_data


class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = CustomUser
        fields = ("username", "email")


