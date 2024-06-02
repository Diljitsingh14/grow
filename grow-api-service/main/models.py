from django.db import models
import uuid

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

    def __str__(self) -> str:
        return self.business_name

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
