from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken  # JWT Token
from rest_framework.exceptions import ValidationError
from ..models import User, Transaction, Balance
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, TransactionSerializer, BalanceSerializer

# Helper function to generate JWT tokens
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# Register View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # No token generated here. User needs to log in separately.
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
        
        # Generate JWT token
        tokens = get_tokens_for_user(user)
        
        return Response({
            "tokens": tokens,
            "user": UserSerializer(user).data
        }, status=status.HTTP_200_OK)

# Transaction List/Create View
class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # If the user is an admin, return all transactions
        if user.is_staff:
            return Transaction.objects.all()
        # Otherwise, return only the transactions for the authenticated user
        return Transaction.objects.filter(user=user)

    def perform_create(self, serializer):
        user = self.request.user
        amount = serializer.validated_data['amount']
        transaction_type = serializer.validated_data['transaction_type']

        # Get the user's balance record
        try:
            balance_record = Balance.objects.get(user=user)
        except Balance.DoesNotExist:
            raise ValidationError("User balance record not found.")

        # Handle balance check and update before saving the transaction
        if transaction_type == 'withdrawal':
            if balance_record.balance < amount:
                raise ValidationError("Insufficient balance for this withdrawal.")
            balance_record.adjust_balance(-amount)  # Subtract from balance
        elif transaction_type == 'deposit':
            balance_record.adjust_balance(amount)  # Add to balance

        # Save the transaction with the user info
        serializer.save(user=user)

# Balance Retrieve/Update View
class BalanceRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Balance.objects.all()
    serializer_class = BalanceSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
               
        return self.request.user.balance
