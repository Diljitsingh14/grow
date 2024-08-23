import logging
from .models import OAuthAccount
from rest_framework import serializers
from rest_framework.fields import empty
from .models import Business, Address, Coordinates, Clients, SocialProfile
from rest_framework.validators import UniqueTogetherValidator


class CoordinateSerializer(serializers.ModelSerializer):

    class Meta:
        fields = ['latitude', "longitude"]
        model = Coordinates


class AddressSerializer(serializers.ModelSerializer):
    coordinates = CoordinateSerializer(read_only=True)

    class Meta:
        fields = "__all__"
        model = Address


class ClientSerialize(serializers.ModelSerializer):

    def validate(self, data):
        first_name = self.initial_data.get("first_name", None)
        email = self.initial_data.get("email", None)
        phone_no = self.initial_data.get("phone_number", None)
        if (not first_name):
            raise serializers.ValidationError(
                {"first_name": "First name must be required."})
        elif (not email):
            raise serializers.ValidationError(
                {"email": "Email must be required."})
        elif (not phone_no):
            raise serializers.ValidationError(
                {"phone_no": "Email field required."})

        if (Clients.objects.filter(email=email).exists()):
            raise serializers.ValidationError(
                {"email": "Email already exists."})
        if (Clients.objects.filter(phone_number=phone_no).exists()):
            raise serializers.ValidationError(
                {"phone_number": "Phone number already exists."})

        return super().validate(data)

    class Meta:
        fields = "__all__"
        model = Clients


class BusinessSerializer(serializers.ModelSerializer):
    business_address = AddressSerializer(read_only=True)
    owner = ClientSerialize(read_only=True)

    def validate(self, data):
        business_address = self.initial_data.get("business_address", None)
        owner = self.initial_data.get("owner", None)
        business_name = self.initial_data.get("business_name", None)
        # business_desc = self.initial_data.get("business_desc",None)

        # Required Validation
        if (not business_address):
            raise serializers.ValidationError(
                {"business_address": "Invalid Business Address Id."})
        elif (not owner):
            raise serializers.ValidationError({"owner": "Invalid Owner Id."})
        elif (not business_name):
            raise serializers.ValidationError(
                {"business_name": "Business name required."})
        # elif (not business_desc):
        #     raise serializers.ValidationError({"business_desc": "Business name required."})

        # Unique Constrain Validation
        query_set = Business.objects.exclude(
            pk=self.instance.pk) if self.instance else Business.objects.all()
        if (query_set.filter(owner=owner, business_address=business_address).exists()):
            raise serializers.ValidationError(
                {'non_field_errors': 'This combination of owner and business address already exists.'})
        return super().validate(data)

    class Meta:
        fields = "__all__"
        model = Business


logger = logging.getLogger(__name__)


class SocialProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialProfile
        fields = '__all__'


class OAuthAccountSerializer(serializers.ModelSerializer):
    social_profile = SocialProfileSerializer(read_only=True)

    class Meta:
        model = OAuthAccount
        fields = '__all__'
        read_only_fields = ('user',)

    def validate(self, data):
        # logger.debug(f"Validating data: {data}")
        return data
