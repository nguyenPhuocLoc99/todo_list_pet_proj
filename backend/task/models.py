from django.db import models

# Create your models here.
class Task(models.Model):
    task_name = models.CharField(max_length=50, null=False)
    desciption = models.CharField(max_length=500)
    estimate = models.TimeField()
    start_time = models.DateTimeField()
    due_time = models.DateTimeField()

    def __str__(self):
        return self.task_name
