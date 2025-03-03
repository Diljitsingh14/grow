import os
import environ
import stripe
import django_filters

from rest_framework import viewsets,status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend


from django.shortcuts import render
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse

from main.models import Business
from .serializer import *
from .models import *
from .stripeController import delete_all_stripe_products



env = environ.Env()
environ.Env.read_env('.env.local')
STRIPE_PIN = env("STRIPE_PIN")


STRIPE_SECRET_KEY = env('STRIPE_SECRET_KEY')
STRIPE_PUB_KEY = env('STRIPE_PUBLISH_KEY')

stripe.api_key = STRIPE_SECRET_KEY


@csrf_exempt  # Disable CSRF for this view, not recommended for production without proper security
@require_POST
def push_products_to_stripe(request):
    pin = request.POST.get('pin')

    # Check if the provided pin matches the environment variable
    if pin != STRIPE_PIN:
        return HttpResponse("Unauthorized: Invalid PIN", status=401)

    # Fetch all products from the database
    products = Product.objects.all()

    # Initialize a list to store Stripe product creation results
    stripe_products = []

    for product in products:
        try:
            # Create a product in Stripe
            stripe_product = stripe.Product.create(
                name=product.name,
                description=product.description,
                # Full URL to the product image
                images=[request.build_absolute_uri(product.image.url)],
                metadata={
                    'product_id': product.product_id,
                    'label': product.label
                }
            )

            # Optionally, create a price object for the product
            stripe_price = stripe.Price.create(
                product=stripe_product.id,
                # Stripe expects the amount in cents
                unit_amount=int(product.price * 100),
                currency='usd',
            )

            # Append the created Stripe product and price to the list
            stripe_products.append({
                'stripe_product_id': stripe_product.id,
                'stripe_price_id': stripe_price.id
            })
        except stripe.error.StripeError as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'stripe_products': stripe_products}, status=201)


# Orders API
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def create(self, request, *args, **kwargs):
        business_id = request.data.get('business', None)

        if (type(business_id) == int):
            return super().create(request, *args, **kwargs)
        elif (type(business_id) == dict):
            # create business object
            return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        # Extract related fields from request.data
        status_id = self.request.data.get('status', None)
        discount_id = self.request.data.get('discounts', None)
        product_id = self.request.data.get('product', None)
        business_id = self.request.data.get('business', None)
        promo_code_id = self.request.data.get("promo_code", None)

        # check business id present or object

        # Set related fields in serializer data
        serializer.validated_data['status_id'] = status_id
        serializer.validated_data['discounts_id'] = discount_id
        serializer.validated_data['product_id'] = product_id
        serializer.validated_data['business_id'] = business_id
        serializer.validated_data['promo_code_id'] = promo_code_id

        serializer.save()

    def perform_update(self, serializer):
        # Extract related fields from request.data
        status_id = self.request.data.get('status', None)
        discount_id = self.request.data.get('discounts', None)
        product_id = self.request.data.get('product', None)
        business_id = self.request.data.get('business', None)

        # Set related fields in serializer data
        serializer.validated_data['status_id'] = status_id
        serializer.validated_data['discounts_id'] = discount_id
        serializer.validated_data['product_id'] = product_id
        serializer.validated_data['business_id'] = business_id

        serializer.save()


#Discounts API
class DiscountViewSet(viewsets.ModelViewSet):
    queryset = Discounts.objects.all()
    serializer_class = DiscountSerializer


#ProductAndService API
class ProductAndServiceViewSet(viewsets.ModelViewSet):
    queryset = ProductAndService.objects.all()
    serializer_class = ProductAndServicesSerializer
    http_method_names = ['get']
    permission_classes = [AllowAny]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description', 'type']
    ordering_fields = ['price', 'quantity_available']


# Status API
class StatusViewSet(viewsets.ModelViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerialiser
    http_method_names = ['get']



class ReviewFilter(django_filters.FilterSet):
    # product = django_filters.NumberFilter(field_name='product_and_service', lookup_expr='iexact')  # Filter by status (exact match)
    product = django_filters.NumberFilter(field_name='product_and_service', lookup_expr='exact')  # Filter by status (exact match)

    class Meta:
        model = Review
        fields =['product_and_service']

# Cart API
class CartFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(field_name='status', lookup_expr='iexact')  # Filter by status (exact match)

    class Meta:
        model = Cart
        fields = ['status']

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users can access

    filter_backends = [DjangoFilterBackend]  # Use DjangoFilterBackend for filtering
    filterset_class = CartFilter  # Apply the custom filter

    def get_queryset(self):
        """Return only carts that belong to the authenticated user."""
        return Cart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """If the user adds the same product again, update the existing cart item instead of creating a new one."""
        user = self.request.user
        product = serializer.validated_data['product']

        # Check if the cart already contains this product
        existing_cart_item = Cart.objects.filter(user=user, product=product).first()

        if existing_cart_item:
            # Update quantity and status if necessary
            existing_cart_item.quantity = serializer.validated_data.get('quantity', 0)
            existing_cart_item.status = serializer.validated_data.get('status', existing_cart_item.status)
            existing_cart_item.save()

            return Response(CartSerializer(existing_cart_item).data, status=status.HTTP_200_OK)
                # If no existing cart item, create a new one
        serializer.save(user=user)

    def destroy(self, request, *args, **kwargs):
        """Ensure only the cart owner can delete their cart."""
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {"error": "You do not have permission to delete this cart."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().destroy(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """Ensure only the cart owner can update their cart quantity."""
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {"error": "You do not have permission to update this cart."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().update(request, *args, **kwargs)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    # List view should be public
    permission_classes = [AllowAny]
    filterset_class = ReviewFilter  # Apply the custom filter
    filter_backends = [DjangoFilterBackend]  # Use DjangoFilterBackend for filtering

    # For all other methods, authentication is required
    def get_permissions(self):
        if self.action == 'list':
            return [AllowAny()]
        return [IsAuthenticated()]

@csrf_exempt
@require_POST
def delete_all_products_from_stripe(request):
    pin = request.POST.get('pin')

    # Check if the provided pin matches the environment variable
    if pin != os.getenv('PRODUCT_SYNC_PIN'):
        return HttpResponse("Unauthorized: Invalid PIN", status=401)

    result = delete_all_stripe_products()
    return JsonResponse({'message': result})
