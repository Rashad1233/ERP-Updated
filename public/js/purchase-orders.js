/**
 * Purchase Orders Management - ERP System
 * Handles all purchase order related functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize language system if not already initialized
    if (typeof initLanguage === 'function' && (!window.erpLanguage || !window.erpLanguage.current)) {
        initLanguage();
    }
    
    // Initialize page components
    initModals();
    initForms();
    initEventListeners();
    
    // Load data
    loadOrderStatistics();
    loadOrders();
    loadSuppliers();
    loadProductsForDropdown();
    
    // Initialize pagination
    initPagination();
    
    // Initialize filters
    initFilters();
    
    // Check URL parameters for supplier pre-selection
    checkUrlParameters();
    
    // Обновление статистики на странице
    updateStatistics();
    
    // Обработчик для кнопки создания нового заказа
    document.getElementById('newPOBtn').addEventListener('click', function() {
        // Здесь будет открытие формы создания нового заказа
        console.log('Creating new purchase order');
    });
});

/**
 * Initialize modals
 */
function initModals() {
    // New/Edit order modal
    const orderModal = document.getElementById('orderModal');
    const newOrderBtn = document.getElementById('newOrderBtn');
    const closeOrderBtn = orderModal.querySelector('.close');
    const cancelOrderBtn = document.getElementById('cancelOrderBtn');
    
    newOrderBtn.addEventListener('click', function() {
        openNewOrderModal();
    });
    
    closeOrderBtn.addEventListener('click', function() {
        closeModal(orderModal);
    });
    
    cancelOrderBtn.addEventListener('click', function() {
        closeModal(orderModal);
    });
    
    // View order modal
    const viewOrderModal = document.getElementById('viewOrderModal');
    const closeViewOrderBtn = viewOrderModal.querySelector('.close');
    const closeViewBtn = document.getElementById('closeViewOrderBtn');
    
    closeViewOrderBtn.addEventListener('click', function() {
        closeModal(viewOrderModal);
    });
    
    closeViewBtn.addEventListener('click', function() {
        closeModal(viewOrderModal);
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === orderModal) {
            closeModal(orderModal);
        }
        if (event.target === viewOrderModal) {
            closeModal(viewOrderModal);
        }
    });
}

/**
 * Initialize forms
 */
function initForms() {
    const orderForm = document.getElementById('orderForm');
    
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveOrder();
    });
    
    // Set current date for order date field
    const orderDateField = document.getElementById('orderDate');
    if (orderDateField) {
        const today = new Date();
        const formattedDate = today.toISOString().substring(0, 10);
        orderDateField.value = formattedDate;
    }
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Add item button
    const addItemBtn = document.getElementById('addItemBtn');
    addItemBtn.addEventListener('click', function() {
        addOrderItem();
    });
    
    // Order table actions
    document.addEventListener('click', function(e) {
        if (e.target.closest('.view-order-btn')) {
            const orderId = e.target.closest('.view-order-btn').dataset.id;
            viewOrder(orderId);
        } else if (e.target.closest('.edit-order-btn')) {
            const orderId = e.target.closest('.edit-order-btn').dataset.id;
            editOrder(orderId);
        } else if (e.target.closest('.cancel-order-btn')) {
            const orderId = e.target.closest('.cancel-order-btn').dataset.id;
            if (confirm(getTranslation('confirmCancelOrder', 'Are you sure you want to cancel this order?'))) {
                cancelOrder(orderId);
            }
        } else if (e.target.closest('.print-order-btn')) {
            const orderId = e.target.closest('.print-order-btn').dataset.id;
            printOrder(orderId);
        } else if (e.target.closest('.remove-item')) {
            if (!e.target.closest('.remove-item').disabled) {
                removeOrderItem(e.target.closest('.remove-item'));
                updateOrderSummary();
            }
        }
    });
    
    // Modal action buttons
    document.getElementById('editViewOrderBtn').addEventListener('click', function() {
        const orderId = document.getElementById('view-order-id').textContent;
        closeModal(document.getElementById('viewOrderModal'));
        editOrder(orderId);
    });
    
    document.getElementById('printViewOrderBtn').addEventListener('click', function() {
        const orderId = document.getElementById('view-order-id').textContent;
        printOrder(orderId);
    });
    
    document.getElementById('changeStatusBtn').addEventListener('click', function() {
        const orderId = document.getElementById('view-order-id').textContent;
        changeOrderStatus(orderId);
    });
}

/**
 * Initialize pagination
 */
function initPagination() {
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const paginationPages = document.querySelectorAll('.pagination-page');
    
    prevPageBtn.addEventListener('click', function() {
        if (!this.disabled) {
            goToPreviousPage();
        }
    });
    
    nextPageBtn.addEventListener('click', function() {
        if (!this.disabled) {
            goToNextPage();
        }
    });
    
    paginationPages.forEach(page => {
        page.addEventListener('click', function() {
            const pageNum = parseInt(this.textContent);
            goToPage(pageNum);
        });
    });
}

/**
 * Initialize filters
 */
function initFilters() {
    // Обработчик для кнопки поиска
    document.querySelector('.btn-search').addEventListener('click', function() {
        applyFilters();
    });
    
    // Обработчик для кнопки применения фильтров
    document.getElementById('applyFilters').addEventListener('click', function() {
        applyFilters();
    });
    
    // Обработчик для кнопки сброса фильтров
    document.getElementById('resetFilters').addEventListener('click', function() {
        resetFilters();
    });
    
    // Обработчик для поля поиска (при нажатии Enter)
    document.getElementById('orderSearch').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            applyFilters();
        }
    });
}

/**
 * Check URL parameters for pre-selection
 */
function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const supplierId = urlParams.get('supplier');
    const supplierName = urlParams.get('name');
    
    if (supplierId && supplierName) {
        // Pre-select supplier and open new order modal
        openNewOrderModal(supplierId, supplierName);
    }
}

/**
 * Open new order modal
 */
function openNewOrderModal(supplierId = null, supplierName = null) {
    const orderForm = document.getElementById('orderForm');
    orderForm.reset();
    document.getElementById('orderId').value = '';
    document.getElementById('orderModalTitle').textContent = getTranslation('newOrder', 'New Purchase Order');
    
    // Reset order items
    document.getElementById('orderItems').innerHTML = `
        <div class="order-item">
            <div class="form-row">
                <div class="form-group">
                    <label for="product-0">${getTranslation('product', 'Product')}</label>
                    <select id="product-0" class="product-select" required>
                        <option value="">-- ${getTranslation('selectProduct', 'Select a product')} --</option>
                        <!-- Products will be loaded here -->
                    </select>
                </div>
                <div class="form-group">
                    <label for="quantity-0">${getTranslation('quantity', 'Quantity')}</label>
                    <input type="number" id="quantity-0" class="quantity-input" min="1" value="1" required>
                </div>
                <div class="form-group">
                    <label for="price-0">${getTranslation('price', 'Price')}</label>
                    <input type="number" id="price-0" class="price-input" step="0.01" min="0" required>
                </div>
                <div class="form-group">
                    <label for="total-0">${getTranslation('total', 'Total')}</label>
                    <input type="number" id="total-0" class="total-input" step="0.01" min="0" readonly>
                </div>
                <button type="button" class="btn-danger remove-item" disabled><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `;
    
    // Load products for the first item
    loadProductsForItem(0);
    
    // Reset summary
    document.getElementById('totalItems').textContent = '1';
    document.getElementById('orderTotal').textContent = formatCurrency(0);
    
    // Pre-select supplier if provided
    if (supplierId && supplierName) {
        const supplierSelect = document.getElementById('orderSupplier');
        // Add supplier option if it doesn't exist
        let supplierExists = false;
        for (let i = 0; i < supplierSelect.options.length; i++) {
            if (supplierSelect.options[i].value === supplierId) {
                supplierExists = true;
                break;
            }
        }
        
        if (!supplierExists) {
            const option = document.createElement('option');
            option.value = supplierId;
            option.textContent = supplierName;
            supplierSelect.appendChild(option);
        }
        
        supplierSelect.value = supplierId;
    }
    
    // Open modal
    const orderModal = document.getElementById('orderModal');
    openModal(orderModal);
}

/**
 * Load order statistics
 */
function loadOrderStatistics() {
    // In a real application, data would be fetched from the server
    // Simulating data load
    setTimeout(function() {
        document.getElementById('totalOrdersCount').textContent = '42';
        document.getElementById('pendingOrdersCount').textContent = '8';
        document.getElementById('shippedOrdersCount').textContent = '5';
        document.getElementById('totalValueCount').textContent = formatCurrency(4250000);
    }, 500);
}

/**
 * Load orders data
 */
function loadOrders(page = 1) {
    // In a real application, data would be fetched from the server
    // Simulating loading indicator
    const tableBody = document.getElementById('ordersTable');
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center">${getTranslation('loading', 'Loading data...')}</td></tr>`;
    
    // Simulating data load delay
    setTimeout(function() {
        // Data is already in HTML for demonstration
        // In a real application, this would be populated with server data
        
        updatePagination(page, 3); // 3 pages total
    }, 800);
}

/**
 * Apply filters to orders
 */
function applyFilters() {
    const searchQuery = document.getElementById('orderSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const supplierFilter = document.getElementById('supplierFilter').value;
    const dateFromFilter = document.getElementById('dateFromFilter').value;
    const dateToFilter = document.getElementById('dateToFilter').value;
    
    const rows = document.querySelectorAll('#ordersTable tr');
    
    rows.forEach(row => {
        let shouldShow = true;
        
        // Проверка текстового поиска
        if (searchQuery) {
            const textContent = row.textContent.toLowerCase();
            if (!textContent.includes(searchQuery)) {
                shouldShow = false;
            }
        }
        
        // Проверка фильтра статуса
        if (statusFilter !== 'all') {
            const statusCell = row.querySelector('td:nth-child(5)');
            if (statusCell) {
                const statusText = statusCell.textContent.toLowerCase();
                if (!statusText.includes(statusFilter.toLowerCase())) {
                    shouldShow = false;
                }
            }
        }
        
        // Проверка фильтра поставщика
        if (supplierFilter !== 'all') {
            const supplierCell = row.querySelector('td:nth-child(2)');
            if (supplierCell) {
                const supplierText = supplierCell.textContent.toLowerCase();
                const supplierFilterText = supplierFilter.replace(/-/g, ' ');
                if (!supplierText.includes(supplierFilterText)) {
                    shouldShow = false;
                }
            }
        }
        
        // Проверка фильтра даты (от)
        if (dateFromFilter) {
            const dateCell = row.querySelector('td:nth-child(3)');
            if (dateCell) {
                const orderDate = new Date(dateCell.textContent);
                const fromDate = new Date(dateFromFilter);
                if (orderDate < fromDate) {
                    shouldShow = false;
                }
            }
        }
        
        // Проверка фильтра даты (до)
        if (dateToFilter) {
            const dateCell = row.querySelector('td:nth-child(3)');
            if (dateCell) {
                const orderDate = new Date(dateCell.textContent);
                const toDate = new Date(dateToFilter);
                if (orderDate > toDate) {
                    shouldShow = false;
                }
            }
        }
        
        // Показываем или скрываем строку
        row.style.display = shouldShow ? '' : 'none';
    });
    
    // Обновляем статистику после применения фильтров
    updateFilteredStatistics();
}

/**
 * Reset filters
 */
function resetFilters() {
    document.getElementById('orderSearch').value = '';
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('supplierFilter').value = 'all';
    document.getElementById('dateFromFilter').value = '';
    document.getElementById('dateToFilter').value = '';
    
    // Показываем все строки
    const rows = document.querySelectorAll('#ordersTable tr');
    rows.forEach(row => {
        row.style.display = '';
    });
    
    // Обновляем статистику
    updateStatistics();
}

/**
 * Load products for dropdown
 */
function loadProductsForDropdown() {
    // In a real application, data would be fetched from the server
    // For demo purposes, product options are added directly in the HTML
}

/**
 * Load products for a specific order item
 */
function loadProductsForItem(index) {
    const productSelect = document.getElementById(`product-${index}`);
    const quantityInput = document.getElementById(`quantity-${index}`);
    const priceInput = document.getElementById(`price-${index}`);
    const totalInput = document.getElementById(`total-${index}`);
    
    // Add event listeners to update values when product is selected
    productSelect.addEventListener('change', function() {
        // In a real application, this would fetch the product price
        // For demo, we'll set a random price
        const price = Math.floor(Math.random() * 10000) + 1000;
        priceInput.value = price.toFixed(2);
        calculateItemTotal(this);
    });
    
    // Add event listener to update total when quantity changes
    quantityInput.addEventListener('input', function() {
        calculateItemTotal(this);
    });
    
    // Add event listener to update total when price changes
    priceInput.addEventListener('input', function() {
        calculateItemTotal(this);
    });
}

/**
 * Load suppliers for dropdown
 */
function loadSuppliers() {
    // In a real application, data would be fetched from the server
    // For demo purposes, supplier options are added directly in the HTML
}

/**
 * Add new order item
 */
function addOrderItem() {
    const orderItems = document.getElementById('orderItems');
    const items = orderItems.querySelectorAll('.order-item');
    const lastItem = items[items.length - 1];
    
    // Clone the last item
    const newItem = lastItem.cloneNode(true);
    
    // Update element IDs
    const index = items.length;
    const productSelect = newItem.querySelector('.product-select');
    const quantityInput = newItem.querySelector('.quantity-input');
    const priceInput = newItem.querySelector('.price-input');
    const totalInput = newItem.querySelector('.total-input');
    const removeButton = newItem.querySelector('.remove-item');
    
    productSelect.id = `product-${index}`;
    quantityInput.id = `quantity-${index}`;
    priceInput.id = `price-${index}`;
    totalInput.id = `total-${index}`;
    
    // Reset values
    productSelect.selectedIndex = 0;
    quantityInput.value = 1;
    priceInput.value = '';
    totalInput.value = '';
    
    // Enable remove button
    removeButton.disabled = false;
    
    // Add new item to container
    orderItems.appendChild(newItem);
    
    // Load products for the new item
    loadProductsForItem(index);
    
    // Update order summary
    updateOrderSummary();
}

/**
 * Remove order item
 */
function removeOrderItem(button) {
    const orderItem = button.closest('.order-item');
    const orderItemsContainer = document.getElementById('orderItems');
    
    // Check if this is not the only item
    if (orderItemsContainer.querySelectorAll('.order-item').length > 1) {
        orderItem.remove();
    }
}

/**
 * Calculate item total
 */
function calculateItemTotal(input) {
    const orderItem = input.closest('.order-item');
    const quantityInput = orderItem.querySelector('.quantity-input');
    const priceInput = orderItem.querySelector('.price-input');
    const totalInput = orderItem.querySelector('.total-input');
    
    const quantity = parseFloat(quantityInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    const total = quantity * price;
    
    totalInput.value = total.toFixed(2);
    
    // Update order summary
    updateOrderSummary();
}

/**
 * Update order summary
 */
function updateOrderSummary() {
    const orderItems = document.querySelectorAll('.order-item');
    const totalItemsElement = document.getElementById('totalItems');
    const orderTotalElement = document.getElementById('orderTotal');
    
    // Update items count
    totalItemsElement.textContent = orderItems.length;
    
    // Calculate total amount
    let total = 0;
    orderItems.forEach(item => {
        const totalInput = item.querySelector('.total-input');
        total += parseFloat(totalInput.value) || 0;
    });
    
    // Update total amount
    orderTotalElement.textContent = formatCurrency(total);
}

/**
 * Save order
 */
function saveOrder() {
    const orderForm = document.getElementById('orderForm');
    const orderId = document.getElementById('orderId').value;
    
    // Validate form
    if (!orderForm.checkValidity()) {
        orderForm.reportValidity();
        return;
    }
    
    // Validate supplier
    const orderSupplier = document.getElementById('orderSupplier');
    if (orderSupplier.value === '') {
        showNotification(getTranslation('pleaseSelectSupplier', 'Please select a supplier'), 'error');
        orderSupplier.focus();
        return;
    }
    
    // Validate items and quantities
    const orderItems = document.querySelectorAll('.order-item');
    let validItems = true;
    orderItems.forEach(item => {
        const productSelect = item.querySelector('.product-select');
        const quantityInput = item.querySelector('.quantity-input');
        const priceInput = item.querySelector('.price-input');
        
        if (productSelect.value === '') {
            validItems = false;
            showNotification(getTranslation('pleaseSelectProduct', 'Please select a product for each item'), 'error');
            productSelect.focus();
        } else if (!quantityInput.value || parseInt(quantityInput.value) <= 0) {
            validItems = false;
            showNotification(getTranslation('quantityMustBeGreaterThanZero', 'Quantity must be greater than zero'), 'error');
            quantityInput.focus();
        } else if (!priceInput.value || parseFloat(priceInput.value) <= 0) {
            validItems = false;
            showNotification(getTranslation('priceMustBeGreaterThanZero', 'Price must be greater than zero'), 'error');
            priceInput.focus();
        }
    });
    
    if (!validItems) return;
    
    // Collect order data
    const orderData = {
        id: orderId || generateOrderId(),
        supplier: {
            id: orderSupplier.value,
            name: orderSupplier.options[orderSupplier.selectedIndex].text
        },
        date: document.getElementById('orderDate').value,
        rfq: document.getElementById('orderRfq').value,
        expectedDelivery: document.getElementById('expectedDelivery').value,
        shippingMethod: document.getElementById('shippingMethod').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        deliveryAddress: document.getElementById('deliveryAddress').value,
        notes: document.getElementById('orderNotes').value,
        items: []
    };
    
    // Collect order items
    orderItems.forEach(item => {
        const productSelect = item.querySelector('.product-select');
        const quantityInput = item.querySelector('.quantity-input');
        const priceInput = item.querySelector('.price-input');
        
        if (productSelect.value) {
            orderData.items.push({
                product: {
                    id: productSelect.value,
                    name: productSelect.options[productSelect.selectedIndex].text
                },
                quantity: parseInt(quantityInput.value),
                price: parseFloat(priceInput.value),
                total: parseFloat(quantityInput.value) * parseFloat(priceInput.value)
            });
        }
    });
    
    console.log('Saving order:', orderData);
    
    // In a real application, data would be sent to the server
    // Simulating save
    const orderModal = document.getElementById('orderModal');
    closeModal(orderModal);
    
    if (orderId) {
        showNotification(getTranslation('orderUpdated', 'Order successfully updated'), 'success');
    } else {
        showNotification(getTranslation('orderCreated', 'Order successfully created'), 'success');
    }
    
    // Reload data
    loadOrderStatistics();
    loadOrders();
}

/**
 * Generate order ID
 */
function generateOrderId() {
    const year = new Date().getFullYear();
    const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PO-${year}-${randomPart}`;
}

/**
 * View order details
 */
function viewOrder(orderId) {
    console.log('Viewing order:', orderId);
    
    // In a real application, data would be fetched from the server
    // Simulating loading data
    
    // Open view modal
    const viewOrderModal = document.getElementById('viewOrderModal');
    openModal(viewOrderModal);
    
    // Order data is already in the HTML for demonstration
    // The IDs in the demo data match the example IDs in the HTML
}

/**
 * Edit order
 */
function editOrder(orderId) {
    console.log('Editing order:', orderId);
    
    // In a real application, data would be fetched from the server
    // Simulating loading data
    
    // Open edit modal with order data
    const orderModal = document.getElementById('orderModal');
    document.getElementById('orderId').value = orderId;
    document.getElementById('orderModalTitle').textContent = getTranslation('editOrder', 'Edit Order');
    
    // Order data is simulated for specific IDs
    // In a real application, this would be loaded from the server
    
    openModal(orderModal);
}

/**
 * Cancel order
 */
function cancelOrder(orderId) {
    console.log('Canceling order:', orderId);
    
    // In a real application, this would be sent to the server
    // Simulating cancellation
    showNotification(getTranslation('orderCancelled', 'Order successfully cancelled'), 'success');
    
    // Reload data
    loadOrderStatistics();
    loadOrders();
}

/**
 * Print order
 */
function printOrder(orderId) {
    console.log('Printing order:', orderId);
    
    // In a real application, this would generate a printable document
    // Simulating print
    showNotification(getTranslation('preparingPrint', 'Preparing print...'), 'info');
    
    // Simulate opening print dialog
    setTimeout(function() {
        window.print();
    }, 300);
}

/**
 * Change order status
 */
function changeOrderStatus(orderId) {
    console.log('Changing order status:', orderId);
    
    // In a real application, this would show a modal with status options
    // Simulating status change
    const statuses = ['pending', 'processing', 'shipped', 'received', 'completed', 'cancelled'];
    const statusLabels = {
        pending: getTranslation('pending', 'Pending'),
        processing: getTranslation('processing', 'Processing'),
        shipped: getTranslation('shipped', 'Shipped'),
        received: getTranslation('received', 'Received'),
        completed: getTranslation('completed', 'Completed'),
        cancelled: getTranslation('cancelled', 'Cancelled')
    };
    
    // Create a prompt with translated status options
    let promptText = getTranslation('selectNewStatus', 'Select new status:') + '\n';
    statuses.forEach((status, index) => {
        promptText += `${index+1}. ${statusLabels[status]}\n`;
    });
    
    const input = prompt(promptText);
    if (input !== null) {
        const selection = parseInt(input);
        if (selection >= 1 && selection <= statuses.length) {
            const newStatus = statuses[selection-1];
            
            // Update status in view modal
            const statusBadge = document.getElementById('view-order-status');
            statusBadge.innerHTML = `<span class="status-badge status-${newStatus}">${statusLabels[newStatus]}</span>`;
            
            // Add entry to order history
            const historyContainer = document.getElementById('order-history');
            const now = new Date();
            const formattedDate = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
            
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-date">${formattedDate}</div>
                <div class="history-content">${getTranslation('statusChangedTo', 'Status changed to')} "${statusLabels[newStatus]}"</div>
            `;
            
            historyContainer.insertBefore(historyItem, historyContainer.firstChild);
            
            showNotification(getTranslation('statusUpdated', 'Status updated successfully'), 'success');
            
            // Reload statistics
            loadOrderStatistics();
        } else {
            showNotification(getTranslation('invalidStatus', 'Invalid status selection'), 'error');
        }
    }
}

/**
 * Update pagination
 */
function updatePagination(currentPage, totalPages) {
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const paginationPages = document.querySelectorAll('.pagination-page');
    
    // Update button states
    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= totalPages;
    
    // Update active page classes
    paginationPages.forEach(page => {
        const pageNum = parseInt(page.textContent);
        if (pageNum === currentPage) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });
}

/**
 * Go to previous page
 */
function goToPreviousPage() {
    const activePage = document.querySelector('.pagination-page.active');
    const currentPage = parseInt(activePage.textContent);
    if (currentPage > 1) {
        goToPage(currentPage - 1);
    }
}

/**
 * Go to next page
 */
function goToNextPage() {
    const activePage = document.querySelector('.pagination-page.active');
    const currentPage = parseInt(activePage.textContent);
    const paginationPages = document.querySelectorAll('.pagination-page');
    const totalPages = paginationPages.length;
    if (currentPage < totalPages) {
        goToPage(currentPage + 1);
    }
}

/**
 * Go to specific page
 */
function goToPage(pageNum) {
    loadOrders(pageNum);
}

/**
 * Format currency based on language
 */
function formatCurrency(amount) {
    // Use language module's currency formatter if available
    if (typeof window.erpLanguage !== 'undefined' && window.erpLanguage.formatCurrency) {
        return window.erpLanguage.formatCurrency(amount);
    }
    
    // Fallback if language module is not available
    // Get current language
    let currentLanguage = 'en';
    if (typeof window.erpLanguage !== 'undefined' && window.erpLanguage.current) {
        currentLanguage = window.erpLanguage.current;
    } else if (typeof localStorage !== 'undefined') {
        currentLanguage = localStorage.getItem('erp_language') || 'en';
    }
    
    // Format amount based on language
    switch (currentLanguage) {
        case 'ru':
            return `${amount.toFixed(2)} ₽`;
        case 'tr':
            return `${amount.toFixed(2)} ₺`;
        default: // en
            return `$${amount.toFixed(2)}`;
    }
}

/**
 * Get translation for a key
 */
function getTranslation(key, defaultText) {
    if (typeof window.erpLanguage !== 'undefined' && window.erpLanguage.translate) {
        return window.erpLanguage.translate(key);
    } else if (typeof translations !== 'undefined' && 
              translations[currentLanguage] && 
              translations[currentLanguage][key]) {
        return translations[currentLanguage][key];
    }
    return defaultText;
}

/**
 * Open modal
 */
function openModal(modal) {
    modal.style.display = 'block';
    setTimeout(function() {
        modal.classList.add('show');
    }, 10);
}

/**
 * Close modal
 */
function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(function() {
        modal.style.display = 'none';
    }, 300);
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Check if notification container exists
    let notificationContainer = document.querySelector('.notification-container');
    
    // Create container if it doesn't exist
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add close button
    const closeBtn = document.createElement('span');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = function() {
        notification.remove();
    };
    notification.appendChild(closeBtn);
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Auto-hide notification after 5 seconds
    setTimeout(function() {
        notification.classList.add('notification-hide');
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 5000);
}

/**
 * Обновление статистики на странице
 */
function updateStatistics() {
    // Получаем все видимые строки таблицы
    const rows = document.querySelectorAll('#ordersTable tr');
    
    // Счетчики для статистики
    let totalOrders = rows.length;
    let pendingOrders = 0;
    let shippedOrders = 0;
    let totalValue = 0;
    
    rows.forEach(row => {
        // Проверяем статус для подсчета pending и shipped
        const statusCell = row.querySelector('td:nth-child(5)');
        if (statusCell) {
            const statusText = statusCell.textContent.toLowerCase();
            if (statusText.includes('processing') || statusText.includes('pending')) {
                pendingOrders++;
            } else if (statusText.includes('shipping') || statusText.includes('shipped')) {
                shippedOrders++;
            }
        }
        
        // Подсчитываем общую стоимость
        const valueCell = row.querySelector('td:nth-child(7)');
        if (valueCell) {
            const valueText = valueCell.textContent.replace(/[^0-9]/g, '');
            totalValue += parseInt(valueText) || 0;
        }
    });
    
    // Обновляем отображение статистики
    document.getElementById('totalOrdersCount').textContent = totalOrders;
    document.getElementById('pendingOrdersCount').textContent = pendingOrders;
    document.getElementById('shippedOrdersCount').textContent = shippedOrders;
    document.getElementById('totalValueCount').textContent = formatCurrency(totalValue);
}

/**
 * Обновление статистики после фильтрации
 */
function updateFilteredStatistics() {
    // Получаем только видимые строки таблицы
    const rows = document.querySelectorAll('#ordersTable tr[style=""]');
    
    // Счетчики для статистики
    let totalOrders = rows.length;
    let pendingOrders = 0;
    let shippedOrders = 0;
    let totalValue = 0;
    
    rows.forEach(row => {
        // Проверяем статус для подсчета pending и shipped
        const statusCell = row.querySelector('td:nth-child(5)');
        if (statusCell) {
            const statusText = statusCell.textContent.toLowerCase();
            if (statusText.includes('processing') || statusText.includes('pending')) {
                pendingOrders++;
            } else if (statusText.includes('shipping') || statusText.includes('shipped')) {
                shippedOrders++;
            }
        }
        
        // Подсчитываем общую стоимость
        const valueCell = row.querySelector('td:nth-child(7)');
        if (valueCell) {
            const valueText = valueCell.textContent.replace(/[^0-9]/g, '');
            totalValue += parseInt(valueText) || 0;
        }
    });
    
    // Обновляем отображение статистики
    document.getElementById('totalOrdersCount').textContent = totalOrders;
    document.getElementById('pendingOrdersCount').textContent = pendingOrders;
    document.getElementById('shippedOrdersCount').textContent = shippedOrders;
    document.getElementById('totalValueCount').textContent = formatCurrency(totalValue);
}
