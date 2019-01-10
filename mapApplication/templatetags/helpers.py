from django import template
from django.utils.safestring import mark_safe
from decimal import Decimal
import json

register = template.Library()

# check if value is in url query and add or remove it accordingly
@register.simple_tag
def value_in_url(value, url):
    if url:
        queriesSplit = url.split('&')
        for query in queriesSplit:
            if value in query:
                return '?' + url.replace(value + '=False', '')
        return '?' + url + '&' + value + '=False'
    else:
        return '?' + value + '=False'

# add value to url
@register.simple_tag
def add_to_url(value, url):
    if url:
        queriesSplit = url.split('&')
        for query in queriesSplit:
            if value in query:
                return '?' + url.replace(value + '=False', value + '=True')
            elif value in query.lower():
                return '?' + url.replace(value + '=false', value + '=True')
        return '?' + url + '&' + value + '=True'
    else:
        return '?' + value + '=True'

# json encode a python object for use in javascript
@register.filter(is_safe=True)
def js(self):
    # extend the json encoder to convert decimal to float
    class DecimalEncoder(json.JSONEncoder):
        def default(self, obj):
            if isinstance(obj, Decimal):
                return float(obj)
            return json.JSONEncoder.default(self, obj)
            
    return mark_safe(DecimalEncoder().encode(self))
