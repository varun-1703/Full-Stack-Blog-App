# backend/api/urls.py
from django.urls import path, include
from .views import RegisterView, LoginView, LogoutView, UserDetailView
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, LoginView, LogoutView, UserDetailView,
    BlogPostViewSet # <-- Add this
)

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'blogs', BlogPostViewSet, basename='blogpost')
# 'blogs' will be the base URL segment (e.g., /api/blogs/, /api/blogs/{id}/)
# basename is used to generate URL names if not automatically inferred from queryset.

urlpatterns = [
    # Auth endpoints
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('auth/user/', UserDetailView.as_view(), name='auth-user-detail'),

    # Blog post endpoints (registered via the router)
    path('', include(router.urls)), # Include the router-generated URLs
]

