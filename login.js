// login.js

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check if the credentials are in localStorage (we assume registration has already happened)
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Find user by username
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Save username in localStorage and redirect to main page
        localStorage.setItem('user', username);
        window.location.href = 'index.html';  // Redirect to collection page
    } else {
        alert("Invalid username or password. Please try again.");
    }
});
