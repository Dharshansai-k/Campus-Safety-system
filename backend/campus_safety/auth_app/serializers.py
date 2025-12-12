from rest_framework import serializers
from .models import CustomUser, Incident, Evidence

# ------------------------------
# 👤 USER SERIALIZER
# ------------------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'name',
            'student_id', 'phone', 'role'
        ]


# ------------------------------
# 📎 EVIDENCE SERIALIZER
# ------------------------------
class EvidenceSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Evidence
        fields = ['id', 'file', 'file_url', 'uploaded_at']

    def get_file_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.file.url) if request else obj.file.url


# ------------------------------
# 🚨 INCIDENT SERIALIZER
# ------------------------------
class IncidentSerializer(serializers.ModelSerializer):
    reporter = UserSerializer(read_only=True)
    evidence = EvidenceSerializer(many=True, read_only=True)

    class Meta:
        model = Incident
        fields = [
            'id', 'reporter', 'category', 'title', 'description',
            'location', 'incident_datetime', 'perpetrator_details',
            'witnesses', 'anonymous', 'status', 'extra',
            'created_at', 'updated_at', 'evidence'
        ]


from rest_framework import serializers
from .models import ContactMessage

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'
