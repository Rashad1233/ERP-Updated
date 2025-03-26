// API для работы с движениями запасов
// Используем существующую переменную API_BASE_URL из inventory-common.js
// const API_BASE_URL = '/api';

// Мок-данные для демонстрации при отсутствии API
const mockItems = [
    { id: 1, name: 'Товар 1', code: 'T001' },
    { id: 2, name: 'Товар 2', code: 'T002' },
    { id: 3, name: 'Товар 3', code: 'T003' },
    { id: 4, name: 'Товар 4', code: 'T004' },
    { id: 5, name: 'Товар 5', code: 'T005' }
];

const mockLocations = [
    { id: 1, name: 'Склад А' },
    { id: 2, name: 'Склад Б' },
    { id: 3, name: 'Производство' },
    { id: 4, name: 'Торговый зал' }
];

const mockMovements = [
    { 
        id: 1, 
        transaction_type: 'receipt', 
        transaction_date: '2023-07-10T12:00:00', 
        item_id: 1, 
        item_name: 'Товар 1', 
        item_code: 'T001',
        quantity: 10, 
        uom_code: 'шт', 
        from_location_id: null, 
        from_location_name: null,
        to_location_id: 1, 
        to_location_name: 'Склад А',
        document_reference: 'ПРИХ-001',
        unit_price: 100,
        total_price: 1000
    },
    { 
        id: 2, 
        transaction_type: 'issue', 
        transaction_date: '2023-07-11T14:30:00', 
        item_id: 2, 
        item_name: 'Товар 2',
        item_code: 'T002', 
        quantity: 5, 
        uom_code: 'шт', 
        from_location_id: 1, 
        from_location_name: 'Склад А',
        to_location_id: null, 
        to_location_name: null,
        document_reference: 'РАС-001',
        unit_price: 150,
        total_price: 750
    },
    { 
        id: 3, 
        transaction_type: 'transfer', 
        transaction_date: '2023-07-12T10:15:00', 
        item_id: 1, 
        item_name: 'Товар 1',
        item_code: 'T001', 
        quantity: 3, 
        uom_code: 'шт', 
        from_location_id: 1, 
        from_location_name: 'Склад А',
        to_location_id: 2, 
        to_location_name: 'Склад Б',
        document_reference: 'ПЕРЕМ-001',
        unit_price: 100,
        total_price: 300
    }
];

// Заглушки для API-функций, если оригинальные функции недоступны
// Определяем локальные функции для получения данных с фолбэком на мок-данные
// Эти функции используют глобальные API, если они есть, или мок-данные, если API нет
const getItems = async function() {
    console.log('Вызов функции getItems');
    try {
        // Проверяем, существует ли глобальный API для товаров
        if (window.inventoryItemsApi && typeof window.inventoryItemsApi.getAll === 'function') {
            return await window.inventoryItemsApi.getAll();
        } else {
            console.warn('Глобальный API для товаров не найден, используем мок-данные');
            // Имитируем задержку сети
            await new Promise(resolve => setTimeout(resolve, 300));
            return mockItems;
        }
    } catch (error) {
        console.error('Ошибка при получении товаров:', error);
        // Возвращаем мок-данные в случае ошибки
        return mockItems;
    }
};

const getLocations = async function() {
    console.log('Вызов функции getLocations');
    try {
        // Проверяем, существует ли глобальный API для локаций
        if (window.inventoryLocationsApi && typeof window.inventoryLocationsApi.getAll === 'function') {
            return await window.inventoryLocationsApi.getAll();
        } else {
            console.warn('Глобальный API для локаций не найден, используем мок-данные');
            // Имитируем задержку сети
            await new Promise(resolve => setTimeout(resolve, 300));
            return mockLocations;
        }
    } catch (error) {
        console.error('Ошибка при получении локаций:', error);
        // Возвращаем мок-данные в случае ошибки
        return mockLocations;
    }
};

const getMovements = async function(filters = {}) {
    console.log('Вызов функции getMovements с фильтрами:', filters);
    try {
        // Проверяем, существует ли глобальный API для движений
        if (window.inventoryMovementsApi && typeof window.inventoryMovementsApi.getAll === 'function') {
            return await window.inventoryMovementsApi.getAll(filters);
        } else {
            console.warn('Глобальный API для движений не найден, используем мок-данные');
            // Имитируем задержку сети
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Фильтруем мок-данные
            let filteredMovements = [...mockMovements];
            
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                filteredMovements = filteredMovements.filter(m => 
                    (m.item_name && m.item_name.toLowerCase().includes(searchLower)) ||
                    (m.item_code && m.item_code.toLowerCase().includes(searchLower)) ||
                    (m.document_reference && m.document_reference.toLowerCase().includes(searchLower))
                );
            }
            
            if (filters.type) {
                filteredMovements = filteredMovements.filter(m => m.transaction_type === filters.type);
            }
            
            // Простая фильтрация по датам
            if (filters.startDate) {
                filteredMovements = filteredMovements.filter(m => m.transaction_date >= filters.startDate);
            }
            
            if (filters.endDate) {
                filteredMovements = filteredMovements.filter(m => m.transaction_date <= filters.endDate);
            }
            
            if (filters.productId) {
                filteredMovements = filteredMovements.filter(m => m.item_id === parseInt(filters.productId));
            }
            
            if (filters.locationId) {
                filteredMovements = filteredMovements.filter(m => 
                    m.from_location_id === parseInt(filters.locationId) || 
                    m.to_location_id === parseInt(filters.locationId)
                );
            }
            
            if (filters.documentRef) {
                filteredMovements = filteredMovements.filter(m => 
                    m.document_reference && m.document_reference.includes(filters.documentRef)
                );
            }
            
            return filteredMovements;
        }
    } catch (error) {
        console.error('Ошибка при получении движений:', error);
        // Возвращаем мок-данные в случае ошибки
        return mockMovements;
    }
};

// Создание нового движения запасов
const createMovement = async function(movementData) {
    console.log('Создание нового движения:', movementData);
    try {
        // Проверяем, существует ли глобальный API для создания движений
        if (window.inventoryMovementsApi && typeof window.inventoryMovementsApi.create === 'function') {
            return await window.inventoryMovementsApi.create(movementData);
        } else {
            console.warn('Глобальный API для создания движений не найден, используем мок-данные');
            
            // Имитируем задержку сети
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Создаем новое движение с правдоподобными данными
            const newId = mockMovements.length > 0 ? Math.max(...mockMovements.map(m => m.id)) + 1 : 1;
            const newMovement = {
                id: newId,
                ...movementData,
                transaction_date: movementData.transaction_date || new Date().toISOString(),
                item_name: mockItems.find(item => item.id === parseInt(movementData.item_id))?.name || 'Неизвестный товар',
                item_code: mockItems.find(item => item.id === parseInt(movementData.item_id))?.code || 'XXX',
                from_location_name: movementData.from_location_id ? 
                    mockLocations.find(loc => loc.id === parseInt(movementData.from_location_id))?.name || 'Неизвестная локация' : null,
                to_location_name: movementData.to_location_id ? 
                    mockLocations.find(loc => loc.id === parseInt(movementData.to_location_id))?.name || 'Неизвестная локация' : null,
                total_price: movementData.unit_price ? 
                    parseFloat(movementData.unit_price) * parseFloat(movementData.quantity) : null
            };
            
            // Добавляем в массив мок-данных
            mockMovements.push(newMovement);
            
            return newMovement;
        }
    } catch (error) {
        console.error('Ошибка при создании движения:', error);
        throw error;
    }
};

// Инициализация страницы движений запасов
async function initMovementsPage() {
    try {
        console.log('Инициализация страницы движений запасов...');
        
        // Устанавливаем текущую дату и время во всех полях datetime-local
        setCurrentDateTimeInFields();
        
        // Инициализируем фильтры
        await initFilters();
        
        // Загружаем данные
        await loadMovements();
        
        // Настраиваем обработчики событий
        setupEventHandlers();
        
        console.log('Страница движений запасов успешно инициализирована');
    } catch (error) {
        console.error('Ошибка при инициализации страницы движений запасов:', error);
        showNotification('Произошла ошибка при загрузке страницы', 'error');
    }
}

// Инициализация фильтров
async function initFilters() {
    try {
        console.log('Загрузка данных для фильтров');
        
        // Загружаем товары для фильтра
        const items = await getItems();
        const productFilter = document.querySelector('.advanced-filters select:nth-child(1)');
        if (productFilter && items) {
            // Сохраняем текущее значение
            const currentValue = productFilter.value;
            
            // Сбрасываем опции, оставляя только первую
            while (productFilter.options.length > 1) {
                productFilter.remove(1);
            }
            
            // Добавляем новые опции
            items.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.name;
                productFilter.appendChild(option);
            });
            
            // Восстанавливаем предыдущее значение, если оно было
            if (currentValue) {
                productFilter.value = currentValue;
            }
        }
        
        // Загружаем локации для фильтра
        const locations = await getLocations();
        const locationFilter = document.querySelector('.advanced-filters select:nth-child(2)');
        if (locationFilter && locations) {
            // Сохраняем текущее значение
            const currentValue = locationFilter.value;
            
            // Сбрасываем опции, оставляя только первую
            while (locationFilter.options.length > 1) {
                locationFilter.remove(1);
            }
            
            // Добавляем новые опции
            locations.forEach(location => {
                const option = document.createElement('option');
                option.value = location.id;
                option.textContent = location.name;
                locationFilter.appendChild(option);
            });
            
            // Восстанавливаем предыдущее значение, если оно было
            if (currentValue) {
                locationFilter.value = currentValue;
            }
        }
        
        console.log('Данные для фильтров загружены');
    } catch (error) {
        console.error('Ошибка при загрузке данных для фильтров:', error);
        throw error;
    }
}

// Настройка обработчиков событий
function setupEventHandlers() {
    try {
        console.log('Настройка обработчиков событий...');
        
        // Обработчик для поиска при вводе
        const searchInput = document.querySelector('.filter-search input');
        if (searchInput) {
            // Удаляем предыдущие обработчики, если они были
            const newSearchInput = searchInput.cloneNode(true);
            searchInput.parentNode.replaceChild(newSearchInput, searchInput);
            
            // Добавляем обработчик с дебаунсом
            let searchTimeout;
            newSearchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    applyFilters();
                }, 500);
            });
        }
        
        // Обработчики для выпадающих списков фильтров
        document.querySelectorAll('.filter-panel select').forEach(select => {
            // Удаляем предыдущие обработчики, если они были
            const newSelect = select.cloneNode(true);
            select.parentNode.replaceChild(newSelect, select);
            
            // Добавляем обработчик изменения
            newSelect.addEventListener('change', applyFilters);
        });
        
        // Обработчик для дат в фильтрах
        document.querySelectorAll('.filter-panel input[type="date"]').forEach(dateInput => {
            // Удаляем предыдущие обработчики, если они были
            const newDateInput = dateInput.cloneNode(true);
            dateInput.parentNode.replaceChild(newDateInput, dateInput);
            
            // Добавляем обработчик изменения
            newDateInput.addEventListener('change', applyFilters);
        });
        
        // Обработчик для кнопки расширенных фильтров
        const advancedFilterToggle = document.querySelector('.advanced-filter-toggle');
        if (advancedFilterToggle) {
            // Удаляем предыдущие обработчики, если они были
            const newToggle = advancedFilterToggle.cloneNode(true);
            advancedFilterToggle.parentNode.replaceChild(newToggle, advancedFilterToggle);
            
            // Добавляем обработчик клика
            newToggle.addEventListener('click', function() {
                this.classList.toggle('open');
                const advancedFilters = document.querySelector('.advanced-filters');
                if (advancedFilters) {
                    advancedFilters.classList.toggle('show');
                }
            });
        }
        
        // Обработчики для кнопок в расширенных фильтрах
        const applyFilterBtn = document.querySelector('.advanced-filters .filter-button.primary');
        if (applyFilterBtn) {
            // Удаляем предыдущие обработчики, если они были
            const newApplyBtn = applyFilterBtn.cloneNode(true);
            applyFilterBtn.parentNode.replaceChild(newApplyBtn, applyFilterBtn);
            
            // Добавляем обработчик клика
            newApplyBtn.addEventListener('click', applyFilters);
        }
        
        const resetFilterBtn = document.querySelector('.advanced-filters .filter-button.secondary');
        if (resetFilterBtn) {
            // Удаляем предыдущие обработчики, если они были
            const newResetBtn = resetFilterBtn.cloneNode(true);
            resetFilterBtn.parentNode.replaceChild(newResetBtn, resetFilterBtn);
            
            // Добавляем обработчик клика
            newResetBtn.addEventListener('click', resetFilters);
        }
        
        // Обработчики для кнопок действий в таблице
        document.querySelectorAll('.data-table .action-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const row = this.closest('tr');
                if (!row) return;
                
                if (this.classList.contains('view-btn')) {
                    // Просмотр движения - показываем все детали
                    alert('Просмотр движения: функция в разработке');
                } else if (this.classList.contains('edit-btn')) {
                    // Редактирование движения - открываем форму
                    alert('Редактирование движения: функция в разработке');
                } else if (this.classList.contains('pdf-btn')) {
                    // Скачать PDF-документ движения
                    alert('Скачать PDF: функция в разработке');
                }
            });
        });
        
        console.log('Обработчики событий успешно настроены');
    } catch (error) {
        console.error('Ошибка при настройке обработчиков событий:', error);
        throw error;
    }
}

// Загрузка движений запасов
async function loadMovements(filters = {}) {
    try {
        console.log('Загрузка движений запасов', filters);
        
        // Используем getMovements для получения данных
        let movements = [];
        try {
            movements = await getMovements(filters);
            console.log(`Получено ${movements.length} записей о движениях запасов`);
        } catch (apiError) {
            console.error('Ошибка API при загрузке движений:', apiError);
            
            // Если API недоступен, используем мок-данные
            console.warn('Используем мок-данные для демонстрации');
            movements = mockMovements;
            
            // Применяем фильтры к мок-данным
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                movements = movements.filter(m => 
                    (m.item_name && m.item_name.toLowerCase().includes(searchLower)) ||
                    (m.item_code && m.item_code.toLowerCase().includes(searchLower)) ||
                    (m.document_reference && m.document_reference.toLowerCase().includes(searchLower))
                );
            }
            
            if (filters.type) {
                movements = movements.filter(m => m.transaction_type === filters.type);
            }
            
            // Простая фильтрация по датам (в реальности нужно сравнивать даты правильно)
            if (filters.startDate) {
                movements = movements.filter(m => m.transaction_date >= filters.startDate);
            }
            
            if (filters.endDate) {
                movements = movements.filter(m => m.transaction_date <= filters.endDate);
            }
            
            if (filters.productId) {
                movements = movements.filter(m => m.item_id === parseInt(filters.productId));
            }
            
            if (filters.locationId) {
                movements = movements.filter(m => 
                    m.from_location_id === parseInt(filters.locationId) || 
                    m.to_location_id === parseInt(filters.locationId)
                );
            }
            
            if (filters.documentRef) {
                movements = movements.filter(m => 
                    m.document_reference && m.document_reference.includes(filters.documentRef)
                );
            }
        }
        
        // Отображаем данные в таблице
        displayMovements(movements);
        
        return movements;
    } catch (error) {
        console.error('Ошибка при загрузке движений запасов:', error);
        showNotification('Не удалось загрузить данные о движениях запасов', 'error');
        
        // Отображаем пустую таблицу при ошибке
        displayMovements([]);
        throw error;
    }
}

// Отображение движений в таблице
function displayMovements(movements) {
    const tableBody = document.querySelector('.data-table tbody');
    if (!tableBody) {
        console.error('Таблица движений не найдена');
        return;
    }
    
    // Очищаем таблицу
    tableBody.innerHTML = '';
    
    // Если нет данных, показываем сообщение
    if (movements.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 9; // Количество столбцов в таблице
        cell.textContent = 'Нет данных о движениях запасов';
        cell.style.textAlign = 'center';
        cell.style.padding = '20px';
        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }
    
    // Заполняем таблицу данными
    movements.forEach(movement => {
        const row = document.createElement('tr');
        
        // Проверяем тип движения для стилизации строки
        if (movement.transaction_type === 'write_off') {
            row.classList.add('critical-row');
        }
        
        // Форматирование даты
        const date = new Date(movement.transaction_date);
        const formattedDate = date.toLocaleString();
        
        // Получаем статус движения
        let status = 'Completed'; // По умолчанию
        
        // Определяем класс для типа движения
        let typeClass = 'status-badge ';
        switch (movement.transaction_type) {
            case 'receipt':
                typeClass += 'status-in-stock';
                break;
            case 'issue':
                typeClass += 'status-out-of-stock';
                break;
            case 'transfer':
                typeClass += 'status-incoming';
                break;
            case 'write_off':
                typeClass += 'status-out-of-stock';
                break;
            case 'adjustment':
                typeClass += 'status-low-stock';
                break;
            default:
                typeClass += 'status-in-stock';
        }
        
        // Преобразуем тип транзакции для отображения
        let displayType = movement.transaction_type.charAt(0).toUpperCase() + movement.transaction_type.slice(1);
        displayType = displayType.replace('_', ' ');
        
        // Форматируем количество с единицей измерения
        const formattedQuantity = movement.transaction_type === 'receipt' 
            ? `+${movement.quantity} ${movement.uom_code || 'pcs'}`
            : `-${movement.quantity} ${movement.uom_code || 'pcs'}`;
        
        // Заполняем ячейки таблицы
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${movement.document_reference || `-`}</td>
            <td><span class="${typeClass}">${displayType}</span></td>
            <td>${movement.item_name || 'Неизвестный товар'}</td>
            <td>${formattedQuantity}</td>
            <td>${movement.from_location_name || 'N/A'}</td>
            <td>${movement.to_location_name || 'N/A'}</td>
            <td>${status}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view-btn" data-id="${movement.id}"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit-btn" data-id="${movement.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn pdf-btn" data-id="${movement.id}"><i class="fas fa-file-pdf"></i></button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Добавляем обработчики событий для кнопок действий
    addActionButtonsEventListeners();
}

// Добавление обработчиков событий для кнопок действий
function addActionButtonsEventListeners() {
    // Обработчики для кнопки просмотра
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const movementId = this.getAttribute('data-id');
            viewMovementDetails(movementId);
        });
    });
    
    // Обработчики для кнопки редактирования
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const movementId = this.getAttribute('data-id');
            editMovement(movementId);
        });
    });
    
    // Обработчики для кнопки PDF
    document.querySelectorAll('.pdf-btn').forEach(button => {
        button.addEventListener('click', function() {
            const movementId = this.getAttribute('data-id');
            generateMovementPDF(movementId);
        });
    });
}

// Просмотр детальной информации о движении
async function viewMovementDetails(movementId) {
    try {
        console.log(`Просмотр деталей движения с ID ${movementId}`);
        
        // Получаем данные о движении
        let movement = null;
        
        // Сначала пробуем получить через API
        try {
            const response = await fetch(`${API_BASE_URL}/inventory/movements/${movementId}`);
            if (response.ok) {
                movement = await response.json();
            } else {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
        } catch (apiError) {
            console.warn('Не удалось получить данные через API, используем мок-данные', apiError);
            
            // Если не получилось через API, используем мок-данные
            movement = mockMovements.find(m => m.id === parseInt(movementId));
            
            if (!movement) {
                throw new Error(`Движение с ID ${movementId} не найдено`);
            }
        }
        
        // Отображаем модальное окно с деталями
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Детали движения #${movement.id}</h2>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="detail-row">
                        <div class="detail-label">Тип операции:</div>
                        <div class="detail-value">${movement.transaction_type}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Дата:</div>
                        <div class="detail-value">${new Date(movement.transaction_date).toLocaleString()}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Товар:</div>
                        <div class="detail-value">${movement.item_name} (${movement.item_code})</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Количество:</div>
                        <div class="detail-value">${movement.quantity} ${movement.uom_code || 'pcs'}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Откуда:</div>
                        <div class="detail-value">${movement.from_location_name || 'N/A'}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Куда:</div>
                        <div class="detail-value">${movement.to_location_name || 'N/A'}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Документ:</div>
                        <div class="detail-value">${movement.document_reference || 'N/A'}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Стоимость единицы:</div>
                        <div class="detail-value">${movement.unit_price ? `${movement.unit_price} руб.` : 'N/A'}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Общая стоимость:</div>
                        <div class="detail-value">${movement.total_price ? `${movement.total_price} руб.` : 'N/A'}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Примечания:</div>
                        <div class="detail-value">${movement.notes || 'Нет примечаний'}</div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary" onclick="this.closest('.modal').remove()">Закрыть</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Показываем модальное окно
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Обработчик для закрытия модального окна
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
        
    } catch (error) {
        console.error('Ошибка при получении деталей движения:', error);
        showNotification('Не удалось загрузить детали движения', 'error');
    }
}

// Редактирование движения
function editMovement(movementId) {
    // Здесь будет логика редактирования движения в будущих версиях
    showNotification('Функция редактирования движений будет доступна в следующем обновлении', 'info');
}

// Генерация PDF для движения
function generateMovementPDF(movementId) {
    // Здесь будет логика генерации PDF в будущих версиях
    showNotification('Функция генерации PDF будет доступна в следующем обновлении', 'info');
}

// Обновление статистики движений
async function updateMovementsStats() {
    try {
        // В будущей версии здесь будет реальная статистика с сервера
        // Пока используем тестовые данные
        const statCards = document.querySelectorAll('.stat-card .stat-number');
        if (statCards.length >= 4) {
            // Здесь можно получить реальные данные с сервера
            // и обновить статистику
        }
    } catch (error) {
        console.error('Ошибка при обновлении статистики:', error);
    }
}

// Инициализация графиков
function initCharts() {
    // Здесь уже есть готовая реализация в HTML файле
    console.log('Графики инициализированы');
}

// Применение фильтров
function applyFilters() {
    const searchTerm = document.querySelector('.filter-search input')?.value || '';
    const movementType = document.querySelector('.filter-group:nth-of-type(1) select')?.value || '';
    const startDate = document.querySelector('.filter-group:nth-of-type(2) input:nth-of-type(1)')?.value || '';
    const endDate = document.querySelector('.filter-group:nth-of-type(2) input:nth-of-type(2)')?.value || '';
    const status = document.querySelector('.filter-group:nth-of-type(3) select')?.value || '';
    
    // Расширенные фильтры
    const productId = document.querySelector('.advanced-filters .filter-group:nth-of-type(1) select')?.value || '';
    const locationId = document.querySelector('.advanced-filters .filter-group:nth-of-type(2) select')?.value || '';
    const documentRef = document.querySelector('.advanced-filters .filter-group:nth-of-type(3) input')?.value || '';
    const userId = document.querySelector('.advanced-filters .filter-group:nth-of-type(4) select')?.value || '';
    
    // Создаем объект фильтров
    const filters = {
        search: searchTerm,
        type: movementType,
        startDate: startDate,
        endDate: endDate,
        status: status,
        productId: productId,
        locationId: locationId,
        documentRef: documentRef,
        userId: userId
    };
    
    // Загружаем данные с новыми фильтрами
    loadMovements(filters);
}

// Сброс фильтров
function resetFilters() {
    // Сбрасываем поле поиска
    const searchInput = document.querySelector('.filter-search input');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Сбрасываем селекты
    document.querySelectorAll('select').forEach(select => {
        select.selectedIndex = 0;
    });
    
    // Сбрасываем даты
    document.querySelectorAll('input[type="date"]').forEach(dateInput => {
        dateInput.value = '';
    });
    
    // Сбрасываем текстовые поля в расширенных фильтрах
    document.querySelectorAll('.advanced-filters input[type="text"]').forEach(input => {
        input.value = '';
    });
    
    // Загружаем данные без фильтров
    loadMovements();
}

// Модальные окна для действий

// Открытие модального окна добавления нового движения
async function openAddMovementModal() {
    try {
        console.log('Открытие модального окна добавления движения');
        
        // Очищаем форму
        const form = document.getElementById('add-movement-form');
        if (form) form.reset();
        
        // Загружаем данные для выпадающих списков
        await loadItemsAndLocationsForModal('movement');
        
        // Устанавливаем текущую дату и время
        const dateInput = document.getElementById('movement-date');
        if (dateInput) {
            dateInput.value = formatDateTimeForInput(new Date());
            console.log(`Установлена дата ${dateInput.value} в поле движения`);
        }
        
        // Показываем модальное окно
        showModal('add-movement-modal');
    } catch (error) {
        console.error('Ошибка при открытии модального окна добавления движения:', error);
        showNotification('Не удалось загрузить данные для формы', 'error');
    }
}

// Открытие модального окна перемещения запасов
async function openTransferStockModal() {
    try {
        console.log('Открытие модального окна перемещения запасов');
        
        // Очищаем форму
        const form = document.getElementById('transfer-stock-form');
        if (form) form.reset();
        
        // Загружаем данные для выпадающих списков
        await loadItemsAndLocationsForModal('transfer');
        
        // Устанавливаем текущую дату и время
        const dateInput = document.getElementById('transfer-date');
        if (dateInput) {
            dateInput.value = formatDateTimeForInput(new Date());
            console.log(`Установлена дата ${dateInput.value} в поле перемещения`);
        }
        
        // Показываем модальное окно
        showModal('transfer-stock-modal');
    } catch (error) {
        console.error('Ошибка при открытии модального окна перемещения:', error);
        showNotification('Не удалось загрузить данные для формы', 'error');
    }
}

// Открытие модального окна списания запасов
async function openWriteOffModal() {
    try {
        console.log('Открытие модального окна списания запасов');
        
        // Очищаем форму
        const form = document.getElementById('write-off-form');
        if (form) form.reset();
        
        // Загружаем данные для выпадающих списков
        await loadItemsAndLocationsForModal('write-off');
        
        // Устанавливаем текущую дату и время
        const dateInput = document.getElementById('write-off-date');
        if (dateInput) {
            dateInput.value = formatDateTimeForInput(new Date());
            console.log(`Установлена дата ${dateInput.value} в поле списания`);
        }
        
        // Показываем модальное окно
        showModal('write-off-modal');
    } catch (error) {
        console.error('Ошибка при открытии модального окна списания:', error);
        showNotification('Не удалось загрузить данные для формы', 'error');
    }
}

// Закрытие модального окна
function closeModal(modalId) {
    console.log('Закрытие модального окна:', modalId);
    const modal = document.getElementById(modalId);
    
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    } else {
        console.error('Модальное окно не найдено:', modalId);
    }
}

// Отправка формы добавления движения
async function submitMovementForm() {
    try {
        const type = document.getElementById('movement-type').value;
        const itemId = document.getElementById('movement-item').value;
        const quantity = parseFloat(document.getElementById('movement-quantity').value);
        const fromLocationId = document.getElementById('movement-from-location').value;
        const toLocationId = document.getElementById('movement-to-location').value;
        const date = document.getElementById('movement-date').value;
        const reference = document.getElementById('movement-reference').value;
        const unitPrice = document.getElementById('movement-unit-price').value;
        const notes = document.getElementById('movement-notes').value;
        
        // Проверка обязательных полей
        if (!type || !itemId || !quantity || isNaN(quantity)) {
            showNotification('Пожалуйста, заполните все обязательные поля', 'warning');
            return;
        }
        
        // Проверка полей локаций в зависимости от типа
        if ((type === 'receipt' && !toLocationId) || 
            (type === 'issue' && !fromLocationId) || 
            (type === 'write_off' && !fromLocationId) || 
            (type === 'transfer' && (!fromLocationId || !toLocationId))) {
            showNotification('Необходимо указать локацию', 'warning');
            return;
        }
        
        // Формируем данные для отправки
        const movementData = {
            transaction_type: type,
            item_id: parseInt(itemId),
            quantity: quantity,
            from_location_id: fromLocationId ? parseInt(fromLocationId) : null,
            to_location_id: toLocationId ? parseInt(toLocationId) : null,
            transaction_date: date ? new Date(date).toISOString() : new Date().toISOString(),
            document_reference: reference,
            unit_price: unitPrice ? parseFloat(unitPrice) : null,
            notes: notes
        };
        
        // Создаем новое движение через функцию createMovement
        await createMovement(movementData);
        
        // Закрываем модальное окно и показываем уведомление
        closeModal('add-movement-modal');
        showNotification('Движение успешно создано', 'success');
        
        // Обновляем таблицу движений
        loadMovements();
        
    } catch (error) {
        console.error('Ошибка при создании движения:', error);
        showNotification(error.message, 'error');
    }
}

// Отправка формы перемещения запасов
async function submitTransferForm() {
    try {
        const itemId = document.getElementById('transfer-item').value;
        const fromLocationId = document.getElementById('transfer-from-location').value;
        const toLocationId = document.getElementById('transfer-to-location').value;
        const quantity = parseFloat(document.getElementById('transfer-quantity').value);
        const date = document.getElementById('transfer-date').value;
        const reference = document.getElementById('transfer-reference').value;
        const notes = document.getElementById('transfer-notes').value;
        
        // Проверка обязательных полей
        if (!itemId || !fromLocationId || !toLocationId || !quantity || isNaN(quantity)) {
            showNotification('Пожалуйста, заполните все обязательные поля', 'warning');
            return;
        }
        
        // Проверка одинаковых локаций
        if (fromLocationId === toLocationId) {
            showNotification('Локации источника и назначения не могут быть одинаковыми', 'warning');
            return;
        }
        
        // Формируем данные для отправки
        const movementData = {
            transaction_type: 'transfer',
            item_id: parseInt(itemId),
            from_location_id: parseInt(fromLocationId),
            to_location_id: parseInt(toLocationId),
            quantity: quantity,
            transaction_date: date ? new Date(date).toISOString() : new Date().toISOString(),
            document_reference: reference,
            notes: notes
        };
        
        // Создаем новое движение через функцию createMovement
        await createMovement(movementData);
        
        // Закрываем модальное окно и показываем уведомление
        closeModal('transfer-stock-modal');
        showNotification('Запасы успешно перемещены', 'success');
        
        // Обновляем таблицу движений
        loadMovements();
        
    } catch (error) {
        console.error('Ошибка при перемещении запасов:', error);
        showNotification(error.message, 'error');
    }
}

// Отправка формы списания запасов
async function submitWriteOffForm() {
    try {
        const itemId = document.getElementById('write-off-item').value;
        const locationId = document.getElementById('write-off-location').value;
        const quantity = parseFloat(document.getElementById('write-off-quantity').value);
        const reason = document.getElementById('write-off-reason').value;
        const date = document.getElementById('write-off-date').value;
        const reference = document.getElementById('write-off-reference').value;
        const notes = document.getElementById('write-off-notes').value;
        
        // Проверка обязательных полей
        if (!itemId || !locationId || !quantity || isNaN(quantity) || !reason) {
            showNotification('Пожалуйста, заполните все обязательные поля', 'warning');
            return;
        }
        
        // Формируем данные для отправки
        const movementData = {
            transaction_type: 'write_off',
            item_id: parseInt(itemId),
            from_location_id: parseInt(locationId),
            to_location_id: null,
            quantity: quantity,
            transaction_date: date ? new Date(date).toISOString() : new Date().toISOString(),
            document_reference: reference,
            notes: `Причина: ${reason}${notes ? '. ' + notes : ''}`
        };
        
        // Создаем новое движение через функцию createMovement
        await createMovement(movementData);
        
        // Закрываем модальное окно и показываем уведомление
        closeModal('write-off-modal');
        showNotification('Запасы успешно списаны', 'success');
        
        // Обновляем таблицу движений
        loadMovements();
        
    } catch (error) {
        console.error('Ошибка при списании запасов:', error);
        showNotification(error.message, 'error');
    }
}

// Экспорт движений запасов
function exportMovementsLog() {
    console.log('Экспорт журнала движений (быстрый)');
    
    // В реальном приложении здесь был бы запрос к API для получения файла экспорта
    // с параметрами по умолчанию (все данные, Excel-формат и т.д.)
    
    // Для демонстрации просто показываем уведомление
    showNotification('Журнал движений экспортирован в Excel', 'success');
}

// Отправка формы экспорта данных
async function submitExportForm() {
    try {
        console.log('Отправка формы экспорта данных');
        
        const format = document.getElementById('export-format').value;
        const dateRange = document.getElementById('export-date-range').value;
        const startDate = document.getElementById('export-start-date')?.value;
        const endDate = document.getElementById('export-end-date')?.value;
        
        // Проверка обязательных полей
        if (!format) {
            showNotification('Пожалуйста, выберите формат файла', 'warning');
            return;
        }
        
        // Если выбран пользовательский период, проверяем заполнены ли даты
        if (dateRange === 'custom' && (!startDate || !endDate)) {
            showNotification('Пожалуйста, укажите период для экспорта', 'warning');
            return;
        }
        
        // Определяем, какие данные включать в экспорт
        const includeAll = document.getElementById('export-include-all').checked;
        const includeDates = document.getElementById('export-include-dates').checked;
        const includeProducts = document.getElementById('export-include-products').checked;
        const includeValues = document.getElementById('export-include-values').checked;
        
        // Формируем объект с параметрами запроса
        const exportParams = {
            format: format,
            dateRange: dateRange,
            startDate: startDate,
            endDate: endDate,
            includeAll: includeAll,
            includeDates: includeDates,
            includeProducts: includeProducts,
            includeValues: includeValues
        };
        
        console.log('Параметры экспорта:', exportParams);
        
        // В реальном приложении здесь был бы запрос к API для получения файла экспорта
        // Для демонстрации просто показываем уведомление об успешном экспорте
        
        // Имитируем задержку сети
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Закрываем модальное окно
        closeModal('export-modal');
        
        // Показываем уведомление
        showNotification('Файл успешно экспортирован', 'success');
        
    } catch (error) {
        console.error('Ошибка при экспорте данных:', error);
        showNotification('Ошибка при экспорте данных', 'error');
    }
}

// Открытие модального окна экспорта данных
function openExportModal() {
    try {
        console.log('Открытие модального окна экспорта данных');
        
        // Очищаем форму
        const form = document.getElementById('export-form');
        if (form) form.reset();
        
        // Устанавливаем обработчик изменения периода
        const dateRangeSelect = document.getElementById('export-date-range');
        const customDatesDiv = document.getElementById('export-custom-dates');
        
        if (dateRangeSelect && customDatesDiv) {
            dateRangeSelect.onchange = function() {
                customDatesDiv.style.display = this.value === 'custom' ? 'block' : 'none';
            };
            
            // Устанавливаем начальное состояние
            customDatesDiv.style.display = dateRangeSelect.value === 'custom' ? 'block' : 'none';
        }
        
        // Устанавливаем обработчик для чекбокса "все поля"
        const includeAllCheckbox = document.getElementById('export-include-all');
        const otherCheckboxes = document.querySelectorAll('#export-include-dates, #export-include-products, #export-include-values');
        
        if (includeAllCheckbox && otherCheckboxes.length > 0) {
            includeAllCheckbox.onchange = function() {
                otherCheckboxes.forEach(checkbox => {
                    checkbox.disabled = this.checked;
                    if (this.checked) {
                        checkbox.checked = false;
                    }
                });
            };
            
            // Вызываем событие изменения для установки начального состояния
            includeAllCheckbox.dispatchEvent(new Event('change'));
        }
        
        // Показываем модальное окно
        showModal('export-modal');
    } catch (error) {
        console.error('Ошибка при открытии модального окна экспорта:', error);
        showNotification('Не удалось открыть форму экспорта', 'error');
    }
}

// Открытие модального окна импорта данных
function openImportModal() {
    try {
        console.log('Открытие модального окна импорта данных');
        showNotification('Функция импорта данных находится в разработке', 'info');
    } catch (error) {
        console.error('Ошибка при открытии модального окна импорта:', error);
        showNotification('Не удалось открыть форму импорта', 'error');
    }
}

// Отправка формы импорта данных
async function submitImportForm() {
    try {
        const fileInput = document.getElementById('import-file');
        
        // Проверка выбран ли файл
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            showNotification('Выберите файл для импорта', 'warning');
            return;
        }
        
        const file = fileInput.files[0];
        
        // В реальном API мы бы отправили файл на сервер:
        // const formData = new FormData();
        // formData.append('file', file);
        // const response = await fetch(`${API_BASE_URL}/import/inventory-movements`, {
        //     method: 'POST',
        //     body: formData
        // });
        // if (!response.ok) throw new Error('Ошибка импорта');
        
        // Для демонстрации просто показываем сообщение
        console.log(`Импорт файла: ${file.name} (${file.type}, ${Math.round(file.size/1024)} KB)`);
        
        // Закрываем модальное окно и показываем уведомление
        closeModal('import-data-modal');
        showNotification('Файл успешно загружен, данные импортируются', 'success');
        
        // Эмуляция обновления данных после импорта
        setTimeout(() => {
            loadMovements();
            showNotification('Импорт данных успешно завершен', 'success');
        }, 2000);
        
    } catch (error) {
        console.error('Ошибка при импорте данных:', error);
        showNotification('Не удалось выполнить импорт', 'error');
    }
}

// Функция для отображения уведомлений
function showNotification(message, type = 'info') {
    console.log(`Уведомление (${type}): ${message}`);
    
    // Создание элемента уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Добавление на страницу
    const notificationsContainer = document.querySelector('.notifications-container');
    if (!notificationsContainer) {
        // Если контейнер для уведомлений не существует, создаем его
        const newContainer = document.createElement('div');
        newContainer.className = 'notifications-container';
        document.body.appendChild(newContainer);
        newContainer.appendChild(notification);
    } else {
        notificationsContainer.appendChild(notification);
    }
    
    // Обработчик закрытия уведомления
    const closeButton = notification.querySelector('.notification-close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            notification.classList.add('fadeOut');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
    
    // Автоматическое закрытие уведомления через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('fadeOut');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Функция для отложенного выполнения (debounce)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Экспортируем функции в глобальную область видимости 
window.initMovementsPage = initMovementsPage;
window.closeModal = closeModal;
window.submitMovementForm = submitMovementForm;
window.submitTransferForm = submitTransferForm;
window.submitWriteOffForm = submitWriteOffForm;
window.submitExportForm = submitExportForm;
window.openAddMovementModal = openAddMovementModal;
window.openTransferStockModal = openTransferStockModal;
window.openWriteOffModal = openWriteOffModal;
window.exportMovementsLog = exportMovementsLog;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, находимся ли мы на странице движений
    if (document.querySelector('.main-header h1')?.textContent.includes('Stock Movements')) {
        console.log('Обнаружена страница движений инвентаря, инициализируем...');
        initMovementsPage();
    }
});

// Инициализация обработчиков форм
function initFormHandlers() {
    console.log('Инициализация обработчиков форм');
    
    // Форма добавления движения
    const addMovementForm = document.getElementById('addMovementForm');
    if (addMovementForm) {
        console.log('Найдена форма добавления движения');
        addMovementForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitMovementForm();
        });
    }
    
    // Форма перемещения запасов
    const transferForm = document.getElementById('transferForm');
    if (transferForm) {
        console.log('Найдена форма перемещения запасов');
        transferForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitTransferForm();
        });
    }
    
    // Форма списания
    const writeOffForm = document.getElementById('writeOffForm');
    if (writeOffForm) {
        console.log('Найдена форма списания');
        writeOffForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitWriteOffForm();
        });
    }
    
    // Форма экспорта
    const exportForm = document.getElementById('exportForm');
    if (exportForm) {
        console.log('Найдена форма экспорта');
        exportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitExportForm();
        });
    }
}

// Отображение модального окна
function showModal(modalId) {
    console.log('Показываем модальное окно:', modalId);
    const modal = document.getElementById(modalId);
    
    if (modal) {
        // Добавляем класс к body для блокировки прокрутки
        document.body.classList.add('modal-open');
        
        // Отображаем модальное окно
        modal.style.display = 'block';
        
        // Настраиваем обработчики для закрытия
        const closeButtons = modal.querySelectorAll('.close-modal, .btn-secondary');
        closeButtons.forEach(button => {
            button.onclick = () => {
                closeModal(modalId);
            };
        });
        
        // Закрытие по клику вне модального окна
        window.onclick = function(event) {
            if (event.target === modal) {
                closeModal(modalId);
            }
        };
    } else {
        console.error('Модальное окно не найдено:', modalId);
    }
}

// Загрузка товаров и локаций для модальных окон
async function loadItemsAndLocationsForModal(prefix) {
    console.log(`Загрузка данных для модального окна с префиксом '${prefix}'`);
    try {
        // Загружаем данные о товарах
        const items = await getItems();
        const itemSelect = document.getElementById(`${prefix}-item`);
        
        if (itemSelect && items && items.length > 0) {
            // Очищаем предыдущие опции, оставляя только первую (пустой выбор)
            while (itemSelect.options.length > 1) {
                itemSelect.remove(1);
            }
            
            // Добавляем новые опции
            items.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = `${item.name} (${item.code || 'без кода'})`;
                itemSelect.appendChild(option);
            });
            
            // Настраиваем обработчик изменения товара, если это перемещение или списание
            if (prefix === 'transfer' || prefix === 'write-off') {
                itemSelect.onchange = async function() {
                    const itemId = this.value;
                    const locationSelect = document.getElementById(`${prefix}-from-location`);
                    
                    if (itemId && locationSelect) {
                        // В реальном приложении здесь бы загружались только те локации, 
                        // где есть выбранный товар, но в демо просто активируем все
                        locationSelect.disabled = false;
                        
                        // Обнуляем доступное количество при смене товара
                        const availableQuantityEl = document.getElementById(`${prefix}-available`);
                        if (availableQuantityEl) {
                            availableQuantityEl.textContent = '0';
                        }
                    }
                };
            }
        } else {
            console.warn(`Список товаров не найден для селекта с ID ${prefix}-item`);
        }
        
        // Загружаем данные о локациях
        const locations = await getLocations();
        
        // Обрабатываем локацию "откуда" если она есть в форме
        const fromLocationSelect = document.getElementById(`${prefix}-from-location`);
        if (fromLocationSelect && locations && locations.length > 0) {
            // Очищаем предыдущие опции, оставляя только первую (пустой выбор)
            while (fromLocationSelect.options.length > 1) {
                fromLocationSelect.remove(1);
            }
            
            // Добавляем новые опции
            locations.forEach(location => {
                const option = document.createElement('option');
                option.value = location.id;
                option.textContent = location.name;
                fromLocationSelect.appendChild(option);
            });
            
            // Настраиваем обработчик изменения локации, если это перемещение или списание
            if (prefix === 'transfer' || prefix === 'write-off') {
                fromLocationSelect.onchange = function() {
                    const locationId = this.value;
                    const itemId = document.getElementById(`${prefix}-item`).value;
                    
                    if (locationId && itemId) {
                        // В реальном приложении здесь бы загружалось доступное количество
                        // товара в выбранной локации, но в демо просто ставим заглушку
                        const availableQuantityEl = document.getElementById(`${prefix}-available`);
                        if (availableQuantityEl) {
                            availableQuantityEl.textContent = '10';
                        }
                        
                        // Если это перемещение, активируем поле "куда"
                        if (prefix === 'transfer') {
                            const toLocationSelect = document.getElementById(`${prefix}-to-location`);
                            if (toLocationSelect) {
                                toLocationSelect.disabled = false;
                            }
                        }
                    }
                };
            }
        }
        
        // Обрабатываем локацию "куда" если она есть в форме
        const toLocationSelect = document.getElementById(`${prefix}-to-location`);
        if (toLocationSelect && locations && locations.length > 0) {
            // Очищаем предыдущие опции, оставляя только первую (пустой выбор)
            while (toLocationSelect.options.length > 1) {
                toLocationSelect.remove(1);
            }
            
            // Добавляем новые опции
            locations.forEach(location => {
                const option = document.createElement('option');
                option.value = location.id;
                option.textContent = location.name;
                toLocationSelect.appendChild(option);
            });
        }
        
        console.log(`Данные для модального окна '${prefix}' успешно загружены`);
    } catch (error) {
        console.error(`Ошибка при загрузке данных для модального окна '${prefix}':`, error);
        showNotification('Ошибка при загрузке данных для формы', 'error');
    }
}

// Функция для форматирования даты и времени для полей ввода datetime-local
function formatDateTimeForInput(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Установка текущего времени во всех полях datetime-local
function setCurrentDateTimeInFields() {
    console.log('Установка текущей даты/времени в полях ввода');
    const now = new Date();
    const formattedDateTime = formatDateTimeForInput(now);
    
    document.querySelectorAll('input[type="datetime-local"]').forEach(input => {
        if (!input.value) {
            input.value = formattedDateTime;
            console.log(`Установлена дата ${formattedDateTime} в поле ${input.id}`);
        }
    });
}
