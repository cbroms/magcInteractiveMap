from django.db import models
from django.core.validators import RegexValidator, ValidationError
from .utils import geo_to_xy
import os
from uuid import uuid4

# any point on the map 
class Point(models.Model):

    def get_image_path(path):
        def wrapper(instance, filename):
            ext = filename.split('.')[-1]
            # get filename
            if instance.pk:
                filename = '{}.{}'.format(instance.pk, ext)
            else:
                # set filename as random string
                filename = '{}.{}'.format(uuid4().hex, ext)
            # return the whole path to the file
            return os.path.join(path, filename)
        return wrapper

    short_name = models.CharField(max_length=30, unique=True)
    long_name = models.CharField(max_length=100, blank=True)
    id = models.SlugField(unique=True, primary_key=True)
    tags = models.ManyToManyField('mapApplication.Tag')

    short_description = models.TextField(null=True)
    long_description = models.TextField(blank=True)

    latitude = models.DecimalField(null=True, max_digits=9, decimal_places=6)
    longitude = models.DecimalField(null=True, max_digits=9, decimal_places=6)

    main_image = models.ImageField(null=True, upload_to=get_image_path('0/'))

    additional_image1 = models.ImageField(blank=True, null=True, upload_to=get_image_path('1/'))
    additional_image2 = models.ImageField(blank=True, null=True, upload_to=get_image_path('2/'))
    additional_image3 = models.ImageField(blank=True, null=True, upload_to=get_image_path('3/'))
    additional_image4 = models.ImageField(blank=True, null=True, upload_to=get_image_path('4/'))
    additional_image5 = models.ImageField(blank=True, null=True, upload_to=get_image_path('5/'))

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
        res = 0
        for i in range(5):
            value = "additional_image" + str(i + 1)
            if getattr(self, value):
                res += 1
        return res

    def __str__(self):
        return self.short_name

# tags denote the type of points 
class Tag(models.Model):

    name = models.CharField(max_length=30, unique=True)
    id = models.SlugField(unique=True, primary_key=True)
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