import email
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy
from .manager import CustomUserManager

# Create your models here.
class User(AbstractBaseUser, PermissionsMixin):
    login_name = models.CharField(gettext_lazy('Login name'), max_length=30, unique=True)
    name = models.CharField(gettext_lazy('Name'), max_length=50)
    email = models.EmailField(gettext_lazy('Email address'), max_length=50)
    phone = models.IntegerField(null=True)
    other_contact = models.CharField(gettext_lazy('Other contact'), max_length=50, null=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)

    USERNAME_FIELD = 'login_name'
    REQUIRED_FIELDS = ['name', 'email']

    objects = CustomUserManager()

    class Meta:
        verbose_name = gettext_lazy('User')
        verbose_name_plural = gettext_lazy('Users')

    def __str__(self):
        return self.login_name
