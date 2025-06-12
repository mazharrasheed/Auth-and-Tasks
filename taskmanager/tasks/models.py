from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)

class SoftDeleteModel(models.Model):
    is_deleted = models.BooleanField(default=False)

    filtered = SoftDeleteManager()
    objects = models.Manager()

    class Meta:
        abstract = True

    def delete(self):
        self.is_deleted = True
        self.save()

    def hard_delete(self):
        super().delete()



class Task(SoftDeleteModel):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
