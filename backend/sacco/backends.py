from django.contrib.auth.backends import ModelBackend
from sacco.models import User



class PhoneNumberBackend(ModelBackend):
    def authenticate(self, request, phoneNumber, password, **kwargs):
        try:
            user = User.objects.get(phoneNumber=phoneNumber)
        except User.DoesNotExist:
            return None
        
        if user.check_password(password):
            return user
        return None
