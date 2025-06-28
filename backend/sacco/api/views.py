from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone

from ..models import User, Transaction, Balance, Loan, EmergencyFund
from .serializers import (
    RegisterSerializer, LoginSerializer, UserSerializer, UpdateProfileSerializer,
    TransactionSerializer, BalanceSerializer,
    LoanSerializer,
    EmergencyFundSerializer
)

# Helper for token generation
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# Registration View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user).data,
            "message": "User registered successfully. Please log in."
        }, status=status.HTTP_201_CREATED)

# Login View
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        tokens = get_tokens_for_user(user)
        return Response({
            "tokens": tokens,
            "user": UserSerializer(user).data
        })

# Profile Update
class UpdateProfileView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UpdateProfileSerializer

    def put(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            if user != request.user:
                return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
            serializer = self.get_serializer(user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

# User List View (Admin Only)
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

# Transaction List View (Admin or User)
class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_tresurer:  # your model has is_admin flag too
            return Transaction.objects.all().order_by('-date')
        return Transaction.objects.filter(user=user).order_by('-date')

# Transaction Create View
class TransactionCreateView(generics.CreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = User.objects.get(id=self.request.data.get('user'))
        serializer.save(user=user, status='pending')  # Save with pending status only


class TransactionUpdateView(generics.UpdateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAdminUser]

    def update(self, request, *args, **kwargs):
        transaction = self.get_object()

        if transaction.status == 'approved':
            return Response({"error": "Transaction already approved."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            balance_record = Balance.objects.get(user=transaction.user)
        except Balance.DoesNotExist:
            raise ValidationError("Balance record not found.")

        if transaction.transaction_type == 'withdrawal':
            if balance_record.balance < transaction.amount:
                raise ValidationError("Insufficient balance.")
            balance_record.adjust_balance(-transaction.amount)

        elif transaction.transaction_type == 'deposit':
            balance_record.adjust_balance(transaction.amount)

        elif transaction.transaction_type == 'emergency':
            fund, _ = EmergencyFund.objects.get_or_create(user=transaction.user)
            fund.amount += transaction.amount
            fund.save()
            balance_record.adjust_balance(-transaction.amount)

        else:
            raise ValidationError("Invalid transaction type.")

        transaction.status = 'approved'
        transaction.balance_after = balance_record.balance
        transaction.save()

        return Response(TransactionSerializer(transaction).data)

# Current User's Transactions Only
class UserTransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by('-date')

# Balance View
class BalanceRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = BalanceSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Assumes Balance object always exists due to signals
        return self.request.user.balance

# Loan Views
class LoanRequestView(generics.CreateAPIView):
    serializer_class = LoanSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, status='waiting', date_requested=timezone.now())

class LoanListView(generics.ListAPIView):
    serializer_class = LoanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_admin:
            return Loan.objects.all().order_by('-date_requested')
        return Loan.objects.filter(user=user).order_by('-date_requested')

class LoanApproveView(generics.UpdateAPIView):
    serializer_class = LoanSerializer
    permission_classes = [IsAdminUser]
    queryset = Loan.objects.all()

    def update(self, request, *args, **kwargs):
        loan = self.get_object()
        if loan.status != 'waiting':
            return Response({"error": "Loan already processed."}, status=status.HTTP_400_BAD_REQUEST)
        loan.status = 'performing'
        loan.date_approved = timezone.now()
        loan.approved_by = request.user
        loan.save()
        return Response(LoanSerializer(loan).data)

# Emergency Fund Views
class EmergencyFundView(generics.CreateAPIView):
    serializer_class = EmergencyFundSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Assuming emergency fund requests can be created here
        serializer.save(user=self.request.user)

class EmergencyFundAdminView(generics.ListAPIView):
    serializer_class = EmergencyFundSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return EmergencyFund.objects.all()






from ..models import PasswordResetOTP
from .serializers import PasswordResetRequestSerializer, PasswordResetConfirmSerializer



class PasswordResetRequestView(generics.CreateAPIView):
    serializer_class = PasswordResetRequestSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone = serializer.validated_data["phone"]
        user = User.objects.get(phoneNumber=phone)
        code = str(random.randint(100000, 999999))

        PasswordResetOTP.objects.create(user=user, code=code)

        full_number = f"+254{phone[-9:]}"
        try:
            pywhatkit.sendwhatmsg_instantly(full_number, f"Your OTP is: {code}", wait_time=5, tab_close=True)
        except Exception as e:
            print("WhatsApp error:", e)

        return Response({"message": "OTP sent successfully"}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(generics.CreateAPIView):
    serializer_class = PasswordResetConfirmSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        otp_obj = serializer.validated_data["otp_obj"]
        new_password = serializer.validated_data["new_password"]

        user.set_password(new_password)
        user.save()
        otp_obj.delete()

        return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)