// Common functionality shared across the application

document.addEventListener('DOMContentLoaded', function() {
  // Sidebar toggle functionality
  const toggleBtn = document.querySelector('.toggle-sidebar');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      document.querySelector('.app-container').classList.toggle('sidebar-collapsed');
    });
  }
  
  // Logout button functionality
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      fetch('/api/logout', {
        method: 'POST',
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            window.location.href = '/login.html';
          }
        })
        .catch(error => {
          console.error('Logout error:', error);
          alert('Error during logout. Please try again.');
        });
    });
  }
  
  // Show username in the top bar if available
  const usernameElement = document.getElementById('username');
  if (usernameElement) {
    fetch('/api/user-info')
      .then(response => response.json())
      .then(data => {
        if (data.username) {
          usernameElement.textContent = data.username;
        }
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
      });
  }
  
  // Set up global notification system
  setupNotifications();
});

// Set up notification system
function setupNotifications() {
  // Create notification container if it doesn't exist
  if (!document.querySelector('.notification-container')) {
    const container = document.createElement('div');
    container.className = 'notification-container';
    document.body.appendChild(container);
  }
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Add to container or body
  const container = document.querySelector('.notification-container') || document.body;
  container.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Hide and remove after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      container.removeChild(notification);
    }, 300);
  }, 5000);
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

// Format date
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Simple date format (no time)
function formatSimpleDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  }).format(date);
}

// Get current date in ISO format
function getCurrentDateISO() {
  return new Date().toISOString().split('T')[0];
}

// Generate a PDF from HTML content
function generatePDF(elementId, filename) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found:', elementId);
    return;
  }
  
  html2pdf()
    .from(element)
    .save(filename);
}
