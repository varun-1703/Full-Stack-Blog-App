# backend/api/permissions.py
from rest_framework import permissions

class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow authors of an object to edit or delete it.
    Assumes the model instance has an `author` attribute.
    Read operations are allowed for any request (GET, HEAD, OPTIONS).
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS: # SAFE_METHODS = ('GET', 'HEAD', 'OPTIONS')
            return True

        # Write permissions are only allowed to the author of the post.
        # obj is the BlogPost instance here.
        # Ensure request.user is authenticated before checking obj.author
        if not request.user or not request.user.is_authenticated:
            return False
        return obj.author == request.user