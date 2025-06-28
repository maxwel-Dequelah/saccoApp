from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.contrib.auth import authenticate
from ..models import User, Transaction, Balance, EmergencyFund, Loan, LoanGuarantor, PasswordResetOTP


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
        fields = '__all__'
        read_only_fields = ['status', 'created_by', 'balance_after']

    def validate(self, data):
        print(data)     
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
        validated_data['user'] = validated_data['user']
        validated_data['balance_after'] = 0  # Will be updated upon approval
        return Transaction.objects.create(**validated_data)


# 🔄 NEW Serializer to Approve Transaction and Update Balance
class TransactionStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['status']

    def update(self, instance, validated_data):
        new_status = validated_data.get('status')
        if new_status == 'approved' and instance.status != 'approved':
            instance.approve()
        else:
            raise serializers.ValidationError("Only transition to 'approved' is supported.")
        return instance


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






class PasswordResetRequestSerializer(serializers.Serializer):
    phone = serializers.CharField()

    def validate_phone(self, value):
        try:
            user = User.objects.get(phoneNumber=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this phone number does not exist.")
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    phone = serializers.CharField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(min_length=6)

    def validate(self, data):
        phone = data.get("phone")
        otp = data.get("otp")
        try:
            user = User.objects.get(phoneNumber=phone)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")

        try:
            otp_obj = PasswordResetOTP.objects.filter(user=user, code=otp).latest("created_at")
        except PasswordResetOTP.DoesNotExist:
            raise serializers.ValidationError("Invalid OTP.")

        if otp_obj.is_expired():
            raise serializers.ValidationError("OTP has expired.")

        data["user"] = user
        data["otp_obj"] = otp_obj
        return data