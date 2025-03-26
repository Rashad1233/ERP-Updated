// rfq.js - Функциональность страницы управления запросами предложений (RFQ)

document.addEventListener('DOMContentLoaded', function() {
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
    
    // Проверяем, есть ли параметр req в URL (создание RFQ из заявки)
    checkUrlParameters();
    
    // Загрузка данных из базы (заглушка)
    loadRfqStats();
    loadRfqs();
    loadSuppliers();
    loadProducts();
    
    // Инициализация пагинации
    initPagination();
    
    // Инициализация фильтров
    initFilters();
});

// Проверка URL параметров
function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const reqId = urlParams.get('req');
    
    if (reqId) {
        // Есть параметр req - значит мы пришли со страницы заявок
        showNotification(`Создание запроса предложений на основе заявки ${reqId}`, 'info');
        openModal('rfqModal');
        prefillRfqFormFromRequisition(reqId);
    }
}

// Предзаполнение формы RFQ данными из заявки
function prefillRfqFormFromRequisition(reqId) {
    // В реальном приложении здесь был бы API-запрос для получения данных заявки
    // Имитируем загрузку данных
    setTimeout(() => {
        // Выбираем связанную заявку в списке
        const relatedRequisition = document.getElementById('relatedRequisition');
        if (relatedRequisition) {
            // Находим option с соответствующим значением
            const options = relatedRequisition.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === reqId) {
                    relatedRequisition.selectedIndex = i;
                    break;
                }
            }
        }
        
        // Предварительно выбираем поставщиков (для демо)
        document.getElementById('supplier-1').checked = true;
        document.getElementById('supplier-2').checked = true;
        
        // Устанавливаем заголовок формы
        const modalTitle = document.getElementById('rfqModalTitle');
        if (modalTitle) {
            modalTitle.textContent = `Запрос предложений для заявки ${reqId}`;
        }
    }, 300);
}

// Установка текущей даты для полей формы
function setCurrentDate() {
    const today = new Date().toISOString().split('T')[0];
    
    // Установка текущей даты в поле даты создания RFQ
    const issueDate = document.getElementById('issueDate');
    if (issueDate) issueDate.value = today;
    
    // Установка даты окончания по умолчанию (сегодня + 7 дней)
    const oneWeekLater = new Date();
    oneWeekLater.setDate(oneWeekLater.getDate() + 7);
    const dueDate = document.getElementById('dueDate');
    if (dueDate) dueDate.value = oneWeekLater.toISOString().split('T')[0];
    
    // Установка даты поставки по умолчанию (сегодня + 14 дней)
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
    const deliveryDate = document.getElementById('rfq-delivery-0');
    if (deliveryDate) deliveryDate.value = twoWeeksLater.toISOString().split('T')[0];
}

// Инициализация форм
function initForms() {
    // Форма RFQ
    const rfqForm = document.getElementById('rfqForm');
    if (rfqForm) {
        rfqForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveRfq();
        });
    }
    
    // Кнопка создания нового RFQ
    const newRfqBtn = document.getElementById('newRfqBtn');
    if (newRfqBtn) {
        newRfqBtn.addEventListener('click', function() {
            openModal('rfqModal');
            resetRfqForm();
        });
    }
    
    // Кнопка добавления товара в RFQ
    const addRfqItemBtn = document.getElementById('addRfqItemBtn');
    if (addRfqItemBtn) {
        addRfqItemBtn.addEventListener('click', addRfqItem);
    }
    
    // Кнопки отмены
    const cancelBtn = document.getElementById('cancelRfqBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModals);
    }
    
    // Кнопки управления в модальном окне просмотра RFQ
    const closeViewRfqBtn = document.getElementById('closeViewRfqBtn');
    if (closeViewRfqBtn) {
        closeViewRfqBtn.addEventListener('click', closeModals);
    }
    
    const createPoFromRfqBtn = document.getElementById('createPoFromRfqBtn');
    if (createPoFromRfqBtn) {
        createPoFromRfqBtn.addEventListener('click', function() {
            const rfqId = document.getElementById('view-rfq-id').textContent;
            createPurchaseOrderFromRfq(rfqId);
        });
    }
    
    const editRfqBtn = document.getElementById('editRfqBtn');
    if (editRfqBtn) {
        editRfqBtn.addEventListener('click', function() {
            const rfqId = document.getElementById('view-rfq-id').textContent;
            closeModals();
            editRfq(rfqId);
        });
    }
    
    const closeRfqBtn = document.getElementById('closeRfqBtn');
    if (closeRfqBtn) {
        closeRfqBtn.addEventListener('click', function() {
            const rfqId = document.getElementById('view-rfq-id').textContent;
            closeRfq(rfqId);
        });
    }
}

// Инициализация пагинации
function initPagination() {
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pages = document.querySelectorAll('.pagination-page');
    
    if (prevPage && nextPage && pages.length > 0) {
        // Обработчик для кнопки "Предыдущая страница"
        prevPage.addEventListener('click', function() {
            if (!this.disabled) {
                const activePage = document.querySelector('.pagination-page.active');
                const prevPageBtn = activePage.previousElementSibling;
                if (prevPageBtn) {
                    activePage.classList.remove('active');
                    prevPageBtn.classList.add('active');
                    loadRfqsPage(parseInt(prevPageBtn.textContent));
                    
                    // Обновляем состояние кнопок
                    nextPage.disabled = false;
                    if (!prevPageBtn.previousElementSibling) {
                        this.disabled = true;
                    }
                }
            }
        });
        
        // Обработчик для кнопки "Следующая страница"
        nextPage.addEventListener('click', function() {
            if (!this.disabled) {
                const activePage = document.querySelector('.pagination-page.active');
                const nextPageBtn = activePage.nextElementSibling;
                if (nextPageBtn) {
                    activePage.classList.remove('active');
                    nextPageBtn.classList.add('active');
                    loadRfqsPage(parseInt(nextPageBtn.textContent));
                    
                    // Обновляем состояние кнопок
                    prevPage.disabled = false;
                    if (!nextPageBtn.nextElementSibling) {
                        this.disabled = true;
                    }
                }
            }
        });
        
        // Обработчики для кнопок с номерами страниц
        pages.forEach(page => {
            page.addEventListener('click', function() {
                if (!this.classList.contains('active')) {
                    document.querySelector('.pagination-page.active').classList.remove('active');
                    this.classList.add('active');
                    loadRfqsPage(parseInt(this.textContent));
                    
                    // Обновляем состояние кнопок
                    prevPage.disabled = !this.previousElementSibling;
                    nextPage.disabled = !this.nextElementSibling;
                }
            });
        });
    }
}

// Загрузка страницы RFQ
function loadRfqsPage(page) {
    showNotification(`Загрузка страницы ${page}`, 'info');
    // В реальном приложении здесь был бы запрос к API для загрузки данных конкретной страницы
    // Имитируем загрузку через setTimeout для демонстрации
    setTimeout(() => {
        // Обновляем данные в таблице
        // В реальном приложении здесь был бы код обновления таблицы на основе полученных данных
    }, 300);
}

// Инициализация фильтров
function initFilters() {
    const applyFilters = document.getElementById('applyFilters');
    const resetFilters = document.getElementById('resetFilters');
    const statusFilter = document.getElementById('statusFilter');
    const supplierFilter = document.getElementById('supplierFilter');
    const dateFromFilter = document.getElementById('dateFromFilter');
    const dateToFilter = document.getElementById('dateToFilter');
    
    if (applyFilters && resetFilters) {
        // Обработчик для кнопки "Применить"
        applyFilters.addEventListener('click', function() {
            const filters = {
                status: statusFilter ? statusFilter.value : '',
                supplier: supplierFilter ? supplierFilter.value : '',
                dateFrom: dateFromFilter ? dateFromFilter.value : '',
                dateTo: dateToFilter ? dateToFilter.value : ''
            };
            
            applyRfqFilters(filters);
        });
        
        // Обработчик для кнопки "Сбросить"
        resetFilters.addEventListener('click', function() {
            if (statusFilter) statusFilter.value = '';
            if (supplierFilter) supplierFilter.value = '';
            if (dateFromFilter) dateFromFilter.value = '';
            if (dateToFilter) dateToFilter.value = '';
            
            applyRfqFilters({});
        });
    }
    
    // Инициализация поиска
    const searchInput = document.getElementById('rfqSearch');
    const searchButton = document.querySelector('.btn-search');
    
    if (searchInput && searchButton) {
        // Обработчик для кнопки поиска
        searchButton.addEventListener('click', function() {
            searchRfqs(searchInput.value);
        });
        
        // Обработчик для ввода в поле поиска (поиск при нажатии Enter)
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchRfqs(this.value);
            }
        });
    }
}

// Применение фильтров к RFQ
function applyRfqFilters(filters) {
    showNotification('Применяем фильтры', 'info');
    // В реальном приложении здесь был бы запрос к API с примененными фильтрами
    
    // Логирование примененных фильтров для демонстрации
    console.log('Применены фильтры:', filters);
    
    // Имитируем загрузку отфильтрованных данных
    setTimeout(() => {
        // Обновляем данные в таблице
        // В реальном приложении здесь был бы код обновления таблицы на основе отфильтрованных данных
        
        showNotification('Фильтры применены', 'success');
    }, 300);
}

// Поиск RFQ
function searchRfqs(query) {
    if (query.trim() === '') {
        showNotification('Введите текст для поиска', 'warning');
        return;
    }
    
    showNotification(`Поиск: "${query}"`, 'info');
    // В реальном приложении здесь был бы запрос к API для поиска
    
    // Логирование поискового запроса для демонстрации
    console.log('Поиск по запросу:', query);
    
    // Имитируем загрузку результатов поиска
    setTimeout(() => {
        // Обновляем данные в таблице
        // В реальном приложении здесь был бы код обновления таблицы на основе результатов поиска
        
        showNotification('Поиск выполнен', 'success');
    }, 300);
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

// Загрузка статистики по RFQ
function loadRfqStats() {
    // В реальном приложении здесь был бы API-запрос
    // Имитируем загрузку данных с помощью таймаута
    setTimeout(() => {
        // Обновляем карточки с данными
        document.getElementById('openCount').textContent = '8';
        document.getElementById('pendingCount').textContent = '5';
        document.getElementById('closedCount').textContent = '42';
        document.getElementById('suppliersCount').textContent = '15';
    }, 300);
}

// Загрузка запросов предложений
function loadRfqs() {
    // В реальном приложении здесь был бы API-запрос
    // Имитируем загрузку данных с помощью таймаута
    setTimeout(() => {
        const rfqsTable = document.getElementById('rfqsTable');
        if (!rfqsTable) return;
        
        // Данные уже загружены в HTML для демо-целей
        // В реальном приложении здесь был бы код для заполнения таблицы данными от API
        
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
    }, 300);
}

// Загрузка поставщиков
function loadSuppliers() {
    // В реальном приложении здесь был бы API-запрос
    // Данные уже загружены в HTML для демо-целей
}

// Загрузка продуктов
function loadProducts() {
    // В реальном приложении здесь был бы API-запрос
    // Данные уже загружены в HTML для демо-целей
}

// Добавить товар в RFQ
function addRfqItem() {
    const rfqItems = document.getElementById('rfqItems');
    const itemCount = rfqItems.children.length;
    
    // Создаем новый элемент
    const newItem = document.createElement('div');
    newItem.className = 'rfq-item';
    newItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label for="rfq-product-${itemCount}">Товар</label>
                <select id="rfq-product-${itemCount}" class="product-select" required>
                    <option value="1">Ноутбук Dell XPS 13</option>
                    <option value="2">Смартфон iPhone 13</option>
                    <option value="3">Монитор LG UltraWide</option>
                    <option value="4">Клавиатура Logitech MX Keys</option>
                    <option value="5">Мышь Logitech MX Master</option>
                </select>
            </div>
            <div class="form-group">
                <label for="rfq-quantity-${itemCount}">Количество</label>
                <input type="number" id="rfq-quantity-${itemCount}" class="quantity-input" min="1" value="1" required>
            </div>
            <div class="form-group">
                <label for="rfq-delivery-${itemCount}">Дата поставки</label>
                <input type="date" id="rfq-delivery-${itemCount}" class="delivery-input" required>
            </div>
            <button type="button" class="btn-danger remove-item"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    // Добавляем в контейнер
    rfqItems.appendChild(newItem);
    
    // Устанавливаем дату поставки по умолчанию (сегодня + 14 дней)
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
    const deliveryDate = document.getElementById(`rfq-delivery-${itemCount}`);
    if (deliveryDate) deliveryDate.value = twoWeeksLater.toISOString().split('T')[0];
    
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

// Сохранение запроса предложений
function saveRfq() {
    // Проверка формы перед отправкой
    const suppliers = document.querySelectorAll('input[name="suppliers"]:checked');
    if (suppliers.length === 0) {
        showNotification('Пожалуйста, выберите хотя бы одного поставщика', 'error');
        return;
    }
    
    // В реальном приложении здесь был бы API-запрос для сохранения
    showNotification('Сохраняем запрос предложений...', 'info');
    
    // Имитируем сохранение с помощью таймаута
    setTimeout(() => {
        showNotification('Запрос предложений успешно сохранен', 'success');
        closeModals();
        
        // Обновляем список RFQ и статистику
        setTimeout(() => {
            loadRfqs();
            loadRfqStats();
        }, 300);
    }, 500);
}

// Сброс формы RFQ
function resetRfqForm() {
    const form = document.getElementById('rfqForm');
    if (form) {
        form.reset();
        setCurrentDate();
        
        // Очищаем скрытое поле ID (для нового RFQ)
        const idField = document.getElementById('rfqId');
        if (idField) idField.value = '';
        
        // Устанавливаем заголовок модального окна
        const modalTitle = document.getElementById('rfqModalTitle');
        if (modalTitle) modalTitle.textContent = 'Новый запрос предложений';
        
        // Удаляем все элементы, кроме первого
        const rfqItems = document.getElementById('rfqItems');
        if (rfqItems) {
            const items = rfqItems.querySelectorAll('.rfq-item');
            for (let i = 1; i < items.length; i++) {
                items[i].remove();
            }
            
            // Отключаем кнопку удаления для первого элемента
            const removeBtn = rfqItems.querySelector('.remove-item');
            if (removeBtn) removeBtn.disabled = true;
        }
    }
}

// Просмотр запроса предложений
function viewRfq(id) {
    // В реальном приложении здесь был бы API-запрос для получения данных RFQ
    // Имитируем загрузку данных с помощью таймаута
    showNotification(`Загрузка данных запроса ${id}`, 'info');
    
    setTimeout(() => {
        // Обновляем ID в модальном окне
        document.getElementById('view-rfq-id').textContent = id;
        
        // Данные уже загружены в HTML для демо-целей
        // В реальном приложении здесь был бы код для заполнения модального окна данными от API
        
        // Показываем или скрываем кнопки в зависимости от статуса
        const status = document.getElementById('view-rfq-status').textContent;
        const createPoBtn = document.getElementById('createPoFromRfqBtn');
        const closeRfqBtn = document.getElementById('closeRfqBtn');
        
        if (status === 'Открыт') {
            createPoBtn.style.display = 'inline-block';
            closeRfqBtn.style.display = 'inline-block';
        } else if (status === 'Ожидание') {
            createPoBtn.style.display = 'none';
            closeRfqBtn.style.display = 'inline-block';
        } else {
            createPoBtn.style.display = 'none';
            closeRfqBtn.style.display = 'none';
        }
        
        // Добавляем обработчики кнопок просмотра предложений
        const viewQuoteBtns = document.querySelectorAll('.view-quote-btn');
        viewQuoteBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const supplierId = this.getAttribute('data-supplier');
                viewQuote(id, supplierId);
            });
        });
        
        // Открываем модальное окно
        openModal('viewRfqModal');
    }, 300);
}

// Просмотр предложения поставщика
function viewQuote(rfqId, supplierId) {
    // В реальном приложении здесь был бы код для просмотра предложения
    showNotification(`Просмотр предложения от поставщика ${supplierId} для RFQ ${rfqId}`, 'info');
}

// Редактирование запроса предложений
function editRfq(id) {
    // В реальном приложении здесь был бы API-запрос
    showNotification(`Редактирование запроса ${id}`, 'info');
    
    // Имитируем загрузку данных RFQ
    setTimeout(() => {
        // Устанавливаем заголовок модального окна
        const modalTitle = document.getElementById('rfqModalTitle');
        if (modalTitle) modalTitle.textContent = `Редактирование запроса ${id}`;
        
        // Устанавливаем ID RFQ в скрытое поле
        const idField = document.getElementById('rfqId');
        if (idField) idField.value = id;
        
        // В реальном приложении здесь был бы код для заполнения формы данными RFQ
        // Для демо используем тестовые данные
        document.getElementById('relatedRequisition').value = 'ЗК-2023-235';
        document.getElementById('issueDate').value = '2023-04-16';
        document.getElementById('dueDate').value = '2023-04-23';
        document.getElementById('supplier-1').checked = true;
        document.getElementById('supplier-2').checked = true;
        document.getElementById('supplier-3').checked = true;
        document.getElementById('rfqNotes').value = 'Пожалуйста, предоставьте ваше лучшее предложение по указанным товарам. Требуется гарантия не менее 1 года. Возможна поставка партиями.';
        
        // Открываем модальное окно
        openModal('rfqModal');
    }, 300);
}

// Удаление запроса предложений
function deleteRfq(id) {
    if (confirm(`Вы уверены, что хотите удалить запрос ${id}?`)) {
        // В реальном приложении здесь был бы API-запрос для удаления
        showNotification(`Удаление запроса ${id}`, 'warning');
        
        // Имитируем удаление с помощью таймаута
        setTimeout(() => {
            showNotification(`Запрос ${id} удален`, 'success');
            
            // Обновляем список RFQ и статистику
            setTimeout(() => {
                loadRfqs();
                loadRfqStats();
            }, 300);
        }, 500);
    }
}

// Закрытие запроса предложений
function closeRfq(id) {
    if (confirm(`Вы уверены, что хотите закрыть запрос ${id}?`)) {
        // В реальном приложении здесь был бы API-запрос для изменения статуса
        showNotification(`Закрытие запроса ${id}`, 'warning');
        
        // Имитируем обработку с помощью таймаута
        setTimeout(() => {
            showNotification(`Запрос ${id} закрыт`, 'success');
            
            // Закрываем модальное окно и обновляем данные
            closeModals();
            
            setTimeout(() => {
                loadRfqs();
                loadRfqStats();
            }, 300);
        }, 500);
    }
}

// Создание заказа на закупку из запроса предложений
function createPurchaseOrderFromRfq(id) {
    // В реальном приложении здесь был бы код для перехода на страницу создания заказа с предзаполненными данными
    showNotification(`Создание заказа на закупку на основе запроса ${id}`, 'info');
    
    // Имитируем переход на страницу создания заказа
    setTimeout(() => {
        window.location.href = `purchase-orders.html?rfq=${id}`;
    }, 500);
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