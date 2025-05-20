# backend/blog_project/settings.py

import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env file in the backend root (BASE_DIR)
# This is primarily for local development. On Render, variables are set in the dashboard.
dotenv_path = BASE_DIR / '.env'
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

# --- Core Settings ---
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')

# DEBUG mode
# On Render, the 'RENDER' environment variable is automatically set.
# For local development, rely on the .env file or default to True if not set.
if 'RENDER' in os.environ:
    DEBUG = False
else:
    DEBUG = os.environ.get('DEBUG', 'True') == 'True'


ALLOWED_HOSTS = []
RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
if RENDER_EXTERNAL_HOSTNAME:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)

# Add local hosts for development if not on Render (useful if DEBUG is False locally)
if 'RENDER' not in os.environ:
    ALLOWED_HOSTS.extend(['localhost', '127.0.0.1'])
# Note: Your deployed frontend URL will be added to CORS_ALLOWED_ORIGINS and CSRF_TRUSTED_ORIGINS


# --- Application Definition ---
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles', # For collectstatic

    # Third-party apps
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    # Your apps
    'api.apps.ApiConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # Correct placement for WhiteNoise
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'blog_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [], # Add 'os.path.join(BASE_DIR, 'templates')' if you have project-level templates
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'blog_project.wsgi.application'


# --- Database ---
# https://docs.djangoproject.com/en/stable/ref/settings/#databases
# On Render, DATABASE_URL is provided. For local, use .env variables.
if 'DATABASE_URL' in os.environ and os.environ['DATABASE_URL']:
    DATABASES = {
        'default': dj_database_url.config(
            conn_max_age=600, # Optional: Number of seconds database connections should persist
            ssl_require=True if 'RENDER' in os.environ else False # Enforce SSL on Render
        )
    }
else: # Local development fallback using .env variables
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('DB_NAME', 'blog_app_db'),
            'USER': os.environ.get('DB_USER', 'blog_app_user'),
            'PASSWORD': os.environ.get('DB_PASSWORD', 'your_actual_local_db_password'),
            'HOST': os.environ.get('DB_HOST', 'localhost'),
            'PORT': os.environ.get('DB_PORT', '5432'),
        }
    }


# --- Password Validation ---
# https://docs.djangoproject.com/en/stable/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# --- Internationalization ---
# https://docs.djangoproject.com/en/stable/topics/i18n/
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True # Recommended to keep True for timezone-aware datetimes


# --- Static files (CSS, JavaScript, Images) ---
# https://docs.djangoproject.com/en/stable/howto/static-files/
STATIC_URL = '/static/'
# This is where Django will look for static files in development (within each app's 'static' folder)
# STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')] # If you have project-level static files

# This is where 'collectstatic' will gather all static files for production.
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles_build', 'static')

# Use WhiteNoise for serving static files in production.
# The 'whitenoise.storage.CompressedManifestStaticFilesStorage' handles compression and caching.
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'


# --- Media files (User-uploaded content) ---
# Not used in this project scope, but good to know where it would go.
# MEDIA_URL = '/media/'
# MEDIA_ROOT = os.path.join(BASE_DIR, 'mediafiles')


# --- Default primary key field type ---
# https://docs.djangoproject.com/en/stable/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# --- Django REST Framework Settings ---
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        # Default to AllowAny; specific views will override this.
        'rest_framework.permissions.AllowAny',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10, # Number of items per page for paginated results
}


# --- CORS (Cross-Origin Resource Sharing) Settings ---
# The DEPLOYED_FRONTEND_URL environment variable should be set on Render
# to the full URL of your deployed frontend (e.g., https://your-frontend.onrender.com)
DEPLOYED_FRONTEND_URL = os.environ.get('DEPLOYED_FRONTEND_URL')

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",    # Local Vite dev (React)
    "http://127.0.0.1:5173",
]
if DEPLOYED_FRONTEND_URL:
    CORS_ALLOWED_ORIGINS.append(DEPLOYED_FRONTEND_URL)

# If you allow credentials, you might not need CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True # Important if your frontend sends cookies or auth headers


# --- CSRF (Cross-Site Request Forgery) Settings ---
CSRF_TRUSTED_ORIGINS = []
if RENDER_EXTERNAL_HOSTNAME: # The backend's own domain on Render
    CSRF_TRUSTED_ORIGINS.append(f'https://{RENDER_EXTERNAL_HOSTNAME}')
if DEPLOYED_FRONTEND_URL: # Your deployed frontend domain
    CSRF_TRUSTED_ORIGINS.append(DEPLOYED_FRONTEND_URL)

# For local development when DEBUG=False or using HTTPS locally (less common for this setup)
if 'RENDER' not in os.environ:
     CSRF_TRUSTED_ORIGINS.extend([
         'http://localhost:5173',
         'http://127.0.0.1:5173',
     ])

# If using session authentication primarily (not just token auth for API)
# SESSION_COOKIE_SECURE = True if 'RENDER' in os.environ else False
# CSRF_COOKIE_SECURE = True if 'RENDER' in os.environ else False
# SESSION_COOKIE_SAMESITE = 'Lax' # Or 'Strict' or 'None' if needed for cross-site scenarios (requires Secure)

# Ensure logging is configured, especially for production
# (Django's default logging is usually okay for starters, but can be customized)
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO' if 'RENDER' in os.environ else 'DEBUG', # More verbose locally
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
            'propagate': False,
        },
    },
}