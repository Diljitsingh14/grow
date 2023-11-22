from django.db import models

# Create your models here.


class Order(models.Model):
    """
    B2B order book
    """
    create_on = models.DateTimeField(auto_now_add=True)
    full_fill_on = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    status = models.ForeignKey(
        "Status", on_delete=models.SET_NULL, default="0", null=True, blank=True)
    business = models.ForeignKey(
        "main.Business", on_delete=models.SET_DEFAULT, default="1")
    discounts = models.ForeignKey(
        "Discounts", on_delete=models.SET_NULL, null=True, blank=True)
    promo_code = models.ForeignKey(
        "PromoCodes", on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.IntegerField(default=1, help_text='Quantity ordered')
    product = models.ForeignKey(
        "ProductAndService", on_delete=models.SET_NULL, null=True)
    payment = models.ForeignKey(
        "Payments", on_delete=models.SET_NULL, null=True, blank=True, related_name="sales_id")

    def __str__(self) -> str:
        return f"{self.business.business_name} {self.full_fill_on}"


class Status(models.Model):
    name = models.CharField(max_length=48)
    value = models.CharField(max_length=48)
    color = models.CharField(max_length=202, default="#eb4034")

    def __str__(self) -> str:
        return self.name


class Discounts(models.Model):
    name = models.CharField(max_length=48)
    value = models.CharField(max_length=48)
    label = models.CharField(max_length=48)
    color = models.CharField(max_length=202, default="#eb4034")

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name_plural = "Discounts"


class PromoCodes(models.Model):
    code = models.CharField(max_length=20, unique=True)
    discount_percentage = models.PositiveIntegerField()
    expiration_date = models.DateField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.code

    class Meta:
        verbose_name_plural = "PromoCodes"


class Template(models.Model):
    image = models.URLField()
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    is_premium = models.BooleanField(default=False)
    is_new = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class ProductAndService(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    TYPE_CHOICES = [
        ('product', 'Product'),
        ('service', 'Service'),
    ]
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    template = models.ForeignKey(
        Template, on_delete=models.SET_NULL, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_template_type = models.BooleanField(default=False)
    image = models.URLField(null=True, blank=True)
    quantity_available = models.IntegerField(
        default=0, help_text='Available stock quantity')
    is_featured = models.BooleanField(
        default=False, help_text='Is this product or service featured?')

    def __str__(self):
        return f"{self.name} - {self.type}"


class Payments(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('online', 'Online'),
        ('offline', 'Offline'),
    ]

    order = models.ForeignKey(
        Order, on_delete=models.SET_NULL, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_method = models.CharField(
        max_length=20, choices=PAYMENT_METHOD_CHOICES, default='online')
    transaction_id = models.CharField(max_length=255, blank=True, null=True)
    payment_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.order} - {self.amount} - {self.status}"

    class Meta:
        verbose_name_plural = "Payments"
