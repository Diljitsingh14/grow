from django.urls import path, include
from rest_framework import routers
from .views import BusinessViewSet, ClientsViewSet, ReviewRedirect, AuthTest, LogoutView
from rest_framework.authtoken.views import obtain_auth_token

router = routers.DefaultRouter()
router.register("business", BusinessViewSet)
router.register("clients", ClientsViewSet)
# router.register('authtest', AuthTest)

urlpatterns = [
    path("", include(router.urls)),
    path("review/", ReviewRedirect, name="review redirect"),
    path("auth_test/", AuthTest.as_view(), name="auth test"),
    path("logout/", LogoutView.as_view(), name="logout"),
    # path("login/", obtain_auth_token, name="login")

]
