document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    checkAuthentication();
    
    // Load supplier orders
    loadSupplierOrders();
    
    // Set up logout functionality
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
    
    // Set up new order button
    document.getElementById('new-order-btn').addEventListener('click', function() {
        openOrderModal();
    });
    
    // Set up modal close buttons
    document.querySelectorAll('.close, .cancel-btn').forEach(function(element) {
        element.addEventListener('click', function() {
            closeModals();
        });
    });
    
    // Set up order form submission
    document.getElementById('order-form').addEventListener('submit', function(e) {
        e.preventDefault();
        createSupplierOrder();
    });
    
    // Set up add item button
    document.getElementById('add-item-btn').addEventListener('click', function() {
        addOrderItem();
    });
    
    // Set up print order button
    document.getElementById('print-order-btn').addEventListener('click', function() {
        printOrder();
    });
    
    // Set up receive order button
    document.getElementById('receive-order-btn').addEventListener('click', function() {
        receiveOrder();
    });
    
    // Set up create bill button
    document.getElementById('create-bill-btn').addEventListener('click', function() {
        createBill();
    });
});

function loadSupplierOrders() {
    fetch('/api/supplier-orders', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load supplier orders');
        }
        return response.json();
    })
    .then(data => {
        displaySupplierOrders(data.orders);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to load supplier orders. Please try again.');
    });
}

function displaySupplierOrders(orders) {
    const ordersTable = document.getElementById('orders-table');
    
    // Clear existing rows
    ordersTable.innerHTML = '';
    
    if (orders.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="8" class="no-data">No supplier orders found</td>';
        ordersTable.appendChild(row);
        return;
    }
    
    // Add rows for each order
    orders.forEach(order => {
        const row = document.createElement('tr');
        
        const orderDate = new Date(order.order_date).toLocaleDateString();
        const deliveryDate = order.expected_delivery_date ? new Date(order.expected_delivery_date).toLocaleDateString() : 'N/A';
        
        row.innerHTML = `
            <td>${order.purchase_order_number || 'PO-' + order.id}</td>
            <td>${order.supplier_name || 'Supplier #' + order.supplier_id}</td>
            <td>${orderDate}</td>
            <td>${deliveryDate}</td>
            <td>$${order.total_amount.toFixed(2)}</td>
            <td>${order.status}</td>
            <td>${order.payment_status}</td>
            <td>
                <button class="btn-small view-btn" data-id="${order.id}">View</button>
            </td>
        `;
        
        ordersTable.appendChild(row);
    });
    
    // Add event listeners to view buttons
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-id');
            viewOrder(orderId);
        });
    });
}

function openOrderModal() {
    // Load suppliers and products
    loadSuppliers();
    loadProducts();
    
    // Reset form
    document.getElementById('order-form').reset();
    
    // Clear order items except the first one
    const orderItems = document.getElementById('order-items');
    orderItems.innerHTML = `
        <div class="order-item">
            <div class="form-group">
                <label for="product-1">Product</label>
                <select id="product-1" name="product-1" class="product-select" required>
                    <option value="">Select Product</option>
                    <!-- Products will be inserted here -->
                </select>
            </div>
            <div class="form-group">
                <label for="quantity-1">Quantity</label>
                <input type="number" id="quantity-1" name="quantity-1" min="1" required>
            </div>
            <div class="form-group">
                <label for="cost-price-1">Cost Price</label>
                <input type="number" id="cost-price-1" name="cost-price-1" step="0.01" min="0" required>
            </div>
            <div class="form-group">
                <label for="total-1">Total</label>
                <input type="number" id="total-1" name="total-1" step="0.01" readonly>
            </div>
        </div>
    `;
    
    // Reset order total
    document.getElementById('order-total').value = '';
    
    // Show modal
    document.getElementById('order-modal').style.display = 'block';
}

function closeModals() {
    document.getElementById('order-modal').style.display = 'none';
    document.getElementById('view-order-modal').style.display = 'none';
}

function loadSuppliers() {
    fetch('/api/suppliers', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load suppliers');
        }
        return response.json();
    })
    .then(data => {
        const supplierSelect = document.getElementById('supplier');
        
        // Clear existing options except the first one
        supplierSelect.innerHTML = '<option value="">Select Supplier</option>';
        
        // Add options for each supplier
        data.suppliers.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier.id;
            option.textContent = supplier.name;
            supplierSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to load suppliers. Please try again.');
    });
}

function loadProducts() {
    fetch('/api/products', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        return response.json();
    })
    .then(data => {
        const productSelects = document.querySelectorAll('.product-select');
        
        productSelects.forEach(select => {
            // Clear existing options except the first one
            select.innerHTML = '<option value="">Select Product</option>';
            
            // Add options for each product
            data.products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = product.name;
                option.setAttribute('data-cost-price', product.cost_price);
                select.appendChild(option);
            });
            
            // Add change event listener to update cost price and calculate total
            select.addEventListener('change', function() {
                const selectedOption = this.options[this.selectedIndex];
                const costPrice = selectedOption.getAttribute('data-cost-price');
                const itemId = this.id.split('-')[1];
                
                if (costPrice) {
                    document.getElementById(`cost-price-${itemId}`).value = costPrice;
                    calculateItemTotal(itemId);
                }
            });
        });
        
        // Add change event listeners to quantity and cost price inputs
        document.querySelectorAll('input[id^="quantity-"], input[id^="cost-price-"]').forEach(input => {
            input.addEventListener('change', function() {
                const itemId = this.id.split('-')[1];
                calculateItemTotal(itemId);
            });
        });
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to load products. Please try again.');
    });
}

function calculateItemTotal(itemId) {
    const quantity = parseFloat(document.getElementById(`quantity-${itemId}`).value) || 0;
    const costPrice = parseFloat(document.getElementById(`cost-price-${itemId}`).value) || 0;
    const total = quantity * costPrice;
    
    document.getElementById(`total-${itemId}`).value = total.toFixed(2);
    
    calculateOrderTotal();
}

function calculateOrderTotal() {
    let orderTotal = 0;
    
    document.querySelectorAll('input[id^="total-"]').forEach(input => {
        orderTotal += parseFloat(input.value) || 0;
    });
    
    document.getElementById('order-total').value = orderTotal.toFixed(2);
}

function addOrderItem() {
    const orderItems = document.getElementById('order-items');
    const itemCount = orderItems.children.length + 1;
    
    const newItem = document.createElement('div');
    newItem.className = 'order-item';
    newItem.innerHTML = `
        <div class="form-group">
            <label for="product-${itemCount}">Product</label>
            <select id="product-${itemCount}" name="product-${itemCount}" class="product-select" required>
                <option value="">Select Product</option>
                <!-- Products will be inserted here -->
            </select>
        </div>
        <div class="form-group">
            <label for="quantity-${itemCount}">Quantity</label>
            <input type="number" id="quantity-${itemCount}" name="quantity-${itemCount}" min="1" required>
        </div>
        <div class="form-group">
            <label for="cost-price-${itemCount}">Cost Price</label>
            <input type="number" id="cost-price-${itemCount}" name="cost-price-${itemCount}" step="0.01" min="0" required>
        </div>
        <div class="form-group">
            <label for="total-${itemCount}">Total</label>
            <input type="number" id="total-${itemCount}" name="total-${itemCount}" step="0.01" readonly>
        </div>
        <button type="button" class="btn-small remove-item-btn" data-id="${itemCount}">Remove</button>
    `;
    
    orderItems.appendChild(newItem);
    
    // Add event listener to remove button
    newItem.querySelector('.remove-item-btn').addEventListener('click', function() {
        this.parentElement.remove();
        calculateOrderTotal();
    });
    
    // Reload products for the new select
    loadProducts();
}

function createSupplierOrder() {
    const supplier_id = document.getElementById('supplier').value;
    const notes = document.getElementById('notes').value;
    
    if (!supplier_id) {
        alert('Please select a supplier');
        return;
    }
    
    // Collect order items
    const items = [];
    let hasError = false;
    
    document.querySelectorAll('.order-item').forEach(item => {
        const productSelect = item.querySelector('select[id^="product-"]');
        const quantityInput = item.querySelector('input[id^="quantity-"]');
        const costPriceInput = item.querySelector('input[id^="cost-price-"]');
        
        if (!productSelect.value || !quantityInput.value || !costPriceInput.value) {
            hasError = true;
            return;
        }
        
        items.push({
            product_id: parseInt(productSelect.value),
            quantity: parseInt(quantityInput.value),
            cost_price: parseFloat(costPriceInput.value)
        });
    });
    
    if (hasError) {
        alert('Please fill in all item fields');
        return;
    }
    
    if (items.length === 0) {
        alert('Please add at least one item');
        return;
    }
    
    // Create order
    fetch('/api/supplier-orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            supplier_id: parseInt(supplier_id),
            items: items,
            notes: notes
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to create supplier order');
        }
        return response.json();
    })
    .then(data => {
        alert('Supplier order created successfully');
        closeModals();
        loadSupplierOrders();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to create supplier order. Please try again.');
    });
}

function viewOrder(orderId) {
    fetch(`/api/supplier-orders/${orderId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load order details');
        }
        return response.json();
    })
    .then(data => {
        displayOrderDetails(data.order);
        document.getElementById('view-order-modal').style.display = 'block';
        
        // Set order ID for buttons
        document.getElementById('receive-order-btn').setAttribute('data-id', orderId);
        document.getElementById('create-bill-btn').setAttribute('data-id', orderId);
        document.getElementById('print-order-btn').setAttribute('data-id', orderId);
        
        // Show/hide buttons based on order status
        if (data.order.status === 'Received') {
            document.getElementById('receive-order-btn').style.display = 'none';
        } else {
            document.getElementById('receive-order-btn').style.display = 'inline-block';
        }
        
        if (data.order.bill) {
            document.getElementById('create-bill-btn').style.display = 'none';
        } else {
            document.getElementById('create-bill-btn').style.display = 'inline-block';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to load order details. Please try again.');
    });
}

function displayOrderDetails(order) {
    const orderDetails = document.getElementById('order-details');
    
    const orderDate = new Date(order.order_date).toLocaleDateString();
    const deliveryDate = order.expected_delivery_date ? new Date(order.expected_delivery_date).toLocaleDateString() : 'N/A';
    
    let itemsHtml = '';
    
    order.items.forEach(item => {
        itemsHtml += `
            <tr>
                <td>${item.product_name}</td>
                <td>${item.quantity}</td>
                <td>$${item.cost_price.toFixed(2)}</td>
                <td>$${item.total.toFixed(2)}</td>
            </tr>
        `;
    });
    
    let billHtml = '';
    
    if (order.bill) {
        billHtml = `
            <div class="bill-details">
                <h4>Bill Information</h4>
                <p><strong>Bill Number:</strong> ${order.bill.bill_number}</p>
                <p><strong>Bill Date:</strong> ${new Date(order.bill.bill_date).toLocaleDateString()}</p>
                <p><strong>Due Date:</strong> ${new Date(order.bill.due_date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> ${order.bill.status}</p>
                <p><strong>Amount:</strong> $${order.bill.total_amount.toFixed(2)}</p>
                <p><strong>Paid Amount:</strong> $${order.bill.paid_amount.toFixed(2)}</p>
            </div>
        `;
    }
    
    orderDetails.innerHTML = `
        <div class="order-header">
            <p><strong>Order Number:</strong> ${order.purchase_order_number || 'PO-' + order.id}</p>
            <p><strong>Supplier:</strong> ${order.supplier_name || 'Supplier #' + order.supplier_id}</p>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <p><strong>Expected Delivery:</strong> ${deliveryDate}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Payment Status:</strong> ${order.payment_status}</p>
            <p><strong>Notes:</strong> ${order.notes || 'N/A'}</p>
        </div>
        
        <div class="order-items">
            <h4>Order Items</h4>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Cost Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" class="text-right"><strong>Order Total:</strong></td>
                        <td>$${order.total_amount.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        
        ${billHtml}
    `;
}

function receiveOrder() {
    const orderId = document.getElementById('receive-order-btn').getAttribute('data-id');
    
    fetch(`/api/supplier-orders/${orderId}/receive`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to receive order');
        }
        return response.json();
    })
    .then(data => {
        alert('Order marked as received successfully');
        closeModals();
        loadSupplierOrders();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to receive order. Please try again.');
    });
}

function createBill() {
    const orderId = document.getElementById('create-bill-btn').getAttribute('data-id');
    
    fetch(`/api/supplier-orders/${orderId}/bill`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to create bill');
        }
        return response.json();
    })
    .then(data => {
        alert('Bill created successfully');
        closeModals();
        loadSupplierOrders();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to create bill. Please try again.');
    });
}

function printOrder() {
    const orderId = document.getElementById('print-order-btn').getAttribute('data-id');
    const orderDetails = document.getElementById('order-details').innerHTML;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Purchase Order</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
                h1 {
                    text-align: center;
                }
                .order-header {
                    margin-bottom: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
                .text-right {
                    text-align: right;
                }
                @media print {
                    .no-print {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <h1>Purchase Order</h1>
            ${orderDetails}
            <div class="no-print">
                <button onclick="window.print()">Print</button>
                <button onclick="window.close()">Close</button>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
}
