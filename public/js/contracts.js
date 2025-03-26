// Инициализация страницы контрактов
document.addEventListener('DOMContentLoaded', function() {
    // Активация меню закупок
    activateProcurementMenu();
    
    // Инициализация форм и модальных окон
    initModals();
    initForms();
    
    // Установка текущих дат
    setCurrentDate();
    
    // Загрузка данных контрактов
    loadContractStatistics();
    loadContractsData();
    
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
    // Модальное окно создания/редактирования контракта
    const contractModal = document.getElementById('contractModal');
    const newContractBtn = document.getElementById('newContractBtn');
    const closeContractBtn = contractModal.querySelector('.close');
    const cancelContractBtn = document.getElementById('cancelContractBtn');
    
    newContractBtn.addEventListener('click', function() {
        openModal(contractModal);
        document.getElementById('contractModalTitle').textContent = 'Новый контракт';
        document.getElementById('contractForm').reset();
        document.getElementById('contractId').value = '';
        setCurrentDate();
    });
    
    closeContractBtn.addEventListener('click', function() {
        closeModal(contractModal);
    });
    
    cancelContractBtn.addEventListener('click', function() {
        closeModal(contractModal);
    });
    
    // Модальное окно просмотра контракта
    const viewContractModal = document.getElementById('viewContractModal');
    const closeViewContractBtn = viewContractModal.querySelector('.close');
    const cancelViewContractBtn = document.getElementById('closeViewContractBtn');
    const editViewContractBtn = document.getElementById('editViewContractBtn');
    const renewViewContractBtn = document.getElementById('renewViewContractBtn');
    const terminateViewContractBtn = document.getElementById('terminateViewContractBtn');
    
    closeViewContractBtn.addEventListener('click', function() {
        closeModal(viewContractModal);
    });
    
    cancelViewContractBtn.addEventListener('click', function() {
        closeModal(viewContractModal);
    });
    
    editViewContractBtn.addEventListener('click', function() {
        const contractId = document.getElementById('view-contract-id').textContent;
        closeModal(viewContractModal);
        editContract(contractId);
    });
    
    renewViewContractBtn.addEventListener('click', function() {
        const contractId = document.getElementById('view-contract-id').textContent;
        closeModal(viewContractModal);
        renewContract(contractId);
    });
    
    terminateViewContractBtn.addEventListener('click', function() {
        const contractId = document.getElementById('view-contract-id').textContent;
        if (confirm('Вы уверены, что хотите расторгнуть этот контракт?')) {
            terminateContract(contractId);
            closeModal(viewContractModal);
        }
    });
    
    // Действия с контрактами в таблице
    document.addEventListener('click', function(e) {
        if (e.target.closest('.view-contract-btn')) {
            const contractId = e.target.closest('.view-contract-btn').dataset.id;
            viewContract(contractId);
        } else if (e.target.closest('.edit-contract-btn')) {
            const contractId = e.target.closest('.edit-contract-btn').dataset.id;
            editContract(contractId);
        } else if (e.target.closest('.delete-contract-btn')) {
            const contractId = e.target.closest('.delete-contract-btn').dataset.id;
            if (confirm('Вы уверены, что хотите удалить этот контракт?')) {
                deleteContract(contractId);
            }
        } else if (e.target.closest('.renew-contract-btn')) {
            const contractId = e.target.closest('.renew-contract-btn').dataset.id;
            renewContract(contractId);
        }
    });
}

// Инициализация форм
function initForms() {
    const contractForm = document.getElementById('contractForm');
    
    contractForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveContract();
    });
}

// Установка текущих дат в форме
function setCurrentDate() {
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);
    
    document.getElementById('startDate').valueAsDate = today;
    document.getElementById('endDate').valueAsDate = nextYear;
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
    const contractSearch = document.getElementById('contractSearch');
    
    applyFiltersBtn.addEventListener('click', function() {
        applyFilters();
    });
    
    resetFiltersBtn.addEventListener('click', function() {
        resetFilters();
    });
    
    contractSearch.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });
}

// Загрузка статистики контрактов
function loadContractStatistics() {
    // В реальном приложении данные будут загружаться с сервера
    // Имитация загрузки данных
    setTimeout(function() {
        document.getElementById('activeCount').textContent = '15';
        document.getElementById('expiringCount').textContent = '3';
        document.getElementById('expiredCount').textContent = '7';
        document.getElementById('totalValueCount').textContent = '₽12,850,000';
    }, 500);
}

// Загрузка данных контрактов
function loadContractsData(page = 1) {
    // В реальном приложении данные будут загружаться с сервера
    // Имитация загрузки данных
    
    // Отображение индикатора загрузки
    const tableBody = document.getElementById('contractsTable');
    tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Загрузка данных...</td></tr>';
    
    // Имитация задержки загрузки
    setTimeout(function() {
        // Данные уже имеются в HTML (для демонстрации)
        updatePagination(page, 3); // 3 страницы всего
    }, 800);
}

// Применение фильтров
function applyFilters() {
    const searchTerm = document.getElementById('contractSearch').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const supplierFilter = document.getElementById('supplierFilter').value;
    const dateFromFilter = document.getElementById('dateFromFilter').value;
    const dateToFilter = document.getElementById('dateToFilter').value;
    
    console.log('Применение фильтров:', {
        searchTerm,
        statusFilter,
        supplierFilter,
        dateFromFilter,
        dateToFilter
    });
    
    // В реальном приложении здесь будет запрос на сервер с применением фильтров
    // Имитация фильтрации
    loadContractsData(1);
    
    showNotification('Фильтры применены', 'success');
}

// Сброс фильтров
function resetFilters() {
    document.getElementById('contractSearch').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('supplierFilter').value = '';
    document.getElementById('dateFromFilter').value = '';
    document.getElementById('dateToFilter').value = '';
    
    // Загрузка данных без фильтров
    loadContractsData(1);
    
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
    loadContractsData(pageNum);
}

// Сохранение контракта
function saveContract() {
    const contractForm = document.getElementById('contractForm');
    const contractId = document.getElementById('contractId').value;
    
    // Проверка формы
    if (!contractForm.checkValidity()) {
        contractForm.reportValidity();
        return;
    }
    
    // Получение данных формы
    const contractData = {
        id: contractId || generateContractId(),
        supplier: document.getElementById('contractSupplier').value,
        supplierName: document.getElementById('contractSupplier').options[document.getElementById('contractSupplier').selectedIndex].text,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        type: document.getElementById('contractType').value,
        typeName: document.getElementById('contractType').options[document.getElementById('contractType').selectedIndex].text,
        value: document.getElementById('contractValue').value,
        paymentTerms: document.getElementById('paymentTerms').value,
        renewalTerms: document.getElementById('renewalTerms').value,
        terms: document.getElementById('contractTerms').value,
        notes: document.getElementById('contractNotes').value
    };
    
    console.log('Сохранение контракта:', contractData);
    
    // В реальном приложении данные будут отправляться на сервер
    // Имитация сохранения
    const contractModal = document.getElementById('contractModal');
    closeModal(contractModal);
    
    if (contractId) {
        showNotification('Контракт успешно обновлен', 'success');
    } else {
        showNotification('Контракт успешно создан', 'success');
    }
    
    // Перезагрузка данных
    loadContractStatistics();
    loadContractsData();
}

// Генерация ID для нового контракта
function generateContractId() {
    const year = new Date().getFullYear();
    const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `К-${year}-${randomPart}`;
}

// Просмотр контракта
function viewContract(contractId) {
    console.log('Просмотр контракта:', contractId);
    
    // В реальном приложении данные будут загружаться с сервера
    // Имитация загрузки данных о контракте
    setTimeout(function() {
        // Заполнение данными модального окна
        document.getElementById('view-contract-id').textContent = contractId;
        
        // Заполнение демо данными (в реальности будут данные с сервера)
        if (contractId === 'К-2023-001') {
            document.getElementById('view-contract-status').innerHTML = '<span class="status-badge status-active">Активный</span>';
            document.getElementById('view-contract-supplier').textContent = 'ООО "ТехноСнаб"';
            document.getElementById('view-contract-type').textContent = 'Фиксированная цена';
            document.getElementById('view-contract-start').textContent = '01.01.2023';
            document.getElementById('view-contract-end').textContent = '31.12.2023';
            document.getElementById('view-contract-value').textContent = '₽2,500,000';
            document.getElementById('view-contract-payment').textContent = 'Net 30';
            document.getElementById('view-contract-terms').textContent = 'Стандартные условия поставки компьютерной техники. Срок поставки 5-7 рабочих дней с момента заказа. Оплата по факту поставки в течение 30 дней.';
            document.getElementById('view-contract-notes').textContent = 'Приоритетный поставщик компьютерной техники с 2020 года.';
        } else if (contractId === 'К-2023-002') {
            document.getElementById('view-contract-status').innerHTML = '<span class="status-badge status-active">Активный</span>';
            document.getElementById('view-contract-supplier').textContent = 'АО "Компьютер-Трейд"';
            document.getElementById('view-contract-type').textContent = 'Годовой контракт';
            document.getElementById('view-contract-start').textContent = '15.02.2023';
            document.getElementById('view-contract-end').textContent = '14.02.2024';
            document.getElementById('view-contract-value').textContent = '₽1,800,000';
            document.getElementById('view-contract-payment').textContent = 'Net 60';
            document.getElementById('view-contract-terms').textContent = 'Годовой контракт на поставку серверного оборудования с возможностью ежемесячных закупок по согласованным ценам.';
            document.getElementById('view-contract-notes').textContent = 'Возможно продление контракта на следующий год с индексацией цен не более 10%.';
        } else {
            document.getElementById('view-contract-status').innerHTML = '<span class="status-badge status-active">Активный</span>';
            document.getElementById('view-contract-supplier').textContent = 'Поставщик ' + contractId;
            document.getElementById('view-contract-type').textContent = 'Стандартный контракт';
            document.getElementById('view-contract-start').textContent = '01.01.2023';
            document.getElementById('view-contract-end').textContent = '31.12.2023';
            document.getElementById('view-contract-value').textContent = '₽1,000,000';
            document.getElementById('view-contract-payment').textContent = 'Net 30';
            document.getElementById('view-contract-terms').textContent = 'Стандартные условия поставки.';
            document.getElementById('view-contract-notes').textContent = '';
        }
        
        // Отображение модального окна
        const viewContractModal = document.getElementById('viewContractModal');
        openModal(viewContractModal);
    }, 300);
}

// Редактирование контракта
function editContract(contractId) {
    console.log('Редактирование контракта:', contractId);
    
    // В реальном приложении данные будут загружаться с сервера
    // Имитация загрузки данных о контракте
    setTimeout(function() {
        // Заполнение формы данными
        document.getElementById('contractId').value = contractId;
        document.getElementById('contractModalTitle').textContent = 'Редактирование контракта';
        
        // Заполнение демо данными (в реальности будут данные с сервера)
        if (contractId === 'К-2023-001') {
            document.getElementById('contractSupplier').value = '1';
            document.getElementById('startDate').value = '2023-01-01';
            document.getElementById('endDate').value = '2023-12-31';
            document.getElementById('contractType').value = 'fixed';
            document.getElementById('contractValue').value = '2500000';
            document.getElementById('paymentTerms').value = 'net30';
            document.getElementById('renewalTerms').value = 'negotiable';
            document.getElementById('contractTerms').value = 'Стандартные условия поставки компьютерной техники. Срок поставки 5-7 рабочих дней с момента заказа. Оплата по факту поставки в течение 30 дней.';
            document.getElementById('contractNotes').value = 'Приоритетный поставщик компьютерной техники с 2020 года.';
        } else if (contractId === 'К-2023-002') {
            document.getElementById('contractSupplier').value = '2';
            document.getElementById('startDate').value = '2023-02-15';
            document.getElementById('endDate').value = '2024-02-14';
            document.getElementById('contractType').value = 'annual';
            document.getElementById('contractValue').value = '1800000';
            document.getElementById('paymentTerms').value = 'net60';
            document.getElementById('renewalTerms').value = 'auto';
            document.getElementById('contractTerms').value = 'Годовой контракт на поставку серверного оборудования с возможностью ежемесячных закупок по согласованным ценам.';
            document.getElementById('contractNotes').value = 'Возможно продление контракта на следующий год с индексацией цен не более 10%.';
        } else {
            // Заполнение формы случайными данными для других ID
            document.getElementById('contractSupplier').value = '3';
            document.getElementById('startDate').value = '2023-01-01';
            document.getElementById('endDate').value = '2023-12-31';
            document.getElementById('contractType').value = 'fixed';
            document.getElementById('contractValue').value = '1000000';
            document.getElementById('paymentTerms').value = 'net30';
            document.getElementById('renewalTerms').value = 'none';
            document.getElementById('contractTerms').value = 'Стандартные условия поставки.';
            document.getElementById('contractNotes').value = '';
        }
        
        // Отображение модального окна
        const contractModal = document.getElementById('contractModal');
        openModal(contractModal);
    }, 300);
}

// Удаление контракта
function deleteContract(contractId) {
    console.log('Удаление контракта:', contractId);
    
    // В реальном приложении запрос будет отправляться на сервер
    // Имитация удаления
    setTimeout(function() {
        showNotification(`Контракт ${contractId} успешно удален`, 'success');
        
        // Перезагрузка данных
        loadContractStatistics();
        loadContractsData();
    }, 500);
}

// Продление контракта
function renewContract(contractId) {
    console.log('Продление контракта:', contractId);
    
    // В этом методе можно реализовать логику продления контракта
    // Например, открыть форму редактирования с предзаполненными данными
    // и обновленными датами
    
    editContract(contractId);
    
    // Обновление дат для продления
    setTimeout(function() {
        const startDate = new Date(document.getElementById('endDate').value);
        const endDate = new Date(startDate);
        
        // Обновление даты начала и окончания
        startDate.setDate(startDate.getDate() + 1); // Начало на следующий день после окончания предыдущего
        
        // Стандартное продление на 1 год от новой даты начала
        endDate.setFullYear(startDate.getFullYear() + 1);
        
        // Форматирование дат для input[type=date]
        document.getElementById('startDate').value = formatDateForInput(startDate);
        document.getElementById('endDate').value = formatDateForInput(endDate);
        
        // Обновление заголовка
        document.getElementById('contractModalTitle').textContent = 'Продление контракта';
        
        // Генерация нового ID для продленного контракта
        document.getElementById('contractId').value = '';
        
        showNotification(`Заполните данные для продления контракта ${contractId}`, 'info');
    }, 500);
}

// Расторжение контракта
function terminateContract(contractId) {
    console.log('Расторжение контракта:', contractId);
    
    // В реальном приложении запрос будет отправляться на сервер
    // Имитация расторжения
    setTimeout(function() {
        showNotification(`Контракт ${contractId} расторгнут`, 'warning');
        
        // Перезагрузка данных
        loadContractStatistics();
        loadContractsData();
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

// Форматирование даты для input[type=date]
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Форматирование числа как валюты
function formatCurrency(amount) {
    return new Intl.NumberFormat('ru-RU', { 
        style: 'currency', 
        currency: 'RUB',
        maximumFractionDigits: 0 
    }).format(amount);
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