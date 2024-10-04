from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.contrib.auth import authenticate
from ..models import User, Transaction, Balance

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'phoneNumber', 'dob', 'email', 'is_active', 'is_admin', 'username']
        read_only_fields = ['is_admin', 'id']

# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phoneNumber', 'dob', 'email', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(
            phoneNumber=validated_data['phoneNumber'],
            dob=validated_data['dob'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data.get('email'),
            username=validated_data['phoneNumber']
        )
        user.set_password(password)
        user.save()
        return user

# Login Serializer
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        if username and password:
            user = authenticate(username=username, password=password)
            if user is None:
                raise serializers.ValidationError("Invalid username or password.")
        else:
            raise serializers.ValidationError("Must provide both username and password.")
        
        data['user'] = user
        return data

# Transaction Serializer
class TransactionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    transaction_type = serializers.ChoiceField(choices=[('deposit', 'Deposit'), ('withdrawal', 'Withdrawal')])

    class Meta:
        model = Transaction
        fields = ['id', 'user', 'date', 'amount', 'transaction_type']

    def validate(self, data):
        """Validate the transaction and ensure balance rules are followed."""
        user = self.context['request'].user
        balance_record = Balance.objects.get(user=user)

        amount = data['amount']
        transaction_type = data['transaction_type']

        if transaction_type == 'withdrawal':
            if amount <= 0:
                raise serializers.ValidationError("Withdrawal amount must be positive.")
            if balance_record.balance < amount:
                raise serializers.ValidationError("Insufficient funds: Cannot have a balance below zero.")
            data['amount'] = -amount  # Withdrawal is negative

        elif transaction_type == 'deposit':
            if amount <= 0:
                raise serializers.ValidationError("Deposit amount must be positive.")

        data['user'] = user
        return data

    def create(self, validated_data):
        """Adjust the balance and save the transaction."""
        user = validated_data['user']
        amount = validated_data['amount']
        balance_record = Balance.objects.get(user=user)

        # Adjust balance based on transaction type
        balance_record.balance += amount
        if balance_record.balance < 0:
            raise ValidationError("Transaction cannot proceed: Balance would go below zero.")

        # Save balance and transaction
        balance_record.save()
        transaction = Transaction.objects.create(**validated_data)
        return transaction

# Balance Serializer
class BalanceSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Balance
        fields = ['user', 'balance', 'lastEdited']
