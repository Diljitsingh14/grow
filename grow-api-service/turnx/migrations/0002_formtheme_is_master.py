# Generated by Django 4.2.7 on 2024-08-26 16:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('turnx', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='formtheme',
            name='is_master',
            field=models.BooleanField(default=False),
        ),
    ]
