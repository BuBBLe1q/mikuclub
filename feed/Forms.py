from django import forms

from feed.models import Post


class PostForm(forms.Form):
    text = forms.CharField(widget=forms.Textarea)

    class Meta:
        model = Post

    # def clean(self):
    #     cleaned_data = super().clean()
    #     print(cleaned_data)
    #     return super().clean()

