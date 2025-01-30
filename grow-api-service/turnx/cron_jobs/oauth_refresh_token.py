from main.models import OAuthAccount
import time
from turnx.googleAuthController import refresh_google_token


def refresh_google_account_token():
    print("refresh tokens")
    for account in OAuthAccount.objects.all():
        # Check if token expires in the next 5 minutes
        if account.expires_at < int(time.time()) + 300:
            refresh_google_token(account)
