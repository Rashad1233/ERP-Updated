// Reports module

/**
 * Функция для загрузки библиотеки jsPDF
 * @returns {Promise} Промис, который разрешается, когда библиотека загружена
 */
async function loadJsPdfLibrary() {
  try {
    if (window.jspdf && window.jspdf.jsPDF) {
      console.log('jsPDF is already loaded');
      return true;
    }

    console.log('Loading jsPDF library...');
    
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => {
        if (window.jspdf && window.jspdf.jsPDF) {
          resolve();
        } else {
          reject(new Error('jsPDF was not initialized after loading'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load jsPDF'));
      document.head.appendChild(script);
    });

    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load jsPDF-AutoTable'));
      document.head.appendChild(script);
    });

    console.log('jsPDF successfully loaded');
    return true;
  } catch (error) {
    console.error('Error loading jsPDF:', error);
    showNotification('Error loading PDF library: ' + error.message, 'error');
    return false;
  }
}

/**
 * Проверка и инициализация объекта переводов
 */
function initializeTranslations() {
  // Мы проверяем, были ли уже инициализированы переводы
  if (window.translations) {
    return; // Если переводы уже инициализированы, то возвращаемся
  }
  
  // Определяем ключи, которые должны быть переведены
  const keys = [
    // Общие ключи для отчетов
    'generated', 'exportToPdf', 'exportSection', 'id', 'name', 'date', 'status',
    'total', 'description', 'type', 'source', 'amount', 'quantity', 'price',
    'contactPerson', 'email', 'phone', 'address',
    
    // Ключи для отчета о складе
    'inventoryReport', 'productsSummary', 'totalProducts', 'lowStockItems',
    'searchProducts', 'noDataAvailable', 'visualizationPlaceholder',
    'productName', 'category', 'currentStock', 'minStock', 'supplierName',
    'stockVisualization', 'tryAdjustingFilters', 'inventoryDetails', 'inventoryDistribution',
    'totalValue', 'unitPrice', 'value', 'outOfStock', 'lowStock', 'criticalStock', 'inStock',
    
    // Ключи для отчета о клиентах
    'clientReport', 'exportFullReport', 'clientsSummary', 'totalClients',
    'newClientsThisMonth', 'activeClients', 'inactiveClients', 'clientsList',
    'searchClients', 'lastOrder', 'orderTotal', 'orderCount', 'orderStatus',
    'noClientData',
    
    // Ключи для отчета о поставщиках
    'supplierReport', 'suppliersSummary', 'totalSuppliers', 'suppliersList',
    'searchSuppliers', 'paymentTerms', 'noSupplierData',
    
    // Ключи для отчета о товарах с низким запасом
    'lowStockReport', 'lowStockSummary', 'lowStockItemsList', 'searchLowStockItems', 
    'totalLowStockItems', 'noLowStockData',
    
    // Ключи для финансового отчета
    'financialReport', 'financialSummary', 'totalIncome', 'totalExpenses',
    'totalSales', 'totalPurchases', 'netProfit', 'transactions', 'searchTransactions', 
    'noFinancialData', 'income', 'expense', 'sale', 'purchase'
  ];
  
  // Создаем объект с переводами для каждого ключа
  window.translations = {
    'en': {
      // Общие переводы
      'generated': 'Generated',
      'exportToPdf': 'Export to PDF',
      'exportSection': 'Export Section',
      'id': 'ID',
      'name': 'Name',
      'date': 'Date',
      'status': 'Status',
      'total': 'Total',
      'description': 'Description',
      'type': 'Type',
      'source': 'Source',
      'amount': 'Amount',
      'quantity': 'Quantity',
      'price': 'Price',
      'contactPerson': 'Contact Person',
      'email': 'Email',
      'phone': 'Phone',
      'address': 'Address',
      
      // Переводы для отчета о складе
      'inventoryReport': 'Inventory Report',
      'productsSummary': 'Products Summary',
      'totalProducts': 'Total Products',
      'lowStockItems': 'Low Stock Items',
      'searchProducts': 'Search products...',
      'noDataAvailable': 'No inventory data available',
      'visualizationPlaceholder': 'Visualization goes here',
      'productName': 'Product Name',
      'category': 'Category',
      'currentStock': 'Current Stock',
      'minStock': 'Min Stock',
      'supplierName': 'Supplier',
      'stockVisualization': 'Stock Visualization',
      'tryAdjustingFilters': 'Try adjusting your filters or adding products to your inventory',
      'inventoryDetails': 'Inventory Details',
      'inventoryDistribution': 'Inventory Distribution',
      'totalValue': 'Total Value',
      'unitPrice': 'Unit Price',
      'value': 'Value',
      'outOfStock': 'Out of Stock',
      'lowStock': 'Low Stock',
      'criticalStock': 'Critical Stock',
      'inStock': 'In Stock',
      
      // Категории товаров
      'laptops': 'Laptops',
      'smartphones': 'Smartphones',
      'tablets': 'Tablets',
      'monitors': 'Monitors',
      'printers': 'Printers',
      'peripherals': 'Peripherals',
      'audio': 'Audio',
      'dataStorage': 'Data Storage',
      'networkEquipment': 'Network Equipment',
      'components': 'Components',
      
      // Переводы для отчета о клиентах
      'clientReport': 'Client Report',
      'exportFullReport': 'Export Full Report to PDF',
      'clientsSummary': 'Clients Summary',
      'totalClients': 'Total Clients',
      'newClientsThisMonth': 'New Clients This Month',
      'activeClients': 'Active Clients',
      'inactiveClients': 'Inactive Clients',
      'clientsList': 'Clients List',
      'searchClients': 'Search clients...',
      'lastOrder': 'Last Order',
      'orderTotal': 'Order Total',
      'orderCount': 'Order Count',
      'orderStatus': 'Order Status',
      'noClientData': 'No client data available to display.',
      
      // Переводы для отчета о поставщиках
      'supplierReport': 'Supplier Report',
      'suppliersSummary': 'Suppliers Summary',
      'totalSuppliers': 'Total Suppliers',
      'suppliersList': 'Suppliers List',
      'searchSuppliers': 'Search suppliers...',
      'paymentTerms': 'Payment Terms',
      'noSupplierData': 'No supplier data available to display.',
      
      // Переводы для отчета о товарах с низким запасом
      'lowStockReport': 'Low Stock Report',
      'lowStockSummary': 'Low Stock Summary',
      'lowStockItemsList': 'Low Stock Items List',
      'searchLowStockItems': 'Search low stock items...',
      'totalLowStockItems': 'Total Low Stock Items',
      'noLowStockData': 'No low stock data available to display.',
      
      // Переводы для финансового отчета
      'financialReport': 'Financial Report',
      'financialSummary': 'Financial Summary',
      'totalIncome': 'Total Income',
      'totalExpenses': 'Total Expenses',
      'totalSales': 'Total Sales',
      'totalPurchases': 'Total Purchases',
      'netProfit': 'Net Profit',
      'transactions': 'Transactions',
      'searchTransactions': 'Search transactions...',
      'noFinancialData': 'No financial data to display.',
      'income': 'Income',
      'expense': 'Expense',
      'sale': 'Sale',
      'purchase': 'Purchase'
    },
    'ru': {
      // Общие переводы
      'generated': 'Сформировано',
      'exportToPdf': 'Экспорт в PDF',
      'exportSection': 'Экспорт раздела',
      'id': 'ИД',
      'name': 'Название',
      'date': 'Дата',
      'status': 'Статус',
      'total': 'Всего',
      'description': 'Описание',
      'type': 'Тип',
      'source': 'Источник',
      'amount': 'Сумма',
      'quantity': 'Количество',
      'price': 'Цена',
      'contactPerson': 'Контактное лицо',
      'email': 'Эл. почта',
      'phone': 'Телефон',
      'address': 'Адрес',
      
      // Переводы для отчета о складе
      'inventoryReport': 'Отчет о складе',
      'productsSummary': 'Сводка по товарам',
      'totalProducts': 'Всего товаров',
      'lowStockItems': 'Товары с низким запасом',
      'searchProducts': 'Поиск товаров...',
      'noDataAvailable': 'Нет данных о товарах для отображения',
      'visualizationPlaceholder': 'Здесь будет визуализация',
      'productName': 'Название товара',
      'category': 'Категория',
      'currentStock': 'Текущий запас',
      'minStock': 'Мин. запас',
      'supplierName': 'Поставщик',
      'stockVisualization': 'Визуализация запасов',
      'tryAdjustingFilters': 'Попробуйте отрегулировать фильтры или добавить товары в ваш инвентарь',
      'inventoryDetails': 'Детали инвентаря',
      'inventoryDistribution': 'Распределение инвентаря',
      'totalValue': 'Общая стоимость',
      'unitPrice': 'Цена за единицу',
      'value': 'Стоимость',
      'outOfStock': 'Отсутствующий товар',
      'lowStock': 'Товары с низким запасом',
      'criticalStock': 'Критический запас',
      'inStock': 'В наличии',
      
      // Категории товаров
      'laptops': 'Ноутбуки',
      'smartphones': 'Смартфоны',
      'tablets': 'Планшеты',
      'monitors': 'Мониторы',
      'printers': 'Принтеры',
      'peripherals': 'Периферия',
      'audio': 'Аудио',
      'dataStorage': 'Хранение данных',
      'networkEquipment': 'Сетевое оборудование',
      'components': 'Комплектующие',
      
      // Переводы для отчета о клиентах
      'clientReport': 'Отчет о клиентах',
      'exportFullReport': 'Экспорт полного отчета в PDF',
      'clientsSummary': 'Сводка по клиентам',
      'totalClients': 'Всего клиентов',
      'newClientsThisMonth': 'Новых клиентов за месяц',
      'activeClients': 'Активных клиентов',
      'inactiveClients': 'Неактивных клиентов',
      'clientsList': 'Список клиентов',
      'searchClients': 'Поиск клиентов...',
      'lastOrder': 'Последний заказ',
      'orderTotal': 'Сумма заказа',
      'orderCount': 'Количество заказов',
      'orderStatus': 'Статус заказа',
      'noClientData': 'Нет данных о клиентах для отображения.',
      
      // Переводы для отчета о поставщиках
      'supplierReport': 'Отчет о поставщиках',
      'suppliersSummary': 'Сводка по поставщикам',
      'totalSuppliers': 'Всего поставщиков',
      'suppliersList': 'Список поставщиков',
      'searchSuppliers': 'Поиск поставщиков...',
      'paymentTerms': 'Условия оплаты',
      'noSupplierData': 'Нет данных о поставщиках для отображения.',
      
      // Переводы для отчета о товарах с низким запасом
      'lowStockReport': 'Отчет о товарах с низким запасом',
      'lowStockSummary': 'Сводка по товарам с низким запасом',
      'lowStockItemsList': 'Список товаров с низким запасом',
      'searchLowStockItems': 'Поиск товаров с низким запасом...',
      'totalLowStockItems': 'Всего товаров с низким запасом',
      'noLowStockData': 'Нет данных о товарах с низким запасом для отображения.',
      
      // Переводы для финансового отчета
      'financialReport': 'Финансовый отчет',
      'financialSummary': 'Финансовая сводка',
      'totalIncome': 'Общий доход',
      'totalExpenses': 'Общие расходы',
      'totalSales': 'Общие продажи',
      'totalPurchases': 'Общие закупки',
      'netProfit': 'Чистая прибыль',
      'transactions': 'Транзакции',
      'searchTransactions': 'Поиск транзакций...',
      'noFinancialData': 'Нет финансовых данных для отображения.',
      'income': 'Доход',
      'expense': 'Расход',
      'sale': 'Продажа',
      'purchase': 'Закупка'
    },
    'tr': {
      // Genel çeviriler
      'generated': 'Oluşturuldu',
      'exportToPdf': 'PDF\'e dışa aktar',
      'exportSection': 'Bölümü dışa aktar',
      'id': 'ID',
      'name': 'Ad',
      'date': 'Tarih',
      'status': 'Durum',
      'total': 'Toplam',
      'description': 'Açıklama',
      'type': 'Tür',
      'source': 'Kaynak',
      'amount': 'Miktar',
      'quantity': 'Miktar',
      'price': 'Fiyat',
      'contactPerson': 'İletişim Kişisi',
      'email': 'E-posta',
      'phone': 'Telefon',
      'address': 'Adres',
      
      // Stok raporu için çeviriler
      'inventoryReport': 'Stok Raporu',
      'productsSummary': 'Ürün Özeti',
      'totalProducts': 'Toplam Ürünler',
      'lowStockItems': 'Düşük Stoklu Ürünler',
      'searchProducts': 'Ürünleri ara...',
      'noDataAvailable': 'Stok verisi mevcut değil',
      'visualizationPlaceholder': 'Görselleştirme burada',
      'productName': 'Ürün Adı',
      'category': 'Kategori',
      'currentStock': 'Mevcut Stok',
      'minStock': 'Min. Stok',
      'supplierName': 'Tedarikçi',
      'stockVisualization': 'Stok Görselleştirme',
      'tryAdjustingFilters': 'Filtreleri ayarlayın veya stoklarınıza ürün ekleyin',
      'inventoryDetails': 'Stok Detayları',
      'inventoryDistribution': 'Stok Dağılımı',
      'totalValue': 'Toplam Değer',
      'unitPrice': 'Birim Fiyatı',
      'value': 'Değer',
      'outOfStock': 'Stokta Yok',
      'lowStock': 'Düşük Stok',
      'criticalStock': 'Kritik Stok',
      'inStock': 'Stokta Var',
      
      // Ürün kategorileri
      'laptops': 'Dizüstü Bilgisayarlar',
      'smartphones': 'Akıllı Telefonlar',
      'tablets': 'Tabletler',
      'monitors': 'Monitörler',
      'printers': 'Yazıcılar',
      'peripherals': 'Periferikler',
      'audio': 'Ses',
      'dataStorage': 'Veri Depolama',
      'networkEquipment': 'Ağ Ekipmanları',
      'components': 'Bileşenler',
      
      // Müşteri raporu için çeviriler
      'clientReport': 'Müşteri Raporu',
      'exportFullReport': 'Tam Raporu PDF\'e dışa aktar',
      'clientsSummary': 'Müşteri Özeti',
      'totalClients': 'Toplam Müşteriler',
      'newClientsThisMonth': 'Bu Ay Yeni Müşteriler',
      'activeClients': 'Aktif Müşteriler',
      'inactiveClients': 'Pasif Müşteriler',
      'clientsList': 'Müşteri Listesi',
      'searchClients': 'Müşterileri ara...',
      'lastOrder': 'Son Sipariş',
      'orderTotal': 'Sipariş Toplamı',
      'orderCount': 'Sipariş Sayısı',
      'orderStatus': 'Sipariş Durumu',
      'noClientData': 'Görüntülenecek müşteri verisi yok.',
      
      // Tedarikçi raporu için çeviriler
      'supplierReport': 'Tedarikçi Raporu',
      'suppliersSummary': 'Tedarikçi Özeti',
      'totalSuppliers': 'Toplam Tedarikçiler',
      'suppliersList': 'Tedarikçi Listesi',
      'searchSuppliers': 'Tedarikçileri ara...',
      'paymentTerms': 'Ödeme Şartları',
      'noSupplierData': 'Görüntülenecek tedarikçi verisi yok.',
      
      // Düşük stoklu ürünler raporu için çeviriler
      'lowStockReport': 'Düşük Stoklu Ürünler Raporu',
      'lowStockSummary': 'Düşük Stok Özeti',
      'lowStockItemsList': 'Düşük Stoklu Ürünler Listesi',
      'searchLowStockItems': 'Düşük stoklu ürünleri ara...',
      'totalLowStockItems': 'Toplam Düşük Stoklu Ürünler',
      'noLowStockData': 'Görüntülenecek düşük stoklu ürün verisi yok.',
      
      // Finansal rapor için çeviriler
      'financialReport': 'Finansal Rapor',
      'financialSummary': 'Finansal Özet',
      'totalIncome': 'Toplam Gelir',
      'totalExpenses': 'Toplam Giderler',
      'totalSales': 'Toplam Satışlar',
      'totalPurchases': 'Toplam Alımlar',
      'netProfit': 'Net Kar',
      'transactions': 'İşlemler',
      'searchTransactions': 'İşlemleri ara...',
      'noFinancialData': 'Görüntülenecek finansal veri yok.',
      'income': 'Gelir',
      'expense': 'Gider',
      'sale': 'Satış',
      'purchase': 'Alım'
    }
  };
}

document.addEventListener('DOMContentLoaded', async function() {
  try {
    // Проверяем, загружена ли уже библиотека html2pdf
    if (!window.html2pdf) {
      console.log('Библиотека html2pdf не найдена в глобальном объекте window, загружаем...');
      await loadJsPdfLibrary();
    } else {
      console.log('Библиотека html2pdf уже загружена через тег <script>');
    }
    
    // Инициализируем переводы
    initializeTranslations();
    
    // Check if on reports page
    if (!document.querySelector('.reports-grid')) {
      console.log('Страница отчетов не обнаружена, инициализация модуля отчетов пропущена');
      return;
    }
    
    console.log('Инициализация модуля отчетов...');
    
    // Setup event listeners
    const dateRange = document.getElementById('date-range');
    if (dateRange) {
      dateRange.addEventListener('change', function() {
        const customDateRange = document.getElementById('custom-date-range');
        if (customDateRange) {
          customDateRange.style.display = this.value === 'custom' ? 'block' : 'none';
        }
      });
    }
    
    // Add language change event listener
    document.addEventListener('languageChanged', function() {
      // Re-render the current report if one is displayed
      const reportContent = document.getElementById('report-content');
      const filterForm = document.getElementById('report-filter-form');
      
      if (reportContent && reportContent.style.display !== 'none' && filterForm) {
        const reportType = filterForm.dataset.reportType;
        if (reportType) {
          // If there's already data loaded, reload it in the new language
          const lastLoadedData = window.lastReportData;
          if (lastLoadedData) {
            renderReportData(lastLoadedData, reportType);
          }
        }
      }
      
      // Update filter modal titles and labels
      const filterTitle = document.getElementById('filter-title');
      if (filterTitle && filterForm) {
        const reportType = filterForm.dataset.reportType;
        if (reportType) {
          let titleKey = 'reportFilters';
          switch (reportType) {
            case 'sales': titleKey = 'salesReportFilters'; break;
            case 'inventory': titleKey = 'inventoryReportFilters'; break;
            case 'clients': titleKey = 'clientsReport'; break;
            case 'suppliers': titleKey = 'supplierReportFilters'; break;
            case 'lowstock': titleKey = 'lowStockReportFilters'; break;
            case 'financial': titleKey = 'financialReportFilters'; break;
          }
          filterTitle.textContent = window.erpLanguage.translate(titleKey);
        }
      }
    });
    
    // Set up modal close buttons
    const closeButtons = document.querySelectorAll('.modal .close, .btn[data-dismiss="modal"]');
    closeButtons.forEach(button => {
      button.addEventListener('click', function() {
        const modal = this.closest('.modal');
        if (modal) {
          modal.style.display = 'none';
        }
      });
    });
    
    // Apply filters button
    const applyFilters = document.getElementById('apply-filters');
    if (applyFilters) {
      applyFilters.addEventListener('click', function() {
        const filterForm = document.getElementById('report-filter-form');
        if (!filterForm) return;
        
        const reportType = filterForm.dataset.reportType;
        const dateRange = document.getElementById('date-range')?.value;
        
        let startDate, endDate;
        if (dateRange === 'custom') {
          startDate = document.getElementById('start-date')?.value;
          endDate = document.getElementById('end-date')?.value;
        }
        
        // Close modal
        const modal = document.getElementById('report-filter-modal');
        if (modal) {
          modal.style.display = 'none';
        }
        
        // Fetch report data with filters
        fetchReportData(reportType, dateRange, startDate, endDate);
      });
    }
    
    // Export PDF button
    const exportPdf = document.getElementById('export-pdf');
    if (exportPdf) {
      exportPdf.addEventListener('click', async function() {
        try {
          const reportTitle = document.getElementById('report-title')?.textContent || 'Report';
          await generatePDF('report-content', reportTitle.replace(/\s+/g, '_'));
        } catch (error) {
          console.error('Ошибка при экспорте PDF:', error);
          showNotification('Ошибка при создании PDF: ' + error.message, 'error');
        }
      });
    }
  } catch (error) {
    console.error('Ошибка инициализации модуля отчетов:', error);
    showNotification('Ошибка при инициализации модуля отчетов: ' + error.message, 'error');
  }
});

// Generate report based on type
function generateReport(reportType) {
  // Show filter modal with appropriate filters
  const filterModal = document.getElementById('report-filter-modal');
  const filterForm = document.getElementById('report-filter-form');
  const additionalFilters = document.getElementById('additional-filters');
  
  // Set report type as data attribute
  filterForm.dataset.reportType = reportType;
  
  // Clear previous additional filters
  additionalFilters.innerHTML = '';
  
  // Set filter title (using translation)
  let filterTitle = window.erpLanguage.translate('reportFilters');
  
  // Add specific filters based on report type
  switch (reportType) {
    case 'sales':
      filterTitle = window.erpLanguage.translate('salesReportFilters');
      additionalFilters.innerHTML = `
        <div class="form-group">
          <label for="client-filter" data-i18n="clientFilter">${window.erpLanguage.translate('clientFilter')}</label>
          <select id="client-filter">
            <option value="" data-i18n="allClients">${window.erpLanguage.translate('allClients')}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="status-filter" data-i18n="statusFilter">${window.erpLanguage.translate('statusFilter')}</label>
          <select id="status-filter">
            <option value="" data-i18n="allStatuses">${window.erpLanguage.translate('allStatuses')}</option>
            <option value="completed" data-i18n="completed">${window.erpLanguage.translate('completed')}</option>
            <option value="pending" data-i18n="pending">${window.erpLanguage.translate('pending')}</option>
            <option value="cancelled" data-i18n="cancelled">${window.erpLanguage.translate('cancelled')}</option>
          </select>
        </div>
      `;
      // Load clients for filter
      loadClientsForFilter();
      break;
      
    case 'inventory':
      filterTitle = window.erpLanguage.translate('inventoryReportFilters');
      additionalFilters.innerHTML = `
        <div class="form-group">
          <label for="stock-filter" data-i18n="stockFilter">${window.erpLanguage.translate('stockFilter')}</label>
          <select id="stock-filter">
            <option value="" data-i18n="allStockLevels">${window.erpLanguage.translate('allStockLevels')}</option>
            <option value="low" data-i18n="lowStock">${window.erpLanguage.translate('lowStock')}</option>
            <option value="normal" data-i18n="normalStock">${window.erpLanguage.translate('normalStock')}</option>
            <option value="high" data-i18n="highStock">${window.erpLanguage.translate('highStock')}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="supplier-filter" data-i18n="supplierFilter">${window.erpLanguage.translate('supplierFilter')}</label>
          <select id="supplier-filter">
            <option value="" data-i18n="allSuppliers">${window.erpLanguage.translate('allSuppliers')}</option>
          </select>
        </div>
      `;
      // Load suppliers for filter
      loadSuppliersForFilter();
      break;
      
    case 'clients':
      filterTitle = window.erpLanguage.translate('clientsReport');
      additionalFilters.innerHTML = ``;
      break;
      
    case 'suppliers':
      filterTitle = window.erpLanguage.translate('supplierReportFilters');
      break;
      
    case 'lowstock':
      filterTitle = window.erpLanguage.translate('lowStockReportFilters');
      additionalFilters.innerHTML = `
        <div class="form-group">
          <label for="severity-filter" data-i18n="severityFilter">${window.erpLanguage.translate('severityFilter')}</label>
          <select id="severity-filter">
            <option value="" data-i18n="allLevels">${window.erpLanguage.translate('allLevels')}</option>
            <option value="critical" data-i18n="critical">${window.erpLanguage.translate('critical')}</option>
            <option value="warning" data-i18n="requireReplenishment">${window.erpLanguage.translate('requireReplenishment')}</option>
            <option value="outofstock" data-i18n="outOfStock">${window.erpLanguage.translate('outOfStock')}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="supplier-filter" data-i18n="supplierFilter">${window.erpLanguage.translate('supplierFilter')}</label>
          <select id="supplier-filter">
            <option value="" data-i18n="allSuppliers">${window.erpLanguage.translate('allSuppliers')}</option>
          </select>
        </div>
      `;
      // Load suppliers for filter
      loadSuppliersForFilter();
      break;
      
    case 'financial':
      filterTitle = window.erpLanguage.translate('financialReportFilters');
      additionalFilters.innerHTML = `
        <div class="form-group">
          <label for="transaction-type" data-i18n="transactionType">${window.erpLanguage.translate('transactionType')}</label>
          <select id="transaction-type">
            <option value="" data-i18n="allTransactions">${window.erpLanguage.translate('allTransactions')}</option>
            <option value="income" data-i18n="income">${window.erpLanguage.translate('income')}</option>
            <option value="expense" data-i18n="expenses">${window.erpLanguage.translate('expenses')}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="transaction-source" data-i18n="transactionSource">${window.erpLanguage.translate('transactionSource')}</label>
          <select id="transaction-source">
            <option value="" data-i18n="allSources">${window.erpLanguage.translate('allSources')}</option>
            <option value="sale" data-i18n="sale">${window.erpLanguage.translate('sale')}</option>
            <option value="purchase" data-i18n="purchase">${window.erpLanguage.translate('purchase')}</option>
            <option value="other" data-i18n="otherTransactions">${window.erpLanguage.translate('otherTransactions')}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="min-amount" data-i18n="minAmount">${window.erpLanguage.translate('minAmount')}</label>
          <input type="number" id="min-amount" class="form-control" placeholder="${window.erpLanguage.translate('minimumAmount')}" min="0" step="0.01">
        </div>
      `;
      break;
  }
  
  // Update filter title
  document.getElementById('filter-title').textContent = filterTitle;
  
  // Show filter modal
  filterModal.style.display = 'block';
}

// Fetch report data with filters
function fetchReportData(reportType, dateRange, startDate, endDate) {
  // Show loading state
  document.getElementById('report-content').innerHTML = `
    <div class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p>${window.erpLanguage.translate('loading')}</p>
    </div>
  `;
  document.getElementById('report-result').style.display = 'block';
  
  // Prepare params for API request
  const params = new URLSearchParams();
  params.append('reportType', reportType);
  params.append('dateRange', dateRange);
  
  if (dateRange === 'custom' && startDate && endDate) {
    params.append('startDate', startDate);
    params.append('endDate', endDate);
  }
  
  // Try to get real data from API, use mock data as fallback
  fetch(`/api/reports?${params.toString()}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Store the data for language switching
      window.lastReportData = data;
      
      // Render data
      renderReportData(data, reportType);
    })
    .catch(error => {
      console.error('Error fetching report data:', error);
      console.log('Falling back to mock data');
      
      // Generate mock data based on report type
      let data;
      switch (reportType) {
        case 'sales':
          data = generateMockSalesData(dateRange);
          break;
        case 'inventory':
          data = generateMockInventoryData();
          break;
        case 'clients':
          data = generateMockClientsData();
          break;
        case 'suppliers':
          data = generateMockSuppliersData();
          break;
        case 'lowstock':
          data = generateMockLowStockData();
          break;
        case 'financial':
          data = generateMockFinancialData(dateRange);
          break;
        default:
          data = { error: 'Unknown report type.' };
      }
      
      // Store the data for language switching
      window.lastReportData = data;
      
      // Render data
      renderReportData(data, reportType);
    });
}

// Helper function to process financial data
function processFinancialData(data) {
  console.log('Processing financial data, raw data:', JSON.stringify(data));

  // Track API availability
  if (!data.salesIncluded && !data.data.some(t => t.source === 'sale')) {
    // Check if we have transactions of type 'sale' in the data
    const hasSalesInData = data.data.some(t => t.transaction_type === 'sale');
    if (!hasSalesInData) {
      data.salesApiUnavailable = true;
      console.warn('Sales API appears to be unavailable');
    }
  }
  
  if (!data.purchasesIncluded && !data.data.some(t => t.source === 'purchase')) {
    // Check if we have transactions of type 'purchase' in the data
    const hasPurchasesInData = data.data.some(t => t.transaction_type === 'purchase');
    if (!hasPurchasesInData) {
      data.purchasesApiUnavailable = true;
      console.warn('Purchases API appears to be unavailable');
    }
  }

  // Ensure transaction amounts are properly formatted
  data.data = (data.data || []).map(transaction => {
    console.log('Processing transaction:', transaction, 'Amount:', transaction.amount || transaction.total_amount || transaction.total_price, 'Type:', typeof (transaction.amount || transaction.total_amount || transaction.total_price));
    
    // Convert transaction_type to source and type if not already set
    // Обратите внимание: transaction_type из API приходит с заглавной буквы (Sale, Purchase)
    if (!transaction.source && transaction.transaction_type) {
      if (transaction.transaction_type === 'Sale' || transaction.transaction_type.toLowerCase() === 'sale') {
        transaction.source = 'sale';
        transaction.type = 'income';
      } else if (transaction.transaction_type === 'Purchase' || transaction.transaction_type.toLowerCase() === 'purchase') {
        transaction.source = 'purchase';
        transaction.type = 'expense';
      } else if (transaction.transaction_type === 'income' || transaction.transaction_type.toLowerCase() === 'income') {
        transaction.source = 'other';
        transaction.type = 'income';
      } else if (transaction.transaction_type === 'expense' || transaction.transaction_type.toLowerCase() === 'expense') {
        transaction.source = 'other';
        transaction.type = 'expense';
      }
    }
    
    // If type is not set, determine from source
    if (!transaction.type && transaction.source) {
      if (transaction.source === 'sale') {
        transaction.type = 'income';
      } else if (transaction.source === 'purchase') {
        transaction.type = 'expense';
      }
    }
    
    // If neither type nor source is set, default to 'other' and 'income'
    if (!transaction.type) {
      transaction.type = 'income';
      transaction.source = 'other';
    }
    
    // Make sure amount is a number
    if (transaction.amount === undefined) {
      // Try to get amount from total_amount or total_price
      transaction.amount = transaction.total_amount || transaction.total_price;
    }
    
    if (transaction.amount !== undefined) {
      // Store original amount for debugging
      const originalAmount = transaction.amount;
      
      // Try to parse as float first
      let parsedAmount = parseFloat(transaction.amount);
      
      // If parsing failed, try to extract numbers from string
      if (isNaN(parsedAmount) && typeof transaction.amount === 'string') {
        const matches = transaction.amount.match(/-?\d+(\.\d+)?/);
        if (matches) {
          parsedAmount = parseFloat(matches[0]);
        }
      }
      
      // If still NaN, set to 0
      if (isNaN(parsedAmount)) {
        console.warn('Invalid transaction amount:', transaction.amount, 'for transaction:', transaction);
        parsedAmount = 0;
      }
      
      // Если это расход (expense) и значение положительное, сделаем его отрицательным для отображения
      if (transaction.type === 'expense' && parsedAmount > 0 && transaction.source === 'purchase') {
        parsedAmount = -Math.abs(parsedAmount);
      }
      
      // Log the conversion for debugging
      console.log(`Converted amount from ${originalAmount} (${typeof originalAmount}) to ${parsedAmount} (number)`);
      
      transaction.amount = parsedAmount;
    } else {
      console.warn('Transaction has no amount:', transaction);
      transaction.amount = 0;
    }
    
    // Ensure transaction has a description
    if (!transaction.description) {
      if (transaction.source === 'sale') {
        const entityName = transaction.entity_name || transaction.client_name || transaction.clientName || 'Unknown Client';
        transaction.description = `Sale #${transaction.id} - ${entityName}`;
      } else if (transaction.source === 'purchase') {
        const entityName = transaction.entity_name || transaction.supplier_name || transaction.supplierName || 'Unknown Supplier';
        transaction.description = `Purchase #${transaction.id} - ${entityName}`;
      } else {
        transaction.description = `Transaction #${transaction.id}`;
      }
    }
    
    // Ensure transaction has a date
    if (!transaction.date) {
      transaction.date = transaction.transaction_date || transaction.created_at || new Date().toISOString();
    }
    
    return transaction;
  });
  
  // Recalculate totals
  let totalIncome = 0;
  let totalExpenses = 0;
  let totalSales = 0;
  let totalPurchases = 0;
  
  data.data.forEach(transaction => {
    console.log(`Adding ${transaction.type === 'income' ? 'income' : 'expense'} transaction:`, 
                transaction.id, 
                'Amount:', transaction.amount, 
                'Source:', transaction.source);
    
    if (transaction.type === 'income') {
      totalIncome += Math.abs(transaction.amount) || 0;
      if (transaction.source === 'sale') {
        totalSales += Math.abs(transaction.amount) || 0;
        console.log(`Added ${Math.abs(transaction.amount)} to sales total, new total: ${totalSales}`);
      }
    } else {
      // Важно: для расходов, берем абсолютное значение, иначе с отрицательными значениями будет вычитание
      totalExpenses += Math.abs(transaction.amount) || 0;
      if (transaction.source === 'purchase') {
        totalPurchases += Math.abs(transaction.amount) || 0;
        console.log(`Added ${Math.abs(transaction.amount)} to purchases total, new total: ${totalPurchases}`);
      }
    }
  });
  
  data.totalIncome = totalIncome;
  data.totalExpenses = totalExpenses;
  data.totalSales = totalSales;
  data.totalPurchases = totalPurchases;
  
  console.log('Calculated totals:', {
    totalIncome,
    totalExpenses,
    totalSales,
    totalPurchases,
    netProfit: totalIncome - totalExpenses
  });
  
  // Sort transactions by date (newest first)
  data.data.sort((a, b) => {
    const dateA = a.date ? new Date(a.date) : new Date(0);
    const dateB = b.date ? new Date(b.date) : new Date(0);
    return dateB - dateA;
  });
}

// Render report data
function renderReportData(data, reportType) {
  // Сохраняем данные для возможной повторной перерисовки при смене языка
  window.lastReportData = data;
  
  // Clear previous notification
  const notifications = document.getElementsByClassName('notification-container');
  while (notifications.length > 0) {
    notifications[0].parentNode.removeChild(notifications[0]);
  }
  
  try {
    // Hide loading state
    document.getElementById('report-result').style.display = 'block';
    document.getElementById('report-content').style.display = 'block';

    // Check if data contains error message
    if (data.error) {
      document.getElementById('report-content').innerHTML = `
        <div class="alert alert-danger">
          <strong>${window.erpLanguage.translate('error')}!</strong> ${data.error}
        </div>
      `;
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
          document.getElementById('report-content').innerHTML = `
            <div class="alert alert-warning">
              <strong>${window.erpLanguage.translate('warning')}!</strong> ${window.erpLanguage.translate('unknownReportType')}
            </div>
          `;
    }
  } catch (error) {
    console.error('Error displaying report:', error);
    document.getElementById('report-content').innerHTML = `
      <div class="alert alert-danger">
        <strong>${window.erpLanguage.translate('errorLoadingReport')}!</strong> ${error.message || window.erpLanguage.translate('unexpectedError')}
        <p>${window.erpLanguage.translate('tryAgainLater')}</p>
      </div>
    `;
  }
}

// Helper functions to render specific reports
function renderSalesReport(data) {
  const reportContent = document.getElementById('report-content');
  
  if (!data || !data.data || data.data.length === 0) {
    reportContent.innerHTML = `<div class="alert alert-info">${window.erpLanguage.translate('noSalesData')}</div>`;
    return;
  }
  
  const sales = data.data;
  const totalSales = data.totalSales || sales.reduce((sum, sale) => sum + parseFloat(sale.total_amount || 0), 0);
  const averageSale = sales.length > 0 ? totalSales / sales.length : 0;
  
  // Create report header with stats
  let html = `
    <div class="report-header">
      <h3 class="report-title">${window.erpLanguage.translate('salesReport')}</h3>
      <div class="report-meta">${window.erpLanguage.translate('generated')} ${formatDate(new Date())}</div>
    </div>
    
    <div class="report-actions">
      <button class="btn btn-primary" onclick="generatePDF('report-content', 'sales-report')">
        <i class="fas fa-file-pdf"></i> ${window.erpLanguage.translate('exportFullReport')}
      </button>
    </div>
    
    <div id="sales-summary-section" class="report-section">
      <h4>${window.erpLanguage.translate('salesSummary')}</h4>
      <div class="report-summary">
        <div class="summary-card">
          <div class="summary-value">${sales.length}</div>
          <div class="summary-label">${window.erpLanguage.translate('totalSales')}</div>
        </div>
        <div class="summary-card">
          <div class="summary-value">${formatCurrency(totalSales)}</div>
          <div class="summary-label">${window.erpLanguage.translate('totalRevenue')}</div>
        </div>
        <div class="summary-card">
          <div class="summary-value">${formatCurrency(averageSale)}</div>
          <div class="summary-label">${window.erpLanguage.translate('averageSale')}</div>
        </div>
      </div>
    </div>
    
    <div id="sales-chart-section" class="report-section">
      <div class="section-header">
        <h4>${window.erpLanguage.translate('salesOverTime')}</h4>
        <button class="btn btn-sm btn-outline-primary" onclick="generateSectionPDF('sales-chart-section', '${window.erpLanguage.translate('salesChart')}')">
          <i class="fas fa-file-pdf"></i> ${window.erpLanguage.translate('exportSection')}
        </button>
      </div>
      
      <div class="report-chart">
        <div style="height: 250px; background-color: #f8f9fa; display: flex; align-items: center; justify-content: center; border-radius: 4px;">
          <div style="text-align: center;">
            <i class="fas fa-chart-line" style="font-size: 48px; color: #6c757d; margin-bottom: 10px;"></i>
            <p>${window.erpLanguage.translate('salesTrendVisualization')}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div id="sales-details-section" class="report-section">
      <div class="section-header">
        <h4>${window.erpLanguage.translate('salesDetails')}</h4>
        <button class="btn btn-sm btn-outline-primary" onclick="generateSectionPDF('sales-details-section', '${window.erpLanguage.translate('salesDetails')}')">
          <i class="fas fa-file-pdf"></i> ${window.erpLanguage.translate('exportSection')}
        </button>
      </div>
      
      <div class="search-container">
        <input type="text" id="sales-table-search" placeholder="${window.erpLanguage.translate('searchSales')}" class="form-control search-input">
        <i class="fas fa-search search-icon"></i>
      </div>
      
      <div class="report-table-container">
        <table class="report-table" id="sales-table">
          <thead>
            <tr>
              <th onclick="sortTable('sales-table', 0)">${window.erpLanguage.translate('id')} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('sales-table', 1)">${window.erpLanguage.translate('date')} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('sales-table', 2)">${window.erpLanguage.translate('client')} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('sales-table', 3)">${window.erpLanguage.translate('total')} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('sales-table', 4)">${window.erpLanguage.translate('status')} <i class="fas fa-sort"></i></th>
            </tr>
          </thead>
          <tbody>
  `;
  
  // Add sales rows
  sales.forEach(sale => {
    const saleDate = sale.sale_date || sale.date || sale.created_at || '';
    const clientName = sale.client_name || sale.customer_name || window.erpLanguage.translate('unknownClient');
    const amount = sale.total_amount || sale.amount || 0;
    const status = sale.status || 'completed';
    const statusKey = status.toLowerCase();
    const translatedStatus = window.erpLanguage.translate(statusKey) || 
                            status.charAt(0).toUpperCase() + status.slice(1);
    
    html += `
      <tr>
        <td>${sale.id || '-'}</td>
        <td>${formatDate(saleDate)}</td>
        <td><strong>${clientName}</strong></td>
        <td>${formatCurrency(amount)}</td>
        <td><span class="status-badge status-${statusKey}">${translatedStatus}</span></td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
    </div>
    </div>
    
    <script>
      // Add search functionality
      document.getElementById('sales-table-search').addEventListener('keyup', function() {
        const searchTerm = this.value.toLowerCase();
        const table = document.getElementById('sales-table');
        const rows = table.getElementsByTagName('tr');
        
        for (let i = 1; i < rows.length; i++) {
          let found = false;
          const cells = rows[i].getElementsByTagName('td');
          
          for (let j = 0; j < cells.length; j++) {
            const cellText = cells[j].textContent.toLowerCase();
            if (cellText.indexOf(searchTerm) > -1) {
              found = true;
              break;
            }
          }
          
          if (found) {
            rows[i].style.display = '';
          } else {
            rows[i].style.display = 'none';
          }
        }
      });
      
      // Table sorting function
      function sortTable(tableId, columnIndex) {
        const table = document.getElementById(tableId);
        const rows = Array.from(table.rows).slice(1); // Skip header
        const isNumeric = columnIndex === 0 || columnIndex === 3; // ID and Amount columns are numeric
        
        rows.sort((a, b) => {
          const aValue = a.cells[columnIndex].textContent.trim();
          const bValue = b.cells[columnIndex].textContent.trim();
          
          if (isNumeric) {
            // Extract numeric values for comparison
            const aNum = parseFloat(aValue.replace(/[^0-9.-]+/g, ''));
            const bNum = parseFloat(bValue.replace(/[^0-9.-]+/g, ''));
            return aNum - bNum;
          } else {
            return aValue.localeCompare(bValue);
          }
        });
        
        // Rearrange rows
        rows.forEach(row => table.tBodies[0].appendChild(row));
      }
    </script>
  `;
  
  reportContent.innerHTML = html;
}

// Функция для отображения отчета по инвентарю
function renderInventoryReport(data) {
  const reportContent = document.getElementById('report-content');
  
  // Инициализируем переводы перед использованием
  initializeTranslations();
  
  // Получаем текущий язык
  const currentLanguage = window.currentLanguage || localStorage.getItem('language') || localStorage.getItem('erp_language') || 'en';
  console.log('Using language for inventory report:', currentLanguage);
  
  // Форматирование валюты в зависимости от текущего языка
  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat(
      currentLanguage === 'ru' ? 'ru-RU' : 
      currentLanguage === 'tr' ? 'tr-TR' : 'en-US', 
      {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      }
    );
    return formatter.format(value);
  };
  
  // Функция для безопасного получения текста перевода
  const getTranslatedText = (key, defaultText) => {
    if (window.translations && 
        window.translations[currentLanguage] && 
        window.translations[currentLanguage][key]) {
      return window.translations[currentLanguage][key];
    }
    
    // Пробуем получить перевод через erpLanguage API, если он доступен
    if (window.erpLanguage && typeof window.erpLanguage.translate === 'function') {
      const translation = window.erpLanguage.translate(key);
      if (translation && translation !== key) {
        return translation;
      }
    }
    
    console.warn(`Translation for key "${key}" not found, using default text`);
    return defaultText;
  };
  
  // Логируем полученные данные для отладки
  console.log('Полученные данные инвентаря:', data);
  
  if (!data || !data.data || data.data.length === 0) {
    reportContent.innerHTML = `
      <div class="alert alert-info text-center p-5">
        <i class="fas fa-info-circle fa-3x mb-3"></i>
        <h4>${getTranslatedText('noDataAvailable', 'No inventory data available')}</h4>
        <p class="text-muted">${getTranslatedText('tryAdjustingFilters', 'Try adjusting your filters or adding products to your inventory')}</p>
      </div>`;
    return;
  }
  
  // Получаем данные инвентаря
  const inventory = data.data;
  
  // Логируем первый элемент для понимания структуры данных
  if (inventory && inventory.length > 0) {
    console.log('Пример элемента инвентаря:', inventory[0]);
  }
  
  // Функция для получения значений с учетом различных возможных имен полей
  const getFieldValue = (item, fieldNames, defaultValue = 0) => {
    for (const field of fieldNames) {
      if (item[field] !== undefined) {
        return item[field];
      }
    }
    return defaultValue;
  };
  
  // Вычисляем итоги
  const totalProducts = inventory.length;
  const totalValue = inventory.reduce((sum, item) => {
    const quantity = getFieldValue(item, ['quantity', 'current_stock', 'stock'], 0);
    const unitPrice = getFieldValue(item, ['unit_price', 'price', 'unitPrice'], 0);
    return sum + (parseFloat(quantity) * parseFloat(unitPrice));
  }, 0);
  
  const lowStockItems = inventory.filter(item => {
    const currentStock = getFieldValue(item, ['quantity', 'current_stock', 'stock'], 0);
    const minStock = getFieldValue(item, ['min_stock', 'min_stock_level', 'minStock'], 0);
    return currentStock <= minStock;
  }).length;
  
  // Категории для визуализации
  const categories = {};
  inventory.forEach(item => {
    const category = item.category || 'Uncategorized';
    const quantity = getFieldValue(item, ['quantity', 'current_stock', 'stock'], 0);
    const unitPrice = getFieldValue(item, ['unit_price', 'price', 'unitPrice'], 0);
    
    if (!categories[category]) {
      categories[category] = {
        count: 0,
        value: 0
      };
    }
    categories[category].count += 1;
    categories[category].value += (parseFloat(quantity) * parseFloat(unitPrice));
  });
  
  // Получаем переводы для всех элементов отчета
  const inventoryReportText = getTranslatedText('inventoryReport', 'Inventory Report');
  const generatedText = getTranslatedText('generated', 'Generated');
  const exportToPdfText = getTranslatedText('exportToPdf', 'Export to PDF');
  const inventorySummaryText = getTranslatedText('productsSummary', 'Products Summary');
  const exportSectionText = getTranslatedText('exportSection', 'Export Section');
  const totalProductsText = getTranslatedText('totalProducts', 'Total Products');
  const totalValueText = getTranslatedText('totalValue', 'Total Value');
  const lowStockItemsText = getTranslatedText('lowStockItems', 'Low Stock Items');
  const inventoryDistributionText = getTranslatedText('inventoryDistribution', 'Inventory Distribution');
  const searchProductsText = getTranslatedText('searchProducts', 'Search products...');
  const productText = getTranslatedText('productName', 'Product');
  const categoryText = getTranslatedText('category', 'Category');
  const quantityText = getTranslatedText('quantity', 'Quantity');
  const currentStockText = getTranslatedText('currentStock', 'Current Stock');
  const minStockText = getTranslatedText('minStock', 'Min Stock');
  const unitPriceText = getTranslatedText('unitPrice', 'Unit Price');
  const valueText = getTranslatedText('value', 'Value');
  const statusText = getTranslatedText('status', 'Status');
  const criticalStockText = getTranslatedText('criticalStock', 'Critical Stock');
  const inStockText = getTranslatedText('inStock', 'In Stock');
  const stockVisualizationText = getTranslatedText('stockVisualization', 'Stock Visualization');
  
  // Форматирование даты
  const currentDate = new Date();
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString(
    currentLanguage === 'ru' ? 'ru-RU' : 
    currentLanguage === 'tr' ? 'tr-TR' : 'en-US', 
    dateOptions
  );
  
  // Создаем HTML-разметку отчета с улучшенным дизайном
  let html = `
    <div class="report-header">
      <h3 class="report-title">${inventoryReportText}</h3>
      <div class="report-meta">${generatedText} ${formattedDate}</div>
    </div>
    
    <div class="report-actions mb-4">
      <button class="btn btn-primary" onclick="generatePDF('report-content', 'inventory-report')">
        <i class="fas fa-file-pdf"></i> ${exportToPdfText}
      </button>
    </div>
    
    <div id="inventory-summary-section" class="report-section mb-4">
      <div class="section-header">
        <h4><i class="fas fa-chart-pie me-2"></i> ${inventorySummaryText}</h4>
        <button class="btn btn-sm btn-outline-primary" onclick="generateSectionPDF('inventory-summary-section', '${inventorySummaryText}')">
          <i class="fas fa-file-pdf"></i> ${exportSectionText}
        </button>
      </div>
      
      <div class="report-dashboard">
        <div class="dashboard-card" style="border-left-color: #28a745;">
          <div class="card-icon"><i class="fas fa-boxes" style="color: #28a745;"></i></div>
          <div class="card-data">
            <div class="summary-value">${totalProducts}</div>
            <div class="summary-label">${totalProductsText}</div>
          </div>
        </div>
        
        <div class="dashboard-card" style="border-left-color: #17a2b8;">
          <div class="card-icon"><i class="fas fa-dollar-sign" style="color: #17a2b8;"></i></div>
          <div class="card-data">
            <div class="summary-value">${formatCurrency(totalValue)}</div>
            <div class="summary-label">${totalValueText}</div>
          </div>
        </div>
        
        <div class="dashboard-card" style="border-left-color: ${lowStockItems > 0 ? '#dc3545' : '#6c757d'};">
          <div class="card-icon"><i class="fas fa-exclamation-triangle" style="color: ${lowStockItems > 0 ? '#dc3545' : '#6c757d'};"></i></div>
          <div class="card-data">
            <div class="summary-value">${lowStockItems}</div>
            <div class="summary-label">${lowStockItemsText}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row mb-4">
      <div class="col-md-6">
        <div id="visualization-section" class="report-section h-100">
          <div class="section-header">
            <h4><i class="fas fa-chart-pie me-2"></i> ${inventoryDistributionText}</h4>
          </div>
          <div id="inventory-chart" class="chart-container">
            <canvas id="inventory-distribution-chart" width="400" height="300"></canvas>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div id="stock-visualization-section" class="report-section h-100">
          <div class="section-header">
            <h4><i class="fas fa-chart-bar me-2"></i> ${stockVisualizationText}</h4>
          </div>
          <div id="stock-level-chart" class="chart-container">
            <canvas id="stock-level-chart" width="400" height="300"></canvas>
          </div>
        </div>
      </div>
    </div>
    
    <div id="inventory-details-section" class="report-section">
      <div class="section-header">
        <h4><i class="fas fa-list me-2"></i> ${getTranslatedText('inventoryDetails', 'Inventory Details')}</h4>
        <button class="btn btn-sm btn-outline-primary" onclick="generateSectionPDF('inventory-details-section', '${getTranslatedText('inventoryDetails', 'Inventory Details')}')">
          <i class="fas fa-file-pdf"></i> ${exportSectionText}
        </button>
      </div>
      
      <div class="search-container mb-3">
        <input type="text" id="inventory-table-search" placeholder="${searchProductsText}" class="form-control search-input">
        <i class="fas fa-search search-icon"></i>
      </div>
      
      <div class="report-table-container">
        <table class="report-table" id="inventory-table">
          <thead>
            <tr>
              <th onclick="sortTable('inventory-table', 0)">ID <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('inventory-table', 1)">${productText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('inventory-table', 2)">${categoryText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('inventory-table', 3)">${currentStockText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('inventory-table', 4)">${minStockText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('inventory-table', 5)">${unitPriceText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('inventory-table', 6)">${valueText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('inventory-table', 7)">${statusText} <i class="fas fa-sort"></i></th>
            </tr>
          </thead>
          <tbody>
  `;
  
  // Добавляем строки с данными инвентаря
  inventory.forEach(item => {
    const quantity = parseFloat(getFieldValue(item, ['quantity', 'current_stock', 'stock'], 0));
    const minStock = parseFloat(getFieldValue(item, ['min_stock', 'min_stock_level', 'minStock'], 0));
    const unitPrice = parseFloat(getFieldValue(item, ['unit_price', 'price', 'unitPrice'], 0));
    const value = quantity * unitPrice;
    
    // Определяем статус запаса
    let statusClass, statusText;
    if (quantity <= 0) {
      statusClass = 'status-cancelled';
      statusText = getTranslatedText('outOfStock', 'Out of Stock');
    } else if (quantity <= minStock * 0.5) {
      statusClass = 'status-danger';
      statusText = getTranslatedText('criticalStock', 'Critical Stock');
    } else if (quantity <= minStock) {
      statusClass = 'status-warning';
      statusText = getTranslatedText('lowStock', 'Low Stock');
    } else {
      statusClass = 'status-completed';
      statusText = getTranslatedText('inStock', 'In Stock');
    }

    // Добавляем визуальный индикатор уровня запаса
    const stockPercentage = minStock > 0 ? Math.min(100, (quantity / minStock) * 100) : 100;
    let stockBarColor;
    
    if (stockPercentage <= 50) {
      stockBarColor = '#dc3545'; // красный для критически низкого запаса
    } else if (stockPercentage <= 100) {
      stockBarColor = '#ffc107'; // желтый для низкого запаса
    } else {
      stockBarColor = '#28a745'; // зеленый для нормального запаса
    }
    
    const stockBarStyle = `width: ${stockPercentage}%; background-color: ${stockBarColor};`;
    const stockBarHtml = `
      <div class="stock-level-bar">
        <div class="stock-level-indicator" style="${stockBarStyle}"></div>
      </div>
    `;
    
    html += `
      <tr>
        <td>${item.id || '-'}</td>
        <td><strong>${item.name || item.product_name || '-'}</strong></td>
        <td>${item.category || '-'}</td>
        <td>
          ${quantity}
          ${stockBarHtml}
        </td>
        <td>${minStock}</td>
        <td>${formatCurrency(unitPrice)}</td>
        <td>${formatCurrency(value)}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
    </div>
    </div>
    
    <style>
      .stock-level-bar {
        height: 6px;
        background-color: #e9ecef;
        border-radius: 3px;
        margin-top: 5px;
        overflow: hidden;
      }
      .stock-level-indicator {
        height: 100%;
        border-radius: 3px;
      }
      .status-danger {
        background-color: #dc3545;
        color: white;
      }
      .status-warning {
        background-color: #ffc107;
        color: #343a40;
      }
      .chart-container {
        position: relative;
        margin: 20px auto;
        height: 250px;
      }
      .report-dashboard {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 20px;
      }
      .dashboard-card {
        flex: 1;
        min-width: 200px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        padding: 15px;
        border-left: 5px solid #007bff;
        display: flex;
        align-items: center;
      }
      .card-icon {
        font-size: 2rem;
        margin-right: 15px;
        width: 50px;
        text-align: center;
      }
      .card-data {
        flex-grow: 1;
      }
      .summary-value {
        font-size: 1.8rem;
        font-weight: bold;
        line-height: 1.2;
      }
      .summary-label {
        color: #6c757d;
        font-size: 0.9rem;
        text-transform: uppercase;
      }
    </style>
    
    <script>
      // Функция для отрисовки графика распределения инвентаря по категориям
      function renderInventoryDistributionChart() {
        const ctx = document.getElementById('inventory-distribution-chart').getContext('2d');
        
        // Подготавливаем данные для графика
        const categoryNames = [];
        const categoryCounts = [];
        const categoryColors = [
          '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', 
          '#6f42c1', '#fd7e14', '#20c9a6', '#858796', '#5a5c69'
        ];
        
        let index = 0;
        const categories = ${JSON.stringify(categories)};
        for (const category in categories) {
          categoryNames.push(category);
          categoryCounts.push(categories[category].count);
          index++;
        }
        
        // Создаем график
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: categoryNames,
            datasets: [{
              data: categoryCounts,
              backgroundColor: categoryColors.slice(0, categoryNames.length),
              hoverBackgroundColor: categoryColors.slice(0, categoryNames.length),
              hoverBorderColor: "rgba(234, 236, 244, 1)",
            }]
          },
          options: {
            maintainAspectRatio: false,
            tooltips: {
              backgroundColor: "rgb(255,255,255)",
              bodyFontColor: "#858796",
              borderColor: '#dddfeb',
              borderWidth: 1,
              xPadding: 15,
              yPadding: 15,
              displayColors: false,
              caretPadding: 10,
              callbacks: {
                label: function(tooltipItem, data) {
                  const dataset = data.datasets[tooltipItem.datasetIndex];
                  const currentValue = dataset.data[tooltipItem.index];
                  const total = dataset.data.reduce((sum, value) => sum + value, 0);
                  const percentage = Math.round((currentValue / total) * 100);
                  return data.labels[tooltipItem.index] + ': ' + currentValue + ' ('+percentage+'%)';
                }
              }
            },
            legend: {
              display: true,
              position: 'bottom'
            },
            cutoutPercentage: 70
          }
        });
      }
      
      // Функция для отрисовки графика уровней запасов
      function renderStockLevelChart() {
        const ctx = document.getElementById('stock-level-chart').getContext('2d');
        
        // Подготавливаем данные для графика
        const productNames = [];
        const currentStocks = [];
        const minStocks = [];
        const productColors = [];
        
        // Функция для получения значений полей
        function getFieldValue(item, fieldNames, defaultValue = 0) {
          for (const field of fieldNames) {
            if (item[field] !== undefined) {
              return item[field];
            }
          }
          return defaultValue;
        }
        
        const inventory = ${JSON.stringify(inventory.slice(0, 10))};
        inventory.forEach(item => {
          const quantity = parseFloat(getFieldValue(item, ['quantity', 'current_stock', 'stock'], 0));
          const minStock = parseFloat(getFieldValue(item, ['min_stock', 'min_stock_level', 'minStock'], 0));
          
          productNames.push(item.name || item.product_name || 'Product ' + item.id);
          currentStocks.push(quantity);
          minStocks.push(minStock);
          
          // Определяем цвет в зависимости от уровня запаса
          if (quantity <= 0) {
            productColors.push('#dc3545'); // красный для отсутствия запаса
          } else if (quantity <= minStock * 0.5) {
            productColors.push('#dc3545'); // красный для критически низкого запаса
          } else if (quantity <= minStock) {
            productColors.push('#ffc107'); // желтый для низкого запаса
          } else {
            productColors.push('#28a745'); // зеленый для нормального запаса
          }
        });
        
        // Создаем график
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: productNames,
            datasets: [
              {
                label: '${currentStockText}',
                backgroundColor: productColors,
                data: currentStocks
              },
              {
                label: '${minStockText}',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                borderColor: 'rgba(0, 0, 0, 0.3)',
                borderWidth: 2,
                type: 'line',
                fill: false,
                data: minStocks
              }
            ]
          },
          options: {
            maintainAspectRatio: false,
            scales: {
              xAxes: [{
                gridLines: {
                  display: false
                },
                ticks: {
                  maxRotation: 45,
                  minRotation: 45
                }
              }],
              yAxes: [{
                gridLines: {
                  color: "rgb(234, 236, 244)",
                  zeroLineColor: "rgb(234, 236, 244)",
                  drawBorder: false,
                  borderDash: [2],
                  zeroLineBorderDash: [2]
                },
                ticks: {
                  beginAtZero: true
                }
              }]
            },
            legend: {
              display: true,
              position: 'top'
            },
            tooltips: {
              titleMarginBottom: 10,
              titleFontColor: '#6e707e',
              titleFontSize: 14,
              backgroundColor: "rgb(255,255,255)",
              bodyFontColor: "#858796",
              borderColor: '#dddfeb',
              borderWidth: 1,
              xPadding: 15,
              yPadding: 15,
              displayColors: false,
              caretPadding: 10
            }
          }
        });
      }
      
      // Добавляем функциональность поиска
      document.getElementById('inventory-table-search').addEventListener('keyup', function() {
        const searchTerm = this.value.toLowerCase();
        const table = document.getElementById('inventory-table');
        const rows = table.getElementsByTagName('tr');
        
        for (let i = 1; i < rows.length; i++) {
          let found = false;
          const cells = rows[i].getElementsByTagName('td');
          
          for (let j = 0; j < cells.length; j++) {
            const cellText = cells[j].textContent.toLowerCase();
            if (cellText.indexOf(searchTerm) > -1) {
              found = true;
              break;
            }
          }
          
          if (found) {
            rows[i].style.display = '';
          } else {
            rows[i].style.display = 'none';
          }
        }
      });
      
      // Проверяем, загружена ли библиотека Chart.js
      if (typeof Chart !== 'undefined') {
        // Рендерим графики, если Chart.js доступен
        renderInventoryDistributionChart();
        renderStockLevelChart();
      } else {
        // Загружаем Chart.js, если он не доступен
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js';
        script.onload = function() {
          renderInventoryDistributionChart();
          renderStockLevelChart();
        };
        document.head.appendChild(script);
      }
    </script>
  `;
  
  reportContent.innerHTML = html;
}

// Load clients for filter dropdown
async function loadClientsForFilter() {
  try {
    const response = await fetch('/api/clients');
    if (!response.ok) {
      throw new Error('Ошибка загрузки списка клиентов');
    }
    
    const clients = await response.json();
    
    // Проверяем формат полученных данных
    const clientsList = Array.isArray(clients) ? clients : (clients.data || []);
    
    const clientFilter = document.getElementById('client-filter');
    if (clientFilter) {
      // Очищаем текущие опции
      clientFilter.innerHTML = `<option value="" data-i18n="allClients">Все клиенты</option>`;
      
      // Добавляем опции клиентов
      clientsList.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.name;
        clientFilter.appendChild(option);
      });
      
      // Переводим элементы
      applyTranslations();
    }
  } catch (error) {
    console.error('Ошибка при загрузке клиентов:', error);
    // В случае ошибки продолжаем работу с пустым списком
    const clientFilter = document.getElementById('client-filter');
    if (clientFilter) {
      clientFilter.innerHTML = `<option value="" data-i18n="allClients">Все клиенты</option>`;
      applyTranslations();
    }
  }
}

// Load suppliers for filter dropdown
async function loadSuppliersForFilter() {
  try {
    const response = await fetch('/api/suppliers');
    if (!response.ok) {
      throw new Error('Ошибка загрузки списка поставщиков');
    }
    
    const suppliers = await response.json();
    
    // Проверяем формат полученных данных
    const suppliersList = Array.isArray(suppliers) ? suppliers : (suppliers.data || []);
    
    const supplierFilter = document.getElementById('supplier-filter');
    if (supplierFilter) {
      // Очищаем текущие опции
      supplierFilter.innerHTML = `<option value="" data-i18n="allSuppliers">Все поставщики</option>`;
      
      // Добавляем опции поставщиков
      suppliersList.forEach(supplier => {
        const option = document.createElement('option');
        option.value = supplier.id;
        option.textContent = supplier.name;
        supplierFilter.appendChild(option);
      });
      
      // Переводим элементы
      applyTranslations();
    }
  } catch (error) {
    console.error('Ошибка при загрузке поставщиков:', error);
    // В случае ошибки продолжаем работу с пустым списком
    const supplierFilter = document.getElementById('supplier-filter');
    if (supplierFilter) {
      supplierFilter.innerHTML = `<option value="" data-i18n="allSuppliers">Все поставщики</option>`;
      applyTranslations();
    }
  }
}

// Функция для отображения отчета о клиентах
function renderClientsReport(data) {
  const reportContent = document.getElementById('report-content');
  
  // Инициализируем переводы перед использованием
  initializeTranslations();
  
  // Получаем текущий язык
  const currentLanguage = window.currentLanguage || localStorage.getItem('language') || localStorage.getItem('erp_language') || 'en';
  console.log('Using language for clients report:', currentLanguage);
  
  // Функция для безопасного получения текста перевода
  const getTranslatedText = (key, defaultText) => {
    if (window.translations && 
        window.translations[currentLanguage] && 
        window.translations[currentLanguage][key]) {
      return window.translations[currentLanguage][key];
    }
    
    // Пробуем получить перевод через erpLanguage API, если он доступен
    if (window.erpLanguage && typeof window.erpLanguage.translate === 'function') {
      const translation = window.erpLanguage.translate(key);
      if (translation && translation !== key) {
        return translation;
      }
    }
    
    console.warn(`Translation for key "${key}" not found, using default text`);
    return defaultText;
  };
  
  if (!data || !data.data || data.data.length === 0) {
    reportContent.innerHTML = `<div class="alert alert-info">${getTranslatedText('noClientData', 'No client data to display.')}</div>`;
    return;
  }
  
  const clients = data.data;
  const totalClients = clients.length;
  
  // Получаем все необходимые переводы
  const clientReportText = getTranslatedText('clientReport', 'Client Report');
  const generatedText = getTranslatedText('generated', 'Generated');
  const exportFullReportText = getTranslatedText('exportFullReport', 'Export Full Report to PDF');
  const clientsSummaryText = getTranslatedText('clientsSummary', 'Clients Summary');
  const exportSectionText = getTranslatedText('exportSection', 'Export Section');
  const totalClientsText = getTranslatedText('totalClients', 'Total Clients');
  const clientsListText = getTranslatedText('clientsList', 'Clients List');
  const searchClientsText = getTranslatedText('searchClients', 'Search clients...');
  const idText = getTranslatedText('id', 'ID');
  const nameText = getTranslatedText('name', 'Name');
  const contactPersonText = getTranslatedText('contactPerson', 'Contact Person');
  const emailText = getTranslatedText('email', 'Email');
  const phoneText = getTranslatedText('phone', 'Phone');
  const addressText = getTranslatedText('address', 'Address');
  
  // Форматирование даты
  const currentDate = new Date();
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString(currentLanguage === 'ru' ? 'ru-RU' : currentLanguage === 'tr' ? 'tr-TR' : 'en-US', dateOptions);
  
  // Create report header
  let html = `
    <div class="report-header">
      <h3 class="report-title">${clientReportText}</h3>
      <div class="report-meta">${generatedText} ${formattedDate}</div>
    </div>
    
    <div class="report-actions">
      <button class="btn btn-primary" onclick="generatePDF('report-content', 'clients-report')">
        <i class="fas fa-file-pdf"></i> ${exportFullReportText}
      </button>
    </div>
    
    <div id="clients-summary-section" class="report-section">
      <div class="section-header">
        <h4>${clientsSummaryText}</h4>
        <button class="btn btn-sm btn-outline-primary" onclick="generateSectionPDF('clients-summary-section', '${clientsSummaryText}')">
          <i class="fas fa-file-pdf"></i> ${exportSectionText}
        </button>
      </div>
      
      <div class="report-dashboard">
        <div class="dashboard-card total-card" style="border-left-color: #007bff;">
          <div class="card-icon"><i class="fas fa-users" style="color: #007bff;"></i></div>
          <div class="card-data">
            <div class="card-value">${totalClients}</div>
            <div class="card-label">${totalClientsText}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div id="clients-list-section" class="report-section">
      <div class="section-header">
        <h4>${clientsListText}</h4>
        <button class="btn btn-sm btn-outline-primary" onclick="generateSectionPDF('clients-list-section', '${clientsListText}')">
          <i class="fas fa-file-pdf"></i> ${exportSectionText}
        </button>
      </div>
      
      <div class="search-container">
        <input type="text" id="clients-table-search" placeholder="${searchClientsText}" class="form-control search-input">
        <i class="fas fa-search search-icon"></i>
      </div>
      
      <div class="report-table-container">
        <table class="report-table" id="clients-table">
          <thead>
            <tr>
              <th onclick="sortTable('clients-table', 0)">${idText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('clients-table', 1)">${nameText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('clients-table', 2)">${contactPersonText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('clients-table', 3)">${emailText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('clients-table', 4)">${phoneText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('clients-table', 5)">${addressText} <i class="fas fa-sort"></i></th>
            </tr>
          </thead>
          <tbody>
  `;
  
  // Add client rows
  clients.forEach(client => {
    const name = client.name || client.client_name || '-';
    const contactPerson = client.contact_person || client.contactPerson || '-';
    const email = client.email || '-';
    const phone = client.phone || client.phone_number || '-';
    const address = client.address || '-';
    
    html += `
      <tr>
        <td>${client.id || '-'}</td>
        <td><strong>${name}</strong></td>
        <td>${contactPerson}</td>
        <td>${email}</td>
        <td>${phone}</td>
        <td>${address}</td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
    </div>
    </div>
    
    <script>
      // Add search functionality
      document.getElementById('clients-table-search').addEventListener('keyup', function() {
        const searchTerm = this.value.toLowerCase();
        const table = document.getElementById('clients-table');
        const rows = table.getElementsByTagName('tr');
        
        for (let i = 1; i < rows.length; i++) {
          let found = false;
          const cells = rows[i].getElementsByTagName('td');
          
          for (let j = 0; j < cells.length; j++) {
            const cellText = cells[j].textContent.toLowerCase();
            if (cellText.indexOf(searchTerm) > -1) {
              found = true;
              break;
            }
          }
          
          if (found) {
            rows[i].style.display = '';
          } else {
            rows[i].style.display = 'none';
          }
        }
      });
    </script>
  `;
  
  reportContent.innerHTML = html;
}

// Функция для отображения отчета о поставщиках
function renderSuppliersReport(data) {
  const reportContent = document.getElementById('report-content');
  
  // Инициализируем переводы перед использованием
  initializeTranslations();
  
  // Получаем текущий язык
  const currentLanguage = window.currentLanguage || localStorage.getItem('language') || localStorage.getItem('erp_language') || 'en';
  console.log('Using language for supplier report:', currentLanguage);
  
  // Функция для безопасного получения текста перевода
  const getTranslatedText = (key, defaultText) => {
    if (window.translations && 
        window.translations[currentLanguage] && 
        window.translations[currentLanguage][key]) {
      return window.translations[currentLanguage][key];
    }
    
    // Пробуем получить перевод через erpLanguage API, если он доступен
    if (window.erpLanguage && typeof window.erpLanguage.translate === 'function') {
      const translation = window.erpLanguage.translate(key);
      if (translation && translation !== key) {
        return translation;
      }
    }
    
    console.warn(`Translation for key "${key}" not found, using default text`);
    return defaultText;
  };
  
  if (!data || !data.data || data.data.length === 0) {
    reportContent.innerHTML = `<div class="alert alert-info">${getTranslatedText('noSupplierData', 'No supplier data available to display.')}</div>`;
    return;
  }
  
  // Получаем поставщиков
  const suppliers = data.data;
  
  // Получаем переводы для всех элементов отчета
  const supplierReportText = getTranslatedText('supplierReport', 'Supplier Report');
  const generatedText = getTranslatedText('generated', 'Generated');
  const exportToPdfText = getTranslatedText('exportToPdf', 'Export to PDF');
  const exportFullReportText = getTranslatedText('exportFullReport', 'Export Full Report');
  const suppliersSummaryText = getTranslatedText('suppliersSummary', 'Suppliers Summary');
  const exportSectionText = getTranslatedText('exportSection', 'Export Section');
  const totalSuppliersText = getTranslatedText('totalSuppliers', 'Total Suppliers');
  const suppliersListText = getTranslatedText('suppliersList', 'Suppliers List');
  const searchSuppliersText = getTranslatedText('searchSuppliers', 'Search suppliers...');
  const idText = getTranslatedText('id', 'ID');
  const nameText = getTranslatedText('name', 'Name');
  const contactPersonText = getTranslatedText('contactPerson', 'Contact Person');
  const emailText = getTranslatedText('email', 'Email');
  const phoneText = getTranslatedText('phone', 'Phone');
  const addressText = getTranslatedText('address', 'Address');
  const paymentTermsText = getTranslatedText('paymentTerms', 'Payment Terms');
  
  // Форматирование даты
  const currentDate = new Date();
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString(currentLanguage === 'ru' ? 'ru-RU' : currentLanguage === 'tr' ? 'tr-TR' : 'en-US', dateOptions);
  
  // Создаем HTML-разметку отчета
  let html = `
    <div class="report-header">
      <h3 class="report-title">${supplierReportText}</h3>
      <div class="report-meta">${generatedText} ${formattedDate}</div>
    </div>
    
    <div class="report-actions">
      <button class="btn btn-primary" onclick="generatePDF('report-content', 'supplier-report')">
        <i class="fas fa-file-pdf"></i> ${exportFullReportText}
      </button>
    </div>
    
    <div id="suppliers-summary-section" class="report-section">
      <div class="section-header">
        <h4>${suppliersSummaryText}</h4>
        <button class="btn btn-sm btn-outline-primary" onclick="generateSectionPDF('suppliers-summary-section', '${suppliersSummaryText}')">
          <i class="fas fa-file-pdf"></i> ${exportSectionText}
        </button>
      </div>
      
      <div class="report-dashboard">
        <div class="dashboard-card">
          <div class="card-icon"><i class="fas fa-truck"></i></div>
          <div class="card-data">
            <div class="summary-value">${suppliers.length}</div>
            <div class="summary-label">${totalSuppliersText}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div id="suppliers-list-section" class="report-section">
      <div class="section-header">
        <h4>${suppliersListText}</h4>
        <button class="btn btn-sm btn-outline-primary" onclick="generateSectionPDF('suppliers-list-section', '${suppliersListText}')">
          <i class="fas fa-file-pdf"></i> ${exportSectionText}
        </button>
      </div>
      
      <div class="search-container">
        <input type="text" id="suppliers-table-search" placeholder="${searchSuppliersText}" class="form-control search-input">
        <i class="fas fa-search search-icon"></i>
      </div>
      
      <div class="report-table-container">
        <table class="report-table" id="suppliers-table">
          <thead>
            <tr>
              <th onclick="sortTable('suppliers-table', 0)">${idText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('suppliers-table', 1)">${nameText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('suppliers-table', 2)">${contactPersonText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('suppliers-table', 3)">${emailText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('suppliers-table', 4)">${phoneText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('suppliers-table', 5)">${addressText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('suppliers-table', 6)">${paymentTermsText} <i class="fas fa-sort"></i></th>
            </tr>
          </thead>
          <tbody>
  `;
  
  // Добавляем строки с поставщиками
  suppliers.forEach(supplier => {
    // Переводим условия оплаты
    let paymentTermsValue = supplier.payment_terms || supplier.paymentTerms || '-';
    
    // Переводим условия оплаты на русский, если текущий язык - русский
    if (currentLanguage === 'ru') {
      // Словарь для типичных условий оплаты
      const paymentTermsDict = {
        'Net 30': 'Оплата через 30 дней',
        'Net 60': 'Оплата через 60 дней',
        'Net 90': 'Оплата через 90 дней',
        'COD': 'Оплата при доставке',
        'Prepaid': 'Предоплата',
        'EOM': 'В конце месяца',
        '2/10 Net 30': '2% скидка при оплате в течение 10 дней, полная сумма через 30 дней',
        'Due on Receipt': 'Оплата по получении',
        'Cash on Delivery': 'Оплата наличными при доставке',
        'Payment in Advance': 'Предоплата',
        'Letter of Credit': 'Аккредитив'
      };
      
      // Проверяем, есть ли точное соответствие в словаре
      if (paymentTermsDict[paymentTermsValue]) {
        paymentTermsValue = paymentTermsDict[paymentTermsValue];
      }
      // Если точного соответствия нет, пробуем шаблонную замену
      else if (paymentTermsValue.match(/Net\s+(\d+)/i)) {
        // "Net 30" -> "Оплата через 30 дней"
        paymentTermsValue = paymentTermsValue.replace(
          /Net\s+(\d+)/i, 
          'Оплата через $1 дней'
        );
      }
    }
    
    html += `
      <tr>
        <td>${supplier.id || '-'}</td>
        <td>${supplier.name || '-'}</td>
        <td>${supplier.contact_person || supplier.contactPerson || '-'}</td>
        <td>${supplier.email || '-'}</td>
        <td>${supplier.phone || '-'}</td>
        <td>${supplier.address || '-'}</td>
        <td>${paymentTermsValue}</td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
    </div>
    </div>
    
    <script>
      // Добавляем функциональность поиска
      document.getElementById('suppliers-table-search').addEventListener('keyup', function() {
        const searchTerm = this.value.toLowerCase();
        const table = document.getElementById('suppliers-table');
        const rows = table.getElementsByTagName('tr');
        
        for (let i = 1; i < rows.length; i++) {
          let found = false;
          const cells = rows[i].getElementsByTagName('td');
          
          for (let j = 0; j < cells.length; j++) {
            const cellText = cells[j].textContent.toLowerCase();
            if (cellText.indexOf(searchTerm) > -1) {
              found = true;
              break;
            }
          }
          
          if (found) {
            rows[i].style.display = '';
          } else {
            rows[i].style.display = 'none';
          }
        }
      });
    </script>
  `;
  
  reportContent.innerHTML = html;
}

// Function for formatting date
function formatDate(dateString) {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // If conversion failed, return original string
    
    // Определяем локаль в зависимости от текущего языка
    let locale = 'en-US';
    if (window.currentLanguage === 'ru') {
      locale = 'ru-RU';
    } else if (window.currentLanguage === 'tr') {
      locale = 'tr-TR';
    }
    
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

// Function for formatting currency
function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '-';
  
  const currency = 'USD';
  const options = {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };
  
  // Определяем локаль в зависимости от текущего языка
  let locale = 'en-US';
  if (window.currentLanguage === 'ru') {
    locale = 'ru-RU';
  } else if (window.currentLanguage === 'tr') {
    locale = 'tr-TR';
  }
  
  return new Intl.NumberFormat(locale, options).format(amount);
}

// Улучшенная функция генерации PDF
async function generatePDF(elementId, filename) {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-overlay';
    loadingDiv.innerHTML = '<div class="spinner"></div><div>Creating PDF...</div>';
    document.body.appendChild(loadingDiv);

    const libraryLoaded = await loadJsPdfLibrary();
    if (!libraryLoaded) {
      throw new Error('Failed to load PDF library');
    }

    // Создаем PDF документ с поддержкой русского языка
    const doc = new window.jspdf.jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
      putOnlyUsedFonts: true,
      floatPrecision: 16
    });

    // Добавляем поддержку кириллицы
    doc.addFont('https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-regular-webfont.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto');

    // Получаем заголовок отчета
    const titleElement = element.querySelector('.report-title');
    const title = titleElement ? titleElement.textContent : 'Отчет';

    // Добавляем заголовок
    doc.setFontSize(18);
    doc.text(title, 105, 15, { align: 'center' });

    // Добавляем дату генерации
    doc.setFontSize(10);
    doc.text(`Generated: ${formatDate(new Date())}`, 105, 22, { align: 'center' });

    // Обрабатываем карточки с данными
    const cards = element.querySelectorAll('.dashboard-card');
    if (cards.length > 0) {
      let yPos = 35;
      cards.forEach((card, index) => {
        const value = card.querySelector('.card-value')?.textContent || '';
        const label = card.querySelector('.card-label')?.textContent || '';

        doc.setFontSize(12);
        doc.text(value, 20 + (index * 60), yPos);
        doc.setFontSize(10);
        doc.text(label, 20 + (index * 60), yPos + 5);
      });
      yPos += 20;
    }

    // Обрабатываем таблицу с поддержкой русского языка
    const table = element.querySelector('table');
    if (table) {
      const headers = Array.from(table.querySelectorAll('thead th'))
        .map(th => th.textContent.replace(/[▲▼\s]*$/, '').trim());

      const rows = Array.from(table.querySelectorAll('tbody tr'))
        .map(tr => Array.from(tr.querySelectorAll('td'))
          .map(td => td.textContent.trim()));

      doc.autoTable({
        head: [headers],
        body: rows,
        startY: 60,
        styles: {
          font: 'Roboto',
          fontSize: 9,
          cellPadding: 2,
          overflow: 'linebreak',
          cellWidth: 'wrap',
          halign: 'left'
        },
        headStyles: {
          fillColor: [51, 122, 183],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { top: 60, right: 15, bottom: 15, left: 15 },
        didDrawPage: function(data) {
          // Добавляем номер страницы
          doc.setFontSize(8);
          doc.text(
            `Page ${data.pageNumber} из ${doc.internal.getNumberOfPages()}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
          );
        }
      });
    }

    // Сохраняем PDF с правильной кодировкой имени файла
    const safeFilename = filename.replace(/[^a-zа-яё0-9]/gi, '_').toLowerCase() + '.pdf';
    doc.save(safeFilename);

    showNotification('PDF successfully created', 'success');
  } catch (error) {
    console.error('Error creating PDF:', error);
    showNotification('Error creating PDF: ' + error.message, 'error');
  } finally {
    const loadingDiv = document.querySelector('.loading-overlay');
    if (loadingDiv) {
      loadingDiv.remove();
    }
  }
}

// Функция для генерации PDF отдельной секции с поддержкой русского языка
async function generateSectionPDF(sectionId, sectionName) {
  try {
    const section = document.getElementById(sectionId);
    if (!section) {
      throw new Error(`Section with ID "${sectionId}" not found`);
    }

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-overlay';
    loadingDiv.innerHTML = '<div class="spinner"></div><div>Creating section PDF...</div>';
    document.body.appendChild(loadingDiv);

    // Загружаем библиотеку jsPDF
    const libraryLoaded = await loadJsPdfLibrary();
    if (!libraryLoaded) {
      throw new Error('Не удалось загрузить библиотеку PDF');
    }

    // Создаем PDF документ с поддержкой русского языка
    const doc = new window.jspdf.jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
      putOnlyUsedFonts: true,
      floatPrecision: 16
    });

    // Добавляем поддержку кириллицы
    doc.addFont('https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-regular-webfont.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto');

    // Добавляем заголовок секции
    doc.setFontSize(16);
    doc.text(sectionName, 105, 15, { align: 'center' });

    // Добавляем дату генерации
    doc.setFontSize(10);
    doc.text(`Generated: ${formatDate(new Date())}`, 105, 22, { align: 'center' });

    // Обрабатываем карточки с данными
    const cards = section.querySelectorAll('.dashboard-card');
    if (cards.length > 0) {
      let yPos = 35;
      cards.forEach((card, index) => {
        const value = card.querySelector('.card-value')?.textContent || '';
        const label = card.querySelector('.card-label')?.textContent || '';

        doc.setFontSize(12);
        doc.text(value, 20 + (index * 60), yPos);
        doc.setFontSize(10);
        doc.text(label, 20 + (index * 60), yPos + 5);
      });
      yPos += 20;
    }

    // Обрабатываем таблицу с поддержкой русского языка
    const table = section.querySelector('table');
    if (table) {
      const headers = Array.from(table.querySelectorAll('thead th'))
        .map(th => th.textContent.replace(/[▲▼\s]*$/, '').trim());

      const rows = Array.from(table.querySelectorAll('tbody tr'))
        .map(tr => Array.from(tr.querySelectorAll('td'))
          .map(td => td.textContent.trim()));

      doc.autoTable({
        head: [headers],
        body: rows,
        startY: 60,
        styles: {
          font: 'Roboto',
          fontSize: 9,
          cellPadding: 2,
          overflow: 'linebreak',
          cellWidth: 'wrap',
          halign: 'left'
        },
        headStyles: {
          fillColor: [51, 122, 183],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { top: 60, right: 15, bottom: 15, left: 15 },
        didDrawPage: function(data) {
          // Добавляем номер страницы
          doc.setFontSize(8);
          doc.text(
            `Page ${data.pageNumber} of ${doc.internal.getNumberOfPages()}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
          );
        }
      });
    }

    // Сохраняем PDF с правильной кодировкой имени файла
    const safeFilename = sectionName.replace(/[^a-zа-яё0-9]/gi, '_').toLowerCase() + '.pdf';
    doc.save(safeFilename);

    showNotification('Section PDF successfully created', 'success');
  } catch (error) {
    console.error('Error creating section PDF:', error);
    showNotification('Error creating section PDF: ' + error.message, 'error');
  } finally {
    const loadingDiv = document.querySelector('.loading-overlay');
    if (loadingDiv) {
      loadingDiv.remove();
    }
  }
}

// Добавляем стили для индикатора загрузки
const style = document.createElement('style');
style.textContent = `
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// Helper function for notifications
function showNotification(message, type = 'info') {
  // Удаляем предыдущие уведомления
  const existingNotifications = document.querySelectorAll('.notification-container');
  existingNotifications.forEach(notification => notification.remove());

  // Создаем новое уведомление
  const notification = document.createElement('div');
  notification.className = `notification-container notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;

  // Добавляем стили для уведомления
  const notificationStyles = `
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 350px;
      padding: 15px;
      border-radius: 4px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      animation: slideIn 0.3s ease-out;
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .notification-message {
      margin-right: 10px;
      color: #fff;
    }
    
    .notification-close {
      background: none;
      border: none;
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      padding: 0 5px;
    }
    
    .notification-info {
      background-color: #3498db;
    }
    
    .notification-success {
      background-color: #2ecc71;
    }
    
    .notification-error {
      background-color: #e74c3c;
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;

  // Добавляем стили, если они еще не добавлены
  if (!document.getElementById('notification-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'notification-styles';
    styleElement.textContent = notificationStyles;
    document.head.appendChild(styleElement);
  }

  // Добавляем уведомление в DOM
  document.body.appendChild(notification);

  // Добавляем обработчик для кнопки закрытия
  const closeButton = notification.querySelector('.notification-close');
  if (closeButton) {
    closeButton.addEventListener('click', () => notification.remove());
  }

  // Автоматически скрываем уведомление через 5 секунд
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}

// Функция для отображения отчета о товарах с низким запасом
function renderLowStockReport(data) {
  const reportContent = document.getElementById('report-content');
  
  // Инициализируем переводы перед использованием
  initializeTranslations();
  
  // Получаем текущий язык
  const currentLanguage = window.currentLanguage || localStorage.getItem('language') || localStorage.getItem('erp_language') || 'en';
  console.log('Using language for low stock report:', currentLanguage);
  
  // Функция для безопасного получения текста перевода
  const getTranslatedText = (key, defaultText) => {
    if (window.translations && 
        window.translations[currentLanguage] && 
        window.translations[currentLanguage][key]) {
      return window.translations[currentLanguage][key];
    }
    
    // Пробуем получить перевод через erpLanguage API, если он доступен
    if (window.erpLanguage && typeof window.erpLanguage.translate === 'function') {
      const translation = window.erpLanguage.translate(key);
      if (translation && translation !== key) {
        return translation;
      }
    }
    
    console.warn(`Translation for key "${key}" not found, using default text`);
    return defaultText;
  };
  
  if (!data || !data.data || data.data.length === 0) {
    reportContent.innerHTML = `<div class="alert alert-info">${getTranslatedText('noLowStockData', 'No low stock items found.')}</div>`;
    return;
  }
  
  const products = data.data;
  const totalLowStockItems = products.length;
  
  // Получаем все необходимые переводы
  const lowStockReportText = getTranslatedText('lowStockReport', 'Low Stock Report');
  const generatedText = getTranslatedText('generated', 'Generated');
  const exportToPdfText = getTranslatedText('exportToPdf', 'Export to PDF');
  const lowStockSummaryText = getTranslatedText('lowStockSummary', 'Low Stock Summary');
  const exportSectionText = getTranslatedText('exportSection', 'Export Section');
  const totalLowStockText = getTranslatedText('totalLowStockItems', 'Total Low Stock Items');
  const lowStockDetailsText = getTranslatedText('lowStockDetails', 'Low Stock Details');
  const searchItemsText = getTranslatedText('searchItems', 'Search items...');
  const idText = getTranslatedText('id', 'ID');
  const itemText = getTranslatedText('item', 'Item');
  const currentStockText = getTranslatedText('currentStock', 'Current Stock');
  const minLevelText = getTranslatedText('minLevel', 'Min Level');
  const supplierText = getTranslatedText('supplier', 'Supplier');
  const statusText = getTranslatedText('status', 'Status');
  const criticalText = getTranslatedText('critical', 'Critical Stock');
  const warningText = getTranslatedText('warning', 'Needs Replenishment');
  const outOfStockText = getTranslatedText('outOfStock', 'Out of Stock');
  
  // Форматирование даты
  const currentDate = new Date();
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString(currentLanguage === 'ru' ? 'ru-RU' : currentLanguage === 'tr' ? 'tr-TR' : 'en-US', dateOptions);
  
  // Create report header
  let html = `
    <div class="report-header">
      <h3 class="report-title">${lowStockReportText}</h3>
      <div class="report-meta">${generatedText} ${formattedDate}</div>
    </div>
    
    <div class="report-actions">
      <button class="btn btn-primary" onclick="generatePDF('report-content', 'low-stock-report')">
        <i class="fas fa-file-pdf"></i> ${exportToPdfText}
      </button>
    </div>
    
    <div id="low-stock-summary-section" class="report-section">
      <div class="section-header">
        <h4>${lowStockSummaryText}</h4>
        <button class="btn btn-sm btn-outline-primary" onclick="generateSectionPDF('low-stock-summary-section', '${lowStockSummaryText}')">
          <i class="fas fa-file-pdf"></i> ${exportSectionText}
        </button>
      </div>
      
      <div class="report-dashboard">
        <div class="dashboard-card total-card" style="border-left-color: #dc3545;">
          <div class="card-icon"><i class="fas fa-exclamation-triangle" style="color: #dc3545;"></i></div>
          <div class="card-data">
            <div class="card-value">${totalLowStockItems}</div>
            <div class="card-label">${totalLowStockText}</div>
          </div>
        </div>
        
        <div class="dashboard-card" style="border-left-color: #dc3545;">
          <div class="card-icon"><i class="fas fa-exclamation-circle" style="color: #dc3545;"></i></div>
          <div class="card-data">
            <div class="card-value">${products.filter(p => p.current_stock === 0).length}</div>
            <div class="card-label">${outOfStockText}</div>
          </div>
        </div>
        
        <div class="dashboard-card" style="border-left-color: #ff9800;">
          <div class="card-icon"><i class="fas fa-exclamation-triangle" style="color: #ff9800;"></i></div>
          <div class="card-data">
            <div class="card-value">${products.filter(p => p.current_stock < p.min_stock_level * 0.5 && p.current_stock > 0).length}</div>
            <div class="card-label">${criticalText}</div>
          </div>
        </div>
        
        <div class="dashboard-card" style="border-left-color: #ffc107;">
          <div class="card-icon"><i class="fas fa-info-circle" style="color: #ffc107;"></i></div>
          <div class="card-data">
            <div class="card-value">${products.filter(p => p.current_stock >= p.min_stock_level * 0.5 && p.current_stock < p.min_stock_level).length}</div>
            <div class="card-label">${warningText}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div id="low-stock-details-section" class="report-section">
      <div class="section-header">
        <h4>${lowStockDetailsText}</h4>
        <button class="btn btn-sm btn-outline-primary" onclick="generateSectionPDF('low-stock-details-section', '${lowStockDetailsText}')">
          <i class="fas fa-file-pdf"></i> ${exportSectionText}
        </button>
      </div>
      
      <div class="search-container">
        <input type="text" id="low-stock-table-search" placeholder="${searchItemsText}" class="form-control search-input">
        <i class="fas fa-search search-icon"></i>
      </div>
      
      <div class="report-table-container">
        <table class="report-table" id="low-stock-table">
          <thead>
            <tr>
              <th onclick="sortTable('low-stock-table', 0)">${idText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('low-stock-table', 1)">${itemText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('low-stock-table', 2)">${currentStockText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('low-stock-table', 3)">${minLevelText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('low-stock-table', 4)">${supplierText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('low-stock-table', 5)">${statusText} <i class="fas fa-sort"></i></th>
            </tr>
          </thead>
          <tbody>
  `;
  
  // Add product rows
  products.forEach(product => {
    const currentStock = parseInt(product.current_stock || product.stock || 0);
    const minStockLevel = parseInt(product.min_stock_level || product.min_stock || 0);
    const name = product.name || product.product_name || '-';
    const category = product.category || '-';
    const supplier = product.supplier_name || product.supplier || '-';
    
    // Determine status
    let statusClass = '';
    let statusText = '';
    
    if (currentStock === 0) {
      statusClass = 'critical';
      statusText = outOfStockText;
    } else if (currentStock < minStockLevel * 0.5) {
      statusClass = 'critical';
      statusText = criticalText;
    } else if (currentStock < minStockLevel) {
      statusClass = 'warning';
      statusText = warningText;
    }
    
    html += `
      <tr>
        <td>${product.id || product.product_id || '-'}</td>
        <td><strong>${name}</strong></td>
        <td>${currentStock}</td>
        <td>${minStockLevel}</td>
        <td>${supplier}</td>
        <td><span class="status-badge status-${statusClass}">${statusText}</span></td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
    </div>
    </div>
    
    <script>
      // Add search functionality
      document.getElementById('low-stock-table-search').addEventListener('keyup', function() {
        const searchTerm = this.value.toLowerCase();
        const table = document.getElementById('low-stock-table');
        const rows = table.getElementsByTagName('tr');
        
        for (let i = 1; i < rows.length; i++) {
          let found = false;
          const cells = rows[i].getElementsByTagName('td');
          
          for (let j = 0; j < cells.length; j++) {
            const cellText = cells[j].textContent.toLowerCase();
            if (cellText.indexOf(searchTerm) > -1) {
              found = true;
              break;
            }
          }
          
          if (found) {
            rows[i].style.display = '';
          } else {
            rows[i].style.display = 'none';
          }
        }
      });
    </script>
  `;
  
  reportContent.innerHTML = html;
}

// Функция для отображения финансового отчета
function renderFinancialReport(data) {
  const reportContent = document.getElementById('report-content');
  
  // Инициализируем переводы перед использованием
  initializeTranslations();
  
  // Получаем текущий язык
  const currentLanguage = window.currentLanguage || localStorage.getItem('language') || localStorage.getItem('erp_language') || 'en';
  console.log('Using language for financial report:', currentLanguage);
  
  // Функция для безопасного получения текста перевода
  const getTranslatedText = (key, defaultText) => {
    if (window.translations && 
        window.translations[currentLanguage] && 
        window.translations[currentLanguage][key]) {
      return window.translations[currentLanguage][key];
    }
    
    // Пробуем получить перевод через erpLanguage API, если он доступен
    if (window.erpLanguage && typeof window.erpLanguage.translate === 'function') {
      const translation = window.erpLanguage.translate(key);
      if (translation && translation !== key) {
        return translation;
      }
    }
    
    console.warn(`Translation for key "${key}" not found, using default text`);
    return defaultText;
  };
  
  if (!data || !data.data || data.data.length === 0) {
    reportContent.innerHTML = `<div class="alert alert-info">${getTranslatedText('noFinancialData', 'No financial data to display.')}</div>`;
    return;
  }
  
  // Получаем транзакции
  const transactions = data.data;
  
  // Вычисляем итоги
  const totalIncome = data.totalIncome || transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0) || 0;
  const totalExpenses = data.totalExpenses || transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0) || 0;
  const totalSales = data.totalSales || transactions.filter(t => t.source === 'sale').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0) || 0;
  const totalPurchases = data.totalPurchases || transactions.filter(t => t.source === 'purchase').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0) || 0;
  const netProfit = totalIncome - totalExpenses;
  
  // Получаем переводы для всех элементов отчета
  const financialReportText = getTranslatedText('financialReport', 'Financial Report');
  const generatedText = getTranslatedText('generated', 'Generated');
  const exportToPdfText = getTranslatedText('exportToPdf', 'Export to PDF');
  const financialSummaryText = getTranslatedText('financialSummary', 'Financial Summary');
  const exportSectionText = getTranslatedText('exportSection', 'Export Section');
  const totalIncomeText = getTranslatedText('totalIncome', 'Total Income');
  const totalExpensesText = getTranslatedText('totalExpenses', 'Total Expenses');
  const totalSalesText = getTranslatedText('totalSales', 'Total Sales');
  const totalPurchasesText = getTranslatedText('totalPurchases', 'Total Purchases');
  const netProfitText = getTranslatedText('netProfit', 'Net Profit');
  const transactionsText = getTranslatedText('transactions', 'Transactions');
  const searchTransactionsText = getTranslatedText('searchTransactions', 'Search transactions...');
  const idText = getTranslatedText('id', 'ID');
  const dateText = getTranslatedText('date', 'Date');
  const descriptionText = getTranslatedText('description', 'Description');
  const typeText = getTranslatedText('type', 'Type');
  const sourceText = getTranslatedText('source', 'Source');
  const amountText = getTranslatedText('amount', 'Amount');
  
  // Форматирование даты
  const currentDate = new Date();
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString(currentLanguage === 'ru' ? 'ru-RU' : currentLanguage === 'tr' ? 'tr-TR' : 'en-US', dateOptions);
  
  // Создаем HTML-разметку отчета
  let html = `
    <div class="report-header">
      <h3 class="report-title">${financialReportText}</h3>
      <div class="report-meta">${generatedText} ${formattedDate}</div>
    </div>
    
    <div class="report-actions">
      <button class="btn btn-primary" onclick="generatePDF('report-content', 'financial-report')">
        <i class="fas fa-file-pdf"></i> ${exportToPdfText}
      </button>
    </div>
    
    <div id="financial-summary-section" class="report-section">
      <div class="section-header">
        <h4>${financialSummaryText}</h4>
        <button class="btn btn-sm btn-outline-primary" onclick="generateSectionPDF('financial-summary-section', '${financialSummaryText}')">
          <i class="fas fa-file-pdf"></i> ${exportSectionText}
        </button>
      </div>
      
      <div class="report-dashboard">
        <div class="dashboard-card" style="border-left-color: #28a745;">
          <div class="card-icon"><i class="fas fa-arrow-up" style="color: #28a745;"></i></div>
          <div class="card-data">
            <div class="summary-value">${formatCurrency(totalIncome)}</div>
            <div class="summary-label">${totalIncomeText}</div>
          </div>
        </div>
        
        <div class="dashboard-card" style="border-left-color: #dc3545;">
          <div class="card-icon"><i class="fas fa-arrow-down" style="color: #dc3545;"></i></div>
          <div class="card-data">
            <div class="summary-value">${formatCurrency(totalExpenses)}</div>
            <div class="summary-label">${totalExpensesText}</div>
          </div>
        </div>
        
        <div class="dashboard-card" style="border-left-color: #17a2b8;">
          <div class="card-icon"><i class="fas fa-calculator" style="color: #17a2b8;"></i></div>
          <div class="card-data">
            <div class="summary-value">${formatCurrency(netProfit)}</div>
            <div class="summary-label">${netProfitText}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div id="transactions-section" class="report-section">
      <div class="section-header">
        <h4>${transactionsText}</h4>
        <button class="btn btn-sm btn-outline-primary" onclick="generateSectionPDF('transactions-section', '${transactionsText}')">
          <i class="fas fa-file-pdf"></i> ${exportSectionText}
        </button>
      </div>
      
      <div class="search-container">
        <input type="text" id="financial-table-search" placeholder="${searchTransactionsText}" class="form-control search-input">
        <i class="fas fa-search search-icon"></i>
      </div>
      
      <div class="report-table-container">
        <table class="report-table" id="financial-table">
          <thead>
            <tr>
              <th onclick="sortTable('financial-table', 0)">${idText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('financial-table', 1)">${dateText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('financial-table', 2)">${descriptionText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('financial-table', 3)">${typeText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('financial-table', 4)">${sourceText} <i class="fas fa-sort"></i></th>
              <th onclick="sortTable('financial-table', 5)">${amountText} <i class="fas fa-sort"></i></th>
            </tr>
          </thead>
          <tbody>
  `;
  
  // Добавляем строки с транзакциями
  transactions.forEach(transaction => {
    const id = transaction.id || '-';
    const transactionDate = transaction.date || transaction.transaction_date || new Date().toISOString();
    const formattedTransactionDate = formatDate(transactionDate);
    const description = transaction.description || `Transaction #${id}`;
    
    // Получаем переведенные значения для типа и источника
    let typeText = transaction.type || 'income';
    let typeTranslated = getTranslatedText(typeText, typeText);
    
    let sourceText = transaction.source || '-';
    let sourceTranslated = getTranslatedText(sourceText, sourceText);
    
    const amount = transaction.amount || transaction.total || 0;
    const amountClass = transaction.type === 'expense' ? 'text-danger' : 'text-success';
    
    html += `
      <tr>
        <td>${id}</td>
        <td>${formattedTransactionDate}</td>
        <td>${description}</td>
        <td>${typeTranslated}</td>
        <td>${sourceTranslated}</td>
        <td class="${amountClass}">${formatCurrency(amount)}</td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
    </div>
    </div>
    
    <script>
      // Add search functionality
      document.getElementById('financial-table-search').addEventListener('keyup', function() {
        const searchTerm = this.value.toLowerCase();
        const table = document.getElementById('financial-table');
        const rows = table.getElementsByTagName('tr');
        
        for (let i = 1; i < rows.length; i++) {
          let found = false;
          const cells = rows[i].getElementsByTagName('td');
          
          for (let j = 0; j < cells.length; j++) {
            const cellText = cells[j].textContent.toLowerCase();
            if (cellText.indexOf(searchTerm) > -1) {
              found = true;
              break;
            }
          }
          
          if (found) {
            rows[i].style.display = '';
          } else {
            rows[i].style.display = 'none';
          }
        }
      });
    </script>
  `;
  
  reportContent.innerHTML = html;
  
  // Показываем предупреждения о недоступности API
  if (data.salesApiUnavailable) {
    showNotification('Sales API is unavailable. Sales data may be incomplete.', 'warning');
  }
  
  if (data.purchasesApiUnavailable) {
    showNotification('Purchases API is unavailable. Purchases data may be incomplete.', 'warning');
  }
}

// Helper functions to generate mock data for reports
function generateMockSalesData(dateRange) {
  // Generate mock sales data
  const salesData = {
    data: [],
    totalSales: 0
  };
  
  // Generate 10 sample sales
  for (let i = 1; i <= 10; i++) {
    const sale = {
      id: 'S-' + (1000 + i),
      sale_date: randomDate(dateRange),
      client_name: 'Клиент ' + i,
      total_amount: Math.floor(Math.random() * 10000) / 100,
      status: ['completed', 'pending', 'cancelled'][Math.floor(Math.random() * 3)]
    };
    
    salesData.data.push(sale);
    salesData.totalSales += sale.total_amount;
  }
  
  return salesData;
}

function generateMockInventoryData() {
  // Имитация названий товаров
  const productNames = [
    'Ноутбук HP ProBook', 'Смартфон Samsung Galaxy', 'Планшет Apple iPad', 
    'Монитор Dell UltraSharp', 'Принтер Canon PIXMA', 'Клавиатура Logitech', 
    'Мышь Microsoft', 'Наушники Sony', 'Внешний жесткий диск WD', 
    'USB-флеш-накопитель Kingston', 'Роутер TP-Link', 'Веб-камера Logitech',
    'Колонки JBL', 'Графический планшет Wacom', 'Сканер Epson'
  ];
  
  // Имитация категорий товаров
  const categories = [
    'Ноутбуки', 'Смартфоны', 'Планшеты', 'Мониторы', 'Принтеры', 
    'Периферия', 'Аудио', 'Хранение данных', 'Сетевое оборудование'
  ];
  
  const inventory = [];
  
  // Генерация случайных данных для 20 товаров
  for (let i = 1; i <= 20; i++) {
    const productName = productNames[Math.floor(Math.random() * productNames.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const stock = Math.floor(Math.random() * 100) + 1; // Текущий запас (1-100)
    const minStock = Math.floor(Math.random() * 20) + 5; // Минимальный запас (5-24)
    const price = parseFloat((Math.random() * 1000 + 50).toFixed(2)); // Цена (50-1050)
    
    inventory.push({
      id: i,
      name: productName + ' ' + i,
      product_name: productName + ' ' + i,
      category: category,
      current_stock: stock,
      stock: stock,
      quantity: stock,
      min_stock: minStock,
      min_stock_level: minStock,
      minStock: minStock,
      price: price,
      unit_price: price,
      unitPrice: price,
      value: stock * price
    });
  }
  
  return {
    data: inventory
  };
}

function generateMockClientsData() {
  // Generate mock client data
  const clientsData = {
    data: [],
    totalClients: 0,
    activeClients: 0
  };
  
  // Generate 8 sample clients
  for (let i = 1; i <= 8; i++) {
    const active = Math.random() > 0.3;
    const client = {
      id: 'C-' + (1000 + i),
      name: 'Клиент ' + i,
      email: 'client' + i + '@example.com',
      phone: '+7 (999) 123-45-' + (10 + i),
      total_purchases: active ? Math.floor(Math.random() * 50) : 0,
      last_purchase: active ? randomDate('thisMonth') : null,
      active: active
    };
    
    clientsData.data.push(client);
    clientsData.totalClients++;
    if (active) clientsData.activeClients++;
  }
  
  return clientsData;
}

function generateMockSuppliersData() {
  // Generate mock supplier data
  const suppliersData = {
    data: [],
    totalSuppliers: 0,
    activeSuppliers: 0
  };
  
  // Generate 6 sample suppliers
  for (let i = 1; i <= 6; i++) {
    const active = Math.random() > 0.2;
    const supplier = {
      id: 'S-' + (1000 + i),
      name: 'Поставщик ' + i,
      contact_person: 'Контакт ' + i,
      email: 'supplier' + i + '@example.com',
      phone: '+7 (999) 987-65-' + (10 + i),
      orders: active ? Math.floor(Math.random() * 30) : 0,
      last_order: active ? randomDate('thisMonth') : null,
      active: active
    };
    
    suppliersData.data.push(supplier);
    suppliersData.totalSuppliers++;
    if (active) suppliersData.activeSuppliers++;
  }
  
  return suppliersData;
}

function generateMockLowStockData() {
  return {
    data: [
      {
        id: 1,
        product_id: 1,
        product_name: 'Критический товар',
        name: 'Критический товар',
        category: 'Электроника',
        current_stock: 5,
        stock: 5,
        min_stock: 20,
        min_stock_level: 20,
        supplier_name: 'ООО "Электро"',
        supplier: 'ООО "Электро"',
        status: 'critical'
      },
      {
        id: 2,
        product_id: 2,
        product_name: 'Товар требующий пополнения',
        name: 'Товар требующий пополнения',
        category: 'Канцтовары',
        current_stock: 15,
        stock: 15,
        min_stock: 25,
        min_stock_level: 25,
        supplier_name: 'ООО "Канцелярия"',
        supplier: 'ООО "Канцелярия"',
        status: 'warning'
      },
      {
        id: 3,
        product_id: 3,
        product_name: 'Товар с низким запасом',
        name: 'Товар с низким запасом',
        category: 'Мебель',
        current_stock: 2,
        stock: 2,
        min_stock: 10,
        min_stock_level: 10,
        supplier_name: 'Не указан',
        supplier: 'Не указан',
        status: 'critical'
      },
      {
        id: 4,
        product_id: 4,
        product_name: 'Отсутствующий товар',
        name: 'Отсутствующий товар',
        category: 'Техника',
        current_stock: 0,
        stock: 0,
        min_stock: 5,
        min_stock_level: 5,
        supplier_name: 'ООО "ТехноПоставка"',
        supplier: 'ООО "ТехноПоставка"',
        status: 'outofstock'
      }
    ]
  };
}

function generateMockFinancialData(dateRange) {
  // Generate mock financial data
  const financialData = {
    data: [],
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0
  };
  
  // Generate 20 sample financial transactions
  for (let i = 1; i <= 20; i++) {
    const isIncome = Math.random() > 0.4;
    const amount = Math.floor(Math.random() * 20000) / 100;
    const transaction = {
      id: 'T-' + (1000 + i),
      date: randomDate(dateRange),
      description: isIncome ? 'Продажа #' + (3000 + i) : 'Закупка #' + (5000 + i),
      type: isIncome ? 'income' : 'expense',
      amount: amount,
      category: isIncome ? 'sale' : 'purchase',
      reference: isIncome ? 'S-' + (3000 + i) : 'P-' + (5000 + i)
    };
    
    financialData.data.push(transaction);
    if (isIncome) {
      financialData.totalIncome += amount;
    } else {
      financialData.totalExpenses += amount;
    }
  }
  
  financialData.netProfit = financialData.totalIncome + financialData.totalExpenses;
  return financialData;
}

// Helper function to generate random dates
function randomDate(range) {
  const end = new Date();
  let start = new Date();
  
  switch (range) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case 'thisWeek':
      start.setDate(end.getDate() - 7);
      break;
    case 'thisMonth':
      start.setMonth(end.getMonth() - 1);
      break;
    case 'thisQuarter':
      start.setMonth(end.getMonth() - 3);
      break;
    case 'thisYear':
      start.setFullYear(end.getFullYear() - 1);
      break;
    case 'custom':
      start.setMonth(end.getMonth() - 6); // Default to last 6 months
      break;
    default:
      start.setFullYear(end.getFullYear() - 1); // Default to last year
  }
  
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to format date
function formatDate(date) {
  if (!date) return '-';
  
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  if (isNaN(date)) return '-';
  
  return date.toLocaleDateString(window.erpLanguage.current() === 'ru' ? 'ru-RU' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Helper function to format currency
function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '-';
  
  const currency = 'USD';
  const options = {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };
  
  return new Intl.NumberFormat(window.erpLanguage.current() === 'ru' ? 'ru-RU' : 'en-US', options).format(amount);
}

// Применить переводы к элементам
function applyTranslations() {
  // Предотвращаем бесконечную рекурсию - НЕ вызываем erpLanguage.init()
  // Переводим элементы напрямую
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    let translation;
    
    // Пробуем получить перевод сначала из window.translations
    if (window.translations && 
        window.translations[window.currentLanguage] && 
        window.translations[window.currentLanguage][key]) {
      translation = window.translations[window.currentLanguage][key];
    }
    // Если не нашли, пробуем получить из языкового модуля
    else if (window.erpLanguage && typeof window.erpLanguage.translate === 'function') {
      translation = window.erpLanguage.translate(key);
    }
    
    if (translation) {
      console.log(`Перевод элемента ${key} -> ${translation}`);
      if (element.hasAttribute('data-i18n-placeholder')) {
        element.placeholder = translation;
      } else if (element.tagName === 'INPUT' && element.type === 'text') {
        if (element.placeholder) {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      } else if (element.tagName === 'OPTION') {
        element.textContent = translation;
        if (element.title) {
          element.title = translation;
        }
      } else if (element.tagName === 'SPAN' && element.parentNode.tagName === 'TITLE') {
        // Особый случай для элементов span в заголовке страницы
        document.title = translation;
      } else {
        element.textContent = translation;
      }
    }
  });
  
  // Если у нас есть переводы для выпадающих списков, обработаем их
  translateSelectElements();
}

// Обработчик события смены языка
document.addEventListener('languageChanged', function(event) {
  console.log('Получено событие смены языка в reports.js', event.detail);
  // Обновляем глобальную переменную текущего языка
  window.currentLanguage = event.detail.language;
  
  // Заново инициализируем переводы
  initializeTranslations();
  
  // Применяем переводы для элементов на странице
  applyTranslations();
  
  // Переводим карточки отчетов
  translateReportCards();
  
  // Обновляем текущие отчеты, если они открыты
  const reportResult = document.getElementById('report-result');
  if (reportResult && reportResult.style.display !== 'none') {
    const reportType = document.getElementById('report-filter-form')?.dataset.reportType;
    if (reportType) {
      console.log('Обновляем отчет после смены языка:', reportType);
      // Если есть последние загруженные данные, повторно рендерим отчет
      if (window.lastReportData) {
        renderReportData(window.lastReportData, reportType);
      } else {
        // Создаем новый запрос для обновления отчета с теми же параметрами
        const dateRange = document.getElementById('date-range')?.value || 'month';
        
        let startDate, endDate;
        if (dateRange === 'custom') {
          startDate = document.getElementById('start-date')?.value;
          endDate = document.getElementById('end-date')?.value;
        }
        
        // Обновляем отчет
        fetchReportData(reportType, dateRange, startDate, endDate);
      }
    }
  }
});

// Инициализируем язык при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  // Устанавливаем текущий язык из localStorage, если он доступен
  if (localStorage.getItem('erp_language')) {
    window.currentLanguage = localStorage.getItem('erp_language');
  } else if (localStorage.getItem('language')) {
    // Для совместимости с предыдущей версией
    window.currentLanguage = localStorage.getItem('language');
  } else {
    window.currentLanguage = 'en'; // Язык по умолчанию
  }
  
  console.log('Reports.js: Инициализация с языком', window.currentLanguage);
  
  // Инициализируем переводы
  initializeTranslations();
  
  // Применяем переводы
  applyTranslations();
  
  // Дополнительно переводим статические элементы
  translateReportCards();
  
  // Добавляем турецкий язык в селектор языков, если он существует
  const languageSelector = document.getElementById('language-selector');
  if (languageSelector && !languageSelector.querySelector('option[value="tr"]')) {
    const trOption = document.createElement('option');
    trOption.value = 'tr';
    trOption.textContent = 'Türkçe';
    languageSelector.appendChild(trOption);
    
    // Устанавливаем текущий язык в селекторе
    languageSelector.value = window.currentLanguage;
  }
});

// Функция для перевода карточек отчетов
function translateReportCards() {
  console.log('Переводим карточки отчетов на язык:', window.currentLanguage || 'en');
  
  // Получаем все заголовки отчетов и их описания
  const reportHeaders = document.querySelectorAll('.report-info h4[data-i18n]');
  const reportDescriptions = document.querySelectorAll('.report-info p[data-i18n]');
  
  // Переводим заголовки
  reportHeaders.forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (window.translations && 
        window.translations[window.currentLanguage] && 
        window.translations[window.currentLanguage][key]) {
      element.textContent = window.translations[window.currentLanguage][key];
      console.log(`Перевод заголовка: ${key} -> ${element.textContent}`);
    }
  });
  
  // Переводим описания
  reportDescriptions.forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (window.translations && 
        window.translations[window.currentLanguage] && 
        window.translations[window.currentLanguage][key]) {
      element.textContent = window.translations[window.currentLanguage][key];
      console.log(`Перевод описания: ${key} -> ${element.textContent}`);
    }
  });
  
  // Переводим общие заголовки
  const availableReportsHeader = document.querySelector('.widget-header h3[data-i18n="availableReports"]');
  if (availableReportsHeader && 
      window.translations && 
      window.translations[window.currentLanguage] && 
      window.translations[window.currentLanguage]['availableReports']) {
    availableReportsHeader.textContent = window.translations[window.currentLanguage]['availableReports'];
    console.log(`Перевод заголовка виджета: availableReports -> ${availableReportsHeader.textContent}`);
  }
}

// Функция для перевода выпадающих списков
function translateSelectElements() {
  // Обрабатываем обычные выпадающие списки с data-i18n атрибутами в опциях
  const selectsWithOptions = document.querySelectorAll('select');
  selectsWithOptions.forEach(select => {
    const options = select.querySelectorAll('option[data-i18n]');
    options.forEach(option => {
      const key = option.getAttribute('data-i18n');
      let translation;
      
      // Пробуем получить перевод сначала из window.translations
      if (window.translations && 
          window.translations[window.currentLanguage] && 
          window.translations[window.currentLanguage][key]) {
        translation = window.translations[window.currentLanguage][key];
      }
      // Если не нашли, пробуем получить из языкового модуля
      else if (window.erpLanguage && typeof window.erpLanguage.translate === 'function') {
        translation = window.erpLanguage.translate(key);
      }
      
      if (translation) {
        console.log(`Перевод опции: ${key} -> ${translation}`);
        option.textContent = translation;
      }
    });
  });
  
  // Обрабатываем выпадающие списки с атрибутом data-i18n-options
  const selectsWithGroupOptions = document.querySelectorAll('select[data-i18n-options]');
  selectsWithGroupOptions.forEach(select => {
    if (!select || !select.options) return;
    
    // Сохранить текущее выбранное значение
    const selectedValue = select.value;
    
    // Получить ключ группы переводов
    const translationGroup = select.getAttribute('data-i18n-options');
    if (!translationGroup) return;
    
    // Проверяем доступность переводов для этой группы
    const translationsObj = window.translations && window.translations[window.currentLanguage] && 
                           window.translations[window.currentLanguage][translationGroup];
    
    if (translationsObj) {
      // Перевести каждую опцию
      Array.from(select.options).forEach(option => {
        const key = option.value;
        if (translationsObj[key]) {
          console.log(`Перевод опции из группы: ${translationGroup}.${key} -> ${translationsObj[key]}`);
          option.textContent = translationsObj[key];
        }
      });
      
      // Восстановить выбранное значение
      select.value = selectedValue;
    }
  });
}

// Обработчик события смены языка для повторного рендеринга отчета
document.addEventListener('languageChanged', function(e) {
  console.log('Получено событие изменения языка в reports.js:', e.detail);
  
  // Обновляем текущий язык
  const newLanguage = e.detail?.language || document.getElementById('language-selector')?.value || 'en';
  console.log('Устанавливаем новый язык:', newLanguage);
  window.currentLanguage = newLanguage;
  
  // Сохраняем язык в localStorage
  localStorage.setItem('erp_language', newLanguage);
  localStorage.setItem('language', newLanguage);
  
  // Если какой-либо отчет уже отображается, перерисовываем его с новым языком
  const reportContent = document.getElementById('report-content');
  const filterForm = document.getElementById('report-filter-form');
  
  if (reportContent && filterForm) {
    const reportType = filterForm.dataset.reportType;
    if (window.lastReportData) {
      console.log(`Перерисовываем отчет ${reportType} с новым языком: ${newLanguage}`);
      renderReportData(window.lastReportData, reportType);
    }
  }
  
  // Обновляем переводы на странице
  initializeTranslations();
  applyTranslations();
  translateReportCards();
  translateSelectElements();
});

// При загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  // Инициализация датапикеров
  $('.date-picker').datepicker({
    format: 'yyyy-mm-dd',
    autoclose: true
  });
  
  // Устанавливаем текущий язык в селекторе, если он существует
  const languageSelector = document.getElementById('language-selector');
  if (languageSelector) {
    languageSelector.value = window.currentLanguage;
  }
  
  // Добавляем турецкий язык в селектор языков, если он существует
  if (languageSelector && !languageSelector.querySelector('option[value="tr"]')) {
    const trOption = document.createElement('option');
    trOption.value = 'tr';
    trOption.textContent = 'Türkçe';
    languageSelector.appendChild(trOption);
  }
  
  // Дополнительно переводим статические элементы
  translateReportCards();
});