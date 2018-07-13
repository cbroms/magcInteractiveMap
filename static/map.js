
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
});




