from django.urls import path
from .api.views import SignUpView, LoginView, AccountView

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('account/', AccountView.as_view(), name='account'),
]
