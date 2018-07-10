from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, Http404
from .models import Point, Map, Tag

def index(request):
    try:
        mp = Map.objects.get(pk=1) # get first map object
        # query tags in url like /map/?dogs=True&cats=True&historic-buildings=True
        tagObjects = Tag.objects.all().values() # get all tag objects
        queryTags = []
        for tag in tagObjects:
            slug = tag['id']
            query = request.GET.get(slug)
            # if tag name is set to true in url
            if query: 
                queryTags.append(slug)
    except Map.DoesNotExist:
        # if there is no map, display a service notice
        # TODO: get rid of this 404 and replace with an actual page
        raise Http404("Website under maintenance, check back later")
    return render(request, 'map.html', {'map': mp, 'selections': queryTags})

def details(request, id):
    pt = get_object_or_404(Point, pk=id)
    return render(request, 'detail.html', {'point': pt})