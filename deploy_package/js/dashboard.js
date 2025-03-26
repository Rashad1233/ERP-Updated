document.addEventListener('DOMContentLoaded', function() {
    // Load dashboard data
    loadDashboardData();
    
    // Load low stock items
    loadLowStockItems();
    
    // Load recent transactions
    loadRecentTransactions();
});

// Function to load dashboard data
function loadDashboardData() {
    fetch('/api/dashboard')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load dashboard data');
            }
            return response.json();
        })
        .then(data => {
            // Update dashboard cards
            document.getElementById('totalProducts').textContent = data.dashboard.totalProducts;
            document.getElementById('lowStockItems').textContent = data.dashboard.lowStockItems;
            document.getElementById('activeSuppliers').textContent = data.dashboard.activeSuppliers;
            document.getElementById('pendingOrders').textContent = data.dashboard.pendingOrders;
        })
        .catch(error => {
            console.error('Error loading dashboard data:', error);
        });
}

// Function to load low stock items
function loadLowStockItems() {
    fetch('/api/products/low-stock')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load low stock items');
            }
            return response.json();
        })
        .then(data => {
            const lowStockTable = document.getElementById('lowStockTable');
            lowStockTable.innerHTML = '';
            
            if (data.products.length === 0) {
                lowStockTable.innerHTML = '<tr><td colspan="3" class="text-center">No low stock items</td></tr>';
                return;
            }
            
            data.products.forEach(product => {
                const row = document.createElement('tr');
                
                // Add warning class if stock is very low
                if (product.current_stock === 0) {
                    row.classList.add('stock-critical');
                } else if (product.current_stock < product.min_level) {
                    row.classList.add('stock-warning');
                }
                
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${product.current_stock}</td>
                    <td>${product.min_level}</td>
                `;
                
                lowStockTable.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error loading low stock items:', error);
        });
}

// Function to load recent transactions
function loadRecentTransactions() {
    fetch('/api/transactions')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load transactions');
            }
            return response.json();
        })
        .then(data => {
            const transactionsTable = document.getElementById('recentTransactionsTable');
            transactionsTable.innerHTML = '';
            
            if (data.transactions.length === 0) {
                transactionsTable.innerHTML = '<tr><td colspan="4" class="text-center">No transactions found</td></tr>';
                return;
            }
            
            // Only show the 5 most recent transactions
            const recentTransactions = data.transactions.slice(0, 5);
            
            recentTransactions.forEach(transaction => {
                const row = document.createElement('tr');
                
                // Format date
                const date = new Date(transaction.transaction_date);
                const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>${transaction.product_name}</td>
                    <td>${transaction.transaction_type}</td>
                    <td>${Math.abs(transaction.quantity)}</td>
                `;
                
                transactionsTable.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error loading transactions:', error);
        });
}
