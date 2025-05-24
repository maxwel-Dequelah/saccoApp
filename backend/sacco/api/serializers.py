from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.contrib.auth import authenticate
from ..models import User, Transaction, Balance, EmergencyFund, Loan, LoanGuarantor


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'first_name', 'last_name', 'phoneNumber', 'dob',
            'email', 'is_active', 'is_admin', 'is_approved', 'username', 'is_secretary', 'is_tresurer'
        ]
        read_only_fields = ['id', 'is_admin', 'is_active', 'is_approved','is_secretary', 'is_tresurer']


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
            username=validated_data['phoneNumber'],
            is_active=False,
            is_approved=False
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
            if not user.is_approved:
                raise serializers.ValidationError("Account not approved.")
            if not user.is_active:
                raise serializers.ValidationError("Account not activated.")
        else:
            raise serializers.ValidationError("Must provide both username and password.")
        
        data['user'] = user
        return data


# Transaction Serializer
class TransactionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    transaction_type = serializers.ChoiceField(choices=Transaction.TRANSACTION_TYPES)
    status = serializers.CharField(read_only=True)

    class Meta:
        model = Transaction
        fields = ['id', 'user', 'date', 'amount', 'transaction_type', 'status', 'created_by', 'balance_after']
        read_only_fields = ['status', 'created_by', 'balance_after']

    def validate(self, data):
        user = self.context['request'].user
        data['user'] = user

        if data['transaction_type'] == 'withdrawal':
            if data['amount'] <= 0:
                raise serializers.ValidationError("Withdrawal amount must be positive.")
        elif data['amount'] <= 0:
            raise serializers.ValidationError("Amount must be positive.")

        return data

    def create(self, validated_data):
        request_user = self.context['request'].user
        validated_data['created_by'] = request_user
        validated_data['status'] = 'pending'
        validated_data['balance_after'] = 0  # Will be updated upon approval
        return Transaction.objects.create(**validated_data)


# Balance Serializer
class BalanceSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Balance
        fields = ['user', 'balance', 'lastEdited']


# Emergency Fund Serializer
class EmergencyFundSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = EmergencyFund
        fields = ['user', 'amount']


# Loan Guarantor Serializer
class LoanGuarantorSerializer(serializers.ModelSerializer):
    guarantor = UserSerializer(read_only=True)

    class Meta:
        model = LoanGuarantor
        fields = ['guarantor']


# Loan Serializer
class LoanSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    approved_by = UserSerializer(read_only=True)
    guarantors = LoanGuarantorSerializer(source='loanguarantor_set', many=True, read_only=True)
    total_due = serializers.SerializerMethodField()

    class Meta:
        model = Loan
        fields = [
            'id', 'user', 'amount', 'interest_rate', 'period_months',
            'status', 'approved_by', 'date_requested', 'date_approved',
            'guarantors', 'total_due'
        ]
        read_only_fields = ['status', 'approved_by', 'date_approved', 'total_due']

    def get_total_due(self, obj):
        return obj.calculate_due_amount()

    def validate(self, data):
        if data['amount'] <= 0:
            raise serializers.ValidationError("Loan amount must be positive.")
        return data

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return Loan.objects.create(**validated_data)


# Update Profile Serializer
class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'dob', 'email']
