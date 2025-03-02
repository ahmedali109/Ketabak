import * as data from "./data.js";

let landingPage = document.querySelector(".landing-page");


setInterval(() => {

    let randomNum = Math.floor(Math.random() * data.landingImgs.length);

    landingPage.style.backgroundImage = `url(${data.landingImgs[randomNum]})`;

}, 3000);



/* Book Rating */

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


/*Carousel */

