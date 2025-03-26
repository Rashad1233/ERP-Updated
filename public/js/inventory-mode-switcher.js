/**
 * Inventory Mode Switcher - Manages UI modules visibility
 * Allows switching between different UI modes by hiding/showing specific elements
 */

// Available UI modes
const UI_MODES = {
    FULL: 'full',           // All features visible
    BASIC: 'basic',         // Only essential features
    WAREHOUSE: 'warehouse', // Focus on warehousing operations
    PURCHASE: 'purchase',   // Focus on purchasing operations
    CUSTOM: 'custom'        // Custom configuration
};

// UI Elements that can be toggled per module
const UI_ELEMENTS = {
    CHARTS: '.charts-container, .chart-card',
    STATS: '.inventory-stats, .stat-card',
    FILTERS: '.filter-panel, .advanced-filters',
    ACTIONS: '.action-buttons-container',
    REPORTS: '.reports-menu, .report-widgets',
    ALERTS: '.alerts-container',
    IMPORT_EXPORT: '.import-export-panel',
    ADVANCED_OPTIONS: '.advanced-settings',
    TABLE_ACTIONS: '.action-buttons'
};

// Predefined configurations for each mode
const MODE_CONFIGURATIONS = {
    [UI_MODES.FULL]: {
        // All elements visible by default
    },
    [UI_MODES.BASIC]: {
        hiddenElements: [
            UI_ELEMENTS.CHARTS,
            UI_ELEMENTS.ADVANCED_OPTIONS,
            UI_ELEMENTS.IMPORT_EXPORT
        ]
    },
    [UI_MODES.WAREHOUSE]: {
        hiddenElements: [
            UI_ELEMENTS.CHARTS,
            UI_ELEMENTS.REPORTS,
            UI_ELEMENTS.IMPORT_EXPORT
        ]
    },
    [UI_MODES.PURCHASE]: {
        hiddenElements: [
            UI_ELEMENTS.CHARTS,
            UI_ELEMENTS.ADVANCED_OPTIONS
        ]
    }
};

// Custom user preferences storage
let userPreferences = {
    currentMode: UI_MODES.FULL,
    customHiddenElements: []
};

// Initialize mode switcher
function initModeSwitcher() {
    // Load saved preferences if available
    loadUserPreferences();
    
    // Create mode switcher UI
    createModeSwitcherUI();
    
    // Apply initial mode
    applyMode(userPreferences.currentMode);
    
    // Log initialization
    console.log('Inventory Mode Switcher initialized:', userPreferences.currentMode);
}

// Create the mode switcher UI
function createModeSwitcherUI() {
    // Create mode switcher container
    const modeSwitcherHTML = `
        <div class="mode-switcher">
            <div class="mode-switcher-toggle">
                <i class="fas fa-th-large"></i>
                <span>UI Mode</span>
            </div>
            <div class="mode-options">
                <div class="mode-option ${userPreferences.currentMode === UI_MODES.FULL ? 'active' : ''}" data-mode="${UI_MODES.FULL}">
                    <i class="fas fa-th"></i>
                    <span>Full View</span>
                </div>
                <div class="mode-option ${userPreferences.currentMode === UI_MODES.BASIC ? 'active' : ''}" data-mode="${UI_MODES.BASIC}">
                    <i class="fas fa-th-list"></i>
                    <span>Basic View</span>
                </div>
                <div class="mode-option ${userPreferences.currentMode === UI_MODES.WAREHOUSE ? 'active' : ''}" data-mode="${UI_MODES.WAREHOUSE}">
                    <i class="fas fa-warehouse"></i>
                    <span>Warehouse Mode</span>
                </div>
                <div class="mode-option ${userPreferences.currentMode === UI_MODES.PURCHASE ? 'active' : ''}" data-mode="${UI_MODES.PURCHASE}">
                    <i class="fas fa-shopping-cart"></i>
                    <span>Purchase Mode</span>
                </div>
                <div class="mode-option ${userPreferences.currentMode === UI_MODES.CUSTOM ? 'active' : ''}" data-mode="${UI_MODES.CUSTOM}">
                    <i class="fas fa-sliders-h"></i>
                    <span>Custom Mode</span>
                </div>
                <div class="mode-customize">
                    <button id="customizeUiBtn" class="btn-default">
                        <i class="fas fa-cog"></i> Customize UI
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Append mode switcher to header actions
    const headerActions = document.querySelector('.header-actions');
    if (headerActions) {
        headerActions.insertAdjacentHTML('beforeend', modeSwitcherHTML);
        
        // Add event listeners for mode switching
        document.querySelectorAll('.mode-option').forEach(option => {
            option.addEventListener('click', () => {
                const mode = option.getAttribute('data-mode');
                applyMode(mode);
                saveUserPreferences();
                
                // Update active class
                document.querySelectorAll('.mode-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                option.classList.add('active');
            });
        });
        
        // Add event listener for mode switcher toggle
        const modeSwitcherToggle = document.querySelector('.mode-switcher-toggle');
        if (modeSwitcherToggle) {
            modeSwitcherToggle.addEventListener('click', () => {
                document.querySelector('.mode-options').classList.toggle('show');
            });
        }
        
        // Add event listener for customize button
        const customizeBtn = document.getElementById('customizeUiBtn');
        if (customizeBtn) {
            customizeBtn.addEventListener('click', showCustomizationDialog);
        }
    }
}

// Apply the selected mode
function applyMode(mode) {
    userPreferences.currentMode = mode;
    
    // Show all elements first (reset)
    Object.values(UI_ELEMENTS).forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.display = '';
        });
    });
    
    // If custom mode, hide custom elements
    if (mode === UI_MODES.CUSTOM) {
        userPreferences.customHiddenElements.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.display = 'none';
            });
        });
        return;
    }
    
    // Apply predefined configuration
    const config = MODE_CONFIGURATIONS[mode];
    if (config && config.hiddenElements) {
        config.hiddenElements.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.display = 'none';
            });
        });
    }
}

// Show customization dialog
function showCustomizationDialog() {
    // Create modal HTML
    const modalHTML = `
        <div class="modal" id="customizeModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Customize UI Elements</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Select elements to show or hide:</p>
                    <div class="customize-options">
                        <div class="customize-option">
                            <input type="checkbox" id="toggle-charts" ${isElementVisible(UI_ELEMENTS.CHARTS) ? 'checked' : ''}>
                            <label for="toggle-charts">Charts and Graphs</label>
                        </div>
                        <div class="customize-option">
                            <input type="checkbox" id="toggle-stats" ${isElementVisible(UI_ELEMENTS.STATS) ? 'checked' : ''}>
                            <label for="toggle-stats">Statistics Cards</label>
                        </div>
                        <div class="customize-option">
                            <input type="checkbox" id="toggle-filters" ${isElementVisible(UI_ELEMENTS.FILTERS) ? 'checked' : ''}>
                            <label for="toggle-filters">Filter Panels</label>
                        </div>
                        <div class="customize-option">
                            <input type="checkbox" id="toggle-actions" ${isElementVisible(UI_ELEMENTS.ACTIONS) ? 'checked' : ''}>
                            <label for="toggle-actions">Action Buttons</label>
                        </div>
                        <div class="customize-option">
                            <input type="checkbox" id="toggle-reports" ${isElementVisible(UI_ELEMENTS.REPORTS) ? 'checked' : ''}>
                            <label for="toggle-reports">Reports Section</label>
                        </div>
                        <div class="customize-option">
                            <input type="checkbox" id="toggle-alerts" ${isElementVisible(UI_ELEMENTS.ALERTS) ? 'checked' : ''}>
                            <label for="toggle-alerts">Alert Notifications</label>
                        </div>
                        <div class="customize-option">
                            <input type="checkbox" id="toggle-import-export" ${isElementVisible(UI_ELEMENTS.IMPORT_EXPORT) ? 'checked' : ''}>
                            <label for="toggle-import-export">Import/Export Section</label>
                        </div>
                        <div class="customize-option">
                            <input type="checkbox" id="toggle-advanced" ${isElementVisible(UI_ELEMENTS.ADVANCED_OPTIONS) ? 'checked' : ''}>
                            <label for="toggle-advanced">Advanced Options</label>
                        </div>
                        <div class="customize-option">
                            <input type="checkbox" id="toggle-table-actions" ${isElementVisible(UI_ELEMENTS.TABLE_ACTIONS) ? 'checked' : ''}>
                            <label for="toggle-table-actions">Table Action Buttons</label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="saveCustomizations" class="btn-primary">Save Changes</button>
                    <button id="cancelCustomizations" class="btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    // Append modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = document.getElementById('customizeModal');
    modal.style.display = 'block';
    
    // Add event listeners for modal actions
    document.querySelector('.close-btn').addEventListener('click', () => {
        modal.remove();
    });
    
    document.getElementById('cancelCustomizations').addEventListener('click', () => {
        modal.remove();
    });
    
    document.getElementById('saveCustomizations').addEventListener('click', () => {
        // Save custom configuration
        userPreferences.currentMode = UI_MODES.CUSTOM;
        userPreferences.customHiddenElements = [];
        
        // Check each toggle option
        const toggleOptions = {
            'toggle-charts': UI_ELEMENTS.CHARTS,
            'toggle-stats': UI_ELEMENTS.STATS,
            'toggle-filters': UI_ELEMENTS.FILTERS,
            'toggle-actions': UI_ELEMENTS.ACTIONS,
            'toggle-reports': UI_ELEMENTS.REPORTS,
            'toggle-alerts': UI_ELEMENTS.ALERTS,
            'toggle-import-export': UI_ELEMENTS.IMPORT_EXPORT,
            'toggle-advanced': UI_ELEMENTS.ADVANCED_OPTIONS,
            'toggle-table-actions': UI_ELEMENTS.TABLE_ACTIONS
        };
        
        Object.entries(toggleOptions).forEach(([id, selector]) => {
            const checkbox = document.getElementById(id);
            if (checkbox && !checkbox.checked) {
                userPreferences.customHiddenElements.push(selector);
            }
        });
        
        // Apply and save custom mode
        applyMode(UI_MODES.CUSTOM);
        saveUserPreferences();
        
        // Update UI
        document.querySelectorAll('.mode-option').forEach(opt => {
            opt.classList.remove('active');
        });
        document.querySelector(`.mode-option[data-mode="${UI_MODES.CUSTOM}"]`).classList.add('active');
        
        // Close modal
        modal.remove();
    });
}

// Check if an element is currently visible
function isElementVisible(selector) {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return true;
    
    return elements[0].style.display !== 'none';
}

// Save user preferences to localStorage
function saveUserPreferences() {
    localStorage.setItem('inventoryUiPreferences', JSON.stringify(userPreferences));
}

// Load user preferences from localStorage
function loadUserPreferences() {
    const savedPreferences = localStorage.getItem('inventoryUiPreferences');
    if (savedPreferences) {
        userPreferences = JSON.parse(savedPreferences);
    }
}

// Add CSS for mode switcher
function addModeSwitcherStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Mode Switcher Styles */
        .mode-switcher {
            position: relative;
            margin-left: 15px;
        }
        
        .mode-switcher-toggle {
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 8px 12px;
            background-color: #f0f4f8;
            border-radius: 4px;
            font-weight: 500;
            transition: all 0.2s;
        }
        
        .mode-switcher-toggle i {
            margin-right: 8px;
            color: #4a6bdf;
        }
        
        .mode-switcher-toggle:hover {
            background-color: #e1e8f0;
        }
        
        .mode-options {
            position: absolute;
            top: 100%;
            right: 0;
            width: 220px;
            background-color: #fff;
            border-radius: 6px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            padding: 12px;
            display: none;
            z-index: 1001;
        }
        
        .mode-options.show {
            display: block;
            animation: fadeInDown 0.2s ease-in-out;
        }
        
        .mode-option {
            display: flex;
            align-items: center;
            padding: 10px;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.2s;
        }
        
        .mode-option i {
            margin-right: 10px;
            width: 20px;
            text-align: center;
            color: #4a6bdf;
        }
        
        .mode-option:hover {
            background-color: #f0f4f8;
        }
        
        .mode-option.active {
            background-color: #e1e8f0;
            font-weight: 500;
        }
        
        .mode-customize {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #e1e8f0;
        }
        
        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 1002;
        }
        
        .modal-content {
            position: relative;
            background-color: #fff;
            margin: 100px auto;
            padding: 0;
            width: 500px;
            max-width: 90%;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .modal-header {
            padding: 15px 20px;
            border-bottom: 1px solid #e1e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h2 {
            margin: 0;
            font-size: 18px;
        }
        
        .close-btn {
            font-size: 24px;
            font-weight: bold;
            background: none;
            border: none;
            cursor: pointer;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .customize-options {
            margin-top: 15px;
        }
        
        .customize-option {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
        }
        
        .customize-option input[type="checkbox"] {
            margin-right: 10px;
        }
        
        .modal-footer {
            padding: 15px 20px;
            border-top: 1px solid #e1e8f0;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
    `;
    
    document.head.appendChild(styleElement);
}

// Document ready
document.addEventListener('DOMContentLoaded', () => {
    // Add mode switcher styles
    addModeSwitcherStyles();
    
    // Initialize mode switcher
    initModeSwitcher();
    
    // Close mode options when clicking outside
    document.addEventListener('click', (event) => {
        const modeSwitcher = document.querySelector('.mode-switcher');
        const modeOptions = document.querySelector('.mode-options');
        
        if (modeSwitcher && modeOptions && 
            !modeSwitcher.contains(event.target) && 
            modeOptions.classList.contains('show')) {
            modeOptions.classList.remove('show');
        }
    });
}); 