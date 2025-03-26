// Функции для обработки действий с инвентарем

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация обработчиков событий для кнопок действий
    initActionButtons();
    
    // Инициализация продвинутых фильтров
    initAdvancedFilters();
});

// Инициализация обработчиков кнопок
function initActionButtons() {
    // Кнопка "Add New Product"
    const addProductButton = document.querySelector('.action-button.primary:nth-child(1)');
    if (addProductButton) {
        addProductButton.addEventListener('click', openAddProductModal);
    }
    
    // Кнопка "Create Order"
    const createOrderButton = document.querySelector('.action-button.primary:nth-child(2)');
    if (createOrderButton) {
        createOrderButton.addEventListener('click', openCreateOrderModal);
    }
    
    // Кнопка "Reserve"
    const reserveButton = document.querySelector('.action-button.success');
    if (reserveButton) {
        reserveButton.addEventListener('click', openReserveModal);
    }
    
    // Кнопка "Move"
    const moveButton = document.querySelector('.action-button.warning');
    if (moveButton) {
        moveButton.addEventListener('click', openMoveStockModal);
    }
    
    // Кнопка "Write-off"
    const writeOffButton = document.querySelector('.action-button.danger');
    if (writeOffButton) {
        writeOffButton.addEventListener('click', openWriteOffModal);
    }
    
    // Кнопка "Inventory Check"
    const inventoryCheckButton = document.querySelector('.action-button.secondary');
    if (inventoryCheckButton) {
        inventoryCheckButton.addEventListener('click', openInventoryCheckModal);
    }
    
    // Закрытие модальных окон
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', closeModal);
    });
    
    // Закрытие по нажатию за пределами модального окна
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Открытие модального окна Add New Product
function openAddProductModal() {
    // Загрузка категорий, поставщиков и единиц измерения
    loadFormReferenceData();
    
    // Сброс формы
    const form = document.getElementById('add-product-form');
    if (form) form.reset();
    
    // Показ модального окна
    const modal = document.getElementById('add-product-modal');
    if (modal) {
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
}

// Открытие модального окна Create Order
function openCreateOrderModal() {
    // Функционал для создания заказа
    const modal = document.getElementById('create-order-modal');
    if (modal) {
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    } else {
        alert('Order creation functionality will be implemented in the next update.');
    }
}

// Открытие модального окна Reserve
function openReserveModal() {
    // Загрузка товаров, заказов и локаций
    loadItemsForReservation();
    
    // Показ модального окна
    const modal = document.getElementById('reserve-modal');
    if (modal) {
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    } else {
        alert('Reservation functionality will be implemented in the next update.');
    }
}

// Открытие модального окна Move Stock
function openMoveStockModal() {
    // Загрузка товаров и локаций
    loadItemsAndLocations();
    
    // Показ модального окна
    const modal = document.getElementById('move-stock-modal');
    if (modal) {
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    } else {
        alert('Stock movement functionality will be implemented in the next update.');
    }
}

// Открытие модального окна Write-off
function openWriteOffModal() {
    // Загрузка товаров
    loadItemsForWriteOff();
    
    // Показ модального окна
    const modal = document.getElementById('write-off-modal');
    if (modal) {
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    } else {
        alert('Write-off functionality will be implemented in the next update.');
    }
}

// Открытие модального окна Inventory Check
function openInventoryCheckModal() {
    // Функционал для проверки инвентаря
    const modal = document.getElementById('inventory-check-modal');
    if (modal) {
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    } else {
        alert('Inventory checking functionality will be implemented in the next update.');
    }
}

// Загрузка справочных данных для формы добавления товара
async function loadFormReferenceData() {
    try {
        // Загрузка категорий
        const categories = await fetchData('/api/inventory/categories');
        populateSelect('product-category', categories, 'id', 'name');
        
        // Загрузка единиц измерения
        const uoms = await fetchData('/api/inventory/uom');
        populateSelect('product-uom', uoms, 'id', 'name');
        
        // Загрузка поставщиков
        const suppliers = await fetchData('/api/suppliers');
        populateSelect('product-supplier', suppliers, 'id', 'name');
    } catch (error) {
        console.error('Error loading reference data:', error);
        showNotification('Failed to load reference data', 'error');
    }
}

// Загрузка товаров для резервирования
async function loadItemsForReservation() {
    try {
        // Загрузка товаров
        const items = await fetchData('/api/inventory/items');
        populateSelect('reserve-item', items, 'id', 'name');
        
        // Загрузка заказов (в будущем)
        const orders = []; // Будет заменено на реальный API вызов
        populateSelect('reserve-order', orders, 'id', 'name');
        
        // Загрузка локаций
        const locations = await fetchData('/api/inventory/locations');
        populateSelect('reserve-location', locations, 'id', 'name');
    } catch (error) {
        console.error('Error loading items for reservation:', error);
        showNotification('Failed to load items', 'error');
    }
}

// Загрузка товаров и локаций для перемещения
async function loadItemsAndLocations() {
    try {
        // Загрузка товаров
        const items = await fetchData('/api/inventory/items');
        populateSelect('move-item', items, 'id', 'name');
        
        // Загрузка локаций
        const locations = await fetchData('/api/inventory/locations');
        populateSelect('move-from-location', locations, 'id', 'name');
        populateSelect('move-to-location', locations, 'id', 'name');
    } catch (error) {
        console.error('Error loading items and locations:', error);
        showNotification('Failed to load data', 'error');
    }
}

// Загрузка товаров для списания
async function loadItemsForWriteOff() {
    try {
        // Загрузка товаров
        const items = await fetchData('/api/inventory/items');
        populateSelect('write-off-item', items, 'id', 'name');
        
        // Загрузка локаций
        const locations = await fetchData('/api/inventory/locations');
        populateSelect('write-off-location', locations, 'id', 'name');
    } catch (error) {
        console.error('Error loading items for write-off:', error);
        showNotification('Failed to load items', 'error');
    }
}

// Заполнение выпадающего списка
function populateSelect(selectId, options, valueField, textField) {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) return;
    
    // Очистка списка
    selectElement.innerHTML = '<option value="">-- Select --</option>';
    
    // Заполнение опциями
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option[valueField];
        optionElement.textContent = option[textField];
        selectElement.appendChild(optionElement);
    });
}

// Загрузка данных через API
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
}

// Функция для закрытия всех модальных окон
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });
}

// Сохранение нового товара или обновление существующего
async function saveNewProduct(form) {
    try {
        // Получение данных формы
        const formData = new FormData(form);
        const productData = {};
        
        for (const [key, value] of formData.entries()) {
            productData[key] = value;
        }
        
        // Конвертация числовых полей
        if (productData.min_quantity) productData.min_quantity = parseFloat(productData.min_quantity);
        if (productData.unit_price) productData.unit_price = parseFloat(productData.unit_price);
        
        // Определяем, это добавление нового товара или редактирование существующего
        const isEditing = productData.id && productData.id.trim() !== '';
        
        // URL и метод запроса зависят от того, добавляем мы товар или редактируем
        const url = isEditing 
            ? `/api/inventory/items/${productData.id}` 
            : '/api/inventory/items';
        
        const method = isEditing ? 'PUT' : 'POST';
        
        console.log(`${isEditing ? 'Обновление' : 'Создание'} товара:`, productData);
        
        // Отправка данных на сервер
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Не удалось ${isEditing ? 'обновить' : 'сохранить'} товар`);
        }
        
        // Закрытие модального окна и обновление списка товаров
        closeModal();
        showNotification(
            isEditing ? 'Товар успешно обновлен' : 'Товар успешно добавлен', 
            'success'
        );
        
        // Обновление таблицы товаров
        if (typeof initInventoryPage === 'function') {
            initInventoryPage();
        }
    } catch (error) {
        console.error(`Ошибка при ${productData.id ? 'обновлении' : 'сохранении'} товара:`, error);
        showNotification(error.message, 'error');
    }
}

// Создание резервации
async function createReservation(form) {
    try {
        // Получение данных формы
        const formData = new FormData(form);
        const reservationData = {};
        
        for (const [key, value] of formData.entries()) {
            reservationData[key] = value;
        }
        
        // Конвертация числовых полей
        if (reservationData.quantity) reservationData.quantity = parseFloat(reservationData.quantity);
        
        // Отправка данных на сервер
        const response = await fetch('/api/inventory/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservationData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create reservation');
        }
        
        // Закрытие модального окна и обновление списка товаров
        closeModal();
        showNotification('Reservation created successfully', 'success');
        
        // Обновление таблицы товаров
        if (typeof initInventoryPage === 'function') {
            initInventoryPage();
        }
    } catch (error) {
        console.error('Error creating reservation:', error);
        showNotification(error.message, 'error');
    }
}

// Перемещение товара
async function moveStock(form) {
    try {
        // Получение данных формы
        const formData = new FormData(form);
        const movementData = {
            item_id: formData.get('item_id'),
            from_location_id: formData.get('from_location_id'),
            to_location_id: formData.get('to_location_id'),
            quantity: parseFloat(formData.get('quantity')),
            type: 'transfer',
            notes: formData.get('notes')
        };
        
        // Отправка данных на сервер
        const response = await fetch('/api/inventory/movements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movementData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to move stock');
        }
        
        // Закрытие модального окна и обновление списка товаров
        closeModal();
        showNotification('Stock moved successfully', 'success');
        
        // Обновление таблицы товаров
        if (typeof initInventoryPage === 'function') {
            initInventoryPage();
        }
    } catch (error) {
        console.error('Error moving stock:', error);
        showNotification(error.message, 'error');
    }
}

// Списание товара
async function writeOffStock(form) {
    try {
        // Получение данных формы
        const formData = new FormData(form);
        const writeOffData = {
            item_id: formData.get('item_id'),
            location_id: formData.get('location_id'),
            quantity: parseFloat(formData.get('quantity')),
            type: 'write_off',
            reason: formData.get('reason'),
            notes: formData.get('notes')
        };
        
        // Отправка данных на сервер
        const response = await fetch('/api/inventory/movements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(writeOffData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to write off stock');
        }
        
        // Закрытие модального окна и обновление списка товаров
        closeModal();
        showNotification('Stock written off successfully', 'success');
        
        // Обновление таблицы товаров
        if (typeof initInventoryPage === 'function') {
            initInventoryPage();
        }
    } catch (error) {
        console.error('Error writing off stock:', error);
        showNotification(error.message, 'error');
    }
}

// Проверка инвентаря
async function startInventoryCheck(form) {
    try {
        // В будущем здесь будет логика проверки инвентаря
        alert('Inventory check functionality will be implemented in a future update');
        closeModal();
    } catch (error) {
        console.error('Error starting inventory check:', error);
        showNotification(error.message, 'error');
    }
}

// Отображение уведомления
function showNotification(message, type = 'info') {
    // Проверяем, есть ли контейнер для уведомлений
    let notificationContainer = document.querySelector('.notification-container');
    
    // Если нет, создаем его
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.bottom = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '9999';
        document.body.appendChild(notificationContainer);
    }
    
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.backgroundColor = type === 'error' ? '#f8d7da' : type === 'success' ? '#d4edda' : '#d1ecf1';
    notification.style.color = type === 'error' ? '#721c24' : type === 'success' ? '#155724' : '#0c5460';
    notification.style.padding = '10px 15px';
    notification.style.margin = '5px 0';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.textContent = message;
    
    // Добавляем на страницу
    notificationContainer.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.remove();
        
        // Если это последнее уведомление, удаляем контейнер
        if (notificationContainer.children.length === 0) {
            notificationContainer.remove();
        }
    }, 3000);
}

// Инициализация продвинутых фильтров
function initAdvancedFilters() {
    // Переключатель для показа/скрытия расширенных фильтров
    const advancedFilterToggle = document.querySelector('.advanced-filter-toggle');
    if (advancedFilterToggle) {
        advancedFilterToggle.addEventListener('click', function() {
            // Переключаем класс open для изменения стиля переключателя
            this.classList.toggle('open');
            
            // Показываем или скрываем панель расширенных фильтров
            const advancedFilters = document.querySelector('.advanced-filters');
            if (advancedFilters) {
                advancedFilters.classList.toggle('show');
                
                // Если панель открывается, устанавливаем фокус на первый ввод
                if (advancedFilters.classList.contains('show')) {
                    const firstInput = advancedFilters.querySelector('input, select');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }
            }
        });
    }
    
    // Обработчик для ввода минимальной цены
    const minPriceInput = document.querySelector('input[data-filter="min-price"]');
    if (minPriceInput) {
        minPriceInput.addEventListener('input', function() {
            // Проверяем, что максимальная цена больше минимальной
            const maxPriceInput = document.querySelector('input[data-filter="max-price"]');
            if (maxPriceInput && maxPriceInput.value && parseFloat(maxPriceInput.value) < parseFloat(this.value)) {
                maxPriceInput.value = this.value;
            }
        });
    }
    
    // Обработчик для ввода максимальной цены
    const maxPriceInput = document.querySelector('input[data-filter="max-price"]');
    if (maxPriceInput) {
        maxPriceInput.addEventListener('input', function() {
            // Проверяем, что минимальная цена меньше максимальной
            const minPriceInput = document.querySelector('input[data-filter="min-price"]');
            if (minPriceInput && minPriceInput.value && parseFloat(minPriceInput.value) > parseFloat(this.value)) {
                minPriceInput.value = this.value;
            }
        });
    }
    
    // Добавляем обработчики изменения для всех фильтров
    document.querySelectorAll('.advanced-filters input, .advanced-filters select').forEach(filterElement => {
        filterElement.addEventListener('change', function() {
            // При изменении любого фильтра добавляем индикатор примененного фильтра
            if (this.value) {
                this.classList.add('filter-applied');
            } else {
                this.classList.remove('filter-applied');
            }
            
            // Обновляем счетчик примененных фильтров
            updateFilterCounter();
        });
    });
    
    // Кнопка применения фильтров
    const applyButton = document.querySelector('.filter-button.primary');
    if (applyButton) {
        applyButton.addEventListener('click', function() {
            if (typeof applyFilters === 'function') {
                applyFilters();
                
                // Подсветка примененных фильтров
                document.querySelectorAll('.advanced-filters input, .advanced-filters select').forEach(el => {
                    if (el.value) {
                        el.classList.add('filter-applied');
                    } else {
                        el.classList.remove('filter-applied');
                    }
                });
                
                // Закрываем панель расширенных фильтров
                const advancedFilters = document.querySelector('.advanced-filters');
                if (advancedFilters) {
                    advancedFilters.classList.remove('show');
                }
                
                // Сбрасываем стиль переключателя
                const advancedFilterToggle = document.querySelector('.advanced-filter-toggle');
                if (advancedFilterToggle) {
                    advancedFilterToggle.classList.remove('open');
                }
            }
        });
    }
    
    // Кнопка сброса фильтров
    const resetButton = document.querySelector('.filter-button.secondary');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            // Сбрасываем все поля расширенных фильтров
            document.querySelectorAll('.advanced-filters input, .advanced-filters select').forEach(el => {
                if (el.tagName === 'SELECT') {
                    el.selectedIndex = 0;
                } else if (el.type === 'date' || el.type === 'text' || el.type === 'number') {
                    el.value = '';
                }
                el.classList.remove('filter-applied');
            });
            
            // Обновляем счетчик примененных фильтров
            updateFilterCounter();
            
            if (typeof resetFilters === 'function') {
                resetFilters();
            }
        });
    }
    
    // Инициализация счетчика фильтров
    updateFilterCounter();
}

// Обновление счетчика примененных фильтров
function updateFilterCounter() {
    const appliedFilters = document.querySelectorAll('.advanced-filters input[value]:not([value=""]), .advanced-filters select option:checked:not([value=""])');
    const counter = appliedFilters.length;
    
    const filterToggle = document.querySelector('.advanced-filter-toggle');
    if (filterToggle) {
        // Обновляем текст и добавляем счетчик, если есть примененные фильтры
        if (counter > 0) {
            filterToggle.innerHTML = `Advanced Filters (${counter}) <i class="fas fa-chevron-down"></i>`;
            filterToggle.classList.add('has-filters');
        } else {
            filterToggle.innerHTML = `Advanced Filters <i class="fas fa-chevron-down"></i>`;
            filterToggle.classList.remove('has-filters');
        }
    }
} 