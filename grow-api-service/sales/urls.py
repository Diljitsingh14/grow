from rest_framework import routers
from django.urls import path, include
from .views import OrderViewSet, DiscountViewSet, StatusViewSet, ProductAndServiceViewSet

router = routers.DefaultRouter()
router.register("order", OrderViewSet)
router.register("discounts", DiscountViewSet)
router.register('status', StatusViewSet)
router.register("products", ProductAndServiceViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
