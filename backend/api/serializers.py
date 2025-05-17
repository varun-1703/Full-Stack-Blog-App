# backend/api/serializers.py

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.authtoken.models import Token

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User object including token for authenticated responses.
    """
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        # We don't include 'password' for security reasons when retrieving user data.

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    Handles creation of a new user and ensures password is write-only.
    """
    # Ensure password is not readable and required for registration.
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    # We can add password confirmation if needed:
    # password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})


    class Meta:
        model = User
        # 'username' is often used as the primary login field in Django.
        # 'email' can also be used or made unique.
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
        }

    def validate(self, attrs):
        # Example for password confirmation:
        # if attrs['password'] != attrs['password2']:
        #     raise serializers.ValidationError({"password": "Password fields didn't match."})

        # Validate unique email if you want email to be the primary identifier or unique
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Email already in use."})
        if User.objects.filter(username=attrs['username']).exists():
             raise serializers.ValidationError({"username": "Username already in use."})
        return attrs

    def create(self, validated_data):
        # validated_data.pop('password2', None) # Remove password2 if using confirmation
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'], # create_user handles hashing
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        # Token.objects.create(user=user) # Optionally create token upon registration
        return user

class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    Takes username and password, returns user data and token upon successful authentication.
    """
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})
    token = serializers.CharField(read_only=True)
    user = UserSerializer(read_only=True) # To include user details in login response

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(request=self.context.get('request'), username=username, password=password)
            if not user:
                msg = 'Unable to log in with provided credentials.'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Must include "username" and "password".'
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user_obj'] = user # Store authenticated user object to be used later
        return attrs

    def to_representation(self, instance):
        # This method is called when serializing the validated data back to the client
        # 'instance' here is the validated_data dictionary from validate method
        user_obj = instance.get('user_obj')
        token, created = Token.objects.get_or_create(user=user_obj)
        return {
            'token': token.key,
            'user': UserSerializer(user_obj, context=self.context).data
        }