from django.urls import path
from .api.views import (
    RegisterView, LoginView,
    UpdateProfileView, UserListView,
    TransactionListView, TransactionCreateView, UserTransactionListView,
    BalanceRetrieveUpdateView,
    LoanRequestView, LoanListView, LoanApproveView,
    EmergencyFundView, EmergencyFundAdminView,
    TransactionUpdateView,
    PasswordResetRequestView, PasswordResetConfirmView
)

urlpatterns = [
    # Authentication
    path('signup/', RegisterView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),

    # User Profile & List
    path('users/<str:pk>/update/', UpdateProfileView.as_view(), name='update-profile'),
    path('users/', UserListView.as_view(), name='user-list'),

    # Transactions
    path('transactions/', TransactionListView.as_view(), name='transaction-list'),
    path('transactions/create/', TransactionCreateView.as_view(), name='transaction-create'),
    path('transactions/my/', UserTransactionListView.as_view(), name='user-transactions'),
    path('transactions/<str:pk>/approve/', TransactionUpdateView.as_view(), name = 'approve transuction'),

    # Balance
    path('balance/', BalanceRetrieveUpdateView.as_view(), name='balance'),

    # Loans
    path('loans/request/', LoanRequestView.as_view(), name='loan-request'),
    path('loans/', LoanListView.as_view(), name='loan-list'),
    path('loans/<int:pk>/approve/', LoanApproveView.as_view(), name='loan-approve'),

    # Emergency Funds
    path('emergency-funds/request/', EmergencyFundView.as_view(), name='emergency-fund-request'),
    path('emergency-funds/admin/', EmergencyFundAdminView.as_view(), name='emergency-fund-admin'),
    path('api/passwordreset/', PasswordResetRequestView.as_view(), name="request-password-reset-otp"),
    path("api/password-reset/confirm/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
]
