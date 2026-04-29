from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Evaluation

@receiver(post_save, sender=Evaluation)
def notify_coordinator(sender, instance, created, **kwargs):
    # If the guide_rating is provided (indicating an evaluation happened)
    # This is a simulation of step B: triggering an automatic email notification
    if instance.guide_rating > 0 and not instance.coordinator_approval:
        print(f"\n[EMAIL NOTIFICATION]")
        print(f"To: coordinator@college.edu")
        print(f"Subject: Evaluation Submitted for {instance.project.title}")
        print(f"Message: The guide has submitted a rating of {instance.guide_rating} for team {instance.project.title}.")
        print(f"Please log in to the Admin Portal to approve the evaluation.\n")
