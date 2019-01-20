from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, Http404
from mapApplication.models import Tour, TourLocation
from django.core import serializers

def index(request):

    tour = Tour.objects.filter(name="Question Guide")[0]
    tourLocations = TourLocation.objects.filter(tour=tour)
    tourText = serializers.serialize('json', tourLocations)

    return render(request, 'index.html', {'locationsText': tourText})
