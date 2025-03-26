// Authentication check
if (!isAuthenticated()) {
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("Procurement page loaded");
    
    // Активируем подменю Procurement
    const procurementMenu = document.querySelector('.has-submenu');
    if (procurementMenu) {
        console.log("Found procurement menu, activating");
        procurementMenu.classList.add('submenu-active');
    }
    
    // Initialize sidebar menu functionality
    initSidebar();

    // Load data
    loadPurchaseRequests();
    loadProducts();
    loadSuppliers();
    loadContracts();

    // Initialize tabs
    initTabs();

    // Initialize modals
    initModals();

    // Initialize event listeners
    initEventListeners();

    // Check for hash in URL for direct tab access
    checkUrlHash();
});

// Initialize sidebar toggle and submenus
function initSidebar() {
    // Toggle submenu
    const hasSubmenu = document.querySelectorAll('.has-submenu');
    hasSubmenu.forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' || e.target.parentElement.tagName === 'A') {
                e.stopPropagation();
                this.classList.toggle('submenu-active');
            }
        });
    });

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logout();
        });
    }
}

// Initialize tabs functionality
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and its content
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');

            // Update URL hash
            window.location.hash = tabId;
        });
    });
}

// Check URL hash for direct tab access
function checkUrlHash() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        const tab = document.querySelector(`.tab[data-tab="${hash}"]`);
        if (tab) {
            tab.click();
        }
    }
}

// Initialize modals
function initModals() {
    // Request modal
    const requestModal = document.getElementById('requestModal');
    const newRequestBtn = document.getElementById('newRequestBtn');
    const cancelRequestBtn = document.getElementById('cancelRequestBtn');
    const closeButtons = document.querySelectorAll('.close');

    if (newRequestBtn) {
        newRequestBtn.addEventListener('click', () => {
            requestModal.style.display = 'block';
        });
    }

    if (cancelRequestBtn) {
        cancelRequestBtn.addEventListener('click', () => {
            requestModal.style.display = 'none';
        });
    }

    // Contract modal
    const contractModal = document.getElementById('contractModal');
    const addContractBtn = document.createElement('button');
    addContractBtn.className = 'btn-primary';
    addContractBtn.innerHTML = '<i class="fas fa-plus"></i> New Contract';
    addContractBtn.id = 'addContractBtn';
    
    const contractTab = document.getElementById('contracts');
    if (contractTab) {
        const contractHeader = contractTab.querySelector('.search-bar');
        if (contractHeader) {
            contractHeader.parentNode.insertBefore(addContractBtn, contractHeader);
        }
    }

    if (addContractBtn) {
        addContractBtn.addEventListener('click', () => {
            contractModal.style.display = 'block';
        });
    }

    const cancelContractBtn = document.getElementById('cancelContractBtn');
    if (cancelContractBtn) {
        cancelContractBtn.addEventListener('click', () => {
            contractModal.style.display = 'none';
        });
    }

    // Close modal when clicking on X or outside the modal
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Initialize event listeners
function initEventListeners() {
    // Form submissions
    const requestForm = document.getElementById('requestForm');
    if (requestForm) {
        requestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitPurchaseRequest();
        });
    }

    const contractForm = document.getElementById('contractForm');
    if (contractForm) {
        contractForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitContract();
        });
    }

    // Add request item button
    const addRequestItemBtn = document.getElementById('addRequestItemBtn');
    if (addRequestItemBtn) {
        addRequestItemBtn.addEventListener('click', addRequestItem);
    }

    // Run price comparison
    const runComparisonBtn = document.getElementById('runComparisonBtn');
    if (runComparisonBtn) {
        runComparisonBtn.addEventListener('click', runPriceComparison);
    }

    // Search functionality
    const requestSearch = document.getElementById('requestSearch');
    if (requestSearch) {
        requestSearch.addEventListener('input', function() {
            searchRequests(this.value);
        });
    }

    const contractSearch = document.getElementById('contractSearch');
    if (contractSearch) {
        contractSearch.addEventListener('input', function() {
            searchContracts(this.value);
        });
    }
}

// Load purchase requests from the server
function loadPurchaseRequests() {
    // Simulate API call with sample data for now
    const requests = [
        { id: 'PR001', requester: 'John Doe', department: 'Production', date: '2023-03-15', status: 'Pending', totalItems: 3 },
        { id: 'PR002', requester: 'Jane Smith', department: 'IT', date: '2023-03-14', status: 'Approved', totalItems: 2 },
        { id: 'PR003', requester: 'Mike Johnson', department: 'Marketing', date: '2023-03-12', status: 'Rejected', totalItems: 1 },
        { id: 'PR004', requester: 'Sarah Brown', department: 'Sales', date: '2023-03-10', status: 'Completed', totalItems: 5 }
    ];

    displayPurchaseRequests(requests);
}

// Display purchase requests in the table
function displayPurchaseRequests(requests) {
    const requestsTable = document.getElementById('requestsTable');
    if (!requestsTable) return;

    requestsTable.innerHTML = '';

    requests.forEach(request => {
        const statusClass = getStatusClass(request.status);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${request.id}</td>
            <td>${request.requester}</td>
            <td>${request.department}</td>
            <td>${request.date}</td>
            <td><span class="status-badge ${statusClass}">${request.status}</span></td>
            <td>${request.totalItems}</td>
            <td class="actions">
                <button class="btn-icon view-request" data-id="${request.id}"><i class="fas fa-eye"></i></button>
                <button class="btn-icon edit-request" data-id="${request.id}"><i class="fas fa-edit"></i></button>
                <button class="btn-icon delete-request" data-id="${request.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        requestsTable.appendChild(row);
    });

    // Add event listeners to action buttons
    addRequestActionListeners();
}

// Get appropriate CSS class for status
function getStatusClass(status) {
    switch(status.toLowerCase()) {
        case 'pending': return 'status-pending';
        case 'approved': return 'status-success';
        case 'completed': return 'status-success';
        case 'rejected': return 'status-danger';
        case 'cancelled': return 'status-danger';
        default: return 'status-default';
    }
}

// Add event listeners to request action buttons
function addRequestActionListeners() {
    const viewButtons = document.querySelectorAll('.view-request');
    const editButtons = document.querySelectorAll('.edit-request');
    const deleteButtons = document.querySelectorAll('.delete-request');

    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const requestId = this.getAttribute('data-id');
            viewRequestDetails(requestId);
        });
    });

    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const requestId = this.getAttribute('data-id');
            editRequest(requestId);
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const requestId = this.getAttribute('data-id');
            deleteRequest(requestId);
        });
    });
}

// Load products for the forms
function loadProducts() {
    // Simulate API call with sample data
    const products = [
        { id: 1, name: 'Laptop', price: 1200 },
        { id: 2, name: 'Monitor', price: 350 },
        { id: 3, name: 'Keyboard', price: 75 },
        { id: 4, name: 'Mouse', price: 30 },
        { id: 5, name: 'Office Chair', price: 250 }
    ];

    populateProductDropdowns(products);
}

// Populate product dropdowns in forms
function populateProductDropdowns(products) {
    const productDropdowns = document.querySelectorAll('.product-select');
    const compareProduct = document.getElementById('compareProduct');

    productDropdowns.forEach(dropdown => {
        dropdown.innerHTML = '<option value="">Select Product</option>';
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = product.name;
            option.dataset.price = product.price;
            dropdown.appendChild(option);
        });
    });

    if (compareProduct) {
        compareProduct.innerHTML = '<option value="">Select Product</option>';
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = product.name;
            compareProduct.appendChild(option);
        });
    }
}

// Load suppliers for the forms
function loadSuppliers() {
    // Simulate API call with sample data
    const suppliers = [
        { id: 1, name: 'Tech Solutions Inc.', rating: 4.5 },
        { id: 2, name: 'Office Supplies Co.', rating: 4.2 },
        { id: 3, name: 'Furniture Direct', rating: 3.8 },
        { id: 4, name: 'Global Electronics', rating: 4.7 }
    ];

    populateSupplierDropdowns(suppliers);
}

// Populate supplier dropdowns in forms
function populateSupplierDropdowns(suppliers) {
    const contractSupplier = document.getElementById('contractSupplier');

    if (contractSupplier) {
        contractSupplier.innerHTML = '<option value="">Select Supplier</option>';
        suppliers.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier.id;
            option.textContent = supplier.name;
            contractSupplier.appendChild(option);
        });
    }
}

// Load contracts from the server
function loadContracts() {
    // Simulate API call with sample data
    const contracts = [
        { id: 'C001', supplier: 'Tech Solutions Inc.', startDate: '2023-01-01', endDate: '2023-12-31', status: 'Active', value: 50000 },
        { id: 'C002', supplier: 'Office Supplies Co.', startDate: '2023-02-15', endDate: '2023-08-15', status: 'Active', value: 25000 },
        { id: 'C003', supplier: 'Furniture Direct', startDate: '2022-06-01', endDate: '2023-05-31', status: 'Expiring', value: 35000 },
        { id: 'C004', supplier: 'Global Electronics', startDate: '2022-03-15', endDate: '2023-03-15', status: 'Expired', value: 75000 }
    ];

    displayContracts(contracts);
}

// Display contracts in the table
function displayContracts(contracts) {
    const contractsTable = document.getElementById('contractsTable');
    if (!contractsTable) return;

    contractsTable.innerHTML = '';

    contracts.forEach(contract => {
        const statusClass = getContractStatusClass(contract.status);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contract.id}</td>
            <td>${contract.supplier}</td>
            <td>${contract.startDate}</td>
            <td>${contract.endDate}</td>
            <td><span class="status-badge ${statusClass}">${contract.status}</span></td>
            <td>$${contract.value.toLocaleString()}</td>
            <td class="actions">
                <button class="btn-icon view-contract" data-id="${contract.id}"><i class="fas fa-eye"></i></button>
                <button class="btn-icon edit-contract" data-id="${contract.id}"><i class="fas fa-edit"></i></button>
                <button class="btn-icon delete-contract" data-id="${contract.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        contractsTable.appendChild(row);
    });

    // Add event listeners to action buttons
    addContractActionListeners();
}

// Get appropriate CSS class for contract status
function getContractStatusClass(status) {
    switch(status.toLowerCase()) {
        case 'active': return 'status-success';
        case 'expiring': return 'status-warning';
        case 'expired': return 'status-danger';
        default: return 'status-default';
    }
}

// Add event listeners to contract action buttons
function addContractActionListeners() {
    const viewButtons = document.querySelectorAll('.view-contract');
    const editButtons = document.querySelectorAll('.edit-contract');
    const deleteButtons = document.querySelectorAll('.delete-contract');

    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const contractId = this.getAttribute('data-id');
            viewContractDetails(contractId);
        });
    });

    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const contractId = this.getAttribute('data-id');
            editContract(contractId);
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const contractId = this.getAttribute('data-id');
            deleteContract(contractId);
        });
    });
}

// Add new purchase request item
function addRequestItem() {
    const requestItems = document.getElementById('requestItems');
    const itemCount = requestItems.querySelectorAll('.request-item').length;
    
    const newItem = document.createElement('div');
    newItem.className = 'request-item';
    newItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label for="req-product-${itemCount}">Product</label>
                <select id="req-product-${itemCount}" class="product-select" required>
                    <!-- Products will be loaded here -->
                </select>
            </div>
            <div class="form-group">
                <label for="req-quantity-${itemCount}">Quantity</label>
                <input type="number" id="req-quantity-${itemCount}" class="quantity-input" min="1" value="1" required>
            </div>
            <div class="form-group">
                <label for="req-reason-${itemCount}">Reason</label>
                <input type="text" id="req-reason-${itemCount}" class="reason-input" required>
            </div>
            <button type="button" class="btn-danger remove-item"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    requestItems.appendChild(newItem);
    
    // Enable remove buttons
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.disabled = removeButtons.length <= 1;
        button.addEventListener('click', function() {
            if (removeButtons.length > 1) {
                this.closest('.request-item').remove();
                // Update remove buttons state after removal
                const updatedRemoveButtons = document.querySelectorAll('.remove-item');
                updatedRemoveButtons.forEach(btn => {
                    btn.disabled = updatedRemoveButtons.length <= 1;
                });
            }
        });
    });

    // Load products in the new dropdown
    loadProducts();
}

// Submit purchase request
function submitPurchaseRequest() {
    const requesterName = document.getElementById('requesterName').value;
    const department = document.getElementById('department').value;
    const notes = document.getElementById('requestNotes').value;
    
    // Collect items
    const items = [];
    const requestItems = document.querySelectorAll('.request-item');
    
    requestItems.forEach((item, index) => {
        const productSelect = document.getElementById(`req-product-${index}`);
        const product = productSelect ? productSelect.options[productSelect.selectedIndex].text : '';
        const productId = productSelect ? productSelect.value : '';
        const quantity = document.getElementById(`req-quantity-${index}`).value;
        const reason = document.getElementById(`req-reason-${index}`).value;
        
        items.push({
            productId,
            product,
            quantity,
            reason
        });
    });
    
    // Create request object
    const request = {
        requester: requesterName,
        department,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        notes,
        items
    };
    
    console.log('Submitting purchase request:', request);
    
    // Here you would send the data to the server
    // For now, simulate success and reload data
    alert('Purchase request submitted successfully!');
    document.getElementById('requestModal').style.display = 'none';
    document.getElementById('requestForm').reset();
    
    // Reload data to show the new request
    loadPurchaseRequests();
}

// Submit contract
function submitContract() {
    const supplierSelect = document.getElementById('contractSupplier');
    const supplier = supplierSelect.options[supplierSelect.selectedIndex].text;
    const supplierId = supplierSelect.value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const value = document.getElementById('contractValue').value;
    const terms = document.getElementById('contractTerms').value;
    
    // Create contract object
    const contract = {
        supplier,
        supplierId,
        startDate,
        endDate,
        value,
        terms,
        status: 'Active'
    };
    
    console.log('Submitting contract:', contract);
    
    // Here you would send the data to the server
    // For now, simulate success and reload data
    alert('Contract created successfully!');
    document.getElementById('contractModal').style.display = 'none';
    document.getElementById('contractForm').reset();
    
    // Reload data to show the new contract
    loadContracts();
}

// Run price comparison
function runPriceComparison() {
    const productSelect = document.getElementById('compareProduct');
    const product = productSelect.options[productSelect.selectedIndex].text;
    const quantity = document.getElementById('compareQuantity').value;
    
    if (!productSelect.value || quantity < 1) {
        alert('Please select a product and valid quantity');
        return;
    }
    
    // Simulate API call to get supplier prices
    const comparisonResults = [
        { supplier: 'Tech Solutions Inc.', unitPrice: 1150, totalPrice: 1150 * quantity, deliveryTime: '3-5 days', rating: 4.5 },
        { supplier: 'Office Supplies Co.', unitPrice: 1200, totalPrice: 1200 * quantity, deliveryTime: '2-3 days', rating: 4.2 },
        { supplier: 'Global Electronics', unitPrice: 1180, totalPrice: 1180 * quantity, deliveryTime: '4-6 days', rating: 4.7 }
    ];
    
    // Sort by total price (lowest first)
    comparisonResults.sort((a, b) => a.totalPrice - b.totalPrice);
    
    displayComparisonResults(comparisonResults);
}

// Display price comparison results
function displayComparisonResults(results) {
    const comparisonTable = document.getElementById('comparisonTable');
    if (!comparisonTable) return;
    
    comparisonTable.innerHTML = '';
    
    results.forEach((result, index) => {
        const row = document.createElement('tr');
        row.className = index === 0 ? 'best-price' : '';
        
        const ratingStars = getRatingStars(result.rating);
        
        row.innerHTML = `
            <td>${result.supplier}</td>
            <td>$${result.unitPrice.toLocaleString()}</td>
            <td>$${result.totalPrice.toLocaleString()}</td>
            <td>${result.deliveryTime}</td>
            <td>${ratingStars}</td>
            <td><button class="btn-primary create-po" data-supplier="${result.supplier}">Create PO</button></td>
        `;
        
        comparisonTable.appendChild(row);
    });
    
    // Add event listeners to Create PO buttons
    const createPoButtons = document.querySelectorAll('.create-po');
    createPoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const supplier = this.getAttribute('data-supplier');
            createPurchaseOrder(supplier);
        });
    });
}

// Generate HTML for rating stars
function getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHtml = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    
    return starsHtml;
}

// Create purchase order from comparison
function createPurchaseOrder(supplier) {
    const product = document.getElementById('compareProduct');
    const productName = product.options[product.selectedIndex].text;
    const quantity = document.getElementById('compareQuantity').value;
    
    // Redirect to purchase orders page with parameters
    window.location.href = `purchase-orders.html?supplier=${encodeURIComponent(supplier)}&product=${encodeURIComponent(productName)}&quantity=${quantity}`;
}

// Search purchase requests
function searchRequests(query) {
    if (!query) {
        loadPurchaseRequests();
        return;
    }
    
    // Simulate searching through requests
    const requests = [
        { id: 'PR001', requester: 'John Doe', department: 'Production', date: '2023-03-15', status: 'Pending', totalItems: 3 },
        { id: 'PR002', requester: 'Jane Smith', department: 'IT', date: '2023-03-14', status: 'Approved', totalItems: 2 },
        { id: 'PR003', requester: 'Mike Johnson', department: 'Marketing', date: '2023-03-12', status: 'Rejected', totalItems: 1 },
        { id: 'PR004', requester: 'Sarah Brown', department: 'Sales', date: '2023-03-10', status: 'Completed', totalItems: 5 }
    ];
    
    query = query.toLowerCase();
    
    const filteredRequests = requests.filter(request => 
        request.id.toLowerCase().includes(query) ||
        request.requester.toLowerCase().includes(query) ||
        request.department.toLowerCase().includes(query) ||
        request.status.toLowerCase().includes(query)
    );
    
    displayPurchaseRequests(filteredRequests);
}

// Search contracts
function searchContracts(query) {
    if (!query) {
        loadContracts();
        return;
    }
    
    // Simulate searching through contracts
    const contracts = [
        { id: 'C001', supplier: 'Tech Solutions Inc.', startDate: '2023-01-01', endDate: '2023-12-31', status: 'Active', value: 50000 },
        { id: 'C002', supplier: 'Office Supplies Co.', startDate: '2023-02-15', endDate: '2023-08-15', status: 'Active', value: 25000 },
        { id: 'C003', supplier: 'Furniture Direct', startDate: '2022-06-01', endDate: '2023-05-31', status: 'Expiring', value: 35000 },
        { id: 'C004', supplier: 'Global Electronics', startDate: '2022-03-15', endDate: '2023-03-15', status: 'Expired', value: 75000 }
    ];
    
    query = query.toLowerCase();
    
    const filteredContracts = contracts.filter(contract => 
        contract.id.toLowerCase().includes(query) ||
        contract.supplier.toLowerCase().includes(query) ||
        contract.status.toLowerCase().includes(query)
    );
    
    displayContracts(filteredContracts);
}

// View request details
function viewRequestDetails(requestId) {
    alert(`Viewing details for request ${requestId}`);
    // Here you would fetch details from server and show them in a modal
}

// Edit request
function editRequest(requestId) {
    alert(`Editing request ${requestId}`);
    // Here you would fetch details from server and populate the form for editing
}

// Delete request
function deleteRequest(requestId) {
    if (confirm(`Are you sure you want to delete request ${requestId}?`)) {
        alert(`Request ${requestId} deleted!`);
        // Here you would send delete request to server
        // For now, just reload data
        loadPurchaseRequests();
    }
}

// View contract details
function viewContractDetails(contractId) {
    alert(`Viewing details for contract ${contractId}`);
    // Here you would fetch details from server and show them in a modal
}

// Edit contract
function editContract(contractId) {
    alert(`Editing contract ${contractId}`);
    // Here you would fetch details from server and populate the form for editing
}

// Delete contract
function deleteContract(contractId) {
    if (confirm(`Are you sure you want to delete contract ${contractId}?`)) {
        alert(`Contract ${contractId} deleted!`);
        // Here you would send delete request to server
        // For now, just reload data
        loadContracts();
    }
} 