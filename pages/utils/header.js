const isPagesFolder = window.location.pathname.includes("/pages/");
const rootPath = isPagesFolder ? "../" : "";
const pagesPath = isPagesFolder ? "" : "pages/";

const currentUserJson = localStorage.getItem("currentUser");
const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;

const cart = JSON.parse(localStorage.getItem("ketabak_cart")) || [];
const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

let userActionsHTML = "";

if (currentUser) {
  userActionsHTML = `
    <div class="cart-icon" onclick="window.location.href='${pagesPath}cart.html'" style="cursor:pointer;" tabindex="0" aria-label="Shopping Cart">
      <i class="fas fa-shopping-cart" aria-hidden="true"></i>
      <span class="cart-count">${cartTotalItems}</span>
    </div>
    <div class="user-menu" style="display:flex;align-items:center;gap:10px;">
      <button class="profile-btn" onclick="window.location.href='${pagesPath}profile.html'" style="padding:8px 16px;border:none;border-radius:6px;cursor:pointer;font-size:14px;font-weight:500;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;display:flex;align-items:center;gap:6px;">
        <i class="fas fa-user-circle"></i>
        <span>${currentUser.firstName}</span>
      </button>
      <button class="logout-btn" onclick="handleLogout()" style="padding:8px 16px;border:1px solid #dee2e6;border-radius:6px;cursor:pointer;font-size:14px;font-weight:500;background:#f8f9fa;color:#495057;display:flex;align-items:center;gap:6px;">
        <i class="fas fa-sign-out-alt"></i>
        Logout
      </button>
    </div>
  `;
} else {
  userActionsHTML = `
    <div class="cart-icon" onclick="window.location.href='${pagesPath}cart.html'" style="cursor:pointer;" tabindex="0" aria-label="Shopping Cart">
      <i class="fas fa-shopping-cart" aria-hidden="true"></i>
      <span class="cart-count">${cartTotalItems}</span>
    </div>
    <a href="${pagesPath}signup.html" class="signup-btn">Sign Up</a>
    <a href="${pagesPath}login.html" class="login-btn">Login</a>
  `;
}

const headerHTML = `
  <header class="header" role="banner">
    <div class="header-container">
      <a href="${rootPath}index.html" class="logo" aria-label="Ketabak Home">ketabak</a>

      <nav aria-label="Main Navigation" id="main-nav">
        <ul class="nav-links" id="nav-links">
          <li><a href="${pagesPath}books.html">Books</a></li>
          <li><a href="${pagesPath}categories.html">Categories</a></li>
          <li><a href="${pagesPath}authors.html">Authors</a></li>
          <li><a href="${pagesPath}about.html">About Us</a></li>
          <li class="mobile-auth-links" id="mobile-auth-links" style="display:none;"></li>
        </ul>
      </nav>

      <div class="header-actions" aria-label="User Actions" id="header-actions">
        ${userActionsHTML}
        <button class="hamburger-btn" id="hamburger-btn" aria-label="Toggle Menu" aria-expanded="false">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>
`;

document.body.insertAdjacentHTML("afterbegin", headerHTML);

const style = document.createElement("style");
style.textContent = `
  .hamburger-btn {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    z-index: 1100;
  }
  .hamburger-btn span {
    display: block;
    width: 24px;
    height: 2px;
    background: #fff;
    border-radius: 2px;
    transition: all 0.3s ease;
  }
  .hamburger-btn.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
  .hamburger-btn.open span:nth-child(2) { opacity: 0; }
  .hamburger-btn.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

  @media (max-width: 768px) {
    .hamburger-btn { display: flex; }

    #header-actions .signup-btn,
    #header-actions .login-btn,
    #header-actions .user-menu { display: none !important; }

    #nav-links {
      display: none;
      flex-direction: column;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: #1f2b47;
      padding: 16px;
      gap: 4px;
      border-top: 1px solid rgba(255,255,255,0.1);
      z-index: 999;
    }
    #nav-links.open { display: flex; }

    #nav-links li { width: 100%; }
    #nav-links a {
      display: block;
      padding: 10px 14px;
      border-radius: 6px;
    }

    #mobile-auth-links {
      display: flex !important;
      gap: 10px;
      padding: 12px 14px 4px;
      border-top: 1px solid rgba(255,255,255,0.1);
      margin-top: 8px;
    }
    #mobile-auth-links a,
    #mobile-auth-links button {
      flex: 1;
      text-align: center;
      padding: 9px 12px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
  }
`;
document.head.appendChild(style);

// Mobile auth buttons
const mobileAuthEl = document.getElementById("mobile-auth-links");
if (mobileAuthEl) {
  if (currentUser) {
    mobileAuthEl.innerHTML = `
      <button onclick="window.location.href='${pagesPath}profile.html'" style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;display:flex;align-items:center;justify-content:center;gap:6px;">
        <i class="fas fa-user-circle"></i> ${currentUser.firstName}
      </button>
      <button onclick="handleLogout()" style="background:#f8f9fa;color:#495057;border:1px solid #dee2e6;">
        <i class="fas fa-sign-out-alt"></i> Logout
      </button>
    `;
  } else {
    mobileAuthEl.innerHTML = `
      <a href="${pagesPath}signup.html" class="signup-btn" style="display:flex;align-items:center;justify-content:center;">Sign Up</a>
      <a href="${pagesPath}login.html" class="login-btn" style="display:flex;align-items:center;justify-content:center;">Login</a>
    `;
  }
}

// Hamburger toggle
const hamburgerBtn = document.getElementById("hamburger-btn");
const navLinks = document.getElementById("nav-links");

hamburgerBtn.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  hamburgerBtn.classList.toggle("open", isOpen);
  hamburgerBtn.setAttribute("aria-expanded", isOpen);
});

// Close menu on link click
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburgerBtn.classList.remove("open");
    hamburgerBtn.setAttribute("aria-expanded", false);
  });
});

// Close menu on outside click
document.addEventListener("click", (e) => {
  if (!e.target.closest(".header")) {
    navLinks.classList.remove("open");
    hamburgerBtn.classList.remove("open");
    hamburgerBtn.setAttribute("aria-expanded", false);
  }
});

window.handleLogout = function () {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("currentUser");
    window.location.href = isPagesFolder ? "../index.html" : "index.html";
  }
};