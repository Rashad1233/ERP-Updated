// Clients module

document.addEventListener('DOMContentLoaded', function() {
  // Check if on clients page
  if (!document.getElementById('clients-container')) return;
  
  // Инициализируем систему локализации
  if (typeof initLanguage === 'function' && (!window.erpLanguage || !window.erpLanguage.current)) {
    initLanguage();
  }
  
  // Load clients
  loadClients();
  
  // Setup event listeners
  document.getElementById('add-client-btn').addEventListener('click', showAddClientModal);
  document.getElementById('save-client-btn').addEventListener('click', saveClient);
  
  // Search functionality
  document.getElementById('search-clients').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('#clients-table tbody tr');
    
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
  });
  
  // Modal close buttons
  const closeButtons = document.querySelectorAll('.modal .close, .btn[data-dismiss="modal"]');
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      modal.style.display = 'none';
    });
  });
  
  // Инициализируем мобильные улучшения
  initMobileEnhancements();
  
  // Обновляем индикаторы прокрутки при изменении размера окна
  window.addEventListener('resize', function() {
    initMobileEnhancements();
  });
});

// Load clients data
function loadClients() {
  fetch('/api/clients')
    .then(response => response.json())
    .then(data => {
      const clientsTable = document.getElementById('clients-table');
      const tableBody = clientsTable.querySelector('tbody');
      tableBody.innerHTML = '';
      
      if (!data.clients || data.clients.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center">${getTranslation('noClientsFound', 'No clients found')}</td></tr>`;
        return;
      }
      
      data.clients.forEach(client => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${client.id}</td>
          <td>${client.name}</td>
          <td class="mobile-hide">${client.email || '-'}</td>
          <td class="mobile-hide">${client.phone || '-'}</td>
          <td class="mobile-hide">${client.address || '-'}</td>
          <td>${client.total_orders || '0'}</td>
          <td>
            <div class="action-buttons">
              <button class="action-btn view-btn" data-id="${client.id}" title="${getTranslation('view', 'View')}"><i class="fas fa-eye"></i></button>
              <button class="action-btn edit-btn" data-id="${client.id}" title="${getTranslation('edit', 'Edit')}"><i class="fas fa-edit"></i></button>
              <button class="action-btn delete-btn" data-id="${client.id}" title="${getTranslation('delete', 'Delete')}"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        `;
        tableBody.appendChild(row);
      });
      
      // Add event listeners
      document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
          const clientId = this.dataset.id;
          viewClientDetails(clientId);
        });
      });
      
      document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
          const clientId = this.dataset.id;
          editClient(clientId);
        });
      });
      
      document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
          const clientId = this.dataset.id;
          deleteClient(clientId);
        });
      });
    })
    .catch(error => {
      showNotification('Error loading clients: ' + error.message, 'error');
    });
}

// Show modal for adding a new client
function showAddClientModal() {
  // Reset form
  document.getElementById('client-form').reset();
  document.getElementById('client-id').value = '';
  document.getElementById('client-modal-title').textContent = getTranslation('addNewClient', 'Add New Client');
  document.getElementById('save-client-btn').textContent = getTranslation('save', 'Save');
  
  // Show modal
  document.getElementById('client-modal').style.display = 'block';
  
  // Применяем переводы к динамическому содержимому
  if (typeof applyTranslations === 'function') {
    applyTranslations();
  }
}

// View client details
function viewClientDetails(clientId) {
  fetch(`/api/clients/${clientId}`)
    .then(response => response.json())
    .then(data => {
      const client = data.client;
      if (!client) {
        console.error('Client not found');
        return;
      }

      // Создаем модальное окно с поддержкой локализации
      const modalHtml = `
        <div id="clientDetailsModal" class="modal">
          <div class="modal-content">
            <div class="modal-header">
              <h2 data-i18n="clientDetails">${getTranslation('clientDetails', 'Client Details')}</h2>
              <span class="close">&times;</span>
            </div>
            <div class="modal-body">
              <div class="client-details">
                <p><strong data-i18n="id">${getTranslation('id', 'ID')}:</strong> ${client.id}</p>
                <p><strong data-i18n="name">${getTranslation('name', 'Name')}:</strong> ${client.name}</p>
                <p><strong data-i18n="contactPerson">${getTranslation('contactPerson', 'Contact Person')}:</strong> ${client.contact_person || '-'}</p>
                <p><strong data-i18n="email">${getTranslation('email', 'Email')}:</strong> ${client.email || '-'}</p>
                <p><strong data-i18n="phone">${getTranslation('phone', 'Phone')}:</strong> ${client.phone || '-'}</p>
                <p><strong data-i18n="address">${getTranslation('address', 'Address')}:</strong> ${client.address || '-'}</p>
                <p><strong data-i18n="notes">${getTranslation('notes', 'Notes')}:</strong> ${client.notes || '-'}</p>
              
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-dismiss="modal" data-i18n="close">${getTranslation('close', 'Close')}</button>
              <button class="btn btn-primary edit-client-btn" data-id="${client.id}" data-i18n="edit">${getTranslation('edit', 'Edit')}</button>
            </div>
          </div>
        </div>
      `;

      // Добавляем модальное окно в DOM
      const modalContainer = document.createElement('div');
      modalContainer.innerHTML = modalHtml;
      document.body.appendChild(modalContainer);

      const modal = document.getElementById('clientDetailsModal');
      modal.style.display = 'block';

      // Применяем переводы к динамическому содержимому
      if (typeof applyTranslations === 'function') {
        applyTranslations();
      }

      // Обработчики событий для модального окна
      modal.querySelector('.close').addEventListener('click', function() {
        modal.style.display = 'none';
        setTimeout(() => {
          document.body.removeChild(modalContainer);
        }, 300);
      });

      modal.querySelector('[data-dismiss="modal"]').addEventListener('click', function() {
        modal.style.display = 'none';
        setTimeout(() => {
          document.body.removeChild(modalContainer);
        }, 300);
      });

      modal.querySelector('.edit-client-btn').addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.removeChild(modalContainer);
        editClient(client.id);
      });

      // Закрытие по клику вне модального окна
      window.addEventListener('click', function(event) {
        if (event.target === modal) {
          modal.style.display = 'none';
          setTimeout(() => {
            document.body.removeChild(modalContainer);
          }, 300);
        }
      });
    })
    .catch(error => {
      console.error('Error fetching client details:', error);
    });
}

// Edit client
function editClient(clientId) {
  fetch(`/api/clients/${clientId}`)
    .then(response => response.json())
    .then(data => {
      const client = data.client;
      
      // Заполняем форму данными клиента
      document.getElementById('client-id').value = client.id;
      document.getElementById('client-name').value = client.name || '';
      document.getElementById('contact-person').value = client.contact_person || '';
      document.getElementById('client-email').value = client.email || '';
      document.getElementById('client-phone').value = client.phone || '';
      document.getElementById('client-address').value = client.address || '';
      document.getElementById('client-city').value = client.city || '';
      document.getElementById('client-country').value = client.country || '';
      document.getElementById('client-notes').value = client.notes || '';
      
      // Обновляем заголовок модального окна
      document.getElementById('client-modal-title').textContent = getTranslation('editClient', 'Edit Client');
      document.getElementById('save-client-btn').textContent = getTranslation('save', 'Save');
      
      // Применяем переводы к динамическому содержимому
      if (typeof applyTranslations === 'function') {
        applyTranslations();
      }
      
      // Показываем модальное окно
      document.getElementById('client-modal').style.display = 'block';
    })
    .catch(error => {
      console.error('Error fetching client details for edit:', error);
    });
}

// Save client (create or update)
function saveClient() {
  const clientId = document.getElementById('client-id').value;
  const clientData = {
    name: document.getElementById('client-name').value,
    contact_person: document.getElementById('contact-person').value,
    email: document.getElementById('client-email').value,
    phone: document.getElementById('client-phone').value,
    address: document.getElementById('client-address').value,
    city: document.getElementById('client-city').value,
    notes: document.getElementById('client-notes').value
  };
  
  const url = clientId ? `/api/clients/${clientId}` : '/api/clients';
  const method = clientId ? 'PUT' : 'POST';
  
  fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(clientData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to save client');
    }
    return response.json();
  })
  .then(data => {
    // Закрываем модальное окно
    document.getElementById('client-modal').style.display = 'none';
    
    // Обновляем список клиентов
    loadClients();
    
    // Показываем уведомление
    showNotification(getTranslation('clientUpdated', 'Client saved successfully'), 'success');
  })
  .catch(error => {
    console.error('Error saving client:', error);
    showNotification(getTranslation('errorSavingClient', 'Error saving client'), 'error');
  });
}

// Delete client
function deleteClient(clientId) {
  // Создаем модальное окно подтверждения с локализацией
  const modalHtml = `
    <div id="delete-confirmation-modal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 data-i18n="confirmDelete">${getTranslation('confirmDelete', 'Confirm Delete')}</h2>
          <span class="close">&times;</span>
        </div>
        <div class="modal-body">
          <p data-i18n="confirmDeleteMessage">${getTranslation('confirmDeleteMessage', 'Are you sure you want to delete this client?')}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-dismiss="modal" data-i18n="cancel">${getTranslation('cancel', 'Cancel')}</button>
          <button class="btn btn-danger" id="confirm-delete-btn" data-i18n="delete">${getTranslation('delete', 'Delete')}</button>
        </div>
      </div>
    </div>
  `;
  
  // Добавляем модальное окно в DOM
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHtml;
  document.body.appendChild(modalContainer);
  
  // Применяем переводы к динамическому содержимому
  if (typeof applyTranslations === 'function') {
    applyTranslations();
  }
  
  const modal = document.getElementById('delete-confirmation-modal');
  modal.style.display = 'block';
  
  // Обработчики событий для модального окна
  modal.querySelector('.close').addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.removeChild(modalContainer);
  });
  
  modal.querySelector('[data-dismiss="modal"]').addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.removeChild(modalContainer);
  });
  
  // Обработчик подтверждения удаления
  modal.querySelector('#confirm-delete-btn').addEventListener('click', function() {
    fetch(`/api/clients/${clientId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete client');
      }
      return response.json();
    })
    .then(data => {
      modal.style.display = 'none';
      document.body.removeChild(modalContainer);
      
      // Обновляем список клиентов
      loadClients();
      
      // Показываем уведомление
      showNotification(getTranslation('clientDeleted', 'Client deleted successfully'), 'success');
    })
    .catch(error => {
      console.error('Error deleting client:', error);
      showNotification(getTranslation('errorDeletingClient', 'Error deleting client'), 'error');
    });
  });
  
  // Закрытие по клику вне модального окна
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
      document.body.removeChild(modalContainer);
    }
  });
}

// Helper function to show notifications
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Hide and remove after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 5000);
}

// Функция для получения перевода
function getTranslation(key, defaultText) {
  if (typeof window.erpLanguage !== 'undefined' && window.erpLanguage.translate) {
    return window.erpLanguage.translate(key);
  }
  
  // Получаем текущий язык
  const currentLanguage = window.currentLanguage || localStorage.getItem('erp_language') || 'en';
  
  // Переводы для часто используемых ключей
  const translations = {
    'ru': {
      'clientDetails': 'Детали клиента',
      'id': 'ID',
      'name': 'Название',
      'contactPerson': 'Контактное лицо',
      'email': 'Эл. почта',
      'phone': 'Телефон',
      'address': 'Адрес',
      'city': 'Город',
      'country': 'Страна',
      'notes': 'Примечания',
      'registrationDate': 'Дата регистрации',
      'lastOrderDate': 'Дата последнего заказа',
      'close': 'Закрыть',
      'edit': 'Редактировать',
      'delete': 'Удалить',
      'view': 'Просмотр',
      'addNewClient': 'Добавить нового клиента',
      'editClient': 'Редактировать клиента',
      'save': 'Сохранить',
      'cancel': 'Отмена',
      'clientUpdated': 'Клиент обновлен',
      'clientDeleted': 'Клиент удален',
      'confirmDelete': 'Подтвердите удаление',
      'confirmDeleteMessage': 'Вы уверены, что хотите удалить этого клиента?',
      'noClientsFound': 'Клиенты не найдены',
      'searchPlaceholder': 'Поиск клиентов...'
    },
    'az': {
      'clientDetails': 'Müştəri təfərrüatları',
      'id': 'ID',
      'name': 'Ad',
      'contactPerson': 'Əlaqə şəxsi',
      'email': 'E-poçt',
      'phone': 'Telefon',
      'address': 'Ünvan',
      'city': 'Şəhər',
      'country': 'Ölkə',
      'notes': 'Qeydlər',
      'registrationDate': 'Qeydiyyat tarixi',
      'lastOrderDate': 'Son sifariş tarixi',
      'close': 'Bağla',
      'edit': 'Redaktə et',
      'delete': 'Sil',
      'view': 'Bax',
      'addNewClient': 'Yeni müştəri əlavə et',
      'editClient': 'Müştərini redaktə et',
      'save': 'Saxla',
      'cancel': 'Ləğv et',
      'clientUpdated': 'Müştəri yeniləndi',
      'clientDeleted': 'Müştəri silindi',
      'confirmDelete': 'Silməyi təsdiqləyin',
      'confirmDeleteMessage': 'Bu müştərini silmək istədiyinizə əminsiniz?',
      'noClientsFound': 'Müştəri tapılmadı',
      'searchPlaceholder': 'Müştəriləri axtar...'
    }
  };
  
  if (translations[currentLanguage] && translations[currentLanguage][key]) {
    return translations[currentLanguage][key];
  }
  
  return defaultText || key;
}

// Вспомогательная функция для форматирования даты с учетом языка
function formatDate(dateString) {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  const currentLanguage = window.currentLanguage || localStorage.getItem('erp_language') || 'en';
  
  let formattedDate;
  
  if (currentLanguage === 'ru') {
    formattedDate = date.toLocaleDateString('ru-RU');
  } else if (currentLanguage === 'az') {
    formattedDate = date.toLocaleDateString('az-AZ');
  } else {
    formattedDate = date.toLocaleDateString('en-US');
  }
  
  return formattedDate;
}

// Адаптируем систему для работы с мобильными устройствами
// Проверка на маленький экран для мобильных устройств
function isMobileDevice() {
  return window.innerWidth <= 576;
}

// Функция для инициализации мобильных улучшений
function initMobileEnhancements() {
  // Добавляем индикатор прокрутки к таблицам, если находимся на мобильном устройстве
  if (isMobileDevice()) {
    const tableContainers = document.querySelectorAll('.table-responsive');
    tableContainers.forEach(container => {
      if (!container.querySelector('.scroll-indicator')) {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.textContent = getTranslation('swipeToScroll', 'Swipe horizontally to see more');
        container.appendChild(indicator);
      }
    });
  }
}
