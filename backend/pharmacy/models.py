import random
import string
import qrcode
from io import StringIO
from django.core.files.base import ContentFile
from django.db import models
from django.contrib.auth.models import User

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
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True)
    
    def save(self, *args, **kwargs):
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(self.id)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")

        # Save the image to a StringIO object
        temp_handle = StringIO()
        img.save(temp_handle, format='PNG')
        temp_handle.seek(0)

        # Save image to qr_code field
        self.qr_code.save(f'{self.id}.png', ContentFile(temp_handle.read()), save=False)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10)