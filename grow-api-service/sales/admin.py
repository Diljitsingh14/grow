from django.contrib import admin
from .models import Order, Status, Discounts, Payments, ProductAndService, PromoCodes, Template, ProductVariant

# Register your models here.
admin.site.register([Order, Status, Discounts, Payments, PromoCodes, Template])


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1


@admin.register(ProductAndService)
class ProductAndServiceAdmin(admin.ModelAdmin):
    inlines = [ProductVariantInline]
