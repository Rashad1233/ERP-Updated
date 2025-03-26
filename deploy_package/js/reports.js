// Reports module

document.addEventListener('DOMContentLoaded', function() {
  // Check if on reports page
  if (!document.querySelector('.reports-grid')) return;
  
  // Setup event listeners
  document.getElementById('date-range').addEventListener('change', function() {
    const customDateRange = document.getElementById('custom-date-range');
    if (this.value === 'custom') {
      customDateRange.style.display = 'block';
    } else {
      customDateRange.style.display = 'none';
    }
  });
  
  // Set up modal close buttons
  const closeButtons = document.querySelectorAll('.modal .close, .btn[data-dismiss="modal"]');
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      modal.style.display = 'none';
    });
  });
  
  // Apply filters button
  document.getElementById('apply-filters').addEventListener('click', function() {
    const reportType = document.getElementById('report-filter-form').dataset.reportType;
    const dateRange = document.getElementById('date-range').value;
    
    let startDate, endDate;
    if (dateRange === 'custom') {
      startDate = document.getElementById('start-date').value;
      endDate = document.getElementById('end-date').value;
    }
    
    // Close modal
    document.getElementById('report-filter-modal').style.display = 'none';
    
    // Fetch report data with filters
    fetchReportData(reportType, dateRange, startDate, endDate);
  });
  
  // Export PDF button
  document.getElementById('export-pdf').addEventListener('click', function() {
    const reportTitle = document.getElementById('report-title').textContent;
    generatePDF('report-content', reportTitle.replace(/\s+/g, '_') + '.pdf');
  });
});

// Generate report based on type
function generateReport(reportType) {
  // Show filter modal with appropriate filters
  const filterModal = document.getElementById('report-filter-modal');
  const filterForm = document.getElementById('report-filter-form');
  const additionalFilters = document.getElementById('additional-filters');
  
  // Set report type as data attribute
  filterForm.dataset.reportType = reportType;
  
  // Clear previous additional filters
  additionalFilters.innerHTML = '';
  
  // Set filter title
  let filterTitle = 'Report Filters';
  
  // Add specific filters based on report type
  switch (reportType) {
    case 'sales':
      filterTitle = 'Sales Report Filters';
      additionalFilters.innerHTML = `
        <div class="form-group">
          <label for="client-filter">Client</label>
          <select id="client-filter">
            <option value="">All Clients</option>
          </select>
        </div>
        <div class="form-group">
          <label for="status-filter">Status</label>
          <select id="status-filter">
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      `;
      // Load clients for filter
      loadClientsForFilter();
      break;
      
    case 'inventory':
      filterTitle = 'Inventory Report Filters';
      additionalFilters.innerHTML = `
        <div class="form-group">
          <label for="stock-filter">Stock Level</label>
          <select id="stock-filter">
            <option value="">All Stock Levels</option>
            <option value="low">Low Stock</option>
            <option value="normal">Normal Stock</option>
            <option value="high">High Stock</option>
          </select>
        </div>
        <div class="form-group">
          <label for="supplier-filter">Supplier</label>
          <select id="supplier-filter">
            <option value="">All Suppliers</option>
          </select>
        </div>
      `;
      // Load suppliers for filter
      loadSuppliersForFilter();
      break;
      
    case 'clients':
      filterTitle = 'Client Report Filters';
      break;
      
    case 'suppliers':
      filterTitle = 'Supplier Report Filters';
      break;
      
    case 'lowstock':
      filterTitle = 'Low Stock Report Filters';
      break;
      
    case 'financial':
      filterTitle = 'Financial Report Filters';
      additionalFilters.innerHTML = `
        <div class="form-group">
          <label for="transaction-type">Transaction Type</label>
          <select id="transaction-type">
            <option value="">All Transactions</option>
            <option value="sales">Sales</option>
            <option value="purchases">Purchases</option>
          </select>
        </div>
      `;
      break;
  }
  
  // Update filter title
  document.getElementById('filter-title').textContent = filterTitle;
  
  // Show filter modal
  filterModal.style.display = 'block';
}

// Fetch report data with filters
function fetchReportData(reportType, dateRange, startDate, endDate) {
  // Prepare query parameters
  let params = new URLSearchParams();
  params.append('type', reportType);
  params.append('dateRange', dateRange);
  
  if (dateRange === 'custom') {
    params.append('startDate', startDate);
    params.append('endDate', endDate);
  }
  
  // Add additional filters based on report type
  switch (reportType) {
    case 'sales':
      const clientFilter = document.getElementById('client-filter');
      const statusFilter = document.getElementById('status-filter');
      
      if (clientFilter && clientFilter.value) {
        params.append('clientId', clientFilter.value);
      }
      
      if (statusFilter && statusFilter.value) {
        params.append('status', statusFilter.value);
      }
      break;
      
    case 'inventory':
      const stockFilter = document.getElementById('stock-filter');
      const supplierFilter = document.getElementById('supplier-filter');
      
      if (stockFilter && stockFilter.value) {
        params.append('stockLevel', stockFilter.value);
      }
      
      if (supplierFilter && supplierFilter.value) {
        params.append('supplierId', supplierFilter.value);
      }
      break;
      
    case 'financial':
      const transactionType = document.getElementById('transaction-type');
      
      if (transactionType && transactionType.value) {
        params.append('transactionType', transactionType.value);
      }
      break;
  }
  
  // Show loading state
  document.getElementById('report-result').style.display = 'block';
  document.getElementById('report-content').innerHTML = '<div class="loading">Loading report data...</div>';
  
  // Set report title
  let reportTitle = '';
  switch (reportType) {
    case 'sales': reportTitle = 'Sales Report'; break;
    case 'inventory': reportTitle = 'Inventory Report'; break;
    case 'clients': reportTitle = 'Client Report'; break;
    case 'suppliers': reportTitle = 'Supplier Report'; break;
    case 'lowstock': reportTitle = 'Low Stock Report'; break;
    case 'financial': reportTitle = 'Financial Report'; break;
  }
  document.getElementById('report-title').textContent = reportTitle;
  
  // Fetch report data
  fetch(`/api/reports?${params.toString()}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }
      return response.json();
    })
    .then(data => {
      renderReportData(reportType, data);
    })
    .catch(error => {
      document.getElementById('report-content').innerHTML = `
        <div class="error-message">
          <p>Error loading report: ${error.message}</p>
          <p>Please try again later or contact support.</p>
        </div>
      `;
    });
}

// Render report data based on type
function renderReportData(reportType, data) {
  const reportContent = document.getElementById('report-content');
  
  // If no data or empty data
  if (!data || !data.data || data.data.length === 0) {
    reportContent.innerHTML = '<div class="no-data">No data available for the selected filters.</div>';
    return;
  }
  
  // Render based on report type
  switch (reportType) {
    case 'sales':
      renderSalesReport(data);
      break;
      
    case 'inventory':
      renderInventoryReport(data);
      break;
      
    case 'clients':
      renderClientsReport(data);
      break;
      
    case 'suppliers':
      renderSuppliersReport(data);
      break;
      
    case 'lowstock':
      renderLowStockReport(data);
      break;
      
    case 'financial':
      renderFinancialReport(data);
      break;
      
    default:
      reportContent.innerHTML = '<div class="error-message">Unknown report type.</div>';
  }
}

// Helper functions to render specific reports
function renderSalesReport(data) {
  const reportContent = document.getElementById('report-content');
  
  // For now, we'll create a simple placeholder
  reportContent.innerHTML = `
    <div class="report-summary">
      <div class="summary-item">
        <h4>Total Sales</h4>
        <div class="summary-value">${formatCurrency(data.totalSales || 0)}</div>
      </div>
      <div class="summary-item">
        <h4>Number of Sales</h4>
        <div class="summary-value">${data.data.length}</div>
      </div>
      <div class="summary-item">
        <h4>Average Sale</h4>
        <div class="summary-value">${formatCurrency(data.averageSale || 0)}</div>
      </div>
    </div>
    
    <div class="report-chart">
      <h4>Sales Over Time</h4>
      <div class="chart-placeholder">Chart visualization would be displayed here</div>
    </div>
    
    <h4>Sales Details</h4>
    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Client</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${data.data.map(sale => `
          <tr>
            <td>${sale.id}</td>
            <td>${formatDate(sale.sale_date)}</td>
            <td>${sale.client_name}</td>
            <td>${formatCurrency(sale.total_amount)}</td>
            <td><span class="status-badge status-${sale.status.toLowerCase()}">${sale.status}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderInventoryReport(data) {
  const reportContent = document.getElementById('report-content');
  
  // Placeholder implementation
  reportContent.innerHTML = `
    <div class="report-summary">
      <div class="summary-item">
        <h4>Total Products</h4>
        <div class="summary-value">${data.totalProducts || 0}</div>
      </div>
      <div class="summary-item">
        <h4>Total Stock Value</h4>
        <div class="summary-value">${formatCurrency(data.totalValue || 0)}</div>
      </div>
      <div class="summary-item">
        <h4>Low Stock Items</h4>
        <div class="summary-value">${data.lowStockCount || 0}</div>
      </div>
    </div>
    
    <h4>Inventory Details</h4>
    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Product</th>
          <th>Current Stock</th>
          <th>Min Level</th>
          <th>Unit Price</th>
          <th>Total Value</th>
        </tr>
      </thead>
      <tbody>
        ${data.data.map(product => `
          <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.current_stock}</td>
            <td>${product.min_stock_level}</td>
            <td>${formatCurrency(product.unit_price)}</td>
            <td>${formatCurrency(product.current_stock * product.unit_price)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Helper functions for loading filter options
function loadClientsForFilter() {
  fetch('/api/clients')
    .then(response => response.json())
    .then(data => {
      const clientFilter = document.getElementById('client-filter');
      
      if (data.clients && data.clients.length > 0) {
        data.clients.forEach(client => {
          const option = document.createElement('option');
          option.value = client.id;
          option.textContent = client.name;
          clientFilter.appendChild(option);
        });
      }
    })
    .catch(error => {
      console.error('Error loading clients for filter:', error);
    });
}

function loadSuppliersForFilter() {
  fetch('/api/suppliers')
    .then(response => response.json())
    .then(data => {
      const supplierFilter = document.getElementById('supplier-filter');
      
      if (data.suppliers && data.suppliers.length > 0) {
        data.suppliers.forEach(supplier => {
          const option = document.createElement('option');
          option.value = supplier.id;
          option.textContent = supplier.name;
          supplierFilter.appendChild(option);
        });
      }
    })
    .catch(error => {
      console.error('Error loading suppliers for filter:', error);
    });
}

// Placeholder functions for other report types
function renderClientsReport(data) {
  const reportContent = document.getElementById('report-content');
  reportContent.innerHTML = '<div class="placeholder">Client report implementation coming soon.</div>';
}

function renderSuppliersReport(data) {
  const reportContent = document.getElementById('report-content');
  reportContent.innerHTML = '<div class="placeholder">Supplier report implementation coming soon.</div>';
}

function renderLowStockReport(data) {
  const reportContent = document.getElementById('report-content');
  reportContent.innerHTML = '<div class="placeholder">Low stock report implementation coming soon.</div>';
}

function renderFinancialReport(data) {
  const reportContent = document.getElementById('report-content');
  reportContent.innerHTML = '<div class="placeholder">Financial report implementation coming soon.</div>';
}

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

// PDF Generation function
function generatePDF(elementId, filename) {
  const element = document.getElementById(elementId);
  if (!element) {
    showNotification('Error generating PDF: Element not found', 'error');
    return;
  }
  
  // Show loading notification
  showNotification('Generating PDF...', 'info');
  
  // In a real application, you would use a library like jsPDF or html2pdf
  // For this demo, we'll just show a notification
  setTimeout(() => {
    showNotification('PDF generation is not implemented in this demo', 'warning');
  }, 1500);
  
  // Example of how you might implement it with html2pdf
  /*
  html2pdf()
    .from(element)
    .save(filename)
    .then(() => {
      showNotification('PDF generated successfully', 'success');
    })
    .catch(error => {
      showNotification('Error generating PDF: ' + error.message, 'error');
    });
  */
}

// Show notification function (reusing from common.js)
function showNotification(message, type = 'info') {
  // Check if notification container exists, if not create it
  let notificationContainer = document.getElementById('notification-container');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    document.body.appendChild(notificationContainer);
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <span class="notification-message">${message}</span>
    <button class="notification-close">&times;</button>
  `;
  
  // Add to container
  notificationContainer.appendChild(notification);
  
  // Add close button functionality
  const closeButton = notification.querySelector('.notification-close');
  closeButton.addEventListener('click', () => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.classList.add('fade-out');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}
