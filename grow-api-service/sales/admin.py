from django.contrib import admin
from .models import Order, Status, Discounts, Payments, ProductAndService, PromoCodes, Template

# Register your models here.
admin.site.register([Order, Status, Discounts, Payments,
                    ProductAndService, PromoCodes, Template])
