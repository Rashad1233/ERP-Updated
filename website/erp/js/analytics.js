document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    checkAuthentication();
    
    // Load analytics data
    loadAnalyticsData();
    
    // Set up logout functionality
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
});

function loadAnalyticsData() {
    // Fetch analytics data from the server
    fetch('/api/analytics', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load analytics data');
        }
        return response.json();
    })
    .then(data => {
        // Display analytics data
        displayAnalyticsData(data.analytics);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to load analytics data. Please try again.');
    });
    
    // Fetch products for stock level chart
    fetch('/api/products', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load products data');
        }
        return response.json();
    })
    .then(data => {
        // Create stock level chart
        createStockLevelChart(data.products);
        
        // Calculate and display inventory value
        calculateInventoryValue(data.products);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    
    // Fetch transactions for sales and purchases data
    fetch('/api/transactions', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load transactions data');
        }
        return response.json();
    })
    .then(data => {
        // Process transactions data
        processTransactionsData(data.transactions);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayAnalyticsData(analytics) {
    // Display basic analytics data
    const financialSummaryTable = document.getElementById('financial-summary-table');
    
    // Clear existing rows
    financialSummaryTable.innerHTML = '';
    
    // Add rows for each metric
    const metrics = [
        { name: 'Total Products', value: analytics.totalProducts || 0 },
        { name: 'Total Suppliers', value: analytics.totalSuppliers || 0 },
        { name: 'Total Orders', value: analytics.totalOrders || 0 }
    ];
    
    metrics.forEach(metric => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${metric.name}</td>
            <td>${metric.value}</td>
        `;
        financialSummaryTable.appendChild(row);
    });
}

function calculateInventoryValue(products) {
    let totalValue = 0;
    
    products.forEach(product => {
        totalValue += product.current_stock * product.cost_price;
    });
    
    // Display inventory value
    document.getElementById('inventory-value').textContent = '$' + totalValue.toFixed(2);
}

function processTransactionsData(transactions) {
    let totalSales = 0;
    let totalPurchases = 0;
    
    // Monthly data for charts
    const monthlyData = {};
    
    // Product sales data
    const productSales = {};
    
    transactions.forEach(transaction => {
        // Calculate totals
        if (transaction.transaction_type === 'Sale') {
            totalSales += transaction.total_price || 0;
            
            // Track product sales
            if (transaction.product_id) {
                if (!productSales[transaction.product_name]) {
                    productSales[transaction.product_name] = 0;
                }
                productSales[transaction.product_name] += Math.abs(transaction.quantity);
            }
        } else if (transaction.transaction_type === 'Purchase' || transaction.transaction_type === 'Initial Stock') {
            totalPurchases += transaction.total_price || 0;
        }
        
        // Process monthly data
        const date = new Date(transaction.transaction_date);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        
        if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = {
                sales: 0,
                purchases: 0
            };
        }
        
        if (transaction.transaction_type === 'Sale') {
            monthlyData[monthYear].sales += transaction.total_price || 0;
        } else if (transaction.transaction_type === 'Purchase' || transaction.transaction_type === 'Initial Stock') {
            monthlyData[monthYear].purchases += transaction.total_price || 0;
        }
    });
    
    // Display totals
    document.getElementById('total-sales').textContent = '$' + totalSales.toFixed(2);
    document.getElementById('total-purchases').textContent = '$' + totalPurchases.toFixed(2);
    
    // Create charts
    createSalesPurchasesChart(monthlyData);
    createMonthlyRevenueChart(monthlyData);
    createTopProductsChart(productSales);
}

function createSalesPurchasesChart(monthlyData) {
    const ctx = document.getElementById('sales-purchases-chart').getContext('2d');
    
    // Extract labels and data
    const labels = Object.keys(monthlyData).sort();
    const salesData = labels.map(month => monthlyData[month].sales);
    const purchasesData = labels.map(month => monthlyData[month].purchases);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Sales',
                    data: salesData,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Purchases',
                    data: purchasesData,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount ($)'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function createMonthlyRevenueChart(monthlyData) {
    const ctx = document.getElementById('monthly-revenue-chart').getContext('2d');
    
    // Extract labels and data
    const labels = Object.keys(monthlyData).sort();
    const revenueData = labels.map(month => monthlyData[month].sales - monthlyData[month].purchases);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Revenue',
                    data: revenueData,
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.1
                }
            ]
        },
        options: {
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Amount ($)'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function createTopProductsChart(productSales) {
    const ctx = document.getElementById('top-products-chart').getContext('2d');
    
    // Sort products by sales and take top 5
    const sortedProducts = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    const labels = sortedProducts.map(item => item[0]);
    const data = sortedProducts.map(item => item[1]);
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

function createStockLevelChart(products) {
    const ctx = document.getElementById('stock-level-chart').getContext('2d');
    
    // Sort products by current stock and take top 10
    const sortedProducts = products
        .sort((a, b) => b.current_stock - a.current_stock)
        .slice(0, 10);
    
    const labels = sortedProducts.map(product => product.name);
    const stockData = sortedProducts.map(product => product.current_stock);
    const minLevelData = sortedProducts.map(product => product.min_level);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Current Stock',
                    data: stockData,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Minimum Level',
                    data: minLevelData,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Quantity'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}
