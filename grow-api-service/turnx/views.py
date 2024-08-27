from django.shortcuts import render
from .serializer import *
from .models import *
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from main.models import OAuthAccount
from rest_framework.response import Response
from rest_framework.exceptions import APIException, NotFound, ValidationError
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import action

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

# To use settings like GOOGLE_API_TOKEN and CLIENT_SECRET
from django.conf import settings


# Create your views here.


class FormTemplateListView(ListAPIView):
    """
    API view to retrieve list of form templates.
    """

    serializer_class = FormTemplateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Override to return form templates for the logged-in user.
        """
        return FormTemplate.objects.filter(user=self.request.user)


class FormTemplateDetailView(RetrieveAPIView):
    """
    API view to retrieve a single form template by its ID.
    """
    queryset = FormTemplate.objects.all()
    serializer_class = FormTemplateSerializer
    permission_classes = [IsAuthenticated]


class MasterFormTemplateListView(ListAPIView):
    """
    API view to retrieve a list of all master form templates.
    """
    queryset = FormTemplate.objects.filter(is_master=True)
    serializer_class = FormTemplateSerializer
    permission_classes = [IsAuthenticated]


class MasterFormThemeListView(ListAPIView):
    """
    API view to retrieve a list of all master form templates.
    """
    queryset = FormTheme.objects.filter(is_master=True)
    serializer_class = FormThemeSerializer
    permission_classes = [IsAuthenticated]


class ConnectedFormViewSet(ModelViewSet):
    """
    A viewset for viewing, editing, and deleting ConnectedForm instances.
    """
    # queryset = ConnectedForm.objects.all()
    serializer_class = connectedFormSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Optionally restricts the returned forms to the user who is authenticated.
        """
        return ConnectedForm.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Set the user field to the requesting user when creating a ConnectedForm.
        """
        try:
            account_id = self.request.data.get('account')
            theme_id = self.request.data.get('form_theme')

            if not account_id:
                raise ValidationError("Account ID is required.")

            # Fetch the OAuthAccount and FormTheme objects
            account = OAuthAccount.objects.get(id=account_id)
            theme = FormTheme.objects.get(id=theme_id)

            # Save the new ConnectedForm instance
            serializer.save(user=self.request.user,
                            account=account, form_theme=theme)

        except OAuthAccount.DoesNotExist:
            raise NotFound(detail="OAuthAccount not found with the given ID.")
        except FormTheme.DoesNotExist:
            raise NotFound(detail="Form theme not found with the given ID.")
        except ValidationError as e:
            raise e
        except Exception as e:
            # Catch all other exceptions and raise a generic API exception
            raise APIException(
                detail="An error occurred while creating the ConnectedForm.")

    def perform_update(self, serializer):
        """
        Update the ConnectedForm instance.
        """
        try:
            account_id = self.request.data.get('account')
            theme_id = self.request.data.get('form_theme')

            if account_id:
                account = OAuthAccount.objects.get(id=account_id)
                serializer.validated_data['account'] = account

            if theme_id:
                theme = FormTheme.objects.get(id=theme_id)
                serializer.validated_data['form_theme'] = theme

            serializer.save()

        except OAuthAccount.DoesNotExist:
            raise NotFound(detail="OAuthAccount not found with the given ID.")
        except FormTheme.DoesNotExist:
            raise NotFound(detail="Form theme not found with the given ID.")
        except Exception as e:
            raise APIException(
                detail="An error occurred while updating the ConnectedForm.")

    def update(self, request, *args, **kwargs):
        """
        Update a ConnectedForm instance.
        """
        partial = True
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """
        Delete a ConnectedForm instance.
        """
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ConnectedForm.DoesNotExist:
            return Response({"detail": "ConnectedForm not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": "An error occurred while deleting the ConnectedForm."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ConnectedFormPublicRetrieveAPIView(APIView):
    permission_classes = []  # No authentication required

    def get(self, request, uuid):
        try:
            connected_form = ConnectedForm.objects.get(public_link_uuid=uuid)
        except ConnectedForm.DoesNotExist:
            raise NotFound(
                detail="Connected form not found with the given UUID.")

        serializer = ConnectedFormPublicSerializer(connected_form)
        return Response(serializer.data)


class LeadResponseViewSet(ModelViewSet):
    """
    A viewset for viewing, editing, and creating LeadResponse instances.
    """
    queryset = LeadResponse.objects.all()
    serializer_class = LeadResponseSerializer
    # Or use different permissions if needed
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Optionally restricts the returned lead responses to those of the authenticated user.
        """
        user = self.request.user
        return LeadResponse.objects.filter(connected_form__user=user)

    def perform_create(self, serializer):
        # Extract form_response from request data
        form_response = self.request.data.get('form_response', [])

        # Initialize variables to store lead name and email
        lead_name = None
        lead_email = None

        # Check if form_response is a list
        if isinstance(form_response, list):
            # Iterate over each item in the form_response list
            for item in form_response:
                # Check if item is a dictionary and has a 'name' key
                if isinstance(item, dict):
                    if item.get('name') == 'full_name':
                        lead_name = item.get('response')
                    elif item.get('name') == 'email':
                        lead_email = item.get('response')

        # Call the serializer save method with extracted data
        serializer.save(
            lead_name=lead_name,
            lead_email=lead_email
        )

    @action(detail=True, methods=['post'], url_path='consume-lead')
    def consume_lead(self, request, pk=None):
        """
        Consume a lead by changing its status to accepted or declined.
        If accepted, schedule an event in the client's Google Calendar.
        """
        lead_response = self.get_object()
        status_update = request.data.get('status', 'Pending')
        if status_update not in ['Accepted', 'Declined']:
            return Response(
                {"detail": "Invalid status. Must be 'Accepted' or 'Declined'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if status_update == 'Accepted':
            try:
                # Schedule an event in Google Calendar
                self.schedule_google_calendar_event(lead_response)
                lead_response.status = 'Scheduled'
                lead_response.pushed_to_google = True
                lead_response.save()
                return Response({"detail": "Lead accepted and event scheduled."}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        else:
            lead_response.status = 'Declined'
            lead_response.save()
            return Response({"detail": "Lead declined."}, status=status.HTTP_200_OK)

    def schedule_google_calendar_event(self, lead_response):
        """
        Schedules an event in Google Calendar for the lead's connected form's account.
        """
        # Extract the OAuth account from the connected form
        oauth_account = lead_response.connected_form.account
        if not oauth_account or not oauth_account.access_token:
            raise ValueError("No valid OAuth account or access token found.")

        # Extract date, time, and description from form_response
        form_response = lead_response.form_response
        date, time, description = None, None, ""
        for item in form_response:
            if item.get('name') == 'booking_date':
                date = item.get('response')
            elif item.get('name') == 'booking_time':
                time = item.get('response')
            elif item.get('name') == 'special_requests':
                description = item.get('response')

        if not date or not time:
            raise ValueError("Date or time not provided in the form response.")

        # Combine date and time for event start and end
        start_datetime = f"{date}T{time}:00"
        end_datetime = f"{date}T{time}:50"  # Adjust duration as needed

        credentials = Credentials(
            token=oauth_account.access_token,
            refresh_token=oauth_account.id_token,  # Add refresh token logic if needed
            token_uri='https://oauth2.googleapis.com/token',
            client_id=settings.GOOGLE_CLIENT_ID,
            client_secret=settings.GOOGLE_CLIENT_SECRET,
        )

        service = build('calendar', 'v3', credentials=credentials)

        event = {
            'summary': lead_response.connected_form.form_template.name,
            'description': description,
            'start': {
                'dateTime': start_datetime,
                'timeZone': 'UTC',  # Adjust for correct timezone
            },
            'end': {
                'dateTime': end_datetime,
                'timeZone': 'UTC',  # Adjust for correct timezone
            },
        }

        service.events().insert(calendarId='primary', body=event).execute()
