// Clients module

document.addEventListener('DOMContentLoaded', function() {
  // Check if on clients page
  if (!document.getElementById('clients-container')) return;
  
  // Load clients
  loadClients();
  
  // Setup event listeners
  document.getElementById('add-client-btn').addEventListener('click', showAddClientModal);
  document.getElementById('save-client-btn').addEventListener('click', saveClient);
  
  // Search functionality
  document.getElementById('search-clients').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('#clients-table tbody tr');
    
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
  });
  
  // Modal close buttons
  const closeButtons = document.querySelectorAll('.modal .close, .btn[data-dismiss="modal"]');
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      modal.style.display = 'none';
    });
  });
});

// Load clients data
function loadClients() {
  fetch('/api/clients')
    .then(response => response.json())
    .then(data => {
      const clientsTable = document.getElementById('clients-table');
      const tableBody = clientsTable.querySelector('tbody');
      tableBody.innerHTML = '';
      
      if (!data.clients || data.clients.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No clients found</td></tr>';
        return;
      }
      
      data.clients.forEach(client => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${client.id}</td>
          <td>${client.name}</td>
          <td>${client.contact_person || '-'}</td>
          <td>${client.email || '-'}</td>
          <td>${client.phone || '-'}</td>
          <td>
            <div class="action-buttons">
              <button class="action-btn view-btn" data-id="${client.id}"><i class="fas fa-eye"></i></button>
              <button class="action-btn edit-btn" data-id="${client.id}"><i class="fas fa-edit"></i></button>
              <button class="action-btn delete-btn" data-id="${client.id}"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        `;
        tableBody.appendChild(row);
      });
      
      // Add event listeners
      document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
          const clientId = this.dataset.id;
          viewClientDetails(clientId);
        });
      });
      
      document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
          const clientId = this.dataset.id;
          editClient(clientId);
        });
      });
      
      document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
          const clientId = this.dataset.id;
          deleteClient(clientId);
        });
      });
    })
    .catch(error => {
      showNotification('Error loading clients: ' + error.message, 'error');
    });
}

// Show modal for adding a new client
function showAddClientModal() {
  // Reset form
  document.getElementById('client-form').reset();
  document.getElementById('client-id').value = '';
  document.getElementById('client-modal-title').textContent = 'Add New Client';
  
  // Show modal
  document.getElementById('client-modal').style.display = 'block';
}

// View client details
function viewClientDetails(clientId) {
  fetch(`/api/clients/${clientId}`)
    .then(response => response.json())
    .then(data => {
      const client = data.client;
      const detailsContainer = document.getElementById('client-details-container');
      
      detailsContainer.innerHTML = `
        <div class="details-section">
          <h3>${client.name}</h3>
          <div class="detail-item">
            <span class="detail-label">Contact Person:</span>
            <span class="detail-value">${client.contact_person || '-'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Email:</span>
            <span class="detail-value">${client.email || '-'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Phone:</span>
            <span class="detail-value">${client.phone || '-'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Address:</span>
            <span class="detail-value">${client.address || '-'}</span>
          </div>
        </div>
      `;
      
      document.getElementById('client-details-modal').style.display = 'block';
    })
    .catch(error => {
      showNotification('Error loading client details: ' + error.message, 'error');
    });
}

// Edit client
function editClient(clientId) {
  fetch(`/api/clients/${clientId}`)
    .then(response => response.json())
    .then(data => {
      const client = data.client;
      
      // Fill form with client data
      document.getElementById('client-id').value = client.id;
      document.getElementById('client-name').value = client.name;
      document.getElementById('contact-person').value = client.contact_person || '';
      document.getElementById('client-email').value = client.email || '';
      document.getElementById('client-phone').value = client.phone || '';
      document.getElementById('client-address').value = client.address || '';
      
      // Update modal title
      document.getElementById('client-modal-title').textContent = 'Edit Client';
      
      // Show modal
      document.getElementById('client-modal').style.display = 'block';
    })
    .catch(error => {
      showNotification('Error loading client details: ' + error.message, 'error');
    });
}

// Save client (create or update)
function saveClient() {
  const clientId = document.getElementById('client-id').value;
  const clientData = {
    name: document.getElementById('client-name').value,
    contact_person: document.getElementById('contact-person').value,
    email: document.getElementById('client-email').value,
    phone: document.getElementById('client-phone').value,
    address: document.getElementById('client-address').value
  };
  
  if (!clientData.name) {
    showNotification('Client name is required', 'error');
    return;
  }
  
  const url = clientId ? `/api/clients/${clientId}` : '/api/clients';
  const method = clientId ? 'PUT' : 'POST';
  
  fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(clientData)
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => { throw new Error(err.error || 'Failed to save client'); });
      }
      return response.json();
    })
    .then(data => {
      showNotification(`Client ${clientId ? 'updated' : 'created'} successfully`, 'success');
      document.getElementById('client-modal').style.display = 'none';
      loadClients();
    })
    .catch(error => {
      showNotification('Error: ' + error.message, 'error');
    });
}

// Delete client
function deleteClient(clientId) {
  if (confirm('Are you sure you want to delete this client?')) {
    fetch(`/api/clients/${clientId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.error || 'Failed to delete client'); });
        }
        return response.json();
      })
      .then(data => {
        showNotification('Client deleted successfully', 'success');
        loadClients();
      })
      .catch(error => {
        showNotification('Error: ' + error.message, 'error');
      });
  }
}

// Helper function to show notifications
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Hide and remove after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 5000);
}
