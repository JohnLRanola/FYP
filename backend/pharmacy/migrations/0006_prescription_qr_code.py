# Generated by Django 4.2.7 on 2023-11-28 08:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pharmacy', '0005_userprofile'),
    ]

    operations = [
        migrations.AddField(
            model_name='prescription',
            name='qr_code',
            field=models.ImageField(blank=True, upload_to='qr_codes/'),
        ),
    ]
