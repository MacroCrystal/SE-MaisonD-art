let slideIndex = 0;
showSlides();

function showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}    
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";  
    dots[slideIndex-1].className += " active";
    setTimeout(showSlides, 10000);
}

const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");

prevButton.addEventListener("click", () => {
    slideIndex -= 2;
    showSlides();
});

nextButton.addEventListener("click", () => {
    showSlides();
});

document.addEventListener("DOMContentLoaded", function() {

    function startTimer(duration, display) {
        let timer = duration, minutes, seconds;
        setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + " : " + seconds;

            if (--timer < 0) {
                timer = duration;
            }
        }, 1000);
    }

    window.onload = function () {
        let fiveMinutes = 60 * 5,
            display = document.querySelector('#timer');
        startTimer(fiveMinutes, display);
    };

});

document.querySelectorAll('.love-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.querySelector('i').classList.add('fas');
        this.querySelector('i').classList.remove('far');
    });
    
    btn.addEventListener('mouseleave', function() {
        this.querySelector('i').classList.add('far');
        this.querySelector('i').classList.remove('fas');
    });
});

window.addEventListener('scroll', function() {
    var navbar = document.getElementById('navbar');
    if (window.pageYOffset > 0) {
        navbar.style.top = '0';
    } else {
        navbar.style.top = 'initial'; // Reset to the initial position
    }
});