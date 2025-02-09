// register.js

document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent form submission

    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    // Check if the username already exists
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const existingUser = users.find(u => u.username === newUsername);

    if (existingUser) {
        alert("Username already exists. Please choose a different one.");
    } else {
        // Add new user to the list
        users.push({ username: newUsername, password: newPassword });
        localStorage.setItem('users', JSON.stringify(users));
        alert("Registration successful! You can now log in.");
        window.location.href = 'login.html';  // Redirect to login page after successful registration
    }
});
