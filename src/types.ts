export type Language = 'ar' | 'en';

export interface MultiLanguageText {
  ar: string;
  en: string;
}

export type ProductCategory = 'fruits' | 'vegetables' | 'leafy' | 'baskets';

export interface ProductUnit {
  id: number;
  unit: MultiLanguageText;
  price: number;
  isDefault: boolean;
}

export interface Product {
  id: number;
  name: MultiLanguageText;
  category: ProductCategory;
  units: ProductUnit[]; // وحدات متعددة مع أسعار مختلفة
  images: string[]; // مصفوفة من الصور
  tags?: string[]; // شارات مخصصة يمكن للأدمن إضافتها لكل منتج (مث: "بدون حب", "فاكهه موسمية")
  description?: MultiLanguageText;
  isPublished: boolean;
  stock: number;
}

export interface CartItem {
  product: Product;
  selectedUnit: ProductUnit;
  quantity: number;
}

export interface DeliveryInfo {
  price: number; // سعر التوصيل الثابت
  areas: string[]; // المحافظات المتاحة للتوصيل
}

export interface Order {
  id: string;
  items: CartItem[];
  deliveryPrice: number;
  totalPrice: number;
  paymentMethod: 'link' | 'cash';
  customerInfo: {
    name: string;
    phone: string;
    address: string;
    area: string;
  };
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  createdAt: Date;
}