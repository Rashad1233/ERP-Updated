document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page initialized, checking authentication status...');
    
    // Check if user is already logged in
    fetch('/api/user')
        .then(response => {
            console.log('Auth check response status:', response.status);
            if (response.ok) {
                // User is logged in, redirect to dashboard
                console.log('User is already authenticated, redirecting to dashboard...');
                window.location.href = 'dashboard.html';
            } else {
                console.log('User not authenticated, showing login form');
            }
        })
        .catch(error => {
            console.error('Error checking authentication:', error);
        });
    
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    
    // Add demo credentials message
    const demoCredentials = document.createElement('div');
    demoCredentials.className = 'demo-credentials';
    loginForm.appendChild(demoCredentials);
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Login form submitted');
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        console.log('Attempting login for username:', username);
        
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
        .then(response => {
            console.log('Login response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Login response data:', data);
            
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
