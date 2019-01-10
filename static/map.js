// global vars 
var panArea;
var stepNumber = 0;
var locationsTextJSON;
var locationsJSON;


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

    $('#sidebarCollapse').click(function () {
        $('#sidebar').toggleClass('closed');
        $('#sidebarCollapse').toggleClass('side');
    });

    $('#using-the-map').click(function(){
        $('#sidebar').toggleClass('closed');
        $('#sidebarCollapse').toggleClass('side');
        $('#demo').modal('show')
    })

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
    panArea = panzoom(document.querySelector('.zoomable'), {
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

    let getPointerEvent = function(event) {
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

    // get url and make new url object 
    let currUrl = new URL(window.location.href)

    // if we are showing a guide, set the step variable accordingly 
    if (guide){
        locationsJSON = JSON.parse(locations)
        locationsTextJSON = JSON.parse(locationsText)
        let step = parseInt(currUrl.searchParams.get("step"))

        // if the step is specified
        if (step != undefined && step < locationsJSON.length && step >= 0) {
            stepNumber = step;
            $('#guide-content').html(locationsTextJSON[stepNumber].fields.text)
            if (demo) {
                $('#before-filter').attr('onclick', 'showGuide();');
            } else {
                showGuide()
            }

        } else {
            stepNumber = 0;
            $('#guide-content').html(locationsTextJSON[0].fields.text)
            // set the step to 0 and add to url 
            window.history.replaceState('', '', updateURLParameter(window.location.href, 'step', '0'));

            if (demo) {
                $('#before-filter').attr('onclick', 'showGuide();');
            } else {
                showGuide()
            }
            
        }

    }
    

});

// reveal the map and points after loading is complete
Pace.on("done", () => {
    $("#map").removeClass("hidden");
    $("#clickElements").removeClass("hidden");

    console.log("app revealed")

    // open a modal by default if requested in url (for touch)
    if (!frames && open != "") {
        window.location.href = 'details/' + open + '?sender=map&redirected=true';
    }
    // open a modal by default if requested in url (for desktop)
    if ($('.popup-' + open ).length > 0) {
        $('.popup-' + open ).modal('show');
    }

    // if there is a demo box, show it 
    if (demo) {
        $('#demo').modal('show')
        demo = false;
        // when demo is closed, remove demo param from url 
        $('#demo').on('hidden.bs.modal', function (e) {
            window.history.replaceState('', '', updateURLParameter(window.location.href, 'demo', 'false'));
        })
    }

    // disable Pace
    Pace.options = {
        ajax: false,
        elements: false,
        document: false, 
        eventLag: false,
        restartOnRequestAfter: false,
        restartOnPushState: false,
    }
});

// function called when clicking next arrow on demo modal 
// changes content to the next up content
function nextDemo(e) {
    let parent = $(e).parent()[0]
    let num = ($(parent).attr('id')).split('demo-')[1]
    $(parent).fadeOut(600, function(){
        $('#demo-' + (parseInt(num) + 1).toString()).fadeIn(600).css("display","block");
    })
    
}

//http://stackoverflow.com/a/10997390/11236
// update a certain parameter in the url 
function updateURLParameter(url, param, paramVal){
    let newAdditionalURL = "";
    let tempArray = url.split("?");
    let baseURL = tempArray[0];
    let additionalURL = tempArray[1];
    let temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (let i = 0; i < tempArray.length; i++){
            if (tempArray[i].split('=')[0] != param){
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }

    let rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

// if any of the filters in the demo panel are changed, this variable 
// changes to true, so we know to reload the page with the revised filters
var demoOptionsChanged = false;

function deactivateButton(name) {
    demoOptionsChanged = true;
    $('.btn-' + name).animate({opacity: 0.4}, 400)
    $('.btn-' + name).attr('onclick', 'activateButton("' + name + '");');
    $('.btn-' + name).filter('.smaller').html('<i class="fas fa-plus"></i>')
}

function activateButton(name) {
    demoOptionsChanged = true;
    $('.btn-' + name).animate({opacity: 1}, 400)
    $('.btn-' + name).attr('onclick', 'deactivateButton("' + name + '");');
    $('.btn-' + name).filter('.smaller').html('<i class="fas fa-times"></i>')
}

function goToRevisedPage() {
    if (demoOptionsChanged) {
        let remove = []
        $('.smaller').each(function(){

            if ($(this).css('opacity') != 1) {
                let classes = $(this).attr('class')
                let slug = (classes.split('btn-')[1]).split(' ')[0]
                remove.push(slug)
            }
        })
        let full = '?'
        for (let i = 0; i < remove.length; i++) {
            full = full + remove[i] + '=False&'
        }   
        window.location.href = full
    } else {
        $('#demo').modal('hide')
    }

}


// add iframe on point click if we are showing frames
$('.pulse').click(function (e) {
    let slug = $(this).children().first().attr('id')
    let last = ''
    if (guide) {
        last = '?guide=true'
    }
    if (!$('.popup-' + slug).children().first().children().first().children().last().is('iframe')
        && frames){
         $('.popup-' + slug).children().first().children().first().append('<iframe src="details/' + slug + last +'" class="rounded details-frame"></iframe>')
    }
  
})

// called from the second to last demo button so we don't get 
// the option to filter out points 
function showGuide(){
    $('#demo').modal('hide')
    $('#guide').modal('show')
}


// go to next step  
function incrementStep() {

    // highlight the point and remove all others 
    let target = locationsJSON[stepNumber].fields.slug

    $('.pulse').each(function(){
        if ($(this).children().first().attr('id') != target) {
            $(this).css('display', 'none')
            $(this).children().first().tooltip('hide')
            $(this).css('animation', 'none')
        } else {
            $(this).css('display', 'block')
            $(this).css('animation', 'pulse 2s infinite')
            //$($(this).children().first()[0]).tooltip('show')
        }
    })

    // close guide 
    $('#guide').modal('hide')

    if (stepNumber + 2 >= locationsJSON.length) {
        // remove the skip button
        $('#skip').css('display', 'none')
    }

    if (stepNumber + 1 >= locationsJSON.length) {
        // we are done with the tour 
        guide = false
        window.history.replaceState('', '', updateURLParameter(window.location.href, 'step', ''));
        window.history.replaceState('', '', updateURLParameter(window.location.href, 'question-guide', 'false'));
        // add an event listener for the close of the target modal 
        $('.popup-' + target).on('hidden.bs.modal', function (e) {
            $('.pulse').css('display', 'block')
            $('.pulse').css('animation', 'none')
        })

    } else {
        stepNumber += 1 
        $('#guide-content').html(locationsTextJSON[stepNumber].fields.text)
         // change the url param to new stepNumber 
        window.history.replaceState('', '', updateURLParameter(window.location.href, 'step', stepNumber.toString()));

        // add an event listener for the close of the target modal 
        $('.popup-' + target).on('hidden.bs.modal', function (e) {
            $('#guide').modal('show')
        })
    }

    setTimeout(function(){
        // show the tooltip
        $('#' + target).tooltip('show')
    }, 500)
    
}


// skip the next step 
function skipNextStep() {

    if (stepNumber + 2 >= locationsJSON.length) {
        // we are done with the tour 
        // remove the skip button
        $('#skip').css('display', 'none')
        // we are done with the tour 
        // window.history.replaceState('', '', updateURLParameter(window.location.href, 'step', ''));
        // window.history.replaceState('', '', updateURLParameter(window.location.href, 'question-guide', 'false'));
    }
    stepNumber += 1
    $('#guide-content').html(locationsTextJSON[stepNumber].fields.text)
    // change the url param to new stepNumber 
    window.history.replaceState('', '', updateURLParameter(window.location.href, 'step', stepNumber.toString()));

}







