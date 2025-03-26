const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const fs = require('fs');

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
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Database setup
const db = new sqlite3.Database('./erp.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create necessary tables if they don't exist
db.serialize(() => {
  // Drop tables if they exist
  db.run("DROP TABLE IF EXISTS transactions");
  db.run("DROP TABLE IF EXISTS low_stock_alerts");
  db.run("DROP TABLE IF EXISTS sale_items");
  db.run("DROP TABLE IF EXISTS sales");
  db.run("DROP TABLE IF EXISTS clients");
  db.run("DROP TABLE IF EXISTS supplier_product_prices");
  db.run("DROP TABLE IF EXISTS supplier_order_items");
  db.run("DROP TABLE IF EXISTS supplier_orders");
  db.run("DROP TABLE IF EXISTS bill_items");
  db.run("DROP TABLE IF EXISTS bills");
  db.run("DROP TABLE IF EXISTS payments");
  db.run("DROP TABLE IF EXISTS invoices");
  db.run("DROP TABLE IF EXISTS invoice_items");
  db.run("DROP TABLE IF EXISTS customer_orders");
  db.run("DROP TABLE IF EXISTS order_items");
  db.run("DROP TABLE IF EXISTS products");
  db.run("DROP TABLE IF EXISTS suppliers");
  db.run("DROP TABLE IF EXISTS users");

  // Create suppliers table
  db.run(`CREATE TABLE suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    payment_terms TEXT
  )`, (err) => {
    if (err) {
      console.error('Error creating suppliers table:', err.message);
    } else {
      console.log('Suppliers table created successfully');
      
      // Insert a test supplier
      const testSupplier = {
        name: 'Test Supplier',
        contact_person: 'John Doe',
        email: 'john@test.com',
        phone: '123-456-7890',
        address: '123 Test St',
        payment_terms: 'Net 30'
      };
      
      db.run(`INSERT INTO suppliers (name, contact_person, email, phone, address, payment_terms) 
              VALUES (?, ?, ?, ?, ?, ?)`,
        [testSupplier.name, testSupplier.contact_person, testSupplier.email, testSupplier.phone, testSupplier.address, testSupplier.payment_terms],
        function(err) {
          if (err) {
            console.error('Error inserting test supplier:', err.message);
          } else {
            console.log('Test supplier inserted successfully');
          }
        }
      );
    }
  });

  // Create products table with price column
  db.run(`CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    current_stock INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    supplier_id INTEGER,
    price REAL DEFAULT 0.0,
    unit_price REAL DEFAULT 0.0,
    FOREIGN KEY(supplier_id) REFERENCES suppliers(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating products table:', err.message);
    } else {
      console.log('Products table created successfully');
      
      // Insert test products
      const testProducts = [
        {
          name: 'Test Product 1',
          description: 'This is a test product',
          current_stock: 100,
          min_stock_level: 20,
          supplier_id: 1,
          price: 19.99,
          unit_price: 15.99
        },
        {
          name: 'Test Product 2',
          description: 'Another test product',
          current_stock: 50,
          min_stock_level: 10,
          supplier_id: 1,
          price: 29.99,
          unit_price: 24.99
        }
      ];
      
      const insertProductStmt = db.prepare(`INSERT INTO products 
        (name, description, price, unit_price, current_stock, min_stock_level, supplier_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`);
      
      testProducts.forEach(function(product) {
        insertProductStmt.run(
          product.name,
          product.description,
          product.price,
          product.unit_price,
          product.current_stock,
          product.min_stock_level,
          product.supplier_id,
          function(err) {
            if (err) {
              console.error('Error inserting test product:', err.message);
            } else {
              console.log(`Test product "${product.name}" inserted successfully with ID ${this.lastID}`);
            }
          }
        );
      });
      
      insertProductStmt.finalize();
    }
  });
  
  // Create transactions table
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    transaction_type TEXT,
    unit_price REAL,
    total_price REAL,
    transaction_date TEXT,
    notes TEXT,
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating transactions table:', err.message);
    } else {
      console.log('Transactions table created successfully');
    }
  });
  
  // Create low stock alerts table
  db.run(`CREATE TABLE low_stock_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    alert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active',
    current_stock INTEGER,
    min_stock_level INTEGER,
    best_supplier_id INTEGER,
    best_supplier_price REAL,
    FOREIGN KEY(product_id) REFERENCES products(id),
    FOREIGN KEY(best_supplier_id) REFERENCES suppliers(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating low_stock_alerts table:', err.message);
    } else {
      console.log('Low stock alerts table created successfully');
    }
  });

  // Create users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT
  )`, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table created successfully');
    }
  });

  // Create clients table
  db.run(`CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT
  )`, (err) => {
    if (err) {
      console.error('Error creating clients table:', err.message);
    } else {
      console.log('Clients table created successfully');
      
      // Insert test client
      db.run(`INSERT INTO clients (name, contact_person, email, phone, address) 
              VALUES ('Test Client', 'John Doe', 'test@example.com', '123-456-7890', '123 Test St')`, 
              function(err) {
        if (err) {
          console.error('Error inserting test client:', err.message);
        } else {
          console.log('Test client inserted successfully');
        }
      });
    }
  });

  // Create sales table
  db.run(`CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    sale_date TEXT,
    total_amount REAL,
    status TEXT,
    notes TEXT,
    FOREIGN KEY(client_id) REFERENCES clients(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating sales table:', err.message);
    } else {
      console.log('Sales table created successfully');
    }
  });

  // Create sale_items table
  db.run(`CREATE TABLE IF NOT EXISTS sale_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    unit_price REAL,
    total_price REAL,
    FOREIGN KEY(sale_id) REFERENCES sales(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating sale_items table:', err.message);
    } else {
      console.log('Sale_items table created successfully');
    }
  });

  // Create supplier_product_prices table
  db.run(`CREATE TABLE IF NOT EXISTS supplier_product_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER,
    product_id INTEGER,
    unit_price REAL,
    last_updated TEXT,
    FOREIGN KEY(supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating supplier_product_prices table:', err.message);
    } else {
      console.log('Supplier_product_prices table created successfully');
    }
  });

  // Create supplier_orders table
  db.run(`CREATE TABLE IF NOT EXISTS supplier_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER,
    order_date TEXT,
    expected_delivery_date TEXT,
    total_amount REAL DEFAULT 0,
    status TEXT DEFAULT 'pending',
    purchase_order_number TEXT,
    notes TEXT,
    FOREIGN KEY(supplier_id) REFERENCES suppliers(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating supplier_orders table:', err.message);
    } else {
      console.log('Supplier_orders table created successfully');
    }
  });

  // Create supplier_order_items table
  db.run(`CREATE TABLE IF NOT EXISTS supplier_order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    cost_price REAL,
    total REAL,
    FOREIGN KEY(supplier_order_id) REFERENCES supplier_orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating supplier_order_items table:', err.message);
    } else {
      console.log('Supplier_order_items table created successfully');
    }
  });

  // Create order_items table
  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price REAL,
    discount_percent REAL DEFAULT 0,
    total REAL,
    FOREIGN KEY(order_id) REFERENCES supplier_orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating order_items table:', err.message);
    } else {
      console.log('Order_items table created successfully');
    }
  });

  // Create bills table
  db.run(`CREATE TABLE IF NOT EXISTS bills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bill_number TEXT,
    bill_date TEXT,
    due_date TEXT,
    reference_id INTEGER,
    reference_type TEXT,
    vendor_name TEXT,
    total_amount REAL,
    paid_amount REAL DEFAULT 0,
    status TEXT,
    FOREIGN KEY(reference_id) REFERENCES supplier_orders(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating bills table:', err.message);
    } else {
      console.log('Bills table created successfully');
    }
  });

  // Create bill_items table
  db.run(`CREATE TABLE IF NOT EXISTS bill_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bill_id INTEGER,
    description TEXT,
    quantity INTEGER,
    price REAL,
    total REAL,
    FOREIGN KEY(bill_id) REFERENCES bills(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating bill_items table:', err.message);
    } else {
      console.log('Bill_items table created successfully');
    }
  });

  // Create payments table
  db.run(`CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payment_date TEXT,
    amount REAL,
    payment_method TEXT,
    reference_type TEXT,
    reference_id INTEGER,
    notes TEXT,
    FOREIGN KEY(reference_id) REFERENCES bills(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating payments table:', err.message);
    } else {
      console.log('Payments table created successfully');
    }
  });

  // Create invoices table
  db.run(`CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number TEXT,
    invoice_date TEXT,
    due_date TEXT,
    order_id INTEGER,
    customer_name TEXT,
    total_amount REAL,
    paid_amount REAL DEFAULT 0,
    status TEXT,
    FOREIGN KEY(order_id) REFERENCES customer_orders(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating invoices table:', err.message);
    } else {
      console.log('Invoices table created successfully');
    }
  });

  // Create invoice_items table
  db.run(`CREATE TABLE IF NOT EXISTS invoice_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER,
    description TEXT,
    quantity INTEGER,
    price REAL,
    total REAL,
    FOREIGN KEY(invoice_id) REFERENCES invoices(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating invoice_items table:', err.message);
    } else {
      console.log('Invoice_items table created successfully');
    }
  });

  // Create customer_orders table
  db.run(`CREATE TABLE IF NOT EXISTS customer_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT,
    total_amount REAL,
    invoice_number TEXT,
    shipping_address TEXT,
    notes TEXT
  )`, (err) => {
    if (err) {
      console.error('Error creating customer_orders table:', err.message);
    } else {
      console.log('Customer_orders table created successfully');
    }
  });

  // Create default admin user if not exists
  db.get('SELECT id FROM users WHERE username = ?', ['admin'], (err, row) => {
    if (err) {
      console.error('Error checking for admin user:', err.message);
    } else if (!row) {
      db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', 
        ['admin', 'admin123', 'admin'], 
        (err) => {
          if (err) {
            console.error('Error creating admin user:', err.message);
          } else {
            console.log('Default admin user created');
          }
        }
      );
    }
  });
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
}

// Routes
// Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    req.session.userId = user.id;
    res.json({ message: 'Login successful' });
  });
});

// Logout route
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Logout successful' });
  });
});

// Get current user
app.get('/api/user', isAuthenticated, (req, res) => {
  res.json({ user: req.session.user });
});

// Products routes
app.get('/api/products', isAuthenticated, (req, res) => {
  db.all('SELECT p.*, s.name as supplier_name FROM products p LEFT JOIN suppliers s ON p.supplier_id = s.id', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ products: rows });
  });
});

app.get('/api/products/:id', isAuthenticated, (req, res) => {
  db.get('SELECT p.*, s.name as supplier_name FROM products p LEFT JOIN suppliers s ON p.supplier_id = s.id WHERE p.id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product: row });
  });
});

app.post('/api/products', isAuthenticated, (req, res) => {
  console.log('POST /api/products called with data:', req.body);
  
  const { name, description, price, cost_price, current_stock, min_level, supplier_id } = req.body;
  
  // Convert to numbers if they're strings
  const numericPrice = Number(price);
  const numericCostPrice = Number(cost_price);
  const numericCurrentStock = Number(current_stock);
  const numericMinLevel = Number(min_level);
  
  console.log('Numeric Price:', numericPrice);
  console.log('Numeric Cost Price:', numericCostPrice);
  
  const sql = `INSERT INTO products (name, description, price, unit_price, current_stock, min_stock_level, supplier_id) 
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [name, description, numericPrice, numericCostPrice, numericCurrentStock, numericMinLevel, supplier_id], function(err) {
    if (err) {
      console.error('Error creating product:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    console.log('Created product with ID:', this.lastID);
    
    // Add transaction for initial stock
    if (numericCurrentStock > 0) {
      const transactionSql = `INSERT INTO transactions 
                             (product_id, quantity, transaction_type, unit_price, total_price, notes) 
                             VALUES (?, ?, ?, ?, ?, ?)`;
      
      db.run(transactionSql, [
        this.lastID, 
        numericCurrentStock, 
        'Initial Stock', 
        numericCostPrice, 
        numericCostPrice * numericCurrentStock,
        'Initial inventory'
      ], function(err) {
        if (err) {
          console.error('Error creating transaction:', err.message);
        } else {
          console.log('Created transaction for initial stock');
        }
      });
    }
    
    db.get('SELECT p.*, s.name as supplier_name FROM products p LEFT JOIN suppliers s ON p.supplier_id = s.id WHERE p.id = ?', [this.lastID], (err, row) => {
      if (err) {
        console.error('Error fetching new product:', err.message);
        return res.status(500).json({ error: err.message });
      }
      console.log('Fetched new product:', row);
      res.status(201).json({ 
        message: 'Product created successfully',
        product: row
      });
    });
  });
});

app.put('/api/products/:id', isAuthenticated, (req, res) => {
  const { name, description, price, cost_price, current_stock, min_level, supplier_id } = req.body;
  
  // First get the current stock
  db.get('SELECT current_stock FROM products WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const oldStock = row.current_stock;
    const stockDifference = current_stock - oldStock;
    
    // Update the product
    const sql = `UPDATE products SET name = ?, description = ?, price = ?, unit_price = ?, current_stock = ?, min_stock_level = ?, supplier_id = ? 
                WHERE id = ?`;
    
    db.run(sql, [name, description, price, cost_price, current_stock, min_level, supplier_id, req.params.id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Add transaction if stock has changed
      if (stockDifference !== 0) {
        const transactionType = stockDifference > 0 ? 'Stock Adjustment (Add)' : 'Stock Adjustment (Remove)';
        const transactionSql = `INSERT INTO transactions 
                               (product_id, quantity, transaction_type, unit_price, total_price, notes) 
                               VALUES (?, ?, ?, ?, ?, ?)`;
        
        db.run(transactionSql, [
          req.params.id, 
          stockDifference, 
          transactionType, 
          cost_price, 
          cost_price * Math.abs(stockDifference),
          'Stock manually adjusted'
        ]);
      }
      
      db.get('SELECT p.*, s.name as supplier_name FROM products p LEFT JOIN suppliers s ON p.supplier_id = s.id WHERE p.id = ?', [req.params.id], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ 
          message: 'Product updated successfully',
          product: row
        });
      });
    });
  });
});

app.delete('/api/products/:id', isAuthenticated, (req, res) => {
  // Check if product is used in any order
  db.get('SELECT COUNT(*) as count FROM order_items WHERE product_id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (row.count > 0) {
      return res.status(400).json({ error: 'Cannot delete product as it is used in orders' });
    }
    
    // Check if product is used in any supplier order
    db.get('SELECT COUNT(*) as count FROM supplier_order_items WHERE product_id = ?', [req.params.id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (row.count > 0) {
        return res.status(400).json({ error: 'Cannot delete product as it is used in supplier orders' });
      }
      
      // Begin transaction
      db.run('BEGIN TRANSACTION');
      
      db.run('DELETE FROM transactions WHERE product_id = ?', [req.params.id], function(err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: err.message });
        }
        
        db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: err.message });
          }
          
          db.run('COMMIT');
          res.json({ message: 'Product deleted successfully' });
        });
      });
    });
  });
});

app.get('/api/products/low-stock', isAuthenticated, (req, res) => {
  db.all('SELECT p.*, s.name as supplier_name FROM products p LEFT JOIN suppliers s ON p.supplier_id = s.id WHERE p.current_stock <= p.min_stock_level', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ products: rows });
  });
});

// Suppliers routes
app.get('/api/suppliers', isAuthenticated, (req, res) => {
  console.log('GET /api/suppliers called');
  
  db.all('SELECT * FROM suppliers', [], (err, rows) => {
    if (err) {
      console.error('Error fetching suppliers:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log('Fetched suppliers:', rows);
    res.json({ suppliers: rows });
  });
});

app.get('/api/suppliers/:id', isAuthenticated, (req, res) => {
  db.get('SELECT * FROM suppliers WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json({ supplier: row });
  });
});

app.post('/api/suppliers', isAuthenticated, (req, res) => {
  console.log('POST /api/suppliers called with data:', req.body);
  
  const { name, contact_person, email, phone, address, payment_terms } = req.body;
  
  if (!name) {
    console.error('Supplier name is required');
    return res.status(400).json({ error: 'Supplier name is required' });
  }

  const sql = `INSERT INTO suppliers (name, contact_person, email, phone, address, payment_terms) 
               VALUES (?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [name, contact_person, email, phone, address, payment_terms], function(err) {
    if (err) {
      console.error('Error creating supplier:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    const newSupplierId = this.lastID;
    console.log('Created supplier with ID:', newSupplierId);
    
    db.get('SELECT * FROM suppliers WHERE id = ?', [newSupplierId], (err, row) => {
      if (err) {
        console.error('Error fetching new supplier:', err.message);
        return res.status(500).json({ error: err.message });
      }
      console.log('Fetched new supplier:', row);
      res.status(201).json({ 
        message: 'Supplier created successfully',
        supplier: row
      });
    });
  });
});

app.put('/api/suppliers/:id', isAuthenticated, (req, res) => {
  const { name, contact_person, email, phone, address, payment_terms } = req.body;
  
  const sql = `UPDATE suppliers SET name = ?, contact_person = ?, email = ?, phone = ?, address = ?, payment_terms = ? 
               WHERE id = ?`;
  
  db.run(sql, [name, contact_person, email, phone, address, payment_terms, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    db.get('SELECT * FROM suppliers WHERE id = ?', [req.params.id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ 
        message: 'Supplier updated successfully',
        supplier: row
      });
    });
  });
});

app.delete('/api/suppliers/:id', isAuthenticated, (req, res) => {
  // Check if supplier has products
  db.get('SELECT COUNT(*) as count FROM products WHERE supplier_id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (row.count > 0) {
      // Get the product names to provide a more informative error message
      db.all('SELECT name FROM products WHERE supplier_id = ?', [req.params.id], (err, products) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        const productNames = products.map(p => p.name).join(', ');
        return res.status(400).json({ 
          error: `Cannot delete supplier as they have products associated: ${productNames}. Please reassign or delete these products first.` 
        });
      });
      return;
    }
    
    // Check if supplier has orders
    db.get('SELECT COUNT(*) as count FROM supplier_orders WHERE supplier_id = ?', [req.params.id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (row.count > 0) {
        return res.status(400).json({ error: 'Cannot delete supplier as they have orders associated' });
      }
      
      // Begin transaction
      db.run('BEGIN TRANSACTION', (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        // Delete supplier
        db.run('DELETE FROM suppliers WHERE id = ?', [req.params.id], function(err) {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: err.message });
          }
          
          db.run('COMMIT');
          res.json({ message: 'Supplier deleted successfully' });
        });
      });
    });
  });
});

// Endpoint to reassign products from one supplier to another
app.post('/api/suppliers/:id/reassign', isAuthenticated, (req, res) => {
  const { new_supplier_id } = req.body;
  
  if (!new_supplier_id) {
    return res.status(400).json({ error: 'New supplier ID is required' });
  }
  
  // Check if new supplier exists
  db.get('SELECT * FROM suppliers WHERE id = ?', [new_supplier_id], (err, supplier) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!supplier) {
      return res.status(404).json({ error: 'New supplier not found' });
    }
    
    // Begin transaction
    db.run('BEGIN TRANSACTION', (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Update all products from old supplier to new supplier
      db.run('UPDATE products SET supplier_id = ? WHERE supplier_id = ?', 
        [new_supplier_id, req.params.id], 
        function(err) {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: err.message });
          }
          
          const updatedCount = this.changes;
          
          db.run('COMMIT');
          res.json({ 
            message: `Successfully reassigned ${updatedCount} products to new supplier`,
            updated_count: updatedCount
          });
        }
      );
    });
  });
});

// Customer Orders routes
app.get('/api/customer-orders', isAuthenticated, (req, res) => {
  db.all('SELECT * FROM customer_orders ORDER BY order_date DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ orders: rows });
  });
});

app.get('/api/customer-orders/:id', isAuthenticated, (req, res) => {
  db.get('SELECT * FROM customer_orders WHERE id = ?', [req.params.id], (err, order) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Get order items
    db.all(`
      SELECT oi.*, p.name as product_name 
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [req.params.id], (err, items) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Get invoice if exists
      db.get('SELECT * FROM invoices WHERE order_id = ?', [req.params.id], (err, invoice) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        res.json({ 
          order: {
            ...order,
            items: items,
            invoice: invoice || null
          }
        });
      });
    });
  });
});

app.post('/api/customer-orders', isAuthenticated, (req, res) => {
  const { customer_name, items, shipping_address, notes } = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must have at least one item' });
  }
  
  // Calculate total amount
  let totalAmount = 0;
  items.forEach(item => {
    const itemTotal = item.price * item.quantity * (1 - (item.discount_percent || 0) / 100);
    totalAmount += itemTotal;
  });
  
  // Generate invoice number
  const invoiceNumber = 'INV-' + Date.now();
  
  db.run('BEGIN TRANSACTION');
  
  // Create order
  db.run(
    'INSERT INTO customer_orders (customer_name, total_amount, invoice_number, shipping_address, notes) VALUES (?, ?, ?, ?, ?)',
    [customer_name, totalAmount, invoiceNumber, shipping_address, notes],
    function(err) {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: err.message });
      }
      
      const orderId = this.lastID;
      
      // Insert order items and update product stock
      const insertItemStmt = db.prepare(`
        INSERT INTO order_items (order_id, product_id, quantity, price, discount_percent, total) 
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      const updateStock = db.prepare('UPDATE products SET current_stock = current_stock - ? WHERE id = ?');
      const insertTransaction = db.prepare(`
        INSERT INTO transactions (product_id, quantity, transaction_type, unit_price, total_price, notes, transaction_date) VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      let hasError = false;
      
      items.forEach(function(item) {
        // Check if product exists and has enough stock
        db.get('SELECT current_stock FROM products WHERE id = ?', [item.product_id], (err, product) => {
          if (err || !product) {
            hasError = true;
            return;
          }
          
          if (product.current_stock < item.quantity) {
            hasError = true;
            return;
          }
          
          const itemTotal = item.price * item.quantity * (1 - (item.discount_percent || 0) / 100);
          
          // Insert order item
          insertItemStmt.run(
            orderId,
            item.product_id,
            item.quantity,
            item.price,
            item.discount_percent || 0,
            itemTotal,
            function(err) {
              if (err) {
                hasError = true;
                console.error('Error inserting order item:', err.message);
              }
            }
          );
          
          // Update product stock
          updateStock.run(item.quantity, item.product_id, function(err) {
            if (err) {
              hasError = true;
              console.error('Error updating product stock:', err.message);
            }
          });
          
          // Add transaction record
          insertTransaction.run(
            item.product_id,
            -item.quantity,
            'Sale',
            item.price,
            itemTotal,
            `Order #${orderId}`,
            new Date().toISOString(),
            function(err) {
              if (err) {
                hasError = true;
                console.error('Error inserting transaction:', err.message);
              }
            }
          );
        });
      });
      
      // Create invoice
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30); // Due in 30 days
      
      db.run(`
        INSERT INTO invoices (invoice_number, order_id, customer_name, total_amount, due_date)
        VALUES (?, ?, ?, ?, ?)
      `, [invoiceNumber, orderId, customer_name, totalAmount, dueDate.toISOString()], function(
        err) {
        if (err) {
          hasError = true;
          console.error('Error creating invoice:', err.message);
        }
        
        if (hasError) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: 'Failed to create order' });
        }
        
        db.run('COMMIT');
        res.json({ 
          message: 'Order created successfully',
          order: {
            id: orderId,
            customer_name: customer_name,
            total_amount: totalAmount,
            invoice_number: invoiceNumber,
            shipping_address: shipping_address,
            notes: notes,
            items: items
          }
        });
      });
    }
  );
});

// Supplier Orders routes
app.get('/api/supplier-orders', isAuthenticated, (req, res) => {
  db.all('SELECT o.*, s.name as supplier_name FROM supplier_orders o JOIN suppliers s ON o.supplier_id = s.id ORDER BY o.order_date DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ orders: rows });
  });
});

app.post('/api/supplier-orders', isAuthenticated, (req, res) => {
  const { supplier_id, items, notes } = req.body;
  const orderDate = new Date();
  const expectedDeliveryDate = new Date(orderDate);
  expectedDeliveryDate.setDate(orderDate.getDate() + 7); // Default 7 days delivery
  const purchaseOrderNumber = 'PO-' + Date.now();

  let totalAmount = 0;
  items.forEach(item => {
    totalAmount += item.cost_price * item.quantity;
  });

  db.run('BEGIN TRANSACTION');

  db.run(
    'INSERT INTO supplier_orders (supplier_id, order_date, expected_delivery_date, total_amount, purchase_order_number, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [supplier_id, orderDate.toISOString(), expectedDeliveryDate.toISOString(), totalAmount, purchaseOrderNumber, notes, 'pending'],
    function(err) {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: err.message });
      }

      const orderId = this.lastID;

      const insertItem = db.prepare(`
        INSERT INTO supplier_order_items (supplier_order_id, product_id, quantity, cost_price, total) 
        VALUES (?, ?, ?, ?, ?)
      `);

      items.forEach(function(item) {
        const itemTotal = item.cost_price * item.quantity;
        insertItem.run(orderId, item.product_id, item.quantity, item.cost_price, itemTotal);
      });

      insertItem.finalize();

      db.run('COMMIT');
      res.status(201).json({ message: 'Supplier order created successfully' });
    }
  );
});

// Invoices routes
app.get('/api/invoices', isAuthenticated, (req, res) => {
  db.all('SELECT * FROM invoices ORDER BY invoice_date DESC', [], (err, invoices) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Get all invoice items
    db.all('SELECT * FROM invoice_items', [], (err, allItems) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Group items by invoice_id
      const itemsByInvoice = {};
      allItems.forEach(item => {
        if (!itemsByInvoice[item.invoice_id]) {
          itemsByInvoice[item.invoice_id] = [];
        }
        itemsByInvoice[item.invoice_id].push(item);
      });
      
      // Add items to each invoice
      invoices.forEach(invoice => {
        invoice.items = itemsByInvoice[invoice.id] || [];
      });
      
      res.json({ invoices: invoices });
    });
  });
});

app.get('/api/invoices/:id', isAuthenticated, (req, res) => {
  db.get('SELECT * FROM invoices WHERE id = ?', [req.params.id], (err, invoice) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    // Get invoice items from order if order_id exists
    if (invoice.order_id) {
      db.all(`
        SELECT oi.*, p.name as product_name 
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [invoice.order_id], (err, items) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        invoice.items = items;
        res.json({ invoice });
      });
    } else {
      // If no order_id, return empty items array
      invoice.items = [];
      res.json({ invoice });
    }
  });
});

app.post('/api/invoices', isAuthenticated, (req, res) => {
  const { customer_name, invoice_date, due_date, order_id, notes, items } = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invoice must have at least one item' });
  }
  
  // Calculate total amount
  let totalAmount = 0;
  items.forEach(item => {
    totalAmount += item.price * item.quantity;
  });
  
  // Generate invoice number
  const invoiceNumber = 'INV-' + Date.now();
  
  db.run('BEGIN TRANSACTION');
  
  db.run(
    'INSERT INTO invoices (invoice_number, invoice_date, due_date, order_id, customer_name, total_amount, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [invoiceNumber, invoice_date, due_date, order_id || null, customer_name, totalAmount, notes],
    function(err) {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: err.message });
      }
      
      const invoiceId = this.lastID;
      
      // Insert invoice items
      const insertItemStmt = db.prepare('INSERT INTO invoice_items (invoice_id, description, quantity, price, total) VALUES (?, ?, ?, ?, ?)');
      
      let hasError = false;
      items.forEach(function(item) {
        const itemTotal = item.price * item.quantity;
        insertItemStmt.run(invoiceId, item.description, item.quantity, item.price, itemTotal, function(err) {
          if (err) {
            hasError = true;
            console.error('Error inserting invoice item:', err.message);
          }
        });
      });
      
      insertItemStmt.finalize();
      
      if (hasError) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: 'Error inserting invoice items' });
      }
      
      db.run('COMMIT');
      res.status(201).json({ 
        message: 'Invoice created successfully',
        invoice: {
          id: invoiceId,
          invoice_number: invoiceNumber,
          customer_name,
          total_amount: totalAmount,
          invoice_date,
          due_date,
          status: 'Unpaid',
          items: items
        }
      });
    }
  );
});

// Bills routes
app.get('/api/bills', isAuthenticated, (req, res) => {
  db.all('SELECT * FROM bills ORDER BY bill_date DESC', [], (err, bills) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Get all bill items
    db.all('SELECT * FROM bill_items', [], (err, allItems) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Group items by bill_id
      const itemsByBill = {};
      allItems.forEach(item => {
        if (!itemsByBill[item.bill_id]) {
          itemsByBill[item.bill_id] = [];
        }
        itemsByBill[item.bill_id].push(item);
      });
      
      // Add items to each bill
      bills.forEach(bill => {
        bill.items = itemsByBill[bill.id] || [];
      });
      
      res.json({ bills: bills });
    });
  });
});

app.get('/api/bills/:id', isAuthenticated, (req, res) => {
  db.get('SELECT * FROM bills WHERE id = ?', [req.params.id], (err, bill) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    
    // Get bill items from supplier order if reference exists
    if (bill.reference_id && bill.reference_type === 'supplier_order') {
      db.all(`
        SELECT soi.*, p.name as product_name 
        FROM supplier_order_items soi
        JOIN products p ON soi.product_id = p.id
        WHERE soi.supplier_order_id = ?
      `, [bill.reference_id], (err, items) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        bill.items = items;
        res.json({ bill });
      });
    } else {
      // If no reference, return empty items array
      bill.items = [];
      res.json({ bill });
    }
  });
});

app.post('/api/bills', isAuthenticated, (req, res) => {
  const { vendor_name, bill_date, due_date, supplier_order_id, notes, items } = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Bill must have at least one item' });
  }
  
  // Calculate total amount
  let totalAmount = 0;
  items.forEach(item => {
    totalAmount += item.price * item.quantity;
  });
  
  // Generate bill number
  const billNumber = 'BILL-' + Date.now();
  
  db.run('BEGIN TRANSACTION');
  
  db.run(
    'INSERT INTO bills (bill_number, bill_date, due_date, reference_id, reference_type, vendor_name, total_amount, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [billNumber, bill_date, due_date, supplier_order_id || null, supplier_order_id ? 'supplier_order' : null, vendor_name, totalAmount, notes],
    function(err) {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: err.message });
      }
      
      const billId = this.lastID;
      
      // Insert bill items
      const insertItemStmt = db.prepare('INSERT INTO bill_items (bill_id, description, quantity, price, total) VALUES (?, ?, ?, ?, ?)');
      
      let hasError = false;
      items.forEach(function(item) {
        const itemTotal = item.price * item.quantity;
        insertItemStmt.run(billId, item.description, item.quantity, item.price, itemTotal, function(err) {
          if (err) {
            hasError = true;
            console.error('Error inserting bill item:', err.message);
          }
        });
      });
      
      insertItemStmt.finalize();
      
      if (hasError) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: 'Error inserting bill items' });
      }
      
      db.run('COMMIT');
      res.status(201).json({ 
        message: 'Bill created successfully',
        bill: {
          id: billId,
          bill_number: billNumber,
          vendor_name,
          total_amount: totalAmount,
          bill_date,
          due_date,
          status: 'Unpaid',
          items: items
        }
      });
    }
  );
});

// Payments routes
app.get('/api/payments', isAuthenticated, (req, res) => {
  db.all('SELECT * FROM payments ORDER BY payment_date DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ payments: rows });
  });
});

app.get('/api/payments/:id', isAuthenticated, (req, res) => {
  db.get('SELECT * FROM payments WHERE id = ?', [req.params.id], (err, payment) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.json({ payment });
  });
});

app.post('/api/payments', isAuthenticated, (req, res) => {
  const { payment_date, amount, payment_method, reference_type, reference_id, notes } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Payment must have a valid amount' });
  }
  
  db.run('BEGIN TRANSACTION');
  
  db.run(
    'INSERT INTO payments (payment_date, amount, payment_method, reference_type, reference_id, notes) VALUES (?, ?, ?, ?, ?, ?)',
    [payment_date, amount, payment_method, reference_type, reference_id, notes],
    function(err) {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: err.message });
      }
      
      const paymentId = this.lastID;
      
      // Update the reference document (invoice or bill)
      if (reference_type === 'invoice' && reference_id) {
        db.get('SELECT * FROM invoices WHERE id = ?', [reference_id], (err, invoice) => {
          if (err || !invoice) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: 'Invalid invoice reference' });
          }
          
          const newPaidAmount = invoice.paid_amount + amount;
          const newStatus = newPaidAmount >= invoice.total_amount ? 'Paid' : 'Partially Paid';
          
          db.run(
            'UPDATE invoices SET paid_amount = ?, status = ? WHERE id = ?',
            [newPaidAmount, newStatus, reference_id],
            function(err) {
              if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: err.message });
              }
              
              db.run('COMMIT');
              res.status(201).json({ 
                message: 'Payment recorded successfully',
                payment: {
                  id: paymentId,
                  payment_date,
                  amount,
                  payment_method,
                  reference_type,
                  reference_id
                }
              });
            }
          );
        });
      } else if (reference_type === 'bill' && reference_id) {
        db.get('SELECT * FROM bills WHERE id = ?', [reference_id], (err, bill) => {
          if (err || !bill) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: 'Invalid bill reference' });
          }
          
          const newPaidAmount = bill.paid_amount + amount;
          const newStatus = newPaidAmount >= bill.total_amount ? 'Paid' : 'Partially Paid';
          
          db.run(
            'UPDATE bills SET paid_amount = ?, status = ? WHERE id = ?',
            [newPaidAmount, newStatus, reference_id],
            function(err) {
              if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: err.message });
              }
              
              db.run('COMMIT');
              res.status(201).json({ 
                message: 'Payment recorded successfully',
                payment: {
                  id: paymentId,
                  payment_date,
                  amount,
                  payment_method,
                  reference_type,
                  reference_id
                }
              });
            }
          );
        });
      } else {
        // Other payment types without reference
        db.run('COMMIT');
        res.status(201).json({ 
          message: 'Payment recorded successfully',
          payment: {
            id: paymentId,
            payment_date,
            amount,
            payment_method,
            reference_type,
            reference_id
          }
        });
      }
    }
  );
});

// Analytics route
app.get('/api/analytics', isAuthenticated, (req, res) => {
  const analyticsData = {};

  db.get('SELECT COUNT(*) as totalProducts FROM products', [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    analyticsData.totalProducts = row.totalProducts;

    db.get('SELECT COUNT(*) as totalSuppliers FROM suppliers', [], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      analyticsData.totalSuppliers = row.totalSuppliers;

      db.get('SELECT COUNT(*) as totalOrders FROM customer_orders', [], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        analyticsData.totalOrders = row.totalOrders;

        res.json({ analytics: analyticsData });
      });
    });
  });
});

// Dashboard data route
app.get('/api/dashboard', isAuthenticated, (req, res) => {
  const dashboardData = {};

  db.get('SELECT COUNT(*) as count FROM products', [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    dashboardData.totalProducts = row.count;

    db.get('SELECT COUNT(*) as count FROM products WHERE current_stock <= min_level', [], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      dashboardData.lowStockItems = row.count;

      db.get('SELECT COUNT(*) as count FROM suppliers', [], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        dashboardData.activeSuppliers = row.count;

        db.get('SELECT COUNT(*) as count FROM customer_orders WHERE status = "Pending"', [], (err, row) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          dashboardData.pendingOrders = row.count;

          res.json({ dashboard: dashboardData });
        });
      });
    });
  });
});

// Transactions route
app.get('/api/transactions', isAuthenticated, (req, res) => {
  db.all(`
    SELECT 
      t.id, 
      t.transaction_date, 
      t.transaction_type, 
      t.quantity, 
      p.name as product_name
    FROM transactions t
    JOIN products p ON t.product_id = p.id
    ORDER BY t.transaction_date DESC
    LIMIT 20
  `, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ transactions: rows });
  });
});

app.post('/api/transactions', isAuthenticated, (req, res) => {
  const { product_id, quantity, transaction_type, notes } = req.body;
  
  // Validate required fields
  if (!product_id || !quantity || !transaction_type) {
    return res.status(400).json({ error: 'Product, quantity, and transaction type are required' });
  }

  // Get product price for calculating total
  db.get('SELECT price FROM products WHERE id = ?', [product_id], (err, product) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const unit_price = product.price;
    const total_price = Math.abs(quantity) * unit_price;
    
    // Insert transaction
    db.run(`
      INSERT INTO transactions (product_id, quantity, transaction_type, unit_price, total_price, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [product_id, quantity, transaction_type, unit_price, total_price, notes], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Update product stock
      db.run(
        'UPDATE products SET current_stock = current_stock + ? WHERE id = ?',
        [quantity, product_id],
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          res.status(201).json({ 
            id: this.lastID,
            message: 'Transaction added successfully' 
          });
        }
      );
    });
  });
});

app.delete('/api/transactions/:id', isAuthenticated, (req, res) => {
  // First get the transaction details to update stock
  db.get('SELECT product_id, quantity FROM transactions WHERE id = ?', [req.params.id], (err, transaction) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    // Begin transaction
    db.run('BEGIN TRANSACTION', (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Update product stock (reverse the transaction)
      db.run(
        'UPDATE products SET current_stock = current_stock - ? WHERE id = ?',
        [transaction.quantity, transaction.product_id],
        function(err) {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: err.message });
          }
          
          // Delete the transaction
          db.run('DELETE FROM transactions WHERE id = ?', [req.params.id], function(err) {
            if (err) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: err.message });
            }
            
            db.run('COMMIT');
            res.json({ message: 'Transaction deleted successfully' });
          });
        }
      );
    });
  });
});

// Test endpoint for suppliers table
app.get('/api/test-suppliers', (req, res) => {
  db.all("PRAGMA table_info(suppliers)", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ columns: rows });
  });
});

// PDF generation endpoints
app.get('/api/purchase-orders/:id/pdf', isAuthenticated, (req, res) => {
  db.get('SELECT * FROM supplier_orders WHERE id = ?', [req.params.id], (err, order) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Get order items
    db.all(`
      SELECT soi.*, p.name as product_name 
      FROM supplier_order_items soi
      JOIN products p ON soi.product_id = p.id
      WHERE soi.supplier_order_id = ?
    `, [req.params.id], (err, items) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Generate PDF
      const pdf = new PDFDocument();
      
      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="purchase-order-${order.id}.pdf"`);
      
      // Pipe the PDF directly to the response
      pdf.pipe(res);
      
      pdf.fontSize(24).text('Purchase Order', 100, 100);
      pdf.fontSize(18).text(`Order #${order.purchase_order_number}`, 100, 150);
      pdf.fontSize(18).text(`Date: ${order.order_date}`, 100, 180);
      pdf.fontSize(18).text(`Supplier: ${order.supplier_name}`, 100, 210);
      
      pdf.fontSize(14).text('Items:', 100, 250);
      items.forEach((item, index) => {
        pdf.fontSize(14).text(`${item.product_name} x ${item.quantity}`, 100, 280 + (index * 30));
      });
      
      pdf.fontSize(18).text(`Total: ${order.total_amount}`, 100, 400);
      
      // Finalize the PDF and end the stream
      pdf.end();
    });
  });
});

app.get('/api/transactions/:id/pdf', isAuthenticated, (req, res) => {
  db.get('SELECT * FROM transactions WHERE id = ?', [req.params.id], (err, transaction) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    // Get product details
    db.get('SELECT * FROM products WHERE id = ?', [transaction.product_id], (err, product) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Generate PDF
      const pdf = new PDFDocument();
      
      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="transaction-${transaction.id}.pdf"`);
      
      // Pipe the PDF directly to the response
      pdf.pipe(res);
      
      pdf.fontSize(24).text('Transaction Receipt', 100, 100);
      pdf.fontSize(18).text(`Transaction #${transaction.id}`, 100, 150);
      pdf.fontSize(18).text(`Date: ${transaction.transaction_date}`, 100, 180);
      pdf.fontSize(18).text(`Product: ${product.name}`, 100, 210);
      pdf.fontSize(18).text(`Quantity: ${transaction.quantity}`, 100, 240);
      pdf.fontSize(18).text(`Unit Price: ${transaction.unit_price}`, 100, 270);
      pdf.fontSize(18).text(`Total: ${transaction.total_price}`, 100, 300);
      
      // Finalize the PDF and end the stream
      pdf.end();
    });
  });
});

// Clients routes
app.get('/api/clients', isAuthenticated, (req, res) => {
  db.all('SELECT * FROM clients', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ clients: rows });
  });
});

app.get('/api/clients/:id', isAuthenticated, (req, res) => {
  db.get('SELECT * FROM clients WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ client: row });
  });
});

app.post('/api/clients', isAuthenticated, (req, res) => {
  const { name, contact_person, email, phone, address } = req.body;
  
  const sql = `INSERT INTO clients (name, contact_person, email, phone, address) 
               VALUES (?, ?, ?, ?, ?)`;
  
  db.run(sql, [name, contact_person, email, phone, address], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    db.get('SELECT * FROM clients WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ 
        message: 'Client created successfully',
        client: row
      });
    });
  });
});

app.put('/api/clients/:id', isAuthenticated, (req, res) => {
  const { name, contact_person, email, phone, address } = req.body;
  
  const sql = `UPDATE clients SET name = ?, contact_person = ?, email = ?, phone = ?, address = ? 
               WHERE id = ?`;
  
  db.run(sql, [name, contact_person, email, phone, address, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    db.get('SELECT * FROM clients WHERE id = ?', [req.params.id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ 
        message: 'Client updated successfully',
        client: row
      });
    });
  });
});

app.delete('/api/clients/:id', isAuthenticated, (req, res) => {
  // Check if client has sales
  db.get('SELECT COUNT(*) as count FROM sales WHERE client_id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (row.count > 0) {
      return res.status(400).json({ error: 'Cannot delete client as they have sales associated' });
    }
    
    // Begin transaction
    db.run('BEGIN TRANSACTION', (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Delete client
      db.run('DELETE FROM clients WHERE id = ?', [req.params.id], function(err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: err.message });
        }
        
        db.run('COMMIT');
        res.json({ message: 'Client deleted successfully' });
      });
    });
  });
});

// Sales routes
app.get('/api/sales', isAuthenticated, (req, res) => {
  db.all('SELECT s.*, c.name as client_name FROM sales s JOIN clients c ON s.client_id = c.id ORDER BY s.sale_date DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ sales: rows });
  });
});

app.get('/api/sales/:id', isAuthenticated, (req, res) => {
  db.get('SELECT s.*, c.name as client_name FROM sales s JOIN clients c ON s.client_id = c.id WHERE s.id = ?', [req.params.id], (err, sale) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    
    // Get sale items
    db.all(`
      SELECT si.*, p.name as product_name 
      FROM sale_items si
      JOIN products p ON si.product_id = p.id
      WHERE si.sale_id = ?
    `, [req.params.id], (err, items) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.json({ 
        sale: {
          ...sale,
          items: items
        }
      });
    });
  });
});

app.post('/api/sales', isAuthenticated, (req, res) => {
  const { client_id, sale_date, total_amount, status, notes, items } = req.body;
  
  if (!client_id) {
    return res.status(400).json({ error: 'Client ID is required' });
  }
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Sale must have at least one item' });
  }
  
  // Begin transaction
  db.run('BEGIN TRANSACTION', function(err) {
    if (err) {
      console.error('Error beginning transaction:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    const currentDate = new Date().toISOString();
    
    // Insert sale record
    db.run(
      'INSERT INTO sales (client_id, sale_date, total_amount, status, notes) VALUES (?, ?, ?, ?, ?)',
      [client_id, sale_date || currentDate, total_amount, status || 'completed', notes || ''],
      function(err) {
        if (err) {
          console.error('Error inserting sale:', err.message);
          db.run('ROLLBACK');
          return res.status(500).json({ error: err.message });
        }
        
        const saleId = this.lastID;
        console.log('Sale created with ID:', saleId);
        
        let processingErrors = [];
        let completedItems = 0;
        
        // Process each item in the sale
        items.forEach(function(item) {
          console.log('Processing sale item:', item);
          
          if (!item.product_id || !item.quantity || !item.unit_price) {
            processingErrors.push('Missing required item fields');
            completedItems++;
            return;
          }
          
          // Convert to numbers
          const productId = Number(item.product_id);
          const quantity = Number(item.quantity);
          const unitPrice = Number(item.unit_price);
          const itemTotal = unitPrice * quantity;
          
          console.log(`Item values - productId: ${productId}, quantity: ${quantity}, unitPrice: ${unitPrice}, total: ${itemTotal}`);
          
          // Insert sale item
          db.run(
            'INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)',
            [saleId, productId, quantity, unitPrice, itemTotal],
            function(err) {
              if (err) {
                console.error('Error inserting sale item:', err.message);
                processingErrors.push(`Error adding sale item: ${err.message}`);
                completedItems++;
                return;
              }
              
              console.log('Sale item inserted successfully');
              
              // Update product stock
              db.run(
                'UPDATE products SET current_stock = current_stock - ? WHERE id = ?',
                [quantity, productId],
                function(err) {
                  if (err) {
                    processingErrors.push(`Error updating product stock: ${err.message}`);
                    completedItems++;
                    return;
                  }
                  
                  console.log('Product stock updated successfully');
                  
                  // Record the transaction
                  db.run(
                    'INSERT INTO transactions (product_id, quantity, transaction_type, unit_price, total_price, notes, transaction_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [
                      productId, 
                      -quantity, 
                      'Sale', 
                      unitPrice, 
                      -itemTotal, 
                      `Sale #${saleId}`,
                      currentDate
                    ],
                    function(err) {
                      if (err) {
                        processingErrors.push(`Error recording transaction: ${err.message}`);
                      } else {
                        console.log('Transaction recorded successfully');
                      }
                      
                      completedItems++;
                      
                      // If all items are processed
                      if (completedItems === items.length) {
                        if (processingErrors.length > 0) {
                          console.error('Errors during sale processing:', processingErrors);
                          db.run('ROLLBACK');
                          return res.status(500).json({ 
                            error: 'Errors occurred during sale processing', 
                            details: processingErrors 
                          });
                        } else {
                          db.run('COMMIT', function(err) {
                            if (err) {
                              console.error('Error committing transaction:', err.message);
                              db.run('ROLLBACK');
                              return res.status(500).json({ error: `Error committing transaction: ${err.message}` });
                            }
                            
                            console.log('Sale transaction committed successfully');
                            
                            // Check stock levels after successful sale
                            checkLowStockLevels();
                            
                            res.status(201).json({
                              message: 'Sale completed successfully',
                              id: saleId
                            });
                          });
                        }
                      }
                    }
                  );
                }
              );
            }
          );
        });
      }
    );
  });
});

app.delete('/api/sales/:id', isAuthenticated, (req, res) => {
  db.get('SELECT * FROM sales WHERE id = ?', [req.params.id], (err, sale) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    
    // Begin transaction
    db.run('BEGIN TRANSACTION', (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Get sale items
      db.all('SELECT * FROM sale_items WHERE sale_id = ?', [req.params.id], (err, items) => {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: err.message });
        }
        
        let processingErrors = [];
        let completedItems = 0;
        
        if (items.length === 0) {
          // If no items, just delete the sale
          db.run('DELETE FROM sales WHERE id = ?', [req.params.id], (err) => {
            if (err) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: err.message });
            }
            
            db.run('COMMIT');
            res.json({ message: 'Sale deleted successfully' });
          });
          return;
        }
        
        // Process each item to restore stock
        items.forEach(function(item) {
          // Update product stock (add back the sold quantity)
          db.run(
            'UPDATE products SET current_stock = current_stock + ? WHERE id = ?',
            [item.quantity, item.product_id],
            function(err) {
              if (err) {
                processingErrors.push(`Error restoring product stock: ${err.message}`);
                completedItems++;
                return;
              }
              
              // Record the reversal transaction
              db.run(
                'INSERT INTO transactions (product_id, quantity, transaction_type, unit_price, total_price, notes, transaction_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                  item.product_id, 
                  item.quantity, 
                  'Sale Reversal', 
                  item.unit_price, 
                  item.total_price, 
                  `Reversal of sale #${req.params.id}`,
                  new Date().toISOString()
                ],
                function(err) {
                  if (err) {
                    processingErrors.push(`Error recording reversal transaction: ${err.message}`);
                  } else {
                    console.log('Transaction recorded successfully');
                  }
                  
                  completedItems++;
                  
                  // If all items are processed
                  if (completedItems === items.length) {
                    if (processingErrors.length > 0) {
                      db.run('ROLLBACK');
                      return res.status(500).json({ 
                        error: 'Errors occurred during sale deletion', 
                        details: processingErrors 
                      });
                    } else {
                      // Delete sale items
                      db.run('DELETE FROM sale_items WHERE sale_id = ?', [req.params.id], (err) => {
                        if (err) {
                          db.run('ROLLBACK');
                          return res.status(500).json({ error: err.message });
                        }
                        
                        // Delete sale
                        db.run('DELETE FROM sales WHERE id = ?', [req.params.id], (err) => {
                          if (err) {
                            db.run('ROLLBACK');
                            return res.status(500).json({ error: err.message });
                          }
                          
                          db.run('COMMIT');
                          res.json({ message: 'Sale deleted successfully' });
                        });
                      });
                    }
                  }
                }
              );
            }
          );
        });
      });
    });
  });
});

// Stock monitoring system
function setupStockMonitoring() {
  // Initial check
  checkLowStockLevels();
  
  // Schedule periodic check every 30 minutes
  setInterval(checkLowStockLevels, 30 * 60 * 1000);
  
  console.log('Stock monitoring system initialized');
}

// Check stock levels and create alerts
function checkLowStockLevels() {
  console.log('Checking stock levels...', new Date().toISOString());
  
  db.all(`
    SELECT p.*, s.name as supplier_name
    FROM products p
    LEFT JOIN suppliers s ON p.supplier_id = s.id
    WHERE p.current_stock <= p.min_stock_level
  `, [], (err, products) => {
    if (err) {
      console.error('Error checking stock levels:', err.message);
      return;
    }
    
    console.log(`Found ${products.length} products with low stock`);
    
    products.forEach((product) => {
      // Check if there's already an active alert for this product
      db.get(
        'SELECT * FROM low_stock_alerts WHERE product_id = ? AND status = "active"',
        [product.id],
        (err, existingAlert) => {
          if (err) {
            console.error('Error checking existing alerts:', err.message);
            return;
          }
          
          if (existingAlert) {
            // Update existing alert
            db.run(
              'UPDATE low_stock_alerts SET current_stock = ?, alert_date = ? WHERE id = ?',
              [product.current_stock, new Date().toISOString(), existingAlert.id],
              (err) => {
                if (err) {
                  console.error('Error updating existing alert:', err.message);
                }
              }
            );
          } else {
            // Create new alert
            db.run(
              'INSERT INTO low_stock_alerts (product_id, current_stock, min_stock_level, alert_date, status) VALUES (?, ?, ?, ?, ?)',
              [product.id, product.current_stock, product.min_stock_level, new Date().toISOString(), 'active'],
              (err) => {
                if (err) {
                  console.error('Error creating new alert:', err.message);
                } else {
                  console.log(`Created new alert for product: ${product.name}`);
                }
              }
            );
          }
          
          // Find best supplier for this product
          findBestSupplierForProduct(product.id);
        }
      );
    });
  });
}

// Find the best supplier for a product based on price
function findBestSupplierForProduct(productId) {
  db.all(`
    SELECT spp.*, s.name as supplier_name, s.email, s.phone
    FROM supplier_product_prices spp
    JOIN suppliers s ON spp.supplier_id = s.id
    WHERE spp.product_id = ?
    ORDER BY spp.unit_price ASC
  `, [productId], (err, suppliers) => {
    if (err) {
      console.error('Error finding best supplier:', err.message);
      return;
    }
    
    if (suppliers.length === 0) {
      console.log(`No supplier pricing data found for product ID ${productId}`);
      return;
    }
    
    const bestSupplier = suppliers[0];
    console.log(`Best supplier for product ID ${productId} is ${bestSupplier.supplier_name} with price ${bestSupplier.unit_price}`);
    
    // Update the low stock alert with the best supplier info
    db.run(
      'UPDATE low_stock_alerts SET best_supplier_id = ?, best_supplier_price = ? WHERE product_id = ? AND status = "active"',
      [bestSupplier.supplier_id, bestSupplier.unit_price, productId],
      (err) => {
        if (err) {
          console.error('Error updating alert with best supplier:', err.message);
        }
      }
    );
  });
}

// Endpoint to get low stock alerts
app.get('/api/low-stock-alerts', isAuthenticated, (req, res) => {
  db.all(`
    SELECT lsa.*, p.name as product_name, s.name as supplier_name
    FROM low_stock_alerts lsa
    JOIN products p ON lsa.product_id = p.id
    LEFT JOIN suppliers s ON lsa.best_supplier_id = s.id
    WHERE lsa.status = 'active'
    ORDER BY lsa.alert_date DESC
  `, [], (err, alerts) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({ alerts: alerts });
  });
});

// Reports API endpoint
app.get('/api/reports', isAuthenticated, (req, res) => {
  const reportType = req.query.type;
  const dateRange = req.query.dateRange;
  let startDate, endDate;
  
  // Set date range based on selection
  const today = new Date();
  switch(dateRange) {
    case 'today':
      startDate = new Date(today.setHours(0, 0, 0, 0));
      endDate = new Date(today.setHours(23, 59, 59, 999));
      break;
    case 'thisWeek':
      startDate = new Date(today.setDate(today.getDate() - today.getDay()));
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(today);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'thisMonth':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    case 'lastMonth':
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);
      break;
    case 'thisYear':
      startDate = new Date(today.getFullYear(), 0, 1);
      endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
    default:
      // Default to last 30 days
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999);
  }
  
  // Format dates for SQLite
  const formattedStartDate = startDate.toISOString();
  const formattedEndDate = endDate.toISOString();
  
  // Generate report based on type
  switch(reportType) {
    case 'sales':
      generateSalesReport(req, res, formattedStartDate, formattedEndDate);
      break;
    case 'inventory':
      generateInventoryReport(req, res);
      break;
    case 'clients':
      generateClientsReport(req, res);
      break;
    case 'suppliers':
      generateSuppliersReport(req, res);
      break;
    case 'lowstock':
      generateLowStockReport(req, res);
      break;
    case 'financial':
      generateFinancialReport(req, res, formattedStartDate, formattedEndDate);
      break;
    default:
      res.status(400).json({ error: 'Invalid report type' });
  }
});

// Helper function to generate sales report
function generateSalesReport(req, res, startDate, endDate) {
  // Apply additional filters if provided
  const clientFilter = req.query.clientId ? `AND s.client_id = ${req.query.clientId}` : '';
  const statusFilter = req.query.status ? `AND s.status = '${req.query.status}'` : '';
  
  // Query to get sales data
  const query = `
    SELECT s.*, c.name as client_name
    FROM sales s
    JOIN clients c ON s.client_id = c.id
    WHERE s.sale_date BETWEEN ? AND ?
    ${clientFilter}
    ${statusFilter}
    ORDER BY s.sale_date DESC
  `;
  
  db.all(query, [startDate, endDate], (err, sales) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Calculate summary statistics
    let totalSales = 0;
    sales.forEach(sale => {
      totalSales += sale.total_amount;
    });
    
    const averageSale = sales.length > 0 ? totalSales / sales.length : 0;
    
    res.json({
      data: sales,
      totalSales: totalSales,
      averageSale: averageSale,
      count: sales.length,
      startDate: startDate,
      endDate: endDate
    });
  });
}

// Helper function to generate inventory report
function generateInventoryReport(req, res) {
  // Apply additional filters if provided
  const stockLevelFilter = req.query.stockLevel ? 
    req.query.stockLevel === 'low' ? 'AND p.current_stock <= p.min_level' :
    req.query.stockLevel === 'high' ? 'AND p.current_stock > (p.min_level * 2)' : '' : '';
  
  const supplierFilter = req.query.supplierId ? `AND p.supplier_id = ${req.query.supplierId}` : '';
  
  // Query to get inventory data
  const query = `
    SELECT p.*, s.name as supplier_name
    FROM products p
    LEFT JOIN suppliers s ON p.supplier_id = s.id
    WHERE 1=1
    ${stockLevelFilter}
    ${supplierFilter}
    ORDER BY p.name
  `;
  
  db.all(query, [], (err, products) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Calculate summary statistics
    let totalValue = 0;
    let lowStockCount = 0;
    
    products.forEach(product => {
      totalValue += product.current_stock * product.unit_price;
      if (product.current_stock <= product.min_stock_level) {
        lowStockCount++;
      }
    });
    
    res.json({
      data: products,
      totalProducts: products.length,
      totalValue: totalValue,
      lowStockCount: lowStockCount
    });
  });
}

// Helper function to generate clients report
function generateClientsReport(req, res) {
  db.all('SELECT * FROM clients ORDER BY name', [], (err, clients) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({
      data: clients,
      totalClients: clients.length
    });
  });
}

// Helper function to generate suppliers report
function generateSuppliersReport(req, res) {
  db.all('SELECT * FROM suppliers ORDER BY name', [], (err, suppliers) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({
      data: suppliers,
      totalSuppliers: suppliers.length
    });
  });
}

// Helper function to generate low stock report
function generateLowStockReport(req, res) {
  db.all(`
    SELECT p.*, s.name as supplier_name
    FROM products p
    LEFT JOIN suppliers s ON p.supplier_id = s.id
    WHERE p.current_stock <= p.min_stock_level
    ORDER BY (p.min_stock_level - p.current_stock) DESC
  `, [], (err, products) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({
      data: products,
      lowStockCount: products.length
    });
  });
}

// Helper function to generate financial report
function generateFinancialReport(req, res, startDate, endDate) {
  const transactionTypeFilter = req.query.transactionType ? 
    req.query.transactionType === 'sales' ? 'AND transaction_type = "sale"' :
    req.query.transactionType === 'purchases' ? 'AND transaction_type = "purchase"' : '' : '';
  
  // This is a placeholder - in a real system, you would have a financial transactions table
  // For now, we'll combine sales data as a simple example
  const query = `
    SELECT s.id, s.sale_date as transaction_date, s.total_amount, 'sale' as transaction_type, c.name as entity_name
    FROM sales s
    JOIN clients c ON s.client_id = c.id
    WHERE s.sale_date BETWEEN ? AND ?
    ${transactionTypeFilter}
    ORDER BY s.sale_date DESC
  `;
  
  db.all(query, [startDate, endDate], (err, transactions) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Calculate summary statistics
    let totalIncome = 0;
    let totalExpense = 0;
    
    transactions.forEach(transaction => {
      if (transaction.transaction_type === 'sale') {
        totalIncome += transaction.total_amount;
      } else if (transaction.transaction_type === 'purchase') {
        totalExpense += transaction.total_amount;
      }
    });
    
    res.json({
      data: transactions,
      totalIncome: totalIncome,
      totalExpense: totalExpense,
      netProfit: totalIncome - totalExpense,
      transactionCount: transactions.length,
      startDate: startDate,
      endDate: endDate
    });
  });
}

// Purchase Orders routes
app.get('/api/purchase-orders', isAuthenticated, (req, res) => {
  console.log('GET /api/purchase-orders called');
  
  db.all('SELECT o.*, s.name as supplier_name FROM supplier_orders o JOIN suppliers s ON o.supplier_id = s.id ORDER BY o.order_date DESC', [], (err, rows) => {
    if (err) {
      console.error('Error fetching purchase orders:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log(`Fetched ${rows.length} purchase orders`);
    res.json({ orders: rows });
  });
});

app.get('/api/purchase-orders/:id', isAuthenticated, (req, res) => {
  console.log(`GET /api/purchase-orders/${req.params.id} called`);
  
  db.get('SELECT o.*, s.name as supplier_name FROM supplier_orders o JOIN suppliers s ON o.supplier_id = s.id WHERE o.id = ?', [req.params.id], (err, order) => {
    if (err) {
      console.error('Error fetching purchase order:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    if (!order) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }
    
    // Get order items
    db.all(`
      SELECT soi.*, p.name as product_name 
      FROM supplier_order_items soi
      JOIN products p ON soi.product_id = p.id
      WHERE soi.supplier_order_id = ?
    `, [req.params.id], (err, items) => {
      if (err) {
        console.error('Error fetching order items:', err.message);
        return res.status(500).json({ error: err.message });
      }
      
      console.log(`Fetched purchase order #${req.params.id} with ${items.length} items`);
      res.json({ 
        order: {
          ...order,
          items: items
        }
      });
    });
  });
});

app.post('/api/purchase-orders', isAuthenticated, (req, res) => {
  console.log('POST /api/purchase-orders called with data:', req.body);
  
  const { supplier_id, items, notes } = req.body;
  const orderDate = new Date();
  const expectedDeliveryDate = new Date(orderDate);
  expectedDeliveryDate.setDate(orderDate.getDate() + 7); // Default 7 days delivery
  const purchaseOrderNumber = 'PO-' + Date.now();

  let totalAmount = 0;
  items.forEach(item => {
    totalAmount += item.cost_price * item.quantity;
  });

  db.run('BEGIN TRANSACTION');

  db.run(
    'INSERT INTO supplier_orders (supplier_id, order_date, expected_delivery_date, total_amount, purchase_order_number, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [supplier_id, orderDate.toISOString(), expectedDeliveryDate.toISOString(), totalAmount, purchaseOrderNumber, notes, 'pending'],
    function(err) {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: err.message });
      }

      const orderId = this.lastID;

      const insertItem = db.prepare(`
        INSERT INTO supplier_order_items (supplier_order_id, product_id, quantity, cost_price, total) 
        VALUES (?, ?, ?, ?, ?)
      `);

      items.forEach(function(item) {
        const itemTotal = item.cost_price * item.quantity;
        insertItem.run(orderId, item.product_id, item.quantity, item.cost_price, itemTotal);
      });

      insertItem.finalize();

      db.run('COMMIT');
      res.status(201).json({ message: 'Supplier order created successfully' });
    }
  );
});

app.put('/api/purchase-orders/:id/status', isAuthenticated, function(req, res) {
  console.log(`PUT /api/purchase-orders/${req.params.id}/status called with data:`, req.body);
  
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  
  // Update order status
  db.run('UPDATE supplier_orders SET status = ? WHERE id = ?', [status, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }
    
    console.log(`Updated purchase order #${req.params.id} status to ${status}`);
    
    // If status is 'received', update inventory
    if (status === 'received') {
      // Begin transaction
      db.run('BEGIN TRANSACTION', function(err) {
        if (err) {
          console.error('Error beginning transaction:', err.message);
          return res.status(500).json({ error: err.message });
        }
        
        // Get order items
        db.all('SELECT * FROM supplier_order_items WHERE supplier_order_id = ?', [req.params.id], function(err, items) {
          if (err) {
            console.error('Error fetching order items:', err.message);
            db.run('ROLLBACK');
            return res.status(500).json({ error: err.message });
          }
          
          let processingErrors = [];
          let completedItems = 0;
          
          if (items.length === 0) {
            db.run('COMMIT');
            return res.json({ message: 'Purchase order status updated successfully' });
          }
          
          const currentDate = new Date().toISOString();
          
          // Process each item to update inventory
          items.forEach(function(item) {
            console.log('Processing received item:', item);
            
            // Update product stock
            db.run(
              'UPDATE products SET current_stock = current_stock + ? WHERE id = ?',
              [item.quantity, item.product_id],
              function(err) {
                if (err) {
                  processingErrors.push(`Error updating product stock: ${err.message}`);
                  completedItems++;
                  return;
                }
                
                console.log(`Updated stock for product #${item.product_id}`);
                
                // Record the transaction
                db.run(
                  'INSERT INTO transactions (product_id, quantity, transaction_type, unit_price, total_price, notes, transaction_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
                  [
                    item.product_id, 
                    item.quantity, 
                    'Purchase', 
                    item.cost_price, 
                    item.total, 
                    `PO #${req.params.id} received`,
                    currentDate
                  ],
                  function(err) {
                    if (err) {
                      processingErrors.push(`Error recording transaction: ${err.message}`);
                    } else {
                      console.log('Transaction recorded successfully');
                    }
                    
                    completedItems++;
                    
                    // If all items are processed
                    if (completedItems === items.length) {
                      if (processingErrors.length > 0) {
                        console.error('Errors during inventory update:', processingErrors);
                        db.run('ROLLBACK');
                        return res.status(500).json({ 
                          error: 'Errors occurred during inventory update', 
                          details: processingErrors 
                        });
                      } else {
                        db.run('COMMIT', function(err) {
                          if (err) {
                            console.error('Error committing transaction:', err.message);
                            db.run('ROLLBACK');
                            return res.status(500).json({ error: `Error committing transaction: ${err.message}` });
                          }
                          
                          console.log('Inventory update committed successfully');
                          res.json({ message: 'Purchase order received and inventory updated successfully' });
                        });
                      }
                    }
                  }
                );
              }
            );
          });
        });
      });
    } else {
      res.json({ message: 'Purchase order status updated successfully' });
    }
  });
});

app.delete('/api/purchase-orders/:id', isAuthenticated, (req, res) => {
  console.log(`DELETE /api/purchase-orders/${req.params.id} called`);
  
  db.get('SELECT * FROM supplier_orders WHERE id = ?', [req.params.id], (err, order) => {
    if (err) {
      console.error('Error fetching purchase order:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    if (!order) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }
    
    // Can't delete received orders
    if (order.status === 'received') {
      return res.status(400).json({ error: 'Cannot delete a received purchase order' });
    }
    
    // Begin transaction
    db.run('BEGIN TRANSACTION', (err) => {
      if (err) {
        console.error('Error beginning transaction:', err.message);
        return res.status(500).json({ error: err.message });
      }
      
      // Delete order items
      db.run('DELETE FROM supplier_order_items WHERE supplier_order_id = ?', [req.params.id], (err) => {
        if (err) {
          console.error('Error deleting order items:', err.message);
          db.run('ROLLBACK');
          return res.status(500).json({ error: err.message });
        }
        
        console.log(`Deleted items for purchase order #${req.params.id}`);
        
        // Delete order
        db.run('DELETE FROM supplier_orders WHERE id = ?', [req.params.id], (err) => {
          if (err) {
            console.error('Error deleting purchase order:', err.message);
            db.run('ROLLBACK');
            return res.status(500).json({ error: err.message });
          }
          
          console.log(`Deleted purchase order #${req.params.id}`);
          db.run('COMMIT');
          res.json({ message: 'Purchase order deleted successfully' });
        });
      });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Test the database connection
  db.get('SELECT 1', (err, row) => {
    if (err) {
      console.error('Database connection test failed:', err.message);
    } else {
      console.log('Database connection test successful');
      
      // Check if suppliers table exists
      db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='suppliers'", (err, row) => {
        if (err) {
          console.error('Error checking for suppliers table:', err.message);
        } else if (row) {
          console.log('Suppliers table exists');
          
          // Count suppliers
          db.get('SELECT COUNT(*) as count FROM suppliers', (err, row) => {
            if (err) {
              console.error('Error counting suppliers:', err.message);
            } else {
              console.log(`Found ${row.count} suppliers in the database`);
            }
          });
        } else {
          console.error('Suppliers table does not exist!');
        }
      });
    }
  });
  
  // Start the stock monitoring system
  setupStockMonitoring();
});

// Close database connection on process termination
process.on('SIGINT', () => {
  console.log('Closing database connection...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});
