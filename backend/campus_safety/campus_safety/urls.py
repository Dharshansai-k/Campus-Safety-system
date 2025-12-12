
# ...existing code...
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('auth_app.urls')),  # make sure “auth_app” is your app name
]
