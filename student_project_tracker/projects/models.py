from django.db import models
from django.conf import settings
from django.core.validators import FileExtensionValidator
import reversion

class Project(models.Model):
    DOMAIN_CHOICES = [
        ('AI', 'Artificial Intelligence'),
        ('ML', 'Machine Learning'),
        ('IoT', 'Internet of Things'),
    ]
    title = models.CharField(max_length=255, unique=True)
    guide = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        limit_choices_to={'is_faculty': True}
    )
    domain = models.CharField(max_length=50, choices=DOMAIN_CHOICES)

    def __str__(self):
        return self.title

@reversion.register
class Milestone(models.Model):
    STAGE_CHOICES = [
        ('Synopsis', 'Synopsis'),
        ('Phase 1', 'Phase 1'),
        ('Phase 2', 'Phase 2'),
        ('Final Project Report', 'Final Project Report'),
        ('Publication Details', 'Publication Details'),
    ]
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    stage = models.CharField(max_length=50, choices=STAGE_CHOICES)
    document = models.FileField(
        upload_to='milestones/',
        validators=[FileExtensionValidator(['pdf', 'doc', 'zip'])]
    )

    def __str__(self):
        return f"{self.project.title} - {self.stage}"

class Evaluation(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    guide_rating = models.IntegerField(default=0)
    coordinator_approval = models.BooleanField(default=False)
    publication_status = models.BooleanField(default=False)
    certificate_copy = models.FileField(upload_to='media/reports/', null=True, blank=True)

    def __str__(self):
        return f"Evaluation for {self.project.title}"
