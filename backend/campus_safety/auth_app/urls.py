from django.urls import path
from . import views

urlpatterns = [
    # CSRF and authentication endpoints under /api/auth/
    path('auth/csrf/', views.csrf_view, name='csrf'),
    path('auth/register/', views.register_view, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),

    # Keep direct /api/ routes (optional, for backward compatibility)
    path('csrf/', views.csrf_view, name='csrf_alt'),
    path('register/', views.register_view, name='register_alt'),
    path('login/', views.login_view, name='login_alt'),
    path('logout/', views.logout_view, name='logout_alt'),

    # Your reports endpoint
    path('reports/', views.create_incident, name='create_incident'),
    path("auth/profile/", views.profile_view, name="profile_view"),
    path("auth/profile/update/", views.update_profile, name="update_profile"),
    path('contact/', views.contact_message_view, name='contact_message'),
    path('admin/dashboard/', views.admin_incident_dashboard, name='admin-incident-dashboard'),
]
