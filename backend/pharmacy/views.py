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

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'status': 'success'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid username or password'})