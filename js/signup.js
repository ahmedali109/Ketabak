const signupForm = document.querySelector("form");

signupForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const firstName = document.getElementById("firstname").value;
  const lastName = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const terms = document.getElementById("terms").checked;

  if (!terms) {
    alert("Please agree to the Terms and Conditions");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const isUserExist = users.find((user) => user.email === email);
  if (isUserExist) {
    alert("This email is already registered!");
    return;
  }

  const newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Registration Successful! Please Login.");
  window.location.href = "profile.html";
});
