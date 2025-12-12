import json
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_datetime

from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import Incident, Evidence
from .serializers import IncidentSerializer, EvidenceSerializer

User = get_user_model()


# -------------------------
# 🔐 AUTHENTICATION VIEWS
# -------------------------

@ensure_csrf_cookie
def csrf_view(request):
    """Sets CSRF cookie for frontend."""
    return JsonResponse({'detail': 'CSRF cookie set'})

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.contrib.auth import login, get_user_model
import json

User = get_user_model()

@require_http_methods(["POST"])
def register_view(request):
    """Register a new user or admin."""
    try:
        # ✅ Parse JSON safely
        try:
            data = json.loads(request.body.decode())
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'student').lower()

        # ✅ Basic validations
        if not username or not email or not password:
            return JsonResponse({'error': 'username, email, and password are required'}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists'}, status=400)

        # ✅ Create new user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            name=data.get('name', ''),
            student_id=data.get('student_id', ''),
            phone=data.get('phone', ''),
            role=role
        )

        # ✅ If role is 'admin', elevate privileges
        if role == 'admin':
            user.is_staff = True
            user.is_superuser = True
            user.save()

        # ✅ Auto login after registration
        login(request, user)

        # ✅ Return success response
        return JsonResponse({
            'message': f'{role.capitalize()} registered successfully!',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'name': getattr(user, 'name', ''),
                'student_id': getattr(user, 'student_id', ''),
                'phone': getattr(user, 'phone', ''),
                'role': getattr(user, 'role', ''),
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser
            }
        }, status=201)

    except Exception as e:
        return JsonResponse({'error': 'Registration failed', 'detail': str(e)}, status=500)


@require_http_methods(["POST"])
def login_view(request):
    """Login an existing user."""
    try:
        data = json.loads(request.body.decode())
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return JsonResponse({'error': 'username and password required'}, status=400)

        user = authenticate(request, username=username, password=password)
        if user is None:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)

        login(request, user)
        return JsonResponse({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'name': getattr(user, 'name', ''),
                'student_id': getattr(user, 'student_id', ''),
                'phone': getattr(user, 'phone', ''),
                'role': getattr(user, 'role', ''),
            }
        })

    except Exception as e:
        return JsonResponse({'error': 'Login failed', 'detail': str(e)}, status=500)


@require_http_methods(["POST"])
def logout_view(request):
    """Logout the user."""
    try:
        logout(request)
        resp = JsonResponse({'detail': 'Logged out successfully'})
        resp.delete_cookie('sessionid')
        return resp
    except Exception as e:
        return JsonResponse({'error': 'Logout failed', 'detail': str(e)}, status=500)


# -------------------------
# 🚨 INCIDENT VIEWS
# -------------------------

# auth_app/views.py
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticatedOrReadOnly

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework import status
from .models import Incident, Evidence
from django.conf import settings
from rest_framework.parsers import MultiPartParser, FormParser


from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt


@api_view(['POST'])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser])
@csrf_exempt
def create_incident(request):
    try:
        category = request.data.get('category')
        title = request.data.get('title', '')
        description = request.data.get('description', '')
        location = request.data.get('location')
        incident_datetime = request.data.get('incident_datetime')
        extra = request.data.get('extra')

        # ✅ Convert anonymous to boolean
        anonymous_value = request.data.get('anonymous', 'false')
        anonymous = str(anonymous_value).lower() in ['true', '1', 'yes']

        # ✅ Assign reporter only if user is logged in & not anonymous
        reporter = request.user if request.user.is_authenticated and not anonymous else None

        incident = Incident.objects.create(
            reporter=reporter,
            category=category,
            title=title,
            description=description,
            location=location,
            incident_datetime=incident_datetime or None,
            anonymous=anonymous,
        )

        # ✅ Save any uploaded files
        for f in request.FILES.getlist('evidence'):
            Evidence.objects.create(incident=incident, file=f)

        return Response(
            {"message": "Incident reported successfully!", "id": incident.id},
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


#Count
from django.db.models import Count

@api_view(['GET'])
@permission_classes([IsAdminUser])
def incident_category_counts(request):
    """Return total count of incidents grouped by category (including 0s)"""
    all_categories = dict(Incident.CATEGORY_CHOICES)
    data = (
        Incident.objects.values('category')
        .annotate(total=Count('id'))
    )

    # convert QuerySet -> dict
    counts = {item['category']: item['total'] for item in data}

    # ensure all categories appear, even with 0
    result = [
        {"category": label, "total": counts.get(key, 0)}
        for key, label in all_categories.items()
    ]

    return Response(result)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """Return the logged-in user's data"""
    user = request.user
    return Response({
        "id": user.id,
        "name": getattr(user, "name", ""),
        "email": user.email,
        "student_id": getattr(user, "student_id", ""),
        "phone": getattr(user, "phone", ""),
        "role": getattr(user, "role", ""),
    })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """Update the logged-in user's profile"""
    user = request.user
    data = request.data

    user.name = data.get("name", user.name)
    user.phone = data.get("phone", user.phone)
    user.save()

    return Response({"message": "Profile updated successfully!"})




from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import ContactMessage
from .serializers import ContactMessageSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def contact_message_view(request):
    """
    Save contact form data to database.
    """
    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Message sent successfully!'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.db.models import Count
from .models import Incident
from .serializers import IncidentSerializer

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_incident_dashboard(request):
   
    # Category-wise count
    category_stats = (
        Incident.objects.values('category')
        .annotate(total=Count('id'))
        .order_by('category')
    )

    # All incidents with user info
    incidents = Incident.objects.select_related('reporter').order_by('-created_at')
    data = []

    for inc in incidents:
        data.append({
            'id': inc.id,
            'category': inc.category,
            'title': inc.title,
            'description': inc.description,
            'location': inc.location,
            'incident_datetime': inc.incident_datetime,
            'created_at': inc.created_at,
            'anonymous': inc.anonymous,
            'reporter': {
                'name': inc.reporter.name if inc.reporter else "Anonymous",
                'email': inc.reporter.email if inc.reporter else "Hidden",
            },
        })

    return Response({
        'category_stats': list(category_stats),
        'incidents': data
    })
