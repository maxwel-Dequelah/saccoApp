from rest_framework import serializers
from ..models import User, Transaction, Balance

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'phoneNumber', 'email', 'dob']

# Transaction Serializer
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'date', 'amount']

# Balance Serializer
class BalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Balance
        fields = ['user', 'balance', 'lastEdited']

# SignUp Serializer
class UserSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['phoneNumber', 'email', 'dob', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            phoneNumber=validated_data['phoneNumber'],
            email=validated_data.get('email'),
            dob=validated_data['dob'],
            password=validated_data['password'],
        )
        return user

# Login Serializer
class LoginSerializer(serializers.Serializer):
    phoneNumber = serializers.CharField()
    password = serializers.CharField(write_only=True)
