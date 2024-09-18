from django.db import models
from django.contrib.auth.models import User
import uuid

# Create your models here.


class FormTemplate(models.Model):
    # 1. Array of N fields (JSON): {name, type, desc, helptext}
    fields = models.JSONField()

    # 2. Name of Template
    name = models.CharField(max_length=255)

    # 3. Description
    description = models.TextField(blank=True, null=True)

    # 4. isMaster
    is_master = models.BooleanField(default=False)

    # 5. isDraft
    is_draft = models.BooleanField(default=True)

    # 6. User ID
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class FormTheme(models.Model):
    # 1. UserId (ForeignKey to User model)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # 2. Name
    name = models.CharField(max_length=255)

    # 3. Brandlogo
    brand_logo = models.ImageField(
        upload_to='brand_logos/', blank=True, null=True)

    # 4. Background color with a default value
    background_color = models.CharField(max_length=20, default='lightgrey')

    # 5. Text color with a default value
    text_color = models.CharField(max_length=20, default='black')

    is_master = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class ConnectedForm(models.Model):
    # 1. FormTemplateId (ForeignKey to FormTemplates model)
    form_template = models.ForeignKey(
        'FormTemplate', on_delete=models.CASCADE)

    # 2. AccountID (ForeignKey to OAuthAccount model)
    account = models.ForeignKey('main.OAuthAccount', on_delete=models.CASCADE)

    # 3. Status (ChoiceField)
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Paused', 'Paused'),
        ('Error', 'Error'),
    ]
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default='Active')

    # 4. publicLinkUUID (UUID)
    public_link_uuid = models.UUIDField(
        default=uuid.uuid4, editable=False, unique=True)

    # 5. FormTheme (ForeignKey to FormTheme model)
    form_theme = models.ForeignKey(
        FormTheme, on_delete=models.SET_NULL, null=True, blank=True)

    # 6. User ID
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"ConnectedForm {self.id} for Template {self.form_template.name}"


class LeadResponse(models.Model):
    # 1. Connected Form (ForeignKey to ConnectedForm model)
    connected_form = models.ForeignKey(
        ConnectedForm, on_delete=models.CASCADE, related_name='lead_responses'
    )

    # 2. Form Response (JSONField)
    form_response = models.JSONField()

    # 3. Date Time (auto_now_add=True to automatically set the date/time when a response is created)
    created_at = models.DateTimeField(auto_now_add=True)

    # 4. Pushed to Google (BooleanField)
    pushed_to_google = models.BooleanField(default=False)

    # 5. Status (ChoiceField)
    STATUS_CHOICES = [
        ('Scheduled', 'Scheduled'),
        ('Canceled', 'Canceled'),
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
        ('Archived', 'Archived'),
        # Add more statuses if needed
    ]
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default='Pending')

    # 6. Lead Name (optional)
    lead_name = models.CharField(max_length=255, blank=True, null=True)

    # 7. Lead Email (optional)
    lead_email = models.EmailField(blank=True, null=True)

    # 8. Source (optional)
    source = models.CharField(max_length=100, blank=True, null=True)

    # 9. Notes (optional)
    notes = models.TextField(blank=True, null=True)

    # 10. Created By (optional, ForeignKey to User model)
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True)

    # 11. Updated At (DateTimeField, auto_now=True to automatically set the date/time when a response is updated)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"LeadResponse for ConnectedForm ID {self.connected_form.id} - Status: {self.status}"
