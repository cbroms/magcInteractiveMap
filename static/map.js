

$( window ).resize(function() {
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


$( document ).ready(function() {

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

    var getPointerEvent = function(event) {
        return event.originalEvent.targetTouches ? event.originalEvent.targetTouches[0] : event;
    };


    var panArea = panzoom(document.querySelector('.zoomable'), {
        maxZoom: 0.8,
        minZoom: 0.2,
        zoomSpeed: 0.05,
        onTouch: function(e) {
            console.log("touch");
            return false; // tells the library to not preventDefault.
        }
    });

    panArea.zoomAbs(300, 0, 0.3);

    var $touchArea = $('.zoomable'),
    touchStarted = false, // detect if a touch event is sarted
    currX = 0,
    currY = 0,
    cachedX = 0,
    cachedY = 0;

//setting the events listeners
$touchArea.on('touchstart mousedown',function (e){
   
    var pointer = getPointerEvent(e);
    // caching the current x
    cachedX = currX = pointer.pageX;
    // caching the current y
    cachedY = currY = pointer.pageY;
    // a touch event is detected      
    touchStarted = true;


});
$touchArea.on('touchend mouseup touchcancel',function (e){
    e.preventDefault();
    // here we can consider finished the touch event
    touchStarted = false;

});
$touchArea.on('touchmove mousemove',function (e){
    e.preventDefault();
    var pointer = getPointerEvent(e);
    currX = pointer.pageX;
    currY = pointer.pageY;
    if(touchStarted) {
         // here you are swiping
         console.log("swipe");

     }

 });


    // set the map to the center
    //$panzoom.panzoom("setMatrix", [ 0, 0, 0, 0, -220, -1085 ]);
    // zoom out by default
    //$panzoom.panzoom("zoom", 0.3, { silent: true });


   /* // listen for mousewheel to zoom
    $panzoom.parent().on('mousewheel.focal', function(e) {

        e.preventDefault();
        let delta = e.delta || e.originalEvent.wheelDelta;
        let zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;

        $panzoom.panzoom('zoom', zoomOut, {
            increment: 0.1,
            animate: false,
            focal: e
        });
    });*/

/*    panzoom(document.querySelector('.zoomable'), {
        onTouch: function(e) {
            console.log("touch");
    // `e` - is current touch event.
    return false; // tells the library to not preventDefault.
  }
});*/

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

