from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.db.models import Count
from .models import CustomUser, Incident, Evidence, ContactMessage

# ---------------------------------------------------------------------
# 🔹 Custom User Admin
# ---------------------------------------------------------------------
@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser

    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('name', 'student_id', 'phone', 'role')}),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Additional Info', {'fields': ('name', 'student_id', 'phone', 'role')}),
    )

    list_display = (
        'username', 'email', 'name', 'student_id', 'phone', 'role', 'is_staff', 'is_active'
    )
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'name', 'student_id')
    ordering = ('username',)


# ---------------------------------------------------------------------
# 🔹 Incident Admin
# ---------------------------------------------------------------------
@admin.register(Incident)
class IncidentAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'category', 'title', 'status',
        'reporter_name', 'reporter_email', 'anonymous', 'created_at'
    )
    list_filter = ('category', 'status', 'anonymous', 'created_at')
    search_fields = ('title', 'description', 'location')

    def reporter_name(self, obj):
        return obj.reporter.name if obj.reporter else "Anonymous"
    reporter_name.short_description = 'Reporter Name'

    def reporter_email(self, obj):
        return obj.reporter.email if obj.reporter else "Hidden"
    reporter_email.short_description = 'Reporter Email'

    # 🧮 Category statistics
    def changelist_view(self, request, extra_context=None):
        category_counts = (
            Incident.objects.values('category')
            .annotate(total=Count('id'))
            .order_by('-total')
        )
        extra_context = extra_context or {}
        extra_context['category_counts'] = category_counts
        return super().changelist_view(request, extra_context=extra_context)


# ---------------------------------------------------------------------
# 🔹 Evidence Admin
# ---------------------------------------------------------------------
@admin.register(Evidence)
class EvidenceAdmin(admin.ModelAdmin):
    list_display = ('id', 'incident', 'file', 'uploaded_at')
    list_filter = ('uploaded_at',)
    search_fields = ('incident__title',)


# ---------------------------------------------------------------------
# 🔹 Contact Message Admin
# ---------------------------------------------------------------------
@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'subject', 'category', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('created_at',)
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)

    fieldsets = (
        (None, {
            'fields': ('name', 'email', 'subject', 'category', 'message')
        }),
        ('Meta', {
            'fields': ('created_at',),
        }),
    )
