document.addEventListener('DOMContentLoaded', function() {
    // Load products
    loadProducts();
    
    // Load suppliers for dropdown
    loadSuppliers();
    
    // Setup modal
    const modal = document.getElementById('productModal');
    const addProductBtn = document.getElementById('addProductBtn');
    const cancelProductBtn = document.getElementById('cancelProductBtn');
    const closeBtn = modal.querySelector('.close');
    
    // Open modal when Add Product button is clicked
    addProductBtn.addEventListener('click', function() {
        document.getElementById('modalTitle').textContent = 'Add Product';
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
        modal.style.display = 'block';
    });
    
    // Close modal when Cancel button is clicked
    cancelProductBtn.addEventListener('click', function() {
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
    
    // Handle product form submission
    const productForm = document.getElementById('productForm');
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const productId = document.getElementById('productId').value;
        const productData = {
            name: document.getElementById('productName').value,
            description: document.getElementById('productDescription').value,
            price: document.getElementById('productPrice').value,
            cost_price: document.getElementById('productCostPrice').value,
            current_stock: document.getElementById('productStock').value,
            min_level: document.getElementById('productMinLevel').value,
            supplier_id: document.getElementById('productSupplier').value
        };
        
        console.log('Form submitted with data:', productData);
        
        if (productId) {
            // Update existing product
            updateProduct(productId, productData);
        } else {
            // Add new product
            addProduct(productData);
        }
    });
    
    // Setup search functionality
    const productSearch = document.getElementById('productSearch');
    productSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#productsTable tr');
        
        rows.forEach(row => {
            const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const description = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || description.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
});

// Helper function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Function to load products
function loadProducts() {
    console.log('Loading products...');
    
    fetch('/api/products')
        .then(response => {
            console.log('Products API response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Products data received:', data);
            
            const productsTable = document.getElementById('productsTable');
            productsTable.innerHTML = '';
            
            if (!data.products || data.products.length === 0) {
                productsTable.innerHTML = '<tr><td colspan="9" class="no-data">No products found</td></tr>';
                return;
            }
            
            data.products.forEach(product => {
                console.log('Processing product:', product);
                
                const row = document.createElement('tr');
                
                // Handle price and cost price with fallbacks
                let price = 0;
                let costPrice = 0;
                
                if (product.price !== null && product.price !== undefined) {
                    price = product.price;
                    console.log(`Product ${product.name} price:`, price);
                }
                
                if (product.unit_price !== null && product.unit_price !== undefined) {
                    costPrice = product.unit_price;
                    console.log(`Product ${product.name} cost price:`, costPrice);
                }
                
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.description || ''}</td>
                    <td>$${parseFloat(price).toFixed(2)}</td>
                    <td>${product.current_stock}</td>
                    <td>${product.min_stock_level || product.min_level || 0}</td>
                    <td>${product.supplier_name || 'None'}</td>
                    <td>$${parseFloat(costPrice).toFixed(2)}</td>
                    <td class="action-buttons">
                        <button class="action-btn edit-btn" data-id="${product.id}">Edit</button>
                        <button class="action-btn delete-btn" data-id="${product.id}">Delete</button>
                    </td>
                `;
                
                productsTable.appendChild(row);
            });
            
            // Add event listeners to edit buttons
            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.getAttribute('data-id');
                    editProduct(productId);
                });
            });
            
            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.getAttribute('data-id');
                    deleteProduct(productId);
                });
            });
        })
        .catch(error => {
            console.error('Error loading products:', error);
            document.getElementById('productsTable').innerHTML = 
                '<tr><td colspan="9" class="error">Error loading products. Please try again.</td></tr>';
        });
}

// Function to load suppliers
function loadSuppliers() {
    fetch('/api/suppliers')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load suppliers');
            }
            return response.json();
        })
        .then(data => {
            const supplierSelect = document.getElementById('productSupplier');
            
            // Clear existing options except the first one
            while (supplierSelect.options.length > 1) {
                supplierSelect.remove(1);
            }
            
            // Add supplier options
            data.suppliers.forEach(supplier => {
                const option = document.createElement('option');
                option.value = supplier.id;
                option.textContent = supplier.name;
                supplierSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading suppliers:', error);
        });
}

// Function to add a new product
function addProduct(productData) {
    console.log('Adding product with data:', productData);
    
    fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    })
    .then(response => {
        console.log('Product creation response status:', response.status);
        return response.json().then(data => {
            if (!response.ok) {
                throw new Error(data.error || 'Failed to add product');
            }
            return data;
        });
    })
    .then(data => {
        console.log('Product created successfully:', data);
        
        // Show success message
        showNotification('Product added successfully', 'success');
        
        // Close modal
        document.getElementById('productModal').style.display = 'none';
        
        // Reload products
        loadProducts();
    })
    .catch(error => {
        console.error('Error adding product:', error);
        showNotification(error.message, 'error');
    });
}

// Function to edit a product
function editProduct(productId) {
    fetch(`/api/products/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load product details');
            }
            return response.json();
        })
        .then(data => {
            const product = data.product;
            
            // Fill form with product data
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStock').value = product.current_stock;
            document.getElementById('productMinLevel').value = product.min_level;
            document.getElementById('productSupplier').value = product.supplier_id || '';
            document.getElementById('productCostPrice').value = product.cost_price || '';
            
            // Update modal title
            document.getElementById('modalTitle').textContent = 'Edit Product';
            
            // Show modal
            document.getElementById('productModal').style.display = 'block';
        })
        .catch(error => {
            console.error('Error loading product details:', error);
            alert('Failed to load product details. Please try again.');
        });
}

// Function to update a product
function updateProduct(productId, productData) {
    fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update product');
        }
        return response.json();
    })
    .then(data => {
        // Close modal
        document.getElementById('productModal').style.display = 'none';
        
        // Reload products
        loadProducts();
    })
    .catch(error => {
        console.error('Error updating product:', error);
        alert('Failed to update product. Please try again.');
    });
}

// Function to delete a product
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
            return response.json();
        })
        .then(data => {
            // Reload products
            loadProducts();
        })
        .catch(error => {
            console.error('Error deleting product:', error);
            alert('Failed to delete product. Please try again.');
        });
    }
}
