from rest_framework import serializers
from .models import *
from main.serializer import OAuthAccountSerializer

# class AccountSerializer(serializers.ModelSerializer):
#     class Meta =


class FormTemplateSerializer(serializers.ModelSerializer):

    class Meta:
        model = FormTemplate
        fields = "__all__"


class FormThemeSerializer(serializers.ModelSerializer):

    class Meta:
        model = FormTheme
        fields = "__all__"


class connectedFormSerializer(serializers.ModelSerializer):
    account = OAuthAccountSerializer(read_only=True)
    form_theme = FormThemeSerializer(read_only=True)

    class Meta:
        model = ConnectedForm
        exclude = ['user']


class ConnectedFormPublicSerializer(serializers.ModelSerializer):
    form_template = FormTemplateSerializer(read_only=True)
    form_theme = FormThemeSerializer(read_only=True)
    status = serializers.CharField(read_only=True)
    public_link_uuid = serializers.UUIDField(read_only=True)

    class Meta:
        model = ConnectedForm
        fields = ['form_template', 'form_theme',
                  'status', 'public_link_uuid', 'id']


class LeadResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadResponse
        fields = '__all__'
