document.addEventListener('DOMContentLoaded', function() {
    // Load dashboard data
    loadDashboardData();
    
    // Load low stock items
    loadLowStockItems();
    
    // Load recent transactions
    loadRecentTransactions();
});

// Function to load dashboard data
function loadDashboardData() {
    console.log('Loading dashboard data...');
    fetch('/api/dashboard')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load dashboard data');
            }
            return response.json();
        })
        .then(data => {
            console.log('Dashboard data received:', data);
            
            // Update dashboard cards
            if (data && data.dashboard) {
                // Находим элементы и обновляем их значения
                const totalProductsEl = document.getElementById('totalProducts');
                const lowStockItemsEl = document.getElementById('lowStockItems');
                const activeSuppliers = document.getElementById('activeSuppliers');
                const recentSales = document.getElementById('recentSales');
                
                if (totalProductsEl) totalProductsEl.textContent = data.dashboard.totalProducts || '0';
                if (lowStockItemsEl) lowStockItemsEl.textContent = data.dashboard.lowStockItems || '0';
                if (activeSuppliers) activeSuppliers.textContent = data.dashboard.activeSuppliers || '0';
                if (recentSales) recentSales.textContent = data.dashboard.recentSales || '0';
            } else {
                console.error('Invalid dashboard data format:', data);
                // Если данные отсутствуют, устанавливаем 0 вместо "Loading..."
                const elements = ['totalProducts', 'lowStockItems', 'activeSuppliers', 'recentSales'];
                elements.forEach(id => {
                    const element = document.getElementById(id);
                    if (element) element.textContent = '0';
                });
            }
        })
        .catch(error => {
            console.error('Error loading dashboard data:', error);
            // При ошибке также устанавливаем 0 вместо "Loading..."
            const elements = ['totalProducts', 'lowStockItems', 'activeSuppliers', 'recentSales'];
            elements.forEach(id => {
                const element = document.getElementById(id);
                if (element) element.textContent = '0';
            });
        });
}

// Function to load low stock items
function loadLowStockItems() {
    console.log('Loading low stock items...');
    
    // Получаем текущий язык
    const currentLanguage = window.currentLanguage || localStorage.getItem('erp_language') || 'en';
    
    // Получаем переводы для сообщений и элементов таблицы
    const loadingText = currentLanguage === 'ru' ? 'Загрузка данных о товарах с низким запасом...' :
                      currentLanguage === 'az' ? 'Az ehtiyatı olan məhsullar yüklənir...' :
                      'Loading low stock items...';
    
    const noDataText = currentLanguage === 'ru' ? 'Нет товаров с низким запасом' :
                     currentLanguage === 'az' ? 'Az ehtiyatı olan məhsul yoxdur' :
                     'No low stock items';
    
    const errorText = currentLanguage === 'ru' ? 'Ошибка загрузки данных о товарах' :
                    currentLanguage === 'az' ? 'Məhsul məlumatlarını yükləmək mümkün olmadı' :
                    'Error loading low stock items';
                    
    const unknownProductText = currentLanguage === 'ru' ? 'Неизвестный товар' :
                             currentLanguage === 'az' ? 'Naməlum məhsul' :
                             'Unknown Product';
                             
    const naText = currentLanguage === 'ru' ? 'Н/Д' :
                 currentLanguage === 'az' ? 'M/D' :
                 'N/A';
                 
    const orderButtonText = currentLanguage === 'ru' ? 'Заказать' :
                          currentLanguage === 'az' ? 'Sifariş et' :
                          'Order';
    
    // Переводы для заголовков столбцов
    const productNameText = currentLanguage === 'ru' ? 'Название товара' :
                          currentLanguage === 'az' ? 'Məhsulun adı' :
                          'Product Name';
                          
    const currentStockText = currentLanguage === 'ru' ? 'Текущий запас' :
                           currentLanguage === 'az' ? 'Cari ehtiyat' :
                           'Current Stock';
                           
    const minStockText = currentLanguage === 'ru' ? 'Мин. запас' :
                       currentLanguage === 'az' ? 'Min. ehtiyat' :
                       'Min Stock';
                       
    const supplierText = currentLanguage === 'ru' ? 'Поставщик' :
                        currentLanguage === 'az' ? 'Təchizatçı' :
                        'Supplier';
                        
    const priceText = currentLanguage === 'ru' ? 'Цена' :
                     currentLanguage === 'az' ? 'Qiymət' :
                     'Price';
                     
    const actionsText = currentLanguage === 'ru' ? 'Действия' :
                       currentLanguage === 'az' ? 'Əməliyyatlar' :
                       'Actions';
    
    // Находим таблицу и обновляем заголовки
    const lowStockTable = document.getElementById('lowStockTable');
    if (lowStockTable) {
        lowStockTable.innerHTML = `<tr><td colspan="6" class="text-center">${loadingText}</td></tr>`;
    }
    
    // Обновляем заголовки таблицы
    const tableHeaders = lowStockTable.closest('table').querySelectorAll('thead th');
    if (tableHeaders && tableHeaders.length === 6) {
        tableHeaders[0].textContent = productNameText;
        tableHeaders[1].textContent = currentStockText;
        tableHeaders[2].textContent = minStockText;
        tableHeaders[3].textContent = supplierText;
        tableHeaders[4].textContent = priceText;
        tableHeaders[5].textContent = actionsText;
    }
    
    fetch('/api/low-stock-products')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load low stock items');
            }
            return response.json();
        })
        .then(data => {
            console.log('Low stock data received:', data);
            
            const lowStockTable = document.getElementById('lowStockTable');
            if (!lowStockTable) {
                console.error('Low stock table element not found');
                return;
            }
            
            lowStockTable.innerHTML = '';
            
            if (!data || !data.products || data.products.length === 0) {
                lowStockTable.innerHTML = `<tr><td colspan="6" class="text-center">${noDataText}</td></tr>`;
                // Обновляем счетчик на дашборде
                const lowStockItemsEl = document.getElementById('lowStockItems');
                if (lowStockItemsEl) lowStockItemsEl.textContent = '0';
                return;
            }
            
            // Обновляем счетчик на дашборде
            const lowStockItemsEl = document.getElementById('lowStockItems');
            if (lowStockItemsEl) lowStockItemsEl.textContent = data.products.length.toString();
            
            data.products.forEach(product => {
                const row = document.createElement('tr');
                
                // Add warning class if stock is very low
                if (product.current_stock === 0) {
                    row.classList.add('stock-critical');
                } else if (product.current_stock < product.min_stock_level) {
                    row.classList.add('stock-warning');
                }
                
                // Форматирование валюты в зависимости от языка
                let formattedPrice;
                if (product.price) {
                    formattedPrice = formatCurrency(product.price);
                } else {
                    formattedPrice = naText;
                }
                
                row.innerHTML = `
                    <td>${product.name || unknownProductText}</td>
                    <td>${product.current_stock !== undefined ? product.current_stock : naText}</td>
                    <td>${product.min_stock_level !== undefined ? product.min_stock_level : naText}</td>
                    <td>${product.supplier_name || naText}</td>
                    <td>${formattedPrice}</td>
                    <td><button class="btn primary-btn btn-sm order-btn" data-product-id="${product.id}">${orderButtonText}</button></td>
                `;
                
                lowStockTable.appendChild(row);
            });
            
            // Add event listeners to order buttons
            document.querySelectorAll('.order-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.getAttribute('data-product-id');
                    window.location.href = `purchase-orders.html?product=${productId}`;
                });
            });
        })
        .catch(error => {
            console.error('Error loading low stock items:', error);
            
            // Обновляем счетчик на дашборде при ошибке
            const lowStockItemsEl = document.getElementById('lowStockItems');
            if (lowStockItemsEl) lowStockItemsEl.textContent = '0';
            
            const lowStockTable = document.getElementById('lowStockTable');
            if (lowStockTable) {
                lowStockTable.innerHTML = `<tr><td colspan="6" class="text-center">${errorText}</td></tr>`;
            }
        });
}

// Function to load low stock alerts
function loadLowStockAlerts() {
    console.log('Loading low stock alerts...');
    
    // Получаем текущий язык
    const currentLanguage = window.currentLanguage || localStorage.getItem('erp_language') || 'en';
    
    // Получаем переводы для сообщений и элементов таблицы
    const loadingText = currentLanguage === 'ru' ? 'Загрузка предупреждений о низком запасе...' :
                      currentLanguage === 'az' ? 'Az ehtiyat xəbərdarlıqları yüklənir...' :
                      'Loading low stock alerts...';
    
    const noDataText = currentLanguage === 'ru' ? 'Нет предупреждений о низком запасе' :
                     currentLanguage === 'az' ? 'Az ehtiyat xəbərdarlıqları yoxdur' :
                     'No low stock alerts';
    
    const errorText = currentLanguage === 'ru' ? 'Ошибка загрузки предупреждений' :
                    currentLanguage === 'az' ? 'Xəbərdarlıqları yükləmək mümkün olmadı' :
                    'Error loading low stock alerts';
                    
    const unknownProductText = currentLanguage === 'ru' ? 'Неизвестный товар' :
                             currentLanguage === 'az' ? 'Naməlum məhsul' :
                             'Unknown Product';
                             
    const naText = currentLanguage === 'ru' ? 'Н/Д' :
                 currentLanguage === 'az' ? 'M/D' :
                 'N/A';
                 
    const orderButtonText = currentLanguage === 'ru' ? 'Заказать' :
                          currentLanguage === 'az' ? 'Sifariş et' :
                          'Order';
    
    // Переводы для заголовков столбцов
    const productNameText = currentLanguage === 'ru' ? 'Название товара' :
                          currentLanguage === 'az' ? 'Məhsulun adı' :
                          'Product Name';
                          
    const currentStockText = currentLanguage === 'ru' ? 'Текущий запас' :
                           currentLanguage === 'az' ? 'Cari ehtiyat' :
                           'Current Stock';
                           
    const minStockText = currentLanguage === 'ru' ? 'Мин. запас' :
                       currentLanguage === 'az' ? 'Min. ehtiyat' :
                       'Min Stock';
                       
    const supplierText = currentLanguage === 'ru' ? 'Поставщик' :
                        currentLanguage === 'az' ? 'Təchizatçı' :
                        'Supplier';
                        
    const priceText = currentLanguage === 'ru' ? 'Цена' :
                     currentLanguage === 'az' ? 'Qiymət' :
                     'Price';
                     
    const actionsText = currentLanguage === 'ru' ? 'Действия' :
                       currentLanguage === 'az' ? 'Əməliyyatlar' :
                       'Actions';
    
    // Находим таблицу и обновляем заголовки
    const lowStockTable = document.getElementById('lowStockTable');
    if (lowStockTable) {
        lowStockTable.innerHTML = `<tr><td colspan="6" class="text-center">${loadingText}</td></tr>`;
    }
    
    // Обновляем заголовки таблицы
    const tableHeaders = lowStockTable.closest('table').querySelectorAll('thead th');
    if (tableHeaders && tableHeaders.length === 6) {
        tableHeaders[0].textContent = productNameText;
        tableHeaders[1].textContent = currentStockText;
        tableHeaders[2].textContent = minStockText;
        tableHeaders[3].textContent = supplierText;
        tableHeaders[4].textContent = priceText;
        tableHeaders[5].textContent = actionsText;
    }
    
    fetch('/api/low-stock-alerts')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load low stock alerts');
            }
            return response.json();
        })
        .then(data => {
            console.log('Low stock alerts received:', data);
            
            const lowStockTable = document.getElementById('lowStockTable');
            if (!lowStockTable) {
                console.error('Low stock table element not found');
                return;
            }
            
            lowStockTable.innerHTML = '';
            
            if (!data || !data.alerts || data.alerts.length === 0) {
                lowStockTable.innerHTML = `<tr><td colspan="6" class="text-center">${noDataText}</td></tr>`;
                return;
            }
            
            data.alerts.forEach(alert => {
                const row = document.createElement('tr');
                
                // Add warning class if stock is very low
                if (alert.current_stock === 0) {
                    row.classList.add('stock-critical');
                } else if (alert.current_stock < alert.min_stock_level) {
                    row.classList.add('stock-warning');
                }
                
                // Форматирование валюты в зависимости от языка
                let formattedPrice;
                if (alert.best_price) {
                    formattedPrice = formatCurrency(alert.best_price);
                } else if (alert.price) {
                    formattedPrice = formatCurrency(alert.price);
                } else {
                    formattedPrice = naText;
                }
                
                row.innerHTML = `
                    <td>${alert.name || unknownProductText}</td>
                    <td>${alert.current_stock !== undefined ? alert.current_stock : naText}</td>
                    <td>${alert.min_stock_level !== undefined ? alert.min_stock_level : naText}</td>
                    <td>${alert.supplier_name || naText}</td>
                    <td>${formattedPrice}</td>
                    <td><button class="btn primary-btn btn-sm order-btn" data-product-id="${alert.id}">${orderButtonText}</button></td>
                `;
                
                lowStockTable.appendChild(row);
            });
            
            // Add event listeners to order buttons
            document.querySelectorAll('.order-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.getAttribute('data-product-id');
                    window.location.href = `purchase-orders.html?product=${productId}`;
                });
            });
        })
        .catch(error => {
            console.error('Error loading low stock alerts:', error);
            
            const lowStockTable = document.getElementById('lowStockTable');
            if (lowStockTable) {
                lowStockTable.innerHTML = `<tr><td colspan="6" class="text-center">${errorText}</td></tr>`;
            }
        });
}

// Function to load recent transactions
function loadRecentTransactions() {
    console.log('Loading recent transactions...');
    
    // Получаем функцию перевода
    const getTranslation = (key, defaultText) => {
        if (typeof window.erpLanguage !== 'undefined' && window.erpLanguage.translate) {
            return window.erpLanguage.translate(key);
        }
        
        // Получаем текущий язык
        const currentLanguage = window.currentLanguage || localStorage.getItem('erp_language') || 'en';
        
        // Переводы для ключевых сообщений
        switch (key) {
            case 'loadingSales':
                return currentLanguage === 'ru' ? 'Загрузка данных о продажах...' :
                    currentLanguage === 'az' ? 'Satış məlumatları yüklənir...' :
                    'Loading sales data...';
            case 'noSalesData':
                return currentLanguage === 'ru' ? 'Данные о продажах не найдены' :
                    currentLanguage === 'az' ? 'Satış məlumatları tapılmadı' :
                    'No sales data found';
            case 'errorLoadingSales':
                return currentLanguage === 'ru' ? 'Ошибка загрузки данных о продажах' :
                    currentLanguage === 'az' ? 'Satış məlumatlarını yükləmək mümkün olmadı' :
                    'Error loading sales data';
            case 'saleID':
                return currentLanguage === 'ru' ? 'ID продажи' :
                    currentLanguage === 'az' ? 'Satış ID' :
                    'Sale ID';
            case 'client':
                return currentLanguage === 'ru' ? 'Клиент' :
                    currentLanguage === 'az' ? 'Müştəri' :
                    'Client';
            case 'date':
                return currentLanguage === 'ru' ? 'Дата' :
                    currentLanguage === 'az' ? 'Tarix' :
                    'Date';
            case 'amount':
                return currentLanguage === 'ru' ? 'Сумма' :
                    currentLanguage === 'az' ? 'Məbləğ' :
                    'Amount';
            case 'status':
                return currentLanguage === 'ru' ? 'Статус' :
                    currentLanguage === 'az' ? 'Status' :
                    'Status';
            case 'completed':
                return currentLanguage === 'ru' ? 'Завершено' :
                    currentLanguage === 'az' ? 'Tamamlandı' :
                    'Completed';
            default:
                return defaultText || key;
        }
    };
    
    // Получаем переводы для сообщений
    const loadingText = getTranslation('loadingSales', 'Loading sales data...');
    const noDataText = getTranslation('noSalesData', 'No sales data found');
    const errorText = getTranslation('errorLoadingSales', 'Error loading sales data');
    
    // Переводы для заголовков столбцов
    const saleIdText = getTranslation('saleID', 'Sale ID');
    const clientText = getTranslation('client', 'Client');
    const dateText = getTranslation('date', 'Date');
    const amountText = getTranslation('amount', 'Amount');
    const statusText = getTranslation('status', 'Status');
    
    // Находим таблицу и обновляем контент для показа загрузки
    const recentSalesTable = document.getElementById('recentSalesTable');
    if (recentSalesTable) {
        recentSalesTable.innerHTML = `<tr><td colspan="5" class="text-center">${loadingText}</td></tr>`;
    }
    
    // Обновляем заголовки таблицы
    const tableHeaders = recentSalesTable.closest('table').querySelectorAll('thead th');
    if (tableHeaders && tableHeaders.length === 5) {
        tableHeaders[0].textContent = saleIdText;
        tableHeaders[1].textContent = clientText;
        tableHeaders[2].textContent = dateText;
        tableHeaders[3].textContent = amountText;
        tableHeaders[4].textContent = statusText;
    }
    
    // First, load clients
    fetch('/api/clients')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load clients');
            }
            return response.json();
        })
        .then(clientsData => {
            console.log('Clients data received:', clientsData);
            
            // Now load transactions
            return fetch('/api/transactions')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load transactions');
                    }
                    return response.json().then(data => {
                        return { transactions: data.transactions, clients: clientsData.clients || [] };
                    });
                });
        })
        .then(data => {
            console.log('Transactions data received:', data);
            
            // Фильтруем только продажи (Sales)
            const salesTransactions = data.transactions ? 
                data.transactions.filter(t => t.transaction_type === 'Sale') : [];
            
            // Update the Recent Sales card with the count
            const recentSalesElement = document.getElementById('recentSales');
            if (recentSalesElement) {
                recentSalesElement.textContent = salesTransactions.length;
            }
            
            // Update the Recent Sales table
            const recentSalesTable = document.getElementById('recentSalesTable');
            if (!recentSalesTable) {
                console.error('recentSalesTable element not found');
                return;
            }
            
            recentSalesTable.innerHTML = '';
            
            if (!salesTransactions || salesTransactions.length === 0) {
                // Используем перевод для сообщения о пустом списке транзакций
                recentSalesTable.innerHTML = `<tr><td colspan="5" class="text-center">${noDataText}</td></tr>`;
                return;
            }
            
            // Only show the 5 most recent sales transactions
            const recentSales = salesTransactions.slice(0, 5);
            
            // Получаем перевод для статуса
            const statusTranslation = getTranslation('completed', 'Completed');
            
            recentSales.forEach((transaction, index) => {
                const row = document.createElement('tr');
                
                // Format date based on language
                const date = new Date(transaction.transaction_date);
                
                // Получаем текущий язык
                const currentLanguage = window.currentLanguage || localStorage.getItem('erp_language') || 'en';
                
                // Форматируем дату в соответствии с выбранным языком
                let formattedDate;
                if (currentLanguage === 'ru') {
                    formattedDate = date.toLocaleDateString('ru-RU') + ' ' + 
                                   date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
                } else if (currentLanguage === 'az') {
                    formattedDate = date.toLocaleDateString('az-AZ') + ' ' + 
                                   date.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' });
                } else {
                    formattedDate = date.toLocaleDateString('en-US') + ' ' + 
                                   date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                }
                
                // Используем реальный ID транзакции, если доступен, иначе генерируем
                const saleId = transaction.id ? ('S' + transaction.id) : ('S' + (10000 + index).toString());
                
                // Используем реальное имя клиента, если доступно
                let clientName = getTranslation('client', 'Client');
                
                // Если в транзакции есть ID клиента, ищем его в списке клиентов
                if (transaction.client_id && data.clients && data.clients.length > 0) {
                    const client = data.clients.find(c => c.id === transaction.client_id);
                    if (client && client.name) {
                        clientName = client.name;
                    }
                }
                
                // Используем реальную сумму транзакции, если доступна
                let amount = 0;
                if (transaction.total_amount) {
                    amount = transaction.total_amount;
                } else if (transaction.unit_price && transaction.quantity) {
                    amount = transaction.unit_price * Math.abs(transaction.quantity);
                } else {
                    // Если нет данных о сумме, используем количество как основу
                    amount = Math.abs(transaction.quantity) * 15.99; // Средняя цена 15.99 долларов, как на странице sales
                }
                
                // Форматирование валюты всегда в долларах
                const formattedAmount = formatCurrency(amount);
                
                // Определяем статус (по умолчанию "Завершено")
                let status = transaction.status || 'completed';
                let statusClass = 'status-' + status.toLowerCase();
                let statusText = getTranslation(status.toLowerCase(), statusTranslation);
                
                row.innerHTML = `
                    <td>${saleId}</td>
                    <td>${clientName}</td>
                    <td>${formattedDate}</td>
                    <td>${formattedAmount}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                `;
                
                recentSalesTable.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error loading transactions:', error);
            
            // Update the Recent Sales card with an error message
            const recentSalesElement = document.getElementById('recentSales');
            if (recentSalesElement) {
                recentSalesElement.textContent = '0';
            }
            
            // Update the Recent Sales table with an error message
            const recentSalesTable = document.getElementById('recentSalesTable');
            if (recentSalesTable) {
                recentSalesTable.innerHTML = `<tr><td colspan="5" class="text-center">${errorText}</td></tr>`;
            }
        });
}

// Обработчик события смены языка для обновления данных на дашборде
document.addEventListener('languageChanged', function(event) {
    // Обновляем данные на дашборде при смене языка
    loadDashboardData();
    loadLowStockItems();
    loadRecentTransactions();
    
    console.log('Dashboard translations updated for language:', event.detail.language);
});

// Функция форматирования валюты - всегда в долларах
function formatCurrency(amount) {
    // Если доступна функция из модуля языка, используем её
    if (typeof window.erpLanguage !== 'undefined' && window.erpLanguage.formatCurrency) {
        return window.erpLanguage.formatCurrency(amount);
    }
    
    // Запасной вариант - всегда доллары
    return `$${amount.toFixed(2)}`;
}
