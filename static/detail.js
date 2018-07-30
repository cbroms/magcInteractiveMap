$(window).resize(function() {
    $(".faded-background").width(
        Math.ceil($(".main-image").width())
      );
    $(".shrink").width(
        Math.ceil($(".native").width())
      );

    $(".back-fill").width(
        Math.ceil($(".native").width())
    );
});

$(document).ready(function() {

    $(".faded-background").width(
        Math.ceil($(".main-image").width())
      );

    $(".shrink").width(
        Math.ceil($(".native").width())
      );
    
    $(".back-fill").width(
        Math.ceil($(".native").width())
      );

    // initialize the carousel element 
    $('.slider').slick({
      centerMode: true,
      centerPadding: '10px',
      slidesToShow: 1,
      variableWidth: true,
      nextArrow: '.right-btn',
      prevArrow: '.left-btn',
      responsive: [
      {
          breakpoint: 768,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '10px',
            slidesToShow: 1
        }
    },
    {
      breakpoint: 480,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '10px',
        slidesToShow: 1
    }}]});
});
