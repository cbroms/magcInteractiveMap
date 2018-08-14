
// on resize, set the details frames to be 90% of the window height
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

// on ready, set the details frames to be 90% of the window height
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
            console.log("setting gradient");
             $('#' + key).css({background: "linear-gradient(151deg, " + colors[key][0] +  " 30%, " + colors[key][1] + " 70%)"});
        }
     }

     // enable all tooltips
    $('[data-toggle="tooltip"]').tooltip()

    // make links work in pan area
    $('.zoomable a').on('mousedown touchstart', function(e) {
        console.log("touch");
        e.stopImmediatePropagation();
    });


    // set the map to the center
    //$panzoom.panzoom("setMatrix", [ 0, 0, 0, 0, -220, -1085 ]);
    // zoom out by default
    //$panzoom.panzoom("zoom", 0.3, { silent: true });


    // listen for mousewheel to zoom
    $panzoom.parent().on('mousewheel.focal', function(e) {

        e.preventDefault();
        let delta = e.delta || e.originalEvent.wheelDelta;
        let zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;

        $panzoom.panzoom('zoom', zoomOut, {
            increment: 0.1,
            animate: false,
            focal: e
        });
    });

});

// reveal the map and points after loading is complete
Pace.on("done", () => {
    $("#map").removeClass("hidden");
    $("#clickElements").removeClass("hidden");

    if ($('.popup-' + open ).length > 0) {
        // open a modal by default if requested in url
        $('.popup-' + open ).modal('show')
    }
});

