// Common functionality shared across the application

// Функция для определения мобильного устройства
function isMobile() {
  return window.innerWidth <= 576;
}

// Инициализация меню в common.js
const initSidebar = function() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const sidebarState = localStorage.getItem('sidebarCollapsed');
    
    // Проверка сохраненного состояния боковой панели
    if (sidebarState === 'true' && window.innerWidth > 768) {
        sidebar.classList.add('collapsed');
        if (mainContent) {
            mainContent.style.marginLeft = '70px';
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
  // Sidebar toggle functionality
  const toggleBtn = document.querySelector('.toggle-sidebar');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      if (isMobile()) {
        // На мобильных устройствах переключаем класс mobile-open
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('mobile-open');
        
        // Добавляем/убираем оверлей
        toggleSidebarOverlay();
      } else {
        // На десктопах используем класс sidebar-collapsed
        document.querySelector('.app-container').classList.toggle('sidebar-collapsed');
      }
    });
  }
  
  // Создание оверлея для закрытия сайдбара при клике вне его
  createSidebarOverlay();
  
  // Отслеживание изменения размера экрана
  window.addEventListener('resize', handleWindowResize);
  
  // Вызываем функцию для первоначальной настройки
  handleWindowResize();
  
  // Инициализация выпадающего меню в боковой панели
  initSubmenu();
  
  // Добавляем обработчики для всех пунктов меню на мобильных устройствах
  addMobileMenuItemHandlers();
  
  // Logout button functionality
  const logoutBtn = document.querySelector('#logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      fetch('/api/logout', {
        method: 'POST',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Logout failed');
          }
          return response.json();
        })
        .then(data => {
          console.log('Logout successful');
          window.location.href = '/index.html';
        })
        .catch(error => {
          console.error('Logout error:', error);
          alert('Error during logout. Please try again.');
        });
    });
  }
  
  // Show username in the top bar if available
  const usernameElement = document.getElementById('username');
  if (usernameElement) {
    fetch('/api/user-info')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }
        return response.json();
      })
      .then(data => {
        if (data.user && data.user.username) {
          usernameElement.textContent = data.user.username;
        }
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
        // Set a default username if there's an error
        usernameElement.textContent = 'Demo User';
      });
  }
  
  // Set up global notification system
  if (typeof setupNotifications === 'function') {
    setupNotifications();
  }
  
  // Добавляем класс адаптивного UI для таблиц
  makeTablesResponsive();
  
  // Инициализируем sidebar только если не загружен sidebar.js
  if (!window.sidebarInitialized) {
    initSidebar();
  }
});

// Функция для инициализации выпадающего меню в боковой панели
function initSubmenu() {
  const hasSubmenuItems = document.querySelectorAll('.sidebar-menu li.has-submenu');
  
  hasSubmenuItems.forEach(item => {
    // Находим ссылку в пункте меню
    const link = item.querySelector('a');
    
    // Добавляем обработчик клика
    link.addEventListener('click', function(e) {
      // Предотвращаем переход по ссылке
      e.preventDefault();
      
      // Переключаем класс active для текущего пункта
      item.classList.toggle('submenu-active');
      
      // Управляем видимостью подменю через CSS
      const submenu = item.querySelector('.submenu');
      if (submenu) {
        if (item.classList.contains('submenu-active')) {
          submenu.style.display = 'block';
        } else {
          submenu.style.display = 'none';
        }
      }
    });
    
    // Если пункт меню уже активен, отображаем подменю
    if (item.classList.contains('active') || item.querySelector('li.active')) {
      item.classList.add('submenu-active');
      const submenu = item.querySelector('.submenu');
      if (submenu) {
        submenu.style.display = 'block';
      }
    }
  });
}

// Добавляем обработчики для пунктов меню на мобильных устройствах
function addMobileMenuItemHandlers() {
  if (isMobile()) {
    const menuItems = document.querySelectorAll('.sidebar-menu li a');
    menuItems.forEach(item => {
      item.addEventListener('click', function() {
        // После клика на пункт меню на мобильных устройствах закрываем сайдбар
        setTimeout(() => {
          const sidebar = document.querySelector('.sidebar');
          if (sidebar.classList.contains('mobile-open')) {
            sidebar.classList.remove('mobile-open');
            toggleSidebarOverlay();
          }
        }, 150); // Небольшая задержка, чтобы успела сработать анимация
      });
    });
  }
}

// Адаптация таблиц для мобильных устройств
function makeTablesResponsive() {
  const tables = document.querySelectorAll('table.data-table');
  tables.forEach(table => {
    const parent = table.parentElement;
    
    // Если таблица еще не обернута в responsive контейнер
    if (!parent.classList.contains('table-responsive')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-responsive';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    }
  });
}

// Создание оверлея для мобильной версии
function createSidebarOverlay() {
  if (!document.querySelector('.sidebar-overlay')) {
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    // Закрытие сайдбара при клике на оверлей
    overlay.addEventListener('click', function() {
      const sidebar = document.querySelector('.sidebar');
      sidebar.classList.remove('mobile-open');
      this.classList.remove('active');
    });
  }
}

// Переключение видимости оверлея
function toggleSidebarOverlay() {
  const overlay = document.querySelector('.sidebar-overlay');
  if (overlay) {
    overlay.classList.toggle('active');
  }
}

// Обработка изменения размера окна
function handleWindowResize() {
  const isMobileView = isMobile();
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  
  if (isMobileView) {
    // На мобильных устройствах сайдбар по умолчанию скрыт
    if (sidebar) {
      sidebar.classList.remove('mobile-open');
    }
    if (mainContent) {
      mainContent.style.marginLeft = '0';
    }
    
    // Закрываем оверлей при изменении размера
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
    
    // Адаптируем таблицы
    makeTablesResponsive();
    
    // Добавляем обработчики для пунктов меню
    addMobileMenuItemHandlers();
  } else {
    // На больших экранах возвращаем стандартный вид
    if (sidebar) {
      sidebar.style.width = '';
    }
    if (mainContent) {
      mainContent.style.marginLeft = '';
    }
  }
}

// Set up notification system
function setupNotifications() {
  // Create notification container if it doesn't exist
  if (!document.querySelector('.notification-container')) {
    const container = document.createElement('div');
    container.className = 'notification-container';
    document.body.appendChild(container);
  }
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Add to container or body
  const container = document.querySelector('.notification-container') || document.body;
  container.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Hide and remove after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      container.removeChild(notification);
    }, 300);
  }, 5000);
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

// Format date
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Simple date format (no time)
function formatSimpleDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  }).format(date);
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

// Initialize language system if available
if (typeof window.erpLanguage !== 'undefined' && typeof window.erpLanguage.init === 'function') {
  window.erpLanguage.init();
}
