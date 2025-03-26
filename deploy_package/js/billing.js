document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    checkAuthentication();

    // Load initial data
    loadInvoices();
    loadBills();
    loadPayments();

    // Set up logout functionality
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });

    // Set up tab switching
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // Set up modal close buttons
    document.querySelectorAll('.close, .cancel-btn').forEach(button => {
        button.addEventListener('click', function() {
            closeModals();
        });
    });

    // Set up form submissions
    document.getElementById('invoice-form').addEventListener('submit', function(e) {
        e.preventDefault();
        createInvoice();
    });
    document.getElementById('bill-form').addEventListener('submit', function(e) {
        e.preventDefault();
        createBill();
    });
    document.getElementById('payment-form').addEventListener('submit', function(e) {
        e.preventDefault();
        createPayment();
    });

    // Set up add item buttons
    document.getElementById('add-invoice-item-btn').addEventListener('click', function() {
        addInvoiceItem();
    });
    document.getElementById('add-bill-item-btn').addEventListener('click', function() {
        addBillItem();
    });

    // Set up reference type change
    document.getElementById('reference-type').addEventListener('change', function() {
        updateReferenceFields(this.value);
    });
    
    // Set up new document buttons
    document.getElementById('new-invoice-btn').addEventListener('click', function() {
        document.getElementById('invoice-modal').style.display = 'block';
        // Set default date values
        document.getElementById('invoice-date').valueAsDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30); // Default 30 days due date
        document.getElementById('due-date').valueAsDate = dueDate;
        // Reset form
        document.getElementById('invoice-form').reset();
        document.getElementById('invoice-date').valueAsDate = new Date();
        document.getElementById('due-date').valueAsDate = dueDate;
        // Calculate initial total
        calculateInvoiceTotal();
    });
    
    document.getElementById('new-bill-btn').addEventListener('click', function() {
        document.getElementById('bill-modal').style.display = 'block';
        // Set default date values
        document.getElementById('bill-date').valueAsDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30); // Default 30 days due date
        document.getElementById('bill-due-date').valueAsDate = dueDate;
        // Reset form
        document.getElementById('bill-form').reset();
        document.getElementById('bill-date').valueAsDate = new Date();
        document.getElementById('bill-due-date').valueAsDate = dueDate;
        // Calculate initial total
        calculateBillTotal();
    });
    
    document.getElementById('new-payment-btn').addEventListener('click', function() {
        document.getElementById('payment-modal').style.display = 'block';
        // Set default date value
        document.getElementById('payment-date').valueAsDate = new Date();
        // Reset form
        document.getElementById('payment-form').reset();
        document.getElementById('payment-date').valueAsDate = new Date();
        // Hide reference fields initially
        document.getElementById('invoice-reference-group').style.display = 'none';
        document.getElementById('bill-reference-group').style.display = 'none';
        
        // Load invoice and bill references
        loadInvoiceReferences();
        loadBillReferences();
    });
    
    // Set up print document button
    document.getElementById('print-document-btn').addEventListener('click', function() {
        window.print();
    });
});

// Function to load invoice references for payment form
function loadInvoiceReferences() {
    fetch('/api/invoices', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const invoiceSelect = document.getElementById('invoice-reference');
        invoiceSelect.innerHTML = '<option value="">Select Invoice</option>';
        
        data.invoices.filter(invoice => invoice.status !== 'Paid').forEach(invoice => {
            const option = document.createElement('option');
            option.value = invoice.id;
            option.textContent = `${invoice.invoice_number} - ${invoice.customer_name} ($${invoice.total_amount.toFixed(2)})`;
            invoiceSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error loading invoice references:', error);
    });
}

// Function to load bill references for payment form
function loadBillReferences() {
    fetch('/api/bills', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const billSelect = document.getElementById('bill-reference');
        billSelect.innerHTML = '<option value="">Select Bill</option>';
        
        data.bills.filter(bill => bill.status !== 'Paid').forEach(bill => {
            const option = document.createElement('option');
            option.value = bill.id;
            option.textContent = `${bill.bill_number} - ${bill.vendor_name} ($${bill.total_amount.toFixed(2)})`;
            billSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error loading bill references:', error);
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`#${tabName}`).classList.add('active');

    document.querySelectorAll('.tab-btn').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`.tab-btn[data-tab="${tabName}"]`).classList.add('active');
}

function loadInvoices() {
    fetch('/api/invoices', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load invoices');
        }
        return response.json();
    })
    .then(data => {
        displayInvoices(data.invoices);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to load invoices. Please try again.');
    });
}

function displayInvoices(invoices) {
    const invoicesTable = document.getElementById('invoices-table');
    invoicesTable.innerHTML = '';

    if (invoices.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="8" class="no-data">No invoices found</td>';
        invoicesTable.appendChild(row);
        return;
    }

    invoices.forEach(invoice => {
        const row = document.createElement('tr');
        const invoiceDate = new Date(invoice.invoice_date).toLocaleDateString();
        const dueDate = new Date(invoice.due_date).toLocaleDateString();

        row.innerHTML = `
            <td>${invoice.invoice_number}</td>
            <td>${invoice.customer_name}</td>
            <td>${invoiceDate}</td>
            <td>${dueDate}</td>
            <td>$${invoice.total_amount.toFixed(2)}</td>
            <td>$${invoice.paid_amount.toFixed(2)}</td>
            <td>${invoice.status}</td>
            <td>
                <button class="btn-small view-btn" data-id="${invoice.id}">View</button>
            </td>
        `;

        invoicesTable.appendChild(row);
    });

    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const invoiceId = this.getAttribute('data-id');
            viewDocument('invoice', invoiceId);
        });
    });
}

function loadBills() {
    fetch('/api/bills', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load bills');
        }
        return response.json();
    })
    .then(data => {
        displayBills(data.bills);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to load bills. Please try again.');
    });
}

function displayBills(bills) {
    const billsTable = document.getElementById('bills-table');
    billsTable.innerHTML = '';

    if (bills.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="8" class="no-data">No bills found</td>';
        billsTable.appendChild(row);
        return;
    }

    bills.forEach(bill => {
        const row = document.createElement('tr');
        const billDate = new Date(bill.bill_date).toLocaleDateString();
        const dueDate = new Date(bill.due_date).toLocaleDateString();

        row.innerHTML = `
            <td>${bill.bill_number}</td>
            <td>${bill.vendor_name}</td>
            <td>${billDate}</td>
            <td>${dueDate}</td>
            <td>$${bill.total_amount.toFixed(2)}</td>
            <td>$${bill.paid_amount.toFixed(2)}</td>
            <td>${bill.status}</td>
            <td>
                <button class="btn-small view-btn" data-id="${bill.id}">View</button>
            </td>
        `;

        billsTable.appendChild(row);
    });

    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const billId = this.getAttribute('data-id');
            viewDocument('bill', billId);
        });
    });
}

function loadPayments() {
    fetch('/api/payments', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load payments');
        }
        return response.json();
    })
    .then(data => {
        displayPayments(data.payments);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to load payments. Please try again.');
    });
}

function displayPayments(payments) {
    const paymentsTable = document.getElementById('payments-table');
    paymentsTable.innerHTML = '';

    if (payments.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6" class="no-data">No payments found</td>';
        paymentsTable.appendChild(row);
        return;
    }

    payments.forEach(payment => {
        const row = document.createElement('tr');
        const paymentDate = new Date(payment.payment_date).toLocaleDateString();

        row.innerHTML = `
            <td>${paymentDate}</td>
            <td>$${payment.amount.toFixed(2)}</td>
            <td>${payment.payment_method}</td>
            <td>${payment.reference_type} #${payment.reference_id}</td>
            <td>${payment.notes || 'N/A'}</td>
            <td>
                <button class="btn-small view-btn" data-id="${payment.id}">View</button>
            </td>
        `;

        paymentsTable.appendChild(row);
    });

    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const paymentId = this.getAttribute('data-id');
            viewDocument('payment', paymentId);
        });
    });
}

function createInvoice() {
    const customerName = document.getElementById('customer-name').value;
    const invoiceDate = document.getElementById('invoice-date').value;
    const dueDate = document.getElementById('due-date').value;
    const orderId = document.getElementById('order-id').value;
    const notes = document.getElementById('invoice-notes').value;

    const items = [];
    let hasError = false;

    document.querySelectorAll('.invoice-item').forEach(item => {
        const description = item.querySelector('input[id^="item-description-"]').value;
        const quantity = parseFloat(item.querySelector('input[id^="item-quantity-"]').value);
        const price = parseFloat(item.querySelector('input[id^="item-price-"]').value);

        if (!description || isNaN(quantity) || isNaN(price)) {
            hasError = true;
            return;
        }

        items.push({
            description: description,
            quantity: quantity,
            price: price
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

    fetch('/api/invoices', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            customer_name: customerName,
            invoice_date: invoiceDate,
            due_date: dueDate,
            order_id: orderId ? parseInt(orderId) : null,
            notes: notes,
            items: items
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to create invoice');
        }
        return response.json();
    })
    .then(data => {
        alert('Invoice created successfully');
        closeModals();
        loadInvoices();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to create invoice. Please try again.');
    });
}

function createBill() {
    const vendorName = document.getElementById('vendor-name').value;
    const billDate = document.getElementById('bill-date').value;
    const dueDate = document.getElementById('bill-due-date').value;
    const supplierOrderId = document.getElementById('supplier-order-id').value;
    const notes = document.getElementById('bill-notes').value;

    const items = [];
    let hasError = false;

    document.querySelectorAll('.bill-item').forEach(item => {
        const description = item.querySelector('input[id^="bill-item-description-"]').value;
        const quantity = parseFloat(item.querySelector('input[id^="bill-item-quantity-"]').value);
        const price = parseFloat(item.querySelector('input[id^="bill-item-price-"]').value);

        if (!description || isNaN(quantity) || isNaN(price)) {
            hasError = true;
            return;
        }

        items.push({
            description: description,
            quantity: quantity,
            price: price
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

    fetch('/api/bills', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            vendor_name: vendorName,
            bill_date: billDate,
            due_date: dueDate,
            supplier_order_id: supplierOrderId ? parseInt(supplierOrderId) : null,
            notes: notes,
            items: items
        })
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
        loadBills();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to create bill. Please try again.');
    });
}

function createPayment() {
    const paymentDate = document.getElementById('payment-date').value;
    const amount = parseFloat(document.getElementById('payment-amount').value);
    const paymentMethod = document.getElementById('payment-method').value;
    const referenceType = document.getElementById('reference-type').value;
    const invoiceReference = document.getElementById('invoice-reference').value;
    const billReference = document.getElementById('bill-reference').value;
    const notes = document.getElementById('payment-notes').value;

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    let referenceId = null;
    if (referenceType === 'invoice') {
        referenceId = invoiceReference ? parseInt(invoiceReference) : null;
    } else if (referenceType === 'bill') {
        referenceId = billReference ? parseInt(billReference) : null;
    }

    fetch('/api/payments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            payment_date: paymentDate,
            amount: amount,
            payment_method: paymentMethod,
            reference_type: referenceType,
            reference_id: referenceId,
            notes: notes
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to create payment');
        }
        return response.json();
    })
    .then(data => {
        alert('Payment recorded successfully');
        closeModals();
        loadPayments();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to record payment. Please try again.');
    });
}

function addInvoiceItem() {
    const invoiceItems = document.getElementById('invoice-items');
    const itemCount = invoiceItems.children.length + 1;

    const newItem = document.createElement('div');
    newItem.className = 'invoice-item';
    newItem.innerHTML = `
        <div class="form-group">
            <label for="item-description-${itemCount}">Description</label>
            <input type="text" id="item-description-${itemCount}" name="item-description-${itemCount}" required>
        </div>
        <div class="form-group">
            <label for="item-quantity-${itemCount}">Quantity</label>
            <input type="number" id="item-quantity-${itemCount}" name="item-quantity-${itemCount}" min="1" required>
        </div>
        <div class="form-group">
            <label for="item-price-${itemCount}">Price</label>
            <input type="number" id="item-price-${itemCount}" name="item-price-${itemCount}" step="0.01" min="0" required>
        </div>
        <div class="form-group">
            <label for="item-total-${itemCount}">Total</label>
            <input type="number" id="item-total-${itemCount}" name="item-total-${itemCount}" step="0.01" readonly>
        </div>
        <button type="button" class="btn-small remove-item-btn" data-id="${itemCount}">Remove</button>
    `;

    invoiceItems.appendChild(newItem);

    newItem.querySelector('.remove-item-btn').addEventListener('click', function() {
        this.parentElement.remove();
        calculateInvoiceTotal();
    });

    newItem.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', function() {
            calculateItemTotal(itemCount);
        });
    });
}

function addBillItem() {
    const billItems = document.getElementById('bill-items');
    const itemCount = billItems.children.length + 1;

    const newItem = document.createElement('div');
    newItem.className = 'bill-item';
    newItem.innerHTML = `
        <div class="form-group">
            <label for="bill-item-description-${itemCount}">Description</label>
            <input type="text" id="bill-item-description-${itemCount}" name="bill-item-description-${itemCount}" required>
        </div>
        <div class="form-group">
            <label for="bill-item-quantity-${itemCount}">Quantity</label>
            <input type="number" id="bill-item-quantity-${itemCount}" name="bill-item-quantity-${itemCount}" min="1" required>
        </div>
        <div class="form-group">
            <label for="bill-item-price-${itemCount}">Price</label>
            <input type="number" id="bill-item-price-${itemCount}" name="bill-item-price-${itemCount}" step="0.01" min="0" required>
        </div>
        <div class="form-group">
            <label for="bill-item-total-${itemCount}">Total</label>
            <input type="number" id="bill-item-total-${itemCount}" name="bill-item-total-${itemCount}" step="0.01" readonly>
        </div>
        <button type="button" class="btn-small remove-item-btn" data-id="${itemCount}">Remove</button>
    `;

    billItems.appendChild(newItem);

    newItem.querySelector('.remove-item-btn').addEventListener('click', function() {
        this.parentElement.remove();
        calculateBillTotal();
    });

    newItem.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', function() {
            calculateBillItemTotal(itemCount);
        });
    });
}

function calculateItemTotal(itemId) {
    const quantity = parseFloat(document.getElementById(`item-quantity-${itemId}`).value) || 0;
    const price = parseFloat(document.getElementById(`item-price-${itemId}`).value) || 0;
    const total = quantity * price;

    document.getElementById(`item-total-${itemId}`).value = total.toFixed(2);
    calculateInvoiceTotal();
}

function calculateBillItemTotal(itemId) {
    const quantity = parseFloat(document.getElementById(`bill-item-quantity-${itemId}`).value) || 0;
    const price = parseFloat(document.getElementById(`bill-item-price-${itemId}`).value) || 0;
    const total = quantity * price;

    document.getElementById(`bill-item-total-${itemId}`).value = total.toFixed(2);
    calculateBillTotal();
}

function calculateInvoiceTotal() {
    let invoiceTotal = 0;

    document.querySelectorAll('input[id^="item-total-"]').forEach(input => {
        invoiceTotal += parseFloat(input.value) || 0;
    });

    document.getElementById('invoice-total').value = invoiceTotal.toFixed(2);
}

function calculateBillTotal() {
    let billTotal = 0;

    document.querySelectorAll('input[id^="bill-item-total-"]').forEach(input => {
        billTotal += parseFloat(input.value) || 0;
    });

    document.getElementById('bill-total').value = billTotal.toFixed(2);
}

function updateReferenceFields(referenceType) {
    document.getElementById('invoice-reference-group').style.display = 'none';
    document.getElementById('bill-reference-group').style.display = 'none';

    if (referenceType === 'invoice') {
        document.getElementById('invoice-reference-group').style.display = 'block';
    } else if (referenceType === 'bill') {
        document.getElementById('bill-reference-group').style.display = 'block';
    }
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function viewDocument(type, id) {
    fetch(`/api/${type}s/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load document details');
        }
        return response.json();
    })
    .then(data => {
        displayDocumentDetails(type, data[type]);
        document.getElementById('view-document-modal').style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to load document details. Please try again.');
    });
}

function displayDocumentDetails(type, doc) {
    const documentDetails = document.getElementById('document-details');
    const documentTitle = document.getElementById('document-title');

    documentTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1) + ' Details';

    let itemsHtml = '';
    
    // Check if document has items and it's an array
    if (doc.items && Array.isArray(doc.items) && doc.items.length > 0) {
        doc.items.forEach(item => {
            itemsHtml += `
                <tr>
                    <td>${item.description || item.product_name || 'N/A'}</td>
                    <td>${item.quantity}</td>
                    <td>$${(item.price || 0).toFixed(2)}</td>
                    <td>$${((item.quantity || 0) * (item.price || 0)).toFixed(2)}</td>
                </tr>
            `;
        });
    } else {
        itemsHtml = '<tr><td colspan="4" class="no-data">No items found</td></tr>';
    }

    let documentNumber = '';
    let documentDate = '';
    let documentDueDate = '';
    
    if (type === 'invoice') {
        documentNumber = doc.invoice_number;
        documentDate = doc.invoice_date;
        documentDueDate = doc.due_date;
    } else if (type === 'bill') {
        documentNumber = doc.bill_number;
        documentDate = doc.bill_date;
        documentDueDate = doc.due_date;
    } else if (type === 'payment') {
        documentNumber = doc.id;
        documentDate = doc.payment_date;
    }

    let documentHtml = `
        <div class="document-header">
            <p><strong>${type.charAt(0).toUpperCase() + type.slice(1)} Number:</strong> ${documentNumber || 'N/A'}</p>
            <p><strong>Date:</strong> ${documentDate ? new Date(documentDate).toLocaleDateString() : 'N/A'}</p>`;
            
    if (type !== 'payment') {
        documentHtml += `
            <p><strong>Due Date:</strong> ${documentDueDate ? new Date(documentDueDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Status:</strong> ${doc.status || 'N/A'}</p>
            <p><strong>Amount:</strong> $${(doc.total_amount || 0).toFixed(2)}</p>
            <p><strong>Paid Amount:</strong> $${(doc.paid_amount || 0).toFixed(2)}</p>`;
    } else {
        documentHtml += `
            <p><strong>Amount:</strong> $${(doc.amount || 0).toFixed(2)}</p>
            <p><strong>Method:</strong> ${doc.payment_method || 'N/A'}</p>
            <p><strong>Reference:</strong> ${doc.reference_type || 'N/A'} #${doc.reference_id || 'N/A'}</p>`;
    }
    
    documentHtml += `<p><strong>Notes:</strong> ${doc.notes || 'N/A'}</p>
        </div>`;

    if (type !== 'payment') {
        documentHtml += `
            <div class="document-items">
                <h4>${type.charAt(0).toUpperCase() + type.slice(1)} Items</h4>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" class="text-right"><strong>Total:</strong></td>
                            <td>$${(doc.total_amount || 0).toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>`;
    }

    documentDetails.innerHTML = documentHtml;
    
    // Show/hide the record payment button based on document type and status
    const recordPaymentBtn = document.getElementById('record-payment-btn');
    if (type === 'payment' || (doc.status === 'Paid')) {
        recordPaymentBtn.style.display = 'none';
    } else {
        recordPaymentBtn.style.display = 'inline-block';
        recordPaymentBtn.onclick = function() {
            closeModals();
            document.getElementById('payment-modal').style.display = 'block';
            document.getElementById('reference-type').value = type;
            updateReferenceFields(type);
            if (type === 'invoice') {
                document.getElementById('invoice-reference').value = doc.id;
            } else if (type === 'bill') {
                document.getElementById('bill-reference').value = doc.id;
            }
        };
    }
}