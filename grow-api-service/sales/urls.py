from rest_framework import routers
from django.urls import path, include
from .views import OrderViewSet, DiscountViewSet

router = routers.DefaultRouter()
router.register("order", OrderViewSet)
router.register("discounts", DiscountViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
