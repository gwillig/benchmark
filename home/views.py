from django.shortcuts import render
from rest_framework import viewsets
from .serializers import DataSerializer
from .models import Data
import json
from datetime import datetime
from django.views import View
from django.http import HttpResponse, HttpResponseNotFound, JsonResponse
import os
from django.db import connection
import pandas as pd

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


def distinct_notes(request):
    result = list(Data.objects.order_by().values_list('note', flat=True).distinct())

    return JsonResponse({"response": result})


def data_stats(request):
    '#1.Step: Get parameters'
    parameters = json.loads(request.body)
    '#2.Step: Execute query'
    query = f"SELECT * FROM home_data WHERE date BETWEEN '{parameters['start_date']}' AND '{parameters['end_date']}'ORDER BY date"
    df_raw = pd.read_sql_query(query, connection)
    df = df_raw.sort_values(by=['date'], ascending=False)
    '#3.Step: Round to hours'
    df["date_round_hours"] = df["date"].dt.round('H')
    '#.Step: Change float to integer for histogram'
    df = df.astype({'result': 'int'})
    result = {}
    if parameters["key_word"]!="":
        attribute = parameters["key_word"]
        selectedRows = df.loc[df['note'] == attribute]
        result[attribute] = {"stats": selectedRows[["result"]].describe().fillna(0).round(1).to_dict(),
                             "histo_data": selectedRows["result"].value_counts().to_dict(),
                             "date": selectedRows["date"].iloc[0].strftime("%m/%d/%Y, %H:%M:%S")}
    else:
        'Selected rows based on rounded hour and note'
        for attribute in df["note"].unique():
            if attribute not in [""]:
                '1#.Step: Select rows'
                selectedRowsRaw = df.loc[df['note'] == attribute]
                date_round = selectedRowsRaw["date_round_hours"].iloc[0]
                selectedRows = df.loc[(df['note'] == attribute) & (df['date_round_hours'] == date_round)]
                '#.Step: Prepare data for histogram'
                histo_data = selectedRows["result"].value_counts().to_dict()
                for el in range(0,12):
                    if histo_data.get(el) == None:
                        histo_data[el] = 0
                date = selectedRows["date"].iloc[0].strftime("%m/%d/%Y, %H:%M:%S")
                note = selectedRows["note"].iloc[0]+"___"+ date
                result[note] = {"stats": selectedRows[["result"]].describe().fillna(0).round(1).to_dict(),
                                     "count": selectedRows["result"].value_counts().to_dict(),
                                     "histo_data":histo_data,
                                     "date": date}
    return JsonResponse({"response": result})


class Assets(View):

    def get(self, _request, filename):
        path = os.path.join(os.path.dirname(__file__), 'static', filename)

        if os.path.isfile(path):
            with open(path, 'rb') as file:
                return HttpResponse(file.read(), content_type='application/javascript')
        else:
            return HttpResponseNotFound()
