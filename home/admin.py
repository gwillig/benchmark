from django.contrib import admin
from home.models import Data


class DataAdmin(admin.ModelAdmin):
    list_display = ['game', 'date', 'note', 'result']


admin.site.register(Data,DataAdmin)
