function toggleMenu() {
    const menu = document.querySelector(".nav-menu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}


function dialNumber() {
    window.location.href = "tel:+15879362818";
}
let currentIndex = 0;
const slides = document.querySelectorAll(".slide");

function showSlides() {
    slides.forEach((slide, index) => {
        slide.style.display = "none"; // Hide all slides
    });

    slides[currentIndex].style.display = "block"; // Show current image

    currentIndex = (currentIndex + 1) % slides.length; // Loop back after last image
}

// Run slideshow every 3 seconds
setInterval(showSlides, 3000);

// Ensure slideshow starts when the page loads
document.addEventListener("DOMContentLoaded", showSlides);
