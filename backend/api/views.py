from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import logout as django_logout
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, BlogPostSerializer 
from rest_framework import viewsets 
from .models import BlogPost 
from .permissions import IsAuthorOrReadOnly 

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
    
class BlogPostViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows blog posts to be viewed or edited.
    - List and Detail views are public (read-only for unauthenticated).
    - Create requires authentication.
    - Update and Delete require authentication and user to be the author.
    """
    queryset = BlogPost.objects.all() # Defines the default set of objects for the ViewSet
    serializer_class = BlogPostSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly] # Basic: auth for write, anyone for read

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        - For 'create', require IsAuthenticated.
        - For 'update', 'partial_update', 'destroy', require IsAuthorOrReadOnly.
        - For 'list', 'retrieve', allow IsAuthenticatedOrReadOnly (or AllowAny for fully public reads).
        """
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthorOrReadOnly]
        else: # 'list', 'retrieve'
            permission_classes = [permissions.AllowAny] # Make list and detail viewable by everyone
            # Or use [permissions.IsAuthenticatedOrReadOnly] if you want unauth users to only read,
            # and auth users to potentially do more based on object permissions.
            # For this assignment, "viewable by everyone" suggests AllowAny for list/retrieve.
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        """
        Overrides the default create behavior to automatically set the author
        to the currently logged-in user.
        """
        if self.request.user.is_authenticated:
            serializer.save(author=self.request.user)
        else:
            # This case should ideally be prevented by get_permissions,
            # but as a safeguard:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You must be logged in to create a blog post.")

    # Optional: If you want to filter posts by author for a "my posts" endpoint,
    # you could add a custom action or filter backend.
    # For now, the list view shows all posts.
