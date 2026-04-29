from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('student/', views.student_portal, name='student_portal'),
    path('student/register/', views.register_project, name='register_project'),
    path('student/milestone/<int:project_id>/', views.upload_milestone, name='upload_milestone'),
    path('admin-portal/', views.admin_allotment, name='admin_allotment'),
    path('admin-portal/approvals/', views.admin_approvals, name='admin_approvals'),
    path('guide-portal/', views.guide_portal, name='guide_portal'),
    path('guide-portal/evaluate/<int:project_id>/', views.guide_evaluation, name='guide_evaluation'),
    path('export/csv/', views.export_projects_csv, name='export_projects_csv'),
    path('api/check-title/', views.check_title, name='check_title'),
]
