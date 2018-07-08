let topLeft = {
    lat: 37.964376,
    long:-122.554611,
    x: -13642716.89,
    y: 4574394.56
}

let topRight= {
    lat: 37.962848,
    long: -122.553332,
    x: -13642574.51,
    y: 4574178.81
}

let bottomLeft = {
    lat: 37.963465,
    long: -122.556331,
    x: -13642908.36,
    y: 4574265.93
}

let bottomRight = {
    lat: 37.961893,
    long: -122.555225,
    x: -13642785.24,
    y: 4574043.97
}

let point = {
    lat: 37.962364,
    long: -122.555455,
    x: -13642727.13,
    y: 4574383.12
}

let width = 676;
let height = 646;

//let x = ((point.x - topRight.x) / (bottomLeft.x - topRight.x)) * width;

//let y = ((point.y - bottomRight.y) / (topLeft.y - bottomRight.y)) * height;

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

console.log(x);
console.log(y);
console.log(brng);
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.translate(width / 2, height / 2);

//ctx.beginPath();
//ctx.arc(x, y, 2, 0, 2 * Math.PI);
//ctx.stroke();

ctx.beginPath();
ctx.arc(0, 0, 2, 0, 2 * Math.PI);
ctx.stroke();

ctx.moveTo(0, 0);
// longitude 
ctx.lineTo(0 + 600 * Math.cos(brng), 0 + 600 * Math.sin(brng));
ctx.stroke();

ctx.moveTo(0, 0);
// latitude 
ctx.lineTo(0 + 600 * Math.cos(brng2), 0 + 600 * Math.sin(brng2));
ctx.stroke();