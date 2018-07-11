from django.db import models
from django.core.validators import RegexValidator, ValidationError
import os

# any point on the map 
class Point(models.Model):

    short_name = models.CharField(max_length=30, unique=True)
    long_name = models.CharField(max_length=100, blank=True)
    id = models.SlugField(unique=True, primary_key=True)
    tags = models.ManyToManyField('mapApplication.Tag')

    short_description = models.TextField(null=True)
    long_description = models.TextField(blank=True)

    latitude = models.DecimalField(null=True, max_digits=9, decimal_places=6)
    longitude = models.DecimalField(null=True, max_digits=9, decimal_places=6)

    main_image = models.ImageField(null=True, upload_to='mainImages')

    additional_image1 = models.ImageField(blank=True, null=True, upload_to='otherImages')
    additional_image2 = models.ImageField(blank=True, null=True, upload_to='otherImages')
    additional_image3 = models.ImageField(blank=True, null=True, upload_to='otherImages')
    additional_image4 = models.ImageField(blank=True, null=True, upload_to='otherImages')
    additional_image5 = models.ImageField(blank=True, null=True, upload_to='otherImages')

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


    def __str__(self):
        return os.path.basename(self.image.name)