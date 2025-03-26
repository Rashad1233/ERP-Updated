// suppliers.js - Функциональность страницы управления поставщиками

document.addEventListener('DOMContentLoaded', function() {
    // Активация меню закупок
    activateProcurementMenu();
    
    // Инициализация форм и модальных окон
    initModals();
    initForms();
    
    // Загрузка данных поставщиков
    loadSupplierStatistics();
    loadSuppliersData();
    
    // Инициализация постраничной навигации
    initPagination();
    
    // Инициализация фильтров
    initFilters();
});

// Активация меню закупок
function activateProcurementMenu() {
    const procurementMenu = document.querySelector('.has-submenu.active');
    if (procurementMenu) {
        const submenu = procurementMenu.querySelector('.submenu');
        if (submenu) {
            submenu.style.display = 'block';
        }
    }
}

// Инициализация модальных окон
function initModals() {
    // Модальное окно создания/редактирования поставщика
    const supplierModal = document.getElementById('supplierModal');
    const newSupplierBtn = document.getElementById('newSupplierBtn');
    const closeSupplierBtn = supplierModal.querySelector('.close');
    const cancelSupplierBtn = document.getElementById('cancelSupplierBtn');
    
    newSupplierBtn.addEventListener('click', function() {
        openModal(supplierModal);
        document.getElementById('supplierModalTitle').textContent = 'Новый поставщик';
        document.getElementById('supplierForm').reset();
        document.getElementById('supplierId').value = '';
    });
    
    closeSupplierBtn.addEventListener('click', function() {
        closeModal(supplierModal);
    });
    
    cancelSupplierBtn.addEventListener('click', function() {
        closeModal(supplierModal);
    });
    
    // Модальное окно просмотра поставщика
    const viewSupplierModal = document.getElementById('viewSupplierModal');
    const closeViewSupplierBtn = viewSupplierModal.querySelector('.close');
    const editViewSupplierBtn = document.getElementById('editViewSupplierBtn');
    const closeViewBtn = document.getElementById('closeViewSupplierBtn');
    const newOrderSupplierBtn = document.getElementById('newOrderSupplierBtn');
    const supplierHistoryBtn = document.getElementById('supplierHistoryBtn');
    
    closeViewSupplierBtn.addEventListener('click', function() {
        closeModal(viewSupplierModal);
    });
    
    closeViewBtn.addEventListener('click', function() {
        closeModal(viewSupplierModal);
    });
    
    editViewSupplierBtn.addEventListener('click', function() {
        const supplierId = document.getElementById('view-supplier-id').textContent;
        closeModal(viewSupplierModal);
        editSupplier(supplierId);
    });
    
    newOrderSupplierBtn.addEventListener('click', function() {
        const supplierId = document.getElementById('view-supplier-id').textContent;
        const supplierName = document.getElementById('view-supplier-name').textContent;
        closeModal(viewSupplierModal);
        // Перенаправление на страницу создания заказа с предвыбранным поставщиком
        window.location.href = `purchase-orders.html?supplier=${supplierId}&name=${encodeURIComponent(supplierName)}`;
    });
    
    supplierHistoryBtn.addEventListener('click', function() {
        const supplierId = document.getElementById('view-supplier-id').textContent;
        // Здесь можно добавить логику для просмотра истории поставщика
        showNotification('Функция просмотра истории будет доступна в ближайшем обновлении', 'info');
    });
    
    // Действия с поставщиками в таблице
    document.addEventListener('click', function(e) {
        if (e.target.closest('.view-supplier-btn')) {
            const supplierId = e.target.closest('.view-supplier-btn').dataset.id;
            viewSupplier(supplierId);
        } else if (e.target.closest('.edit-supplier-btn')) {
            const supplierId = e.target.closest('.edit-supplier-btn').dataset.id;
            editSupplier(supplierId);
        } else if (e.target.closest('.delete-supplier-btn')) {
            const supplierId = e.target.closest('.delete-supplier-btn').dataset.id;
            if (confirm('Вы уверены, что хотите удалить этого поставщика?')) {
                deleteSupplier(supplierId);
            }
        }
    });
}

// Инициализация форм
function initForms() {
    const supplierForm = document.getElementById('supplierForm');
    
    supplierForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveSupplier();
    });
}

// Инициализация постраничной навигации
function initPagination() {
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const paginationPages = document.querySelectorAll('.pagination-page');
    
    prevPageBtn.addEventListener('click', function() {
        if (!this.disabled) {
            goToPreviousPage();
        }
    });
    
    nextPageBtn.addEventListener('click', function() {
        if (!this.disabled) {
            goToNextPage();
        }
    });
    
    paginationPages.forEach(page => {
        page.addEventListener('click', function() {
            const pageNum = parseInt(this.textContent);
            goToPage(pageNum);
        });
    });
}

// Инициализация фильтров
function initFilters() {
    const applyFiltersBtn = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const supplierSearch = document.getElementById('supplierSearch');
    
    applyFiltersBtn.addEventListener('click', function() {
        applyFilters();
    });
    
    resetFiltersBtn.addEventListener('click', function() {
        resetFilters();
    });
    
    supplierSearch.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });
}

// Загрузка статистики поставщиков
function loadSupplierStatistics() {
    // В реальном приложении данные будут загружаться с сервера
    // Имитация загрузки данных
    setTimeout(function() {
        document.getElementById('totalSuppliers').textContent = '24';
        document.getElementById('activeSuppliers').textContent = '18';
        document.getElementById('ordersInProgress').textContent = '7';
        document.getElementById('contractCount').textContent = '15';
    }, 500);
}

// Загрузка данных поставщиков
function loadSuppliersData(page = 1) {
    // В реальном приложении данные будут загружаться с сервера
    // Имитация загрузки данных
    
    // Отображение индикатора загрузки
    const tableBody = document.getElementById('suppliersTable');
    tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Загрузка данных...</td></tr>';
    
    // Имитация задержки загрузки
    setTimeout(function() {
        // Данные уже имеются в HTML (для демонстрации)
        // В реальном приложении здесь будет код загрузки данных с сервера
        
        updatePagination(page, 3); // 3 страницы всего
    }, 800);
}

// Применение фильтров
function applyFilters() {
    const searchTerm = document.getElementById('supplierSearch').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    console.log('Применение фильтров:', {
        searchTerm,
        statusFilter,
        categoryFilter
    });
    
    // В реальном приложении здесь будет запрос на сервер с применением фильтров
    // Имитация фильтрации
    loadSuppliersData(1);
    
    showNotification('Фильтры применены', 'success');
}

// Сброс фильтров
function resetFilters() {
    document.getElementById('supplierSearch').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('categoryFilter').value = '';
    
    // Загрузка данных без фильтров
    loadSuppliersData(1);
    
    showNotification('Фильтры сброшены', 'success');
}

// Обновление постраничной навигации
function updatePagination(currentPage, totalPages) {
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const paginationPages = document.querySelectorAll('.pagination-page');
    
    // Обновление состояния кнопок
    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= totalPages;
    
    // Обновление классов активной страницы
    paginationPages.forEach(page => {
        const pageNum = parseInt(page.textContent);
        if (pageNum === currentPage) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });
}

// Переход на предыдущую страницу
function goToPreviousPage() {
    const activePage = document.querySelector('.pagination-page.active');
    const currentPage = parseInt(activePage.textContent);
    if (currentPage > 1) {
        goToPage(currentPage - 1);
    }
}

// Переход на следующую страницу
function goToNextPage() {
    const activePage = document.querySelector('.pagination-page.active');
    const currentPage = parseInt(activePage.textContent);
    const paginationPages = document.querySelectorAll('.pagination-page');
    const totalPages = paginationPages.length;
    if (currentPage < totalPages) {
        goToPage(currentPage + 1);
    }
}

// Переход на конкретную страницу
function goToPage(pageNum) {
    loadSuppliersData(pageNum);
}

// Сохранение поставщика
function saveSupplier() {
    const supplierForm = document.getElementById('supplierForm');
    const supplierId = document.getElementById('supplierId').value;
    
    // Проверка формы
    if (!supplierForm.checkValidity()) {
        supplierForm.reportValidity();
        return;
    }
    
    // Получение данных формы
    const supplierData = {
        id: supplierId || generateSupplierId(),
        name: document.getElementById('supplierName').value,
        category: document.getElementById('supplierCategory').value,
        contactPerson: document.getElementById('contactPerson').value,
        position: document.getElementById('position').value,
        email: document.getElementById('supplierEmail').value,
        phone: document.getElementById('supplierPhone').value,
        address: document.getElementById('supplierAddress').value,
        inn: document.getElementById('supplierINN').value,
        kpp: document.getElementById('supplierKPP').value,
        paymentTerms: document.getElementById('paymentTerms').value,
        status: document.getElementById('supplierStatus').value,
        notes: document.getElementById('supplierNotes').value
    };
    
    console.log('Сохранение поставщика:', supplierData);
    
    // В реальном приложении данные будут отправляться на сервер
    // Имитация сохранения
    const supplierModal = document.getElementById('supplierModal');
    closeModal(supplierModal);
    
    if (supplierId) {
        showNotification('Поставщик успешно обновлен', 'success');
    } else {
        showNotification('Поставщик успешно создан', 'success');
    }
    
    // Перезагрузка данных
    loadSupplierStatistics();
    loadSuppliersData();
}

// Генерация ID для нового поставщика
function generateSupplierId() {
    const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `S-${randomPart}`;
}

// Просмотр поставщика
function viewSupplier(supplierId) {
    console.log('Просмотр поставщика:', supplierId);
    
    // В реальном приложении данные будут загружаться с сервера
    // Имитация загрузки данных о поставщике
    setTimeout(function() {
        // Заполнение данными модального окна
        document.getElementById('view-supplier-id').textContent = supplierId;
        
        // Заполнение демо данными (в реальности будут данные с сервера)
        if (supplierId === 'S-001') {
            document.getElementById('view-supplier-status').innerHTML = '<span class="status-badge status-active">Активный</span>';
            document.getElementById('view-supplier-name').textContent = 'ООО "ТехноСнаб"';
            document.getElementById('view-supplier-category').textContent = 'Оборудование';
            document.getElementById('view-supplier-contact').textContent = 'Иванов Иван';
            document.getElementById('view-supplier-position').textContent = 'Менеджер по продажам';
            document.getElementById('view-supplier-email').textContent = 'info@technosnab.ru';
            document.getElementById('view-supplier-phone').textContent = '+7 (495) 123-4567';
            document.getElementById('view-supplier-inn').textContent = '7712345678';
            document.getElementById('view-supplier-kpp').textContent = '771201001';
            document.getElementById('view-supplier-address').textContent = 'г. Москва, ул. Примерная, д. 1, офис 123';
            document.getElementById('view-supplier-payment').textContent = 'Предоплата';
            document.getElementById('view-supplier-notes').textContent = 'Надежный поставщик компьютерного оборудования и периферии.';
            
            document.getElementById('view-supplier-orders').textContent = '12';
            document.getElementById('view-supplier-active-orders').textContent = '3';
            document.getElementById('view-supplier-total-amount').textContent = '₽2,580,000';
            document.getElementById('view-supplier-last-order').textContent = '15.04.2023';
        } else if (supplierId === 'S-002') {
            document.getElementById('view-supplier-status').innerHTML = '<span class="status-badge status-active">Активный</span>';
            document.getElementById('view-supplier-name').textContent = 'АО "Компьютер-Трейд"';
            document.getElementById('view-supplier-category').textContent = 'Оборудование, ПО';
            document.getElementById('view-supplier-contact').textContent = 'Петров Петр';
            document.getElementById('view-supplier-position').textContent = 'Коммерческий директор';
            document.getElementById('view-supplier-email').textContent = 'sales@comptrade.ru';
            document.getElementById('view-supplier-phone').textContent = '+7 (495) 987-6543';
            document.getElementById('view-supplier-inn').textContent = '7709876543';
            document.getElementById('view-supplier-kpp').textContent = '770901001';
            document.getElementById('view-supplier-address').textContent = 'г. Москва, пр-т Ленина, д. 15, корп. 2';
            document.getElementById('view-supplier-payment').textContent = '30 дней';
            document.getElementById('view-supplier-notes').textContent = 'Поставщик серверного оборудования и программного обеспечения.';
            
            document.getElementById('view-supplier-orders').textContent = '8';
            document.getElementById('view-supplier-active-orders').textContent = '2';
            document.getElementById('view-supplier-total-amount').textContent = '₽1,850,000';
            document.getElementById('view-supplier-last-order').textContent = '01.05.2023';
        } else {
            // Для других ID заполняем шаблонными данными
            document.getElementById('view-supplier-status').innerHTML = '<span class="status-badge status-active">Активный</span>';
            document.getElementById('view-supplier-name').textContent = 'Поставщик ' + supplierId;
            document.getElementById('view-supplier-category').textContent = 'Разное';
            document.getElementById('view-supplier-contact').textContent = 'Контактное лицо';
            document.getElementById('view-supplier-position').textContent = 'Должность';
            document.getElementById('view-supplier-email').textContent = 'email@example.com';
            document.getElementById('view-supplier-phone').textContent = '+7 (000) 000-0000';
            document.getElementById('view-supplier-inn').textContent = '0000000000';
            document.getElementById('view-supplier-kpp').textContent = '000000000';
            document.getElementById('view-supplier-address').textContent = 'Адрес';
            document.getElementById('view-supplier-payment').textContent = 'Не указано';
            document.getElementById('view-supplier-notes').textContent = 'Нет данных';
            
            document.getElementById('view-supplier-orders').textContent = '0';
            document.getElementById('view-supplier-active-orders').textContent = '0';
            document.getElementById('view-supplier-total-amount').textContent = '₽0';
            document.getElementById('view-supplier-last-order').textContent = 'Нет данных';
        }
        
        // Отображение модального окна
        const viewSupplierModal = document.getElementById('viewSupplierModal');
        openModal(viewSupplierModal);
    }, 300);
}

// Редактирование поставщика
function editSupplier(supplierId) {
    console.log('Редактирование поставщика:', supplierId);
    
    // В реальном приложении данные будут загружаться с сервера
    // Имитация загрузки данных о поставщике
    setTimeout(function() {
        // Заполнение формы данными
        document.getElementById('supplierId').value = supplierId;
        document.getElementById('supplierModalTitle').textContent = 'Редактирование поставщика';
        
        // Заполнение демо данными (в реальности будут данные с сервера)
        if (supplierId === 'S-001') {
            document.getElementById('supplierName').value = 'ООО "ТехноСнаб"';
            document.getElementById('supplierCategory').value = 'hardware';
            document.getElementById('contactPerson').value = 'Иванов Иван';
            document.getElementById('position').value = 'Менеджер по продажам';
            document.getElementById('supplierEmail').value = 'info@technosnab.ru';
            document.getElementById('supplierPhone').value = '+7 (495) 123-4567';
            document.getElementById('supplierAddress').value = 'г. Москва, ул. Примерная, д. 1, офис 123';
            document.getElementById('supplierINN').value = '7712345678';
            document.getElementById('supplierKPP').value = '771201001';
            document.getElementById('paymentTerms').value = 'immediate';
            document.getElementById('supplierStatus').value = 'active';
            document.getElementById('supplierNotes').value = 'Надежный поставщик компьютерного оборудования и периферии.';
        } else if (supplierId === 'S-002') {
            document.getElementById('supplierName').value = 'АО "Компьютер-Трейд"';
            document.getElementById('supplierCategory').value = 'hardware';
            document.getElementById('contactPerson').value = 'Петров Петр';
            document.getElementById('position').value = 'Коммерческий директор';
            document.getElementById('supplierEmail').value = 'sales@comptrade.ru';
            document.getElementById('supplierPhone').value = '+7 (495) 987-6543';
            document.getElementById('supplierAddress').value = 'г. Москва, пр-т Ленина, д. 15, корп. 2';
            document.getElementById('supplierINN').value = '7709876543';
            document.getElementById('supplierKPP').value = '770901001';
            document.getElementById('paymentTerms').value = 'net30';
            document.getElementById('supplierStatus').value = 'active';
            document.getElementById('supplierNotes').value = 'Поставщик серверного оборудования и программного обеспечения.';
        } else {
            // Для других ID заполняем шаблонными данными
            document.getElementById('supplierName').value = 'Поставщик ' + supplierId;
            document.getElementById('supplierCategory').value = 'other';
            document.getElementById('contactPerson').value = 'Контактное лицо';
            document.getElementById('position').value = 'Должность';
            document.getElementById('supplierEmail').value = 'email@example.com';
            document.getElementById('supplierPhone').value = '+7 (000) 000-0000';
            document.getElementById('supplierAddress').value = 'Адрес';
            document.getElementById('supplierINN').value = '0000000000';
            document.getElementById('supplierKPP').value = '000000000';
            document.getElementById('paymentTerms').value = 'immediate';
            document.getElementById('supplierStatus').value = 'active';
            document.getElementById('supplierNotes').value = '';
        }
        
        // Отображение модального окна
        const supplierModal = document.getElementById('supplierModal');
        openModal(supplierModal);
    }, 300);
}

// Удаление поставщика
function deleteSupplier(supplierId) {
    console.log('Удаление поставщика:', supplierId);
    
    // В реальном приложении запрос будет отправляться на сервер
    // Имитация удаления
    setTimeout(function() {
        showNotification(`Поставщик ${supplierId} успешно удален`, 'success');
        
        // Перезагрузка данных
        loadSupplierStatistics();
        loadSuppliersData();
    }, 500);
}

// Открытие модального окна
function openModal(modal) {
    modal.style.display = 'block';
    setTimeout(function() {
        modal.classList.add('show');
    }, 10);
}

// Закрытие модального окна
function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(function() {
        modal.style.display = 'none';
    }, 300);
}

// Отображение уведомления
function showNotification(message, type = 'info') {
    // Проверка существования контейнера уведомлений
    let notificationContainer = document.querySelector('.notification-container');
    
    // Создание контейнера, если он не существует
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Создание уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Добавление уведомления в контейнер
    notificationContainer.appendChild(notification);
    
    // Добавление кнопки закрытия
    const closeBtn = document.createElement('span');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = function() {
        notification.remove();
    };
    notification.appendChild(closeBtn);
    
    // Автоматическое скрытие уведомления через 5 секунд
    setTimeout(function() {
        notification.classList.add('notification-hide');
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 5000);
}
