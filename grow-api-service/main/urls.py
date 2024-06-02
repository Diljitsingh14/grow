from django.urls import path, include
from rest_framework import routers
from .views import BusinessViewSet, ClientsViewSet, ReviewRedirect

router = routers.DefaultRouter()
router.register("business", BusinessViewSet)
router.register("clients", ClientsViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("review/", ReviewRedirect, name="review redirect")
]
