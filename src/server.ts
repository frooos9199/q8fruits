// Express server for mobile app API
import express from 'express';
import cors from 'cors';
import { ProductsAPI, OrdersAPI, UsersAPI, SettingsAPI } from './services/api';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8081'], // React web + React Native metro
  credentials: true
}));
app.use(express.json());

// Products endpoints
app.get('/api/products', async (req, res) => {
  try {
    const products = await ProductsAPI.getAll();
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await ProductsAPI.getById(parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = await ProductsAPI.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await ProductsAPI.update(parseInt(req.params.id), req.body);
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await ProductsAPI.delete(parseInt(req.params.id));
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
});

// Orders endpoints
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await OrdersAPI.getAll();
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

app.get('/api/orders/user/:email', async (req, res) => {
  try {
    const orders = await OrdersAPI.getUserOrders(req.params.email);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch user orders' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = await OrdersAPI.create(req.body);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create order' });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await OrdersAPI.updateStatus(req.params.id, status);
    res.json({ success: true, message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update order status' });
  }
});

// Users endpoints
app.get('/api/users', async (req, res) => {
  try {
    const users = await UsersAPI.getAll();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
});

app.get('/api/users/:email', async (req, res) => {
  try {
    const user = await UsersAPI.getByEmail(req.params.email);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});

app.post('/api/users/register', async (req, res) => {
  try {
    const user = await UsersAPI.register(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Registration failed';
    res.status(400).json({ success: false, error: errorMessage });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UsersAPI.login(email, password);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to login' });
  }
});

app.put('/api/users/:email', async (req, res) => {
  try {
    const user = await UsersAPI.update(req.params.email, req.body);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update user' });
  }
});

// Settings endpoints
app.get('/api/settings/delivery', async (req, res) => {
  try {
    const settings = await SettingsAPI.getDeliverySettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch delivery settings' });
  }
});

app.put('/api/settings/delivery', async (req, res) => {
  try {
    const settings = await SettingsAPI.updateDeliverySettings(req.body);
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update delivery settings' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📱 Mobile app can connect to: http://localhost:${PORT}/api`);
});

export default app;