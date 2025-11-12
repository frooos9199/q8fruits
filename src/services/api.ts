// API endpoints for mobile app integration
import { Product, Order, User } from '../types';

const API_BASE_URL = 'https://www.q8fruit.com'; // Production endpoint (Vercel)

// Products API
export const ProductsAPI = {
  // Get all products
  getAll: async (): Promise<Product[]> => {
    try {
      const products = localStorage.getItem('products');
      return products ? JSON.parse(products) : [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  // Get product by ID
  getById: async (id: number): Promise<Product | null> => {
    try {
      const products = await ProductsAPI.getAll();
      return products.find(p => p.id === id) || null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  // Add new product (admin only)
  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    try {
      const products = await ProductsAPI.getAll();
      const newProduct = {
        ...product,
        id: Date.now()
      };
      products.push(newProduct);
      localStorage.setItem('products', JSON.stringify(products));
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product (admin only)
  update: async (id: number, updates: Partial<Product>): Promise<Product> => {
    try {
      const products = await ProductsAPI.getAll();
      const index = products.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Product not found');
      
      products[index] = { ...products[index], ...updates };
      localStorage.setItem('products', JSON.stringify(products));
      return products[index];
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product (admin only)
  delete: async (id: number): Promise<boolean> => {
    try {
      const products = await ProductsAPI.getAll();
      const filteredProducts = products.filter(p => p.id !== id);
      localStorage.setItem('products', JSON.stringify(filteredProducts));
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }
};

// Orders API
export const OrdersAPI = {
  // Get all orders (admin)
  getAll: async (): Promise<Order[]> => {
    try {
      const allOrders: Order[] = [];
      const keys = Object.keys(localStorage);
      
      keys.forEach(key => {
        if (key.startsWith('orders_')) {
          const userOrders = JSON.parse(localStorage.getItem(key) || '[]');
          allOrders.push(...userOrders);
        }
      });
      
      return allOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  // Get user orders
  getUserOrders: async (userEmail: string): Promise<Order[]> => {
    try {
      const orders = localStorage.getItem(`orders_${userEmail}`);
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  },

  // Create new order
  create: async (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>): Promise<Order> => {
    try {
      const newOrder: Order = {
        ...orderData,
        id: Date.now().toString(),
        orderNumber: `ORD-${Date.now()}`,
        date: new Date().toLocaleDateString('ar-SA'),
        status: 'pending'
      };

      const userOrders = await OrdersAPI.getUserOrders(orderData.userEmail);
      userOrders.push(newOrder);
      localStorage.setItem(`orders_${orderData.userEmail}`, JSON.stringify(userOrders));
      
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Update order status
  updateStatus: async (orderId: string, status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'): Promise<boolean> => {
    try {
      const allOrders = await OrdersAPI.getAll();
      const order = allOrders.find(o => o.id === orderId);
      if (!order) throw new Error('Order not found');

      const userOrders = await OrdersAPI.getUserOrders(order.userEmail);
      const orderIndex = userOrders.findIndex(o => o.id === orderId);
      if (orderIndex === -1) throw new Error('Order not found in user orders');

      userOrders[orderIndex].status = status;
      localStorage.setItem(`orders_${order.userEmail}`, JSON.stringify(userOrders));
      
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }
};

// Users API
export const UsersAPI = {
  // Get all users (admin)
  getAll: async (): Promise<User[]> => {
    try {
      const users = localStorage.getItem('registeredUsers');
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  // Get user by email
  getByEmail: async (email: string): Promise<User | null> => {
    try {
      const users = await UsersAPI.getAll();
      return users.find(u => u.email === email) || null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  // Register new user
  register: async (userData: Omit<User, 'id' | 'registeredAt'>): Promise<User> => {
    try {
      const users = await UsersAPI.getAll();
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) throw new Error('User already exists');

      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        registeredAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      return newUser;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Login user
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      const user = await UsersAPI.getByEmail(email);
      if (user && user.password === password) {
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error logging in:', error);
      return null;
    }
  },

  // Update user profile
  update: async (email: string, updates: Partial<User>): Promise<User> => {
    try {
      const users = await UsersAPI.getAll();
      const userIndex = users.findIndex(u => u.email === email);
      if (userIndex === -1) throw new Error('User not found');

      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      return users[userIndex];
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
};

// Settings API
export const SettingsAPI = {
  // Get delivery settings
  getDeliverySettings: async () => {
    try {
      const settings = localStorage.getItem('deliverySettings');
      return settings ? JSON.parse(settings) : {
        areas: [
          { name: 'حولي', price: 1.5 },
          { name: 'الفروانية', price: 2.0 },
          { name: 'الأحمدي', price: 2.5 },
          { name: 'الجهراء', price: 3.0 },
          { name: 'مبارك الكبير', price: 2.0 },
          { name: 'العاصمة', price: 1.5 }
        ]
      };
    } catch (error) {
      console.error('Error fetching delivery settings:', error);
      return { areas: [] };
    }
  },

  // Update delivery settings (admin only)
  updateDeliverySettings: async (settings: any) => {
    try {
      localStorage.setItem('deliverySettings', JSON.stringify(settings));
      return settings;
    } catch (error) {
      console.error('Error updating delivery settings:', error);
      throw error;
    }
  }
};