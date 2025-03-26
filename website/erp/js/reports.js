// Reports module

// Объект переводов для страницы отчетов
const reportTranslations = {
  'en': {
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
    'salesReportFilters': 'Sales Report Filters',
    'inventoryReportFilters': 'Inventory Report Filters',
    'clientReportFilters': 'Client Report Filters',
    'supplierReportFilters': 'Supplier Report Filters',
    'lowStockReportFilters': 'Low Stock Report Filters',
    'financialReportFilters': 'Financial Report Filters',
    'dateRange': 'Date Range',
    'today': 'Today',
    'thisWeek': 'This Week',
    'thisMonth': 'This Month',
    'thisQuarter': 'This Quarter',
    'thisYear': 'This Year',
    'customRange': 'Custom Range',
    'startDate': 'Start Date',
    'endDate': 'End Date',
    'client': 'Client',
    'allClients': 'All Clients',
    'status': 'Status',
    'allStatuses': 'All Statuses',
    'completed': 'Completed',
    'pending': 'Pending',
    'cancelled': 'Cancelled',
    'stockLevel': 'Stock Level',
    'allStockLevels': 'All Stock Levels',
    'lowStock': 'Low Stock',
    'normalStock': 'Normal Stock',
    'highStock': 'High Stock',
    'supplier': 'Supplier',
    'allSuppliers': 'All Suppliers',
    'transactionType': 'Transaction Type',
    'allTransactions': 'All Transactions',
    'sales': 'Sales',
    'purchases': 'Purchases',
    'loadingReportData': 'Loading report data...',
    'noDataAvailable': 'No data available for the selected filters.',
    'unknownReportType': 'Unknown report type.',
    'totalSales': 'Total Sales',
    'numberOfSales': 'Number of Sales',
    'averageSale': 'Average Sale',
    'salesOverTime': 'Sales Over Time',
    'chartPlaceholder': 'Chart visualization would be displayed here',
    'salesDetails': 'Sales Details',
    'id': 'ID',
    'date': 'Date',
    'client': 'Client',
    'amount': 'Amount',
    'status': 'Status',
    'totalProducts': 'Total Products',
    'totalStockValue': 'Total Stock Value',
    'lowStockItems': 'Low Stock Items',
    'inventoryDetails': 'Inventory Details',
    'product': 'Product',
    'currentStock': 'Current Stock',
    'minLevel': 'Min Level',
    'unitPrice': 'Unit Price',
    'totalValue': 'Total Value',
    'clientReportWip': 'Client report implementation coming soon.',
    'supplierReportWip': 'Supplier report implementation coming soon.',
    'lowStockReportWip': 'Low stock report implementation coming soon.',
    'financialReportWip': 'Financial report implementation coming soon.',
    'generatingPdf': 'Generating PDF...',
    'pdfNotImplemented': 'PDF generation is not implemented in this demo',
    'errorLoadingClients': 'Error loading clients for filter:',
    'errorLoadingSuppliers': 'Error loading suppliers for filter:'
  },
  'ru': {
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
    'salesReportFilters': 'Фильтры отчета о продажах',
    'inventoryReportFilters': 'Фильтры отчета о складе',
    'clientReportFilters': 'Фильтры отчета о клиентах',
    'supplierReportFilters': 'Фильтры отчета о поставщиках',
    'lowStockReportFilters': 'Фильтры отчета о низком запасе',
    'financialReportFilters': 'Фильтры финансового отчета',
    'dateRange': 'Период времени',
    'today': 'Сегодня',
    'thisWeek': 'Эта неделя',
    'thisMonth': 'Этот месяц',
    'thisQuarter': 'Этот квартал',
    'thisYear': 'Этот год',
    'customRange': 'Произвольный период',
    'startDate': 'Дата начала',
    'endDate': 'Дата окончания',
    'client': 'Клиент',
    'allClients': 'Все клиенты',
    'status': 'Статус',
    'allStatuses': 'Все статусы',
    'completed': 'Выполнено',
    'pending': 'В ожидании',
    'cancelled': 'Отменено',
    'stockLevel': 'Уровень запасов',
    'allStockLevels': 'Все уровни запасов',
    'lowStock': 'Низкий запас',
    'normalStock': 'Нормальный запас',
    'highStock': 'Высокий запас',
    'supplier': 'Поставщик',
    'allSuppliers': 'Все поставщики',
    'transactionType': 'Тип транзакции',
    'allTransactions': 'Все транзакции',
    'sales': 'Продажи',
    'purchases': 'Закупки',
    'loadingReportData': 'Загрузка данных отчета...',
    'noDataAvailable': 'Нет данных для выбранных фильтров.',
    'unknownReportType': 'Неизвестный тип отчета.',
    'totalSales': 'Общие продажи',
    'numberOfSales': 'Количество продаж',
    'averageSale': 'Средняя продажа',
    'salesOverTime': 'Продажи за период',
    'chartPlaceholder': 'Здесь будет отображаться график',
    'salesDetails': 'Детали продаж',
    'id': 'ID',
    'date': 'Дата',
    'client': 'Клиент',
    'amount': 'Сумма',
    'status': 'Статус',
    'totalProducts': 'Всего товаров',
    'totalStockValue': 'Общая стоимость запасов',
    'lowStockItems': 'Товары с низким запасом',
    'inventoryDetails': 'Детали инвентаря',
    'product': 'Товар',
    'currentStock': 'Текущий запас',
    'minLevel': 'Мин. уровень',
    'unitPrice': 'Цена за единицу',
    'totalValue': 'Общая стоимость',
    'clientReportWip': 'Отчет о клиентах в разработке.',
    'supplierReportWip': 'Отчет о поставщиках в разработке.',
    'lowStockReportWip': 'Отчет о низком запасе в разработке.',
    'financialReportWip': 'Финансовый отчет в разработке.',
    'generatingPdf': 'Генерация PDF...',
    'pdfNotImplemented': 'Генерация PDF не реализована в этой демо-версии',
    'errorLoadingClients': 'Ошибка загрузки клиентов для фильтра:',
    'errorLoadingSuppliers': 'Ошибка загрузки поставщиков для фильтра:'
  }
};

// Добавляем локальные переводы в глобальные
if (window.translations) {
  for (const lang in reportTranslations) {
    if (!window.translations[lang]) {
      window.translations[lang] = {};
    }
    for (const key in reportTranslations[lang]) {
      window.translations[lang][key] = reportTranslations[lang][key];
    }
  }
}

// Функция получения текста на текущем языке
function getTranslatedText(key) {
  // Текущий язык берем из общего модуля
  const lang = localStorage.getItem('language') || 'en';
  
  // Сначала проверяем в локальных переводах для отчетов
  if (reportTranslations[lang] && reportTranslations[lang][key]) {
    return reportTranslations[lang][key];
  }
  
  // Затем в общих переводах (если они доступны из common.js)
  if (window.translations && window.translations[lang] && window.translations[lang][key]) {
    return window.translations[lang][key];
  }
  
  // Если перевод не найден, возвращаем ключ
  console.warn('Translation not found for key:', key);
  return key;
}

// Функция для перевода заголовка отчета
window.translateReportTitle = function(reportType) {
  console.log('Translating report title for:', reportType);
  const reportTitleElement = document.getElementById('report-title');
  if (!reportTitleElement) return;
  
  // Сохраняем оригинальный текст, если еще не сохранен
  if (!reportTitleElement.dataset.originalText) {
    reportTitleElement.dataset.originalText = reportTitleElement.textContent;
  }
  
  // Если в reportTranslations есть перевод для этого типа отчета
  if (reportTranslations[currentLanguage] && 
      reportTranslations[currentLanguage][reportType]) {
    reportTitleElement.textContent = reportTranslations[currentLanguage][reportType];
    return;
  }
  
  // Если нет специального перевода, но есть в основных переводах
  const key = `report_${reportType}`;
  if (translations[currentLanguage] && translations[currentLanguage][key]) {
    reportTitleElement.textContent = translations[currentLanguage][key];
    return;
  }
  
  // Если перевода нет, вернуть оригинальный текст
  reportTitleElement.textContent = reportTitleElement.dataset.originalText;
};

document.addEventListener('DOMContentLoaded', function() {
  // Check if on reports page
  if (!document.querySelector('.reports-grid')) return;
  
  console.log('Reports page initialized');
  
  // Setup event listeners
  document.getElementById('date-range').addEventListener('change', function() {
    const customDateRange = document.getElementById('custom-date-range');
    if (this.value === 'custom') {
      customDateRange.style.display = 'block';
    } else {
      customDateRange.style.display = 'none';
    }
  });
  
  // Set up modal close buttons
  const closeButtons = document.querySelectorAll('.modal .close, .btn[data-dismiss="modal"]');
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      modal.style.display = 'none';
    });
  });
  
  // Apply filters button
  document.getElementById('apply-filters').addEventListener('click', function() {
    const reportType = document.getElementById('report-filter-form').dataset.reportType;
    const dateRange = document.getElementById('date-range').value;
    
    let startDate, endDate;
    if (dateRange === 'custom') {
      startDate = document.getElementById('start-date').value;
      endDate = document.getElementById('end-date').value;
    }
    
    // Close modal
    document.getElementById('report-filter-modal').style.display = 'none';
    
    // Fetch report data with filters
    fetchReportData(reportType, dateRange, startDate, endDate);
  });
  
  // Export PDF button
  document.getElementById('export-pdf').addEventListener('click', function() {
    const reportTitle = document.getElementById('report-title').textContent;
    generatePDF('report-content', reportTitle.replace(/\s+/g, '_') + '.pdf');
  });
  
  // Обработчик события изменения языка
  document.addEventListener('languageChanged', function(e) {
    console.log('Language changed event received in reports.js:', e.detail.language);
    
    // Обновить заголовок активного отчета, если он есть
    const reportFilterForm = document.getElementById('report-filter-form');
    if (reportFilterForm && reportFilterForm.dataset.reportType) {
      window.translateReportTitle(reportFilterForm.dataset.reportType);
    }
    
    // Обновить все элементы с переводами
    translateReportElements();
  });
  
  /**
   * Дополнительная функция для перевода всех элементов на странице отчетов
   */
  function translateReportElements() {
    console.log('Translating all report-specific elements');
    
    // Перевести заголовки в таблице результатов
    const tableHeaders = document.querySelectorAll('#report-result table th');
    if (tableHeaders.length > 0) {
      tableHeaders.forEach(header => {
        // Сохраняем оригинальный текст, если еще не сохранен
        if (!header.dataset.originalText) {
          header.dataset.originalText = header.textContent;
        }
        
        // Преобразуем текст заголовка в ключ для перевода
        const key = header.dataset.originalText.toLowerCase().replace(/\s+/g, '_');
        
        // Ищем перевод
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
          header.textContent = translations[currentLanguage][key];
        } else if (translations[currentLanguage] && 
                 translations[currentLanguage]['report_columns'] && 
                 translations[currentLanguage]['report_columns'][key]) {
          header.textContent = translations[currentLanguage]['report_columns'][key];
        }
      });
    }
    
    // Перевести все селекты фильтров
    const filterSelects = document.querySelectorAll('#report-filter-form select');
    filterSelects.forEach(select => {
      if (select.hasAttribute('data-i18n-options')) {
        translateSelectOptions(select);
      } else {
        // Добавляем атрибут data-i18n-options, если его еще нет
        select.setAttribute('data-i18n-options', 'report_filters');
        translateSelectOptions(select);
      }
    });
    
    // Перевести все кнопки на странице
    const buttons = document.querySelectorAll('button, input[type="button"]');
    buttons.forEach(button => {
      if (button.hasAttribute('data-i18n')) {
        const key = button.getAttribute('data-i18n');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
          button.value = translations[currentLanguage][key];
          button.textContent = translations[currentLanguage][key];
        }
      }
    });
  }
  
  // Функция для перевода опций в выпадающих списках (если не доступна из common.js)
  function translateSelectOptions(select) {
    if (!select || !select.options) return;
    
    console.log('Translating select options for:', select.id || 'unnamed select');
    
    // Сохранить текущее выбранное значение
    const selectedValue = select.value;
    
    // Получить ключ группы переводов
    const translationGroup = select.getAttribute('data-i18n-options');
    if (!translationGroup) {
      console.warn('Select element does not have data-i18n-options attribute');
      return;
    }
    
    if (!translations[currentLanguage] || !translations[currentLanguage][translationGroup]) {
      console.warn(`Translation group '${translationGroup}' not found for language '${currentLanguage}'`);
      return;
    }
    
    // Перевести каждую опцию
    Array.from(select.options).forEach(option => {
      const key = option.value;
      const translationObj = translations[currentLanguage][translationGroup];
      
      if (translationObj[key]) {
        console.log(`Translating option '${key}' to '${translationObj[key]}'`);
        option.textContent = translationObj[key];
      } else {
        console.warn(`Translation not found for option '${key}' in group '${translationGroup}'`);
      }
    });
    
    // Восстановить выбранное значение
    select.value = selectedValue;
  }
  
  // Первичная инициализация переводов
  if (localStorage.getItem('language')) {
    currentLanguage = localStorage.getItem('language');
    console.log('Initial language from localStorage:', currentLanguage);
  }
  console.log('Initializing reports with language:', currentLanguage);
  
  // Перевести все элементы на странице отчетов при загрузке
  setTimeout(() => {
    translateReportElements();
  }, 100);
});

// Обновление всех переводов на странице отчетов
function updateReportTranslations() {
  // Если у нас уже открыт отчет, нужно его перерендерить
  const reportResult = document.getElementById('report-result');
  if (reportResult && reportResult.style.display !== 'none') {
    const reportType = document.getElementById('report-filter-form').dataset.reportType;
    if (reportType) {
      console.log('Re-rendering report after language change:', reportType);
      translateReportTitle(reportType);
      
      // Если у нас есть данные отчета в кэше, перерисовать их
      // Это зависит от конкретной реализации
    }
  }
  
  // Обновить опции в выпадающих списках
  const selectElements = document.querySelectorAll('select');
  selectElements.forEach(select => {
    Array.from(select.options).forEach(option => {
      const i18nKey = option.getAttribute('data-i18n');
      if (i18nKey) {
        option.textContent = getTranslatedText(i18nKey);
      }
    });
  });
}

// Generate report based on type
function generateReport(reportType) {
  console.log('Generating report:', reportType);
  // Show filter modal with appropriate filters
  const filterModal = document.getElementById('report-filter-modal');
  const filterForm = document.getElementById('report-filter-form');
  const additionalFilters = document.getElementById('additional-filters');
  
  // Set report type as data attribute
  filterForm.dataset.reportType = reportType;
  
  // Clear previous additional filters
  additionalFilters.innerHTML = '';
  
  // Set filter title based on report type
  let filterTitleKey = 'reportFilters';
  
  // Add specific filters based on report type
  switch (reportType) {
    case 'sales':
      filterTitleKey = 'salesReportFilters';
      additionalFilters.innerHTML = `
        <div class="form-group">
          <label for="client-filter" data-i18n="client">${getTranslatedText('client')}</label>
          <select id="client-filter">
            <option value="" data-i18n="allClients">${getTranslatedText('allClients')}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="status-filter" data-i18n="status">${getTranslatedText('status')}</label>
          <select id="status-filter">
            <option value="" data-i18n="allStatuses">${getTranslatedText('allStatuses')}</option>
            <option value="completed" data-i18n="completed">${getTranslatedText('completed')}</option>
            <option value="pending" data-i18n="pending">${getTranslatedText('pending')}</option>
            <option value="cancelled" data-i18n="cancelled">${getTranslatedText('cancelled')}</option>
          </select>
        </div>
      `;
      // Load clients for filter
      loadClientsForFilter();
      break;
      
    case 'inventory':
      filterTitleKey = 'inventoryReportFilters';
      additionalFilters.innerHTML = `
        <div class="form-group">
          <label for="stock-filter" data-i18n="stockLevel">${getTranslatedText('stockLevel')}</label>
          <select id="stock-filter">
            <option value="" data-i18n="allStockLevels">${getTranslatedText('allStockLevels')}</option>
            <option value="low" data-i18n="lowStock">${getTranslatedText('lowStock')}</option>
            <option value="normal" data-i18n="normalStock">${getTranslatedText('normalStock')}</option>
            <option value="high" data-i18n="highStock">${getTranslatedText('highStock')}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="supplier-filter" data-i18n="supplier">${getTranslatedText('supplier')}</label>
          <select id="supplier-filter">
            <option value="" data-i18n="allSuppliers">${getTranslatedText('allSuppliers')}</option>
          </select>
        </div>
      `;
      // Load suppliers for filter
      loadSuppliersForFilter();
      break;
      
    case 'clients':
      filterTitleKey = 'clientReportFilters';
      break;
      
    case 'suppliers':
      filterTitleKey = 'supplierReportFilters';
      break;
      
    case 'lowstock':
      filterTitleKey = 'lowStockReportFilters';
      break;
      
    case 'financial':
      filterTitleKey = 'financialReportFilters';
      additionalFilters.innerHTML = `
        <div class="form-group">
          <label for="transaction-type" data-i18n="transactionType">${getTranslatedText('transactionType')}</label>
          <select id="transaction-type">
            <option value="" data-i18n="allTransactions">${getTranslatedText('allTransactions')}</option>
            <option value="sales" data-i18n="sales">${getTranslatedText('sales')}</option>
            <option value="purchases" data-i18n="purchases">${getTranslatedText('purchases')}</option>
          </select>
        </div>
      `;
      break;
  }
  
  // Update filter title
  document.getElementById('filter-title').textContent = getTranslatedText(filterTitleKey);
  
  // Show filter modal
  filterModal.style.display = 'block';
}

// Fetch report data with filters
function fetchReportData(reportType, dateRange, startDate, endDate) {
  // Prepare query parameters
  let params = new URLSearchParams();
  params.append('type', reportType);
  params.append('dateRange', dateRange);
  
  if (dateRange === 'custom') {
    params.append('startDate', startDate);
    params.append('endDate', endDate);
  }
  
  // Add additional filters based on report type
  switch (reportType) {
    case 'sales':
      const clientFilter = document.getElementById('client-filter');
      const statusFilter = document.getElementById('status-filter');
      
      if (clientFilter && clientFilter.value) {
        params.append('clientId', clientFilter.value);
      }
      
      if (statusFilter && statusFilter.value) {
        params.append('status', statusFilter.value);
      }
      break;
      
    case 'inventory':
      const stockFilter = document.getElementById('stock-filter');
      const supplierFilter = document.getElementById('supplier-filter');
      
      if (stockFilter && stockFilter.value) {
        params.append('stockLevel', stockFilter.value);
      }
      
      if (supplierFilter && supplierFilter.value) {
        params.append('supplierId', supplierFilter.value);
      }
      break;
      
    case 'financial':
      const transactionType = document.getElementById('transaction-type');
      
      if (transactionType && transactionType.value) {
        params.append('transactionType', transactionType.value);
      }
      break;
  }
  
  // Show loading state
  document.getElementById('report-result').style.display = 'block';
  document.getElementById('report-content').innerHTML = `<div class="loading">${getTranslatedText('loadingReportData')}</div>`;
  
  // Set report title
  translateReportTitle(reportType);
  
  // Fetch report data
  fetch(`/api/reports?${params.toString()}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(getTranslatedText('errorLoading'));
      }
      return response.json();
    })
    .then(data => {
      renderReportData(reportType, data);
    })
    .catch(error => {
      document.getElementById('report-content').innerHTML = `
        <div class="error-message">
          <p>${getTranslatedText('errorLoading')} ${error.message}</p>
          <p>${getTranslatedText('tryAgainLater')}</p>
        </div>
      `;
    });
}

// Render report data based on type
function renderReportData(reportType, data) {
  const reportContent = document.getElementById('report-content');
  
  // If no data or empty data
  if (!data || !data.data || data.data.length === 0) {
    reportContent.innerHTML = `<div class="no-data">${getTranslatedText('noDataAvailable')}</div>`;
    return;
  }
  
  // Render based on report type
  switch (reportType) {
    case 'sales':
      renderSalesReport(data);
      break;
      
    case 'inventory':
      renderInventoryReport(data);
      break;
      
    case 'clients':
      renderClientsReport(data);
      break;
      
    case 'suppliers':
      renderSuppliersReport(data);
      break;
      
    case 'lowstock':
      renderLowStockReport(data);
      break;
      
    case 'financial':
      renderFinancialReport(data);
      break;
      
    default:
      reportContent.innerHTML = `<div class="error-message">${getTranslatedText('unknownReportType')}</div>`;
  }
}

// Helper functions to render specific reports
function renderSalesReport(data) {
  const reportContent = document.getElementById('report-content');
  
  reportContent.innerHTML = `
    <div class="report-summary">
      <div class="summary-item">
        <h4 data-i18n="totalSales">${getTranslatedText('totalSales')}</h4>
        <div class="summary-value">${formatCurrency(data.totalSales || 0)}</div>
      </div>
      <div class="summary-item">
        <h4 data-i18n="numberOfSales">${getTranslatedText('numberOfSales')}</h4>
        <div class="summary-value">${data.data.length}</div>
      </div>
      <div class="summary-item">
        <h4 data-i18n="averageSale">${getTranslatedText('averageSale')}</h4>
        <div class="summary-value">${formatCurrency(data.averageSale || 0)}</div>
      </div>
    </div>
    
    <div class="report-chart">
      <h4 data-i18n="salesOverTime">${getTranslatedText('salesOverTime')}</h4>
      <div class="chart-placeholder">${getTranslatedText('chartPlaceholder')}</div>
    </div>
    
    <h4 data-i18n="salesDetails">${getTranslatedText('salesDetails')}</h4>
    <table class="data-table">
      <thead>
        <tr>
          <th data-i18n="id">${getTranslatedText('id')}</th>
          <th data-i18n="date">${getTranslatedText('date')}</th>
          <th data-i18n="client">${getTranslatedText('client')}</th>
          <th data-i18n="amount">${getTranslatedText('amount')}</th>
          <th data-i18n="status">${getTranslatedText('status')}</th>
        </tr>
      </thead>
      <tbody>
        ${data.data.map(sale => `
          <tr>
            <td>${sale.id}</td>
            <td>${formatDate(sale.sale_date)}</td>
            <td>${sale.client_name}</td>
            <td>${formatCurrency(sale.total_amount)}</td>
            <td><span class="status-badge status-${sale.status.toLowerCase()}">${getStatusTranslation(sale.status)}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Перевод статусов
function getStatusTranslation(status) {
  switch(status.toLowerCase()) {
    case 'completed': return getTranslatedText('completed');
    case 'pending': return getTranslatedText('pending');
    case 'cancelled': return getTranslatedText('cancelled');
    default: return status;
  }
}

function renderInventoryReport(data) {
  const reportContent = document.getElementById('report-content');
  
  reportContent.innerHTML = `
    <div class="report-summary">
      <div class="summary-item">
        <h4 data-i18n="totalProducts">${getTranslatedText('totalProducts')}</h4>
        <div class="summary-value">${data.totalProducts || 0}</div>
      </div>
      <div class="summary-item">
        <h4 data-i18n="totalStockValue">${getTranslatedText('totalStockValue')}</h4>
        <div class="summary-value">${formatCurrency(data.totalValue || 0)}</div>
      </div>
      <div class="summary-item">
        <h4 data-i18n="lowStockItems">${getTranslatedText('lowStockItems')}</h4>
        <div class="summary-value">${data.lowStockCount || 0}</div>
      </div>
    </div>
    
    <h4 data-i18n="inventoryDetails">${getTranslatedText('inventoryDetails')}</h4>
    <table class="data-table">
      <thead>
        <tr>
          <th data-i18n="id">${getTranslatedText('id')}</th>
          <th data-i18n="product">${getTranslatedText('product')}</th>
          <th data-i18n="currentStock">${getTranslatedText('currentStock')}</th>
          <th data-i18n="minLevel">${getTranslatedText('minLevel')}</th>
          <th data-i18n="unitPrice">${getTranslatedText('unitPrice')}</th>
          <th data-i18n="totalValue">${getTranslatedText('totalValue')}</th>
        </tr>
      </thead>
      <tbody>
        ${data.data.map(product => `
          <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.current_stock}</td>
            <td>${product.min_stock_level}</td>
            <td>${formatCurrency(product.unit_price)}</td>
            <td>${formatCurrency(product.current_stock * product.unit_price)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Helper functions for loading filter options
function loadClientsForFilter() {
  fetch('/api/clients')
    .then(response => response.json())
    .then(data => {
      const clientFilter = document.getElementById('client-filter');
      
      if (data.clients && data.clients.length > 0) {
        data.clients.forEach(client => {
          const option = document.createElement('option');
          option.value = client.id;
          option.textContent = client.name;
          clientFilter.appendChild(option);
        });
      }
    })
    .catch(error => {
      console.error(getTranslatedText('errorLoadingClients'), error);
    });
}

function loadSuppliersForFilter() {
  fetch('/api/suppliers')
    .then(response => response.json())
    .then(data => {
      const supplierFilter = document.getElementById('supplier-filter');
      
      if (data.suppliers && data.suppliers.length > 0) {
        data.suppliers.forEach(supplier => {
          const option = document.createElement('option');
          option.value = supplier.id;
          option.textContent = supplier.name;
          supplierFilter.appendChild(option);
        });
      }
    })
    .catch(error => {
      console.error(getTranslatedText('errorLoadingSuppliers'), error);
    });
}

// Placeholder functions for other report types
function renderClientsReport(data) {
  const reportContent = document.getElementById('report-content');
  reportContent.innerHTML = `<div class="placeholder">${getTranslatedText('clientReportWip')}</div>`;
}

function renderSuppliersReport(data) {
  const reportContent = document.getElementById('report-content');
  reportContent.innerHTML = `<div class="placeholder">${getTranslatedText('supplierReportWip')}</div>`;
}

function renderLowStockReport(data) {
  const reportContent = document.getElementById('report-content');
  reportContent.innerHTML = `<div class="placeholder">${getTranslatedText('lowStockReportWip')}</div>`;
}

function renderFinancialReport(data) {
  const reportContent = document.getElementById('report-content');
  reportContent.innerHTML = `<div class="placeholder">${getTranslatedText('financialReportWip')}</div>`;
}

// PDF Generation function
function generatePDF(elementId, filename) {
  const element = document.getElementById(elementId);
  if (!element) {
    showNotification('Error generating PDF: Element not found', 'error');
    return;
  }
  
  // Show loading notification
  showNotification(getTranslatedText('generatingPdf'), 'info');
  
  // In a real application, you would use a library like jsPDF or html2pdf
  // For this demo, we'll just show a notification
  setTimeout(() => {
    showNotification(getTranslatedText('pdfNotImplemented'), 'warning');
  }, 1500);
}

// Show notification function (reusing from common.js)
function showNotification(message, type = 'info') {
  // Check if notification container exists, if not create it
  let notificationContainer = document.getElementById('notification-container');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    document.body.appendChild(notificationContainer);
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <span class="notification-message">${message}</span>
    <button class="notification-close">&times;</button>
  `;
  
  // Add to container
  notificationContainer.appendChild(notification);
  
  // Add close button functionality
  const closeButton = notification.querySelector('.notification-close');
  closeButton.addEventListener('click', () => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.classList.add('fade-out');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}
