from django.shortcuts import render
from rest_framework import viewsets
from .serializers import DataSerializer
from .models import Data
import json
from datetime import datetime
from django.views import View
from django.http import HttpResponse, HttpResponseNotFound
import os
# The viewsets base class provides the implementation for CRUD operations by default,
# what we had to do was specify the serializer class and the query set.


class DataView(viewsets.ModelViewSet):
    serializer_class = DataSerializer
    queryset = Data.objects.all()


def post_data(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    result = Data(date=datetime.strptime(body["date"], "%a, %d %b %Y %H:%M:%S %Z") ,
                  note=body["note"],
                  game=body["game"],
                  result=body["result"]
                  )
    result.save()
    return HttpResponse("Result saved ")

def unique_notes(request):
    result = list(Data.objects.order_by().values_list('note', flat=True).distinct())
    pass

class Assets(View):

    def get(self, _request, filename):
        path = os.path.join(os.path.dirname(__file__), 'static', filename)

        if os.path.isfile(path):
            with open(path, 'rb') as file:
                return HttpResponse(file.read(), content_type='application/javascript')
        else:
            return HttpResponseNotFound()
