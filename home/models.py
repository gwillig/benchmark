from django.db import models

# Create your models here.

class Data(models.Model):
    date = models.DateTimeField()
    note = models.TextField(blank=True)
    result = models.FloatField()
    game = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.game}  - { self.result} - {self.date.strftime("%m/%d/%Y, %H:%M:%S")}'