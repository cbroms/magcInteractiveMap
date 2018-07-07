from django.db import models
from django.core.validators import RegexValidator

# any point on the map 
class Point(models.Model):
    # short name used for places where we can't display too much text
    short_name = models.CharField(max_length=30, unique=True)
    # long name used for all other places (optional)
    long_name = models.CharField(max_length=100, blank=True)
    # tags from tag model (requires at least one to be selected)
    tags = models.ManyToManyField('mapApplication.Tag')
    # summary of the point 
    short_description = models.TextField(null=True)
    # longer description of the point (optional)
    long_description = models.TextField(blank=True)
    # lat and long 
    latitude = models.DecimalField(null=True, max_digits=9, decimal_places=6)
    longitude = models.DecimalField(null=True, max_digits=9, decimal_places=6)
    # main image 
    main_image = models.ImageField(null=True, upload_to='mainImages')
    # additional images 
    additional_image1 = models.ImageField(blank=True, null=True, upload_to='otherImages')
    additional_image2 = models.ImageField(blank=True, null=True, upload_to='otherImages')
    additional_image3 = models.ImageField(blank=True, null=True, upload_to='otherImages')
    additional_image4 = models.ImageField(blank=True, null=True, upload_to='otherImages')
    additional_image5 = models.ImageField(blank=True, null=True, upload_to='otherImages')

    class Meta:
        verbose_name_plural='points'

    def __str__(self):
        return self.short_name

# tags denote the type of points 
class Tag(models.Model):
    # name of the tag
    name = models.CharField(max_length=30, unique=True)
    # hexadecimal color that represents the tag on the map
    color = models.CharField(max_length=7, unique=True, help_text='Enter a hexadecimal color value', validators=[
        RegexValidator(regex='^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$', message='Value is not a valid hexadecimal color')
        ])

    class Meta:
        verbose_name_plural='tags'

    def __str__(self):
        return self.name

