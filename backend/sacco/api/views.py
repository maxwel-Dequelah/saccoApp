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
    permission_classes = [IsAdminUser]

# Transaction Views
class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Transaction.objects.all()
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        amount = serializer.validated_data['amount']
        transaction_type = serializer.validated_data['transaction_type']

        try:
            balance_record = Balance.objects.get(user=user)
        except Balance.DoesNotExist:
            raise ValidationError("Balance record not found.")

        if transaction_type == 'withdrawal':
            if balance_record.balance < amount:
                raise ValidationError("Insufficient balance.")
            balance_record.adjust_balance(-amount)
        elif transaction_type == 'deposit':
            balance_record.adjust_balance(amount)

        serializer.save(user=user)

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
        return self.request.user.balance

# Loan Views
class LoanRequestView(generics.CreateAPIView):
    serializer_class = LoanSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, status='pending', request_date=timezone.now())

class LoanListView(generics.ListAPIView):
    serializer_class = LoanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Loan.objects.all()
        return Loan.objects.filter(user=self.request.user)

class LoanApproveView(generics.UpdateAPIView):
    serializer_class = LoanSerializer
    permission_classes = [IsAdminUser]
    queryset = Loan.objects.all()

    def update(self, request, *args, **kwargs):
        loan = self.get_object()
        if loan.status != 'pending':
            return Response({"error": "Loan already processed."}, status=status.HTTP_400_BAD_REQUEST)
        loan.status = 'approved'
        loan.approved_date = timezone.now()
        loan.save()
        return Response(LoanSerializer(loan).data)

# Emergency Fund Views
class EmergencyFundView(generics.CreateAPIView):
    serializer_class = EmergencyFundSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, date_requested=timezone.now())

class EmergencyFundAdminView(generics.ListAPIView):
    serializer_class = EmergencyFundSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return EmergencyFund.objects.all()
