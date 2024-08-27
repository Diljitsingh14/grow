from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.http import response, Http404, JsonResponse
from django.contrib.auth import logout

from .models import Business, Address, Coordinates, Clients, Redirection, OAuthAccount, SocialProfile
from .serializer import BusinessSerializer, AddressSerializer, ClientSerialize, OAuthAccountSerializer, SocialProfileSerializer

from rest_framework import viewsets, response, serializers
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import ListCreateAPIView, CreateAPIView, RetrieveDestroyAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        request.user.auth_token.delete()
        logout(request)
        return Response(status=status.HTTP_200_OK)


class BusinessViewSet(viewsets.ModelViewSet):
    model = Business
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    # authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

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
    permission_classes = [IsAuthenticated]


def ReviewRedirect(request):
    uuid = request.GET['id']
    if not uuid:
        return redirect("/")
    try:
        red_obj = Redirection.objects.get(uuid=uuid)
    except:
        raise Http404(
            "Link is not associated! visit setup to set review link.")

    return redirect(red_obj.link)


class AuthTest(APIView):
    # authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        content = {
            'user': str(request.user),  # `django.contrib.auth.User` instance.
            'auth': str(request.auth),  # None
        }
        return Response(content)


class OAuthAccountListCreateView(ListCreateAPIView):
    serializer_class = OAuthAccountSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return OAuthAccount.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        social_profile_id = self.request.data.get('social_profile')

        if social_profile_id:
            # Ensure the social_profile instance exists
            social_profile = SocialProfile.objects.get(id=social_profile_id)
            serializer.save(user=self.request.user,
                            social_profile=social_profile)
        else:
            # Save without social_profile if not provided
            serializer.save(user=self.request.user)


class OAuthAccountRetrieveDestroyView(RetrieveDestroyAPIView):
    queryset = OAuthAccount.objects.all()
    serializer_class = OAuthAccountSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter queryset to only include the user's OAuth accounts
        return super().get_queryset().filter(user=self.request.user)


class SocialProfileCreateAPIView(CreateAPIView):
    queryset = SocialProfile.objects.all()
    serializer_class = SocialProfileSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        """
        Try to get a SocialProfile instance by email or sub.
        """
        email = self.request.data.get('email')
        sub = self.request.data.get('sub')

        # Check if a SocialProfile exists with the given email or sub
        try:
            return SocialProfile.objects.get(email=email) if email else SocialProfile.objects.get(sub=sub)
        except SocialProfile.DoesNotExist:
            return None

    def post(self, request, *args, **kwargs):
        social_profile = self.get_object()

        if social_profile:
            # Update the existing social profile
            serializer = self.get_serializer(social_profile, data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Create a new social profile
            return self.create(request, *args, **kwargs)

    def perform_update(self, serializer):
        serializer.save()


@ login_required
def ping(request):
    return JsonResponse({"message": "pong", "user": request.user.username})
