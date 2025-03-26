document.addEventListener('DOMContentLoaded', function() {
    // Load suppliers
    loadSuppliers();
    
    // Setup modal
    const modal = document.getElementById('supplierModal');
    const addSupplierBtn = document.getElementById('addSupplierBtn');
    const cancelSupplierBtn = document.getElementById('cancelSupplierBtn');
    const closeBtn = modal.querySelector('.close');
    
    // Open modal when Add Supplier button is clicked
    addSupplierBtn.addEventListener('click', function() {
        document.getElementById('modalTitle').textContent = 'Add Supplier';
        document.getElementById('supplierForm').reset();
        document.getElementById('supplierId').value = '';
        modal.style.display = 'block';
    });
    
    // Close modal when Cancel button is clicked
    cancelSupplierBtn.addEventListener('click', function() {
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
    
    // Handle supplier form submission
    const supplierForm = document.getElementById('supplierForm');
    supplierForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const supplierId = document.getElementById('supplierId').value;
        const supplierData = {
            name: document.getElementById('supplierName').value,
            contact_person: document.getElementById('contactPerson').value,
            email: document.getElementById('supplierEmail').value,
            phone: document.getElementById('supplierPhone').value,
            address: document.getElementById('supplierAddress').value,
            payment_terms: document.getElementById('paymentTerms').value
        };
        
        if (supplierId) {
            // Update existing supplier
            updateSupplier(supplierId, supplierData);
        } else {
            // Add new supplier
            addSupplier(supplierData);
        }
    });
    
    // Setup search functionality
    const supplierSearch = document.getElementById('supplierSearch');
    supplierSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#suppliersTable tr');
        
        rows.forEach(row => {
            const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const contactPerson = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            const email = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || contactPerson.includes(searchTerm) || email.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
});

// Function to load suppliers
function loadSuppliers() {
    console.log('Loading suppliers...');
    
    fetch('/api/suppliers')
        .then(response => {
            console.log('Supplier response status:', response.status);
            if (!response.ok) {
                throw new Error('Failed to load suppliers');
            }
            return response.json();
        })
        .then(data => {
            console.log('Supplier data received:', data);
            const suppliersTable = document.getElementById('suppliersTable');
            suppliersTable.innerHTML = '';
            
            if (!data.suppliers || data.suppliers.length === 0) {
                suppliersTable.innerHTML = '<tr><td colspan="7" class="text-center">No suppliers found</td></tr>';
                return;
            }
            
            data.suppliers.forEach(supplier => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${supplier.id}</td>
                    <td>${supplier.name}</td>
                    <td>${supplier.contact_person || ''}</td>
                    <td>${supplier.email || ''}</td>
                    <td>${supplier.phone || ''}</td>
                    <td>${supplier.address || ''}</td>
                    <td class="action-buttons">
                        <button class="action-btn edit-btn" data-id="${supplier.id}">Edit</button>
                        <button class="action-btn delete-btn" data-id="${supplier.id}">Delete</button>
                    </td>
                `;
                
                suppliersTable.appendChild(row);
            });
            
            // Add event listeners to edit buttons
            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const supplierId = this.getAttribute('data-id');
                    editSupplier(supplierId);
                });
            });
            
            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const supplierId = this.getAttribute('data-id');
                    deleteSupplier(supplierId);
                });
            });
        })
        .catch(error => {
            console.error('Error loading suppliers:', error);
            // Show error in the table
            const suppliersTable = document.getElementById('suppliersTable');
            suppliersTable.innerHTML = `<tr><td colspan="7" class="text-center error-text">Error: ${error.message}</td></tr>`;
        });
}

// Function to add a new supplier
function addSupplier(supplierData) {
    console.log('Adding supplier with data:', supplierData);
    
    fetch('/api/suppliers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(supplierData)
    })
    .then(response => {
        console.log('Supplier creation response status:', response.status);
        return response.json().then(data => {
            if (!response.ok) {
                throw new Error(data.error || 'Failed to add supplier');
            }
            return data;
        });
    })
    .then(data => {
        // Show success message
        showNotification('Supplier added successfully', 'success');
        
        // Close modal
        document.getElementById('supplierModal').style.display = 'none';
        
        // Reload suppliers
        loadSuppliers();
    })
    .catch(error => {
        console.error('Error adding supplier:', error);
        showNotification(error.message, 'error');
    });
}

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

// Function to edit a supplier
function editSupplier(supplierId) {
    fetch(`/api/suppliers/${supplierId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load supplier details');
            }
            return response.json();
        })
        .then(data => {
            const supplier = data.supplier;
            
            // Fill form with supplier data
            document.getElementById('supplierId').value = supplier.id;
            document.getElementById('supplierName').value = supplier.name;
            document.getElementById('contactPerson').value = supplier.contact_person || '';
            document.getElementById('supplierEmail').value = supplier.email || '';
            document.getElementById('supplierPhone').value = supplier.phone || '';
            document.getElementById('supplierAddress').value = supplier.address || '';
            document.getElementById('paymentTerms').value = supplier.payment_terms || '';
            
            // Update modal title
            document.getElementById('modalTitle').textContent = 'Edit Supplier';
            
            // Show modal
            document.getElementById('supplierModal').style.display = 'block';
        })
        .catch(error => {
            console.error('Error loading supplier details:', error);
            alert('Failed to load supplier details. Please try again.');
        });
}

// Function to update a supplier
function updateSupplier(supplierId, supplierData) {
    fetch(`/api/suppliers/${supplierId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: supplierData.name,
            contact_person: supplierData.contact_person,
            email: supplierData.email,
            phone: supplierData.phone,
            address: supplierData.address,
            payment_terms: supplierData.payment_terms
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update supplier');
        }
        return response.json();
    })
    .then(data => {
        // Close modal
        document.getElementById('supplierModal').style.display = 'none';
        
        // Reload suppliers
        loadSuppliers();
    })
    .catch(error => {
        console.error('Error updating supplier:', error);
        alert('Failed to update supplier. Please try again.');
    });
}

// Function to delete a supplier
function deleteSupplier(supplierId) {
    if (confirm('Are you sure you want to delete this supplier?')) {
        fetch(`/api/suppliers/${supplierId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Failed to delete supplier');
                });
            }
            return response.json();
        })
        .then(data => {
            // Reload suppliers
            loadSuppliers();
        })
        .catch(error => {
            console.error('Error deleting supplier:', error);
            
            // Check if error message contains products
            if (error.message.includes('products associated')) {
                if (confirm(`${error.message}\n\nWould you like to reassign these products to another supplier?`)) {
                    showReassignModal(supplierId);
                }
            } else {
                alert(error.message);
            }
        });
    }
}

// Function to show reassign modal
function showReassignModal(oldSupplierId) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('reassignModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'reassignModal';
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Reassign Products</h2>
                <p>Select a new supplier for the products:</p>
                <div class="form-group">
                    <label for="newSupplier">New Supplier</label>
                    <select id="newSupplier" required>
                        <!-- Suppliers will be loaded here -->
                    </select>
                </div>
                <div class="form-actions">
                    <button id="reassignBtn" class="btn-primary">Reassign Products</button>
                    <button id="cancelReassignBtn" class="btn-secondary">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close button functionality
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Cancel button functionality
        const cancelBtn = document.getElementById('cancelReassignBtn');
        cancelBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Load suppliers for dropdown (excluding the one being deleted)
    const supplierSelect = document.getElementById('newSupplier');
    supplierSelect.innerHTML = '';
    
    fetch('/api/suppliers')
        .then(response => response.json())
        .then(data => {
            data.suppliers.forEach(supplier => {
                if (supplier.id != oldSupplierId) {
                    const option = document.createElement('option');
                    option.value = supplier.id;
                    option.textContent = supplier.name;
                    supplierSelect.appendChild(option);
                }
            });
        });
    
    // Reassign button functionality
    const reassignBtn = document.getElementById('reassignBtn');
    reassignBtn.onclick = function() {
        const newSupplierId = document.getElementById('newSupplier').value;
        
        if (!newSupplierId) {
            alert('Please select a new supplier');
            return;
        }
        
        reassignProducts(oldSupplierId, newSupplierId);
        modal.style.display = 'none';
    };
    
    // Show the modal
    modal.style.display = 'block';
}

// Function to reassign products to a new supplier
function reassignProducts(oldSupplierId, newSupplierId) {
    fetch(`/api/suppliers/${oldSupplierId}/reassign`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ new_supplier_id: newSupplierId })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error || 'Failed to reassign products');
            });
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        
        // Try to delete the supplier again after reassigning products
        if (confirm('Products have been reassigned. Do you want to delete the supplier now?')) {
            deleteSupplier(oldSupplierId);
        }
    })
    .catch(error => {
        console.error('Error reassigning products:', error);
        alert(error.message);
    });
}
