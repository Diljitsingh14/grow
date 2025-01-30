from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'connected-forms', ConnectedFormViewSet,
                basename='connectedform')

router.register(r'lead-responses', LeadResponseViewSet,
                basename='leadresponse')

router.register(r'google-calendar', GoogleCalendarViewSet,
                basename='google-calendar')


urlpatterns = [
    path("form-templates/", FormTemplateListView.as_view(),
         name="user-form-templates"),
    path("form-templates/<int:pk>/", FormTemplateDetailView.as_view(),
         name="detail-form-template"),

    path('master-form-templates/', MasterFormTemplateListView.as_view(),
         name='masterformtemplate-list'),

    path('master-form-themes/', MasterFormThemeListView.as_view(),
         name='master-form-theme-list'),

    path('', include(router.urls)),

    path('connected-form/<uuid:uuid>/',
         ConnectedFormPublicRetrieveAPIView.as_view(), name='connected_form_detail'),

]
