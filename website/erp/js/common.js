// Common functionality shared across the application

// Языковые переводы
const translations = {
  'en': {
    // Общие элементы интерфейса
    'erpSystem': 'ERP System',
    'dashboard': 'Dashboard',
    'products': 'Products',
    'suppliers': 'Suppliers',
    'inventory': 'Inventory',
    'sales': 'Sales',
    'clients': 'Clients',
    'purchaseOrders': 'Purchase Orders',
    'reports': 'Reports',
    'logout': 'Logout',
    'admin': 'Admin',
    'exportPdf': 'Export PDF',
    'cancel': 'Cancel',
    'applyFilters': 'Apply Filters',
    // Procurement элементы
    'procurement': 'Procurement',
    'purchaseRequests': 'Purchase Requests',
    'priceComparison': 'Price Comparison',
    'contracts': 'Contracts',
    'newRequest': 'New Request',
    'comparePrices': 'Compare Prices',
    'requester': 'Requester',
    'department': 'Department',
    'requestDate': 'Request Date',
    'requestStatus': 'Status',
    'totalItems': 'Total Items',
    'supplierPrice': 'Supplier Price',
    'unitPrice': 'Unit Price',
    'totalPrice': 'Total Price',
    'deliveryTime': 'Delivery Time',
    'rating': 'Rating',
    'createPO': 'Create PO',
    'contractValue': 'Contract Value',
    'contractTerms': 'Terms & Conditions',
    'reason': 'Reason',
    'compareProduct': 'Compare Product Prices',
    // Отчеты
    'availableReports': 'Available Reports',
    'salesReport': 'Sales Report',
    'salesReportDesc': 'View sales performance over time',
    'inventoryReport': 'Inventory Report',
    'inventoryReportDesc': 'Current stock levels and valuation',
    'clientReport': 'Client Report',
    'clientReportDesc': 'Client activity and purchase history',
    'supplierReport': 'Supplier Report',
    'supplierReportDesc': 'Supplier performance and order history',
    'lowStockReport': 'Low Stock Report',
    'lowStockReportDesc': 'Products with low stock levels',
    'financialReport': 'Financial Report',
    'financialReportDesc': 'Revenue, expenses, and profit',
    'reportResults': 'Report Results',
    'reportFilters': 'Report Filters',
    'dateRange': 'Date Range',
    'today': 'Today',
    'thisWeek': 'This Week',
    'thisMonth': 'This Month',
    'thisQuarter': 'This Quarter',
    'thisYear': 'This Year',
    'customRange': 'Custom Range',
    'startDate': 'Start Date',
    'endDate': 'End Date',
    // Уведомления и ошибки
    'logoutError': 'Error during logout. Please try again.',
    'loadingData': 'Loading data...',
    'errorLoading': 'Error loading: ',
    'tryAgainLater': 'Please try again later or contact support.',
    'noDataAvailable': 'No inventory data available',
    'generatingPdf': 'Generating PDF...',
    'pdfNotImplemented': 'PDF generation is not implemented in this demo',
    'languageTooltip': 'Change system language',
    'visualizationPlaceholder': 'Visualization goes here',
  },
  'ru': {
    // Общие элементы интерфейса
    'erpSystem': 'ERP Система',
    'dashboard': 'Панель',
    'products': 'Товары',
    'suppliers': 'Поставщики',
    'inventory': 'Склад',
    'sales': 'Продажи',
    'clients': 'Клиенты',
    'purchaseOrders': 'Заказы',
    'reports': 'Отчеты',
    'logout': 'Выход',
    'admin': 'Админ',
    'exportPdf': 'Экспорт PDF',
    'cancel': 'Отмена',
    'applyFilters': 'Применить фильтры',
    // Procurement элементы
    'procurement': 'Закупки',
    'purchaseRequests': 'Заявки на покупку',
    'priceComparison': 'Сравнение цен',
    'contracts': 'Контракты',
    'newRequest': 'Новая заявка',
    'comparePrices': 'Сравнить цены',
    'requester': 'Запрашивающий',
    'department': 'Отдел',
    'requestDate': 'Дата запроса',
    'requestStatus': 'Статус',
    'totalItems': 'Всего товаров',
    'supplierPrice': 'Цена поставщика',
    'unitPrice': 'Цена за единицу',
    'totalPrice': 'Общая цена',
    'deliveryTime': 'Срок доставки',
    'rating': 'Рейтинг',
    'createPO': 'Создать заказ',
    'contractValue': 'Стоимость контракта',
    'contractTerms': 'Условия контракта',
    'reason': 'Причина',
    'compareProduct': 'Сравнить цены',
    // Отчеты
    'availableReports': 'Доступные отчеты',
    'salesReport': 'Отчет о продажах',
    'salesReportDesc': 'Просмотр показателей продаж за период',
    'inventoryReport': 'Отчет о складе',
    'inventoryReportDesc': 'Текущие уровни запасов и оценка',
    'clientReport': 'Отчет о клиентах',
    'clientReportDesc': 'Активность клиентов и история покупок',
    'supplierReport': 'Отчет о поставщиках',
    'supplierReportDesc': 'Эффективность поставщиков и история заказов',
    'lowStockReport': 'Отчет о низком запасе',
    'lowStockReportDesc': 'Товары с низким уровнем запасов',
    'financialReport': 'Финансовый отчет',
    'financialReportDesc': 'Доходы, расходы и прибыль',
    'reportResults': 'Результаты отчета',
    'reportFilters': 'Фильтры отчета',
    'dateRange': 'Период времени',
    'today': 'Сегодня',
    'thisWeek': 'Эта неделя',
    'thisMonth': 'Этот месяц',
    'thisQuarter': 'Этот квартал',
    'thisYear': 'Этот год',
    'customRange': 'Произвольный период',
    'startDate': 'Дата начала',
    'endDate': 'Дата окончания',
    // Уведомления и ошибки
    'logoutError': 'Ошибка при выходе из системы. Пожалуйста, попробуйте снова.',
    'loadingData': 'Загрузка данных...',
    'errorLoading': 'Ошибка загрузки: ',
    'tryAgainLater': 'Пожалуйста, попробуйте позже или обратитесь в службу поддержки.',
    'noDataAvailable': 'Данные по запасам отсутствуют',
    'generatingPdf': 'Генерация PDF...',
    'pdfNotImplemented': 'Генерация PDF не реализована в этой демо-версии',
    'languageTooltip': 'Изменить язык системы',
    'visualizationPlaceholder': 'Здесь будет визуализация',
  }
};

// Делаем доступными переводы глобально
window.translations = translations;

// Текущий язык (по умолчанию английский, если не задан)
let currentLanguage = localStorage.getItem('language') || 'en';

// Функция для перевода интерфейса
function translateUI() {
  console.log('Running translateUI()');
  const elements = document.querySelectorAll('[data-i18n]');
  console.log('Found elements with data-i18n:', elements.length);
  
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[currentLanguage][key]) {
      // Для элементов с подэлементами (например, кнопок с иконками)
      if (element.childElementCount > 0 && element.lastChild.nodeType === Node.TEXT_NODE) {
        element.lastChild.nodeValue = ' ' + translations[currentLanguage][key];
      } else {
        element.textContent = translations[currentLanguage][key];
      }
      console.log('Translated:', key, '->', translations[currentLanguage][key]);
    } else {
      console.warn('Translation not found for key:', key);
    }
  });
  
  // Дополнительно: обработка специфических элементов, которые не содержат data-i18n
  const usernameElement = document.getElementById('username');
  if (usernameElement && usernameElement.textContent === 'Admin') {
    usernameElement.textContent = translations[currentLanguage]['admin'];
  }
  
  // Особая обработка для элементов select
  translateSelectElements();
}

/**
 * Перевод опций для выпадающих списков
 * @param {HTMLSelectElement} select - элемент select для перевода
 */
function translateSelectOptions(select) {
  if (!select || !select.options) return;
  
  // Сохранить текущее выбранное значение
  const selectedValue = select.value;
  
  // Получить ключ группы переводов
  const translationGroup = select.getAttribute('data-i18n-options');
  if (!translationGroup || !translations[currentLanguage][translationGroup]) return;
  
  // Перевести каждую опцию
  Array.from(select.options).forEach(option => {
    const key = option.value;
    if (translations[currentLanguage][translationGroup][key]) {
      option.textContent = translations[currentLanguage][translationGroup][key];
    }
  });
  
  // Восстановить выбранное значение
  select.value = selectedValue;
}

/**
 * Перевод всех выпадающих списков на странице
 */
function translateSelectElements() {
  console.log('Translating select elements');
  const selects = document.querySelectorAll('select[data-i18n-options]');
  selects.forEach(select => {
    translateSelectOptions(select);
  });
}

/**
 * Особая функция для перевода страницы отчетов
 */
function translateReportsPage() {
  console.log('Translating Reports page specific elements');
  
  // Перевести заголовок активного отчета
  const reportResult = document.getElementById('report-result');
  if (reportResult && window.translateReportTitle && reportResult.style.display !== 'none') {
    const reportType = document.getElementById('report-filter-form')?.dataset.reportType;
    if (reportType) {
      window.translateReportTitle(reportType);
    }
  }
  
  // Перевести заголовки колонок таблицы отчета
  const reportTable = document.querySelector('#report-result table');
  if (reportTable) {
    const headers = reportTable.querySelectorAll('th');
    headers.forEach(header => {
      const originalText = header.dataset.originalText || header.textContent;
      if (!header.dataset.originalText) {
        header.dataset.originalText = originalText;
      }
      
      // Попытаться найти перевод для заголовка
      const key = originalText.trim().toLowerCase().replace(/\s+/g, '_');
      if (translations[currentLanguage][key]) {
        header.textContent = translations[currentLanguage][key];
      } else if (translations[currentLanguage]['report_columns'] && 
                translations[currentLanguage]['report_columns'][key]) {
        header.textContent = translations[currentLanguage]['report_columns'][key];
      }
    });
  }
  
  // Перевести кнопки и элементы управления отчетом
  const reportControls = document.querySelector('.report-controls');
  if (reportControls) {
    translateDynamicElements(reportControls);
  }
}

// Функция смены языка
function changeLanguage(language) {
  console.log('Changing language to:', language);
  if (translations[language]) {
    // Показать индикатор загрузки
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'translation-loading';
    document.body.appendChild(loadingIndicator);
    
    currentLanguage = language;
    localStorage.setItem('language', language);
    
    console.log('Translating UI elements...');
    // Принудительно обновить атрибут lang у html
    document.documentElement.lang = language;
    
    // Добавляем анимацию к элементам при переключении языка
    const animatedElements = document.querySelectorAll('[data-i18n]');
    animatedElements.forEach(element => {
      element.classList.add('language-change-active');
      
      // Удаляем класс анимации после её завершения
      setTimeout(() => {
        element.classList.remove('language-change-active');
      }, 500);
    });
    
    // Перевести все элементы с атрибутом data-i18n
    translateUI();
    
    // Перевести выпадающие списки отдельно (для надежности)
    translateSelectElements();
    
    // Обновить заголовок страницы
    updatePageTitle();
    
    // Обновить содержимое динамически созданных элементов
    translateDynamicElements();
    
    // Если мы на странице отчетов, перевести специфичные элементы
    if (window.location.href.includes('/reports.html')) {
      translateReportsPage();
      
      // Если доступна функция для перевода карточек отчетов из reports.js, вызовем ее
      if (typeof window.translateReportCards === 'function') {
        console.log('Вызываем функцию translateReportCards из reports.js');
        window.translateReportCards();
      }
    }
    
    // Вызов события изменения языка для обновления динамического контента
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }));
    
    // Показать уведомление о смене языка
    if (language === 'ru') {
      showNotification('Язык изменен на русский', 'info');
    } else {
      showNotification('Language changed to English', 'info');
    }
    
    // Обновляем выбранный язык в селекторе
    const languageSwitch = document.getElementById('language-switch');
    if (languageSwitch) {
      languageSwitch.value = language;
      
      // Анимируем селектор языка
      const languageSelector = document.querySelector('.language-selector');
      if (languageSelector) {
        languageSelector.classList.add('language-change-active');
        setTimeout(() => {
          languageSelector.classList.remove('language-change-active');
        }, 500);
      }
    }
    
    // Удалить индикатор загрузки через 800 мс
    setTimeout(() => {
      if (loadingIndicator && loadingIndicator.parentNode) {
        loadingIndicator.parentNode.removeChild(loadingIndicator);
      }
    }, 800);
    
    console.log('Language change completed');
  } else {
    console.error('Translation not available for language:', language);
  }
}

// Обновление заголовка страницы
function updatePageTitle() {
  // Определим текущую страницу по URL
  let pageName = 'reports';
  
  // Можно усложнить логику определения страницы при необходимости
  if (window.location.pathname.includes('dashboard')) {
    pageName = 'dashboard';
  } else if (window.location.pathname.includes('products')) {
    pageName = 'products';
  } else if (window.location.pathname.includes('suppliers')) {
    pageName = 'suppliers';
  } else if (window.location.pathname.includes('inventory')) {
    pageName = 'inventory';
  } else if (window.location.pathname.includes('sales')) {
    pageName = 'sales';
  } else if (window.location.pathname.includes('clients')) {
    pageName = 'clients';
  } else if (window.location.pathname.includes('purchase-orders')) {
    pageName = 'purchaseOrders';
  }
  
  // Получаем переведенные строки
  const pageTitle = translations[currentLanguage][pageName] || pageName;
  const erpSystem = translations[currentLanguage]['erpSystem'] || 'ERP System';
  
  // Обновляем заголовок
  document.title = `${pageTitle} - ${erpSystem}`;
  console.log('Updated page title to:', document.title);
}

// Дополнительная функция для перевода динамически созданных элементов
function translateDynamicElements(container = document) {
  // Перевести все элементы с атрибутом data-i18n в указанном контейнере
  const elements = container.querySelectorAll('[data-i18n]');
  if (elements.length > 0) {
    console.log(`Translating ${elements.length} dynamic elements in container`);
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (key && translations[currentLanguage] && translations[currentLanguage][key]) {
        element.textContent = translations[currentLanguage][key];
      }
    });
  }
  
  // Перевести все выпадающие списки в контейнере
  const selects = container.querySelectorAll('select[data-i18n-options]');
  if (selects.length > 0) {
    console.log(`Translating ${selects.length} dynamic select elements`);
    selects.forEach(select => {
      translateSelectOptions(select);
    });
  }
}

// Initialize sidebar toggle and submenus
function initSidebar() {
    console.log("Initializing sidebar menus...");
    
    // Toggle submenu
    const hasSubmenu = document.querySelectorAll('.has-submenu');
    console.log("Found submenu items:", hasSubmenu.length);
    
    hasSubmenu.forEach(item => {
        const submenuToggle = item.querySelector('a');
        if (submenuToggle) {
            submenuToggle.addEventListener('click', function(e) {
                console.log("Submenu clicked");
                e.preventDefault();
                e.stopPropagation();
                item.classList.toggle('submenu-active');
            });
        }
    });

    // If a submenu item is the current page, expand the submenu
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    console.log("Current path:", currentPath, "Current hash:", currentHash);
    
    hasSubmenu.forEach(item => {
        const submenuLinks = item.querySelectorAll('.submenu a');
        
        submenuLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            
            // Check if the current page is in this submenu
            if (currentPath.includes(linkPath.split('#')[0]) || 
                (currentHash && linkPath.includes(currentHash))) {
                console.log("Active submenu found:", linkPath);
                item.classList.add('submenu-active');
                link.parentElement.classList.add('active');
            }
        });
    });

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn') || document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logout();
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
  // Initialize sidebar if it exists on the page
  initSidebar();
  
  // Sidebar toggle functionality
  const toggleBtn = document.querySelector('.toggle-sidebar');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      document.querySelector('.app-container').classList.toggle('sidebar-collapsed');
    });
  }
  
  // Logout button functionality
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      fetch('/api/logout', {
        method: 'POST',
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            window.location.href = '/login.html';
          }
        })
        .catch(error => {
          console.error('Logout error:', error);
          alert(translations[currentLanguage]['logoutError']);
        });
    });
  }
  
  // Show username in the top bar if available
  const usernameElement = document.getElementById('username');
  if (usernameElement) {
    fetch('/api/user-info')
      .then(response => response.json())
      .then(data => {
        if (data.username) {
          usernameElement.textContent = data.username;
        }
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
      });
  }
  
  // Добавляем переключатель языка в верхнюю панель, если его еще нет
  if (!document.querySelector('.language-selector')) {
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
      const languageSelector = document.createElement('div');
      languageSelector.className = 'language-selector';
      languageSelector.innerHTML = `
        <select id="language-switch">
          <option value="en" ${currentLanguage === 'en' ? 'selected' : ''}>English</option>
          <option value="ru" ${currentLanguage === 'ru' ? 'selected' : ''}>Русский</option>
        </select>
      `;
      userInfo.insertBefore(languageSelector, userInfo.firstChild);
      
      // Добавляем обработчик событий на селектор языка
      document.getElementById('language-switch').addEventListener('change', function() {
        changeLanguage(this.value);
      });
    }
  }
  
  // Переводим интерфейс при загрузке страницы
  translateUI();
  
  // Set up global notification system
  setupNotifications();
});

// Set up notification system
function setupNotifications() {
  // Create notification container if it doesn't exist
  if (!document.querySelector('.notification-container')) {
    const container = document.createElement('div');
    container.className = 'notification-container';
    document.body.appendChild(container);
  }
}

/**
 * Показывает уведомление на странице
 * @param {string} message - текст уведомления
 * @param {string} type - тип уведомления (info, success, warning, error)
 * @param {number} duration - продолжительность отображения в миллисекундах
 */
function showNotification(message, type = 'info', duration = 3000) {
  // Удалить предыдущие уведомления
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notif => notif.remove());

  // Создать новое уведомление
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Добавить на страницу
  document.body.appendChild(notification);
  
  // Анимировать появление
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Удалить через указанное время
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, duration);
}

// Format currency
function formatCurrency(amount) {
  const formatter = currentLanguage === 'ru' 
    ? new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' })
    : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  
  return formatter.format(amount);
}

// Format date
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  
  const formatter = currentLanguage === 'ru'
    ? new Intl.DateTimeFormat('ru-RU', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
  
  return formatter.format(date);
}

// Simple date format (no time)
function formatSimpleDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  
  const formatter = currentLanguage === 'ru'
    ? new Intl.DateTimeFormat('ru-RU', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      })
    : new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
  
  return formatter.format(date);
}

// Get current date in ISO format
function getCurrentDateISO() {
  return new Date().toISOString().split('T')[0];
}

// Generate a PDF from HTML content
function generatePDF(elementId, filename) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found:', elementId);
    return;
  }
  
  html2pdf()
    .from(element)
    .save(filename);
}
