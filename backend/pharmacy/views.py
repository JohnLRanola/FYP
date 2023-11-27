from django.shortcuts import render
from rest_framework import viewsets
from .serializers import PharmacySerializer
from .models import Prescription

# Create your views here.

class PharmacyView(viewsets.ModelViewSet):
    serializer_class = PharmacySerializer
    queryset = Prescription.objects.all()
