/**
 * Iframe Helper - Utility for handling iframe embedding functionality
 * Automatically detects when a page is loaded in an iframe and adjusts UI accordingly
 */

// Проверка и адаптация страницы при загрузке в iframe
function setupIframeMode() {
    // Проверка, загружена ли страница в iframe
    const isInIframe = window.self !== window.top;
    
    // Если страница загружена в iframe
    if (isInIframe) {
        // Скрываем элементы, которые не должны отображаться в iframe
        hideElementsInIframe();
        
        // Отправляем сообщение родительскому окну о размере контента
        reportSizeToParent();
        
        // Добавляем обработчик событий для реагирования на сообщения от родителя
        window.addEventListener('message', handleParentMessages);
        
        // Сообщаем родителю, что iframe загрузился и готов
        window.parent.postMessage({ 
            type: 'IFRAME_LOADED',
            id: window.frameElement?.id || 'unknown',
            url: window.location.href
        }, '*');
        
        return true;
    }
    
    return false;
}

// Скрыть элементы в iframe для предотвращения дублирования интерфейса
function hideElementsInIframe() {
    // Список селекторов элементов, которые нужно скрыть
    const elementsToHide = [
        '.sidebar',
        '.top-bar',
        '.main-header',
        '.inventory-nav',
        '.breadcrumb',
        '.page-title',
        '.app-header'
    ];
    
    // Скрываем каждый элемент
    elementsToHide.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.style.display = 'none';
        });
    });
    
    // Настраиваем основное содержимое для отображения в iframe
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.marginLeft = '0';
        mainContent.style.padding = '0';
    }
    
    // Удаляем отступы у контейнера форм
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        formContainer.style.padding = '0';
    }
}

// Сообщить родительскому окну о размере содержимого
function reportSizeToParent() {
    // Функция для отправки размера
    function sendSize() {
        const height = document.body.scrollHeight;
        window.parent.postMessage({ 
            type: 'IFRAME_RESIZE',
            height: height,
            id: window.frameElement?.id || 'unknown' 
        }, '*');
    }
    
    // Отправляем размер при загрузке
    if (document.readyState === 'complete') {
        sendSize();
    } else {
        window.addEventListener('load', sendSize);
    }
    
    // Отправляем размер при изменении содержимого
    const observer = new MutationObserver(sendSize);
    observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true,
        characterData: true
    });
    
    // Отправляем размер при изменении окна
    window.addEventListener('resize', sendSize);
}

// Обработка сообщений от родительского окна
function handleParentMessages(event) {
    const message = event.data;
    
    if (typeof message !== 'object') return;
    
    switch(message.type) {
        case 'REQUEST_SIZE':
            // Отправить размер в ответ на запрос
            const height = document.body.scrollHeight;
            window.parent.postMessage({ 
                type: 'IFRAME_RESIZE',
                height: height,
                id: message.id || window.frameElement?.id || 'unknown' 
            }, '*');
            break;
            
        case 'SCROLL_TO':
            // Прокрутка к определенному элементу
            if (message.selector) {
                const element = document.querySelector(message.selector);
                if (element) {
                    element.scrollIntoView({ 
                        behavior: message.smooth ? 'smooth' : 'auto',
                        block: 'start'
                    });
                }
            }
            break;
            
        // Можно добавить другие типы сообщений при необходимости
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', setupIframeMode);

// Экспорт функций для использования в других скриптах
window.iframeHelper = {
    isInIframe: window.self !== window.top,
    setupIframeMode,
    hideElementsInIframe,
    reportSizeToParent
}; 