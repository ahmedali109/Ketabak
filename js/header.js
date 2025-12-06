function updateHeaderAuth() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const headerActions = document.querySelector(".header-actions");

  if (!headerActions) return;

  if (currentUser) {
    headerActions.innerHTML = `
      <div class="cart-icon">
        <i class="fas fa-shopping-cart"></i>
        <span class="cart-count">3</span>
      </div>
      <div class="user-menu">
        <button class="profile-btn" onclick="window.location.href='profile.html'">
          <i class="fas fa-user-circle"></i>
          <span>${currentUser.firstName}</span>
        </button>
        <button class="logout-btn" onclick="handleLogout()">
          <i class="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </div>
    `;

    if (!document.querySelector("#header-auth-styles")) {
      const style = document.createElement("style");
      style.id = "header-auth-styles";
      style.textContent = `
        .user-menu {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .profile-btn, .logout-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .profile-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .profile-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        .logout-btn {
          background: #f8f9fa;
          color: #495057;
          border: 1px solid #dee2e6;
        }
        .logout-btn:hover {
          background: #e9ecef;
          border-color: #adb5bd;
        }
        .profile-btn i, .logout-btn i {
          font-size: 16px;
        }
      `;
      document.head.appendChild(style);
    }
  } else {
    headerActions.innerHTML = `
      <div class="cart-icon">
        <i class="fas fa-shopping-cart"></i>
        <span class="cart-count">3</span>
      </div>
      <a href="signup.html" class="signup-btn">Sign Up</a>
      <a href="login.html" class="login-btn">Login</a>
    `;
  }
}

function handleLogout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("currentUser");
    alert("You have been logged out successfully!");
    window.location.href = "index.html";
  }
}

document.addEventListener("DOMContentLoaded", updateHeaderAuth);
