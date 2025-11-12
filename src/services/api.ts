import axios from 'axios';
import Config, { API_BASE_URL, ORDERS_PATH } from '../config';

// Base URL للموقع (قابل للتعديل من config)
const BASE_URL = API_BASE_URL || Config.API_BASE_URL;

// أنواع البيانات
export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category?: string;
  description?: string;
}

export interface Banner {
  id: number;
  image: string;
  title: string;
}

export interface OrderItem {
  id: number;
  name: string;
  price: string; // stored as string like other products
  quantity: number;
}

export interface CreateOrderPayload {
  customerName: string;
  phone: string;
  address: string;
  note?: string;
  items: OrderItem[];
  total: number; // numeric total
}

export interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

// API Service
class ApiService {
  private api;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // إنشاء طلب جديد - يتطلب API حقيقي
  async createOrder(payload: CreateOrderPayload): Promise<CreateOrderResult> {
    try {
      const response = await this.api.post(ORDERS_PATH || '/api/orders', payload);
      return { 
        success: true, 
        orderId: response.data?.orderId || response.data?.id || String(response.data) 
      };
    } catch (error: any) {
      // استخراج رسالة الخطأ من السيرفر
      const serverMessage = error?.response?.data?.message || error?.response?.data?.error;
      const errorMsg = serverMessage || error?.message || 'خطأ في الاتصال بالسيرفر';
      console.error('Error creating order:', errorMsg);
      
      return { 
        success: false, 
        error: errorMsg 
      };
    }
  }

  // جلب المنتجات من API الحقيقي
  async getProducts(): Promise<Product[]> {
    try {
      const response = await this.api.get('/api/products');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('فشل تحميل المنتجات من السيرفر');
    }
  }

  // جلب البانرات من API الحقيقي
  async getBanners(): Promise<Banner[]> {
    try {
      const response = await this.api.get('/api/banners');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching banners:', error);
      throw new Error('فشل تحميل البانرات من السيرفر');
    }
  }
}

export default new ApiService();
