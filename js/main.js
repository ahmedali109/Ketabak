import * as data from "./data.js";

let landingPage = document.querySelector(".landing-page");


setInterval(() => {

    let randomNum = Math.floor(Math.random() * data.landingImgs.length);

    landingPage.style.backgroundImage = `url(${data.landingImgs[randomNum]})`;

}, 3000);