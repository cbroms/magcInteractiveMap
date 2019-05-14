from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, Http404
from mapApplication.models import Tour, TourLocation, Point
from django.core import serializers

def index(request):

    tour = Tour.objects.filter(name="Question Guide")[0]
    tourLocations = TourLocation.objects.filter(tour=tour)
    tourText = serializers.serialize('json', tourLocations)

    return render(request, 'index.html', {'locationsText': tourText})


def redirect_to_detail(request, id):

    point = Point.objects.filter(pk=id)[0]

    response = redirect('/map/details/' + point.slug)
    return response