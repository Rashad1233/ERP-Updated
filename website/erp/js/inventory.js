document.addEventListener('DOMContentLoaded', function() {
    // Load transactions
    loadTransactions();
    
    // Load products for the dropdown
    loadProductsForDropdown();
    
    // Setup modal
    const modal = document.getElementById('transactionModal');
    const addTransactionBtn = document.getElementById('addTransactionBtn');
    const cancelTransactionBtn = document.getElementById('cancelTransactionBtn');
    const closeBtn = modal.querySelector('.close');
    
    // Open modal when Add Transaction button is clicked
    addTransactionBtn.addEventListener('click', function() {
        document.getElementById('transactionForm').reset();
        modal.style.display = 'block';
    });
    
    // Close modal when Cancel button is clicked
    cancelTransactionBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when X is clicked
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside the modal
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Handle transaction form submission
    const transactionForm = document.getElementById('transactionForm');
    transactionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const transactionData = {
            product_id: parseInt(document.getElementById('productId').value),
            quantity: parseInt(document.getElementById('quantity').value),
            transaction_type: document.getElementById('transactionType').value
        };
        
        // If transaction type is Sale, make quantity negative
        if (transactionData.transaction_type === 'Sale') {
            transactionData.quantity = -transactionData.quantity;
        }
        
        // Add transaction
        addTransaction(transactionData);
    });
    
    // Setup filter functionality
    const filterType = document.getElementById('filterType');
    filterType.addEventListener('change', function() {
        applyFilters();
    });
    
    const dateRange = document.getElementById('dateRange');
    dateRange.addEventListener('change', function() {
        applyFilters();
    });
});

// Function to load transactions
function loadTransactions() {
    fetch('/api/transactions')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load transactions');
            }
            return response.json();
        })
        .then(data => {
            // Store transactions globally for filtering
            window.allTransactions = data.transactions;
            
            // Display transactions
            displayTransactions(data.transactions);
        })
        .catch(error => {
            console.error('Error loading transactions:', error);
        });
}

// Function to display transactions
function displayTransactions(transactions) {
    const transactionsTable = document.getElementById('transactionsTable');
    transactionsTable.innerHTML = '';
    
    if (transactions.length === 0) {
        transactionsTable.innerHTML = '<tr><td colspan="6" class="text-center">No transactions found</td></tr>';
        return;
    }
    
    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        
        // Format date
        const date = new Date(transaction.transaction_date);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        row.innerHTML = `
            <td>${transaction.id}</td>
            <td>${formattedDate}</td>
            <td>${transaction.product_name}</td>
            <td>${transaction.transaction_type}</td>
            <td>${Math.abs(transaction.quantity)}</td>
            <td class="action-buttons">
                <button class="action-btn delete-btn" data-id="${transaction.id}">Delete</button>
                <button class="action-btn pdf-btn" data-id="${transaction.id}"><i class="fas fa-file-pdf"></i> PDF</button>
            </td>
        `;
        
        transactionsTable.appendChild(row);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const transactionId = this.getAttribute('data-id');
            deleteTransaction(transactionId);
        });
    });
    
    // Add event listeners to pdf buttons
    document.querySelectorAll('.pdf-btn').forEach(button => {
        button.addEventListener('click', function() {
            const transactionId = this.getAttribute('data-id');
            generateTransactionPDF(transactionId);
        });
    });
}

// Function to apply filters
function applyFilters() {
    if (!window.allTransactions) return;
    
    const filterType = document.getElementById('filterType').value;
    const dateRange = document.getElementById('dateRange').value;
    
    let filteredTransactions = window.allTransactions;
    
    // Filter by type
    if (filterType !== 'all') {
        filteredTransactions = filteredTransactions.filter(transaction => transaction.transaction_type === filterType);
    }
    
    // Filter by date range
    if (dateRange !== 'all') {
        const now = new Date();
        let startDate;
        
        switch (dateRange) {
            case 'today':
                startDate = new Date(now.setHours(0, 0, 0, 0));
                break;
            case 'week':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate = new Date(now);
                startDate.setMonth(now.getMonth() - 1);
                break;
        }
        
        filteredTransactions = filteredTransactions.filter(transaction => {
            const transactionDate = new Date(transaction.transaction_date);
            return transactionDate >= startDate;
        });
    }
    
    // Display filtered transactions
    displayTransactions(filteredTransactions);
}

// Function to load products for dropdown
function loadProductsForDropdown() {
    fetch('/api/products')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load products');
            }
            return response.json();
        })
        .then(data => {
            const productSelect = document.getElementById('productId');
            productSelect.innerHTML = '<option value="">Select a product</option>';
            
            data.products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = `${product.name} (Stock: ${product.current_stock})`;
                productSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading products:', error);
        });
}

// Function to add a transaction
function addTransaction(transactionData) {
    fetch('/api/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add transaction');
        }
        return response.json();
    })
    .then(data => {
        // Close modal
        document.getElementById('transactionModal').style.display = 'none';
        
        // Reload transactions
        loadTransactions();
        
        // Reload products dropdown to update stock levels
        loadProductsForDropdown();
    })
    .catch(error => {
        console.error('Error adding transaction:', error);
        alert('Failed to add transaction. Please try again.');
    });
}

// Function to delete a transaction
function deleteTransaction(transactionId) {
    if (confirm('Are you sure you want to delete this transaction? This may affect inventory levels.')) {
        fetch(`/api/transactions/${transactionId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete transaction');
            }
            return response.json();
        })
        .then(data => {
            // Reload transactions
            loadTransactions();
            
            // Reload products dropdown to update stock levels
            loadProductsForDropdown();
        })
        .catch(error => {
            console.error('Error deleting transaction:', error);
            alert('Failed to delete transaction. Please try again.');
        });
    }
}

// Function to generate PDF for a transaction
function generateTransactionPDF(transactionId) {
    // Open PDF in a new window
    window.open(`/api/transactions/${transactionId}/pdf`, '_blank');
}
