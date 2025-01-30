from rest_framework import serializers
from .models import *

from main.serializer import BusinessSerializer
from main.models import Business


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'attribute_name', 'attribute_value',
                  'additional_price', 'quantity_available']


class ProductAndServicesSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = ProductAndService
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    discounts = serializers.StringRelatedField(
        read_only=True,
    )

    business = BusinessSerializer(read_only=True)
    status = serializers.StringRelatedField(read_only=True)
    product = ProductAndServicesSerializer(read_only=True)

    def validate(self, data):
        business_id = self.initial_data.get('business', None)
        # Example: Validate that the business_id is a valid business in your system
        if not business_id or not Business.objects.filter(id=business_id).exists():
            raise serializers.ValidationError(
                {"business": "Invalid business ID."})
        return data

    class Meta:
        model = Order
        fields = '__all__'


class DiscountSerializer(serializers.ModelSerializer):

    class Meta:
        model = Discounts
        fields = '__all__'


class StatusSerialiser(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = "__all__"

class CartSerializer(serializers.ModelSerializer):
     
    class Meta:
        model = Cart
        fields = '__all__'
