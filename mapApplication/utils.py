import math
from decimal import Decimal

# convert geographic position (φ, λ) to (x, y) coordinates 
# see https://en.wikipedia.org/wiki/Mercator_projection#Derivation_of_the_Mercator_projection
def geo_to_xy(latitude, longitude, map):

    mapLatBottomRad = map.bottom_latitude * Decimal(math.pi / 180)
    latitudeRad = latitude * Decimal(math.pi / 180)
    mapLngDelta = (map.right_longitude - map.left_longitude)
    worldMapWidth = ((map.image.width / mapLngDelta) * 360) / Decimal(2 * math.pi)
    mapOffsetY = (worldMapWidth / 2 * Decimal(math.log((1 + math.sin(mapLatBottomRad)) / (1 - math.sin(mapLatBottomRad)))))

    x = (longitude - map.left_longitude) * (map.image.width / mapLngDelta)
    y = ((worldMapWidth / 2 * Decimal(math.log((1 + math.sin(latitudeRad)) / (1 - math.sin(latitudeRad))))) - mapOffsetY)

    return {'x': x, 'y': y} 