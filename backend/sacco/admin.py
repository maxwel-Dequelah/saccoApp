from django.contrib import admin
from .models import User, Balance, Transaction, EmergencyFund
# Register your models here.
admin.site.register(User)
admin.site.register(Transaction)
admin.site.register(Balance)
admin.site.register(EmergencyFund)
