var i = 0;
var slides = document.getElementsByClassName("slide");
var slide;
var nextSlide;
var fadeSlideId;

setInterval(transitionSlide, 4000);

function transitionSlide() {
    var slideOpacity = 1;
    var nextSlideOpacity = 0;
    slide = slides[i];
    
    i++;
    
    if(i == slides.length) {
        nextSlide = slides[i = 0];
    } else {
        nextSlide = slides[i];
    }
    
    fadeSlideId = setInterval(fadeSlide, 35);
    
    function fadeSlide() {
        slideOpacity -= 1 / 35;
        nextSlideOpacity += 1 / 35;
        
        slide.style.opacity = slideOpacity;
        nextSlide.style.opacity = nextSlideOpacity;
        
        if(slide.style.opacity <= 0 && nextSlide.style.opacity >= 1) {
            slide.style.opacity = 0;
            nextSlide.style.opacity = 1;
            
            clearInterval(fadeSlideId);
        }
    }
}