from rest_framework import routers
from django.urls import path, include
from .views import OrderViewSet

router = routers.DefaultRouter()
router.register("order/", OrderViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
