from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
import requests
import json
from django.conf import settings
import time


def refresh_google_token(oauth_account):
    """
    Refreshes the Google OAuth access token using the refresh token.

    Parameters:
    - oauth_account: The OAuthAccount instance containing credentials.

    Returns:
    - bool: True if the token was successfully refreshed, False otherwise.
    """
    if not oauth_account.refresh_token:
        raise ValueError("Refresh token is missing for the OAuth account.")

    token_url = 'https://oauth2.googleapis.com/token'
    payload = {
        'client_id': settings.GOOGLE_CLIENT_ID,
        'client_secret': settings.GOOGLE_CLIENT_SECRET,
        'refresh_token': oauth_account.refresh_token,
        'grant_type': 'refresh_token',
    }

    response = requests.post(token_url, data=payload)
    if response.status_code == 200:
        tokens = response.json()
        oauth_account.access_token = tokens['access_token']
        oauth_account.expires_at = int(time.time()) + tokens['expires_in']
        oauth_account.save(update_fields=['access_token', 'expires_at'])
        return True
    else:
        # Log error or handle as needed
        print(f"Error refreshing token: {response.content}")
        return False
