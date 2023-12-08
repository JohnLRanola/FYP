from django.shortcuts import render
from rest_framework import viewsets
from .serializers import PharmacySerializer
from .models import Prescription
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
import json

class PharmacyView(viewsets.ModelViewSet):
    serializer_class = PharmacySerializer
    queryset = Prescription.objects.all()

def redeem_prescription(request, id):
    try:
        prescription = Prescription.objects.get(pk=id)
        prescription.redeem() 
        prescription.save()
        return JsonResponse({'status': 'success'})
    except Prescription.DoesNotExist:
        return JsonResponse({'status': 'error', 'error': 'Prescription not found'})

def request_prescription(request, id): 
    if request.method == 'POST':
        try:
            prescription = Prescription.objects.get(pk=id)
            prescription.request()
            prescription.save()
            prescription_json = serializers.serialize('json', [prescription])
            return JsonResponse({'status': 'success', 'prescription': json.loads(prescription_json)})
        except Prescription.DoesNotExist:
            return JsonResponse({'status': 'error', 'error': 'Prescription not found'})
    else:
        return JsonResponse({'status': 'error', 'error': 'Invalid request method'})

def requested_prescriptions(request):
    if request.method == 'POST':
        prescription_data = request.POST
        prescription = Prescription(**prescription_data)
        prescription.save()

        return JsonResponse({'status': 'success'})
    else:
        return JsonResponse({'status': 'error', 'error': 'Invalid request method'})