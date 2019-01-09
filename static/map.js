

$(window).resize(function() {
    $(".details-frame").height(
        Math.ceil($(window).height() * 0.9)
        );
    // set to 98% height for mobile
    if ($(window).width() <= 480) {
        $(".details-frame").height(
            Math.ceil($(window).height() * 0.96)
            );
    }
});


$(document).ready(function() {

    console.log("app running!")

    $(".details-frame").height(
        Math.ceil($(window).height() * 0.9)
        );
    // set to 98% height for mobile
    if ($(window).width() <= 480) {
        $(".details-frame").height(
            Math.ceil($(window).height() * 0.96)
            );
    }

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('closed');
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebarCollapse').toggleClass('side');
    });

    // set the colors of each point
    for (key in colors) {
        if (colors[key].length == 1) {
            $('#' + key).css("background-color", colors[key][0]);
        } else {
            $('#' + key).css({background: "linear-gradient(151deg, " + colors[key][0] +  " 30%, " + colors[key][1] + " 70%)"});
        }
    }

     // enable all tooltips
     $('[data-toggle="tooltip"]').tooltip()


    // make links work in pan area
  /*  $('.zoomable a').on('mousedown touchstart', function(e) {
        console.log("touch");
        e.stopImmediatePropagation();
    });*/

    
    // init panzoom 
    let panArea = panzoom(document.querySelector('.zoomable'), {
        maxZoom: 0.99,
        minZoom: 0.2,
        zoomSpeed: 0.05,
        onTouch: function(e) {
            return false; // tells the library to not preventDefault.
        }
    });

    let isZoomed = function() {
        let matrix = $('.zoomable').first().css('transform')
        let zoom = parseFloat(matrix.split('matrix(')[1].split(',')[0])
        return (zoom >= 0.75)
    }

    // when map is zoomed, check if zoom level is large enough to show
    // the point tooltip tags 
    panArea.on('transform', function(e) {
        if (isZoomed()) {
            $('.click-center').tooltip('show')
        } else {
            $('.click-center').tooltip('hide')
        }
    });


    // when a button is clicked, close the tooltips 
    $('.btn').click(function(){
        $('.click-center').tooltip('hide')
    })


    // set initial position
    panArea.zoomAbs(300, 0, 0.3);

    // select pan area and set og x and y pos
    let $touchArea = $('.zoomable'),
    touchStarted = false, 
    currX = 0,
    currY = 0,
    cachedX = 0,
    cachedY = 0;

var getPointerEvent = function(event) {
        return event.originalEvent.targetTouches ? event.originalEvent.targetTouches[0] : event;
    };


// detect swipes vs clicks on mobile
$touchArea.on('touchstart mousedown', function (e){
   
    let pointer = getPointerEvent(e);
    // caching the current x
    cachedX = currX = pointer.pageX;
    // caching the current y
    cachedY = currY = pointer.pageY;
    // a touch event is detected      
    touchStarted = true;


});

$touchArea.on('touchend mouseup touchcancel', function (e){
    e.preventDefault();
    // touch finished
    touchStarted = false;

});

$touchArea.on('touchmove mousemove', function (e){
    e.preventDefault();
    let pointer = getPointerEvent(e);
    currX = pointer.pageX;
    currY = pointer.pageY;
    if (touchStarted) {
         // swiping

     }
 });


});

// reveal the map and points after loading is complete
Pace.on("done", () => {
    $("#map").removeClass("hidden");
    $("#clickElements").removeClass("hidden");

    // open a modal by default if requested in url (for touch)
    if (!frames && open != "") {
        window.location.href = 'details/' + open + '?sender=map&redirected=true';
    }
    // open a modal by default if requested in url (for desktop)
    if ($('.popup-' + open ).length > 0) {
        $('.popup-' + open ).modal('show');
    }
});




