import base64
import uuid
from decimal import Decimal

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import MinValueValidator


def generate_short_uuid():
    uid = uuid.uuid4()
    short_uid = base64.urlsafe_b64encode(uid.bytes).rstrip(b'=').decode('utf-8')
    return short_uid[:12]


class User(AbstractUser):
    id = models.CharField(primary_key=True, default=generate_short_uuid, editable=False, max_length=12)
    dob = models.DateField(null=True, blank=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phoneNumber = models.CharField(max_length=10, unique=True)
    email = models.EmailField(null=True, blank=True)
    is_active = models.BooleanField(default=False)  # must be approved to activate
    is_admin = models.BooleanField(default=False)
    is_secretary = models.BooleanField(default=False)
    is_tresurer = models.BooleanField(default=False)  # Corrected typo here
    is_approved = models.BooleanField(default=False)  # Approval flag

    def __str__(self):
        return f"{self.first_name} - {self.username}"


class Balance(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, validators=[MinValueValidator(0.00)])
    lastEdited = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.first_name} - {self.user.phoneNumber} - Balance: {self.balance}"

    def adjust_balance(self, amount):
        new_balance = self.balance + amount
        if new_balance < 0:
            raise ValidationError("Insufficient balance.")
        self.balance = new_balance
        self.save()


class EmergencyFund(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.user.username} Emergency Fund: {self.amount}"


class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
        ('emergency', 'Emergency Deposit'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(default=timezone.now)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=12, choices=TRANSACTION_TYPES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_transactions')
    balance_after = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.user.username} - {self.transaction_type} - {self.amount} ({self.status})"

    def approve(self):
        if self.status != 'pending':
            raise ValidationError("Transaction already processed.")

        if self.transaction_type == 'deposit':
            self.user.balance.adjust_balance(self.amount)
        elif self.transaction_type == 'withdrawal':
            self.user.balance.adjust_balance(-self.amount)
        elif self.transaction_type == 'emergency':
            fund, _ = EmergencyFund.objects.get_or_create(user=self.user)
            fund.amount += self.amount
            fund.save()

        self.user.balance.refresh_from_db()
        self.balance_after = self.user.balance.balance
        self.status = 'approved'
        self.save()


class Loan(models.Model):
    STATUS_CHOICES = [
        ('waiting', 'Waiting for Approval'),
        ('performing', 'Performing'),
        ('paid', 'Paid'),
        ('rejected', 'Rejected'),
    ]

    REPAYMENT_PERIOD_CHOICES = [(i, f"{i} months") for i in [3, 4, 5, 6]]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=4, decimal_places=2, default=1.5)  # Monthly rate in percent
    period_months = models.IntegerField(choices=REPAYMENT_PERIOD_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='waiting')
    approved_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='approved_loans')
    date_requested = models.DateTimeField(default=timezone.now)
    date_approved = models.DateTimeField(null=True, blank=True)

    def calculate_due_amount(self):
        """Calculates total due with monthly compounding interest on reducing balance."""
        principal = self.amount
        balance = principal
        monthly_rate = self.interest_rate / Decimal(100)
        total_payment = Decimal('0.00')

        for _ in range(self.period_months):
            interest = balance * monthly_rate
            payment = (principal / self.period_months) + interest
            balance -= (principal / self.period_months)
            total_payment += payment
        return round(total_payment, 2)

    def approve(self, treasurer):
        if self.status != 'waiting':
            raise ValidationError("Loan already processed.")
        self.status = 'performing'
        self.approved_by = treasurer
        self.date_approved = timezone.now()
        self.save()


class LoanGuarantor(models.Model):
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name='loanguarantor_set')
    guarantor = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.guarantor.username} guarantees Loan {self.loan.id}"


# Signals
@receiver(post_save, sender=User)
def create_user_assets(sender, instance, created, **kwargs):
    if created:
        Balance.objects.create(user=instance)
        EmergencyFund.objects.create(user=instance)


@receiver(post_save, sender=User)
def update_balance_on_user_save(sender, instance, **kwargs):
    if hasattr(instance, 'balance'):
        instance.balance.save()



# RESET PASSWORD
from django.db import models
from django.utils import timezone
from django.conf import settings

class PasswordResetOTP(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return timezone.now() - self.created_at < timezone.timedelta(minutes=10)

    def __str__(self):
        return f"{self.user.username} - {self.otp_code}"
