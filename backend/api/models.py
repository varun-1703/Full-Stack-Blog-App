# backend/api/models.py
from django.db import models
from django.contrib.auth.models import User # To link blog posts to authors

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_posts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # published_at = models.DateTimeField(null=True, blank=True) # Optional: if you want a separate publishing step/date

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at'] # Default ordering for blog posts (newest first)