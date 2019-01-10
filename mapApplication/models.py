from django.db import models
from django.core.validators import RegexValidator, ValidationError
from django.utils.deconstruct import deconstructible
from .utils import geo_to_xy
import os
from uuid import uuid4

@deconstructible
class PathRename(object):
    def __init__(self, sub_path):
        self.path = sub_path

    def __call__(self, instance, filename):
        ext = filename.split('.')[-1]
        # get filename
        if instance.pk:
            filename = '{}.{}'.format(instance.pk, ext)
        else:
            # set filename as random string
            filename = '{}.{}'.format(uuid4().hex, ext)
        # return the whole path to the file
        return os.path.join(self.path, filename)

rename0 = PathRename("0/")
rename1 = PathRename("1/")
rename2 = PathRename("2/")
rename3 = PathRename("3/")
rename4 = PathRename("4/")
rename5 = PathRename("5/")

# any point on the map 
class Point(models.Model):

    short_name = models.CharField(max_length=30, unique=True)
    long_name = models.CharField(max_length=100, blank=True)
    slug = models.SlugField(unique=True)
    tags = models.ManyToManyField('mapApplication.Tag')

    short_description = models.TextField(null=True)
    long_description = models.TextField(blank=True)

    latitude = models.DecimalField(null=True, max_digits=9, decimal_places=6)
    longitude = models.DecimalField(null=True, max_digits=9, decimal_places=6)

    main_image = models.ImageField(null=True, upload_to=rename0)

    additional_image1 = models.ImageField(blank=True, null=True, upload_to=rename1)
    additional_caption1 = models.CharField(max_length=100, blank=True)
    additional_image2 = models.ImageField(blank=True, null=True, upload_to=rename2)
    additional_caption2 = models.CharField(max_length=100, blank=True)
    additional_image3 = models.ImageField(blank=True, null=True, upload_to=rename3)
    additional_caption3 = models.CharField(max_length=100, blank=True)
    additional_image4 = models.ImageField(blank=True, null=True, upload_to=rename4)
    additional_caption4 = models.CharField(max_length=100, blank=True)
    additional_image5 = models.ImageField(blank=True, null=True, upload_to=rename5)
    additional_caption5 = models.CharField(max_length=100, blank=True)

    x = models.DecimalField(null=True, max_digits=12, decimal_places=8, blank=True)
    y = models.DecimalField(null=True, max_digits=12, decimal_places=8, blank=True)

    # calculate the x and y position of the point 
    def save(self, *args, **kwargs):
        calculatedCoords = geo_to_xy(self.latitude, self.longitude, Map.objects.first())
        self.x = calculatedCoords['x']
        self.y = calculatedCoords['y']
        super(Point, self).save()
        super().save(*args, **kwargs)

    def number_of_images(self):
        res = []
        for i in range(5):
            value = "additional_image" + str(i + 1)
            if getattr(self, value):
                res.append(getattr(self, value))
        return res

    def __str__(self):
        return self.short_name

# tags denote the type of points 
class Tag(models.Model):

    name = models.CharField(max_length=30, unique=True)
    slug = models.SlugField(unique=True)
    color = models.CharField(max_length=7, unique=True, help_text='Enter a hexadecimal color value', validators=[
        RegexValidator(regex='^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$', message='Value is not a valid hexadecimal color')
        ])

    def __str__(self):
        return self.name

# the main map to be used as a background canvas to draw to
class Map(models.Model):

    image = models.ImageField(null=True, upload_to='maps')

    right_longitude = models.DecimalField(null=True, max_digits=9, decimal_places=6, help_text='The longitude at the right side of the map')
    left_longitude = models.DecimalField(null=True, max_digits=9, decimal_places=6, help_text='The longitude at the left side of the map')
    bottom_latitude = models.DecimalField(null=True, max_digits=9, decimal_places=6, help_text='The latitude at the bottom of the map')

    # on delete, update the points' x and y values in case map changed
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        points = Point.objects.all()
        for point in points:
            point.save(update_fields=['x', 'y'])
        

    # on delete, update the points' x and y values in case map changed
    def delete(self, *args, **kwargs):
        if self.pk != 1:
            points = Point.objects.all()
            for point in points:
                point.save(update_fields=['x', 'y'])
        super().delete(*args, **kwargs)

    def __str__(self):
        return os.path.basename(self.image.name)

# singleton model for about and credits 
class Info(models.Model):

    about = models.TextField(null=True)
    credits = models.TextField(null=True)

    def save(self, *args, **kwargs):
        if Info.objects.exists() and not self.pk:
            raise ValidationError('Please update the original about and credits entry')
        return super(Info, self).save(*args, **kwargs)

    class Meta:
        verbose_name_plural = 'About and Credits'

    def __str__(self):
        return 'About and Credits'


#  model for any kind of tour of the map
class Tour(models.Model):     
    name = models.CharField(max_length=40, null=True)
    locations = models.ManyToManyField('mapApplication.Point',
                                      through='mapApplication.TourLocation')

    def get_locations(self):
        return self.locations.order_by('location_link')

    def __str__(self):
            return self.name

# for each of the locations of the tour
class TourLocation(models.Model):
    text = models.CharField(max_length=150, null=True)
    tour = models.ForeignKey('mapApplication.Tour', on_delete=models.CASCADE)
    location = models.ForeignKey('mapApplication.Point', related_name='location_link', on_delete=models.CASCADE)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ('order',)

    def __str__(self):
            return self.text





