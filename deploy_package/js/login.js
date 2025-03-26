document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    fetch('/api/user')
        .then(response => {
            if (response.ok) {
                // User is logged in, redirect to dashboard
                window.location.href = 'dashboard.html';
            }
        })
        .catch(error => {
            console.error('Error checking authentication:', error);
        });
    
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Clear previous messages
        loginMessage.textContent = '';
        loginMessage.className = 'message';
        
        // Send login request
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                // Show error message
                loginMessage.textContent = data.error;
                loginMessage.className = 'message error';
            } else {
                // Show success message and redirect
                loginMessage.textContent = data.message;
                loginMessage.className = 'message success';
                
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            loginMessage.textContent = 'An error occurred. Please try again.';
            loginMessage.className = 'message error';
        });
    });
});
