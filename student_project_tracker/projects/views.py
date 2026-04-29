import csv
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Project, Milestone, Evaluation
from .forms import ProjectRegistrationForm, AdminAllotmentForm, MilestoneUploadForm, EvaluationForm

@login_required
def dashboard(request):
    # Determine role based on is_superuser or is_staff
    if request.user.is_superuser:
        return redirect('admin_allotment')
    elif request.user.is_staff:
        return redirect('guide_portal')
    else:
        return redirect('student_portal')

@login_required
def student_portal(request):
    projects = Project.objects.filter(student=request.user)
    return render(request, 'projects/student_portal.html', {'projects': projects})

@login_required
def register_project(request):
    if request.method == 'POST':
        form = ProjectRegistrationForm(request.POST)
        if form.is_valid():
            project = form.save(commit=False)
            project.student = request.user
            project.status = 'Pending Allocation'
            project.save()
            return redirect('student_portal')
        else:
            print(form.errors) # Debugging requirement
    else:
        form = ProjectRegistrationForm()
    return render(request, 'projects/register.html', {'form': form})

@login_required
def admin_allotment(request):
    if not request.user.is_superuser:
        return redirect('dashboard')
    
    pending_projects = Project.objects.filter(status='Pending Allocation')
    
    if request.method == 'POST':
        project_id = request.POST.get('project_id')
        project = get_object_or_404(Project, id=project_id)
        form = AdminAllotmentForm(request.POST, instance=project)
        if form.is_valid():
            project = form.save(commit=False)
            project.status = 'Allocated'
            project.save()
            return redirect('admin_allotment')
    else:
        form = AdminAllotmentForm()
        
    return render(request, 'projects/admin_allotment.html', {
        'projects': pending_projects,
        'form': form
    })

@login_required
def guide_portal(request):
    if not request.user.is_staff:
        return redirect('dashboard')
        
    projects = Project.objects.filter(guide=request.user)
    return render(request, 'projects/guide_portal.html', {'projects': projects})

@login_required
def guide_evaluation(request, project_id):
    if not request.user.is_staff:
        return redirect('dashboard')
        
    project = get_object_or_404(Project, id=project_id, guide=request.user)
    evaluation, created = Evaluation.objects.get_or_create(project=project)
    
    if request.method == 'POST':
        form = EvaluationForm(request.POST, instance=evaluation)
        if form.is_valid():
            eval_instance = form.save()
            project.status = 'Pending Admin Approval'
            project.marks = eval_instance.guide_rating
            project.save()
            return redirect('guide_portal')
    else:
        form = EvaluationForm(instance=evaluation)
        
    return render(request, 'projects/guide_evaluation.html', {
        'project': project,
        'form': form
    })

@login_required
def upload_milestone(request, project_id):
    project = get_object_or_404(Project, id=project_id, student=request.user)
    
    if request.method == 'POST':
        form = MilestoneUploadForm(request.POST, request.FILES)
        if form.is_valid():
            milestone = form.save(commit=False)
            milestone.project = project
            milestone.save()
            return redirect('student_portal')
    else:
        form = MilestoneUploadForm()
        
    return render(request, 'milestones/upload.html', {
        'project': project,
        'form': form
    })

@login_required
def admin_approvals(request):
    if not request.user.is_superuser:
        return redirect('dashboard')
        
    pending_approvals = Project.objects.filter(status='Pending Admin Approval')
    
    if request.method == 'POST':
        project_id = request.POST.get('project_id')
        project = get_object_or_404(Project, id=project_id)
        project.status = 'Approved'
        project.save()
        
        evaluation = project.evaluation
        evaluation.coordinator_approval = True
        evaluation.save()
        
        return redirect('admin_approvals')
        
    return render(request, 'projects/admin_approvals.html', {'projects': pending_approvals})

def export_projects_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="projects_report.csv"'

    writer = csv.writer(response)
    writer.writerow(['Project Title', 'Guide', 'Domain', 'Marks', 'Coordinator Approval', 'Publication Status'])

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
            eval.project.marks,
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
