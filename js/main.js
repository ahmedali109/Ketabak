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
// js/main.js

document.addEventListener('DOMContentLoaded', function() {
    updateNavbarForUser();
});

function updateNavbarForUser() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    const loginBtn = document.querySelector('.login-btn');
    const headerActions = document.querySelector('.header-actions');

    if (currentUser) {
        if (loginBtn) {
            loginBtn.remove();
        }

        const userMenuHTML = `
            <div class="user-nav-menu">
                <a href="pages/profile.html" class="user-profile-link">
                    <i class="fas fa-user-circle"></i>
                    <span>${currentUser.firstName}</span>
                </a>
                <button id="navLogoutBtn" class="nav-logout-btn" title="Logout">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
        `;

        headerActions.insertAdjacentHTML('beforeend', userMenuHTML);

        const logoutBtn = document.getElementById('navLogoutBtn');
        logoutBtn.addEventListener('click', function() {
            const confirmLogout = confirm("Are you sure you want to logout?");
            if (confirmLogout) {
                localStorage.removeItem('currentUser');
                window.location.reload();
            }
        });
    }
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

/* Carousel/Bestseller Navigation */
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("carousel");
  const leftArrow = document.querySelector(".arrow.left");
  const rightArrow = document.querySelector(".arrow.right");

  function scrollCarousel(direction) {
    if (!carousel) return;

    const card = carousel.querySelector(".card");
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const gap = 20; // Adjust based on your CSS gap value
    const scrollAmount = (cardWidth + gap) * direction;

    carousel.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  }

  // Add click listeners to arrows
  if (leftArrow) {
    leftArrow.addEventListener("click", () => scrollCarousel(-1));
  }

  if (rightArrow) {
    rightArrow.addEventListener("click", () => scrollCarousel(1));
  }
});

document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});

function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginBtn = document.querySelector('.login-btn');
    const headerActions = document.querySelector('.header-actions');

    if (currentUser) {
        if (loginBtn) {
            loginBtn.style.display = 'none'; 
            
            const userMenu = document.createElement('div');
            userMenu.className = 'user-menu';
            userMenu.style.display = 'flex';
            userMenu.style.alignItems = 'center';
            userMenu.style.gap = '15px';
            
            userMenu.innerHTML = `
                <span style="color: var(--main-color); font-weight: bold;">Hi, ${currentUser.firstName}</span>
                <button id="logoutBtn" style="padding: 5px 15px; border: 1px solid #e74c3c; color: #e74c3c; background: transparent; border-radius: 20px; cursor: pointer;">Logout</button>
            `;
            
            headerActions.appendChild(userMenu);

            document.getElementById('logoutBtn').addEventListener('click', function() {
                localStorage.removeItem('currentUser'); 
                window.location.reload(); 
            });
        }
    }
}