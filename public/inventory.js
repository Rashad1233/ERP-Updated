// Загрузка транзакций с сервера
function loadTransactions(filters = {}) {
    showLoading();
    
    // Формируем параметры запроса
    const queryParams = new URLSearchParams();
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
    if (filters.search) queryParams.append('search', filters.search);
    
    const url = `/api/inventory${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Failed to load transactions');
            return response.json();
        })
        .then(data => {
            displayTransactions(data.transactions || []);
            hideLoading();
        })
        .catch(error => {
            console.error('Error loading transactions:', error);
            showNotification(window.erpTranslations.errorLoadingTransactions || 'Error loading transactions. Please try again.', 'error');
            displayTransactions([]);
            hideLoading();
        });
}

// Отображение транзакций в таблице
function displayTransactions(transactions) {
    // Обновляем селектор для нового ID таблицы
    const tableBody = document.querySelector('#inventoryTable tbody');
    
    if (!tableBody) {
        console.error('Transaction table body element not found');
        return;
    }
    
    if (transactions.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9" class="text-center">${window.erpTranslations.noTransactionsFound || 'No transactions found.'}</td></tr>`;
        return;
    }
    
    tableBody.innerHTML = '';
    
    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${transaction.id}</td>
            <td class="mobile-hide">${formatDate(transaction.date)}</td>
            <td>${transaction.type}</td>
            <td>${transaction.product_name}</td>
            <td>${transaction.quantity}</td>
            <td class="mobile-hide">${formatCurrency(transaction.unit_price)}</td>
            <td>${formatCurrency(transaction.total_amount)}</td>
            <td class="mobile-hide">${transaction.notes || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${transaction.id}"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Добавляем обработчики для кнопок удаления
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const transactionId = this.getAttribute('data-id');
            confirmDeleteTransaction(transactionId);
        });
    });
    
    // Добавляем вызов makeTablesResponsive для новой таблицы
    if (typeof makeTablesResponsive === 'function') {
        setTimeout(makeTablesResponsive, 0);
    }
} 