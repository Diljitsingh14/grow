# Generated by Django 4.2.7 on 2024-09-04 02:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0016_business_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='oauthaccount',
            name='expires_at',
            field=models.BigIntegerField(),
        ),
    ]
