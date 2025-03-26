// requisitions.js - Функциональность страницы управления заявками на закупку

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
    
    // Загрузка данных из базы (заглушка)
    loadRequisitionsStats();
    loadRequisitions();
    loadProducts();
    
    // Инициализация пагинации
    initPagination();
    
    // Инициализация фильтров
    initFilters();
});

// Установка текущей даты для полей формы
function setCurrentDate() {
    const today = new Date().toISOString().split('T')[0];
    
    // Установка текущей даты в полях создания заявки
    const requestDate = document.getElementById('requestDate');
    if (requestDate) requestDate.value = today;
    
    // Установка даты необходимости по умолчанию (сегодня + 14 дней)
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
    const dateNeeded = document.getElementById('req-date-needed-0');
    if (dateNeeded) dateNeeded.value = twoWeeksLater.toISOString().split('T')[0];
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
    
    // Кнопка создания новой заявки
    const newRequisitionBtn = document.getElementById('newRequisitionBtn');
    if (newRequisitionBtn) {
        newRequisitionBtn.addEventListener('click', function() {
            openModal('requisitionModal');
            resetRequisitionForm();
        });
    }
    
    // Кнопка добавления предмета в заявку
    const addRequisitionItemBtn = document.getElementById('addRequisitionItemBtn');
    if (addRequisitionItemBtn) {
        addRequisitionItemBtn.addEventListener('click', addRequisitionItem);
    }
    
    // Кнопки отмены
    const cancelBtn = document.getElementById('cancelRequisitionBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModals);
    }
    
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
                    loadRequisitionsPage(parseInt(prevPageBtn.textContent));
                    
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
                    loadRequisitionsPage(parseInt(nextPageBtn.textContent));
                    
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
                    loadRequisitionsPage(parseInt(this.textContent));
                    
                    // Обновляем состояние кнопок
                    prevPage.disabled = !this.previousElementSibling;
                    nextPage.disabled = !this.nextElementSibling;
                }
            });
        });
    }
}

// Загрузка страницы заявок
function loadRequisitionsPage(page) {
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
    const departmentFilter = document.getElementById('departmentFilter');
    const dateFromFilter = document.getElementById('dateFromFilter');
    const dateToFilter = document.getElementById('dateToFilter');
    
    if (applyFilters && resetFilters) {
        // Обработчик для кнопки "Применить"
        applyFilters.addEventListener('click', function() {
            const filters = {
                status: statusFilter ? statusFilter.value : '',
                department: departmentFilter ? departmentFilter.value : '',
                dateFrom: dateFromFilter ? dateFromFilter.value : '',
                dateTo: dateToFilter ? dateToFilter.value : ''
            };
            
            applyRequisitionFilters(filters);
        });
        
        // Обработчик для кнопки "Сбросить"
        resetFilters.addEventListener('click', function() {
            if (statusFilter) statusFilter.value = '';
            if (departmentFilter) departmentFilter.value = '';
            if (dateFromFilter) dateFromFilter.value = '';
            if (dateToFilter) dateToFilter.value = '';
            
            applyRequisitionFilters({});
        });
    }
    
    // Инициализация поиска
    const searchInput = document.getElementById('requisitionSearch');
    const searchButton = document.querySelector('.btn-search');
    
    if (searchInput && searchButton) {
        // Обработчик для кнопки поиска
        searchButton.addEventListener('click', function() {
            searchRequisitions(searchInput.value);
        });
        
        // Обработчик для ввода в поле поиска (поиск при нажатии Enter)
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchRequisitions(this.value);
            }
        });
    }
}

// Применение фильтров к заявкам
function applyRequisitionFilters(filters) {
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

// Поиск заявок
function searchRequisitions(query) {
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

// Загрузка статистики по заявкам
function loadRequisitionsStats() {
    // В реальном приложении здесь был бы API-запрос
    // Имитируем загрузку данных с помощью таймаута
    setTimeout(() => {
        // Обновляем карточки с данными
        document.getElementById('pendingCount').textContent = '12';
        document.getElementById('approvedCount').textContent = '48';
        document.getElementById('rejectedCount').textContent = '5';
        document.getElementById('totalValueCount').textContent = '₽1,250,800';
    }, 300);
}

// Загрузка заявок на закупку
function loadRequisitions() {
    // В реальном приложении здесь был бы API-запрос
    // Имитируем загрузку данных с помощью таймаута
    setTimeout(() => {
        const requisitionsTable = document.getElementById('requisitionsTable');
        if (!requisitionsTable) return;
        
        // Данные уже загружены в HTML для демо-целей
        // В реальном приложении здесь был бы код для заполнения таблицы данными от API
        
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
        
        requisitionsTable.querySelectorAll('.create-rfq-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                createRfqFromRequisition(id);
            });
        });
    }, 300);
}

// Загрузка продуктов
function loadProducts() {
    // В реальном приложении здесь был бы API-запрос
    // Демо-данные уже загружены в HTML
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
                <label for="req-product-${itemCount}">Товар</label>
                <select id="req-product-${itemCount}" class="product-select" required>
                    <option value="1">Ноутбук Dell XPS 13</option>
                    <option value="2">Смартфон iPhone 13</option>
                    <option value="3">Монитор LG UltraWide</option>
                    <option value="4">Клавиатура Logitech MX Keys</option>
                    <option value="5">Мышь Logitech MX Master</option>
                </select>
            </div>
            <div class="form-group">
                <label for="req-quantity-${itemCount}">Количество</label>
                <input type="number" id="req-quantity-${itemCount}" class="quantity-input" min="1" value="1" required>
            </div>
            <div class="form-group">
                <label for="req-date-needed-${itemCount}">Дата необходимости</label>
                <input type="date" id="req-date-needed-${itemCount}" class="date-needed-input" required>
            </div>
            <div class="form-group">
                <label for="req-reason-${itemCount}">Причина</label>
                <input type="text" id="req-reason-${itemCount}" class="reason-input" required>
            </div>
            <button type="button" class="btn-danger remove-item"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    // Добавляем в контейнер
    requisitionItems.appendChild(newItem);
    
    // Устанавливаем дату необходимости по умолчанию (сегодня + 14 дней)
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
    const dateNeeded = document.getElementById(`req-date-needed-${itemCount}`);
    if (dateNeeded) dateNeeded.value = twoWeeksLater.toISOString().split('T')[0];
    
    // Включаем кнопку удаления у всех элементов
    enableItemRemoval(requisitionItems, 'requisition-item');
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

// Сохранение заявки на закупку
function saveRequisition() {
    // Проверка формы перед отправкой
    const requesterName = document.getElementById('requesterName').value;
    if (!requesterName) {
        showNotification('Пожалуйста, введите имя запрашивающего', 'error');
        return;
    }
    
    // В реальном приложении здесь был бы API-запрос для сохранения
    showNotification('Сохраняем заявку...', 'info');
    
    // Имитируем сохранение с помощью таймаута
    setTimeout(() => {
        showNotification('Заявка успешно сохранена', 'success');
        closeModals();
        
        // Обновляем список заявок и статистику
        setTimeout(() => {
            loadRequisitions();
            loadRequisitionsStats();
        }, 300);
    }, 500);
}

// Сброс формы заявки
function resetRequisitionForm() {
    const form = document.getElementById('requisitionForm');
    if (form) {
        form.reset();
        setCurrentDate();
        
        // Очищаем скрытое поле ID (для новой заявки)
        const idField = document.getElementById('requisitionId');
        if (idField) idField.value = '';
        
        // Устанавливаем заголовок модального окна
        const modalTitle = document.getElementById('requisitionModalTitle');
        if (modalTitle) modalTitle.textContent = 'Новая заявка на закупку';
        
        // Удаляем все элементы, кроме первого
        const requisitionItems = document.getElementById('requisitionItems');
        if (requisitionItems) {
            const items = requisitionItems.querySelectorAll('.requisition-item');
            for (let i = 1; i < items.length; i++) {
                items[i].remove();
            }
            
            // Отключаем кнопку удаления для первого элемента
            const removeBtn = requisitionItems.querySelector('.remove-item');
            if (removeBtn) removeBtn.disabled = true;
        }
    }
}

// Просмотр заявки на закупку
function viewRequisition(id) {
    // В реальном приложении здесь был бы API-запрос для получения данных заявки
    // Имитируем загрузку данных с помощью таймаута
    showNotification(`Загрузка данных заявки ${id}`, 'info');
    
    setTimeout(() => {
        // Данные уже загружены в HTML для демо-целей
        // В реальном приложении здесь был бы код для заполнения модального окна данными от API
        
        // Показываем или скрываем кнопки в зависимости от статуса
        const status = document.getElementById('view-req-status').textContent;
        const approveBtn = document.getElementById('approveReqBtn');
        const rejectBtn = document.getElementById('rejectReqBtn');
        const createRfqBtn = document.getElementById('createRfqFromReqBtn');
        
        if (status === 'В ожидании') {
            approveBtn.style.display = 'inline-block';
            rejectBtn.style.display = 'inline-block';
            createRfqBtn.style.display = 'none';
        } else if (status === 'Одобрено') {
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
    showNotification(`Редактирование заявки ${id}`, 'info');
    
    // Имитируем загрузку данных заявки
    setTimeout(() => {
        // Устанавливаем заголовок модального окна
        const modalTitle = document.getElementById('requisitionModalTitle');
        if (modalTitle) modalTitle.textContent = `Редактирование заявки ${id}`;
        
        // Устанавливаем ID заявки в скрытое поле
        const idField = document.getElementById('requisitionId');
        if (idField) idField.value = id;
        
        // В реальном приложении здесь был бы код для заполнения формы данными заявки
        // Для демо используем тестовые данные
        document.getElementById('requesterName').value = 'Иванов Иван';
        document.getElementById('department').value = 'it';
        document.getElementById('requestDate').value = '2023-04-15';
        document.getElementById('priority').value = 'high';
        document.getElementById('notes').value = 'Необходимы для новых сотрудников, которые выходят на работу 10 мая 2023 года.';
        
        // Открываем модальное окно
        openModal('requisitionModal');
    }, 300);
}

// Удаление заявки на закупку
function deleteRequisition(id) {
    if (confirm(`Вы уверены, что хотите удалить заявку ${id}?`)) {
        // В реальном приложении здесь был бы API-запрос для удаления
        showNotification(`Удаление заявки ${id}`, 'warning');
        
        // Имитируем удаление с помощью таймаута
        setTimeout(() => {
            showNotification(`Заявка ${id} удалена`, 'success');
            
            // Обновляем список заявок и статистику
            setTimeout(() => {
                loadRequisitions();
                loadRequisitionsStats();
            }, 300);
        }, 500);
    }
}

// Одобрение заявки на закупку
function approveRequisition(id) {
    // В реальном приложении здесь был бы API-запрос для изменения статуса
    showNotification(`Одобрение заявки ${id}`, 'info');
    
    // Имитируем обработку с помощью таймаута
    setTimeout(() => {
        showNotification(`Заявка ${id} одобрена`, 'success');
        
        // Закрываем модальное окно и обновляем данные
        closeModals();
        
        setTimeout(() => {
            loadRequisitions();
            loadRequisitionsStats();
        }, 300);
    }, 500);
}

// Отклонение заявки на закупку
function rejectRequisition(id) {
    const reason = prompt('Пожалуйста, укажите причину отклонения:');
    if (reason !== null) {
        // В реальном приложении здесь был бы API-запрос для изменения статуса
        showNotification(`Отклонение заявки ${id}`, 'warning');
        
        // Имитируем обработку с помощью таймаута
        setTimeout(() => {
            showNotification(`Заявка ${id} отклонена`, 'success');
            
            // Закрываем модальное окно и обновляем данные
            closeModals();
            
            setTimeout(() => {
                loadRequisitions();
                loadRequisitionsStats();
            }, 300);
        }, 500);
    }
}

// Создание RFQ из заявки на закупку
function createRfqFromRequisition(id) {
    // В реальном приложении здесь был бы код для перехода на страницу создания RFQ с предзаполненными данными
    showNotification(`Создание запроса предложений на основе заявки ${id}`, 'info');
    
    // Имитируем переход на страницу создания RFQ
    setTimeout(() => {
        window.location.href = `rfq.html?req=${id}`;
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