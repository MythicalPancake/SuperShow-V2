// login.js

// Dummy authentication function (should connect to a backend)
function signIn() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Here, you'd normally make an API request to your backend to verify the user
    if (username && password) {
        // Assuming successful login, redirect to the main app page
        localStorage.setItem('user', username);  // Store username in local storage (temporary)
        window.location.href = 'index.html';  // Redirect to the main collection page
    } else {
        document.getElementById("error-message").innerText = "Please enter both username and password.";
    }
}
