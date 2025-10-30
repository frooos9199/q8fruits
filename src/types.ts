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
  image: string; // الصورة الرئيسية (للتوافق مع النظام الحالي)
  images: string[]; // مصفوفة من الصور
  tags: string[]; // شارات مخصصة يمكن للأدمن إضافتها لكل منتج (مث: "بدون حب", "فاكهه موسمية")
  description: MultiLanguageText;
  isPublished: boolean;
  stock: number;
  minStock: number; // الحد الأدنى للمخزون
  barcode: string; // الرمز الشريطي
  supplier: string; // اسم المورد
  origin: MultiLanguageText; // بلد المنشأ
  nutritionFacts: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
    vitamins: string;
  };
  storageInstructions: MultiLanguageText; // تعليمات التخزين
  isOrganic: boolean; // منتج عضوي
  isFresh: boolean; // منتج طازج
  shelfLife: string; // مدة الصلاحية
  discount: {
    enabled: boolean;
    percentage: number;
    startDate: string;
    endDate: string;
  };
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