from django import template

register = template.Library()

@register.simple_tag
def value_in_url(value, url):
    if url:
        queriesSplit = url.split('&')
        for query in queriesSplit:
            if value in query:
                return '?' + url.replace(value + '=True', '')
        return '?' + url + '&' + value + '=True'
    else:
        return '?' + value + '=True'
