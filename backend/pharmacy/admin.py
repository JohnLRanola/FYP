from django.contrib import admin
from .models import Prescription

class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'doctor', 'date', 'notes', 'completed')

# Register your models here.
admin.site.register(Prescription, PrescriptionAdmin)