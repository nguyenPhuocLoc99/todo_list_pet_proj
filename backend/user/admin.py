from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy
from .forms import CustomUserChangeForm, CustomUserCreationForm
from .models import User

# Register your models here.
class UserAdmin(BaseUserAdmin):
    ordering = ('name',)
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User
    list_display = ('login_name', 'name', 'email',)
    list_display_links = ('name',)
    list_filter = ('login_name', 'name', 'email',)
    search_fields = ('name', 'email', 'phone', 'other_contact',)
    fieldsets = (
        (
            gettext_lazy("Login Credentials"), {
                "fields": ("login_name", "pw",)
            }, 
        ),
        (
            gettext_lazy("Personal Information"),
            {
                "fields": ('name', 'phone', 'other_contact',)
            },
        ),
        (
            gettext_lazy("Permissions and Groups"),
            {
                "fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions",)
            },
        ),
        (
            gettext_lazy("Important Dates"),
            {
                "fields": ("last_login",)
            },
        ),
    )
    add_fieldsets = (
            (None, {
                "classes": ("wide",),
                "fields": ("login_name", "email", "password1", "password2", "is_staff", "is_active",),
            },),
        )


admin.site.register(User, UserAdmin)
