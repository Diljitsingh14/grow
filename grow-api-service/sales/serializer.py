from rest_framework import serializers
from .models import *

from main.serializer import BusinessSerializer

from main.models import Business


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = "__all__"


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text']

class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = ['name', 'symbol']

class ProductDomainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domain
        fields = "__all__"

class CategorySerializer(serializers.ModelSerializer):
    domain = ProductDomainSerializer(  read_only=True)
    class Meta:
        model = Category
        fields = "__all__"


class SubCategorySerializer(serializers.ModelSerializer):
    category = CategorySerializer(  read_only=True)
    class Meta:
        model = SubCategory
        fields = ['name', 'category']

class ReturnPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = ReturnPolicy
        fields = "__all__"

class ProductAndServicesSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)  # Added the images field
    currency = CurrencySerializer(read_only=True)  # Currency object
    subcategory = SubCategorySerializer(read_only=True)  # Subcategory object
    return_policies = ReturnPolicySerializer(read_only=True,many=True)  # Return policy object


    class Meta:
        model = ProductAndService
        fields = "__all__"


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'product_and_service', 'user', 'content', 'rating']

    def get_user(self, obj):
        return {
            "id": obj.user.id,
            "username": obj.user.username
        }

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
    product = serializers.PrimaryKeyRelatedField(queryset=ProductAndService.objects.all())

    class Meta:
        model = Cart
        fields = ['id', 'user', 'product', 'quantity', 'status']
        read_only_fields = ['user']  # Prevent users from modifying 'user' field
