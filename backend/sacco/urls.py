from django.urls import path
from .api.views import RegisterView, LoginView, TransactionListCreateView, BalanceRetrieveUpdateView

urlpatterns = [
    path('signup/', RegisterView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),

    # Transactions
    path('transactions/', TransactionListCreateView.as_view(), name='transaction-list-create'),  # List and create transactions

    # Balance
    path('balance/', BalanceRetrieveUpdateView.as_view(), name='balance-retrieve-update'),  # Retrieve and update balance
]
