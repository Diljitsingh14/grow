from django.contrib import admin
from .models import Business, Clients, Address, Coordinates, Redirection, Click_Counter

# Register your models here.
admin.site.register([Business, Clients, Address,
                    Coordinates, Redirection, Click_Counter])
