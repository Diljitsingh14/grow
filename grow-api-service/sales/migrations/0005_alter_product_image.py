# Generated by Django 4.2.7 on 2024-08-20 18:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sales', '0004_product'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.ImageField(upload_to='products/'),
        ),
    ]