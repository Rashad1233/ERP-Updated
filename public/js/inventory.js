/**
 * Скрипт для управления страницей инвентаря
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация приложения
    initApp();
    
    // Назначаем слушатели событий для элементов интерфейса
    setupEventListeners();
});

// Инициализация приложения
async function initApp() {
    try {
        // Загружаем данные о товарах
        const items = await window.inventoryApi.items.getAll();
        
        // Отображаем товары в таблице
        displayItems(items);
        
        // Загружаем данные для выпадающих списков
        await loadFormData();
        
        // Инициализируем счетчики
        updateInventorySummary(items);
    } catch (error) {
        console.error('Ошибка при инициализации приложения:', error);
        showNotification('Ошибка при загрузке данных', 'error');
    }
}

// Отображение товаров в таблице
function displayItems(items) {
    const tableBody = document.getElementById('inventory-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (items.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center">Товары не найдены</td>
            </tr>
        `;
        return;
    }
    
    items.forEach(item => {
        const row = document.createElement('tr');
        row.setAttribute('data-item-id', item.id);
        
        // Определяем класс строки в зависимости от статуса товара
        if (item.current_quantity <= item.min_quantity) {
            row.classList.add('low-stock');
        }
        
        row.innerHTML = `
            <td>
                <div class="item-code">${item.code || '-'}</div>
            </td>
            <td>
                <div class="item-name">${item.name}</div>
                <div class="item-description text-muted">${item.description || ''}</div>
            </td>
            <td>${item.category_name || '-'}</td>
            <td>${item.current_quantity} ${item.uom_code || 'шт.'}</td>
            <td>${item.min_quantity} ${item.uom_code || 'шт.'}</td>
            <td>${window.inventoryApi.utils.formatCurrency(item.unit_price, item.currency)}</td>
            <td>${window.inventoryApi.utils.getItemStatusText(item.status)}</td>
            <td>${item.supplier_name || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon edit-item" title="Редактировать">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon view-item" title="Просмотреть детали">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon delete-item" title="Удалить">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Назначаем обработчики событий для кнопок в таблице
    setupTableButtons();
}

// Назначение обработчиков для кнопок в таблице
function setupTableButtons() {
    // Кнопки редактирования
    document.querySelectorAll('.edit-item').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.closest('tr').getAttribute('data-item-id');
            openEditItemModal(itemId);
        });
    });
    
    // Кнопки просмотра деталей
    document.querySelectorAll('.view-item').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.closest('tr').getAttribute('data-item-id');
            openViewItemModal(itemId);
        });
    });
    
    // Кнопки удаления
    document.querySelectorAll('.delete-item').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.closest('tr').getAttribute('data-item-id');
            confirmDeleteItem(itemId);
        });
    });
}

// Загрузка данных для выпадающих списков в формах
async function loadFormData() {
    try {
        // Загружаем категории
        const categories = await window.inventoryApi.categories.getAll();
        populateSelect('category_id', categories, 'id', 'name');
        
        // Загружаем единицы измерения
        const uoms = await window.inventoryApi.uom.getAll();
        populateSelect('uom_id', uoms, 'id', 'name');
        
        // Загружаем список поставщиков
        // В реальности здесь должен быть вызов API для получения поставщиков
        fetch('/api/suppliers')
            .then(response => response.json())
            .then(suppliers => {
                populateSelect('supplier_id', suppliers, 'id', 'name');
            })
            .catch(error => console.error('Ошибка при загрузке поставщиков:', error));
        
    } catch (error) {
        console.error('Ошибка при загрузке данных для форм:', error);
    }
}

// Заполнение выпадающего списка
function populateSelect(selectId, options, valueField, textField) {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) return;
    
    // Очищаем список
    selectElement.innerHTML = '<option value="">-- Выберите --</option>';
    
    // Добавляем опции
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option[valueField];
        optionElement.textContent = option[textField];
        selectElement.appendChild(optionElement);
    });
}

// Обновление сводки по инвентарю
function updateInventorySummary(items) {
    // Подсчитываем общее количество товаров
    const totalItems = items.length;
    document.getElementById('total-items-count').textContent = totalItems;
    
    // Подсчитываем количество товаров с низким запасом
    const lowStockItems = items.filter(item => item.current_quantity <= item.min_quantity).length;
    document.getElementById('low-stock-count').textContent = lowStockItems;
    
    // Вычисляем общую стоимость запасов
    const totalValue = items.reduce((sum, item) => sum + (item.current_quantity * item.unit_price), 0);
    document.getElementById('inventory-value').textContent = window.inventoryApi.utils.formatCurrency(totalValue);
}

// Открытие модального окна для добавления нового товара
function openAddItemModal() {
    const modal = document.getElementById('item-modal');
    const form = document.getElementById('item-form');
    
    // Очищаем форму
    form.reset();
    form.setAttribute('data-mode', 'add');
    
    // Обновляем заголовок
    document.getElementById('modal-title').textContent = 'Добавить новый товар';
    
    // Показываем модальное окно
    modal.classList.add('active');
}

// Открытие модального окна для редактирования товара
async function openEditItemModal(itemId) {
    const modal = document.getElementById('item-modal');
    const form = document.getElementById('item-form');
    
    try {
        // Получаем данные о товаре
        const item = await window.inventoryApi.items.getById(itemId);
        
        // Заполняем форму данными
        form.reset();
        form.setAttribute('data-mode', 'edit');
        form.setAttribute('data-item-id', itemId);
        
        // Устанавливаем значения полей
        Object.keys(item).forEach(key => {
            const field = document.getElementById(key);
            if (field) {
                field.value = item[key];
            }
        });
        
        // Обновляем заголовок
        document.getElementById('modal-title').textContent = `Редактировать товар: ${item.name}`;
        
        // Показываем модальное окно
        modal.classList.add('active');
    } catch (error) {
        console.error(`Ошибка при получении данных о товаре с ID ${itemId}:`, error);
        showNotification('Ошибка при загрузке данных товара', 'error');
    }
}

// Открытие модального окна для просмотра деталей товара
async function openViewItemModal(itemId) {
    const modal = document.getElementById('view-item-modal');
    
    try {
        // Получаем данные о товаре
        const item = await window.inventoryApi.items.getById(itemId);
        
        // Получаем данные о запасах
        const stockData = await window.inventoryApi.stock.getAll();
        const itemStock = stockData.filter(stock => stock.item_id === parseInt(itemId));
        
        // Заполняем модальное окно данными
        document.getElementById('view-item-name').textContent = item.name;
        document.getElementById('view-item-code').textContent = item.code || '-';
        document.getElementById('view-item-description').textContent = item.description || '-';
        document.getElementById('view-item-category').textContent = item.category_name || '-';
        document.getElementById('view-item-uom').textContent = `${item.uom_name} (${item.uom_code})` || '-';
        document.getElementById('view-item-quantity').textContent = `${item.current_quantity} ${item.uom_code}`;
        document.getElementById('view-item-min-quantity').textContent = `${item.min_quantity} ${item.uom_code}`;
        document.getElementById('view-item-price').textContent = window.inventoryApi.utils.formatCurrency(item.unit_price, item.currency);
        document.getElementById('view-item-supplier').textContent = item.supplier_name || '-';
        document.getElementById('view-item-status').textContent = window.inventoryApi.utils.getItemStatusText(item.status);
        
        if (item.expiry_date) {
            document.getElementById('view-item-expiry').textContent = window.inventoryApi.utils.formatDate(item.expiry_date);
            document.getElementById('view-item-expiry-container').style.display = 'block';
        } else {
            document.getElementById('view-item-expiry-container').style.display = 'none';
        }
        
        // Отображаем запасы по локациям
        const stockTableBody = document.getElementById('view-item-stock-body');
        stockTableBody.innerHTML = '';
        
        if (itemStock.length === 0) {
            stockTableBody.innerHTML = '<tr><td colspan="3" class="text-center">Нет данных о запасах по локациям</td></tr>';
        } else {
            itemStock.forEach(stock => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${stock.location_name} (${stock.location_code})</td>
                    <td>${stock.quantity} ${item.uom_code}</td>
                    <td>${stock.reserved_quantity} ${item.uom_code}</td>
                `;
                stockTableBody.appendChild(row);
            });
        }
        
        // Показываем модальное окно
        modal.classList.add('active');
    } catch (error) {
        console.error(`Ошибка при получении данных о товаре с ID ${itemId}:`, error);
        showNotification('Ошибка при загрузке данных товара', 'error');
    }
}

// Подтверждение удаления товара
function confirmDeleteItem(itemId) {
    if (confirm('Вы уверены, что хотите удалить этот товар? Это действие нельзя отменить.')) {
        deleteItem(itemId);
    }
}

// Удаление товара
async function deleteItem(itemId) {
    try {
        await window.inventoryApi.items.delete(itemId);
        showNotification('Товар успешно удален', 'success');
        
        // Обновляем список товаров
        const items = await window.inventoryApi.items.getAll();
        displayItems(items);
        updateInventorySummary(items);
    } catch (error) {
        console.error(`Ошибка при удалении товара с ID ${itemId}:`, error);
        showNotification('Ошибка при удалении товара', 'error');
    }
}

// Сохранение товара
async function saveItem(form) {
    try {
        const formData = new FormData(form);
        const itemData = {};
        
        // Преобразуем FormData в объект
        for (const [key, value] of formData.entries()) {
            itemData[key] = value;
        }
        
        // Преобразуем числовые поля
        ['min_quantity', 'unit_price'].forEach(field => {
            if (itemData[field]) {
                itemData[field] = parseFloat(itemData[field]);
            }
        });
        
        // Определяем режим (добавление или редактирование)
        const mode = form.getAttribute('data-mode');
        
        let result;
        
        if (mode === 'add') {
            // Создаем новый товар
            result = await window.inventoryApi.items.create(itemData);
            showNotification('Товар успешно добавлен', 'success');
        } else {
            // Обновляем существующий товар
            const itemId = form.getAttribute('data-item-id');
            result = await window.inventoryApi.items.update(itemId, itemData);
            showNotification('Товар успешно обновлен', 'success');
        }
        
        // Закрываем модальное окно
        document.getElementById('item-modal').classList.remove('active');
        
        // Обновляем список товаров
        const items = await window.inventoryApi.items.getAll();
        displayItems(items);
        updateInventorySummary(items);
    } catch (error) {
        console.error('Ошибка при сохранении товара:', error);
        showNotification('Ошибка при сохранении товара', 'error');
    }
}

// Назначение слушателей событий
function setupEventListeners() {
    // Кнопка добавления нового товара
    const addItemButton = document.getElementById('add-item-button');
    if (addItemButton) {
        addItemButton.addEventListener('click', openAddItemModal);
    }
    
    // Кнопка закрытия модальных окон
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });
    
    // Форма товара
    const itemForm = document.getElementById('item-form');
    if (itemForm) {
        itemForm.addEventListener('submit', function(event) {
            event.preventDefault();
            saveItem(this);
        });
    }
    
    // Фильтр поиска
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterItems(this.value);
        });
    }
}

// Фильтрация товаров по поисковому запросу
async function filterItems(query) {
    try {
        // Получаем все товары
        const items = await window.inventoryApi.items.getAll();
        
        // Если поисковый запрос пуст, отображаем все товары
        if (!query.trim()) {
            displayItems(items);
            return;
        }
        
        // Фильтруем товары по запросу
        const lowercaseQuery = query.toLowerCase();
        const filteredItems = items.filter(item => 
            (item.name && item.name.toLowerCase().includes(lowercaseQuery)) ||
            (item.code && item.code.toLowerCase().includes(lowercaseQuery)) ||
            (item.description && item.description.toLowerCase().includes(lowercaseQuery)) ||
            (item.category_name && item.category_name.toLowerCase().includes(lowercaseQuery))
        );
        
        // Отображаем отфильтрованные товары
        displayItems(filteredItems);
    } catch (error) {
        console.error('Ошибка при фильтрации товаров:', error);
    }
}

// Отображение уведомления
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Скрываем и удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
