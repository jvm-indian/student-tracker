from django import forms
from django.contrib.auth.models import User
from .models import Project, Milestone, Evaluation

class ProjectRegistrationForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['title', 'domain']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control', 'id': 'project_title'}),
            'domain': forms.Select(attrs={'class': 'form-select'}),
        }

class AdminAllotmentForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['guide']
        widgets = {
            'guide': forms.Select(attrs={'class': 'form-select'})
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['guide'].queryset = User.objects.filter(is_staff=True)

class MilestoneUploadForm(forms.ModelForm):
    class Meta:
        model = Milestone
        fields = ['stage', 'document']
        widgets = {
            'stage': forms.Select(attrs={'class': 'form-select'}),
            'document': forms.FileInput(attrs={'class': 'form-control'}),
        }

class EvaluationForm(forms.ModelForm):
    class Meta:
        model = Evaluation
        fields = ['guide_rating', 'publication_status']
        widgets = {
            'guide_rating': forms.NumberInput(attrs={'class': 'form-control', 'min': 0, 'max': 100}),
            'publication_status': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }
