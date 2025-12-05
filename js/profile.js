document.addEventListener("DOMContentLoaded", function () {
  const currentUserJson = localStorage.getItem("currentUser");

  if (!currentUserJson) {
    window.location.href = "login.html";
    return;
  }

  const currentUser = JSON.parse(currentUserJson);

  const profileNameElement = document.getElementById("profileFullName");
  const profileEmailElement = document.getElementById("profileEmail");
  const profileLogoutBtn = document.getElementById("profileLogoutBtn");

  if (profileNameElement && profileEmailElement) {
    const fullName = `${currentUser.firstName || ""} ${
      currentUser.lastName || ""
    }`;
    profileNameElement.textContent = fullName.trim() || "User Name";
    profileEmailElement.textContent = currentUser.email || "email@example.com";
  }

  if (profileLogoutBtn) {
    profileLogoutBtn.addEventListener("click", function () {
      localStorage.removeItem("currentUser");
      window.location.href = "login.html";
    });
  }
});
