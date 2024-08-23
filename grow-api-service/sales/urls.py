from rest_framework import routers
from django.urls import path, include
from .views import OrderViewSet, DiscountViewSet, StatusViewSet, ProductAndServiceViewSet, delete_all_products_from_stripe

router = routers.DefaultRouter()
router.register("order", OrderViewSet)
router.register("discounts", DiscountViewSet)
router.register('status', StatusViewSet)
router.register("products", ProductAndServiceViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("stripe/delete_products/", delete_all_products_from_stripe,
         name="delete_all_products_from_stripe"),

]
