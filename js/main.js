import * as data from "./data.js";

// Landing Page Background Slideshow
let landingPage = document.querySelector(".landing-page");
let currentIndex = 0;
let isChanging = false;

function changeBackground() {
  if (isChanging) return;
  isChanging = true;

  currentIndex = (currentIndex + 1) % data.landingImgs.length;

  // Preload the image before changing
  const img = new Image();
  img.onload = () => {
    landingPage.style.backgroundImage = `url(${data.landingImgs[currentIndex]})`;
    isChanging = false;
  };
  img.onerror = () => {
    console.error(`Failed to load image: ${data.landingImgs[currentIndex]}`);
    isChanging = false;
  };
  img.src = data.landingImgs[currentIndex];
}

// Start slideshow when page loads
window.addEventListener("load", () => {
  if (landingPage && data.landingImgs && data.landingImgs.length > 0) {
    // Set initial background
    landingPage.style.backgroundImage = `url(${data.landingImgs[0]})`;

    // Start changing backgrounds
    setInterval(changeBackground, 3000);
  }
});

/* Book Rating System */
document.addEventListener("DOMContentLoaded", () => {
  const rateContainers = document.querySelectorAll(".rate");

  rateContainers.forEach((container) => {
    const rating = parseInt(container.getAttribute("data-rating"));
    const maxRating = 5;
    let stars = "";

    for (let i = 1; i <= maxRating; i++) {
      if (i <= rating) {
        stars += "★";
      } else {
        stars += "☆";
      }
    }

    container.innerHTML = stars;
  });
});