from django.core.management.base import BaseCommand
from main.models import OAuthAccount
import time
from turnx.googleAuthController import refresh_google_token


class Command(BaseCommand):
    help = 'Refreshes Google OAuth tokens for all accounts'

    def handle(self, *args, **kwargs):
        print("refreshing token of auth accounts.")
        for account in OAuthAccount.objects.all():
            # Check if token expires in the next 5 minutes
            if account.expires_at < int(time.time()) + 300:
                refresh_google_token(account)
