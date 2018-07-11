let topLeft = {
    lat: 37.964337,
    long: -122.556279,
    x: -13642716.89,
    y: 4574394.56
}

let topRight= {
    lat: 37.964445,
    long: -122.553274,
    x: -13642574.51,
    y: 4574178.81
}

let bottomLeft = {
    lat: 37.962030,
    long: -122.556215,
    x: -13642908.36,
    y: 4574265.93
}

let bottomRight = {
    lat: 37.962006,
    long: -122.553209,
    x: -13642785.24,
    y: 4574043.97
}

let point = {
    lat: 37.963385,
    long: -122.554430,
    x: -13642727.13,
    y: 4574383.12
}

let width = 3609;
let height = 3915;

let latitude    = point.lat; // (φ)
let longitude   = point.long;   // (λ)

// get x value
let xone = (longitude+180)*(width/360);

// convert from degrees to radians
latRad = latitude*Math.PI/180;

// get y value
let mercN = Math.log(Math.tan((Math.PI/4)+(latRad/2)));
let yone = height/2 -(latitude * height) / 180
//let y = (height/2)-(height*mercN/(2*Math.PI));
console.log(xone);
console.log(yone);

/*let mapWidth = width;
let mapHeight = height;

let mapLonLeft = topLeft.long;
let mapLonRight = topRight.long;
let mapLonDelta = mapLonRight - mapLonLeft;

let mapLatBottom =topLeft.lat;
let mapLatBottomDegree = mapLatBottom * Math.PI / 180;

let lat = latitude;
let lon = longitude;

let x = (lon - mapLonLeft) * (mapWidth / mapLonDelta);

lat = lat * Math.PI / 180;
let worldMapWidth = ((mapWidth / mapLonDelta) * 360) / (2 * Math.PI);
let mapOffsetY = (worldMapWidth / 2 * Math.log((1 + Math.sin(mapLatBottomDegree)) / (1 - Math.sin(mapLatBottomDegree))));
let y = mapHeight - ((worldMapWidth / 2 * Math.log((1 + Math.sin(lat)) / (1 - Math.sin(lat)))) - mapOffsetY);

console.log(x)
console.log(y)*/

// https://en.wikipedia.org/wiki/Mercator_projection#Derivation_of_the_Mercator_projection
function convertGeoToPixel(latitude, longitude,
                  mapWidth, // in pixels
                  mapHeight, // in pixels
                  mapLngLeft, // in degrees. the longitude of the left side of the map (i.e. the longitude of whatever is depicted on the left-most part of the map image)
                  mapLngRight, // in degrees. the longitude of the right side of the map
                  mapLatBottom) // in degrees.  the latitude of the bottom of the map
{
    const mapLatBottomRad = mapLatBottom * Math.PI / 180
    const latitudeRad = latitude * Math.PI / 180
    const mapLngDelta = (mapLngRight - mapLngLeft)

    const worldMapWidth = ((mapWidth / mapLngDelta) * 360) / (2 * Math.PI)
    const mapOffsetY = (worldMapWidth / 2 * Math.log((1 + Math.sin(mapLatBottomRad)) / (1 - Math.sin(mapLatBottomRad))))

    const x = (longitude - mapLngLeft) * (mapWidth / mapLngDelta)
    const y = ((worldMapWidth / 2 * Math.log((1 + Math.sin(latitudeRad)) / (1 - Math.sin(latitudeRad)))) - mapOffsetY)

    return {x, y} // the pixel x,y value of this point on the map image
}

let res = convertGeoToPixel(37.963060, -122.554749, width, height, -122.556252, -122.553227, 37.961946);

console.log(res.x);
console.log(res.y);

//let xcord = ((point.long - topLeft.long) / (bottomRight.long - topLeft.long)) * width;
//let ycord = ((point.lat - bottomLeft.lat) / (topRight.lat - bottomLeft.lat)) * height;
/*
let l2 = bottomRight.long;
let l1 = topRight.long;
let p2 = bottomRight.lat;
let p1 = topRight.lat;

// calculate bearing (longitude)
var y = Math.sin(bottomRight.long-topRight.long) * Math.cos(bottomRight.lat);
var x = Math.cos(topRight.lat)*Math.sin(bottomRight.lat) - Math.sin(topRight.lat)*Math.cos(bottomRight.lat)*Math.cos(bottomRight.long-topRight.long);
var brng = Math.atan2(y, x)
// to degrees
//brng = brng * (180 / Math.PI);

// bearing θ = atan2( sin Δλ ⋅ cos φ2 , cos φ1 ⋅ sin φ2 − sin φ1 ⋅ cos φ2 ⋅ cos Δλ )

// calculate bearing (latitude)
let y2 = Math.sin(bottomRight.long-bottomLeft.long) * Math.cos(bottomRight.lat);
var x2 = Math.cos(bottomLeft.lat)*Math.sin(bottomRight.lat) - Math.sin(bottomLeft.lat)*Math.cos(bottomRight.lat)*Math.cos(bottomRight.long-bottomLeft.long);
var brng2 = Math.atan2(y2, x2)
*/
//console.log(xcord);
//console.log(ycord);
//console.log(brng);
window.onload = function() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.drawImage(document.getElementById("map"), 0, 0);

    ctx.translate(0, height);
    ctx.scale(1, -1);
    ctx.beginPath();
    ctx.arc(res.x, res.y, 6, 0, 2 * Math.PI);
    ctx.strokeStyle="red";
    ctx.stroke();
}

//var c = document.getElementById("myCanvas");
//var ctx = c.getContext("2d");
//ctx.translate(width / 2, height / 2);
//let img = document.getElementById("map");
//ctx.drawImage(img,0,0);

//ctx.beginPath();
//ctx.arc(x, y, 2, 0, 2 * Math.PI);
//ctx.stroke();

//ctx.beginPath();
//ctx.arc(0, 0, 2, 0, 2 * Math.PI);
//ctx.stroke();

//ctx.moveTo(0, 0);
// longitude 
//ctx.lineTo(0 + 600 * Math.cos(brng), 0 + 600 * Math.sin(brng));
//ctx.stroke();

//ctx.moveTo(0, 0);
// latitude 
//ctx.lineTo(0 + 600 * Math.cos(brng2), 0 + 600 * Math.sin(brng2));
//ctx.stroke();