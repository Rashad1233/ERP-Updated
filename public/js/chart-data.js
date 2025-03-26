/**
 * Файл с имитацией API для графиков на странице инвентаря
 * Используется для предоставления данных для графиков без настоящего API
 */

// Имитация API для получения данных стоимости инвентаря по категориям
async function fetchInventoryValueByCategory() {
    // В реальном API здесь был бы запрос к серверу
    // fetch('/api/inventory/statistics/value-by-category')
    
    // Вместо этого возвращаем статические данные
    const mockData = [
        { category_id: 1, category_name: 'Сырье', total_value: 50000 },
        { category_id: 2, category_name: 'Готовая продукция', total_value: 75000 },
        { category_id: 3, category_name: 'Упаковка', total_value: 12000 },
        { category_id: 4, category_name: 'Запчасти', total_value: 18000 },
        { category_id: 5, category_name: 'Химикаты', total_value: 8500 }
    ];
    
    // Симулируем задержку сети для реалистичности
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockData;
}

// Имитация API для получения данных оборачиваемости запасов
async function fetchTurnoverRate() {
    // В реальном API здесь был бы запрос к серверу
    // fetch('/api/inventory/statistics/turnover-rate')
    
    // Получаем последние 6 месяцев для меток
    const months = [];
    const data = [];
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleString('ru-RU', { month: 'short' });
        months.push(monthName);
        
        // Генерируем реалистичные случайные данные
        // Колебания оборачиваемости с общим ростом
        const baseRate = 2.5; // Базовый уровень оборачиваемости
        const trend = (5 - i) * 0.2; // Общий тренд роста
        const seasonality = Math.sin(i * Math.PI / 3) * 0.3; // Сезонность
        const random = (Math.random() - 0.5) * 0.4; // Случайные колебания
        
        const rate = baseRate + trend + seasonality + random;
        data.push(rate.toFixed(1));
    }
    
    // Симулируем задержку сети для реалистичности
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
        labels: months,
        data: data
    };
}

// Функция для инициализации графиков
async function initCharts() {
    try {
        // Загружаем данные для графика стоимости инвентаря по категориям
        const categoryData = await fetchInventoryValueByCategory();
        
        // Подготавливаем данные для графика
        const labels = categoryData.map(item => item.category_name);
        const values = categoryData.map(item => item.total_value);
        const backgroundColors = [
            'rgba(54, 162, 235, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(201, 203, 207, 0.7)'
        ];
        const borderColors = backgroundColors.map(color => color.replace('0.7', '1'));
        
        // Создаем график категорий
        const categoryValueCtx = document.getElementById('categoryValueChart').getContext('2d');
        new Chart(categoryValueCtx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: backgroundColors.slice(0, labels.length),
                    borderColor: borderColors.slice(0, labels.length),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: 'right'
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            const value = data.datasets[0].data[tooltipItem.index];
                            return data.labels[tooltipItem.index] + ': ' + value.toLocaleString() + ' руб.';
                        }
                    }
                }
            }
        });
        
        // Загружаем данные для графика оборачиваемости запасов
        const turnoverData = await fetchTurnoverRate();
        
        // Создаем график оборачиваемости
        const turnoverRateCtx = document.getElementById('turnoverRateChart').getContext('2d');
        new Chart(turnoverRateCtx, {
            type: 'line',
            data: {
                labels: turnoverData.labels,
                datasets: [{
                    label: 'Коэффициент оборачиваемости',
                    data: turnoverData.data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return 'Оборачиваемость: ' + tooltipItem.yLabel + ' раз/период';
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Ошибка при инициализации графиков:', error);
    }
} 