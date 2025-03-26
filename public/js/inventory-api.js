// Функции для работы с API инвентаря и отображения данных в таблице

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM полностью загружен - начинаем инициализацию');
    
    // Инициализация страницы инвентаря
    initInventoryPage();
    
    // Обработчик кнопки поиска
    const searchInput = document.querySelector('.filter-search input');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                loadInventoryItems(this.value);
            }
        });
    }
    
    // Обработчики для фильтров
    const filterCategory = document.querySelector('.filter-category');
    const filterSupplier = document.querySelector('.filter-supplier');
    const filterStatus = document.querySelector('select.filter-control:not(.filter-category):not(.filter-supplier):not(.filter-location):not(.filter-uom)');
    
    if (filterCategory) filterCategory.addEventListener('change', applyFilters);
    if (filterSupplier) filterSupplier.addEventListener('change', applyFilters);
    if (filterStatus) filterStatus.addEventListener('change', applyFilters);
    
    // Кнопка применения фильтров
    const applyFiltersButton = document.querySelector('.filter-button.primary');
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', applyFilters);
    }
    
    // Кнопка сброса фильтров
    const resetFiltersButton = document.querySelector('.filter-button.secondary');
    if (resetFiltersButton) {
        resetFiltersButton.addEventListener('click', resetFilters);
    }
});

// Инициализация страницы инвентаря
async function initInventoryPage() {
    try {
        console.log('Начинаем инициализацию страницы инвентаря');
        
        // Загружаем справочные данные для фильтров
        await loadFilterData();
        
        // Загружаем данные товаров
        await loadInventoryItems();
        
        // Обновляем статистику
        updateInventoryStats();
        
        console.log('Страница инвентаря инициализирована');
    } catch (error) {
        console.error('Ошибка при инициализации страницы инвентаря:', error);
        showNotification('Ошибка при загрузке данных инвентаря', 'error');
    }
}

// Загрузка данных для фильтров
async function loadFilterData() {
    try {
        // Загружаем категории
        const categories = await window.inventoryApi.categories.getAll();
        console.log('Загружены категории:', categories);
        populateFilterSelect('.filter-category', categories);
        
        // Загружаем единицы измерения
        const uoms = await window.inventoryApi.uom.getAll();
        console.log('Загружены единицы измерения:', uoms);
        populateFilterSelect('.filter-uom', uoms);
        
        // Загружаем локации
        const locations = await window.inventoryApi.locations.getAll();
        console.log('Загружены локации:', locations);
        populateFilterSelect('.filter-location', locations);
        
        // Загружаем поставщиков
        // Предполагаем, что API поставщиков доступен через window.inventoryApi.suppliers
        try {
            const response = await fetch('/api/suppliers');
            if (response.ok) {
                const suppliers = await response.json();
                console.log('Загружены поставщики:', suppliers);
                populateFilterSelect('.filter-supplier', suppliers);
            }
        } catch (error) {
            console.warn('Не удалось загрузить поставщиков:', error);
        }
    } catch (error) {
        console.error('Ошибка при загрузке данных для фильтров:', error);
    }
}

// Заполнение выпадающего списка фильтра
function populateFilterSelect(selector, items) {
    const select = document.querySelector(selector);
    if (!select) {
        console.warn(`Не найден элемент выпадающего списка: ${selector}`);
        return;
    }
    
    // Сохраняем первый элемент (опция "Все")
    const firstOption = select.options[0];
    
    // Очищаем список
    select.innerHTML = '';
    
    // Добавляем первый элемент обратно
    select.appendChild(firstOption);
    
    // Добавляем элементы из массива
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        select.appendChild(option);
    });
    
    console.log(`Заполнен список ${selector} ${items.length} элементами`);
}

// Загрузка товаров
async function loadInventoryItems(searchTerm = '') {
    try {
        console.log('Начинаем загрузку товаров');
        
        // Получаем все товары
        const items = await window.inventoryApi.items.getAll();
        console.log('Получены товары из API:', items);
        
        // Фильтруем товары по поисковому запросу, если он есть
        const filteredItems = searchTerm 
            ? items.filter(item => 
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            : items;
        
        console.log('Отфильтровано товаров:', filteredItems.length);
        
        // Отображаем товары в таблице
        displayInventoryItems(filteredItems);
        
        return filteredItems;
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        showNotification('Не удалось загрузить данные товаров', 'error');
        return [];
    }
}

// Отображение товаров в таблице
async function displayInventoryItems(items) {
    console.log('Начинаем отображение товаров в таблице, количество: ', items.length);
    
    // Находим таблицу для отображения товаров
    const tableBody = document.querySelector('.data-table tbody');
    if (!tableBody) {
        console.error('Не найдена таблица для отображения товаров (.data-table tbody)');
        
        // Выведем все таблицы на странице для отладки
        const allTables = document.querySelectorAll('table');
        console.log('Все таблицы на странице:', allTables);
        
        // Пробуем найти альтернативную таблицу
        const alternativeTableBody = document.querySelector('table tbody');
        if (alternativeTableBody) {
            console.log('Найдена альтернативная таблица:', alternativeTableBody);
            // Используем найденную таблицу
            displayInventoryItemsInTable(items, alternativeTableBody);
        } else {
            showNotification('Не найдена таблица для отображения товаров', 'error');
        }
        return;
    }
    
    // Используем основную таблицу
    displayInventoryItemsInTable(items, tableBody);
}

// Вспомогательная функция для отображения товаров в конкретной таблице
async function displayInventoryItemsInTable(items, tableBody) {
    console.log(`Отображение ${items.length} товаров в таблице`);
    
    // Очищаем таблицу
    tableBody.innerHTML = '';
    
    // Если нет товаров, отображаем сообщение
    if (!items || items.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="8" class="text-center">Нет товаров для отображения</td>';
        tableBody.appendChild(emptyRow);
        return;
    }
    
    // Загружаем справочные данные для отображения
    let categories = [];
    try {
        categories = await window.inventoryApi.categories.getAll();
        console.log('Загружены категории для отображения:', categories);
    } catch (error) {
        console.warn('Не удалось загрузить категории:', error);
    }
    
    console.log('Начинаем создание строк таблицы для товаров');
    
    // Создаем строку для каждого товара
    items.forEach(item => {
        console.log('Обработка товара:', item);
        
        const row = document.createElement('tr');
        
        // Колонка с чекбоксом
        const checkboxCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.id = item.id;
        checkboxCell.appendChild(checkbox);
        row.appendChild(checkboxCell);
        
        // ID товара
        const idCell = document.createElement('td');
        idCell.textContent = item.code || `#${item.id}`;
        row.appendChild(idCell);
        
        // Изображение товара
        const imageCell = document.createElement('td');
        const image = document.createElement('div');
        image.className = 'product-image';
        image.style.backgroundImage = item.image_url 
            ? `url(${item.image_url})` 
            : 'url(/img/no-image.png)';
        imageCell.appendChild(image);
        row.appendChild(imageCell);
        
        // Название товара
        const nameCell = document.createElement('td');
        nameCell.className = 'product-name-cell';
        const nameLink = document.createElement('a');
        nameLink.href = `#`;
        nameLink.className = 'product-name';
        nameLink.textContent = item.name;
        const description = document.createElement('div');
        description.className = 'product-description';
        description.textContent = item.description || 'Нет описания';
        nameCell.appendChild(nameLink);
        nameCell.appendChild(description);
        row.appendChild(nameCell);
        
        // Категория товара
        const categoryCell = document.createElement('td');
        const category = categories.find(c => c.id === item.category_id);
        categoryCell.textContent = category ? category.name : 'Нет категории';
        row.appendChild(categoryCell);
        
        // Количество на складе
        const stockCell = document.createElement('td');
        stockCell.className = 'stock-cell';
        
        // Проверяем, существует ли window.inventoryUtils и его метод formatNumber
        let formattedQuantity = '';
        if (window.inventoryUtils && typeof window.inventoryUtils.formatNumber === 'function') {
            formattedQuantity = window.inventoryUtils.formatNumber(item.current_quantity);
        } else {
            console.warn('window.inventoryUtils.formatNumber не найден, использую стандартное форматирование');
            formattedQuantity = item.current_quantity ? item.current_quantity.toString() : '0';
        }
        
        stockCell.innerHTML = `<span class="stock-value">${formattedQuantity}</span>`;
        if (item.min_quantity && item.current_quantity < item.min_quantity) {
            stockCell.classList.add('low-stock');
        }
        row.appendChild(stockCell);
        
        // Цена
        const priceCell = document.createElement('td');
        
        // Проверяем, существует ли window.inventoryUtils и его метод formatCurrency
        let formattedPrice = '';
        if (window.inventoryUtils && typeof window.inventoryUtils.formatCurrency === 'function') {
            formattedPrice = window.inventoryUtils.formatCurrency(item.unit_price, item.currency);
        } else {
            console.warn('window.inventoryUtils.formatCurrency не найден, использую стандартное форматирование');
            formattedPrice = item.unit_price ? item.unit_price.toString() + ' ' + (item.currency || '') : '0';
        }
        
        priceCell.textContent = formattedPrice;
        row.appendChild(priceCell);
        
        // Статус
        const statusCell = document.createElement('td');
        const statusBadge = document.createElement('span');
        
        // Получаем текст статуса
        let statusText = '';
        if (window.inventoryUtils && typeof window.inventoryUtils.getItemStatusText === 'function') {
            statusText = window.inventoryUtils.getItemStatusText(item.status);
        } else {
            console.warn('window.inventoryUtils.getItemStatusText не найден, использую статус как есть');
            statusText = item.status || 'Неизвестно';
        }
        
        statusBadge.className = `status-badge status-${item.status}`;
        statusBadge.textContent = statusText;
        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);
        
        // Действия
        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions-cell';
        
        // Кнопка редактирования
        const editButton = document.createElement('button');
        editButton.className = 'action-icon edit';
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.title = 'Редактировать';
        editButton.addEventListener('click', () => editInventoryItem(item.id));
        actionsCell.appendChild(editButton);
        
        // Кнопка просмотра
        const viewButton = document.createElement('button');
        viewButton.className = 'action-icon view';
        viewButton.innerHTML = '<i class="fas fa-eye"></i>';
        viewButton.title = 'Просмотреть детали';
        viewButton.addEventListener('click', () => viewInventoryItem(item.id));
        actionsCell.appendChild(viewButton);
        
        // Кнопка удаления
        const deleteButton = document.createElement('button');
        deleteButton.className = 'action-icon delete';
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.title = 'Удалить';
        deleteButton.addEventListener('click', () => deleteInventoryItem(item.id));
        actionsCell.appendChild(deleteButton);
        
        row.appendChild(actionsCell);
        
        // Добавляем строку в таблицу
        tableBody.appendChild(row);
    });
    
    console.log('Отображение товаров в таблице завершено');
}

// Обновление статистики инвентаря
async function updateInventoryStats() {
    try {
        // Получаем все товары
        const items = await window.inventoryApi.items.getAll();
        console.log('Обновление статистики, всего товаров:', items.length);
        
        // Обновляем статистику по общему количеству товаров
        const totalProductsElement = document.querySelector('.stat-card:nth-child(1) .stat-number');
        if (totalProductsElement) {
            totalProductsElement.textContent = items.length;
            console.log('Обновлена статистика общего количества товаров:', items.length);
        } else {
            console.warn('Не найден элемент для отображения общего количества товаров');
        }
        
        // Обновляем статистику по товарам с низким остатком
        const lowStockItems = items.filter(item => 
            item.min_quantity && item.current_quantity < item.min_quantity
        );
        const lowStockElement = document.querySelector('.stat-card:nth-child(2) .stat-number');
        if (lowStockElement) {
            lowStockElement.textContent = lowStockItems.length;
            console.log('Обновлена статистика товаров с низким остатком:', lowStockItems.length);
        } else {
            console.warn('Не найден элемент для отображения товаров с низким остатком');
        }
        
        // Другие статистики можно добавить по аналогии
    } catch (error) {
        console.error('Ошибка при обновлении статистики:', error);
    }
}

// Применение фильтров
function applyFilters() {
    const searchTerm = document.querySelector('.filter-search input').value;
    const categoryId = document.querySelector('.filter-category').value;
    const supplierId = document.querySelector('.filter-supplier').value;
    const status = document.querySelector('select.filter-control:not(.filter-category):not(.filter-supplier):not(.filter-location):not(.filter-uom)').value;
    
    // Дополнительные advanced фильтры
    const expiryDate = document.querySelector('.advanced-filters input[type="date"]')?.value;
    const minPrice = document.querySelector('.advanced-filters input[data-filter="min-price"]')?.value;
    const maxPrice = document.querySelector('.advanced-filters input[data-filter="max-price"]')?.value;
    const locationId = document.querySelector('.filter-location')?.value;
    const batchNumber = document.querySelector('.advanced-filters input[type="text"]')?.value;
    const uomId = document.querySelector('.filter-uom')?.value;
    
    console.log('Применение фильтров:', { 
        searchTerm, categoryId, supplierId, status, 
        expiryDate, minPrice, maxPrice, locationId, batchNumber, uomId 
    });
    
    // В реальном приложении здесь будет запрос к API с фильтрами
    // Для упрощения просто перезагружаем все товары и фильтруем на клиенте
    window.inventoryApi.items.getAll()
        .then(items => {
            console.log('Загружено товаров для фильтрации:', items.length);
            
            // Фильтрация по поисковому запросу
            let filteredItems = items;
            if (searchTerm) {
                filteredItems = filteredItems.filter(item => 
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
                );
                console.log('После фильтрации по поисковому запросу:', filteredItems.length);
            }
            
            // Фильтрация по категории
            if (categoryId) {
                filteredItems = filteredItems.filter(item => item.category_id == categoryId);
                console.log('После фильтрации по категории:', filteredItems.length);
            }
            
            // Фильтрация по поставщику
            if (supplierId) {
                filteredItems = filteredItems.filter(item => item.supplier_id == supplierId);
                console.log('После фильтрации по поставщику:', filteredItems.length);
            }
            
            // Фильтрация по статусу
            if (status) {
                // Проверяем по разным паттернам статуса
                if (status === 'in-stock') {
                    filteredItems = filteredItems.filter(item => item.status === 'active');
                } else if (status === 'low-stock') {
                    filteredItems = filteredItems.filter(item => 
                        item.min_quantity && item.current_quantity < item.min_quantity
                    );
                } else if (status === 'out-of-stock') {
                    filteredItems = filteredItems.filter(item => item.current_quantity <= 0);
                } else {
                    filteredItems = filteredItems.filter(item => item.status === status);
                }
                console.log('После фильтрации по статусу:', filteredItems.length);
            }
            
            // Фильтрация по дополнительным критериям из Advanced Filters
            
            // Фильтрация по дате истечения срока
            if (expiryDate) {
                const filterDate = new Date(expiryDate);
                filteredItems = filteredItems.filter(item => {
                    if (!item.expiry_date) return false;
                    const itemDate = new Date(item.expiry_date);
                    return itemDate <= filterDate;
                });
                console.log('После фильтрации по дате истечения срока:', filteredItems.length);
            }
            
            // Фильтрация по диапазону цен
            if (minPrice) {
                filteredItems = filteredItems.filter(item => item.unit_price >= parseFloat(minPrice));
                console.log('После фильтрации по минимальной цене:', filteredItems.length);
            }
            
            if (maxPrice) {
                filteredItems = filteredItems.filter(item => item.unit_price <= parseFloat(maxPrice));
                console.log('После фильтрации по максимальной цене:', filteredItems.length);
            }
            
            // Фильтрация по локации (через stock)
            if (locationId) {
                // Метод фильтрации по локации зависит от структуры данных
                // Предполагается, что у товара есть поле location_id или similar
                filteredItems = filteredItems.filter(item => item.location_id == locationId);
                console.log('После фильтрации по локации:', filteredItems.length);
            }
            
            // Фильтрация по номеру партии
            if (batchNumber) {
                filteredItems = filteredItems.filter(item => 
                    item.batch_number && item.batch_number.toLowerCase().includes(batchNumber.toLowerCase())
                );
                console.log('После фильтрации по номеру партии:', filteredItems.length);
            }
            
            // Фильтрация по единице измерения
            if (uomId) {
                filteredItems = filteredItems.filter(item => item.uom_id == uomId);
                console.log('После фильтрации по единице измерения:', filteredItems.length);
            }
            
            // Отображаем отфильтрованные товары
            displayInventoryItems(filteredItems);
            
            // Обновляем счетчик отфильтрованных товаров, если есть
            const filteredCounter = document.querySelector('.filtered-counter');
            if (filteredCounter) {
                filteredCounter.textContent = `Показано ${filteredItems.length} из ${items.length} товаров`;
            }
        })
        .catch(error => {
            console.error('Ошибка при применении фильтров:', error);
            showNotification('Не удалось применить фильтры', 'error');
        });
}

// Сброс фильтров
function resetFilters() {
    console.log('Сброс фильтров');
    
    // Сбрасываем все поля фильтров
    const searchInput = document.querySelector('.filter-search input');
    if (searchInput) searchInput.value = '';
    
    const categorySelect = document.querySelector('.filter-category');
    if (categorySelect) categorySelect.selectedIndex = 0;
    
    const supplierSelect = document.querySelector('.filter-supplier');
    if (supplierSelect) supplierSelect.selectedIndex = 0;
    
    const statusSelect = document.querySelector('select.filter-control:not(.filter-category):not(.filter-supplier):not(.filter-location):not(.filter-uom)');
    if (statusSelect) statusSelect.selectedIndex = 0;
    
    // Перезагружаем товары
    loadInventoryItems();
}

// Функции для работы с отдельными товарами

/**
 * Редактирование товара
 * @param {number} id - ID товара
 */
async function editInventoryItem(id) {
    console.log(`Редактирование товара с ID: ${id}`);
    
    try {
        // Получаем данные о товаре
        const response = await fetch(`/api/inventory/items/${id}`);
        if (!response.ok) {
            throw new Error(`Ошибка при получении данных о товаре: ${response.status}`);
        }
        
        const product = await response.json();
        console.log('Данные товара для редактирования:', product);
        
        // Заполняем форму данными о товаре
        const form = document.getElementById('add-product-form');
        if (!form) {
            throw new Error('Форма редактирования не найдена');
        }
        
        // Заполняем скрытое поле ID
        form.querySelector('input[name="id"]').value = product.id;
        
        // Заголовок модального окна
        const modalTitle = document.querySelector('#add-product-modal .modal-title');
        if (modalTitle) {
            modalTitle.textContent = 'Редактировать товар';
        }
        
        // Загружаем справочники
        await loadFormReferenceData();
        
        // Заполняем поля формы
        form.querySelector('#product-code').value = product.code || '';
        form.querySelector('#product-name').value = product.name || '';
        form.querySelector('#product-description').value = product.description || '';
        form.querySelector('#product-min-quantity').value = product.min_quantity || '';
        form.querySelector('#product-unit-price').value = product.unit_price || '';
        form.querySelector('#product-image').value = product.image_url || '';
        
        // Выбираем значения в выпадающих списках
        selectOption('#product-category', product.category_id);
        selectOption('#product-uom', product.uom_id);
        selectOption('#product-currency', product.currency);
        selectOption('#product-supplier', product.supplier_id);
        selectOption('#product-status', product.status);
        
        // Показываем модальное окно
        const modal = document.getElementById('add-product-modal');
        if (modal) {
            modal.style.display = 'block';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        }
    } catch (error) {
        console.error('Ошибка при редактировании товара:', error);
        showNotification(`Ошибка при редактировании товара: ${error.message}`, 'error');
    }
}

/**
 * Просмотр деталей товара
 * @param {number} id - ID товара
 */
async function viewInventoryItem(id) {
    console.log(`Просмотр товара с ID: ${id}`);
    
    try {
        // Получаем данные о товаре
        const response = await fetch(`/api/inventory/items/${id}`);
        if (!response.ok) {
            throw new Error(`Ошибка при получении данных о товаре: ${response.status}`);
        }
        
        const product = await response.json();
        console.log('Данные товара для просмотра:', product);
        
        // Получаем данные о запасах товара по локациям
        const stockResponse = await fetch(`/api/inventory/stock/${id}`);
        if (!stockResponse.ok) {
            throw new Error(`Ошибка при получении данных о запасах: ${stockResponse.status}`);
        }
        
        const stockData = await stockResponse.json();
        console.log('Данные о запасах товара:', stockData);
        
        // Заполняем данные в модальном окне
        const modal = document.getElementById('view-product-modal');
        if (!modal) {
            throw new Error('Модальное окно просмотра не найдено');
        }
        
        // Заполняем основные данные о товаре
        modal.querySelector('.product-title').textContent = product.name || 'Без названия';
        modal.querySelector('.product-code').textContent = `Код: ${product.code || '-'}`;
        modal.querySelector('.product-description').textContent = product.description || 'Описание отсутствует';
        
        // Заполняем детальные данные
        modal.querySelector('.data-value.category').textContent = product.category_name || '-';
        modal.querySelector('.data-value.uom').textContent = product.uom_name || '-';
        modal.querySelector('.data-value.current-quantity').textContent = formatQuantity(product.total_quantity || 0, product.uom_name);
        modal.querySelector('.data-value.min-quantity').textContent = formatQuantity(product.min_quantity || 0, product.uom_name);
        modal.querySelector('.data-value.price').textContent = formatPrice(product.unit_price || 0, product.currency);
        modal.querySelector('.data-value.supplier').textContent = product.supplier_name || '-';
        
        // Обработка статуса
        const statusElement = modal.querySelector('.data-value.status');
        statusElement.textContent = formatStatus(product.status);
        statusElement.className = `data-value status status-${product.status || 'unknown'}`;
        
        // Устанавливаем изображение товара
        const imageContainer = modal.querySelector('.product-image-large');
        if (imageContainer) {
            if (product.image_url) {
                imageContainer.style.backgroundImage = `url(${product.image_url})`;
            } else {
                imageContainer.style.backgroundImage = 'url(/img/no-image.png)';
            }
        }
        
        // Заполняем таблицу запасов
        const stockTableBody = modal.querySelector('.stock-data');
        if (stockTableBody) {
            stockTableBody.innerHTML = '';
            
            if (stockData && stockData.length > 0) {
                stockData.forEach(stock => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${stock.location_name || '-'}</td>
                        <td>${formatQuantity(stock.quantity || 0, product.uom_name)}</td>
                        <td>${formatQuantity(stock.reserved || 0, product.uom_name)}</td>
                        <td>${formatQuantity((stock.quantity - stock.reserved) || 0, product.uom_name)}</td>
                    `;
                    stockTableBody.appendChild(row);
                });
            } else {
                const row = document.createElement('tr');
                row.innerHTML = '<td colspan="4" class="text-center">Нет данных о запасах</td>';
                stockTableBody.appendChild(row);
            }
        }
        
        // Настраиваем кнопки
        const editButton = modal.querySelector('.modal-button.edit');
        if (editButton) {
            editButton.onclick = function() {
                closeModal();
                setTimeout(() => {
                    editInventoryItem(id);
                }, 300);
            };
        }
        
        const closeButton = modal.querySelector('.modal-button.close');
        if (closeButton) {
            closeButton.onclick = closeModal;
        }
        
        // Показываем модальное окно
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    } catch (error) {
        console.error('Ошибка при просмотре товара:', error);
        showNotification(`Ошибка при просмотре товара: ${error.message}`, 'error');
    }
}

/**
 * Удаление товара
 * @param {number} id - ID товара
 */
async function deleteInventoryItem(id) {
    console.log(`Подготовка к удалению товара с ID: ${id}`);
    
    try {
        // Получаем данные о товаре для отображения в подтверждении
        const response = await fetch(`/api/inventory/items/${id}`);
        if (!response.ok) {
            throw new Error(`Ошибка при получении данных о товаре: ${response.status}`);
        }
        
        const product = await response.json();
        console.log('Данные товара для удаления:', product);
        
        // Заполняем данные в модальном окне подтверждения
        const modal = document.getElementById('confirm-delete-modal');
        if (!modal) {
            throw new Error('Модальное окно подтверждения не найдено');
        }
        
        modal.querySelector('.product-name').textContent = product.name || 'Без названия';
        modal.querySelector('.product-code').textContent = `Код: ${product.code || '-'}`;
        modal.querySelector('.product-quantity').textContent = `Общее количество: ${formatQuantity(product.total_quantity || 0, product.uom_name)}`;
        
        // Настраиваем кнопку удаления
        const deleteButton = modal.querySelector('.modal-button.delete');
        if (deleteButton) {
            // Удаляем старые обработчики
            const newDeleteButton = deleteButton.cloneNode(true);
            deleteButton.parentNode.replaceChild(newDeleteButton, deleteButton);
            
            // Добавляем новый обработчик
            newDeleteButton.addEventListener('click', async function() {
                try {
                    const deleteResponse = await fetch(`/api/inventory/items/${id}`, {
                        method: 'DELETE'
                    });
                    
                    if (!deleteResponse.ok) {
                        throw new Error(`Ошибка при удалении товара: ${deleteResponse.status}`);
                    }
                    
                    closeModal();
                    showNotification('Товар успешно удален', 'success');
                    
                    // Обновляем таблицу товаров
                    await loadInventoryItems();
                } catch (error) {
                    console.error('Ошибка при удалении товара:', error);
                    showNotification(`Ошибка при удалении товара: ${error.message}`, 'error');
                }
            });
        }
        
        // Настраиваем кнопку отмены
        const cancelButton = modal.querySelector('.modal-button.cancel');
        if (cancelButton) {
            cancelButton.onclick = closeModal;
        }
        
        // Показываем модальное окно
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    } catch (error) {
        console.error('Ошибка при подготовке к удалению товара:', error);
        showNotification(`Ошибка: ${error.message}`, 'error');
    }
}

/**
 * Форматирование количества с единицей измерения
 * @param {number} quantity - Количество
 * @param {string} uom - Единица измерения
 * @returns {string} Отформатированное количество
 */
function formatQuantity(quantity, uom) {
    // Форматируем число до 2 знаков после запятой, если нужно
    const formattedQuantity = Number.isInteger(quantity) 
        ? quantity.toString() 
        : quantity.toFixed(2).replace(/\.?0+$/, '');
    
    return `${formattedQuantity} ${uom || ''}`.trim();
}

/**
 * Форматирование цены с валютой
 * @param {number} price - Цена
 * @param {string} currency - Валюта
 * @returns {string} Отформатированная цена
 */
function formatPrice(price, currency) {
    // Форматируем число до 2 знаков после запятой
    const formattedPrice = price.toFixed(2);
    
    // Добавляем символ валюты в зависимости от типа
    switch (currency) {
        case 'USD': return `$${formattedPrice}`;
        case 'EUR': return `€${formattedPrice}`;
        case 'GBP': return `£${formattedPrice}`;
        case 'RUB': return `₽${formattedPrice}`;
        default: return `${formattedPrice} ${currency || ''}`.trim();
    }
}

/**
 * Форматирование статуса товара
 * @param {string} status - Код статуса
 * @returns {string} Текстовое представление статуса
 */
function formatStatus(status) {
    switch (status) {
        case 'active': return 'В наличии';
        case 'reserved': return 'Зарезервировано';
        case 'in_transit': return 'В пути';
        case 'damaged': return 'Повреждено';
        case 'expired': return 'Истёк срок';
        case 'scrapped': return 'Списано';
        default: return 'Неизвестно';
    }
}

/**
 * Выбор опции в выпадающем списке
 * @param {string} selectSelector - Селектор выпадающего списка
 * @param {string|number} value - Значение для выбора
 */
function selectOption(selectSelector, value) {
    const select = document.querySelector(selectSelector);
    if (!select) return;
    
    // Если значение null или undefined, выбираем первую опцию
    if (value === null || value === undefined) {
        select.selectedIndex = 0;
        return;
    }
    
    // Ищем опцию с нужным значением
    const option = select.querySelector(`option[value="${value}"]`);
    if (option) {
        option.selected = true;
    } else {
        console.warn(`Опция со значением ${value} не найдена в списке ${selectSelector}`);
        select.selectedIndex = 0;
    }
}

// Отображение уведомления
function showNotification(message, type = 'info') {
    console.log(`Уведомление (${type}): ${message}`);
    
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

// Экспортируем функцию инициализации для использования в других файлах
window.initInventoryPage = initInventoryPage; 