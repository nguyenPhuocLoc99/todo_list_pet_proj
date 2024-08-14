from django.shortcuts import render
from rest_framework import viewsets
from . import serializer
from . import models

# Create your views here.
class TaskViewSet(viewsets.ModelViewSet):
    queryset = models.Task.objects.all()
    serializer_class = serializer.TaskSerializer
