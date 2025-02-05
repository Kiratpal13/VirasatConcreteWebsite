console.log("Script loaded successfully");
function showContact() {
    console.log("Floating button clicked");
    alert("Call us at +1 123-456-7890 for a Free Estimate!");
}
let slideIndex = 0;
const slides = document.querySelectorAll(".slide");
const slideContainer = document.querySelector(".slideshow-container");
const totalSlides = slides.length;

function showSlides() {
    slideIndex++;

    if (slideIndex >= totalSlides) {
        slideIndex = 0; // Loop back to first image
    }

    // Move the slideshow container
    slideContainer.style.transform = `translateX(-${slideIndex * 100}vw)`;

    // Reset opacity for all slides
    slides.forEach(slide => slide.classList.remove("active"));

    // Highlight the center image
    slides[slideIndex].classList.add("active");
}

// Auto-slide every 3 seconds
setInterval(showSlides, 3000);
