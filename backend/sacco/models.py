from django.db import models
import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone

# Custom user manager
class UserManager(BaseUserManager):
    def create_user(self, phoneNumber, dob, first_name, last_name, email=None, password=None):
        if not phoneNumber:
            raise ValueError('Users must have a phone number')
        user = self.model(
            phoneNumber=phoneNumber,
            dob=dob,
            first_name=first_name,
            last_name=last_name,
            email=self.normalize_email(email),
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phoneNumber, dob, first_name, last_name, email=None, password=None):
        user = self.create_user(
            phoneNumber=phoneNumber,
            password=password,
            dob=dob,
            first_name=first_name,
            last_name=last_name,
            email=email,
        )
        
        user.is_admin = True
        user.save(using=self._db)
        return user

# User model
class User(AbstractBaseUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    dob = models.DateField()
    first_name = models.CharField(max_length=30)  # Added first name
    last_name = models.CharField(max_length=30)   # Added last name
    phoneNumber = models.CharField(max_length=10, unique=True)
    email = models.EmailField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'phoneNumber'
    REQUIRED_FIELDS = ['dob', 'first_name', 'last_name']  # Added first_name and last_name as required fields

    objects = UserManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.phoneNumber})"

    def save(self, *args, **kwargs):
        self.username = self.phoneNumber  # Auto-populate username with phoneNumber
        super().save(*args, **kwargs)

    @property
    def is_staff(self):
        return self.is_admin

# Transaction model
class Transaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(default=timezone.now)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.user.phoneNumber} - {self.amount} on {self.date}"

# Balance model
class Balance(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=10, decimal_places=2)
    lastEdited = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.phoneNumber} - Balance: {self.balance}"
