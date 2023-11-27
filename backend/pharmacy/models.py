from django.db import models

# Create your models here.

class Prescription(models.Model):
    name = models.CharField(max_length=50)
    doctor = models.CharField(max_length=50)
    date = models.DateField()
    notes = models.TextField()
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.name