from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register([Order, Status, Discounts, Payments, PromoCodes, Template,Cart,Domain,Review,Currency,SubCategory,Category,ReturnPolicy,ProductImage])

class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1


@admin.register(ProductAndService)
class ProductAndServiceAdmin(admin.ModelAdmin):
    inlines = [ProductVariantInline]
