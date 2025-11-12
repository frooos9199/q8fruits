// Enhanced production API server for q8fruit.com - Live version
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Data storage configuration
const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Initialize data directory and files
const initializeSystem = () => {
  console.log('🚀 Initializing Q8 Fruit API Server...');
  
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('📁 Created data directory');
  }

  // Initialize with sample data for immediate testing
  if (!fs.existsSync(PRODUCTS_FILE)) {
    const sampleProducts = [
      {
        id: 1,
        name: { ar: 'تفاح أحمر', en: 'Red Apple' },
        category: 'fruits',
        units: [{ id: 1, unit: { ar: 'كيلو', en: 'kg' }, price: 2.5, isDefault: true }],
        image: '🍎',
        images: ['🍎'],
        tags: ['طازج', 'عضوي'],
        description: { ar: 'تفاح أحمر طازج من مزارع الكويت', en: 'Fresh red apple from Kuwait farms' },
        isPublished: true,
        stock: 100,
        minStock: 10,
        barcode: '8901234567890',
        supplier: 'مزرعة الكويت',
        origin: { ar: 'الكويت', en: 'Kuwait' },
        nutritionFacts: {
          calories: '52',
          protein: '0.3g',
          carbs: '14g',
          fat: '0.2g',
          fiber: '2.4g',
          vitamins: 'فيتامين C'
        },
        storageInstructions: { ar: 'يحفظ في الثلاجة', en: 'Keep refrigerated' },
        isOrganic: true,
        isFresh: true,
        shelfLife: '7 أيام',
        discount: { enabled: false, percentage: 0, startDate: '', endDate: '' }
      },
      {
        id: 2,
        name: { ar: 'موز طازج', en: 'Fresh Banana' },
        category: 'fruits',
        units: [
          { id: 2, unit: { ar: 'كيلو', en: 'kg' }, price: 1.8, isDefault: true },
          { id: 3, unit: { ar: 'عود', en: 'piece' }, price: 0.2, isDefault: false }
        ],
        image: '🍌',
        images: ['🍌'],
        tags: ['طازج', 'استوائي'],
        description: { ar: 'موز طازج ولذيذ غني بالفيتامينات', en: 'Fresh delicious banana rich in vitamins' },
        isPublished: true,
        stock: 50,
        minStock: 5,
        barcode: '8901234567891',
        supplier: 'مزرعة الاستوائية',
        origin: { ar: 'الإكوادور', en: 'Ecuador' },
        nutritionFacts: {
          calories: '89',
          protein: '1.1g',
          carbs: '23g',
          fat: '0.3g',
          fiber: '2.6g',
          vitamins: 'فيتامين B6, C'
        },
        storageInstructions: { ar: 'يحفظ في درجة حرارة الغرفة', en: 'Keep at room temperature' },
        isOrganic: false,
        isFresh: true,
        shelfLife: '5 أيام',
        discount: { enabled: true, percentage: 15, startDate: '2025-10-01', endDate: '2025-11-15' }
      },
      {
        id: 3,
        name: { ar: 'برتقال حلو', en: 'Sweet Orange' },
        category: 'fruits',
        units: [{ id: 4, unit: { ar: 'كيلو', en: 'kg' }, price: 2.0, isDefault: true }],
        image: '🍊',
        images: ['🍊'],
        tags: ['طازج', 'حمضيات'],
        description: { ar: 'برتقال حلو طازج مليء بفيتامين C', en: 'Fresh sweet orange full of vitamin C' },
        isPublished: true,
        stock: 75,
        minStock: 15,
        barcode: '8901234567892',
        supplier: 'مزارع البحر المتوسط',
        origin: { ar: 'إسبانيا', en: 'Spain' },
        nutritionFacts: {
          calories: '47',
          protein: '0.9g',
          carbs: '12g',
          fat: '0.1g',
          fiber: '2.4g',
          vitamins: 'فيتامين C, فولات'
        },
        storageInstructions: { ar: 'يحفظ في مكان بارد وجاف', en: 'Keep in cool dry place' },
        isOrganic: false,
        isFresh: true,
        shelfLife: '10 أيام',
        discount: { enabled: false, percentage: 0, startDate: '', endDate: '' }
      }
    ];
    
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(sampleProducts, null, 2));
    console.log('📦 Created sample products');
  }

  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify({}));
    console.log('📋 Created orders file');
  }

  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
    console.log('👤 Created users file');
  }

  if (!fs.existsSync(SETTINGS_FILE)) {
    const defaultSettings = {
      deliveryAreas: [
        { name: 'حولي', price: 1.5 },
        { name: 'الفروانية', price: 2.0 },
        { name: 'الأحمدي', price: 2.5 },
        { name: 'الجهراء', price: 3.0 },
        { name: 'مبارك الكبير', price: 2.0 },
        { name: 'العاصمة', price: 1.5 }
      ]
    };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2));
    console.log('⚙️ Created settings file');
  }

  console.log('✅ System initialized successfully');
};

// Helper functions
const readData = (filename) => {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Error reading file:', filename, error.message);
    return null;
  }
};

const writeData = (filename, data) => {
  try {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Error writing file:', filename, error.message);
    return false;
  }
};

// Middleware
app.use(cors({
  origin: ['https://q8fruit.com', 'http://localhost:3000', 'http://localhost:8081'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`📡 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize system on startup
initializeSystem();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    server: 'Q8 Fruit API Live',
    version: '1.0.0'
  });
});

// Products endpoints
app.get('/api/products', (req, res) => {
  try {
    const products = readData(PRODUCTS_FILE) || [];
    console.log(`📦 Returning ${products.length} products`);
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
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
      console.log(`📦 Added new product: ${newProduct.name.ar}`);
      res.status(201).json({ success: true, data: newProduct });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save product' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create product' });
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
    
    allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log(`📋 Returning ${allOrders.length} orders`);
    
    res.json({ success: true, data: allOrders });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
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
      console.log(`📋 New order created: ${newOrder.orderNumber}`);
      res.status(201).json({ success: true, data: newOrder });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save order' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create order' });
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
      console.log(`👤 New user registered: ${newUser.email}`);
      res.status(201).json({ success: true, data: newUser });
    } else {
      res.status(500).json({ success: false, error: 'Failed to register user' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to register user' });
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

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 Q8 Fruit API Server LIVE!');
  console.log('================================');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`📱 API URL: http://localhost:${PORT}/api`);
  console.log(`📱 Mobile app ready for: https://q8fruit.com/api`);
  console.log('🌐 CORS enabled for q8fruit.com');
  console.log('✅ Ready to serve live data!');
  console.log('');
});

module.exports = app;