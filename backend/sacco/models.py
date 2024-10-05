import base64
from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.core.exceptions import ValidationError

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import MinValueValidator


def generate_short_uuid():
    # Generate a UUID
    uid = uuid.uuid4()
    # Encode the UUID in base64 and then strip padding and special characters
    short_uid = base64.urlsafe_b64encode(uid.bytes).rstrip(b'=').decode('utf-8')
    # Truncate to 12 characters if necessary
    return short_uid[:12]

# User model
class User(AbstractUser):
    id = models.CharField(primary_key=True, default=generate_short_uuid, editable=False, max_length=12)
    dob = models.DateField(null=True, blank=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phoneNumber = models.CharField(max_length=10, unique=True)
    email = models.EmailField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='user_groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to these groups.',
        verbose_name='groups',
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='user_user_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def __str__(self):
        return f"{self.first_name} - {self.username}"


# Balance model
class Balance(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)
    balance = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0.00, 
        validators=[MinValueValidator(0.00)]
    )
    lastEdited = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.first_name} - {self.user.phoneNumber} - Balance: {self.balance}"

    def adjust_balance(self, amount):
        """Adjust balance while ensuring it doesn't go below zero."""
        new_balance = self.balance + amount
        
        self.balance = new_balance
        self.save()


# Transaction model
class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(default=timezone.now)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)

    def __str__(self):
        return f"{self.user.first_name}-{self.user.phoneNumber} - {self.amount} on {self.date} ({self.transaction_type})"

    def save(self, *args, **kwargs):
        """Override save to adjust user's balance before saving the transaction."""
        balance_record = Balance.objects.get(user=self.user)

        if self.transaction_type == 'withdrawal':
            if self.amount > balance_record.balance:
                raise ValidationError("THE AMOUNT IS LARGER THAN THE BALANCE")
            balance_record.adjust_balance(-self.amount)  # Subtract balance
        elif self.transaction_type == 'deposit':
            if self.amount <= 0:
                raise ValidationError("Deposit amount must be positive.")
            balance_record.adjust_balance(self.amount)  # Add balance

        super().save(*args, **kwargs)


# Signal to automatically create balance for new users
@receiver(post_save, sender=User)
def create_user_balance(sender, instance, created, **kwargs):
    if created:
        Balance.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_balance(sender, instance, **kwargs):
    instance.balance.save()
