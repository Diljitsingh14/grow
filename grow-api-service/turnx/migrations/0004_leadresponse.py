# Generated by Django 4.2.7 on 2024-08-27 04:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('turnx', '0003_connectedform_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='LeadResponse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('form_response', models.JSONField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('pushed_to_google', models.BooleanField(default=False)),
                ('status', models.CharField(choices=[('Scheduled', 'Scheduled'), ('Canceled', 'Canceled'), ('Pending', 'Pending'), ('Completed', 'Completed'), ('Failed', 'Failed')], default='Pending', max_length=10)),
                ('lead_name', models.CharField(blank=True, max_length=255, null=True)),
                ('lead_email', models.EmailField(blank=True, max_length=254, null=True)),
                ('source', models.CharField(blank=True, max_length=100, null=True)),
                ('notes', models.TextField(blank=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('connected_form', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lead_responses', to='turnx.connectedform')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]