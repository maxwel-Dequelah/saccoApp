from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView
from ..models import User, Transaction, Balance
from .serializers import UserSerializer, TransactionSerializer, BalanceSerializer, UserSignUpSerializer, LoginSerializer

# Sign Up View
class SignUpView(APIView):
    def post(self, request):
        serializer = UserSignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login View
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            phoneNumber = serializer.validated_data['phoneNumber']
            password = serializer.validated_data['password']
            user = authenticate(phoneNumber=phoneNumber, password=password)
            if user is not None:
                return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Account Records View
class AccountView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get(self, request):
        user = request.user
        transactions = Transaction.objects.filter(user=user).order_by('-date')
        last_transaction = transactions.first()
        balance = Balance.objects.get(user=user)

        return Response({
            'user': UserSerializer(user).data,
            'last_transaction': TransactionSerializer(last_transaction).data if last_transaction else None,
            'balance': BalanceSerializer(balance).data,
        }, status=status.HTTP_200_OK)
