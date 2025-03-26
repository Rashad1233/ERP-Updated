/**
 * Language Definitions for ERP System
 * English-only version
 */

// Define English language strings
const translations = {
    // Login page
    'login': 'Login',
    'username': 'Username',
    'password': 'Password',
    
    // Dashboard
    'dashboard': 'Dashboard',
    'totalProducts': 'Total Products',
    'lowStockItems': 'Low Stock Items',
    'activeSuppliers': 'Active Suppliers',
    'recentSales': 'Recent Sales',
    'lowStockAlerts': 'Low Stock Alerts',
    'viewAll': 'View All',
    
    // Navigation
    'products': 'Products',
    'suppliers': 'Suppliers',
    'inventory': 'Inventory',
    'sales': 'Sales',
    'clients': 'Clients',
    'purchaseOrders': 'Purchase Orders',
    'reports': 'Reports',
    'logout': 'Logout',
    
    // User info
    'language': 'Language',
    
    // Common actions
    'add': 'Add',
    'edit': 'Edit',
    'delete': 'Delete',
    'save': 'Save',
    'cancel': 'Cancel',
    'search': 'Search',
    'filter': 'Filter',
    'apply': 'Apply',
    'clear': 'Clear',
    'confirm': 'Confirm',
    'back': 'Back',
    'next': 'Next',
    'refresh': 'Refresh',
    'export': 'Export',
    'import': 'Import',
    'print': 'Print',
    'download': 'Download',
    'upload': 'Upload',
    'details': 'Details',
    
    // Status and notifications
    'success': 'Success',
    'error': 'Error',
    'warning': 'Warning',
    'info': 'Information',
    'loading': 'Loading...',
    'confirmDelete': 'Are you sure you want to delete this item?',
    
    // Common fields
    'actions': 'Actions',
    'id': 'ID',
    'name': 'Name',
    'description': 'Description',
    'price': 'Price',
    'date': 'Date',
    'status': 'Status',
    'notes': 'Notes',
    'type': 'Type',
    'quantity': 'Quantity',
    'total': 'Total',
    
    // Procurement module
    'procurement': 'Procurement',
    'procurementDashboard': 'Procurement Dashboard',
    'requisitions': 'Purchase Requisitions',
    'rfq': 'Request for Quotations',
    'purchaseOrders': 'Purchase Orders',
    'suppliers': 'Suppliers',
    'contracts': 'Contracts',
    
    // Supplier management
    'supplierManagement': 'Supplier Management',
    'newSupplier': 'New Supplier',
    'supplierSearch': 'Search suppliers...',
    'contactPerson': 'Contact Person',
    'position': 'Position',
    'email': 'Email',
    'phone': 'Phone',
    'address': 'Address',
    'inn': 'Tax ID',
    'kpp': 'Tax Registration Code',
    'paymentTerms': 'Payment Terms',
    'deleteSupplierConfirm': 'Are you sure you want to delete this supplier?',
    'supplierCategory': 'Category',
    'supplierStatus': 'Status',
    'activeSupplier': 'Active',
    'inactiveSupplier': 'Inactive',
    'supplierOrders': 'Orders',
    'supplierActiveOrders': 'Active Orders',
    'supplierTotalAmount': 'Total Amount',
    'supplierLastOrder': 'Last Order',
    
    // Supplier categories
    'hardware': 'Hardware',
    'software': 'Software',
    'services': 'Services',
    'office': 'Office Supplies',
    'other': 'Other',
    
    // Purchase Orders
    'purchaseOrdersManagement': 'Purchase Orders',
    'newOrder': 'New Order',
    'orderSearch': 'Search orders...',
    'orderSupplier': 'Supplier',
    'orderDate': 'Order Date',
    'orderRfq': 'Related RFQ',
    'expectedDelivery': 'Expected Delivery',
    'shippingMethod': 'Shipping Method',
    'paymentMethod': 'Payment Method',
    'deliveryAddress': 'Delivery Address',
    'orderItems': 'Order Items',
    'addItem': 'Add Item',
    'removeItem': 'Remove Item',
    'orderSummary': 'Order Summary',
    'orderTotal': 'Order Total',
    'saveOrder': 'Save Order',
    'viewOrderDetails': 'Order Details',
    'printOrder': 'Print Order',
    'changeStatus': 'Change Status',
    'editOrder': 'Edit Order',
    'cancelOrder': 'Cancel Order',
    'confirmCancelOrder': 'Are you sure you want to cancel this order?',
    'orderHistory': 'Order History',
    
    // Order statuses
    'pending': 'Pending',
    'processing': 'Processing',
    'shipped': 'Shipped',
    'received': 'Received',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    
    // Shipping methods
    'pickup': 'Pickup',
    'courier': 'Courier',
    'delivery': 'Supplier Delivery',
    'post': 'Mail',
    
    // Payment methods
    'bank': 'Bank Transfer',
    'cash': 'Cash',
    'credit': 'Credit Card',
    
    // Reports
    'reportsTitle': 'Reports',
    'availableReports': 'Available Reports',
    'salesReport': 'Sales Report',
    'salesReportDesc': 'View sales performance over time',
    'inventoryReport': 'Inventory Report',
    'inventoryReportDesc': 'Current stock levels and valuation',
    'clientReport': 'Client Report',
    'clientReportDesc': 'Client activity and purchase history',
    'supplierReport': 'Supplier Report',
    'supplierReportDesc': 'Supplier performance and order history',
    'lowStockReport': 'Low Stock Report',
    'lowStockReportDesc': 'Products with low stock levels',
    'financialReport': 'Financial Report',
    'financialReportDesc': 'Revenue, expenses, and profit',
    'reportResults': 'Report Results',
    'exportPDF': 'Export PDF',
    'reportFilters': 'Report Filters',
    'dateRange': 'Date Range',
    'today': 'Today',
    'thisWeek': 'This Week',
    'thisMonth': 'This Month',
    'thisQuarter': 'This Quarter',
    'thisYear': 'This Year',
    'customRange': 'Custom Range',
    'startDate': 'Start Date',
    'endDate': 'End Date',
    'applyFilters': 'Apply Filters',
    
    // Requisition management
    'requisitionManagement': 'Purchase Requisitions',
    'newRequisition': 'New Requisition',
    'requisitionSearch': 'Search requisitions...',
    'requestor': 'Requestor',
    'department': 'Department',
    'urgency': 'Urgency',
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
    'critical': 'Critical',
    'approvalStatus': 'Approval Status',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'createdBy': 'Created By',
    'approvedBy': 'Approved By',
    'rejectedBy': 'Rejected By',
    'approvalDate': 'Approval Date',
    'rejectionDate': 'Rejection Date',
    'rejectionReason': 'Rejection Reason',
    
    // RFQ Management
    'rfqManagement': 'Request for Quotations',
    'newRfq': 'New RFQ',
    'rfqSearch': 'Search RFQs...',
    'rfqTitle': 'RFQ Title',
    'issuedDate': 'Issued Date',
    'responseDeadline': 'Response Deadline',
    'respondedSuppliers': 'Responses',
    'supplierComparison': 'Compare Suppliers',
    'selectRequisition': 'Select Requisition',
    'selectSuppliers': 'Select Suppliers',
    'inviteSuppliers': 'Invite Suppliers',
    'rfqDetails': 'RFQ Details',
    'rfqItems': 'RFQ Items',
    'rfqNotes': 'Notes for Suppliers',
    'bestPrice': 'Best Price',
    'fastestDelivery': 'Fastest Delivery',
    'bestRated': 'Best Rated',
    
    // Contracts
    'contractManagement': 'Contract Management',
    'newContract': 'New Contract',
    'contractSearch': 'Search contracts...',
    'contractTitle': 'Contract Title',
    'contractType': 'Contract Type',
    'startDate': 'Start Date',
    'endDate': 'End Date',
    'value': 'Value',
    'termsAndConditions': 'Terms & Conditions',
    'contractStatus': 'Status',
    'active': 'Active',
    'expired': 'Expired',
    'terminated': 'Terminated',
    'renewal': 'Renewal',
    'autoRenewal': 'Auto Renewal',
    'renewalDate': 'Renewal Date',
    'renewalTerms': 'Renewal Terms',
    'relatedPurchaseOrders': 'Related Purchase Orders',
    'contractSignatory': 'Signatory',
    'supplierSignatory': 'Supplier Signatory',
    'companySignatory': 'Company Signatory',
    'signatureDate': 'Signature Date',
    
    // Date selection
    'selectDate': 'Select Date',
    'apply': 'Apply',
    'clear': 'Clear',
    'from': 'From',
    'to': 'To',
    
    // Notifications
    'orderCreated': 'Order created successfully',
    'orderUpdated': 'Order updated successfully',
    'orderCancelled': 'Order cancelled successfully',
    'filtersApplied': 'Filters applied',
    'filtersCleared': 'Filters cleared',
    'itemAdded': 'Item added',
    'itemRemoved': 'Item removed',
    'printingOrder': 'Preparing order for printing',
    'dataLoadError': 'Error loading data',
    'pleaseSelectSupplier': 'Please select a supplier',
    'pleaseSelectProduct': 'Please select a product for each item',
    'quantityMustBeGreaterThanZero': 'Quantity must be greater than zero',
    'priceMustBeGreaterThanZero': 'Price must be greater than zero'
};

// Make translations globally available
window.getTranslation = function(key, defaultText) {
    return translations[key] || defaultText || key;
};

// Format currency function
window.formatCurrency = function(amount) {
    if (amount === undefined || amount === null) return '';
    
    // Format number with dollar sign
    return '$' + parseFloat(amount).toFixed(2);
};

// Simple notification function
window.showNotification = function(message, type = 'info') {
    // Check if notification container exists
    let container = document.querySelector('.notification-container');
    
    // Create container if it doesn't exist
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
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
    container.appendChild(notification);
    
    // Add show class after a small delay (for animation)
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}; 