import random
import string
import qrcode
from io import BytesIO  
from django.core.files.base import ContentFile
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

        temp_handle = BytesIO() 
        img.save(temp_handle, format='PNG')
        temp_handle.seek(0)

        self.qr_code.save(f'{self.id}.png', ContentFile(temp_handle.read()), save=False)

        super().save(*args, **kwargs)
        