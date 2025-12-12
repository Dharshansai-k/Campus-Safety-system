from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    name = models.CharField(max_length=150, blank=True)
    student_id = models.CharField(max_length=64, blank=True)
    phone = models.CharField(max_length=32, blank=True)
    ROLE_CHOICES = (('student','student'),('staff','staff'),('admin','admin'))
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')

    def __str__(self):
        return self.username


from django.conf import settings
from django.db import models

class Incident(models.Model):
    CATEGORY_CHOICES = [
        ('harassment', 'Harassment'),
        ('theft', 'Theft'),
        ('health', 'Health'),
        ('lost', 'Lost Item'),
        ('other', 'Other'),
    ]

    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    incident_datetime = models.DateTimeField(null=True, blank=True)
    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    status = models.CharField(max_length=32, default='open')
    anonymous = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_category_display()} - {self.title or '(No Title)'}"


class Evidence(models.Model):
    incident = models.ForeignKey(Incident, related_name='evidence', on_delete=models.CASCADE)
    file = models.FileField(upload_to='evidence/%Y/%m/%d/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Evidence {self.id} for Incident {self.incident_id}"



from django.db import models

class ContactMessage(models.Model):
    CATEGORY_CHOICES = [
        ('general', 'General Inquiry'),
        ('emergency', 'Emergency Concern'),
        ('technical', 'Technical Support'),
        ('feedback', 'Feedback & Suggestions'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=255)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='general')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.subject}"
