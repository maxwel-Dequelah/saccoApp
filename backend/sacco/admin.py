from django.contrib import admin
from .models import User, Balance, Transaction
# Register your models here.
admin.site.register(User)
admin.site.register(Transaction)
admin.site.register(Balance)
