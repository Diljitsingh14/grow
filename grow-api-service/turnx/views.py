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
from main.models import Business
from datetime import datetime, timedelta

from django.utils.timezone import make_aware
import pytz
import math

import time as ttime


from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

# To use settings like GOOGLE_API_TOKEN and CLIENT_SECRET
from django.conf import settings

from .googleAuthController import refresh_google_token


# Create your views here.

def round_down_to_nearest_hour(dt):
    """Round down datetime to the nearest hour."""
    return dt.replace(minute=0, second=0, microsecond=0)


def round_up_to_nearest_hour(dt):
    """Round up datetime to the nearest hour."""
    return (dt.replace(minute=0, second=0, microsecond=0) + timedelta(hours=1)) if dt.minute != 0 else dt


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

    def is_token_expired(self, acc):
        """
        Check if the token is expired based on the 'expires_at' field in the account object.
        Assumes 'expires_at' is stored as a Unix timestamp (int).
        """
        if not acc.expires_at:
            return True  # If there's no expiry time, consider the token expired

        # Convert expires_at (assumed to be Unix timestamp) to datetime
        expires_at = datetime.utcfromtimestamp(acc.expires_at)
        current_time = datetime.utcnow()

        # Check if the current time is greater than or equal to the expiration time
        if current_time >= expires_at:
            return True
        return False

    def get(self, request, uuid):
        try:
            connected_form = ConnectedForm.objects.get(public_link_uuid=uuid)
        except ConnectedForm.DoesNotExist:
            raise NotFound(
                detail="Connected form not found with the given UUID.")

        available_slots = self.get_available_slots(connected_form)
        serializer = ConnectedFormPublicSerializer(connected_form)

        # Add available_slots to the response data
        response_data = serializer.data
        response_data['available_slots'] = available_slots

        return Response(response_data)

    def get_available_slots(self, connected_form):
        # Get business object
        try:
            business = Business.objects.get(user=connected_form.user)
        except Business.DoesNotExist:
            return []  # Return empty list if no business found

        # Get current date and one month ahead
        current_date = datetime.now().date()
        end_date = current_date + timedelta(days=30)

        # Get business days and hours
        business_days = business.business_days
        business_hours = business.business_hours.split("-")

        if not business_hours or len(business_hours) != 2:
            return []  # Return empty list if business hours are not set correctly

        # Define a list of available slots
        available_slots = []

        # Loop through each day in the next month
        for single_date in (current_date + timedelta(n) for n in range((end_date - current_date).days)):
            day_name = single_date.strftime("%a").lower()

            # Check if the day is a working day
            if not business_days.get(day_name[0], False):
                continue

            start_time = datetime.strptime(business_hours[0], '%H:%M').time()
            end_time = datetime.strptime(business_hours[1], '%H:%M').time()

            current_time = datetime.combine(single_date, start_time)

            # Calculate slots for the day
            day_slots = []
            while current_time.time() < end_time:
                end_slot_time = (datetime.combine(
                    single_date, current_time.time()) + timedelta(hours=1)).time()
                if end_slot_time <= end_time:
                    day_slots.append(
                        f"{current_time.time().strftime('%H:%M')}-{end_slot_time.strftime('%H:%M')}")
                current_time = datetime.combine(single_date, end_slot_time)

            if day_slots:
                available_slots.append(
                    {single_date.strftime("%d-%m-%Y"): day_slots})

        # Remove occupied slots based on Google Calendar events
        occupied_slots = self.get_google_calendar_events(connected_form)
        for day_slots in available_slots:
            for date, slots in day_slots.items():
                available_slots[available_slots.index(day_slots)][date] = [
                    slot for slot in slots if slot not in occupied_slots.get(date, [])]

        return available_slots

    def get_google_calendar_events(self, connected_form):
        occupied_slots = {}
        account = connected_form.account

        if not account or not account.access_token:
            return occupied_slots

        # Check if the access token is expired and refresh if necessary
        if self.is_token_expired(account):
            if not refresh_google_token(account):
                return occupied_slots  # If token refresh fails, return empty

        try:
            # Initialize credentials for Google API
            credentials = Credentials(
                token=account.access_token,
                refresh_token=account.id_token,  # Make sure this is the refresh token if applicable
                token_uri='https://oauth2.googleapis.com/token',
                client_id=settings.GOOGLE_CLIENT_ID,
                client_secret=settings.GOOGLE_CLIENT_SECRET,
                scopes=['https://www.googleapis.com/auth/calendar']
            )

            service = build('calendar', 'v3', credentials=credentials)

            # Get the first day of the current month
            current_date = datetime.utcnow()
            first_day_of_month = datetime(
                current_date.year, current_date.month, 1)
            first_day_of_month = make_aware(first_day_of_month, pytz.UTC)

            # Get the last day of the current month
            next_month = current_date.month + 1 if current_date.month < 12 else 1
            next_month_year = current_date.year if current_date.month < 12 else current_date.year + 1
            last_day_of_month = datetime(
                next_month_year, next_month, 1) - timedelta(days=1)
            last_day_of_month = make_aware(last_day_of_month, pytz.UTC)

            # Fetch events from Google Calendar
            events_result = service.events().list(
                calendarId='primary',
                timeMin=first_day_of_month.isoformat(),
                timeMax=last_day_of_month.isoformat(),
                singleEvents=True,
                orderBy='startTime'
            ).execute()

            events = events_result.get('items', [])

            # Populate occupied slots with the event data
            for event in events:
                start_time = event['start'].get(
                    'dateTime', event['start'].get('date'))
                end_time = event['end'].get(
                    'dateTime', event['end'].get('date'))

                # Convert start_time and end_time to datetime objects
                start_datetime = datetime.fromisoformat(
                    start_time.replace('Z', '+00:00'))
                end_datetime = datetime.fromisoformat(
                    end_time.replace('Z', '+00:00'))

                start_date = start_datetime.strftime("%d-%m-%Y")
                start_hour = start_datetime.strftime("%H:%M")
                end_hour = end_datetime.strftime("%H:%M")

                slot = f"{start_hour}-{end_hour}"
                if start_date in occupied_slots:
                    occupied_slots[start_date].append(slot)
                else:
                    occupied_slots[start_date] = [slot]

        except Exception as e:
            # Log the error or handle accordingly
            print(f"Error fetching Google Calendar events: {e}")

        return occupied_slots


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

    def schedule_google_calendar_event(self, lead_response, gap=1):
        """
            Schedules an event in Google Calendar for the lead's connected form's account.

            Parameters:
            - lead_response: LeadResponse instance with form response details.
            - gap: Duration in hours for the event (default is 1 hour).
        """

        # Extract the OAuth account from the connected form
        oauth_account = lead_response.connected_form.account
        if not oauth_account or not oauth_account.access_token:
            raise ValueError("No valid OAuth account or access token found.")

        # Check if the access token is about to expire
        # Token will expire in the next 5 minutes
        if oauth_account.expires_at < int(ttime.time()) + 300:
            if not refresh_google_token(oauth_account):
                raise ValueError("Failed to refresh access token.")

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

        st_dt, ed_dt = time.split("-")

        # Combine date and time for event start
        start_datetime_str = f"{date}T{st_dt}:00"
        end_datetime_str = f"{date}T{ed_dt}:00"
        # start_datetime = datetime.fromisoformat(start_datetime_str)
        # end_datetime = datetime.fromisoformat(end_datetime_str)

        # Calculate end datetime with the specified gap (default is 1 hour)
        # end_datetime = start_datetime + timedelta(hours=gap)
        # start_datetime = start_datetime.isoformat()
        # end_datetime = end_datetime.isoformat()

        credentials = Credentials(
            token=oauth_account.access_token,
            refresh_token=oauth_account.id_token,  # Add refresh token logic if needed
            token_uri='https://oauth2.googleapis.com/token',
            client_id=settings.GOOGLE_CLIENT_ID,
            client_secret=settings.GOOGLE_CLIENT_SECRET,
        )

        service = build('calendar', 'v3', credentials=credentials)

        event = {
            'summary': f'{description[:50]} {lead_response.connected_form.form_template.name}',
            'description': description,
            'start': {
                'dateTime': start_datetime_str,
                'timeZone': 'UTC',  # Adjust for correct timezone
            },
            'end': {
                'dateTime': end_datetime_str,
                'timeZone': 'UTC',  # Adjust for correct timezone
            },
        }

        service.events().insert(calendarId='primary', body=event).execute()
