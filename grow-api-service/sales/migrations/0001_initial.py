# Generated by Django 4.2.7 on 2023-11-16 10:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Discounts',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=48)),
                ('value', models.CharField(max_length=48)),
                ('label', models.CharField(max_length=48)),
                ('color', models.CharField(default='#eb4034', max_length=202)),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_on', models.DateTimeField(auto_now_add=True)),
                ('full_fill_on', models.DateTimeField(blank=True, null=True)),
                ('notes', models.TextField(blank=True, null=True)),
                ('quantity', models.IntegerField(default=1, help_text='Quantity ordered')),
                ('business', models.ForeignKey(default='1', on_delete=django.db.models.deletion.SET_DEFAULT, to='main.business')),
                ('discounts', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='sales.discounts')),
            ],
        ),
        migrations.CreateModel(
            name='PromoCodes',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=20, unique=True)),
                ('discount_percentage', models.PositiveIntegerField()),
                ('expiration_date', models.DateField()),
                ('is_active', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='Status',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=48)),
                ('value', models.CharField(max_length=48)),
                ('color', models.CharField(default='#eb4034', max_length=202)),
            ],
        ),
        migrations.CreateModel(
            name='Template',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.URLField()),
                ('name', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('is_premium', models.BooleanField(default=False)),
                ('is_new', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='ProductAndService',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('type', models.CharField(choices=[('product', 'Product'), ('service', 'Service')], max_length=10)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('is_template_type', models.BooleanField(default=False)),
                ('image', models.URLField(blank=True, null=True)),
                ('quantity_available', models.IntegerField(default=0, help_text='Available stock quantity')),
                ('is_featured', models.BooleanField(default=False, help_text='Is this product or service featured?')),
                ('template', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='sales.template')),
            ],
        ),
        migrations.CreateModel(
            name='Payments',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed')], default='pending', max_length=20)),
                ('payment_method', models.CharField(choices=[('online', 'Online'), ('offline', 'Offline')], default='online', max_length=20)),
                ('transaction_id', models.CharField(blank=True, max_length=255, null=True)),
                ('payment_date', models.DateTimeField(auto_now_add=True)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sales.order')),
            ],
        ),
        migrations.AddField(
            model_name='order',
            name='payment',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='sales_id', to='sales.payments'),
        ),
        migrations.AddField(
            model_name='order',
            name='product',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='sales.productandservice'),
        ),
        migrations.AddField(
            model_name='order',
            name='promo_code',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='sales.promocodes'),
        ),
        migrations.AddField(
            model_name='order',
            name='status',
            field=models.ForeignKey(blank=True, default='0', null=True, on_delete=django.db.models.deletion.SET_NULL, to='sales.status'),
        ),
    ]
