const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const SQLiteStore = require('connect-sqlite3')(session);

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Create pdfs directory if it doesn't exist
const pdfDir = path.join(__dirname, 'pdfs');
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir, { recursive: true });
  console.log('Created pdfs directory');
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'erp-secret-key',
  resave: false,
  saveUninitialized: true,
  unset: 'destroy',
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  store: new SQLiteStore({
    db: 'sessions.db',
    dir: __dirname
  })
}));

// Database setup
const db = new sqlite3.Database('./erp.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    createInventoryTables();
  }
});

// Функция для создания таблиц инвентаря в SQLite
function createInventoryTables() {
  // Создаем таблицы инвентаря
  const createTableQueries = [
    // Таблица категорий товаров
    `CREATE TABLE IF NOT EXISTS inventory_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      parent_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(parent_id) REFERENCES inventory_categories(id)
    )`,
    
    // Таблица единиц измерения
    `CREATE TABLE IF NOT EXISTS inventory_uom (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      conversion_factor REAL DEFAULT 1.0,
      base_uom_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(base_uom_id) REFERENCES inventory_uom(id)
    )`,
    
    // Таблица складских локаций
    `CREATE TABLE IF NOT EXISTS inventory_locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      parent_id INTEGER,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(parent_id) REFERENCES inventory_locations(id)
    )`,
    
    // Основная таблица товаров и материалов
    `CREATE TABLE IF NOT EXISTS inventory_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      category_id INTEGER,
      uom_id INTEGER,
      current_quantity REAL DEFAULT 0,
      min_quantity REAL DEFAULT 0,
      unit_price REAL DEFAULT 0,
      currency TEXT DEFAULT 'USD',
      supplier_id INTEGER,
      status TEXT DEFAULT 'active',
      expiry_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(category_id) REFERENCES inventory_categories(id),
      FOREIGN KEY(uom_id) REFERENCES inventory_uom(id),
      FOREIGN KEY(supplier_id) REFERENCES suppliers(id)
    )`,
    
    // Таблица запасов по локациям
    `CREATE TABLE IF NOT EXISTS inventory_stock (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER NOT NULL,
      location_id INTEGER NOT NULL,
      quantity REAL DEFAULT 0,
      reserved_quantity REAL DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(item_id, location_id),
      FOREIGN KEY(item_id) REFERENCES inventory_items(id),
      FOREIGN KEY(location_id) REFERENCES inventory_locations(id)
    )`,
    
    // Таблица движения запасов (транзакции)
    `CREATE TABLE IF NOT EXISTS inventory_movements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_type TEXT NOT NULL,
      item_id INTEGER NOT NULL,
      from_location_id INTEGER,
      to_location_id INTEGER,
      quantity REAL NOT NULL,
      unit_price REAL,
      total_price REAL,
      document_reference TEXT,
      document_type TEXT,
      document_id INTEGER,
      notes TEXT,
      performed_by TEXT,
      transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(item_id) REFERENCES inventory_items(id),
      FOREIGN KEY(from_location_id) REFERENCES inventory_locations(id),
      FOREIGN KEY(to_location_id) REFERENCES inventory_locations(id)
    )`,
    
    // Таблица контрактов с поставщиками
    `CREATE TABLE IF NOT EXISTS inventory_contracts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contract_number TEXT NOT NULL UNIQUE,
      supplier_id INTEGER NOT NULL,
      description TEXT,
      start_date DATE NOT NULL,
      end_date DATE,
      status TEXT DEFAULT 'active',
      payment_terms TEXT,
      delivery_terms TEXT,
      incoterms TEXT,
      currency TEXT DEFAULT 'USD',
      total_value REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(supplier_id) REFERENCES suppliers(id)
    )`,
    
    // Таблица позиций контракта
    `CREATE TABLE IF NOT EXISTS inventory_contract_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contract_id INTEGER NOT NULL,
      item_id INTEGER NOT NULL,
      quantity REAL NOT NULL,
      unit_price REAL NOT NULL,
      total_price REAL,
      delivery_date DATE,
      status TEXT DEFAULT 'pending',
      FOREIGN KEY(contract_id) REFERENCES inventory_contracts(id),
      FOREIGN KEY(item_id) REFERENCES inventory_items(id)
    )`,
    
    // Таблица резервирования запасов под заказы
    `CREATE TABLE IF NOT EXISTS inventory_reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER NOT NULL,
      location_id INTEGER,
      quantity REAL NOT NULL,
      order_type TEXT NOT NULL,
      order_id INTEGER NOT NULL,
      reserved_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      expiry_date DATETIME,
      status TEXT DEFAULT 'active',
      notes TEXT,
      FOREIGN KEY(item_id) REFERENCES inventory_items(id),
      FOREIGN KEY(location_id) REFERENCES inventory_locations(id)
    )`,
    
    // Таблица для инвентаризации (пересчета)
    `CREATE TABLE IF NOT EXISTS inventory_counts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      count_reference TEXT NOT NULL UNIQUE,
      status TEXT DEFAULT 'draft',
      start_date DATETIME,
      end_date DATETIME,
      location_id INTEGER,
      performed_by TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(location_id) REFERENCES inventory_locations(id)
    )`,
    
    // Таблица позиций инвентаризации
    `CREATE TABLE IF NOT EXISTS inventory_count_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      count_id INTEGER NOT NULL,
      item_id INTEGER NOT NULL,
      location_id INTEGER NOT NULL,
      expected_quantity REAL,
      counted_quantity REAL,
      discrepancy REAL,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      FOREIGN KEY(count_id) REFERENCES inventory_counts(id),
      FOREIGN KEY(item_id) REFERENCES inventory_items(id),
      FOREIGN KEY(location_id) REFERENCES inventory_locations(id)
    )`,
    
    // Таблица списаний
    `CREATE TABLE IF NOT EXISTS inventory_writeoffs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      writeoff_reference TEXT NOT NULL UNIQUE,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      location_id INTEGER,
      reason TEXT,
      status TEXT DEFAULT 'draft',
      total_value REAL,
      approved_by TEXT,
      performed_by TEXT,
      notes TEXT,
      FOREIGN KEY(location_id) REFERENCES inventory_locations(id)
    )`,
    
    // Таблица позиций списания
    `CREATE TABLE IF NOT EXISTS inventory_writeoff_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      writeoff_id INTEGER NOT NULL,
      item_id INTEGER NOT NULL,
      quantity REAL NOT NULL,
      unit_price REAL,
      total_price REAL,
      reason TEXT,
      FOREIGN KEY(writeoff_id) REFERENCES inventory_writeoffs(id),
      FOREIGN KEY(item_id) REFERENCES inventory_items(id)
    )`
  ];

  // Выполняем запросы по созданию таблиц последовательно
  db.serialize(() => {
    createTableQueries.forEach(query => {
      db.run(query, (err) => {
        if (err) {
          console.error('Ошибка при создании таблицы инвентаря:', err.message);
        }
      });
    });
    
    console.log('Таблицы инвентаря успешно созданы');
    
    // Создаем базовые данные после создания таблиц
    createBasicInventoryData();
  });
}

// Функция для создания базовых данных инвентаря
function createBasicInventoryData() {
  // Добавляем базовые категории
  const categories = [
    ['Сырье', 'Сырьевые материалы для производства', null],
    ['Готовая продукция', 'Готовые товары для продажи', null],
    ['Полуфабрикаты', 'Промежуточные продукты', null],
    ['Запчасти', 'Запасные части для оборудования', null],
    ['Расходные материалы', 'Материалы для ежедневного использования', null]
  ];
  
  const insertCategoryStmt = db.prepare('INSERT OR IGNORE INTO inventory_categories (name, description, parent_id) VALUES (?, ?, ?)');
  categories.forEach(category => {
    insertCategoryStmt.run(category, (err) => {
      if (err) {
        console.error('Ошибка при добавлении категории:', err.message);
      }
    });
  });
  insertCategoryStmt.finalize();
  
  // Добавляем базовые единицы измерения
  const uoms = [
    ['EA', 'Штука', 'Единица товара', 1.0, null],
    ['KG', 'Килограмм', 'Вес в килограммах', 1.0, null],
    ['M', 'Метр', 'Длина в метрах', 1.0, null],
    ['L', 'Литр', 'Объем в литрах', 1.0, null],
    ['BOX', 'Коробка', 'Стандартная коробка', 1.0, null],
    ['PACK', 'Упаковка', 'Стандартная упаковка', 1.0, null],
    ['PCS', 'Штук', 'Количество в штуках', 1.0, null]
  ];
  
  const insertUomStmt = db.prepare('INSERT OR IGNORE INTO inventory_uom (code, name, description, conversion_factor, base_uom_id) VALUES (?, ?, ?, ?, ?)');
  uoms.forEach(uom => {
    insertUomStmt.run(uom, (err) => {
      if (err) {
        console.error('Ошибка при добавлении единицы измерения:', err.message);
      }
    });
  });
  insertUomStmt.finalize();
  
  // Добавляем базовые локации склада
  const locations = [
    ['MAIN', 'Главный склад', 'Основной склад для хранения всех товаров', null],
    ['PROD', 'Производство', 'Складская зона производства', null],
    ['SHIP', 'Отгрузка', 'Зона отгрузки товаров', null],
    ['QC', 'Контроль качества', 'Зона проверки качества', null],
    ['RET', 'Возвраты', 'Зона возвратов', null]
  ];
  
  const insertLocationStmt = db.prepare('INSERT OR IGNORE INTO inventory_locations (code, name, description, parent_id) VALUES (?, ?, ?, ?)');
  locations.forEach(location => {
    insertLocationStmt.run(location, (err) => {
      if (err) {
        console.error('Ошибка при добавлении локации:', err.message);
      }
    });
  });
  insertLocationStmt.finalize();
  
  console.log('Базовые данные инвентаря успешно созданы');
}

// API маршруты для инвентаря
app.get('/api/inventory/items', (req, res) => {
  const query = `
    SELECT i.*, c.name as category_name, u.name as uom_name, u.code as uom_code, s.name as supplier_name
    FROM inventory_items i
    LEFT JOIN inventory_categories c ON i.category_id = c.id
    LEFT JOIN inventory_uom u ON i.uom_id = u.id
    LEFT JOIN suppliers s ON i.supplier_id = s.id
    ORDER BY i.name
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Ошибка при получении списка товаров:', err.message);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    res.json(rows);
  });
});

app.get('/api/inventory/items/:id', (req, res) => {
  const itemId = req.params.id;
  
  // Запрос для получения полной информации о товаре
  const query = `
    SELECT 
      i.*,
      c.name as category_name,
      u.name as uom_name,
      s.name as supplier_name,
      (SELECT SUM(quantity) FROM inventory_stock WHERE item_id = i.id) as total_quantity
    FROM inventory_items i
    LEFT JOIN inventory_categories c ON i.category_id = c.id
    LEFT JOIN inventory_uom u ON i.uom_id = u.id
    LEFT JOIN suppliers s ON i.supplier_id = s.id
    WHERE i.id = ?
  `;
  
  db.get(query, [itemId], (err, item) => {
    if (err) {
      console.error('Ошибка при получении товара:', err.message);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    
    if (!item) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    res.json(item);
  });
});

app.post('/api/inventory/items', (req, res) => {
  const {
    code, name, description, category_id, uom_id, min_quantity,
    unit_price, currency, supplier_id, status, expiry_date
  } = req.body;
  
  const query = `
    INSERT INTO inventory_items (
      code, name, description, category_id, uom_id, min_quantity,
      unit_price, currency, supplier_id, status, expiry_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [
    code, name, description, category_id, uom_id, min_quantity,
    unit_price, currency, supplier_id, status, expiry_date
  ], function(err) {
    if (err) {
      console.error('Ошибка при создании товара:', err.message);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    
    // Получаем созданный товар
    db.get('SELECT * FROM inventory_items WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        console.error('Ошибка при получении созданного товара:', err.message);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
      
      res.status(201).json(row);
    });
  });
});

app.put('/api/inventory/items/:id', (req, res) => {
  const itemId = req.params.id;
  const {
    code, name, description, category_id, uom_id,
    min_quantity, unit_price, currency, supplier_id, status,
    image_url
  } = req.body;
  
  // Проверяем, существует ли товар
  db.get('SELECT id FROM inventory_items WHERE id = ?', [itemId], (err, item) => {
    if (err) {
      console.error('Ошибка при проверке товара:', err.message);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    
    if (!item) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    // Обновляем товар
    db.run(
      `UPDATE inventory_items SET 
        code = ?, name = ?, description = ?, category_id = ?,
        uom_id = ?, min_quantity = ?, unit_price = ?,
        currency = ?, supplier_id = ?, status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        code, name, description, category_id,
        uom_id, min_quantity, unit_price,
        currency, supplier_id, status,
        itemId
      ],
      function(err) {
        if (err) {
          console.error('Ошибка при обновлении товара:', err.message);
          return res.status(500).json({ error: 'Ошибка сервера' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Товар не найден или не изменен' });
        }
        
        // Получаем обновленный товар
        db.get('SELECT * FROM inventory_items WHERE id = ?', [itemId], (err, updatedItem) => {
          if (err) {
            console.error('Ошибка при получении обновленного товара:', err.message);
            return res.status(500).json({ error: 'Ошибка сервера' });
          }
          
          res.json(updatedItem);
        });
      }
    );
  });
});

app.delete('/api/inventory/items/:id', (req, res) => {
  const itemId = req.params.id;
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    // Проверяем, существует ли товар
    db.get('SELECT id FROM inventory_items WHERE id = ?', [itemId], (err, item) => {
      if (err) {
        db.run('ROLLBACK');
        console.error('Ошибка при проверке товара:', err.message);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
      
      if (!item) {
        db.run('ROLLBACK');
        return res.status(404).json({ error: 'Товар не найден' });
      }
      
      // Удаляем данные о запасах товара
      db.run('DELETE FROM inventory_stock WHERE item_id = ?', [itemId], (err) => {
        if (err) {
          db.run('ROLLBACK');
          console.error('Ошибка при удалении запасов товара:', err.message);
          return res.status(500).json({ error: 'Ошибка сервера' });
        }
        
        // Удаляем данные о резервировании товара
        db.run('DELETE FROM inventory_reservations WHERE item_id = ?', [itemId], (err) => {
          if (err) {
            db.run('ROLLBACK');
            console.error('Ошибка при удалении резервирований товара:', err.message);
            return res.status(500).json({ error: 'Ошибка сервера' });
          }
          
          // Удаляем сам товар
          db.run('DELETE FROM inventory_items WHERE id = ?', [itemId], function(err) {
            if (err) {
              db.run('ROLLBACK');
              console.error('Ошибка при удалении товара:', err.message);
              return res.status(500).json({ error: 'Ошибка сервера' });
            }
            
            if (this.changes === 0) {
              db.run('ROLLBACK');
              return res.status(404).json({ error: 'Товар не найден или уже удален' });
            }
            
            db.run('COMMIT');
            res.json({ message: 'Товар успешно удален', id: itemId });
          });
        });
      });
    });
  });
});

// Маршруты для работы с категориями
app.get('/api/inventory/categories', (req, res) => {
  db.all('SELECT * FROM inventory_categories ORDER BY name', [], (err, rows) => {
    if (err) {
      console.error('Ошибка при получении категорий:', err.message);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    
    res.json(rows);
  });
});

app.post('/api/inventory/categories', (req, res) => {
  const { name, description, parent_id } = req.body;
  
  db.run('INSERT INTO inventory_categories (name, description, parent_id) VALUES (?, ?, ?)',
    [name, description, parent_id], function(err) {
    if (err) {
      console.error('Ошибка при создании категории:', err.message);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    
    db.get('SELECT * FROM inventory_categories WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        console.error('Ошибка при получении созданной категории:', err.message);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
      
      res.status(201).json(row);
    });
  });
});

// Маршруты для работы с единицами измерения
app.get('/api/inventory/uom', (req, res) => {
  db.all('SELECT * FROM inventory_uom ORDER BY code', [], (err, rows) => {
    if (err) {
      console.error('Ошибка при получении единиц измерения:', err.message);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    
    res.json(rows);
  });
});

app.post('/api/inventory/uom', (req, res) => {
  const { code, name, description, conversion_factor, base_uom_id } = req.body;
  
  db.run(
    'INSERT INTO inventory_uom (code, name, description, conversion_factor, base_uom_id) VALUES (?, ?, ?, ?, ?)',
    [code, name, description, conversion_factor, base_uom_id], function(err) {
    if (err) {
      console.error('Ошибка при создании единицы измерения:', err.message);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    
    db.get('SELECT * FROM inventory_uom WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        console.error('Ошибка при получении созданной единицы измерения:', err.message);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
      
      res.status(201).json(row);
    });
  });
});

// Маршруты для работы с локациями
app.get('/api/inventory/locations', (req, res) => {
  db.all('SELECT * FROM inventory_locations ORDER BY name', [], (err, rows) => {
    if (err) {
      console.error('Ошибка при получении локаций:', err.message);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    
    res.json(rows);
  });
});

app.post('/api/inventory/locations', (req, res) => {
  const { code, name, description, parent_id, is_active } = req.body;
  
  db.run(
    'INSERT INTO inventory_locations (code, name, description, parent_id, is_active) VALUES (?, ?, ?, ?, ?)',
    [code, name, description, parent_id, is_active ? 1 : 0], function(err) {
    if (err) {
      console.error('Ошибка при создании локации:', err.message);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    
    db.get('SELECT * FROM inventory_locations WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        console.error('Ошибка при получении созданной локации:', err.message);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
      
      res.status(201).json(row);
    });
  });
});

// Маршруты для работы с запасами
app.get('/api/inventory/stock', (req, res) => {
  const query = `
    SELECT s.*, i.name as item_name, i.code as item_code, 
      l.name as location_name, l.code as location_code,
      u.code as uom_code
    FROM inventory_stock s
    JOIN inventory_items i ON s.item_id = i.id
    JOIN inventory_locations l ON s.location_id = l.id
    LEFT JOIN inventory_uom u ON i.uom_id = u.id
    ORDER BY i.name, l.name
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Ошибка при получении данных о запасах:', err.message);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    
    res.json(rows);
  });
});

app.post('/api/inventory/stock', (req, res) => {
  const { item_id, location_id, quantity, reserved_quantity } = req.body;
  
  // Проверяем, существуют ли уже запасы для этого товара и локации
  db.get(
    'SELECT id FROM inventory_stock WHERE item_id = ? AND location_id = ?',
    [item_id, location_id], (err, row) => {
    if (err) {
      console.error('Ошибка при проверке существующих запасов:', err.message);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    
    if (row) {
      // Обновляем существующие запасы
      db.run(
        `UPDATE inventory_stock 
         SET quantity = ?, reserved_quantity = ?, updated_at = CURRENT_TIMESTAMP
         WHERE item_id = ? AND location_id = ?`,
        [quantity, reserved_quantity, item_id, location_id], function(err) {
        if (err) {
          console.error('Ошибка при обновлении запасов:', err.message);
          return res.status(500).json({ error: 'Ошибка сервера' });
        }
        
        db.get('SELECT * FROM inventory_stock WHERE id = ?', [row.id], (err, updatedRow) => {
          if (err) {
            console.error('Ошибка при получении обновленных запасов:', err.message);
            return res.status(500).json({ error: 'Ошибка сервера' });
          }
          
          // Обновляем общее количество в таблице товаров
          updateItemTotalQuantity(item_id);
          
          res.json(updatedRow);
        });
      });
    } else {
      // Создаем новую запись о запасах
      db.run(
        `INSERT INTO inventory_stock (item_id, location_id, quantity, reserved_quantity)
         VALUES (?, ?, ?, ?)`,
        [item_id, location_id, quantity, reserved_quantity], function(err) {
        if (err) {
          console.error('Ошибка при создании запасов:', err.message);
          return res.status(500).json({ error: 'Ошибка сервера' });
        }
        
        db.get('SELECT * FROM inventory_stock WHERE id = ?', [this.lastID], (err, newRow) => {
          if (err) {
            console.error('Ошибка при получении созданных запасов:', err.message);
            return res.status(500).json({ error: 'Ошибка сервера' });
          }
          
          // Обновляем общее количество в таблице товаров
          updateItemTotalQuantity(item_id);
          
          res.status(201).json(newRow);
        });
      });
    }
  });
});

// Маршруты для движения запасов
app.post('/api/inventory/movements', (req, res) => {
  const {
    transaction_type, item_id, from_location_id, to_location_id,
    quantity, unit_price, document_reference, document_type,
    document_id, notes, performed_by
  } = req.body;
  
  // Проверка типа транзакции и необходимых параметров
  if (
    (transaction_type === 'transfer' && (!from_location_id || !to_location_id)) ||
    (transaction_type === 'receipt' && !to_location_id) ||
    (transaction_type === 'issue' && !from_location_id)
  ) {
    return res.status(400).json({ error: 'Недостаточно данных для выполнения операции' });
  }
  
  // Вычисляем общую стоимость
  const total_price = quantity * (unit_price || 0);
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    // Записываем движение в журнал
    const insertMovementQuery = `
      INSERT INTO inventory_movements (
        transaction_type, item_id, from_location_id, to_location_id,
        quantity, unit_price, total_price, document_reference,
        document_type, document_id, notes, performed_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(insertMovementQuery, [
      transaction_type, item_id, from_location_id, to_location_id,
      quantity, unit_price, total_price, document_reference,
      document_type, document_id, notes, performed_by
    ], function(err) {
      if (err) {
        db.run('ROLLBACK');
        console.error('Ошибка при создании движения:', err.message);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
      
      const movementId = this.lastID;
      
      // Обновляем запасы в зависимости от типа транзакции
      let updatePromises = [];
      
      if (transaction_type === 'receipt' || transaction_type === 'transfer') {
        // Увеличиваем запасы в пункте назначения
        updatePromises.push(updateStockQuantity(item_id, to_location_id, quantity));
      }
      
      if (transaction_type === 'issue' || transaction_type === 'transfer') {
        // Уменьшаем запасы в исходном пункте
        updatePromises.push(updateStockQuantity(item_id, from_location_id, -quantity));
      }
      
      // Выполняем все обновления и обрабатываем результаты
      Promise.all(updatePromises)
        .then(() => {
          // Обновляем общее количество в таблице товаров
          return updateItemTotalQuantity(item_id);
        })
        .then(() => {
          db.run('COMMIT');
          
          // Получаем созданное движение
          db.get('SELECT * FROM inventory_movements WHERE id = ?', [movementId], (err, row) => {
            if (err) {
              console.error('Ошибка при получении созданного движения:', err.message);
              return res.status(500).json({ error: 'Ошибка сервера' });
            }
            
            res.status(201).json(row);
          });
        })
        .catch(error => {
          db.run('ROLLBACK');
          console.error('Ошибка при обновлении запасов:', error);
          res.status(500).json({ error: 'Ошибка сервера' });
        });
    });
  });
});

app.get('/api/inventory/movements', (req, res) => {
  const query = `
    SELECT m.*, 
      i.name as item_name, i.code as item_code,
      fl.name as from_location_name, fl.code as from_location_code,
      tl.name as to_location_name, tl.code as to_location_code,
      u.code as uom_code
    FROM inventory_movements m
    JOIN inventory_items i ON m.item_id = i.id
    LEFT JOIN inventory_locations fl ON m.from_location_id = fl.id
    LEFT JOIN inventory_locations tl ON m.to_location_id = tl.id
    LEFT JOIN inventory_uom u ON i.uom_id = u.id
    ORDER BY m.transaction_date DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Ошибка при получении движений запасов:', err.message);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    
    res.json(rows);
  });
});

// Вспомогательные функции

// Функция для обновления количества запасов
function updateStockQuantity(item_id, location_id, quantity_change) {
  return new Promise((resolve, reject) => {
    // Проверяем, существуют ли уже запасы для этого товара и локации
    db.get(
      'SELECT id, quantity FROM inventory_stock WHERE item_id = ? AND location_id = ?',
      [item_id, location_id], (err, row) => {
      if (err) {
        return reject(err);
      }
      
      if (row) {
        // Обновляем существующие запасы
        const newQuantity = Math.max(0, row.quantity + quantity_change);
        db.run(
          `UPDATE inventory_stock 
           SET quantity = ?, updated_at = CURRENT_TIMESTAMP
           WHERE item_id = ? AND location_id = ?`,
          [newQuantity, item_id, location_id], function(err) {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      } else if (quantity_change > 0) {
        // Создаем новую запись о запасах, если добавляем запасы
        db.run(
          `INSERT INTO inventory_stock (item_id, location_id, quantity)
           VALUES (?, ?, ?)`,
          [item_id, location_id, quantity_change], function(err) {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      } else {
        // Если пытаемся уменьшить несуществующие запасы
        return reject(new Error('Невозможно уменьшить запасы, которых не существует'));
      }
    });
  });
}

// Функция для обновления общего количества товара
function updateItemTotalQuantity(item_id) {
  return new Promise((resolve, reject) => {
    // Получаем сумму всех запасов товара по всем локациям
    db.get(
      'SELECT SUM(quantity) as total FROM inventory_stock WHERE item_id = ?',
      [item_id], (err, row) => {
      if (err) {
        return reject(err);
      }
      
      const totalQuantity = row.total || 0;
      
      // Обновляем общее количество в таблице товаров
      db.run(
        `UPDATE inventory_items 
         SET current_quantity = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [totalQuantity, item_id], function(err) {
        if (err) {
          return reject(err);
        }
        
        // Проверяем, не ниже ли текущее количество минимального уровня
        db.get(
          'SELECT current_quantity, min_quantity, name FROM inventory_items WHERE id = ?',
          [item_id], (err, itemData) => {
          if (err) {
            return reject(err);
          }
          
          if (itemData) {
            // Если количество ниже минимального уровня, отправляем уведомление
            if (itemData.current_quantity < itemData.min_quantity) {
              console.log(`ОПОВЕЩЕНИЕ: Товар "${itemData.name}" (ID: ${item_id}) ниже минимального уровня запасов! Текущее количество: ${itemData.current_quantity}, минимальное: ${itemData.min_quantity}`);
              // В реальной системе здесь можно было бы отправить уведомление или создать задачу
            }
          }
          
          resolve();
        });
      });
    });
  });
}

// Маршруты для резервирования запасов
app.post('/api/inventory/reservations', (req, res) => {
  const {
    item_id, location_id, quantity, order_type,
    order_id, expiry_date, notes
  } = req.body;
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    // Проверяем наличие достаточного количества
    db.get(
      `SELECT quantity, reserved_quantity
       FROM inventory_stock
       WHERE item_id = ? AND location_id = ?`,
      [item_id, location_id], (err, stock) => {
      if (err) {
        db.run('ROLLBACK');
        console.error('Ошибка при проверке запасов:', err.message);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
      
      if (!stock) {
        db.run('ROLLBACK');
        return res.status(400).json({ error: 'Запасы не найдены в указанной локации' });
      }
      
      const availableForReservation = stock.quantity - (stock.reserved_quantity || 0);
      
      if (availableForReservation < quantity) {
        db.run('ROLLBACK');
        return res.status(400).json({ error: 'Недостаточно запасов для резервирования' });
      }
      
      // Создаем резервирование
      db.run(
        `INSERT INTO inventory_reservations (
          item_id, location_id, quantity, order_type,
          order_id, expiry_date, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [item_id, location_id, quantity, order_type, order_id, expiry_date, notes],
        function(err) {
        if (err) {
          db.run('ROLLBACK');
          console.error('Ошибка при создании резервирования:', err.message);
          return res.status(500).json({ error: 'Ошибка сервера' });
        }
        
        const reservationId = this.lastID;
        
        // Обновляем зарезервированное количество
        db.run(
          `UPDATE inventory_stock
           SET reserved_quantity = COALESCE(reserved_quantity, 0) + ?,
               updated_at = CURRENT_TIMESTAMP
           WHERE item_id = ? AND location_id = ?`,
          [quantity, item_id, location_id], function(err) {
          if (err) {
            db.run('ROLLBACK');
            console.error('Ошибка при обновлении зарезервированного количества:', err.message);
            return res.status(500).json({ error: 'Ошибка сервера' });
          }
          
          db.run('COMMIT');
          
          // Получаем созданное резервирование
          db.get('SELECT * FROM inventory_reservations WHERE id = ?', [reservationId], (err, row) => {
            if (err) {
              console.error('Ошибка при получении созданного резервирования:', err.message);
              return res.status(500).json({ error: 'Ошибка сервера' });
            }
            
            res.status(201).json(row);
          });
        });
      });
    });
  });
});

app.get('/api/inventory/reservations', (req, res) => {
  const query = `
    SELECT r.*, 
      i.name as item_name, i.code as item_code,
      l.name as location_name, l.code as location_code,
      u.code as uom_code
    FROM inventory_reservations r
    JOIN inventory_items i ON r.item_id = i.id
    LEFT JOIN inventory_locations l ON r.location_id = l.id
    LEFT JOIN inventory_uom u ON i.uom_id = u.id
    ORDER BY r.reserved_date DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Ошибка при получении данных о резервировании:', err.message);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    
    res.json(rows);
  });
});

// Маршруты для контрактов на закупку
app.get('/api/inventory/contracts', (req, res) => {
  const query = `
    SELECT c.*, s.name as supplier_name
    FROM inventory_contracts c
    JOIN suppliers s ON c.supplier_id = s.id
    ORDER BY c.start_date DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Ошибка при получении контрактов:', err.message);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    
    res.json(rows);
  });
});

app.post('/api/inventory/contracts', (req, res) => {
  const {
    contract_number, supplier_id, description, start_date,
    end_date, status, payment_terms, delivery_terms,
    incoterms, currency, total_value, items
  } = req.body;
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    // Создаем контракт
    db.run(
      `INSERT INTO inventory_contracts (
        contract_number, supplier_id, description, start_date,
        end_date, status, payment_terms, delivery_terms,
        incoterms, currency, total_value
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        contract_number, supplier_id, description, start_date,
        end_date, status, payment_terms, delivery_terms,
        incoterms, currency, total_value
      ],
      function(err) {
      if (err) {
        db.run('ROLLBACK');
        console.error('Ошибка при создании контракта:', err.message);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
      
      const contractId = this.lastID;
      
      // Если позиции контракта не переданы, завершаем транзакцию
      if (!items || items.length === 0) {
        db.run('COMMIT');
        
        // Получаем созданный контракт
        db.get('SELECT * FROM inventory_contracts WHERE id = ?', [contractId], (err, row) => {
          if (err) {
            console.error('Ошибка при получении созданного контракта:', err.message);
            return res.status(500).json({ error: 'Ошибка сервера' });
          }
          
          res.status(201).json(row);
        });
        
        return;
      }
      
      // Добавляем позиции контракта
      const insertItemPromises = items.map(item => {
        return new Promise((resolve, reject) => {
          const totalPrice = item.quantity * item.unit_price;
          
          db.run(
            `INSERT INTO inventory_contract_items (
              contract_id, item_id, quantity, unit_price,
              total_price, delivery_date, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              contractId, item.item_id, item.quantity,
              item.unit_price, totalPrice,
              item.delivery_date, item.status || 'pending'
            ],
            function(err) {
            if (err) {
              return reject(err);
            }
            
            resolve();
          });
        });
      });
      
      // Выполняем все вставки позиций
      Promise.all(insertItemPromises)
        .then(() => {
          db.run('COMMIT');
          
          // Получаем созданный контракт
          db.get('SELECT * FROM inventory_contracts WHERE id = ?', [contractId], (err, row) => {
            if (err) {
              console.error('Ошибка при получении созданного контракта:', err.message);
              return res.status(500).json({ error: 'Ошибка сервера' });
            }
            
            res.status(201).json(row);
          });
        })
        .catch(error => {
          db.run('ROLLBACK');
          console.error('Ошибка при добавлении позиций контракта:', error);
          res.status(500).json({ error: 'Ошибка сервера' });
        });
    });
  });
});

app.get('/api/inventory/contracts/:id/items', (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT ci.*, i.name as item_name, i.code as item_code,
      u.code as uom_code
    FROM inventory_contract_items ci
    JOIN inventory_items i ON ci.item_id = i.id
    LEFT JOIN inventory_uom u ON i.uom_id = u.id
    WHERE ci.contract_id = ?
    ORDER BY ci.id
  `;
  
  db.all(query, [id], (err, rows) => {
    if (err) {
      console.error('Ошибка при получении позиций контракта:', err.message);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    
    res.json(rows);
  });
});

// Добавляем API для получения информации для Dashboard инвентаря
app.get('/api/inventory/dashboard', (req, res) => {
  db.serialize(() => {
    const dashboardData = {
      totalItems: 0,
      lowStockItems: 0,
      totalValue: 0,
      recentMovements: []
    };
    
    // Получаем общее количество товаров
    db.get('SELECT COUNT(*) as count FROM inventory_items', [], (err, row) => {
      if (err) {
        console.error('Ошибка при получении общего количества товаров:', err.message);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
      
      dashboardData.totalItems = row.count;
      
      // Получаем количество товаров с низким запасом
      db.get(
        'SELECT COUNT(*) as count FROM inventory_items WHERE current_quantity <= min_quantity AND min_quantity > 0',
        [], (err, row) => {
        if (err) {
          console.error('Ошибка при получении количества товаров с низким запасом:', err.message);
          return res.status(500).json({ error: 'Ошибка сервера' });
        }
        
        dashboardData.lowStockItems = row.count;
        
        // Получаем общую стоимость запасов
        db.get(
          'SELECT SUM(current_quantity * unit_price) as total FROM inventory_items',
          [], (err, row) => {
          if (err) {
            console.error('Ошибка при получении общей стоимости запасов:', err.message);
            return res.status(500).json({ error: 'Ошибка сервера' });
          }
          
          dashboardData.totalValue = row.total || 0;
          
          // Получаем последние движения запасов
          db.all(
            `SELECT m.*, i.name as item_name, i.code as item_code,
              fl.name as from_location_name, tl.name as to_location_name
             FROM inventory_movements m
             JOIN inventory_items i ON m.item_id = i.id
             LEFT JOIN inventory_locations fl ON m.from_location_id = fl.id
             LEFT JOIN inventory_locations tl ON m.to_location_id = tl.id
             ORDER BY m.transaction_date DESC LIMIT 5`,
            [], (err, rows) => {
            if (err) {
              console.error('Ошибка при получении последних движений запасов:', err.message);
              return res.status(500).json({ error: 'Ошибка сервера' });
            }
            
            dashboardData.recentMovements = rows;
            
            res.json(dashboardData);
          });
        });
      });
    });
  });
});

// API для работы с поставщиками (для корректной работы форм инвентаря)
app.get('/api/suppliers', (req, res) => {
  db.all('SELECT * FROM suppliers ORDER BY name', [], (err, rows) => {
    if (err) {
      console.error('Ошибка при получении поставщиков:', err.message);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    
    res.json(rows);
  });
});

// Маршрут для получения данных о запасах товара в разных локациях
app.get('/api/inventory/stock/:id', (req, res) => {
  const itemId = req.params.id;
  
  const query = `
    SELECT 
      s.*,
      l.name as location_name,
      l.code as location_code
    FROM inventory_stock s
    JOIN inventory_locations l ON s.location_id = l.id
    WHERE s.item_id = ?
  `;
  
  db.all(query, [itemId], (err, stocks) => {
    if (err) {
      console.error('Ошибка при получении данных о запасах:', err.message);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    
    res.json(stocks);
  });
});

// Маршрут для обслуживания всех HTML страниц
app.get('*.html', (req, res) => {
  const filePath = path.join(__dirname, 'public', req.path);
  res.sendFile(filePath);
});

// Обработка других маршрутов (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API для получения данных стоимости инвентаря по категориям для графика
app.get('/api/inventory/statistics/value-by-category', (req, res) => {
  const query = `
    SELECT 
      c.id as category_id,
      c.name as category_name,
      SUM(i.current_quantity * i.unit_price) as total_value
    FROM 
      inventory_items i
    JOIN 
      inventory_categories c ON i.category_id = c.id
    GROUP BY 
      c.id, c.name
    ORDER BY 
      total_value DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Ошибка при получении данных стоимости инвентаря по категориям:', err.message);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    
    res.json(rows);
  });
});

// API для получения данных оборачиваемости запасов для графика
app.get('/api/inventory/statistics/turnover-rate', (req, res) => {
  // Получаем последние 6 месяцев
  const months = [];
  const turnoverData = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleString('default', { month: 'short' });
    months.push(monthName);
    
    // Рассчитываем примерный коэффициент оборачиваемости на основе движений
    // В реальной системе здесь был бы сложный расчет на основе затрат на проданные товары и среднего запаса
    const turnoverRate = (Math.random() * 2 + 2).toFixed(1); // Случайное число от 2.0 до 4.0
    turnoverData.push(turnoverRate);
  }
  
  // В будущем можно заменить на реальные данные из базы, например:
  /*
  const query = `
    SELECT 
      strftime('%m-%Y', transaction_date) as month,
      SUM(CASE WHEN transaction_type = 'out' THEN quantity * unit_price ELSE 0 END) as cogs,
      AVG(inventory_value) as avg_inventory
    FROM 
      inventory_movements m
    JOIN 
      inventory_monthly_value v ON strftime('%m-%Y', m.transaction_date) = v.month
    WHERE 
      m.transaction_date >= date('now', '-6 months')
    GROUP BY 
      strftime('%m-%Y', transaction_date)
    ORDER BY 
      m.transaction_date
  `;
  */
  
  res.json({
    labels: months,
    data: turnoverData
  });
});

// Функция для создания тестовых данных инвентаря
function createSampleInventoryData() {
  console.log('Создание тестовых данных инвентаря...');
  
  // Проверяем, есть ли уже тестовые данные
  db.get('SELECT COUNT(*) as count FROM inventory_items', [], (err, row) => {
    if (err) {
      console.error('Ошибка при проверке существующих товаров:', err.message);
      return;
    }
    
    // Если товары уже существуют, не добавляем новые
    if (row.count > 0) {
      console.log(`В базе данных уже есть ${row.count} товаров. Пропускаем создание тестовых данных.`);
      return;
    }
    
    // Массив тестовых товаров
    const sampleItems = [
      {
        code: 'RM001',
        name: 'Алюминиевый профиль',
        description: 'Алюминиевый профиль 20x20 мм',
        category_id: 1, // Сырье
        uom_id: 3, // Метр
        min_quantity: 100,
        current_quantity: 250,
        unit_price: 350,
        currency: 'RUB',
        supplier_id: 1,
        status: 'active'
      },
      {
        code: 'FG001',
        name: 'Стол рабочий',
        description: 'Стандартный рабочий стол 120x60 см',
        category_id: 2, // Готовая продукция
        uom_id: 1, // Штука
        min_quantity: 10,
        current_quantity: 25,
        unit_price: 12500,
        currency: 'RUB',
        supplier_id: null,
        status: 'active'
      },
      {
        code: 'SP001',
        name: 'Крепежные винты',
        description: 'Стандартные крепежные винты 5 мм',
        category_id: 4, // Запчасти
        uom_id: 7, // Штук
        min_quantity: 1000,
        current_quantity: 5000,
        unit_price: 2.5,
        currency: 'RUB',
        supplier_id: 2,
        status: 'active'
      },
      {
        code: 'CM001',
        name: 'Упаковочная бумага',
        description: 'Стандартная упаковочная бумага для продукции',
        category_id: 5, // Расходные материалы
        uom_id: 2, // Килограмм
        min_quantity: 50,
        current_quantity: 120,
        unit_price: 180,
        currency: 'RUB',
        supplier_id: 3,
        status: 'active'
      }
    ];
    
    // Добавляем товары в базу данных
    const insertItemStmt = db.prepare(`
      INSERT INTO inventory_items (
        code, name, description, category_id, uom_id,
        min_quantity, current_quantity, unit_price, currency,
        supplier_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    sampleItems.forEach(item => {
      insertItemStmt.run(
        item.code, item.name, item.description, item.category_id, item.uom_id,
        item.min_quantity, item.current_quantity, item.unit_price, item.currency,
        item.supplier_id, item.status,
        function(err) {
          if (err) {
            console.error(`Ошибка при добавлении товара ${item.name}:`, err.message);
          } else {
            const itemId = this.lastID;
            
            // Добавляем записи о запасах на складе
            db.run(`
              INSERT INTO inventory_stock (
                item_id, location_id, quantity
              ) VALUES (?, ?, ?)
            `, [itemId, 1, item.current_quantity], (err) => {
              if (err) {
                console.error(`Ошибка при добавлении запасов для товара ${item.name}:`, err.message);
              }
            });
          }
        }
      );
    });
    
    insertItemStmt.finalize();
    console.log('Тестовые данные инвентаря успешно созданы');
  });
}

// Создаем тестовые данные после инициализации сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Откройте http://localhost:${PORT} для доступа к приложению`);
  
  // Создаем тестовые данные
  setTimeout(() => {
    createSampleInventoryData();
  }, 1000);
});
