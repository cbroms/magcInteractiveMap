from django.contrib import admin
from .models import Point, Tag, Map, Info, Tour, TourLocation

class PointAdmin(admin.ModelAdmin):
    
    prepopulated_fields = {'slug': ('short_name',)}
    exclude = ['x', 'y']

class TagAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}

admin.site.register(Point, PointAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(Map)
admin.site.register(Info)

admin.site.register(Tour)
admin.site.register(TourLocation)