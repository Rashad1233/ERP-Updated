// Sales module

document.addEventListener('DOMContentLoaded', function() {
  // Check if on sales page
  if (!document.getElementById('sales-container')) return;
  
  // Initialize sales data
  loadClients();
  loadProducts();
  loadSales();
  
  // Setup event listeners
  document.getElementById('add-sale-btn').addEventListener('click', showAddSaleModal);
  document.getElementById('save-sale-btn').addEventListener('click', saveSale);
  
  // Add event listener for adding items to sale
  document.getElementById('add-item-btn').addEventListener('click', addItemToSale);

  // Add event listeners for closing modals
  const saleModal = document.getElementById('sale-modal');
  const closeButtons = document.querySelectorAll('.close');
  const cancelButtons = document.querySelectorAll('[data-dismiss="modal"]');

  // Close button (X) functionality
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  });

  // Cancel button functionality
  cancelButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  });

  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = 'none';
    }
  });

  // Add event listeners for buttons
  document.querySelectorAll('.view-btn').forEach(button => {
    button.addEventListener('click', function() {
      const saleId = this.dataset.id;
      viewSaleDetails(saleId);
    });
  });
  
  document.querySelectorAll('.pdf-btn').forEach(button => {
    button.addEventListener('click', function() {
      const saleId = this.dataset.id;
      generateSalePdf(saleId);
    });
  });
  
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function() {
      const saleId = this.dataset.id;
      confirmDeleteSale(saleId);
    });
  });
});

// Global variables
let clients = [];
let products = [];
let currentSaleItems = [];

// Load clients for dropdown
function loadClients() {
  fetch('/api/clients')
    .then(response => response.json())
    .then(data => {
      clients = data.clients;
      
      const clientSelect = document.getElementById('client-select');
      clientSelect.innerHTML = '<option value="">Select Client</option>';
      
      clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.name;
        clientSelect.appendChild(option);
      });
    })
    .catch(error => {
      showNotification('Error loading clients: ' + error.message, 'error');
    });
}

// Load products for dropdown
function loadProducts() {
  fetch('/api/products')
    .then(response => response.json())
    .then(data => {
      products = data.products;
      
      const productSelect = document.getElementById('product-select');
      productSelect.innerHTML = '<option value="">Select Product</option>';
      
      products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} (Stock: ${product.current_stock})`;
        option.dataset.price = product.unit_price;
        option.dataset.stock = product.current_stock;
        productSelect.appendChild(option);
      });
    })
    .catch(error => {
      showNotification('Error loading products: ' + error.message, 'error');
    });
}

// Load sales data
function loadSales() {
  fetch('/api/sales')
    .then(response => response.json())
    .then(data => {
      const salesTable = document.getElementById('sales-table');
      const tableBody = salesTable.querySelector('tbody');
      tableBody.innerHTML = '';
      
      if (data.sales.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No sales found</td></tr>';
        return;
      }
      
      data.sales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${sale.id}</td>
          <td>${sale.client_name}</td>
          <td>${sale.sale_date}</td>
          <td>$${sale.total_amount.toFixed(2)}</td>
          <td><span class="status-badge ${sale.status.toLowerCase()}">${sale.status}</span></td>
          <td>
            <div class="action-buttons">
              <button class="action-btn view-btn" data-id="${sale.id}"><i class="fas fa-eye"></i></button>
              <button class="action-btn pdf-btn" data-id="${sale.id}"><i class="fas fa-file-pdf"></i></button>
              <button class="action-btn delete-btn" data-id="${sale.id}"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(error => {
      showNotification('Error loading sales: ' + error.message, 'error');
    });
}

// Show modal for adding a new sale
function showAddSaleModal() {
  // Reset the form
  document.getElementById('sale-form').reset();
  document.getElementById('sale-items-container').innerHTML = '';
  currentSaleItems = [];
  updateSaleTotal();
  
  // Show the modal
  document.getElementById('sale-modal').style.display = 'block';
}

// Add item to the current sale
function addItemToSale() {
  const productSelect = document.getElementById('product-select');
  const quantity = document.getElementById('item-quantity').value;
  
  if (!productSelect.value || !quantity || quantity <= 0) {
    showNotification('Please select a product and enter a valid quantity', 'error');
    return;
  }
  
  const selectedOption = productSelect.options[productSelect.selectedIndex];
  const productId = productSelect.value;
  const productName = selectedOption.textContent.split(' (')[0];
  const unitPrice = parseFloat(selectedOption.dataset.price);
  const currentStock = parseInt(selectedOption.dataset.stock);
  const requestedQuantity = parseInt(quantity);
  
  // Check if enough stock
  if (requestedQuantity > currentStock) {
    showNotification(`Not enough stock. Only ${currentStock} available.`, 'error');
    return;
  }
  
  // Check if product already added
  const existingItemIndex = currentSaleItems.findIndex(item => item.product_id === productId);
  
  if (existingItemIndex >= 0) {
    // Update existing item
    const newQuantity = currentSaleItems[existingItemIndex].quantity + requestedQuantity;
    
    if (newQuantity > currentStock) {
      showNotification(`Cannot add more. Total would exceed available stock of ${currentStock}.`, 'error');
      return;
    }
    
    currentSaleItems[existingItemIndex].quantity = newQuantity;
    currentSaleItems[existingItemIndex].total = newQuantity * unitPrice;
  } else {
    // Add new item
    currentSaleItems.push({
      product_id: productId,
      product_name: productName,
      quantity: requestedQuantity,
      unit_price: unitPrice,
      total: requestedQuantity * unitPrice
    });
  }
  
  // Update the UI
  renderSaleItems();
  updateSaleTotal();
  
  // Reset inputs
  document.getElementById('product-select').value = '';
  document.getElementById('item-quantity').value = '1';
}

// Render items in the current sale
function renderSaleItems() {
  const container = document.getElementById('sale-items-container');
  container.innerHTML = '';
  
  if (currentSaleItems.length === 0) {
    container.innerHTML = '<p>No items added yet</p>';
    return;
  }
  
  const itemsList = document.createElement('div');
  itemsList.className = 'sale-items-list';
  
  currentSaleItems.forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'sale-item';
    itemElement.innerHTML = `
      <div class="item-details">
        <span class="item-name">${item.product_name}</span>
        <span class="item-quantity">${item.quantity} x $${item.unit_price.toFixed(2)}</span>
        <span class="item-total">$${item.total.toFixed(2)}</span>
      </div>
      <button class="remove-item-btn" data-index="${index}">
        <i class="fas fa-times"></i>
      </button>
    `;
    itemsList.appendChild(itemElement);
  });
  
  container.appendChild(itemsList);
  
  // Add event listeners to remove buttons
  document.querySelectorAll('.remove-item-btn').forEach(button => {
    button.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      currentSaleItems.splice(index, 1);
      renderSaleItems();
      updateSaleTotal();
    });
  });
}

// Update the total for the current sale
function updateSaleTotal() {
  const totalElement = document.getElementById('sale-total');
  const total = currentSaleItems.reduce((sum, item) => sum + item.total, 0);
  totalElement.textContent = `$${total.toFixed(2)}`;
  document.getElementById('sale-total-amount').value = total;
}

// Save the sale
function saveSale() {
  const clientId = document.getElementById('client-select').value;
  const totalAmount = parseFloat(document.getElementById('sale-total-amount').value);
  
  if (!clientId) {
    showNotification('Please select a client', 'error');
    return;
  }
  
  if (currentSaleItems.length === 0) {
    showNotification('Please add at least one item to the sale', 'error');
    return;
  }
  
  const saleData = {
    client_id: clientId,
    sale_date: new Date().toISOString(),
    total_amount: totalAmount,
    status: 'completed',
    items: currentSaleItems.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price
    }))
  };
  
  // Send to server
  fetch('/api/sales', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(saleData)
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => { throw new Error(err.error || 'Failed to save sale'); });
      }
      return response.json();
    })
    .then(data => {
      showNotification('Sale created successfully', 'success');
      document.getElementById('sale-modal').style.display = 'none';
      
      // Reload sales and products (to update stock levels)
      loadSales();
      loadProducts();
      
      // Check for low stock alerts
      checkLowStockAlerts();
    })
    .catch(error => {
      showNotification('Error: ' + error.message, 'error');
    });
}

// View sale details
function viewSaleDetails(saleId) {
  fetch(`/api/sales/${saleId}`)
    .then(response => response.json())
    .then(data => {
      const sale = data.sale;
      const detailsModal = document.getElementById('sale-details-modal');
      const detailsContainer = document.getElementById('sale-details-container');
      
      detailsContainer.innerHTML = `
        <h2>Sale #${sale.id}</h2>
        <p><strong>Client:</strong> ${sale.client_name}</p>
        <p><strong>Date:</strong> ${sale.sale_date}</p>
        <p><strong>Status:</strong> ${sale.status}</p>
        
        <h3>Items</h3>
        <table class="details-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${sale.items.map(item => `
              <tr>
                <td>${item.product_name}</td>
                <td>${item.quantity}</td>
                <td>$${item.unit_price.toFixed(2)}</td>
                <td>$${item.total_price.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3"><strong>Total</strong></td>
              <td><strong>$${sale.total_amount.toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>
      `;
      
      detailsModal.style.display = 'block';
      
      // Close button
      const closeBtn = detailsModal.querySelector('.close');
      closeBtn.onclick = function() {
        detailsModal.style.display = 'none';
      };
    })
    .catch(error => {
      showNotification('Error loading sale details: ' + error.message, 'error');
    });
}

// Generate PDF for sale
function generateSalePdf(saleId) {
  window.open(`/api/sales/${saleId}/pdf`, '_blank');
}

// Confirm delete sale
function confirmDeleteSale(saleId) {
  if (confirm('Are you sure you want to delete this sale? This will restore product stock levels.')) {
    fetch(`/api/sales/${saleId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.error || 'Failed to delete sale'); });
        }
        return response.json();
      })
      .then(data => {
        showNotification('Sale deleted successfully', 'success');
        loadSales();
        loadProducts();
      })
      .catch(error => {
        showNotification('Error: ' + error.message, 'error');
      });
  }
}

// Check for low stock alerts
function checkLowStockAlerts() {
  fetch('/api/low-stock-alerts')
    .then(response => response.json())
    .then(data => {
      if (data.alerts && data.alerts.length > 0) {
        showLowStockAlert(data.alerts);
      }
    })
    .catch(error => {
      console.error('Error checking low stock alerts:', error);
    });
}

// Show low stock alert
function showLowStockAlert(alerts) {
  const alertModal = document.getElementById('low-stock-alert-modal');
  const alertContainer = document.getElementById('low-stock-alert-container');
  
  alertContainer.innerHTML = `
    <h2>Low Stock Alert</h2>
    <p>The following products are below minimum stock levels:</p>
    
    <table class="details-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Current Stock</th>
          <th>Min Level</th>
          <th>Best Supplier</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        ${alerts.map(alert => `
          <tr>
            <td>${alert.product_name}</td>
            <td>${alert.current_stock}</td>
            <td>${alert.min_stock_level}</td>
            <td>${alert.supplier_name || 'N/A'}</td>
            <td>${alert.best_supplier_price ? '$' + alert.best_supplier_price.toFixed(2) : 'N/A'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <p>Would you like to create purchase orders for these items?</p>
    <div class="alert-actions">
      <button id="create-orders-btn" class="btn primary-btn">Create Purchase Orders</button>
      <button id="dismiss-alert-btn" class="btn">Dismiss</button>
    </div>
  `;
  
  alertModal.style.display = 'block';
  
  // Event listeners
  document.getElementById('dismiss-alert-btn').addEventListener('click', function() {
    alertModal.style.display = 'none';
  });
  
  document.getElementById('create-orders-btn').addEventListener('click', function() {
    // Redirect to purchase orders page
    window.location.href = '/purchase-orders.html';
  });
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
