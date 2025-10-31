// Production API server for q8fruit.com
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Data storage file path (يمكن استبداله بقاعدة بيانات)
const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Create data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data files
const initializeDataFiles = () => {
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([]));
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify({}));
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  }
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify({
      deliveryAreas: [
        { name: 'حولي', price: 1.5 },
        { name: 'الفروانية', price: 2.0 },
        { name: 'الأحمدي', price: 2.5 },
        { name: 'الجهراء', price: 3.0 },
        { name: 'مبارك الكبير', price: 2.0 },
        { name: 'العاصمة', price: 1.5 }
      ]
    }));
  }
};

// Helper functions for data operations
const readData = (filename) => {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading file:', filename, error);
    return null;
  }
};

const writeData = (filename, data) => {
  try {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing file:', filename, error);
    return false;
  }
};

// Middleware
app.use(cors({
  origin: ['https://q8fruit.com', 'http://localhost:3000', 'http://localhost:8081'],
  credentials: true
}));
app.use(express.json());

// Initialize data on startup
initializeDataFiles();

// Products endpoints
app.get('/api/products', (req, res) => {
  try {
    const products = readData(PRODUCTS_FILE) || [];
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const products = readData(PRODUCTS_FILE) || [];
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const products = readData(PRODUCTS_FILE) || [];
    const newProduct = {
      ...req.body,
      id: Date.now()
    };
    
    products.push(newProduct);
    
    if (writeData(PRODUCTS_FILE, products)) {
      res.status(201).json({ success: true, data: newProduct });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save product' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', (req, res) => {
  try {
    const products = readData(PRODUCTS_FILE) || [];
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    products[index] = { ...products[index], ...req.body };
    
    if (writeData(PRODUCTS_FILE, products)) {
      res.json({ success: true, data: products[index] });
    } else {
      res.status(500).json({ success: false, error: 'Failed to update product' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    const products = readData(PRODUCTS_FILE) || [];
    const filteredProducts = products.filter(p => p.id !== parseInt(req.params.id));
    
    if (writeData(PRODUCTS_FILE, filteredProducts)) {
      res.json({ success: true, message: 'Product deleted successfully' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to delete product' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
});

// Orders endpoints
app.get('/api/orders', (req, res) => {
  try {
    const ordersData = readData(ORDERS_FILE) || {};
    const allOrders = [];
    
    Object.values(ordersData).forEach(userOrders => {
      allOrders.push(...userOrders);
    });
    
    // Sort by date
    allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json({ success: true, data: allOrders });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

app.get('/api/orders/user/:email', (req, res) => {
  try {
    const ordersData = readData(ORDERS_FILE) || {};
    const userOrders = ordersData[req.params.email] || [];
    
    res.json({ success: true, data: userOrders });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch user orders' });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const ordersData = readData(ORDERS_FILE) || {};
    const userEmail = req.body.userEmail;
    
    const newOrder = {
      ...req.body,
      id: Date.now().toString(),
      orderNumber: `ORD-${Date.now()}`,
      date: new Date().toLocaleDateString('ar-SA'),
      status: 'pending'
    };
    
    if (!ordersData[userEmail]) {
      ordersData[userEmail] = [];
    }
    
    ordersData[userEmail].push(newOrder);
    
    if (writeData(ORDERS_FILE, ordersData)) {
      res.status(201).json({ success: true, data: newOrder });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save order' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create order' });
  }
});

app.put('/api/orders/:id/status', (req, res) => {
  try {
    const ordersData = readData(ORDERS_FILE) || {};
    const { status } = req.body;
    let orderFound = false;
    
    // Find and update order
    Object.keys(ordersData).forEach(userEmail => {
      const orderIndex = ordersData[userEmail].findIndex(o => o.id === req.params.id);
      if (orderIndex !== -1) {
        ordersData[userEmail][orderIndex].status = status;
        orderFound = true;
      }
    });
    
    if (!orderFound) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    if (writeData(ORDERS_FILE, ordersData)) {
      res.json({ success: true, message: 'Order status updated successfully' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to update order status' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update order status' });
  }
});

// Users endpoints
app.get('/api/users', (req, res) => {
  try {
    const users = readData(USERS_FILE) || [];
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
});

app.get('/api/users/:email', (req, res) => {
  try {
    const users = readData(USERS_FILE) || [];
    const user = users.find(u => u.email === req.params.email);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});

app.post('/api/users/register', (req, res) => {
  try {
    const users = readData(USERS_FILE) || [];
    const existingUser = users.find(u => u.email === req.body.email);
    
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }
    
    const newUser = {
      ...req.body,
      id: Date.now().toString(),
      registeredAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    if (writeData(USERS_FILE, users)) {
      res.status(201).json({ success: true, data: newUser });
    } else {
      res.status(500).json({ success: false, error: 'Failed to register user' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to register user' });
  }
});

app.post('/api/users/login', (req, res) => {
  try {
    const users = readData(USERS_FILE) || [];
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to login' });
  }
});

app.put('/api/users/:email', (req, res) => {
  try {
    const users = readData(USERS_FILE) || [];
    const userIndex = users.findIndex(u => u.email === req.params.email);
    
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    users[userIndex] = { ...users[userIndex], ...req.body };
    
    if (writeData(USERS_FILE, users)) {
      res.json({ success: true, data: users[userIndex] });
    } else {
      res.status(500).json({ success: false, error: 'Failed to update user' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update user' });
  }
});

// Settings endpoints
app.get('/api/settings/delivery', (req, res) => {
  try {
    const settings = readData(SETTINGS_FILE) || { deliveryAreas: [] };
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch delivery settings' });
  }
});

app.put('/api/settings/delivery', (req, res) => {
  try {
    if (writeData(SETTINGS_FILE, req.body)) {
      res.json({ success: true, data: req.body });
    } else {
      res.status(500).json({ success: false, error: 'Failed to update delivery settings' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update delivery settings' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    server: 'q8fruit.com API'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Q8 Fruit API Server running on port ${PORT}`);
  console.log(`📱 Mobile app can connect to: https://q8fruit.com/api`);
  console.log(`🌐 CORS enabled for: q8fruit.com`);
});

module.exports = app;