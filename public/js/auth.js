document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth.js loaded, checking if user is logged in...');
    // Check if user is logged in
    fetch('/api/user')
        .then(response => {
            console.log('Auth check response status:', response.status);
            if (!response.ok) {
                console.log('User not authenticated, redirecting to login page');
                // User is not logged in, redirect to login page
                window.location.href = 'index.html';
            }
            return response.json();
        })
        .then(data => {
            if (data && data.user) {
                // User is logged in, do nothing
                console.log('Logged in as:', data.user.username);
            }
        })
        .catch(error => {
            console.error('Error checking authentication:', error);
            // Redirect to login page on error
            window.location.href = 'index.html';
        });
    
    // Handle logout button click
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            fetch('/api/logout')
                .then(response => response.json())
                .then(data => {
                    // Redirect to login page
                    window.location.href = 'index.html';
                })
                .catch(error => {
                    console.error('Logout error:', error);
                    // Still redirect to login page on error
                    window.location.href = 'index.html';
                });
        });
    }
});
