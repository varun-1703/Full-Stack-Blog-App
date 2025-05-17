from django.shortcuts import render
# backend/api/views.py

from django.contrib.auth.models import User
from django.contrib.auth import logout as django_logout

from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token

from .serializers import UserSerializer, RegisterSerializer, LoginSerializer

class RegisterView(generics.CreateAPIView):
    """
    API endpoint for user registration.
    Uses RegisterSerializer to handle user creation.
    Allows any user (unauthenticated) to access this endpoint.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny] # No authentication required to register

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save() # This calls serializer.create()
        token, created = Token.objects.get_or_create(user=user) # Create token for new user
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token.key,
            "message": "User registered successfully."
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """
    API endpoint for user login.
    Uses LoginSerializer to validate credentials and return a token.
    Allows any user (unauthenticated) to access this endpoint.
    """
    permission_classes = [permissions.AllowAny] # No authentication required to log in

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        # The validated data from LoginSerializer already contains token and user details
        # due to its custom to_representation method
        return Response(serializer.data, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """
    API endpoint for user logout.
    Requires token authentication. Deletes the user's token.
    """
    permission_classes = [permissions.IsAuthenticated] # Only authenticated users can logout

    def post(self, request, *args, **kwargs):
        try:
            # Delete the token to invalidate it
            request.user.auth_token.delete()
        except (AttributeError, Token.DoesNotExist):
            # Handle cases where token might not exist or user is not properly authenticated
            # This might happen if the token was already deleted or if an invalid token was sent
            pass # Silently pass, or return a specific message if preferred
        
        # django_logout(request) # If using Django sessions alongside tokens, you might logout from sessions too.
                               # For pure token auth, deleting the token is usually sufficient.

        return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)


class UserDetailView(generics.RetrieveAPIView):
    """
    API endpoint to retrieve details of the currently authenticated user.
    Requires token authentication.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated] # Only authenticated users can access

    def get_object(self):
        # Returns the current authenticated user making the request
        return self.request.user
