import random
import string
from django.db import models

def generate_id():
    while True:
        id = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        if not Prescription.objects.filter(id=id).exists():
            return id

class Prescription(models.Model): 
    id = models.CharField(primary_key=True, default=generate_id, editable=False, max_length=8)
    name = models.CharField(max_length=50)
    doctor = models.CharField(max_length=50)
    date = models.DateField()
    notes = models.TextField()
    completed = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name