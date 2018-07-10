from django.contrib import admin
from .models import Point, Tag, Map

class PointAdmin(admin.ModelAdmin):
    prepopulated_fields = {'id': ('short_name',)}

class TagAdmin(admin.ModelAdmin):
    prepopulated_fields = {'id': ('name',)}

admin.site.register(Point, PointAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(Map)