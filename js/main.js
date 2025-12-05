function checkLoginStatus() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const loginBtn = document.querySelector(".login-btn");
  const headerActions = document.querySelector(".header-actions");

  if (currentUser) {
    if (loginBtn) {
      loginBtn.style.display = "none";

      const userMenu = document.createElement("div");
      userMenu.className = "user-menu";
      userMenu.style.display = "flex";
      userMenu.style.alignItems = "center";
      userMenu.style.gap = "15px";

      userMenu.innerHTML = `
                <span style="color: var(--main-color); font-weight: bold;">Hi, ${currentUser.firstName}</span>
                <button id="logoutBtn" style="padding: 5px 15px; border: 1px solid #e74c3c; color: #e74c3c; background: transparent; border-radius: 20px; cursor: pointer;">Logout</button>
            `;

      headerActions.appendChild(userMenu);

      document
        .getElementById("logoutBtn")
        .addEventListener("click", function () {
          localStorage.removeItem("currentUser");
          window.location.reload();
        });
    }
  }
}
