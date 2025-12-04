// Login Logic
const loginForm = document.querySelector('form');

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const currentUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        alert(`Welcome back, ${user.firstName}!`);
        window.location.href = 'profile.html'
    } else {
        alert("Invalid Email or Password!");
    }
});