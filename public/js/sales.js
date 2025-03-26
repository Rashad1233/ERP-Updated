// Sales module

document.addEventListener('DOMContentLoaded', function() {
  // Check if on sales page
  if (!document.getElementById('sales-container')) return;
  
  // Initialize language system
  if (typeof initLanguage === 'function') {
    initLanguage();
  }
  
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
  
  // Add event listener for language changes
  document.addEventListener('languageChanged', function() {
    updateTableHeaders();
    // Reload sales with new language
    loadSales();
  });
  
  // Add event listener for when translations are applied
  document.addEventListener('translationsApplied', function(event) {
    console.log('Translations applied for language:', event.detail.language);
    // Force update of table headers and UI elements after translations are applied
    updateTableHeaders();
  });
});

// Helper function to get translation
function getTranslation(key, defaultText) {
  if (typeof translations !== 'undefined' && translations[currentLanguage] && translations[currentLanguage][key]) {
    return translations[currentLanguage][key];
  }
  return defaultText;
}

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
      const selectClientText = getTranslation('selectClient', 'Select Client');
      clientSelect.innerHTML = `<option value="">${selectClientText}</option>`;
      
      clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.name;
        clientSelect.appendChild(option);
      });
    })
    .catch(error => {
      const errorMessage = getTranslation('errorLoadingClients', 'Error loading clients:') + ' ' + error.message;
      showNotification(errorMessage, 'error');
    });
}

// Load products for dropdown
function loadProducts() {
  fetch('/api/products')
    .then(response => response.json())
    .then(data => {
      products = data.products;
      
      const productSelect = document.getElementById('product-select');
      const selectProductText = getTranslation('selectProduct', 'Select Product');
      const stockText = getTranslation('stock', 'Stock');
      productSelect.innerHTML = `<option value="">${selectProductText}</option>`;
      
      products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} (${stockText}: ${product.current_stock})`;
        option.dataset.price = product.unit_price;
        option.dataset.stock = product.current_stock;
        productSelect.appendChild(option);
      });
    })
    .catch(error => {
      const errorMessage = getTranslation('errorLoadingProducts', 'Error loading products:') + ' ' + error.message;
      showNotification(errorMessage, 'error');
    });
}

// Load sales data from API
function loadSales() {
  showLoadingIndicator();
  
  // Get filter values
  const statusFilter = document.getElementById('status-filter').value;
  const searchTerm = document.getElementById('search-sales').value.toLowerCase();
  
  let apiUrl = '/api/sales';
  if (statusFilter !== 'all') {
    apiUrl += `?status=${statusFilter}`;
  }
  
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displaySales(data.sales, searchTerm);
      hideLoadingIndicator();
    })
    .catch(error => {
      console.error('Error loading sales:', error);
      showNotification(getTranslation('errorLoadingSales', 'Error loading sales data'), 'error');
      hideLoadingIndicator();
    });
}

// Display sales in the table
function displaySales(sales, searchTerm = '') {
  const tableBody = document.querySelector('#sales-table tbody');
  tableBody.innerHTML = '';
  
  if (!sales || sales.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center">${getTranslation('noSalesFound', 'No sales found')}</td></tr>`;
    return;
  }
  
  // Filter sales by search term if provided
  let filteredSales = sales;
  if (searchTerm) {
    filteredSales = sales.filter(sale => {
      return (
        sale.id.toString().includes(searchTerm) ||
        (sale.client_name && sale.client_name.toLowerCase().includes(searchTerm)) ||
        formatDate(sale.date).includes(searchTerm) ||
        sale.status.toLowerCase().includes(searchTerm) ||
        formatCurrency(sale.total).includes(searchTerm)
      );
    });
  }
  
  if (filteredSales.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center">${getTranslation('noSalesMatchingFilters', 'No sales matching current filters')}</td></tr>`;
    return;
  }
  
  filteredSales.forEach(sale => {
    const row = document.createElement('tr');
    
    // Определяем класс для статуса
    let statusClass = '';
    switch(sale.status.toLowerCase()) {
      case 'completed':
        statusClass = 'status-completed';
        break;
      case 'pending':
        statusClass = 'status-pending';
        break;
      case 'cancelled':
        statusClass = 'status-cancelled';
        break;
    }
    
    // Создаем содержимое строки с учетом мобильной видимости
    row.innerHTML = `
      <td>${sale.id}</td>
      <td>${sale.client_name || getTranslation('unknownClient', 'Unknown client')}</td>
      <td class="mobile-hide">${formatDate(sale.date)}</td>
      <td>${formatCurrency(sale.total)}</td>
      <td class="col-status"><span class="status ${statusClass}">${getTranslation(sale.status.toLowerCase(), sale.status)}</span></td>
      <td class="col-actions">
        <div class="action-buttons">
          <button class="action-btn view-btn" data-id="${sale.id}" title="${getTranslation('view', 'View')}"><i class="fas fa-eye"></i></button>
          <button class="action-btn edit-btn" data-id="${sale.id}" title="${getTranslation('edit', 'Edit')}"><i class="fas fa-edit"></i></button>
          <button class="action-btn print-btn" data-id="${sale.id}" title="${getTranslation('print', 'Print')}"><i class="fas fa-print"></i></button>
        </div>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
  
  // Добавляем обработчики событий для кнопок действий
  addActionButtonHandlers();
  
  // Инициализируем мобильные улучшения
  initMobileEnhancements();
}

// Функция для инициализации мобильных улучшений
function initMobileEnhancements() {
  // Проверяем, находимся ли мы на мобильном устройстве
  if (window.innerWidth <= 576) {
    // Добавляем индикатор прокрутки к контейнерам таблиц
    const tableContainers = document.querySelectorAll('.table-responsive');
    tableContainers.forEach(container => {
      if (!container.querySelector('.scroll-indicator')) {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.textContent = getTranslation('swipeToScroll', 'Swipe horizontally to see more');
        container.appendChild(indicator);
      }
    });
  }
}

// Обработчик изменения размера окна для обновления мобильных улучшений
window.addEventListener('resize', initMobileEnhancements);

// Функция для обновления заголовков таблицы в соответствии с текущим языком
function updateTableHeaders() {
  // Обновляем заголовки таблицы
  const tableHeaders = document.querySelectorAll('#sales-table th');
  if (tableHeaders.length > 0) {
    // Обновление заголовков чистого HTML с учетом атрибутов data-i18n
    tableHeaders.forEach(th => {
      const key = th.getAttribute('data-i18n');
      if (key) {
        const translation = getTranslation(key, th.textContent);
        th.textContent = translation;
      }
    });
  }
  
  // Обновляем заголовок страницы
  const pageHeader = document.querySelector('.page-header h1');
  if (pageHeader) {
    const key = pageHeader.getAttribute('data-i18n');
    if (key) {
      pageHeader.textContent = getTranslation(key, pageHeader.textContent);
    }
  }
  
  // Обновляем кнопку "Новая продажа"
  const addSaleBtn = document.querySelector('#add-sale-btn span');
  if (addSaleBtn) {
    const key = addSaleBtn.getAttribute('data-i18n');
    if (key) {
      addSaleBtn.textContent = getTranslation(key, addSaleBtn.textContent);
    }
  }
  
  // Обновляем заголовок списка продаж
  const salesListHeader = document.querySelector('.widget-header h3');
  if (salesListHeader) {
    const key = salesListHeader.getAttribute('data-i18n');
    if (key) {
      salesListHeader.textContent = getTranslation(key, salesListHeader.textContent);
    }
  }
  
  // Обновляем placeholder поиска
  const searchInput = document.querySelector('#search-sales');
  if (searchInput) {
    const key = searchInput.getAttribute('data-i18n');
    if (key) {
      searchInput.placeholder = getTranslation(key, 'Search sales...');
    }
  }
  
  // Обновляем опции фильтра статуса
  const statusOptions = document.querySelectorAll('#status-filter option');
  statusOptions.forEach(option => {
    const key = option.getAttribute('data-i18n');
    if (key) {
      option.textContent = getTranslation(key, option.textContent);
    }
  });
}

// Show modal for adding a new sale
function showAddSaleModal() {
  // Reset the form
  document.getElementById('sale-form').reset();
  document.getElementById('sale-items-container').innerHTML = '';
  currentSaleItems = [];
  updateSaleTotal();
  
  // Update modal title
  const modalTitle = document.querySelector('#sale-modal .modal-header h2');
  if (modalTitle) {
    modalTitle.textContent = getTranslation('createNewSale', 'Create New Sale');
  }
  
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
  // Проверяем, выбран ли клиент
  const clientId = document.getElementById('client-select').value;
  if (!clientId) {
    const selectClientMessage = getTranslation('pleaseSelectClient', 'Please select a client');
    showNotification(selectClientMessage, 'error');
    return;
  }
  
  // Проверяем, есть ли товары в продаже
  if (currentSaleItems.length === 0) {
    const addItemsMessage = getTranslation('pleaseAddItems', 'Please add items to the sale');
    showNotification(addItemsMessage, 'error');
    return;
  }
  
  // Собираем данные для продажи
  const saleData = {
    client_id: clientId,
    items: currentSaleItems,
    total_amount: parseFloat(document.getElementById('sale-total-amount').value)
  };
  
  // Отправляем запрос
  fetch('/api/sales', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(saleData)
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(getTranslation('errorCreatingSale', 'Error creating sale'));
    }
  })
  .then(data => {
    // Закрываем модальное окно
    document.getElementById('sale-modal').style.display = 'none';
    
    // Показываем уведомление
    const successMessage = getTranslation('saleCompletedSuccessfully', 'Sale completed successfully');
    showNotification(successMessage, 'success');
    
    // Обновляем список продаж
    loadSales();
    
    // Проверяем уровень запасов
    checkLowStockAlerts();
  })
  .catch(error => {
    const errorMessage = getTranslation('errorCreatingSale', 'Error creating sale: ') + error.message;
    showNotification(errorMessage, 'error');
  });
}

// View sale details
function viewSaleDetails(saleId) {
  fetch(`/api/sales/${saleId}`)
    .then(response => response.json())
    .then(data => {
      const sale = data.sale;
      const detailsContainer = document.getElementById('sale-details-container');
      
      const clientLabel = getTranslation('client', 'Client');
      const dateLabel = getTranslation('date', 'Date');
      const statusLabel = getTranslation('status', 'Status');
      const totalLabel = getTranslation('total', 'Total');
      const itemsLabel = getTranslation('items', 'Items');
      const productLabel = getTranslation('product', 'Product');
      const quantityLabel = getTranslation('quantity', 'Quantity');
      const priceLabel = getTranslation('price', 'Price');
      const subtotalLabel = getTranslation('subtotal', 'Subtotal');
      
      // Translate status
      let statusDisplay = sale.status;
      if (sale.status.toLowerCase() === 'completed') {
        statusDisplay = getTranslation('completed', 'Completed');
      } else if (sale.status.toLowerCase() === 'pending') {
        statusDisplay = getTranslation('pending', 'Pending');
      } else if (sale.status.toLowerCase() === 'cancelled') {
        statusDisplay = getTranslation('cancelled', 'Cancelled');
      }
      
      let itemsHtml = '';
      if (sale.items && sale.items.length > 0) {
        itemsHtml = `
          <div class="sale-items">
            <h3>${itemsLabel}</h3>
            <table class="data-table">
              <thead>
                <tr>
                  <th>${productLabel}</th>
                  <th>${quantityLabel}</th>
                  <th>${priceLabel}</th>
                  <th>${subtotalLabel}</th>
                </tr>
              </thead>
              <tbody>
        `;
        
        sale.items.forEach(item => {
          itemsHtml += `
            <tr>
              <td>${item.product_name}</td>
              <td>${item.quantity}</td>
              <td>$${parseFloat(item.unit_price).toFixed(2)}</td>
              <td>$${(item.quantity * parseFloat(item.unit_price)).toFixed(2)}</td>
            </tr>
          `;
        });
        
        itemsHtml += `
              </tbody>
            </table>
          </div>
        `;
      }
      
      detailsContainer.innerHTML = `
        <div class="sale-details">
          <div class="sale-info">
            <p><strong>${clientLabel}:</strong> ${sale.client_name}</p>
            <p><strong>${dateLabel}:</strong> ${sale.sale_date}</p>
            <p><strong>${statusLabel}:</strong> <span class="status-badge ${sale.status.toLowerCase()}">${statusDisplay}</span></p>
            <p><strong>${totalLabel}:</strong> $${sale.total_amount.toFixed(2)}</p>
          </div>
          ${itemsHtml}
        </div>
      `;
      
      // Display the modal
      document.getElementById('sale-details-modal').style.display = 'block';
    })
    .catch(error => {
      const errorMessage = getTranslation('errorLoadingSaleDetails', 'Error loading sale details: ') + error.message;
      showNotification(errorMessage, 'error');
    });
}

// Generate PDF for sale
function generateSalePdf(saleId) {
  window.open(`/api/sales/${saleId}/pdf`, '_blank');
}

// Confirm delete sale
function confirmDeleteSale(saleId) {
  const confirmMessage = getTranslation('confirmDeleteSale', 'Are you sure you want to delete this sale?');
  if (confirm(confirmMessage)) {
    fetch(`/api/sales/${saleId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        const successMessage = getTranslation('saleDeleted', 'Sale has been deleted');
        showNotification(successMessage, 'success');
        loadSales();
      } else {
        throw new Error(getTranslation('errorDeletingSale', 'Error deleting sale'));
      }
    })
    .catch(error => {
      const errorMessage = getTranslation('errorDeletingSale', 'Error deleting sale: ') + error.message;
      showNotification(errorMessage, 'error');
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
  // Check if message is a translation key
  if (typeof message === 'string') {
    const messageKey = message.replace(/\s+/g, '').toLowerCase();
    if (messageKey === 'errorloadingclients:' || messageKey.startsWith('errorloadingclients')) {
      message = getTranslation('errorLoadingClients', 'Error loading clients:') + message.substring(messageKey.length);
    } else if (messageKey === 'errorloadingproducts:' || messageKey.startsWith('errorloadingproducts')) {
      message = getTranslation('errorLoadingProducts', 'Error loading products:') + message.substring(messageKey.length);
    } else if (messageKey === 'errorloadingsales:' || messageKey.startsWith('errorloadingsales')) {
      message = getTranslation('errorLoadingSales', 'Error loading sales:') + message.substring(messageKey.length);
    } else if (messageKey === 'salecompletedsuccessfully') {
      message = getTranslation('saleCompletedSuccessfully', 'Sale completed successfully');
    } else if (messageKey === 'errorcreatingsale:' || messageKey.startsWith('errorcreatingsale')) {
      message = getTranslation('errorCreatingSale', 'Error creating sale:') + message.substring(messageKey.length);
    } else if (messageKey === 'saledeleted') {
      message = getTranslation('saleDeleted', 'Sale has been deleted');
    } else if (messageKey === 'errordeletingsale:' || messageKey.startsWith('errordeletingsale')) {
      message = getTranslation('errorDeletingSale', 'Error deleting sale:') + message.substring(messageKey.length);
    }
  }
  
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
