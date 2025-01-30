from rest_framework import routers
from django.urls import path, include
from .views import *

router = routers.DefaultRouter()
router.register("order", OrderViewSet)
router.register("discounts", DiscountViewSet)
router.register('status', StatusViewSet)
router.register("products", ProductAndServiceViewSet)
router.register("cart", CartViewSet,basename="cart")

urlpatterns = [
    path("", include(router.urls)),
    path("stripe/delete_products/", delete_all_products_from_stripe,
         name="delete_all_products_from_stripe"),

]
