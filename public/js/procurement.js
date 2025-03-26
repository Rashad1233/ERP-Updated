// procurement.js - Функциональность страницы управления закупками

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация вкладок
    initTabs();
    
    // Инициализация форм
    initForms();
    
    // Инициализация модальных окон
    initModals();
    
    // Автоматически активируем выпадающее меню закупок
    const procurementMenu = document.querySelector('.sidebar-menu li.has-submenu');
    if (procurementMenu) {
        procurementMenu.classList.add('submenu-active');
        const submenu = procurementMenu.querySelector('.submenu');
        if (submenu) {
            submenu.style.display = 'block';
        }
    }
    
    // Установка текущей даты для форм
    setCurrentDate();
    
    // Загрузка данных из базы
    loadDashboardData();
    loadRequisitions();
    loadRfqs();
    loadPurchaseOrders();
    loadSuppliers();
    loadContracts();
    loadProducts();
});

// Установка текущей даты для полей формы
function setCurrentDate() {
    const today = new Date().toISOString().split('T')[0];
    
    // Установка текущей даты в полях создания заявки
    const requestDate = document.getElementById('requestDate');
    if (requestDate) requestDate.value = today;
    
    // Установка текущей даты в полях RFQ
    const issueDate = document.getElementById('issueDate');
    if (issueDate) issueDate.value = today;
    
    // Установка текущей даты в полях контракта
    const startDate = document.getElementById('startDate');
    if (startDate) startDate.value = today;
}

// Инициализация вкладок
function initTabs() {
    const tabs = document.querySelectorAll('.tabs .tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Удаляем класс active у всех вкладок и контента
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Добавляем класс active текущей вкладке
            this.classList.add('active');
            
            // Активируем соответствующий контент
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Обновляем URL с хэшем для прямых ссылок
            window.location.hash = tabId;
        });
    });
    
    // Проверяем хэш в URL для активации соответствующей вкладки
    const hash = window.location.hash.substring(1);
    if (hash) {
        const activeTab = document.querySelector(`.tabs .tab[data-tab="${hash}"]`);
        if (activeTab) {
            activeTab.click();
        }
    } else {
        // По умолчанию активируем первую вкладку
        const firstTab = document.querySelector('.tabs .tab');
        if (firstTab) firstTab.click();
    }
}

// Инициализация форм
function initForms() {
    // Форма заявки на закупку
    const requisitionForm = document.getElementById('requisitionForm');
    if (requisitionForm) {
        requisitionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveRequisition();
        });
    }
    
    // Форма RFQ
    const rfqForm = document.getElementById('rfqForm');
    if (rfqForm) {
        rfqForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveRfq();
        });
    }
    
    // Форма поставщика
    const supplierForm = document.getElementById('supplierForm');
    if (supplierForm) {
        supplierForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSupplier();
        });
    }
    
    // Форма контракта
    const contractForm = document.getElementById('contractForm');
    if (contractForm) {
        contractForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveContract();
        });
    }
    
    // Кнопка создания новой заявки
    const newRequisitionBtn = document.getElementById('newRequisitionBtn');
    if (newRequisitionBtn) {
        newRequisitionBtn.addEventListener('click', function() {
            openModal('requisitionModal');
        });
    }
    
    // Кнопка создания нового RFQ
    const newRfqBtn = document.getElementById('newRfqBtn');
    if (newRfqBtn) {
        newRfqBtn.addEventListener('click', function() {
            openModal('rfqModal');
        });
    }
    
    // Кнопка создания нового поставщика
    const newSupplierBtn = document.getElementById('newSupplierBtn');
    if (newSupplierBtn) {
        newSupplierBtn.addEventListener('click', function() {
            openModal('supplierModal');
        });
    }
    
    // Кнопка создания нового контракта
    const newContractBtn = document.getElementById('newContractBtn');
    if (newContractBtn) {
        newContractBtn.addEventListener('click', function() {
            openModal('contractModal');
        });
    }
    
    // Кнопка добавления предмета в заявку
    const addRequisitionItemBtn = document.getElementById('addRequisitionItemBtn');
    if (addRequisitionItemBtn) {
        addRequisitionItemBtn.addEventListener('click', addRequisitionItem);
    }
    
    // Кнопка добавления предмета в RFQ
    const addRfqItemBtn = document.getElementById('addRfqItemBtn');
    if (addRfqItemBtn) {
        addRfqItemBtn.addEventListener('click', addRfqItem);
    }
    
    // Кнопки отмены
    const cancelBtns = document.querySelectorAll('#cancelRequisitionBtn, #cancelRfqBtn, #cancelSupplierBtn, #cancelContractBtn');
    cancelBtns.forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    // Кнопки управления в модальном окне просмотра заявки
    const closeViewReqBtn = document.getElementById('closeViewReqBtn');
    if (closeViewReqBtn) {
        closeViewReqBtn.addEventListener('click', closeModals);
    }
    
    const createRfqFromReqBtn = document.getElementById('createRfqFromReqBtn');
    if (createRfqFromReqBtn) {
        createRfqFromReqBtn.addEventListener('click', function() {
            const reqId = document.getElementById('view-req-id').textContent;
            createRfqFromRequisition(reqId);
        });
    }
    
    const approveReqBtn = document.getElementById('approveReqBtn');
    if (approveReqBtn) {
        approveReqBtn.addEventListener('click', function() {
            const reqId = document.getElementById('view-req-id').textContent;
            approveRequisition(reqId);
        });
    }
    
    const rejectReqBtn = document.getElementById('rejectReqBtn');
    if (rejectReqBtn) {
        rejectReqBtn.addEventListener('click', function() {
            const reqId = document.getElementById('view-req-id').textContent;
            rejectRequisition(reqId);
        });
    }
    
    const editReqBtn = document.getElementById('editReqBtn');
    if (editReqBtn) {
        editReqBtn.addEventListener('click', function() {
            const reqId = document.getElementById('view-req-id').textContent;
            closeModals();
            editRequisition(reqId);
        });
    }
}

// Инициализация модальных окон
function initModals() {
    // Закрытие модального окна при клике на крестик
    const closeBtns = document.querySelectorAll('.modal .close');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    // Закрытие модального окна при клике вне его
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModals();
        }
    });
}

// Открыть модальное окно
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

// Закрыть все модальные окна
function closeModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Загрузка данных для дашборда
function loadDashboardData() {
    // В реальном приложении здесь был бы API-запрос
    // Имитируем загрузку данных с помощью таймаута
    setTimeout(() => {
        // Обновляем карточки с данными
        document.getElementById('pendingRequisitions').textContent = '5';
        document.getElementById('activeRfqs').textContent = '3';
        document.getElementById('openPOs').textContent = '7';
        document.getElementById('activeSuppliers').textContent = '12';
        
        // Загружаем последние заявки
        loadRecentRequisitions();
        
        // Загружаем последние заказы
        loadRecentPurchaseOrders();
    }, 500);
}

// Загрузка последних заявок на закупку
function loadRecentRequisitions() {
    setTimeout(() => {
        const recentRequisitionsTable = document.getElementById('recentRequisitionsTable');
        if (!recentRequisitionsTable) return;
        
        // Демо-данные
        const requisitions = [
            { id: 'REQ2023001', requester: 'John Doe', department: 'Production', date: '2023-05-15', status: 'Approved' },
            { id: 'REQ2023002', requester: 'Jane Smith', department: 'Marketing', date: '2023-05-16', status: 'Pending' },
            { id: 'REQ2023003', requester: 'Mike Johnson', department: 'IT', date: '2023-05-17', status: 'Rejected' }
        ];
        
        // Заполняем таблицу
        recentRequisitionsTable.innerHTML = requisitions.map(req => `
            <tr>
                <td>${req.id}</td>
                <td>${req.requester}</td>
                <td>${req.department}</td>
                <td>${req.date}</td>
                <td><span class="status-badge status-${req.status.toLowerCase()}">${req.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view-req-btn" data-id="${req.id}"><i class="fas fa-eye"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        // Добавляем обработчики событий для кнопок
        recentRequisitionsTable.querySelectorAll('.view-req-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                viewRequisition(id);
            });
        });
    }, 500);
}

// Загрузка последних заказов на покупку
function loadRecentPurchaseOrders() {
    setTimeout(() => {
        const recentPOTable = document.getElementById('recentPOTable');
        if (!recentPOTable) return;
        
        // Демо-данные
        const purchaseOrders = [
            { id: 'PO2023001', supplier: 'ABC Suppliers', date: '2023-05-12', status: 'Open', total: 5000 },
            { id: 'PO2023002', supplier: 'XYZ Corporation', date: '2023-05-14', status: 'Processing', total: 7500 },
            { id: 'PO2023003', supplier: 'Global Trade Partners', date: '2023-05-10', status: 'Delivered', total: 3000 }
        ];
        
        // Заполняем таблицу
        recentPOTable.innerHTML = purchaseOrders.map(po => `
            <tr>
                <td>${po.id}</td>
                <td>${po.supplier}</td>
                <td>${po.date}</td>
                <td><span class="status-badge status-${po.status.toLowerCase()}">${po.status}</span></td>
                <td>${formatCurrency(po.total)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view-po-btn" data-id="${po.id}"><i class="fas fa-eye"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        // Добавляем обработчики событий для кнопок
        recentPOTable.querySelectorAll('.view-po-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                viewPurchaseOrder(id);
            });
        });
    }, 500);
}

// Загрузка заявок на закупку
function loadRequisitions() {
    // В реальном приложении здесь был бы API-запрос
    // Имитируем загрузку данных с помощью таймаута
    setTimeout(() => {
        const requisitionsTable = document.getElementById('requisitionsTable');
        if (!requisitionsTable) return;
        
        // Демо-данные
        const requisitions = [
            { id: 'REQ2023001', requester: 'John Doe', department: 'Production', date: '2023-05-15', status: 'Approved', items: 5 },
            { id: 'REQ2023002', requester: 'Jane Smith', department: 'Marketing', date: '2023-05-16', status: 'Pending', items: 3 },
            { id: 'REQ2023003', requester: 'Mike Johnson', department: 'IT', date: '2023-05-17', status: 'Rejected', items: 2 },
            { id: 'REQ2023004', requester: 'Sarah Williams', department: 'HR', date: '2023-05-18', status: 'Pending', items: 1 },
            { id: 'REQ2023005', requester: 'Robert Brown', department: 'Finance', date: '2023-05-19', status: 'Approved', items: 4 }
        ];
        
        // Заполняем таблицу
        requisitionsTable.innerHTML = requisitions.map(req => `
            <tr>
                <td>${req.id}</td>
                <td>${req.requester}</td>
                <td>${req.department}</td>
                <td>${req.date}</td>
                <td><span class="status-badge status-${req.status.toLowerCase()}">${req.status}</span></td>
                <td>${req.items}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view-req-btn" data-id="${req.id}"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit-req-btn" data-id="${req.id}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-req-btn" data-id="${req.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        // Добавляем обработчики событий для кнопок
        requisitionsTable.querySelectorAll('.view-req-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                viewRequisition(id);
            });
        });
        
        requisitionsTable.querySelectorAll('.edit-req-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                editRequisition(id);
            });
        });
        
        requisitionsTable.querySelectorAll('.delete-req-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                deleteRequisition(id);
            });
        });
        
        // Также заполняем выпадающий список в форме RFQ
        const relatedRequisition = document.getElementById('relatedRequisition');
        if (relatedRequisition) {
            // Фильтруем только одобренные заявки
            const approvedRequisitions = requisitions.filter(req => req.status === 'Approved');
            const options = approvedRequisitions.map(req => 
                `<option value="${req.id}">${req.id} - ${req.requester} (${req.department})</option>`
            );
            
            // Добавляем опцию "None" в начало списка
            relatedRequisition.innerHTML = '<option value="">None (Manual RFQ)</option>' + options.join('');
        }
    }, 500);
}

// Загрузка поставщиков
function loadSuppliers() {
    // В реальном приложении здесь был бы API-запрос
    // Имитируем загрузку данных с помощью таймаута
    setTimeout(() => {
        const supplierSelect = document.getElementById('contractSupplier');
        if (!supplierSelect) return;
        
        // Демо-данные
        const suppliers = [
            { id: 1, name: 'ABC Suppliers' },
            { id: 2, name: 'XYZ Corporation' },
            { id: 3, name: 'Global Trade Partners' },
            { id: 4, name: 'Tech Components Ltd' }
        ];
        
        // Заполняем селект
        supplierSelect.innerHTML = suppliers.map(supplier => 
            `<option value="${supplier.id}">${supplier.name}</option>`
        ).join('');
    }, 500);
}

// Загрузка продуктов
function loadProducts() {
    // В реальном приложении здесь был бы API-запрос
    // Имитируем загрузку данных с помощью таймаута
    setTimeout(() => {
        // Заполняем селект для сравнения цен
        const compareProduct = document.getElementById('compareProduct');
        if (compareProduct) {
            loadProductsIntoSelect('compareProduct');
        }
        
        // Заполняем селект для первого элемента запроса
        loadProductsIntoSelect('req-product-0');
    }, 500);
}

// Загрузка продуктов в указанный селект
function loadProductsIntoSelect(selectId) {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) return;
    
    // Демо-данные
    const products = [
        { id: 1, name: 'Laptop Dell XPS 13' },
        { id: 2, name: 'Smartphone iPhone 13' },
        { id: 3, name: 'Monitor LG UltraWide' },
        { id: 4, name: 'Keyboard Logitech MX Keys' },
        { id: 5, name: 'Mouse Logitech MX Master' }
    ];
    
    // Заполняем селект
    selectElement.innerHTML = products.map(product => 
        `<option value="${product.id}">${product.name}</option>`
    ).join('');
}

// Загрузка контрактов
function loadContracts() {
    // В реальном приложении здесь был бы API-запрос
    // Имитируем загрузку данных с помощью таймаута
    setTimeout(() => {
        const contractsTable = document.getElementById('contractsTable');
        if (!contractsTable) return;
        
        // Демо-данные
        const contracts = [
            { id: 'C001', supplier: 'ABC Suppliers', startDate: '2023-01-01', endDate: '2023-12-31', status: 'Active', value: 50000 },
            { id: 'C002', supplier: 'XYZ Corporation', startDate: '2023-03-15', endDate: '2024-03-14', status: 'Active', value: 75000 },
            { id: 'C003', supplier: 'Global Trade Partners', startDate: '2022-11-01', endDate: '2023-04-30', status: 'Expired', value: 30000 }
        ];
        
        // Заполняем таблицу
        contractsTable.innerHTML = contracts.map(contract => `
            <tr>
                <td>${contract.id}</td>
                <td>${contract.supplier}</td>
                <td>${contract.startDate}</td>
                <td>${contract.endDate}</td>
                <td><span class="status-badge status-${contract.status.toLowerCase()}">${contract.status}</span></td>
                <td>${formatCurrency(contract.value)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view-btn" data-id="${contract.id}"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit-btn" data-id="${contract.id}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-btn" data-id="${contract.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        // Добавляем обработчики событий для кнопок
        contractsTable.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                viewContract(id);
            });
        });
        
        contractsTable.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                editContract(id);
            });
        });
        
        contractsTable.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                deleteContract(id);
            });
        });
    }, 500);
}

// Загрузка запросов на коммерческое предложение (RFQ)
function loadRfqs() {
    // В реальном приложении здесь был бы API-запрос
    // Имитируем загрузку данных с помощью таймаута
    setTimeout(() => {
        const rfqsTable = document.getElementById('rfqsTable');
        if (!rfqsTable) return;
        
        // Демо-данные
        const rfqs = [
            { id: 'RFQ2023001', requisition: 'REQ2023001', issueDate: '2023-05-16', dueDate: '2023-05-23', status: 'Open', suppliers: 3 },
            { id: 'RFQ2023002', requisition: 'REQ2023005', issueDate: '2023-05-19', dueDate: '2023-05-26', status: 'Pending', suppliers: 2 },
            { id: 'RFQ2023003', requisition: '', issueDate: '2023-05-20', dueDate: '2023-05-27', status: 'Closed', suppliers: 4 }
        ];
        
        // Заполняем таблицу
        rfqsTable.innerHTML = rfqs.map(rfq => `
            <tr>
                <td>${rfq.id}</td>
                <td>${rfq.requisition || 'N/A'}</td>
                <td>${rfq.issueDate}</td>
                <td>${rfq.dueDate}</td>
                <td><span class="status-badge status-${rfq.status.toLowerCase()}">${rfq.status}</span></td>
                <td>${rfq.suppliers}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view-rfq-btn" data-id="${rfq.id}"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit-rfq-btn" data-id="${rfq.id}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-rfq-btn" data-id="${rfq.id}"><i class="fas fa-trash"></i></button>
                        ${rfq.status === 'Open' ? `<button class="action-btn create-po-btn" data-id="${rfq.id}"><i class="fas fa-file-invoice"></i></button>` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
        
        // Добавляем обработчики событий для кнопок
        rfqsTable.querySelectorAll('.view-rfq-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                viewRfq(id);
            });
        });
        
        rfqsTable.querySelectorAll('.edit-rfq-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                editRfq(id);
            });
        });
        
        rfqsTable.querySelectorAll('.delete-rfq-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                deleteRfq(id);
            });
        });
        
        rfqsTable.querySelectorAll('.create-po-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                createPurchaseOrderFromRfq(id);
            });
        });
    }, 500);
}

// Загрузка заказов на покупку
function loadPurchaseOrders() {
    // В реальном приложении здесь был бы API-запрос
    // Имитируем загрузку данных с помощью таймаута
    setTimeout(() => {
        const purchaseOrdersTable = document.getElementById('purchaseOrdersTable');
        if (!purchaseOrdersTable) return;
        
        // Демо-данные
        const purchaseOrders = [
            { id: 'PO2023001', rfq: 'RFQ2023001', supplier: 'ABC Suppliers', issueDate: '2023-05-17', deliveryDate: '2023-06-01', status: 'Open', total: 5000 },
            { id: 'PO2023002', rfq: 'RFQ2023002', supplier: 'XYZ Corporation', issueDate: '2023-05-20', deliveryDate: '2023-06-05', status: 'Processing', total: 7500 },
            { id: 'PO2023003', rfq: 'RFQ2023003', supplier: 'Global Trade Partners', issueDate: '2023-05-22', deliveryDate: '2023-06-10', status: 'Delivered', total: 3000 }
        ];
        
        // Заполняем таблицу
        purchaseOrdersTable.innerHTML = purchaseOrders.map(po => `
            <tr>
                <td>${po.id}</td>
                <td>${po.rfq}</td>
                <td>${po.supplier}</td>
                <td>${po.issueDate}</td>
                <td>${po.deliveryDate}</td>
                <td><span class="status-badge status-${po.status.toLowerCase()}">${po.status}</span></td>
                <td>${formatCurrency(po.total)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view-po-btn" data-id="${po.id}"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit-po-btn" data-id="${po.id}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-po-btn" data-id="${po.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        // Добавляем обработчики событий для кнопок
        purchaseOrdersTable.querySelectorAll('.view-po-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                viewPurchaseOrder(id);
            });
        });
        
        purchaseOrdersTable.querySelectorAll('.edit-po-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                editPurchaseOrder(id);
            });
        });
        
        purchaseOrdersTable.querySelectorAll('.delete-po-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                deletePurchaseOrder(id);
            });
        });
    }, 500);
}

// Добавить предмет в заявку на закупку
function addRequisitionItem() {
    const requisitionItems = document.getElementById('requisitionItems');
    const itemCount = requisitionItems.children.length;
    
    // Создаем новый элемент
    const newItem = document.createElement('div');
    newItem.className = 'requisition-item';
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
                <label for="req-date-needed-${itemCount}">Date Needed</label>
                <input type="date" id="req-date-needed-${itemCount}" class="date-needed-input" required>
            </div>
            <div class="form-group">
                <label for="req-reason-${itemCount}">Reason</label>
                <input type="text" id="req-reason-${itemCount}" class="reason-input" required>
            </div>
            <button type="button" class="btn-danger remove-item"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    // Добавляем в контейнер
    requisitionItems.appendChild(newItem);
    
    // Загружаем список продуктов в новый селект
    loadProductsIntoSelect(`req-product-${itemCount}`);
    
    // Включаем кнопку удаления у всех элементов
    enableItemRemoval(requisitionItems, 'requisition-item');
}

// Добавить предмет в RFQ
function addRfqItem() {
    const rfqItems = document.getElementById('rfqItems');
    const itemCount = rfqItems.children.length;
    
    // Создаем новый элемент
    const newItem = document.createElement('div');
    newItem.className = 'rfq-item';
    newItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label for="rfq-product-${itemCount}">Product</label>
                <select id="rfq-product-${itemCount}" class="product-select" required>
                    <!-- Products will be loaded here -->
                </select>
            </div>
            <div class="form-group">
                <label for="rfq-quantity-${itemCount}">Quantity</label>
                <input type="number" id="rfq-quantity-${itemCount}" class="quantity-input" min="1" value="1" required>
            </div>
            <div class="form-group">
                <label for="rfq-delivery-${itemCount}">Delivery Date</label>
                <input type="date" id="rfq-delivery-${itemCount}" class="delivery-input" required>
            </div>
            <button type="button" class="btn-danger remove-item"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    // Добавляем в контейнер
    rfqItems.appendChild(newItem);
    
    // Загружаем список продуктов в новый селект
    loadProductsIntoSelect(`rfq-product-${itemCount}`);
    
    // Включаем кнопку удаления у всех элементов
    enableItemRemoval(rfqItems, 'rfq-item');
}

// Включаем возможность удаления предметов
function enableItemRemoval(container, itemClass) {
    const removeButtons = container.querySelectorAll('.remove-item');
    
    // Если есть только один элемент, кнопка удаления должна быть отключена
    if (container.children.length === 1) {
        removeButtons[0].disabled = true;
    } else {
        // Включаем все кнопки
        removeButtons.forEach(btn => {
            btn.disabled = false;
            
            // Удаляем старые обработчики и добавляем новые
            btn.replaceWith(btn.cloneNode(true));
        });
        
        // Добавляем новые обработчики
        container.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest(`.${itemClass}`).remove();
                enableItemRemoval(container, itemClass);
            });
        });
    }
}

// Загрузка поставщиков
function loadSuppliers() {
    // В реальном приложении здесь был бы API-запрос
    // Имитируем загрузку данных с помощью таймаута
    setTimeout(() => {
        // Загружаем данные в таблицу поставщиков
        const suppliersTable = document.getElementById('suppliersTable');
        if (suppliersTable) {
            // Демо-данные
            const suppliers = [
                { id: 'SUP001', name: 'ABC Suppliers', contact: 'John Manager', email: 'john@abc-suppliers.com', phone: '+1-123-456-7890', rating: 4.5, status: 'Active' },
                { id: 'SUP002', name: 'XYZ Corporation', contact: 'Jane Director', email: 'jane@xyzcorp.com', phone: '+1-234-567-8901', rating: 3.8, status: 'Active' },
                { id: 'SUP003', name: 'Global Trade Partners', contact: 'Mike Head', email: 'mike@globaltrade.com', phone: '+1-345-678-9012', rating: 4.0, status: 'Inactive' },
                { id: 'SUP004', name: 'Tech Components Ltd', contact: 'Sarah Manager', email: 'sarah@techcomp.com', phone: '+1-456-789-0123', rating: 4.7, status: 'Active' }
            ];
            
            // Заполняем таблицу
            suppliersTable.innerHTML = suppliers.map(supplier => `
                <tr>
                    <td>${supplier.id}</td>
                    <td>${supplier.name}</td>
                    <td>${supplier.contact}</td>
                    <td>${supplier.email}</td>
                    <td>${supplier.phone}</td>
                    <td>${supplier.rating} / 5</td>
                    <td><span class="status-badge status-${supplier.status.toLowerCase()}">${supplier.status}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn view-supplier-btn" data-id="${supplier.id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn edit-supplier-btn" data-id="${supplier.id}"><i class="fas fa-edit"></i></button>
                            <button class="action-btn delete-supplier-btn" data-id="${supplier.id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `).join('');
            
            // Добавляем обработчики событий для кнопок
            suppliersTable.querySelectorAll('.view-supplier-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    viewSupplier(id);
                });
            });
            
            suppliersTable.querySelectorAll('.edit-supplier-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    editSupplier(id);
                });
            });
            
            suppliersTable.querySelectorAll('.delete-supplier-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    deleteSupplier(id);
                });
            });
        }
        
        // Загружаем данные в выпадающий список для формы контракта
        const contractSupplier = document.getElementById('contractSupplier');
        if (contractSupplier) {
            // Демо-данные
            const suppliers = [
                { id: 'SUP001', name: 'ABC Suppliers' },
                { id: 'SUP002', name: 'XYZ Corporation' },
                { id: 'SUP003', name: 'Global Trade Partners' },
                { id: 'SUP004', name: 'Tech Components Ltd' }
            ];
            
            // Заполняем селект
            contractSupplier.innerHTML = suppliers.map(supplier => 
                `<option value="${supplier.id}">${supplier.name}</option>`
            ).join('');
        }
        
        // Загружаем данные в чекбоксы для формы RFQ
        const rfqSuppliers = document.getElementById('rfqSuppliers');
        if (rfqSuppliers) {
            const checkboxGroup = rfqSuppliers.querySelector('.checkbox-group');
            if (checkboxGroup) {
                // Демо-данные
                const suppliers = [
                    { id: 'SUP001', name: 'ABC Suppliers' },
                    { id: 'SUP002', name: 'XYZ Corporation' },
                    { id: 'SUP003', name: 'Global Trade Partners' },
                    { id: 'SUP004', name: 'Tech Components Ltd' }
                ];
                
                // Заполняем группу чекбоксов
                checkboxGroup.innerHTML = suppliers.map(supplier => `
                    <div class="checkbox-item">
                        <input type="checkbox" id="supplier-${supplier.id}" name="suppliers" value="${supplier.id}">
                        <label for="supplier-${supplier.id}">${supplier.name}</label>
                    </div>
                `).join('');
            }
        }
    }, 500);
}

// Загрузка контрактов
function loadContracts() {
    // В реальном приложении здесь был бы API-запрос
    // Имитируем загрузку данных с помощью таймаута
    setTimeout(() => {
        const contractsTable = document.getElementById('contractsTable');
        if (!contractsTable) return;
        
        // Демо-данные
        const contracts = [
            { id: 'CON2023001', supplier: 'ABC Suppliers', startDate: '2023-01-01', endDate: '2023-12-31', status: 'Active', value: 50000 },
            { id: 'CON2023002', supplier: 'XYZ Corporation', startDate: '2023-03-15', endDate: '2024-03-14', status: 'Active', value: 75000 },
            { id: 'CON2023003', supplier: 'Global Trade Partners', startDate: '2022-11-01', endDate: '2023-04-30', status: 'Expired', value: 30000 },
            { id: 'CON2023004', supplier: 'Tech Components Ltd', startDate: '2023-06-01', endDate: '2024-05-31', status: 'Pending', value: 60000 }
        ];
        
        // Заполняем таблицу
        contractsTable.innerHTML = contracts.map(contract => `
            <tr>
                <td>${contract.id}</td>
                <td>${contract.supplier}</td>
                <td>${contract.startDate}</td>
                <td>${contract.endDate}</td>
                <td><span class="status-badge status-${contract.status.toLowerCase()}">${contract.status}</span></td>
                <td>${formatCurrency(contract.value)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view-contract-btn" data-id="${contract.id}"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit-contract-btn" data-id="${contract.id}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-contract-btn" data-id="${contract.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        // Добавляем обработчики событий для кнопок
        contractsTable.querySelectorAll('.view-contract-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                viewContract(id);
            });
        });
        
        contractsTable.querySelectorAll('.edit-contract-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                editContract(id);
            });
        });
        
        contractsTable.querySelectorAll('.delete-contract-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                deleteContract(id);
            });
        });
    }, 500);
}

// Просмотр заявки на закупку
function viewRequisition(id) {
    // В реальном приложении здесь был бы API-запрос для получения данных заявки
    // Имитируем загрузку данных с помощью таймаута
    setTimeout(() => {
        // Демо-данные
        const requisition = {
            id: id,
            requester: 'John Doe',
            department: 'IT',
            date: '2023-05-15',
            status: 'Pending',
            priority: 'Medium',
            notes: 'Need these items for the new project launch next month.',
            items: [
                { id: 1, name: 'Laptop Dell XPS 13', description: 'Core i7, 16GB RAM, 512GB SSD', quantity: 2, dateNeeded: '2023-06-01', reason: 'New employees' },
                { id: 3, name: 'Monitor LG UltraWide', description: '34" 3440x1440 IPS', quantity: 2, dateNeeded: '2023-06-01', reason: 'New workstations' },
                { id: 4, name: 'Keyboard Logitech MX Keys', description: 'Wireless, Backlit', quantity: 2, dateNeeded: '2023-06-01', reason: 'New workstations' }
            ]
        };
        
        // Заполняем данные в модальном окне
        document.getElementById('view-req-id').textContent = requisition.id;
        document.getElementById('view-req-status').textContent = requisition.status;
        document.getElementById('view-req-date').textContent = requisition.date;
        document.getElementById('view-req-requester').textContent = requisition.requester;
        document.getElementById('view-req-department').textContent = requisition.department;
        document.getElementById('view-req-priority').textContent = requisition.priority;
        
        // Заполняем таблицу с предметами
        const itemsTable = document.getElementById('view-req-items');
        itemsTable.innerHTML = requisition.items.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>${item.dateNeeded}</td>
                <td>${item.reason}</td>
            </tr>
        `).join('');
        
        // Заполняем примечания
        document.getElementById('view-req-notes').textContent = requisition.notes;
        
        // Показываем или скрываем кнопки в зависимости от статуса
        const approveBtn = document.getElementById('approveReqBtn');
        const rejectBtn = document.getElementById('rejectReqBtn');
        const createRfqBtn = document.getElementById('createRfqFromReqBtn');
        
        if (requisition.status === 'Pending') {
            approveBtn.style.display = 'inline-block';
            rejectBtn.style.display = 'inline-block';
            createRfqBtn.style.display = 'none';
        } else if (requisition.status === 'Approved') {
            approveBtn.style.display = 'none';
            rejectBtn.style.display = 'none';
            createRfqBtn.style.display = 'inline-block';
        } else {
            approveBtn.style.display = 'none';
            rejectBtn.style.display = 'none';
            createRfqBtn.style.display = 'none';
        }
        
        // Открываем модальное окно
        openModal('viewRequisitionModal');
    }, 300);
}

// Редактирование заявки на закупку
function editRequisition(id) {
    // В реальном приложении здесь был бы API-запрос
    showNotification(`Editing requisition ${id}`, 'info');
    
    // Имитируем загрузку данных заявки
    setTimeout(() => {
        // Здесь был бы код для заполнения формы данными заявки
        openModal('requisitionModal');
    }, 300);
}

// Удаление заявки на закупку
function deleteRequisition(id) {
    if (confirm(`Are you sure you want to delete requisition ${id}?`)) {
        // В реальном приложении здесь был бы API-запрос для удаления
        showNotification(`Requisition ${id} has been deleted`, 'success');
        
        // Обновляем список заявок
        setTimeout(() => {
            loadRequisitions();
            loadDashboardData();
        }, 300);
    }
}

// Одобрение заявки на закупку
function approveRequisition(id) {
    // В реальном приложении здесь был бы API-запрос для изменения статуса
    showNotification(`Requisition ${id} has been approved`, 'success');
    
    // Закрываем модальное окно и обновляем данные
    closeModals();
    
    setTimeout(() => {
        loadRequisitions();
        loadDashboardData();
    }, 300);
}

// Отклонение заявки на закупку
function rejectRequisition(id) {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason !== null) {
        // В реальном приложении здесь был бы API-запрос для изменения статуса
        showNotification(`Requisition ${id} has been rejected`, 'warning');
        
        // Закрываем модальное окно и обновляем данные
        closeModals();
        
        setTimeout(() => {
            loadRequisitions();
            loadDashboardData();
        }, 300);
    }
}

// Создание RFQ из заявки на закупку
function createRfqFromRequisition(id) {
    // В реальном приложении здесь был бы код для получения данных заявки и предзаполнения формы RFQ
    showNotification(`Creating new RFQ from requisition ${id}`, 'info');
    
    // Закрываем текущее модальное окно
    closeModals();
    
    // Открываем форму RFQ
    setTimeout(() => {
        // Выбираем соответствующую заявку в выпадающем списке
        const relatedRequisition = document.getElementById('relatedRequisition');
        if (relatedRequisition) {
            for (let i = 0; i < relatedRequisition.options.length; i++) {
                if (relatedRequisition.options[i].value === id) {
                    relatedRequisition.selectedIndex = i;
                    break;
                }
            }
        }
        
        openModal('rfqModal');
    }, 300);
}

// Просмотр запроса
function viewRequest(id) {
    showNotification(`Viewing request ${id}`, 'info');
    // В реальном приложении здесь был бы код для отображения деталей запроса
}

// Редактирование запроса
function editRequest(id) {
    showNotification(`Editing request ${id}`, 'info');
    // В реальном приложении здесь был бы код для загрузки и отображения формы редактирования
}

// Удаление запроса
function deleteRequest(id) {
    if (confirm(`Are you sure you want to delete request ${id}?`)) {
        showNotification(`Request ${id} has been deleted`, 'success');
        // В реальном приложении здесь был бы API-запрос для удаления
        setTimeout(() => {
            loadRequests();
        }, 500);
    }
}

// Просмотр контракта
function viewContract(id) {
    showNotification(`Viewing contract ${id}`, 'info');
    // В реальном приложении здесь был бы код для отображения деталей контракта
}

// Редактирование контракта
function editContract(id) {
    showNotification(`Editing contract ${id}`, 'info');
    // В реальном приложении здесь был бы код для загрузки и отображения формы редактирования
}

// Удаление контракта
function deleteContract(id) {
    if (confirm(`Are you sure you want to delete contract ${id}?`)) {
        showNotification(`Contract ${id} has been deleted`, 'success');
        // В реальном приложении здесь был бы API-запрос для удаления
        setTimeout(() => {
            loadContracts();
            loadDashboardData();
        }, 300);
    }
}

// Просмотр RFQ
function viewRfq(id) {
    // В реальном приложении здесь был бы API-запрос для получения данных RFQ
    // Имитируем загрузку данных с помощью таймаута
    setTimeout(() => {
        // Демо-данные
        const rfq = {
            id: id,
            requisition: 'REQ2023001',
            issueDate: '2023-05-16',
            dueDate: '2023-05-23',
            status: 'Open',
            notes: 'Please provide your best quotation for the following items.',
            suppliers: [
                { id: 'SUP001', name: 'ABC Suppliers', hasResponded: true, totalQuote: 4800 },
                { id: 'SUP002', name: 'XYZ Corporation', hasResponded: true, totalQuote: 5200 },
                { id: 'SUP003', name: 'Global Trade Partners', hasResponded: false, totalQuote: null }
            ],
            items: [
                { id: 1, name: 'Laptop Dell XPS 13', description: 'Core i7, 16GB RAM, 512GB SSD', quantity: 2, deliveryDate: '2023-06-01' },
                { id: 3, name: 'Monitor LG UltraWide', description: '34" 3440x1440 IPS', quantity: 2, deliveryDate: '2023-06-01' }
            ]
        };
        
        // Заполняем данные в модальном окне
        document.getElementById('view-rfq-id').textContent = rfq.id;
        document.getElementById('view-rfq-status').textContent = rfq.status;
        document.getElementById('view-rfq-issue-date').textContent = rfq.issueDate;
        document.getElementById('view-rfq-due-date').textContent = rfq.dueDate;
        document.getElementById('view-rfq-requisition').textContent = rfq.requisition || 'N/A';
        
        // Заполняем таблицу с предметами
        const itemsTable = document.getElementById('view-rfq-items');
        itemsTable.innerHTML = rfq.items.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>${item.deliveryDate}</td>
            </tr>
        `).join('');
        
        // Заполняем таблицу поставщиков
        const suppliersTable = document.getElementById('view-rfq-suppliers');
        suppliersTable.innerHTML = rfq.suppliers.map(supplier => `
            <tr>
                <td>${supplier.name}</td>
                <td>${supplier.hasResponded ? '<span class="badge badge-success">Yes</span>' : '<span class="badge badge-warning">No</span>'}</td>
                <td>${supplier.hasResponded ? formatCurrency(supplier.totalQuote) : 'N/A'}</td>
            </tr>
        `).join('');
        
        // Заполняем примечания
        document.getElementById('view-rfq-notes').textContent = rfq.notes;
        
        // Показываем или скрываем кнопку создания заказа в зависимости от статуса
        const createPoBtn = document.getElementById('createPoFromRfqBtn');
        if (rfq.status === 'Open' && rfq.suppliers.some(s => s.hasResponded)) {
            createPoBtn.style.display = 'inline-block';
        } else {
            createPoBtn.style.display = 'none';
        }
        
        // Открываем модальное окно
        openModal('viewRfqModal');
    }, 300);
}

// Редактирование RFQ
function editRfq(id) {
    // В реальном приложении здесь был бы API-запрос
    showNotification(`Editing RFQ ${id}`, 'info');
    
    // Имитируем загрузку данных RFQ
    setTimeout(() => {
        // Здесь был бы код для заполнения формы данными RFQ
        openModal('rfqModal');
    }, 300);
}

// Удаление RFQ
function deleteRfq(id) {
    if (confirm(`Are you sure you want to delete RFQ ${id}?`)) {
        // В реальном приложении здесь был бы API-запрос для удаления
        showNotification(`RFQ ${id} has been deleted`, 'success');
        
        // Обновляем список RFQ
        setTimeout(() => {
            loadRfqs();
            loadDashboardData();
        }, 300);
    }
}

// Создание заказа на покупку из RFQ
function createPurchaseOrderFromRfq(id) {
    // В реальном приложении здесь был бы код для получения данных RFQ и предзаполнения формы заказа
    showNotification(`Creating new Purchase Order from RFQ ${id}`, 'info');
    
    // Закрываем текущее модальное окно
    closeModals();
    
    // Открываем форму заказа на покупку
    setTimeout(() => {
        openModal('purchaseOrderModal');
    }, 300);
}

// Просмотр заказа на покупку
function viewPurchaseOrder(id) {
    // В реальном приложении здесь был бы API-запрос для получения данных заказа
    // Имитируем загрузку данных с помощью таймаута
    setTimeout(() => {
        // Демо-данные
        const po = {
            id: id,
            rfq: 'RFQ2023001',
            supplier: 'ABC Suppliers',
            issueDate: '2023-05-17',
            deliveryDate: '2023-06-01',
            status: 'Open',
            paymentTerms: 'Net 30',
            shippingMethod: 'Standard Shipping',
            subtotal: 4500,
            tax: 500,
            total: 5000,
            items: [
                { id: 1, name: 'Laptop Dell XPS 13', description: 'Core i7, 16GB RAM, 512GB SSD', quantity: 2, unitPrice: 1500, total: 3000 },
                { id: 3, name: 'Monitor LG UltraWide', description: '34" 3440x1440 IPS', quantity: 2, unitPrice: 750, total: 1500 }
            ]
        };
        
        // Заполняем данные в модальном окне
        document.getElementById('view-po-id').textContent = po.id;
        document.getElementById('view-po-status').textContent = po.status;
        document.getElementById('view-po-issue-date').textContent = po.issueDate;
        document.getElementById('view-po-delivery-date').textContent = po.deliveryDate;
        document.getElementById('view-po-rfq').textContent = po.rfq;
        document.getElementById('view-po-supplier').textContent = po.supplier;
        document.getElementById('view-po-payment').textContent = po.paymentTerms;
        document.getElementById('view-po-shipping').textContent = po.shippingMethod;
        
        // Заполняем таблицу с предметами
        const itemsTable = document.getElementById('view-po-items');
        itemsTable.innerHTML = po.items.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.unitPrice)}</td>
                <td>${formatCurrency(item.total)}</td>
            </tr>
        `).join('');
        
        // Заполняем информацию о стоимости
        document.getElementById('view-po-subtotal').textContent = formatCurrency(po.subtotal);
        document.getElementById('view-po-tax').textContent = formatCurrency(po.tax);
        document.getElementById('view-po-total').textContent = formatCurrency(po.total);
        
        // Показываем или скрываем кнопки в зависимости от статуса
        const receiveBtn = document.getElementById('receivePoBtn');
        const cancelBtn = document.getElementById('cancelPoBtn');
        
        if (po.status === 'Open' || po.status === 'Processing') {
            receiveBtn.style.display = 'inline-block';
            cancelBtn.style.display = 'inline-block';
        } else {
            receiveBtn.style.display = 'none';
            cancelBtn.style.display = 'none';
        }
        
        // Открываем модальное окно
        openModal('viewPurchaseOrderModal');
    }, 300);
}

// Редактирование заказа на покупку
function editPurchaseOrder(id) {
    // В реальном приложении здесь был бы API-запрос
    showNotification(`Editing Purchase Order ${id}`, 'info');
    
    // Имитируем загрузку данных заказа
    setTimeout(() => {
        // Здесь был бы код для заполнения формы данными заказа
        openModal('purchaseOrderModal');
    }, 300);
}

// Удаление заказа на покупку
function deletePurchaseOrder(id) {
    if (confirm(`Are you sure you want to delete Purchase Order ${id}?`)) {
        // В реальном приложении здесь был бы API-запрос для удаления
        showNotification(`Purchase Order ${id} has been deleted`, 'success');
        
        // Обновляем список заказов
        setTimeout(() => {
            loadPurchaseOrders();
            loadDashboardData();
        }, 300);
    }
}

// Получение заказа
function receivePurchaseOrder(id) {
    // В реальном приложении здесь был бы API-запрос для изменения статуса
    showNotification(`Purchase Order ${id} has been marked as received`, 'success');
    
    // Закрываем модальное окно и обновляем данные
    closeModals();
    
    setTimeout(() => {
        loadPurchaseOrders();
        loadDashboardData();
    }, 300);
}

// Отмена заказа
function cancelPurchaseOrder(id) {
    const reason = prompt('Please provide a reason for cancellation:');
    if (reason !== null) {
        // В реальном приложении здесь был бы API-запрос для изменения статуса
        showNotification(`Purchase Order ${id} has been cancelled`, 'warning');
        
        // Закрываем модальное окно и обновляем данные
        closeModals();
        
        setTimeout(() => {
            loadPurchaseOrders();
            loadDashboardData();
        }, 300);
    }
}

// Просмотр поставщика
function viewSupplier(id) {
    // В реальном приложении здесь был бы API-запрос для получения данных поставщика
    // Имитируем загрузку данных с помощью таймаута
    setTimeout(() => {
        // Демо-данные
        const supplier = {
            id: id,
            name: 'ABC Suppliers',
            contact: 'John Manager',
            email: 'john@abc-suppliers.com',
            phone: '+1-123-456-7890',
            address: '123 Supplier Street, Business District, NY 10001, USA',
            website: 'https://www.abc-suppliers.com',
            taxId: 'TAX-123456789',
            rating: 4.5,
            status: 'Active',
            specialties: 'Electronics, Office Equipment, IT Hardware',
            notes: 'Reliable supplier with fast delivery times. Offers good discounts for bulk orders.'
        };
        
        // Заполняем данные в модальном окне
        document.getElementById('view-supplier-id').textContent = supplier.id;
        document.getElementById('view-supplier-name').textContent = supplier.name;
        document.getElementById('view-supplier-contact').textContent = supplier.contact;
        document.getElementById('view-supplier-email').textContent = supplier.email;
        document.getElementById('view-supplier-phone').textContent = supplier.phone;
        document.getElementById('view-supplier-address').textContent = supplier.address;
        document.getElementById('view-supplier-website').textContent = supplier.website;
        document.getElementById('view-supplier-tax-id').textContent = supplier.taxId;
        document.getElementById('view-supplier-rating').textContent = `${supplier.rating} / 5`;
        document.getElementById('view-supplier-status').textContent = supplier.status;
        document.getElementById('view-supplier-specialties').textContent = supplier.specialties;
        document.getElementById('view-supplier-notes').textContent = supplier.notes;
        
        // Открываем модальное окно
        openModal('viewSupplierModal');
    }, 300);
}

// Редактирование поставщика
function editSupplier(id) {
    // В реальном приложении здесь был бы API-запрос
    showNotification(`Editing supplier ${id}`, 'info');
    
    // Имитируем загрузку данных поставщика
    setTimeout(() => {
        // Здесь был бы код для заполнения формы данными поставщика
        openModal('supplierModal');
    }, 300);
}

// Удаление поставщика
function deleteSupplier(id) {
    if (confirm(`Are you sure you want to delete supplier ${id}?`)) {
        // В реальном приложении здесь был бы API-запрос для удаления
        showNotification(`Supplier ${id} has been deleted`, 'success');
        
        // Обновляем список поставщиков
        setTimeout(() => {
            loadSuppliers();
            loadDashboardData();
        }, 300);
    }
}

// Просмотр контракта
function viewContract(id) {
    // В реальном приложении здесь был бы API-запрос для получения данных контракта
    // Имитируем загрузку данных с помощью таймаута
    setTimeout(() => {
        // Демо-данные
        const contract = {
            id: id,
            supplier: 'ABC Suppliers',
            startDate: '2023-01-01',
            endDate: '2023-12-31',
            signDate: '2022-12-15',
            status: 'Active',
            value: 50000,
            paymentTerms: 'Net 30',
            renewalTerms: 'Automatic renewal for 1 year unless terminated',
            terminationTerms: '30 days written notice required',
            notes: 'Annual supply contract for electronic components and office equipment.',
            documents: [
                { name: 'Contract Document', type: 'PDF', size: '2.5 MB', date: '2022-12-15' },
                { name: 'Price List Attachment', type: 'Excel', size: '1.2 MB', date: '2022-12-15' }
            ]
        };
        
        // Заполняем данные в модальном окне
        document.getElementById('view-contract-id').textContent = contract.id;
        document.getElementById('view-contract-status').textContent = contract.status;
        document.getElementById('view-contract-supplier').textContent = contract.supplier;
        document.getElementById('view-contract-start-date').textContent = contract.startDate;
        document.getElementById('view-contract-end-date').textContent = contract.endDate;
        document.getElementById('view-contract-sign-date').textContent = contract.signDate;
        document.getElementById('view-contract-value').textContent = formatCurrency(contract.value);
        document.getElementById('view-contract-payment-terms').textContent = contract.paymentTerms;
        document.getElementById('view-contract-renewal-terms').textContent = contract.renewalTerms;
        document.getElementById('view-contract-termination-terms').textContent = contract.terminationTerms;
        document.getElementById('view-contract-notes').textContent = contract.notes;
        
        // Заполняем таблицу с документами
        const docsTable = document.getElementById('view-contract-documents');
        docsTable.innerHTML = contract.documents.map(doc => `
            <tr>
                <td>${doc.name}</td>
                <td>${doc.type}</td>
                <td>${doc.size}</td>
                <td>${doc.date}</td>
                <td><button class="btn-sm btn-primary"><i class="fas fa-download"></i> Download</button></td>
            </tr>
        `).join('');
        
        // Открываем модальное окно
        openModal('viewContractModal');
    }, 300);
}

// Редактирование контракта
function editContract(id) {
    // В реальном приложении здесь был бы API-запрос
    showNotification(`Editing contract ${id}`, 'info');
    
    // Имитируем загрузку данных контракта
    setTimeout(() => {
        // Здесь был бы код для заполнения формы данными контракта
        openModal('contractModal');
    }, 300);
}

// Удаление контракта
function deleteContract(id) {
    if (confirm(`Are you sure you want to delete contract ${id}?`)) {
        // В реальном приложении здесь был бы API-запрос для удаления
        showNotification(`Contract ${id} has been deleted`, 'success');
        
        // Обновляем список контрактов
        setTimeout(() => {
            loadContracts();
            loadDashboardData();
        }, 300);
    }
}

// Форматирование валюты
function formatCurrency(value) {
    return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Показать уведомление
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' : 
                type === 'error' ? 'fa-exclamation-circle' : 
                type === 'warning' ? 'fa-exclamation-triangle' : 
                'fa-info-circle'
            }"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    // Добавляем обработчик закрытия
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.classList.add('notification-hiding');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Автоматически скрыть уведомление через 5 секунд
    setTimeout(() => {
        notification.classList.add('notification-hiding');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add('notification-visible');
    }, 10);
} 