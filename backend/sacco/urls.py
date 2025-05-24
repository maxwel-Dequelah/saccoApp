from django.urls import path
from .api.views import (
    RegisterView, LoginView, TransactionListCreateView, BalanceRetrieveUpdateView,
    UpdateProfileView, UserTransactionListView,
    LoanRequestView, LoanListView, LoanApproveView,
    EmergencyFundView, EmergencyFundAdminView, UserListView
)

urlpatterns = [
    # Auth
    path('signup/', RegisterView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),

    # User Profile
    path('users/<str:pk>/update/', UpdateProfileView.as_view(), name='update-profile'),
    path('users/', UserListView.as_view(), name='user-list'),

    # Transactions
    path('transactions/', TransactionListCreateView.as_view(), name='transaction-list-create'),
    path('transactions/user/', UserTransactionListView.as_view(), name='user-transactions'),

    # Balance
    path('balance/', BalanceRetrieveUpdateView.as_view(), name='balance-retrieve-update'),

    # Loans
    path('loans/request/', LoanRequestView.as_view(), name='loan-request'),
    path('loans/', LoanListView.as_view(), name='loan-list'),
    path('loans/<int:pk>/approve/', LoanApproveView.as_view(), name='loan-approve'),

    # Emergency Funds
    path('emergency-fund/', EmergencyFundView.as_view(), name='emergency-fund'),
    path('emergency-fund/admin/', EmergencyFundAdminView.as_view(), name='emergency-fund-admin'),
]
