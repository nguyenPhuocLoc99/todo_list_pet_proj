from pickletools import read_uint1
from django.contrib.auth.base_user import BaseUserManager
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy


class CustomUserManager(BaseUserManager):

    def email_validator(self, email):
        try:
            validate_email(email)
        except ValidationError:
            raise ValueError(gettext_lazy('You must provide a valid email'))
        
    def create_user(self, login_name, password, name, email, phone, other_contact, **extra_fields):
        if not login_name:
            raise ValueError(gettext_lazy('User must submit a login name'))
        if not name:
            raise ValueError(gettext_lazy('User must submit a name'))
        
        if email:
            email = self.normalize_email(email)
            self.email_validator(email)
        else:
            raise ValueError(gettext_lazy('Base User: and email is required'))
        
        user = self.model(
            login_name=login_name,
            name=name,
            email=email,
            **extra_fields
        )

        user.set_password(password)
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        user.save(using=self._db)

        return user
    
    def create_superuser(self, login_name, password, name, email, phone=None, other_contact=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError(gettext_lazy('Superusers must have is_superuser=True'))
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError(gettext_lazy('Superusers must have is_staff=True'))
        
        if not password:
            raise ValueError(gettext_lazy('Superusers must have password'))
        
        if email:
            email = self.normalize_email(email)
            self.email_validator(email)
        else:
            raise ValueError(gettext_lazy('Admin User: and email is required'))
        
        user = self.create_user(login_name, password, name, email, phone, other_contact, **extra_fields)
        user.save(using=self._db)
        return user
