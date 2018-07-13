from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, Http404
from .models import Point, Map, Tag
from django.forms.models import model_to_dict

def index(request):
    try:
        mp = Map.objects.get(pk=1) # get first map object
        tagObjects = Tag.objects.all().values() # get all tag objects
        queryTagsSelected = []
        queryTags = []

        for tag in tagObjects:
            # add tag to list of tags to be passed to template
            queryTags.append(tag)
            slug = tag['id']
            query = request.GET.get(slug)
            # if tag name is set to false in url
            if query: 
                # add tag to disabled tag list 
                queryTagsSelected.append(tag['name'])

        pointObjects = Point.objects.all()
        pts = []
        colors = {}

        for point in pointObjects:
            numberOfTags = point.tags.count()
            numberOfDisabledTags = 0
            badTags = []
            colors[point.id] = []

            for tag in queryTagsSelected:
                # if the point has a disabled tag, 
                if point.tags.filter(name=tag).exists():
                    numberOfDisabledTags += 1
                    badTags.append(point.tags.filter(name=tag).values()[0]['name'])
            # if the point has at least one non-disabled tag, 
            if numberOfTags > numberOfDisabledTags:
                # add the point to the list to send to template
                pts.append(Point.objects.filter(id=point.id).values()[0])

                for tag in point.tags.all():
                    # if the tag is not disabled
                    if tag.name not in badTags:
                        colors[point.id].append(tag.color) 
    except Map.DoesNotExist:
        # if there is no map, display a service notice
        # TODO: get rid of this 404 and replace with an actual page
        raise Http404("Website under maintenance, check back later")
    return render(request, 'map.html', {'map': mp, 'selections': queryTagsSelected, 'tags': queryTags, 'points': pts, 'pointColors': colors})

def details(request, id):
    pt = get_object_or_404(Point, pk=id)
    images = pt.number_of_images()
    return render(request, 'detail.html', {'point': pt, 'images': range(images)})