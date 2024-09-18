from django.db import models
import uuid
from django.contrib.auth.models import User

# Create your models here.


class Coordinates(models.Model):
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)

    def __str__(self):
        return f"lt: {self.latitude}, lng: {self.longitude}"

    class Meta:
        verbose_name_plural = "Coordinates"


class Address(models.Model):
    address_line_1 = models.CharField(max_length=200)
    address_line_2 = models.CharField(max_length=200, blank=True, null=True)
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=200)
    postal_code = models.CharField(max_length=10)
    coordinates = models.OneToOneField(
        Coordinates, on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return f"{self.address_line_1}, {self.city}, {self.state}, {self.country}"

    class Meta:
        verbose_name_plural = "Address"


class Clients(models.Model):
    first_name = models.CharField(max_length=48)
    last_name = models.CharField(max_length=48, blank=True, null=True)
    phone_number = models.CharField(unique=True, max_length=12)
    email = models.EmailField(unique=True, max_length=100)

    def __str__(self) -> str:
        return f"{self.first_name} {self.last_name}"

    class Meta:
        verbose_name_plural = "Clients"


class Business(models.Model):
    owner = models.ForeignKey(
        Clients, on_delete=models.SET_NULL, blank=True, null=True)
    business_name = models.CharField(max_length=200)
    business_address = models.ForeignKey(
        Address, on_delete=models.SET_NULL, blank=True, null=True)
    business_desc = models.CharField(max_length=1000, null=True, blank=True)
    business_type = models.CharField(max_length=100, null=True, blank=True)

    logo = models.ImageField(upload_to='logos/', blank=True, null=True)
    business_hours = models.CharField(max_length=255, blank=True, null=True)
    business_days = models.JSONField(default=dict, blank=True, null=True)
    insta_account_link = models.URLField(blank=True, null=True)
    facebook_account_link = models.URLField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self) -> str:
        return self.business_name

    def get_business_days(self):
        days = {
            's': 'Sunday',
            'm': 'Monday',
            't': 'Tuesday',
            'w': 'Wednesday',
            'th': 'Thursday',
            'f': 'Friday',
            's': 'Saturday',
        }
        return {day: name for day, name in days.items() if self.business_days.get(day, False)}

    def set_business_days(self, days_list):
        valid_days = ['s', 'm', 't', 'w', 'th', 'f', 's']
        self.business_days = {day: day in days_list for day in valid_days}
        self.save()

    class Meta:
        unique_together = ["owner", "business_address"]
        verbose_name_plural = "Businesses"


class Redirection(models.Model):
    uuid = models.UUIDField(
        default=uuid.uuid4, unique=True)
    link = models.URLField(default="/setup_url/", null=False)

    def __str__(self):
        # Display the UUID along with the link for better identification
        return f"UUID: {self.uuid}"


class Click_Counter(models.Model):
    redirection = models.ForeignKey(
        Redirection, null=False, blank=False, on_delete=models.CASCADE, db_index=True)
    dateTime = models.DateTimeField(auto_now_add=True, db_index=True)
    user_agent = models.TextField(blank=True, null=True)
    operating_system = models.CharField(max_length=50, blank=True, null=True)
    browser = models.CharField(max_length=50, blank=True, null=True)
    # clicks = models.PositiveBigIntegerField(default=0,null=False,blank=False)


class SocialProfile(models.Model):
    # 1. iss: Issuer identifier
    iss = models.CharField(max_length=255)

    # 2. azp: Authorized party - the party to which the ID Token was issued
    azp = models.CharField(max_length=255)

    # 3. aud: Audience - the intended audience for the ID Token
    aud = models.CharField(max_length=255)

    # 4. sub: Subject - identifier for the user
    sub = models.CharField(max_length=255, unique=True)

    # 5. email: User's email address
    email = models.EmailField()

    # 6. email_verified: Boolean to check if the email is verified
    email_verified = models.BooleanField()

    # 7. at_hash: Access Token hash
    at_hash = models.CharField(max_length=255, blank=True, null=True)

    # 8. name: Full name of the user
    name = models.CharField(max_length=255, blank=True, null=True)

    # 9. picture: URL to the user's profile picture
    picture = models.URLField(max_length=500, blank=True, null=True)

    # 10. given_name: User's first name
    given_name = models.CharField(max_length=255, blank=True, null=True)

    # 11. family_name: User's last name
    family_name = models.CharField(max_length=255, blank=True, null=True)

    # 12. iat: Issued At - time at which the JWT was issued
    iat = models.IntegerField()

    # 13. exp: Expiration time of the JWT
    exp = models.IntegerField()

    def __str__(self):
        return self.email


class OAuthAccount(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='oauth_accounts')
    provider = models.CharField(max_length=255)
    provider_account_id = models.CharField(max_length=255, unique=True)
    access_token = models.TextField()
    refresh_token = models.TextField()
    expires_at = models.BigIntegerField()
    scope = models.TextField()
    token_type = models.CharField(max_length=255)
    id_token = models.TextField()

    # Add a ForeignKey to SocialProfile
    social_profile = models.ForeignKey(
        'SocialProfile', on_delete=models.CASCADE, null=True, blank=True
    )

    def __str__(self):
        return f"{self.provider} account for {self.user.username}"
