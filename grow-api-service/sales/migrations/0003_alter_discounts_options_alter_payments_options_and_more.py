# Generated by Django 4.2.7 on 2024-01-28 21:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sales', '0002_alter_order_payment_alter_payments_order'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='discounts',
            options={'verbose_name_plural': 'Discounts'},
        ),
        migrations.AlterModelOptions(
            name='payments',
            options={'verbose_name_plural': 'Payments'},
        ),
        migrations.AlterModelOptions(
            name='promocodes',
            options={'verbose_name_plural': 'PromoCodes'},
        ),
    ]
