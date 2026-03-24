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
    <div class="cart-icon" onclick="window.location.href='${pagesPath}cart.html'" style="cursor: pointer;" tabindex="0" aria-label="Shopping Cart">
      <i class="fas fa-shopping-cart" aria-hidden="true"></i>
      <span class="cart-count">${cartTotalItems}</span>
    </div>
    <div class="user-menu" style="display: flex; align-items: center; gap: 10px;">
      <button class="profile-btn" onclick="window.location.href='${pagesPath}profile.html'" style="padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: flex; align-items: center; gap: 6px;">
        <i class="fas fa-user-circle"></i>
        <span>${currentUser.firstName}</span>
      </button>
      <button class="logout-btn" onclick="handleLogout()" style="padding: 8px 16px; border: 1px solid #dee2e6; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; background: #f8f9fa; color: #495057; display: flex; align-items: center; gap: 6px;">
        <i class="fas fa-sign-out-alt"></i>
        Logout
      </button>
    </div>
  `;
} else {
  userActionsHTML = `
    <div class="cart-icon" onclick="window.location.href='${pagesPath}cart.html'" style="cursor: pointer;" tabindex="0" aria-label="Shopping Cart">
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

      <nav aria-label="Main Navigation">
        <ul class="nav-links">
          <li><a href="${pagesPath}books.html">Books</a></li>
          <li><a href="${pagesPath}categories.html">Categories</a></li>
          <li><a href="${pagesPath}authors.html">Authors</a></li>
          <li><a href="${pagesPath}about.html">About Us</a></li>
        </ul>
      </nav>

      <div class="header-actions" aria-label="User Actions">
        ${userActionsHTML}
      </div>
    </div>
  </header>
`;

document.body.insertAdjacentHTML("afterbegin", headerHTML);

window.handleLogout = function () {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("currentUser");
    window.location.href = isPagesFolder ? "../index.html" : "index.html";
  }
};
