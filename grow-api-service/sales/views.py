from django.shortcuts import render
from rest_framework import viewsets
from .models import Order, Discounts, ProductAndService, Status
from main.models import Business
from .serializer import OrderSerializer, DiscountSerializer, ProductAndServicesSerializer, StatusSerialiser
from rest_framework.response import Response

# Create your views here.


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
