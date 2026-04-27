import csv
from django.http import HttpResponse, JsonResponse
from .models import Project, Evaluation

def export_projects_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="projects_report.csv"'

    writer = csv.writer(response)
    writer.writerow(['Project Title', 'Guide', 'Domain', 'Coordinator Approval', 'Publication Status'])

    # Filtering Logic
    guide_id = request.GET.get('guide_id')
    publication = request.GET.get('publication')
    domain = request.GET.get('domain')

    evaluations = Evaluation.objects.all().select_related('project', 'project__guide')

    if guide_id:
        evaluations = evaluations.filter(project__guide__id=guide_id)
    if publication == 'Yes':
        evaluations = evaluations.filter(publication_status=True)
    if domain:
        evaluations = evaluations.filter(project__domain=domain)

    for eval in evaluations:
        writer.writerow([
            eval.project.title,
            eval.project.guide.username if eval.project.guide else 'No Guide',
            eval.project.domain,
            'Approved' if eval.coordinator_approval else 'Pending',
            'Published' if eval.publication_status else 'Not Published'
        ])

    return response

def check_title(request):
    query = request.GET.get('q', None)
    is_taken = False
    if query:
        is_taken = Project.objects.filter(title__iexact=query).exists()
    return JsonResponse({'is_taken': is_taken})
