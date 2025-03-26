/**
 * Settings Manager - Управление страницей с объединенными настройками
 * Обрабатывает переключение вкладок и взаимодействие с iframe
 */

class SettingsManager {
    constructor() {
        this.activeTab = null;
        this.iframes = {};
        this.tabPanes = {};
        this.tabLinks = {};
        
        // Инициализировать при загрузке DOM
        document.addEventListener('DOMContentLoaded', () => this.initialize());
    }
    
    initialize() {
        // Найти все iframe на странице
        document.querySelectorAll('.settings-tab-pane iframe').forEach(iframe => {
            const id = iframe.id;
            const tabId = iframe.closest('.settings-tab-pane').id.replace('-tab', '');
            
            this.iframes[tabId] = iframe;
            this.tabPanes[tabId] = iframe.closest('.settings-tab-pane');
        });
        
        // Найти все ссылки на вкладки
        document.querySelectorAll('.settings-tabs li a').forEach(link => {
            const tabId = this.getTabIdFromLink(link);
            this.tabLinks[tabId] = link.parentElement;
            
            // Добавить обработчик события для переключения вкладок
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showTab(tabId);
            });
        });
        
        // Установить обработчик сообщений от iframe
        window.addEventListener('message', (event) => this.handleIframeMessages(event));
        
        // Показать начальную вкладку
        const initialTab = this.getInitialTabId();
        this.showTab(initialTab);
    }
    
    getTabIdFromLink(link) {
        // Извлечь ID вкладки из атрибута onclick
        const onclickAttr = link.getAttribute('onclick');
        if (onclickAttr) {
            const match = onclickAttr.match(/showTab\(['"]([^'"]+)['"]\)/);
            if (match) {
                return match[1];
            }
        }
        
        // Если не найдено, попробовать из href
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            return href.substring(1).replace('-tab', '');
        }
        
        return null;
    }
    
    getInitialTabId() {
        // Проверить URL-параметр для определения начальной вкладки
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        
        if (tabParam && this.tabPanes[tabParam]) {
            return tabParam;
        }
        
        // Иначе найти активную вкладку или вернуть первую
        const activeTabLink = document.querySelector('.settings-tabs li.active a');
        if (activeTabLink) {
            const tabId = this.getTabIdFromLink(activeTabLink);
            if (tabId) {
                return tabId;
            }
        }
        
        // Вернуть первую доступную вкладку или 'categories' по умолчанию
        const firstTabLink = document.querySelector('.settings-tabs li a');
        if (firstTabLink) {
            const tabId = this.getTabIdFromLink(firstTabLink);
            if (tabId) {
                return tabId;
            }
        }
        
        return 'categories';
    }
    
    showTab(tabId) {
        if (!tabId || !this.tabPanes[tabId]) {
            console.error(`Tab ${tabId} not found`);
            return;
        }
        
        // Если это та же вкладка, не делаем ничего
        if (this.activeTab === tabId) {
            return;
        }
        
        // Сохраняем ID активной вкладки
        this.activeTab = tabId;
        
        // Скрываем все вкладки
        Object.values(this.tabPanes).forEach(pane => {
            pane.classList.remove('active');
        });
        
        // Удаляем активный класс у всех ссылок
        Object.values(this.tabLinks).forEach(link => {
            link.classList.remove('active');
        });
        
        // Показываем выбранную вкладку
        this.tabPanes[tabId].classList.add('active');
        
        // Добавляем активный класс к выбранной ссылке
        if (this.tabLinks[tabId]) {
            this.tabLinks[tabId].classList.add('active');
        }
        
        // Обновляем URL с параметром tab
        this.updateUrlWithTab(tabId);
        
        // Запрашиваем размер iframe
        this.requestIframeSize(tabId);
    }
    
    updateUrlWithTab(tabId) {
        // Обновляем URL без перезагрузки страницы
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tabId);
        window.history.replaceState({}, '', url.toString());
    }
    
    requestIframeSize(tabId) {
        const iframe = this.iframes[tabId];
        if (!iframe || !iframe.contentWindow) {
            return;
        }
        
        // Запрашиваем размер iframe
        iframe.contentWindow.postMessage({
            type: 'REQUEST_SIZE',
            id: iframe.id
        }, '*');
    }
    
    handleIframeMessages(event) {
        const message = event.data;
        
        if (typeof message !== 'object') {
            return;
        }
        
        switch(message.type) {
            case 'IFRAME_LOADED':
                // Iframe сообщил о своей загрузке
                console.log(`Iframe loaded: ${message.id}`);
                this.requestIframeSize(message.id.replace('-iframe', ''));
                break;
                
            case 'IFRAME_RESIZE':
                // Iframe сообщил о своем размере
                const iframe = document.getElementById(message.id);
                if (iframe) {
                    iframe.style.height = `${message.height + 20}px`; // Добавляем небольшой отступ
                }
                break;
                
            // Другие типы сообщений могут быть добавлены при необходимости
        }
    }
}

// Создаем и экспортируем экземпляр менеджера настроек
window.settingsManager = new SettingsManager(); 