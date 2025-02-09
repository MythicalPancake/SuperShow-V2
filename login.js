// login.js

// Example user credentials for testing (you can modify or replace this with a backend)
const storedUsername = "user123";
const storedPassword = "password123";

// Handle the login form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the form from submitting

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check if the credentials match
    if (username === storedUsername && password === storedPassword) {
        // Store the username in localStorage to indicate the user is logged in
        localStorage.setItem('user', username);
        // Redirect to the collection page
        window.location.href = 'index.html';
    } else {
        alert("Invalid username or password. Please try again.");
    }
});
