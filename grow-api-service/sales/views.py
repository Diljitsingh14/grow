import os
import environ
import stripe

from rest_framework import viewsets
from rest_framework.response import Response

from django.shortcuts import render
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse

from main.models import Business
from .serializer import OrderSerializer, DiscountSerializer, ProductAndServicesSerializer, StatusSerialiser
from .models import Order, Discounts, ProductAndService, Status, Product
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


class DiscountViewSet(viewsets.ModelViewSet):
    queryset = Discounts.objects.all()
    serializer_class = DiscountSerializer


class ProductAndServiceViewSet(viewsets.ModelViewSet):
    queryset = ProductAndService.objects.all()
    serializer_class = ProductAndServicesSerializer
    http_method_names = ['get']


class StatusViewSet(viewsets.ModelViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerialiser
    http_method_names = ['get']


@csrf_exempt
@require_POST
def delete_all_products_from_stripe(request):
    pin = request.POST.get('pin')

    # Check if the provided pin matches the environment variable
    if pin != os.getenv('PRODUCT_SYNC_PIN'):
        return HttpResponse("Unauthorized: Invalid PIN", status=401)

    result = delete_all_stripe_products()
    return JsonResponse({'message': result})
