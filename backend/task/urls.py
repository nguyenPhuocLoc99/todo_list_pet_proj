from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register('task', views.TaskViewSet, basename='task')

urlpatterns = []
urlpatterns += router.urls
