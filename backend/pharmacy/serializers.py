from rest_framework import serializers
from .models import Prescription

class PharmacySerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ('id', 'name', 'doctor', 'date', 'notes', 'completed')