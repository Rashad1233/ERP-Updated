document.addEventListener('DOMContentLoaded', function() {
    // Устанавливаем флаг инициализации
    window.sidebarInitialized = true;
    
    // Находим все элементы с подменю
    const submenuToggles = document.querySelectorAll('.submenu-toggle');
    const toggleSidebarBtn = document.querySelector('.toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    // Проверяем, мобильное ли устройство
    const isMobile = window.innerWidth <= 768;
    
    // Проверяем сохраненное состояние боковой панели
    const sidebarState = localStorage.getItem('sidebarCollapsed');
    
    // Применяем состояние боковой панели
    if (sidebarState === 'true' && !isMobile) {
        sidebar.classList.add('collapsed');
        if (mainContent) {
            mainContent.style.marginLeft = '70px';
        }
    }
    
    // Убедимся, что подменю скрыты при загрузке страницы в свернутом режиме
    if (sidebar.classList.contains('collapsed')) {
        document.querySelectorAll('.submenu').forEach(submenu => {
            submenu.style.display = 'none';
        });
    }
    
    // Обработчик наведения на пункт меню в свернутом режиме
    const submenuItems = document.querySelectorAll('.has-submenu');
    submenuItems.forEach(item => {
        const submenu = item.querySelector('.submenu');
        
        // При наведении на пункт с подменю
        item.addEventListener('mouseenter', function() {
            if (sidebar.classList.contains('collapsed') && !isMobile) {
                // Показываем подменю
                if (submenu) {
                    submenu.style.display = 'block';
                    submenu.style.opacity = '1';
                    submenu.style.visibility = 'visible';
                }
            }
        });
        
        // При уходе курсора с пункта с подменю
        item.addEventListener('mouseleave', function() {
            if (sidebar.classList.contains('collapsed') && !isMobile) {
                // Скрываем подменю
                if (submenu) {
                    submenu.style.display = 'none';
                    submenu.style.opacity = '0';
                    submenu.style.visibility = 'hidden';
                }
            }
        });
    });
    
    // Обработчик нажатия на кнопку сворачивания/разворачивания
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', function() {
            if (isMobile) {
                sidebar.classList.toggle('mobile-open');
            } else {
                sidebar.classList.toggle('collapsed');
                localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
                
                // Управляем отображением подменю при сворачивании/разворачивании
                if (sidebar.classList.contains('collapsed')) {
                    document.querySelectorAll('.submenu').forEach(submenu => {
                        submenu.style.display = 'none';
                    });
                } else {
                    // В развернутом режиме показываем активные подменю
                    document.querySelectorAll('.has-submenu.active .submenu').forEach(submenu => {
                        submenu.style.display = 'block';
                    });
                }
                
                // Обновляем margin-left для главного контента
                if (mainContent) {
                    if (sidebar.classList.contains('collapsed')) {
                        mainContent.style.marginLeft = '70px';
                    } else {
                        mainContent.style.marginLeft = '250px';
                    }
                }
            }
        });
    }
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', function() {
        const newIsMobile = window.innerWidth <= 768;
        
        if (newIsMobile !== isMobile) {
            // Размер изменился с мобильного на десктоп или наоборот
            if (newIsMobile) {
                sidebar.classList.remove('collapsed');
                if (mainContent) {
                    mainContent.style.marginLeft = '0';
                }
                if (sidebarState === 'true') {
                    sidebar.classList.add('mobile-open');
                }
            } else {
                sidebar.classList.remove('mobile-open');
                if (sidebarState === 'true') {
                    sidebar.classList.add('collapsed');
                    if (mainContent) {
                        mainContent.style.marginLeft = '70px';
                    }
                } else {
                    if (mainContent) {
                        mainContent.style.marginLeft = '250px';
                    }
                }
            }
        }
    });

    // Добавляем обработчики событий для каждого элемента с подменю
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.parentElement;
            
            // Если боковая панель свернута, то при клике раскрываем её
            if (sidebar.classList.contains('collapsed') && !isMobile) {
                sidebar.classList.remove('collapsed');
                localStorage.setItem('sidebarCollapsed', 'false');
                if (mainContent) {
                    mainContent.style.marginLeft = '250px';
                }
            }
            
            // Если меню уже активное и мы кликаем по нему, то закрываем
            if (parent.classList.contains('active')) {
                parent.classList.remove('active');
                // Скрываем подменю
                const submenu = parent.querySelector('.submenu');
                if (submenu) submenu.style.display = 'none';
            } else {
                // Закрываем все открытые подменю
                document.querySelectorAll('.has-submenu.active').forEach(item => {
                    if (item !== parent) {
                        item.classList.remove('active');
                        const submenu = item.querySelector('.submenu');
                        if (submenu) submenu.style.display = 'none';
                    }
                });
                
                // Открываем текущее подменю
                parent.classList.add('active');
                const submenu = parent.querySelector('.submenu');
                if (submenu) submenu.style.display = 'block';
            }
        });
    });

    // Закрытие сайдбара при клике на мобильных устройствах
    document.addEventListener('click', function(e) {
        if (isMobile && sidebar.classList.contains('mobile-open')) {
            // Если клик был не внутри сайдбара и не на кнопке переключения
            if (!sidebar.contains(e.target) && e.target !== toggleSidebarBtn && !toggleSidebarBtn.contains(e.target)) {
                sidebar.classList.remove('mobile-open');
            }
        }
    });

    // Активируем подменю на основе текущего URL
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop() || 'index.html';
    
    // Список страниц из раздела Procurement
    const procurementPages = [
        'procurement.html',
        'requisitions.html',
        'rfq.html',
        'purchase-orders.html',
        'suppliers.html',
        'contracts.html'
    ];
    
    // Список страниц из раздела Sales
    const salesPages = [
        'sales.html',
        'supplier-quote-request.html',
        'quotations.html',
        'sales-orders.html',
        'customers.html',
        'sales-contracts.html'
    ];
    
    // Находим меню для разделов
    let procurementMenu = null;
    let salesMenu = null;
    
    // Получаем все выпадающие меню
    const submenuItemsList = document.querySelectorAll('.sidebar-menu .has-submenu');
    
    // Ищем меню среди всех выпадающих меню
    submenuItemsList.forEach(menu => {
        const menuText = menu.querySelector('.submenu-toggle span').textContent.trim();
        if (menuText === 'Procurement') {
            procurementMenu = menu;
        } else if (menuText === 'Sales') {
            salesMenu = menu;
        }
    });
    
    // Если текущая страница является частью секции Procurement, открываем подменю
    if (procurementPages.includes(filename) && procurementMenu) {
        // Если боковая панель не свернута, то открываем подменю
        if (!sidebar.classList.contains('collapsed') || isMobile) {
            procurementMenu.classList.add('active');
            const submenu = procurementMenu.querySelector('.submenu');
            if (submenu) submenu.style.display = 'block';
        }
        
        // Находим соответствующий элемент подменю и активируем его
        const currentSubmenuItem = procurementMenu.querySelector(`.submenu a[href="${filename}"]`);
        if (currentSubmenuItem) {
            const parentLi = currentSubmenuItem.closest('li');
            parentLi.classList.add('active');
        }
    } 
    // Если текущая страница является частью секции Sales, открываем подменю
    else if (salesPages.includes(filename) && salesMenu) {
        // Если боковая панель не свернута, то открываем подменю
        if (!sidebar.classList.contains('collapsed') || isMobile) {
            salesMenu.classList.add('active');
            const submenu = salesMenu.querySelector('.submenu');
            if (submenu) submenu.style.display = 'block';
        }
        
        // Находим соответствующий элемент подменю и активируем его
        const currentSubmenuItem = salesMenu.querySelector(`.submenu a[href="${filename}"]`);
        if (currentSubmenuItem) {
            const parentLi = currentSubmenuItem.closest('li');
            parentLi.classList.add('active');
        }
    }
    else {
        // Для других страниц находим активный элемент в основном меню
        const menuItem = document.querySelector(`.sidebar-menu > li:not(.has-submenu) > a[href="${filename}"]`);
        if (menuItem) {
            menuItem.closest('li').classList.add('active');
        }
    }
}); 