# backend/api/urls.py
from django.urls import path
from .views import RegisterView, LoginView, LogoutView, UserDetailView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('auth/user/', UserDetailView.as_view(), name='auth-user-detail'),
]