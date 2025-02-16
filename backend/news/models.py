from django.db import models

# Create your models here.
class News(models.Model):
    title = models.CharField(max_length=255, unique=True)
    url = models.URLField()
    img_url = models.URLField()
    published_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title