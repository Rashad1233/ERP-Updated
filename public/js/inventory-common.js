/**
 * Inventory Common - Общие функции для страниц инвентаря
 * Включает обработчики меню, навигации и других интерактивных элементов
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация навигации и выпадающих меню
    initSidebarMenus();
    initInventoryDropdowns();
    
    // Обработчик для переключения сайдбара
    const toggleSidebar = document.querySelector('.toggle-sidebar');
    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.toggle('collapsed');
                
                // Также расширяем основной контент
                const mainContent = document.querySelector('.main-content');
                if (mainContent) {
                    mainContent.classList.toggle('expanded');
                }
            }
        });
    }
});

/**
 * Инициализирует боковое меню и подменю
 * Исправляет проблему с неработающими выпадающими меню
 */
function initSidebarMenus() {
    // Находим все элементы с подменю
    const subMenus = document.querySelectorAll('.has-submenu');
    
    // Для каждого элемента с подменю добавляем обработчик события
    subMenus.forEach(submenuItem => {
        const submenuToggle = submenuItem.querySelector('.submenu-toggle');
        
        if (submenuToggle) {
            submenuToggle.addEventListener('click', function(e) {
                // Предотвращаем переход по ссылке
                e.preventDefault();
                
                // Переключаем класс active для текущего элемента
                submenuItem.classList.toggle('active');
                
                // Закрываем все остальные активные подменю, если они не являются родителями текущего
                const otherSubmenus = document.querySelectorAll('.has-submenu.active');
                otherSubmenus.forEach(other => {
                    // Проверяем, не является ли other родителем или текущим элементом
                    if (other !== submenuItem && !submenuItem.contains(other) && !other.contains(submenuItem)) {
                        other.classList.remove('active');
                    }
                });
            });
        }
    });
    
    // Также добавляем поддержку для наведения мыши при свернутом сайдбаре
    if (window.innerWidth > 768) { // Только для десктопов
        subMenus.forEach(submenuItem => {
            submenuItem.addEventListener('mouseenter', function() {
                if (document.querySelector('.sidebar').classList.contains('collapsed')) {
                    // При наведении на элемент, показываем подменю
                    const submenu = this.querySelector('.submenu');
                    if (submenu) {
                        submenu.style.opacity = '1';
                        submenu.style.visibility = 'visible';
                    }
                }
            });
            
            submenuItem.addEventListener('mouseleave', function() {
                if (document.querySelector('.sidebar').classList.contains('collapsed')) {
                    // При уходе мыши скрываем подменю
                    const submenu = this.querySelector('.submenu');
                    if (submenu && !this.classList.contains('active')) {
                        submenu.style.opacity = '0';
                        submenu.style.visibility = 'hidden';
                    }
                }
            });
        });
    }
}

/**
 * Инициализирует выпадающие меню в горизонтальной навигации инвентаря
 */
function initInventoryDropdowns() {
    // Находим все ссылки с выпадающими меню
    const dropdownLinks = document.querySelectorAll('.inventory-menu > li > a');
    
    dropdownLinks.forEach(link => {
        // Проверяем, имеет ли ссылка подменю
        if (link.nextElementSibling && link.nextElementSibling.classList.contains('dropdown-menu')) {
            // Добавляем обработчик события клика
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Получаем родительский элемент li
                const parentLi = this.parentElement;
                
                // Если этот элемент уже активен, просто закрываем подменю
                if (parentLi.classList.contains('active')) {
                    parentLi.classList.remove('active');
                    this.nextElementSibling.classList.remove('show');
                } else {
                    // Закрываем все другие открытые подменю
                    const allDropdowns = document.querySelectorAll('.inventory-menu > li');
                    allDropdowns.forEach(dropdown => {
                        if (dropdown !== parentLi) {
                            dropdown.classList.remove('active');
                            const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                            if (dropdownMenu) {
                                dropdownMenu.classList.remove('show');
                            }
                        }
                    });
                    
                    // Открываем текущее подменю
                    parentLi.classList.add('active');
                    this.nextElementSibling.classList.add('show');
                }
            });
        }
    });
    
    // Закрываем выпадающие меню при клике вне них
    document.addEventListener('click', function(e) {
        // Проверяем, не был ли клик внутри выпадающего меню
        const clickedInsideDropdown = e.target.closest('.inventory-menu > li');
        
        if (!clickedInsideDropdown) {
            // Закрываем все открытые выпадающие меню
            const openDropdowns = document.querySelectorAll('.inventory-menu > li.active');
            openDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
                const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.classList.remove('show');
                }
            });
        }
    });
}

/**
 * Общие функции для работы с API инвентаря
 */

// Базовый URL для API
const API_BASE_URL = '/api';

// Функции для работы с товарами
const inventoryItemsApi = {
  // Получить все товары
  getAll: async function() {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/items`);
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении товаров:', error);
      throw error;
    }
  },
  
  // Получить товар по ID
  getById: async function(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/items/${id}`);
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Ошибка при получении товара с ID ${id}:`, error);
      throw error;
    }
  },
  
  // Создать новый товар
  create: async function(itemData) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
      });
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка при создании товара:', error);
      throw error;
    }
  },
  
  // Обновить товар
  update: async function(id, itemData) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
      });
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Ошибка при обновлении товара с ID ${id}:`, error);
      throw error;
    }
  },
  
  // Удалить товар
  delete: async function(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/items/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error(`Ошибка при удалении товара с ID ${id}:`, error);
      throw error;
    }
  }
};

// Функции для работы с категориями
const inventoryCategoriesApi = {
  // Получить все категории
  getAll: async function() {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/categories`);
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении категорий:', error);
      throw error;
    }
  },
  
  // Создать новую категорию
  create: async function(categoryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
      });
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка при создании категории:', error);
      throw error;
    }
  }
};

// Функции для работы с единицами измерения
const inventoryUomApi = {
  // Получить все единицы измерения
  getAll: async function() {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/uom`);
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении единиц измерения:', error);
      throw error;
    }
  },
  
  // Создать новую единицу измерения
  create: async function(uomData) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/uom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(uomData)
      });
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка при создании единицы измерения:', error);
      throw error;
    }
  }
};

// Функции для работы с локациями
const inventoryLocationsApi = {
  // Получить все локации
  getAll: async function() {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/locations`);
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении локаций:', error);
      throw error;
    }
  },
  
  // Создать новую локацию
  create: async function(locationData) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(locationData)
      });
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка при создании локации:', error);
      throw error;
    }
  }
};

// Функции для работы с запасами
const inventoryStockApi = {
  // Получить все запасы
  getAll: async function() {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/stock`);
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении запасов:', error);
      throw error;
    }
  },
  
  // Обновить запасы
  update: async function(stockData) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(stockData)
      });
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка при обновлении запасов:', error);
      throw error;
    }
  }
};

// Функции для работы с движениями запасов
const inventoryMovementsApi = {
  // Получить все движения
  getAll: async function() {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/movements`);
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении движений запасов:', error);
      throw error;
    }
  },
  
  // Создать новое движение
  create: async function(movementData) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/movements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(movementData)
      });
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка при создании движения запасов:', error);
      throw error;
    }
  }
};

// Функции для работы с резервированием
const inventoryReservationsApi = {
  // Получить все резервирования
  getAll: async function() {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/reservations`);
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении резервирований:', error);
      throw error;
    }
  },
  
  // Создать новое резервирование
  create: async function(reservationData) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData)
      });
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка при создании резервирования:', error);
      throw error;
    }
  }
};

// Функции для работы с контрактами
const inventoryContractsApi = {
  // Получить все контракты
  getAll: async function() {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/contracts`);
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении контрактов:', error);
      throw error;
    }
  },
  
  // Создать новый контракт
  create: async function(contractData) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/contracts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contractData)
      });
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка при создании контракта:', error);
      throw error;
    }
  }
};

// Вспомогательные функции для интерфейса
const inventoryUtils = {
  // Форматирование даты
  formatDate: function(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  },
  
  // Форматирование даты и времени
  formatDateTime: function(dateTimeString) {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return `${date.toLocaleDateString('ru-RU')} ${date.toLocaleTimeString('ru-RU')}`;
  },
  
  // Форматирование числа с двумя десятичными знаками
  formatNumber: function(number) {
    return number ? parseFloat(number).toFixed(2) : '0.00';
  },
  
  // Форматирование денежной суммы
  formatCurrency: function(amount, currency = 'USD') {
    if (!amount) return '';
    
    const currencySymbols = {
      'USD': '$',
      'EUR': '€',
      'RUB': '₽',
      'GBP': '£'
    };
    
    const symbol = currencySymbols[currency] || currency;
    const formattedAmount = parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ');
    
    return `${formattedAmount} ${symbol}`;
  },
  
  // Получение текстового статуса товара
  getItemStatusText: function(status) {
    const statusMap = {
      'active': 'В наличии',
      'reserved': 'Зарезервировано',
      'in_transit': 'В пути',
      'damaged': 'Повреждено',
      'expired': 'Истек срок',
      'scrapped': 'Списано'
    };
    
    return statusMap[status] || status;
  }
};

// Экспортируем API в глобальный объект окна для доступа из HTML
window.inventoryApi = {
  items: inventoryItemsApi,
  categories: inventoryCategoriesApi,
  uom: inventoryUomApi,
  locations: inventoryLocationsApi,
  stock: inventoryStockApi,
  movements: inventoryMovementsApi,
  reservations: inventoryReservationsApi,
  contracts: inventoryContractsApi,
  utils: inventoryUtils
};

// Экспортируем функции для использования в других скриптах
window.inventoryCommon = {
    initSidebarMenus,
    initInventoryDropdowns
}; 