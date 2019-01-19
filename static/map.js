// global vars 
var panArea;
var stepNumber = 0;
var locationsTextJSON;
var locationsJSON;

// assume the user has touch device 
var touch = true
var userTouched = false

// The new touch interaction method -> 
// when user taps the map, the x and y coords are recorded and compared 
// against the locations of all the points on the map. An overlap
// indicates the user clicked on that button, so the modal is opened. 
// This bypasses the layering and touch propogation issues from before.

// The old touch interaction method ->
// The touch interaction is pretty tricky, thanks to iOS. #pointElements 
// is a div layered over the zoomable portion (.zoomable), which contains 
// the map. Then, there's another div, #clickElements, which is below the 
// map. The points are drawn in the #pointElements div so the user can see 
// them. However, pointer events are disabled on the #pointElements layer,
// so it does not mess up the viewport scaling on mobile iOS (the user must 
// be touching an element in the .zoomable div, nothing above or below.)
// When a user clicks once, it "primes" the map for another touch by 
// disabling touch events on the zoomable portion, so the user can click
// on a point below the map. The map is made interactive again after the modal 
// for the clicked point closes.


$(document).ready(function() {


    console.log("app running!")

    var mc = new Hammer(document.querySelector('.zoomable'));
    // mc.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }) );

    mc.on('tap', function(e){

        // old touch method 
        // if (touch) {

        //     $('.zoomable').css('pointer-events', 'none')
        //     console.log('removed touch')

        //     // if no modal is open in time, add back pointer events 
        //     setTimeout(function(){
        //         if(!$('.popup').is(':visible')) {
        //             $('.zoomable').css('pointer-events', 'auto')
        //             console.log('restored touch')
        //         }
        //     }, 1500)
        // }

        // when the map is clicked, close the tooltips 
        $('.click-center').tooltip('hide')

        let xClick = e.center.x
        let yClick = e.center.y

        // check the click pos against each of the click locations 
        $('.pulse-click').each(function(){
            let pos = $(this)[0].getBoundingClientRect();

            if (xClick >= pos.x && xClick <= (pos.x + pos.width) &&
                yClick >= pos.y && yClick <= (pos.y + pos.height)) {

                console.log('clicked')

                // if the point was clicked, add an iframe and show
                let slug = $(this).children().first().attr('id')
                let last = '?'
                if (guide) {
                    last = last + '&guide=true'
                }
                if (!$('.int-' + slug).children().first().is('iframe')){
                    $('.int-' + slug).append('<iframe src="details/' + slug + last +'" class="rounded details-frame" ></iframe>')
                }
                
                $('.popup-' + slug).modal('show')
            }

        })
    });

    // old touch method
    // $('.pulse').on('click', function(){

    //     if (touch) {
    //         let slug = $(this).children().first().attr('id')
    //         // when the modal is closed, restore the pointer events to the map
    //         $('.popup-' + slug).on('hidden.bs.modal', function(){
    //             $('.zoomable').css('pointer-events', 'auto') 
    //             console.log('restored touch')
    //         })
    //     }
        

    // })


    // if the user touches, then they are using touchscreen
    $(document).on('touchstart', function(event){
        userTouched = true
        touch = true
    })

    $('#openTags').click(function () {
        $('#sidebar').toggleClass('closed');
        $('.menu-button').toggleClass('side');
    });

    $('#help').click(function(){
        $('#demo').modal('show')
        $('.menu-button').removeClass('side')
        $('#sidebar').removeClass('closed')
    })

    // set the colors of each point
    for (key in colors) {
        if (colors[key].length == 1) {
            $('.' + key).css("background-color", colors[key][0]);
        } else {
            $('.' + key).css({background: "linear-gradient(90deg, " + colors[key][0] +  " 30%, " + colors[key][1] + " 70%)"});
        }
    }

     // enable all tooltips
     $('[data-toggle="tooltip"]').tooltip()


    // init panzoom 
    panArea = panzoom(document.querySelector('.zoomable'), {
        maxZoom: 0.99,
        minZoom: 0.2,
        zoomSpeed: 0.02,
        zoomDoubleClickSpeed: 1, 
        onTouch: function(e) {
            //return false; // tells the library to not preventDefault.
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


        // copy the transformation over to the points
        let matrix = $('.zoomable').first().css('transform')
        $('#clickElements').css('transform', matrix)
    });



    // whenever the sidebar is open and the map is 
    // touched, close the sidebar 
    $('#clickElements').on('touchstart', function(){
        $('#sidebar').removeClass('closed')
        $('.menu-button').removeClass('side')
    })

    // when the about button is clicked, close the sidebar
    $('#about-button').click(function(){
        $('#sidebar').removeClass('closed')
        $('.menu-button').removeClass('side')
    })

    // set initial position
    panArea.zoomAbs(0, 0, 0.2);
    panArea.zoomAbs((window.innerWidth / 2) - ($('.zoomable').width() / 2), (window.innerHeight / 2) - ($('.zoomable').height() / 2), 0.2);

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
        //console.log('touch started')
        //panArea.resume()



    });

    $touchArea.on('touchend mouseup touchcancel', function (e){
        e.preventDefault();
        // touch finished
        touchStarted = false;
       // console.log('touch finished')
        //$('#clickEvents').css('pointer-events', 'auto');
        //panArea.pause()

    });

    $touchArea.on('touchmove mousemove', function (e){
        e.preventDefault();
        let pointer = getPointerEvent(e);
        currX = pointer.pageX;
        currY = pointer.pageY;
        if (touchStarted) {
         // swiping
         //console.log('touch in-progress')
         //$('#clickEvents').css('pointer-events', 'none');

        }
    });

    // get url and make new url object 
    let currUrl = new URL(window.location.href)

    // when the demo container closes, reset its content 
    $('#demo').on('hidden.bs.modal', function(){
        resetDemo();
    })

    // if we are showing a guide, set the step variable accordingly 
    if (guide){
        // show the finish ad continue button 
        $('#finishTour').fadeIn(600)
        $('#continueTour').fadeIn(600)

        // on click, show the guide modal to progress 
        $('#continueTour').click(function(){
            // zoom out the map
             panArea.smoothZoom(parseInt(window.innerWidth/2) , parseInt(window.innerHeight/2) , 0)
            $('#guide').modal('show')
        })

        // when the button is clicked, fade in all the points and end tour
        $('#finishTour').click(function(){
            doneWithTour()
        })

        locationsJSON = JSON.parse(locations)
        locationsTextJSON = JSON.parse(locationsText)
        let step = parseInt(currUrl.searchParams.get("step"))

        // if the step is specified
        if (step != undefined && step < locationsJSON.length && step >= 0) {
            stepNumber = step;
            $('#guide-content').html(locationsTextJSON[stepNumber].fields.text)
            if (demo) {
                $('#before-filter').attr('onclick', 'showGuide();');
                $('#demo').on('hidden.bs.modal', function(){
                    showGuide();
                })
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
                $('#demo').on('hidden.bs.modal', function(){
                    showGuide();
                })
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
    $("#pointElements").removeClass("hidden");

    // fade in the buttons
    $('.btn-info').removeClass("hidden")

    console.log("app revealed")

    // // open a modal by default if requested in url (for touch)
    // if (!frames && open != "") {
    //     window.location.href = 'details/' + open + '?sender=map&redirected=true';
    // }
    // open a modal by default if requested in url (for desktop)
    if ($('.popup-' + open ).length > 0) {
        $('.int-' + open).append('<iframe src="details/' + open  +'" class="rounded details-frame"></iframe>')
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

    //if there are no touches 5 seconds after loading,
    //assume the user is not using touch 
    setTimeout(function(){
        if (!userTouched) {
            touch = false
            $('.zoomable').css('pointer-events', 'none')
        }
    }, 5000)

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

// reset the demo when it is complete 
function resetDemo() {
    $('.demo-content').fadeOut()
    $('#demo-1').fadeIn()
    $('#demo-2').children().last().attr('onclick', 'nextDemo(this);')
    $('#demo').off()
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
    // close the sidebar no matter what 
    $('#sidebar').removeClass('closed')
    $('.menu-button').removeClass('side')

}


// // add iframe on point click if we are showing frames
$('.pulse').click(function (e) {
    let slug = $(this).children().first().attr('id')
    let last = '?'
    if (guide) {
        last = last + '&guide=true'
    }
    if (!$('.int-' + slug).children().first().is('iframe')){
         $('.int-' + slug).append('<iframe src="details/' + slug + last +'" class="rounded details-frame" ></iframe>')
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
        if (!$(this).children().first().hasClass(target)) {
            $(this).fadeOut(600)
            $(this).children().first().tooltip('hide')
            $(this).css('animation', 'none')
        } else {
            $(this).fadeIn(600)
            $(this).css('animation', 'pulse 2s infinite')

            // get client x and y of point 
            let pos = $(this)[0].getBoundingClientRect();

            let cx = pos.left + pos.width/2
            let cy = pos.top + pos.height/2


            let multiplier = 2.2;
            panArea.smoothZoom(cx, cy, multiplier);

            //$($(this).children().first()[0]).tooltip('show')
        }
    })

    // close guide 
    $('#guide').modal('hide')

    if (stepNumber + 2 >= locationsJSON.length) {
        // we are almost done with the tour
        // remove the skip button
        $('#skip').html('Finish')
    } 

    if (stepNumber + 1 >= locationsJSON.length) {
        // we are done with the tour 
        $('#continueTour').fadeOut(600)
        guide = false
        window.history.replaceState('', '', updateURLParameter(window.location.href, 'step', ''));
        window.history.replaceState('', '', updateURLParameter(window.location.href, 'question-guide', 'false'));
        // add an event listener for the close of the target modal 
        $('.popup-' + target).on('hidden.bs.modal', function (e) {
            $('#finishTour').fadeOut(600)
            $('.pulse').fadeIn(600)
            $('.pulse').css('animation', 'none')
        })

    } else {
        stepNumber += 1 
        $('#guide-content').html(locationsTextJSON[stepNumber].fields.text)
         // change the url param to new stepNumber 
        window.history.replaceState('', '', updateURLParameter(window.location.href, 'step', stepNumber.toString()));

        // add an event listener for the close of the target modal 
        $('.popup-' + target).on('hidden.bs.modal', function (e) {
            //let pos = $('#magnolia-grove')[0].getBoundingClientRect()
            //let p = panArea.getTransform()
            //panArea.smoothZoom(parseInt(window.innerWidth/2 + p.x / p.scale) , parseInt(window.innerHeight/2 + p.y/p.scale) , 0)
            panArea.smoothZoom(parseInt(window.innerWidth/2) , parseInt(window.innerHeight/2) , 0)
          // panArea.smoothZoom(pos.x, pos.y, 0)
            $('#guide').modal('show')
            // remove event listener when done 
            $('.popup-' + target).off()
        })
    }

    setTimeout(function(){
        // show the tooltip
        $('#' + target).tooltip('show')
    }, 1000)
    
}


// skip the next step 
function skipNextStep() {

    if (stepNumber + 2 >= locationsJSON.length) {
        // we are almost done with the tour 
        $('#skip').html('Finish')
        $('#skip').attr('onclick', 'doneWithTour();')
    }
    
    if (stepNumber + 1 >= locationsJSON.length) {
        // we are done with the tour 
        $('#continueTour').fadeOut(600)
        guide = false
        window.history.replaceState('', '', updateURLParameter(window.location.href, 'step', ''));
        window.history.replaceState('', '', updateURLParameter(window.location.href, 'question-guide', 'false'));
        // add an event listener for the close of the target modal 
        $('.popup-' + target).on('hidden.bs.modal', function (e) {
            $('#finishTour').fadeOut(600)
            $('.pulse').fadeIn(600)
            $('.pulse').css('animation', 'none')
        })

    } else {
        stepNumber += 1
        $('#guide-content').html(locationsTextJSON[stepNumber].fields.text)
        // change the url param to new stepNumber 
        window.history.replaceState('', '', updateURLParameter(window.location.href, 'step', stepNumber.toString()));
    }

}

function doneWithTour() {
    $('#guide').modal('hide')
    $('#continueTour').fadeOut(600)
    $('#finishTour').fadeOut(600)
    $('.pulse').fadeIn(600)
    $('.pulse').css('animation', 'none')
    guide = false
    // set relevant url params to false 
    window.history.replaceState('', '', updateURLParameter(window.location.href, 'step', ''));
    window.history.replaceState('', '', updateURLParameter(window.location.href, 'question-guide', 'false'));
}

// function centerMap() {

//     let x = $('.zoomable').width();
//     let y = $('.zoomable').height();
//     let top = (window.innerWidth - x) / 2
//     let left = (window.innerHeight - y) / 2

//     let matrix = $('.zoomable').first().css('transform')
//     let curLeft = matrix.split('matrix(')[1].split(', ')[4]
//     let curTop = matrix.split('matrix(')[1].split(', ')[5]

//     matrix = matrix.replace(curLeft, left.toString())
//     matrix = matrix.replace(curTop, top.toString())

// }




