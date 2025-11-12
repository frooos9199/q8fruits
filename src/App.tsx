import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header/Header.tsx';
import ProductGrid from './components/ProductGrid/ProductGrid.tsx';
import Cart from './components/Cart/Cart.tsx';
import AdminPanel from './components/AdminPanel/AdminPanel.tsx';
import Login from './components/Login/Login.tsx';
import MobileBanner from './components/MobileBanner/MobileBanner.tsx';
import Checkout from './components/Checkout/Checkout.tsx';
import UserProfile from './components/UserProfile/UserProfile.tsx';
import TestCheckout from './components/TestCheckout/TestCheckout.tsx';
import AddProductPage from './components/AddProductPage/AddProductPage.tsx';
import { Language, Product, CartItem, ProductUnit } from './types';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('ar');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'admin' | 'user'>('user');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'link' | 'cash'>('cash');
  const [deliveryPrice] = useState(2.000);
  const [isAddProductPageOpen, setIsAddProductPageOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const storedUserType = localStorage.getItem('userType') as 'admin' | 'user';
    const storedUserName = localStorage.getItem('userName') || '';
    const storedUserEmail = localStorage.getItem('userEmail') || '';
    
    setIsLoggedIn(userLoggedIn);
    setUserType(storedUserType);
    setUserName(storedUserName);
    setUserEmail(storedUserEmail);

    // Load cart items from localStorage
    try {
      const savedCartItems = localStorage.getItem('cartItems');
      if (savedCartItems) {
        const parsedCartItems = JSON.parse(savedCartItems);
        setCartItems(parsedCartItems);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart items to localStorage whenever cartItems changes
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  // Load products from server or localStorage
  useEffect(() => {
    const loadProducts = async () => {
      console.log('🔄 Loading products...');
      
      try {
        // محاولة تحميل من الخادم أولاً
        console.log('🌐 Attempting to load from server API...');
        const response = await fetch('/api/products.php');
        
        if (response.ok) {
          const result = await response.json();
          console.log('✅ Server response:', result);
          
          if (result.success && result.products) {
            setProducts(result.products);
            console.log('✅ Loaded products from server:', result.products.length);
            
            // حفظ نسخة احتياطية في localStorage
            try {
              localStorage.setItem('products', JSON.stringify(result.products));
              console.log('💾 Backup saved to localStorage');
            } catch (storageError) {
              console.warn('⚠️ localStorage backup failed (non-critical):', storageError);
            }
            return;
          }
        } else {
          console.warn('⚠️ Server response not ok:', response.status, response.statusText);
        }
      } catch (serverError) {
        console.warn('⚠️ Server load failed:', serverError);
      }
      
      // إذا فشل التحميل من الخادم، تحميل من localStorage
      console.log('🔄 Falling back to localStorage...');
      try {
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts);
          setProducts(parsedProducts);
          console.log('✅ Loaded products from localStorage:', parsedProducts.length);
          return;
        }
      } catch (localError) {
        console.error('❌ Error loading from localStorage:', localError);
      }
      
      // إذا فشل كلاهما، استخدام البيانات الافتراضية
      console.log('🔄 Using default products...');
      setProducts(defaultProducts as Product[]);
      localStorage.setItem('products', JSON.stringify(defaultProducts));
      console.log('✅ Initialized with default products:', defaultProducts.length);
    };
    
    loadProducts();
  }, []); // Empty dependency array to run only once

  // Sample products data - moved to separate variable
  const defaultProducts = [
    {
      id: 1,
      name: { ar: 'تفاح أحمر', en: 'Red Apple' },
      category: 'fruits',
      units: [
        { id: 1, unit: { ar: 'كيلو', en: 'kg' }, price: 1.500, isDefault: true },
        { id: 2, unit: { ar: 'نصف كيلو', en: '500g' }, price: 0.750, isDefault: false },
        { id: 3, unit: { ar: 'حبة', en: 'piece' }, price: 0.100, isDefault: false }
      ],
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300',
      images: [
        'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300',
        'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=300'
      ],
      tags: ['بدون حب', 'جودة ممتازة'],
      description: { ar: 'تفاح أحمر طازج وعالي الجودة', en: 'Fresh high-quality red apples' },
      isPublished: true,
      stock: 50,
      minStock: 10,
      barcode: '',
      supplier: '',
      origin: { ar: 'لبنان', en: 'Lebanon' },
      nutritionFacts: {
        calories: '52',
        protein: '0.3',
        carbs: '14',
        fat: '0.2',
        fiber: '2.4',
        vitamins: 'فيتامين C'
      },
      storageInstructions: { ar: 'يحفظ في الثلاجة', en: 'Store in refrigerator' },
      isOrganic: false,
      isFresh: true,
      shelfLife: '7-10 أيام',
      discount: {
        enabled: false,
        percentage: 0,
        startDate: '',
        endDate: ''
      }
    },
    {
      id: 2,
      name: { ar: 'موز', en: 'Banana' },
      category: 'fruits',
      units: [
        { id: 1, unit: { ar: 'سحارة', en: 'bunch' }, price: 0.800, isDefault: true },
        { id: 2, unit: { ar: 'كيلو', en: 'kg' }, price: 1.200, isDefault: false },
        { id: 3, unit: { ar: 'حبة', en: 'piece' }, price: 0.050, isDefault: false }
      ],
      images: [
        'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300',
        'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=300'
      ],
      tags: ['فاكهه موسمية'],
      isPublished: true,
      stock: 30
    },
    {
      id: 3,
      name: { ar: 'طماطم', en: 'Tomato' },
      category: 'vegetables',
      units: [
        { id: 1, unit: { ar: 'كيلو', en: 'kg' }, price: 1.200, isDefault: true },
        { id: 2, unit: { ar: 'نصف كيلو', en: '500g' }, price: 0.600, isDefault: false },
        { id: 3, unit: { ar: 'حبة', en: 'piece' }, price: 0.080, isDefault: false }
      ],
      images: [
        'https://images.unsplash.com/photo-1546470427-e26264be0b5d?w=300',
        'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=300'
      ],
      tags: ['قريباً ينتهي'],
      isPublished: true,
      stock: 25
    },
    {
      id: 4,
      name: { ar: 'خس', en: 'Lettuce' },
      category: 'leafy',
      units: [
        { id: 1, unit: { ar: 'حبة', en: 'piece' }, price: 0.500, isDefault: true },
        { id: 2, unit: { ar: 'كيس', en: 'bag' }, price: 1.000, isDefault: false }
      ],
      images: [
        'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=300'
      ],
      isPublished: true,
      stock: 20
    },
    {
      id: 5,
      name: { ar: 'برتقال', en: 'Orange' },
      category: 'fruits',
      units: [
        { id: 1, unit: { ar: 'كيلو', en: 'kg' }, price: 1.800, isDefault: true },
        { id: 2, unit: { ar: 'حبة', en: 'piece' }, price: 0.150, isDefault: false },
        { id: 3, unit: { ar: 'كيس (2 كيلو)', en: 'bag (2kg)' }, price: 3.400, isDefault: false }
      ],
      images: [
        'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300',
        'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=300'
      ],
      tags: ['فيتامين سي', 'عصير طازج'],
      isPublished: true,
      stock: 40
    },
    {
      id: 6,
      name: { ar: 'عنب أحمر', en: 'Red Grapes' },
      category: 'fruits',
      units: [
        { id: 1, unit: { ar: 'كيلو', en: 'kg' }, price: 3.500, isDefault: true },
        { id: 2, unit: { ar: 'نصف كيلو', en: '500g' }, price: 1.800, isDefault: false },
        { id: 3, unit: { ar: 'عنقود', en: 'bunch' }, price: 2.200, isDefault: false }
      ],
      images: [
        'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=300',
        'https://images.unsplash.com/photo-1599819177032-6a732d4b7fb2?w=300'
      ],
      tags: ['بدون حب', 'حلو'],
      isPublished: true,
      stock: 25
    },
    {
      id: 7,
      name: { ar: 'مانجو', en: 'Mango' },
      category: 'fruits',
      units: [
        { id: 1, unit: { ar: 'حبة', en: 'piece' }, price: 1.200, isDefault: true },
        { id: 2, unit: { ar: 'كيلو', en: 'kg' }, price: 4.500, isDefault: false },
        { id: 3, unit: { ar: 'كرتون (5 كيلو)', en: 'carton (5kg)' }, price: 20.000, isDefault: false }
      ],
      images: [
        'https://images.unsplash.com/photo-1553279744-fa7a96c240fd?w=300',
        'https://images.unsplash.com/photo-1605528309219-d1f2e8577bf4?w=300'
      ],
      tags: ['فاكهه موسمية', 'استوائية'],
      isPublished: true,
      stock: 30
    },
    {
      id: 8,
      name: { ar: 'فراولة', en: 'Strawberry' },
      category: 'fruits',
      units: [
        { id: 1, unit: { ar: 'علبة', en: 'box' }, price: 2.000, isDefault: true },
        { id: 2, unit: { ar: 'كيلو', en: 'kg' }, price: 6.000, isDefault: false },
        { id: 3, unit: { ar: 'حبة', en: 'piece' }, price: 0.100, isDefault: false }
      ],
      images: [
        'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300',
        'https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=300'
      ],
      tags: ['قريباً ينتهي', 'حلوى طبيعية'],
      isPublished: true,
      stock: 15
    },
    {
      id: 9,
      name: { ar: 'أناناس', en: 'Pineapple' },
      category: 'fruits',
      units: [
        { id: 1, unit: { ar: 'حبة', en: 'piece' }, price: 3.500, isDefault: true },
        { id: 2, unit: { ar: 'شرائح مقطعة', en: 'sliced' }, price: 4.200, isDefault: false },
        { id: 3, unit: { ar: 'نصف حبة', en: 'half piece' }, price: 1.800, isDefault: false }
      ],
      images: [
        'https://images.unsplash.com/photo-1587393855524-087f83d48547?w=300',
        'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=300'
      ],
      tags: ['استوائية', 'عصير طازج'],
      isPublished: true,
      stock: 12
    },
    {
      id: 10,
      name: { ar: 'كيوي', en: 'Kiwi' },
      category: 'fruits',
      units: [
        { id: 1, unit: { ar: 'حبة', en: 'piece' }, price: 0.300, isDefault: true },
        { id: 2, unit: { ar: 'كيلو', en: 'kg' }, price: 2.800, isDefault: false },
        { id: 3, unit: { ar: 'علبة (6 حبات)', en: 'box (6 pieces)' }, price: 1.600, isDefault: false }
      ],
      images: [
        'https://images.unsplash.com/photo-1585059895524-72d1b4bcdfe1?w=300',
        'https://images.unsplash.com/photo-1527325678964-54921661f888?w=300'
      ],
      tags: ['فيتامين سي', 'صحي'],
      isPublished: true,
      stock: 35
    },
    {
      id: 11,
      name: { ar: 'أفوكادو', en: 'Avocado' },
      category: 'fruits',
      units: [
        { id: 1, unit: { ar: 'حبة', en: 'piece' }, price: 1.500, isDefault: true },
        { id: 2, unit: { ar: 'كيلو', en: 'kg' }, price: 5.500, isDefault: false },
        { id: 3, unit: { ar: 'علبة (4 حبات)', en: 'box (4 pieces)' }, price: 5.800, isDefault: false }
      ],
      images: [
        'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300',
        'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=300'
      ],
      tags: ['دهون صحية', 'جودة ممتازة'],
      isPublished: true,
      stock: 20
    },
    {
      id: 12,
      name: { ar: 'رمان', en: 'Pomegranate' },
      category: 'fruits',
      units: [
        { id: 1, unit: { ar: 'حبة', en: 'piece' }, price: 2.200, isDefault: true },
        { id: 2, unit: { ar: 'كيلو', en: 'kg' }, price: 6.500, isDefault: false },
        { id: 3, unit: { ar: 'حب مقشر', en: 'peeled seeds' }, price: 3.800, isDefault: false }
      ],
      images: [
        'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=300',
        'https://images.unsplash.com/photo-1610414819097-b4a86e5c6e4e?w=300'
      ],
      tags: ['مضاد أكسدة', 'فاكهه موسمية'],
      isPublished: true,
      stock: 18
    },
    {
      id: 13,
      name: { ar: 'خوخ', en: 'Peach' },
      category: 'fruits',
      units: [
        { id: 1, unit: { ar: 'حبة', en: 'piece' }, price: 0.400, isDefault: true },
        { id: 2, unit: { ar: 'كيلو', en: 'kg' }, price: 3.200, isDefault: false },
        { id: 3, unit: { ar: 'علبة (1 كيلو)', en: 'box (1kg)' }, price: 3.000, isDefault: false }
      ],
      images: [
        'https://images.unsplash.com/photo-1629828790715-c2051bda5725?w=300',
        'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=300'
      ],
      tags: ['فاكهه موسمية', 'عصيري'],
      isPublished: true,
      stock: 22
    },
    {
      id: 14,
      name: { ar: 'تين', en: 'Fig' },
      category: 'fruits',
      units: [
        { id: 1, unit: { ar: 'حبة', en: 'piece' }, price: 0.200, isDefault: true },
        { id: 2, unit: { ar: 'كيلو', en: 'kg' }, price: 4.500, isDefault: false },
        { id: 3, unit: { ar: 'علبة صغيرة', en: 'small box' }, price: 2.000, isDefault: false }
      ],
      images: [
        'https://images.unsplash.com/photo-1568302237260-1ba25f1382ff?w=300',
        'https://images.unsplash.com/photo-1607206253003-bb4adeff6b86?w=300'
      ],
      tags: ['قريباً ينتهي', 'طبيعي'],
      isPublished: true,
      stock: 8
    },
    {
      id: 15,
      name: { ar: 'تمر', en: 'Dates' },
      category: 'fruits',
      units: [
        { id: 1, unit: { ar: 'كيلو', en: 'kg' }, price: 8.500, isDefault: true },
        { id: 2, unit: { ar: 'علبة (500 جرام)', en: 'box (500g)' }, price: 4.500, isDefault: false },
        { id: 3, unit: { ar: 'علبة فاخرة', en: 'premium box' }, price: 12.000, isDefault: false }
      ],
      images: [
        'https://images.unsplash.com/photo-1606411354181-17756a88c4dd?w=300',
        'https://images.unsplash.com/photo-1578842204697-3de523c64e72?w=300'
      ],
      tags: ['جودة ممتازة', 'تمور مجدول'],
      isPublished: true,
      stock: 50
    },
    {
      id: 16,
      name: { ar: 'جوافة', en: 'Guava' },
      category: 'fruits',
      units: [
        { id: 1, unit: { ar: 'حبة', en: 'piece' }, price: 0.500, isDefault: true },
        { id: 2, unit: { ar: 'كيلو', en: 'kg' }, price: 2.800, isDefault: false },
        { id: 3, unit: { ar: 'كيس (2 كيلو)', en: 'bag (2kg)' }, price: 5.200, isDefault: false }
      ],
      images: [
        'https://images.unsplash.com/photo-1591994071104-7fa4ab1c6880?w=300',
        'https://images.unsplash.com/photo-1606994533517-c27e50b32b25?w=300'
      ],
      tags: ['فيتامين سي', 'فاكهه موسمية'],
      isPublished: true,
      stock: 25
    },
    {
      id: 17,
      name: { ar: 'جوز هند', en: 'Coconut' },
      category: 'fruits',
      units: [
        { id: 1, unit: { ar: 'حبة', en: 'piece' }, price: 2.500, isDefault: true },
        { id: 2, unit: { ar: 'لب مبروش', en: 'shredded flesh' }, price: 3.200, isDefault: false },
        { id: 3, unit: { ar: 'ماء جوز هند', en: 'coconut water' }, price: 1.500, isDefault: false }
      ],
      images: [
        'https://images.unsplash.com/photo-1481686390146-9b80eeec7b96?w=300',
        'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=300'
      ],
      tags: ['استوائية', 'منعش'],
      isPublished: true,
      stock: 15
    },
    {
      id: 18,
      name: { ar: 'ليمون', en: 'Lemon' },
      category: 'fruits',
      units: [
        { id: 1, unit: { ar: 'حبة', en: 'piece' }, price: 0.100, isDefault: true },
        { id: 2, unit: { ar: 'كيلو', en: 'kg' }, price: 1.800, isDefault: false },
        { id: 3, unit: { ar: 'كيس (2 كيلو)', en: 'bag (2kg)' }, price: 3.400, isDefault: false }
      ],
      images: [
        'https://images.unsplash.com/photo-1590502593747-42a996133562?w=300',
        'https://images.unsplash.com/photo-1568158879083-c42c4c8e5dac?w=300'
      ],
      tags: ['فيتامين سي', 'للطبخ'],
      isPublished: true,
      stock: 45
    },
    {
      id: 19,
      name: { ar: 'يوسفي', en: 'Mandarin' },
      category: 'fruits',
      units: [
        { id: 1, unit: { ar: 'كيلو', en: 'kg' }, price: 2.200, isDefault: true },
        { id: 2, unit: { ar: 'حبة', en: 'piece' }, price: 0.180, isDefault: false },
        { id: 3, unit: { ar: 'شبكة (3 كيلو)', en: 'net (3kg)' }, price: 6.300, isDefault: false }
      ],
      images: [
        'https://images.unsplash.com/photo-1482694542668-4f541a2deb60?w=300',
        'https://images.unsplash.com/photo-1557800634-7bf3c7305596?w=300'
      ],
      tags: ['فاكهه موسمية', 'سهل التقشير'],
      isPublished: true,
      stock: 35
    },
    {
      id: 20,
      name: { ar: 'بطيخ', en: 'Watermelon' },
      category: 'fruits',
      units: [
        { id: 1, unit: { ar: 'حبة صغيرة', en: 'small piece' }, price: 3.500, isDefault: true },
        { id: 2, unit: { ar: 'حبة كبيرة', en: 'large piece' }, price: 6.500, isDefault: false },
        { id: 3, unit: { ar: 'ربع حبة', en: 'quarter piece' }, price: 1.200, isDefault: false }
      ],
      images: [
        'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=300',
        'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=300'
      ],
      tags: ['منعش', 'فاكهه صيفية'],
      isPublished: true,
      stock: 10
    }
  ];

  // Products state
  const [products, setProducts] = useState<Product[]>([]);

  const addToCart = (product: Product, selectedUnit: ProductUnit, quantity: number) => {
    const existingItem = cartItems.find(item => 
      item.product.id === product.id && item.selectedUnit.id === selectedUnit.id
    );
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.product.id === product.id && item.selectedUnit.id === selectedUnit.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCartItems([...cartItems, { product, selectedUnit, quantity }]);
    }
  };

  const handleOpenAddProduct = () => {
    console.log('Opening add product page...');
    console.log('App state before:', { isAddProductPageOpen, isAdminOpen });
    setIsAddProductPageOpen(true);
    // لا نقفل لوحة الإدارة، بل نخفيها مؤقتاً
  };

  const handleCloseAddProduct = () => {
    setIsAddProductPageOpen(false);
  };

  const updateCartItem = (productId: number, unitId: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(cartItems.filter(item => 
        !(item.product.id === productId && item.selectedUnit.id === unitId)
      ));
    } else {
      setCartItems(cartItems.map(item =>
        item.product.id === productId && item.selectedUnit.id === unitId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const clearCart = () => {
    setCartItems([]);
    // Also clear from localStorage explicitly
    try {
      localStorage.removeItem('cartItems');
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error);
    }
  };

  // Product management functions
  const addProduct = async (productData: Omit<Product, 'id'>): Promise<void> => {
    console.log('🎯 addProduct function called in App.tsx');
    console.log('📦 Received product data:', productData);
    console.log('📊 Current products count:', products.length);
    
    try {
      // التحقق من صحة البيانات المستلمة
      if (!productData) {
        throw new Error('Product data is null or undefined');
      }
      
      if (!productData.name || !productData.name.ar || !productData.name.en) {
        throw new Error(`Invalid product name: ${JSON.stringify(productData.name)}`);
      }
      
      if (!productData.units || !Array.isArray(productData.units) || productData.units.length === 0) {
        throw new Error(`Invalid product units: ${JSON.stringify(productData.units)}`);
      }
      
      const hasDefaultUnit = productData.units.some(unit => unit.isDefault);
      if (!hasDefaultUnit) {
        throw new Error('No default unit specified in product data');
      }
      
      console.log('✅ Product data validation passed');
      
      // إرسال المنتج إلى API الخاص بالخادم
      console.log('🌐 Sending product to server API...');
      
      const response = await fetch('/api/products.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      
      console.log('📡 Server response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server error response:', errorText);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Server response:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Server returned success: false');
      }
      
      // إضافة المنتج الجديد للحالة المحلية
      const newProduct = result.product;
      console.log('🆕 New product from server:', newProduct);
      
      const updatedProducts = [...products, newProduct];
      console.log('📈 Updated products count:', updatedProducts.length);
      
      // تحديث الحالة المحلية
      console.log('🔄 Updating React state...');
      setProducts(updatedProducts);
      console.log('✅ React state updated successfully');
      
      // أيضاً حفظ نسخة احتياطية في localStorage
      try {
        const dataToSave = JSON.stringify(updatedProducts);
        localStorage.setItem('products', dataToSave);
        console.log('💾 Backup saved to localStorage');
      } catch (storageError) {
        console.warn('⚠️ localStorage backup failed (non-critical):', storageError);
      }
      
      // تنزيل ملف products.json المحدث
      setTimeout(() => {
        try {
          console.log('📥 Starting auto-download of updated products.json...');
          const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(JSON.stringify(updatedProducts, null, 2));
          
          const exportFileDefaultName = 'products.json';
          const linkElement = document.createElement('a');
          linkElement.setAttribute('href', dataUri);
          linkElement.setAttribute('download', exportFileDefaultName);
          linkElement.style.display = 'none';
          document.body.appendChild(linkElement);
          linkElement.click();
          document.body.removeChild(linkElement);
          
          console.log('📥 Updated products.json downloaded successfully');
        } catch (downloadError) {
          console.error('📥 Download error (non-critical):', downloadError);
          // لا نرمي خطأ هنا لأن التنزيل اختياري
        }
      }, 1000);
      
      console.log('🎉 Product added successfully to server and local state!');
      
    } catch (error) {
      console.error('❌ CRITICAL ERROR in addProduct function:');
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error?.constructor?.name);
      console.error('Error message:', error instanceof Error ? error.message : error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      console.error('Current products array:', products);
      console.error('Received product data:', productData);
      
      // في حالة فشل API، محاولة الحفظ المحلي كنسخة احتياطية
      if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('Server error'))) {
        console.log('🔄 API failed, attempting localStorage fallback...');
        try {
          const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
          const newProduct: Product = { ...productData, id: newId };
          const updatedProducts = [...products, newProduct];
          
          localStorage.setItem('products', JSON.stringify(updatedProducts));
          setProducts(updatedProducts);
          
          console.log('✅ Fallback save to localStorage successful');
          console.warn('⚠️ Product saved locally only - will sync when server is available');
          return;
        } catch (fallbackError) {
          console.error('❌ Fallback save also failed:', fallbackError);
        }
      }
      
      throw error; // إعادة رمي الخطأ ليتم التعامل معه في AddProductPage
    }
  };

  const updateProduct = (id: number, productData: Partial<Product>) => {
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, ...productData } : product
    );
    setProducts(updatedProducts);
    
    // Save to localStorage
    try {
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    } catch (error) {
      console.error('Error saving updated product to localStorage:', error);
    }
  };

  const deleteProduct = (id: number) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    
    // Remove from cart if exists
    setCartItems(cartItems.filter(item => item.product.id !== id));
    
    // Save to localStorage
    try {
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    } catch (error) {
      console.error('Error saving after product deletion to localStorage:', error);
    }
  };

  // Authentication functions
  const handleLogin = (loginUserType: 'admin' | 'user', loginUserEmail: string) => {
    const storedUserName = localStorage.getItem('userName') || '';
    setIsLoggedIn(true);
    setUserType(loginUserType);
    setUserEmail(loginUserEmail);
    setUserName(storedUserName);
    setIsLoginOpen(false);
    
    if (loginUserType === 'admin') {
      setIsAdminOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserType('user');
    setUserName('');
    setUserEmail('');
    setIsAdminOpen(false);
  };

  const openAdminPanel = () => {
    if (isLoggedIn && userType === 'admin') {
      setIsAdminOpen(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  // Check for test mode activation (Admin secret)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('test') === 'checkout') {
      setIsTestMode(true);
    }
  }, []);

  const handleCheckout = (selectedPaymentMethod: 'link' | 'cash') => {
    setPaymentMethod(selectedPaymentMethod);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    clearCart();
    setIsCheckoutOpen(false);
  };

  return (
    <div className={`App ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {isAddProductPageOpen && isLoggedIn && userType === 'admin' ? (
        <AddProductPage
          language={language}
          onAddProduct={addProduct}
          onBack={handleCloseAddProduct}
        />
      ) : isTestMode ? (
        <TestCheckout />
      ) : (
        <>
          <Header 
            language={language}
            onLanguageChange={setLanguage}
            cartItemsCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
            onCartClick={() => setIsCartOpen(!isCartOpen)}
            onAdminClick={openAdminPanel}
            onLoginClick={() => setIsLoginOpen(true)}
            isLoggedIn={isLoggedIn}
        userType={userType}
        userName={userName}
        userEmail={userEmail}
        onLogout={handleLogout}
        onProfileClick={() => setIsProfileOpen(true)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
      />
      
      <main className="main-content">
        <MobileBanner />
        <ProductGrid 
          products={products}
          language={language}
          onAddToCart={addToCart}
            searchTerm={searchTerm}
        />
      </main>

      {isCartOpen && (
        <Cart
          items={cartItems}
          language={language}
          deliveryPrice={deliveryPrice}
          onUpdateItem={updateCartItem}
          onClearCart={clearCart}
          onClose={() => setIsCartOpen(false)}
          onCheckout={handleCheckout}
        />
      )}

      {isLoginOpen && (
        <Login
          language={language}
          onLogin={handleLogin}
          onClose={() => setIsLoginOpen(false)}
        />
      )}

      {/* Admin Panel - Hide when add product page is open */}
      {isAdminOpen && isLoggedIn && userType === 'admin' && !isAddProductPageOpen && (
        <AdminPanel
          language={language}
          products={products}
          onAddProduct={addProduct}
          onUpdateProduct={updateProduct}
          onDeleteProduct={deleteProduct}
          onClose={() => setIsAdminOpen(false)}
          onLogout={handleLogout}
          onOpenAddProduct={handleOpenAddProduct}
        />
      )}

      {isCheckoutOpen && (
        <Checkout
          items={cartItems}
          language={language}
          deliveryPrice={deliveryPrice}
          paymentMethod={paymentMethod}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderComplete={handleOrderComplete}
        />
      )}

      {isProfileOpen && isLoggedIn && (
        <div className="profile-modal-overlay" onClick={() => setIsProfileOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <UserProfile
              language={language}
              userType={userType}
              userName={userName}
              userEmail={userEmail}
              onLogout={() => {
                setIsProfileOpen(false);
                handleLogout();
              }}
              onAdminPanel={userType === 'admin' ? () => {
                setIsProfileOpen(false);
                setIsAdminOpen(true);
              } : undefined}
              isDropdown={false}
              onClose={() => setIsProfileOpen(false)}
            />
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default App;