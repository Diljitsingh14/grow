from django.shortcuts import render
from rest_framework import viewsets, response, serializers
from .models import Business, Address, Coordinates, Clients
from .serializer import BusinessSerializer, AddressSerializer, ClientSerialize

# Create your views here.


class BusinessViewSet(viewsets.ModelViewSet):
    model = Business
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer

    def create_proxy_business_address(self, data):
        coordinates = data.get("coordinates", None)
        if (coordinates):
            co_resp = self.create_proxy_address_coordinates(coordinates)
            data['coordinates'] = co_resp

        resp = Address.objects.create(**data)
        return resp

    def create_proxy_address_coordinates(self, data):
        lat = data.get("latitude", None)
        lng = data.get("longitude", None)
        if (lat and lng):
            resp = Coordinates.objects.create(**data)
            return resp
        # raise serializers.ValidationError({"coordinates":"Missing longitude or latitude."})
        return None

    def create(self, request, *args, **kwargs):
        business_address = request.data.get("business_address", None)

        if (type(business_address) == int):
            return super().create(request, *args, **kwargs)
        elif (type(business_address) == dict):
            # create address;
            resp = self.create_proxy_business_address(business_address)
            if (resp.id):
                self.request.data['business_address'] = resp.id

            return super().create(request, *args, **kwargs)

        else:
            return response.Response({"address": "No address Found."}, status=400)

    def perform_create(self, serializer):
        # Extract related fields from request.data
        address_id = self.request.data.get('business_address', None)
        owner_id = self.request.data.get('owner', None)

        # check business id present or object

        # Set related fields in serializer data
        serializer.validated_data['business_address_id'] = address_id
        serializer.validated_data['owner_id'] = owner_id

        serializer.save()


class ClientsViewSet(viewsets.ModelViewSet):
    serializer_class = ClientSerialize
    queryset = Clients.objects.all()
