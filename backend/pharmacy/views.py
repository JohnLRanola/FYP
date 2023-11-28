from django.shortcuts import render
from rest_framework import viewsets
from .serializers import PharmacySerializer
from .models import Prescription
from django.contrib.auth import authenticate, login
from django.http import JsonResponse

# Create your views here.

class PharmacyView(viewsets.ModelViewSet):
    serializer_class = PharmacySerializer
    queryset = Prescription.objects.all()

def redeem_prescription(request, id):
    try:
        prescription = Prescription.objects.get(pk=id)
        prescription.redeem()  # assuming you have a redeem method in your Prescription model
        prescription.save()
        return JsonResponse({'status': 'success'})
    except Prescription.DoesNotExist:
        return JsonResponse({'status': 'error', 'error': 'Prescription not found'})