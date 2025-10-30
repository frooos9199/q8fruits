import React, { useState } from 'react';
import { Product, Language, ProductCategory } from '../../types';
import AdminDashboard from '../AdminDashboard/AdminDashboard.tsx';
import './AdminPanel.css';
import './Orders.css';

interface AdminPanelProps {
  language: Language;
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: number, product: Partial<Product>) => void;
  onDeleteProduct: (id: number) => void;
  onClose: () => void;
  onLogout?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  language,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onClose,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'add' | 'orders' | 'units' | 'settings'>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deliveryPrice, setDeliveryPrice] = useState(2.000);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Units management state
  const [units, setUnits] = useState([
    { id: 1, ar: 'كيلو', en: 'kg' },
    { id: 2, ar: 'حبة', en: 'piece' },
    { id: 3, ar: 'سحارة', en: 'bunch' },
    { id: 4, ar: 'علبة', en: 'box' },
    { id: 5, ar: 'كرتون', en: 'carton' },
    { id: 6, ar: 'جرام', en: 'gram' },
    { id: 7, ar: 'لتر', en: 'liter' }
  ]);
  const [newUnit, setNewUnit] = useState({ ar: '', en: '' });
  const [editingUnit, setEditingUnit] = useState<{ id: number; ar: string; en: string } | null>(null);
  const [newTag, setNewTag] = useState('');

  // Sample orders data
  const [orders] = useState([
    {
      id: 'FK1698567890123',
      customerName: 'أحمد محمد',
      customerPhone: '66778899',
      customerEmail: 'ahmed@example.com',
      customerAddress: 'شارع الخليج العربي، بيت 15',
      customerArea: 'العاصمة',
      items: [
        { name: { ar: 'تفاح أحمر', en: 'Red Apple' }, quantity: 2, unit: { ar: 'كيلو', en: 'kg' }, price: 1.500, total: 3.000 },
        { name: { ar: 'موز', en: 'Banana' }, quantity: 1, unit: { ar: 'سحارة', en: 'bunch' }, price: 0.800, total: 0.800 }
      ],
      subtotal: 3.800,
      deliveryPrice: 2.000,
      total: 5.800,
      paymentMethod: 'cash',
      status: 'pending',
      date: '2025-10-28',
      time: '14:30'
    },
    {
      id: 'FK1698567890124',
      customerName: 'فاطمة علي',
      customerPhone: '55443322',
      customerEmail: 'fatima@example.com',
      customerAddress: 'شارع السالمية، شقة 25',
      customerArea: 'حولي',
      items: [
        { name: { ar: 'خس', en: 'Lettuce' }, quantity: 2, unit: { ar: 'حبة', en: 'piece' }, price: 0.500, total: 1.000 },
        { name: { ar: 'طماطم', en: 'Tomato' }, quantity: 1, unit: { ar: 'كيلو', en: 'kg' }, price: 1.200, total: 1.200 }
      ],
      subtotal: 2.200,
      deliveryPrice: 2.000,
      total: 4.200,
      paymentMethod: 'link',
      status: 'confirmed',
      date: '2025-10-28',
      time: '13:15'
    },
    {
      id: 'FK1698567890125',
      customerName: 'سارة أحمد',
      customerPhone: '99887766',
      customerEmail: 'sara@example.com',
      customerAddress: 'منطقة الفنطاس، فيلا 8',
      customerArea: 'الأحمدي',
      items: [
        { name: { ar: 'برتقال', en: 'Orange' }, quantity: 3, unit: { ar: 'كيلو', en: 'kg' }, price: 1.800, total: 5.400 },
        { name: { ar: 'فراولة', en: 'Strawberry' }, quantity: 2, unit: { ar: 'علبة', en: 'box' }, price: 2.000, total: 4.000 }
      ],
      subtotal: 9.400,
      deliveryPrice: 2.000,
      total: 11.400,
      paymentMethod: 'cash',
      status: 'delivered',
      date: '2025-10-27',
      time: '16:45'
    }
  ]);

  const texts = {
    ar: {
      title: 'لوحة الإدارة',
      dashboard: 'لوحة المعلومات',
      productList: 'قائمة المنتجات',
      addProduct: 'إضافة منتج',
      orders: 'إدارة الطلبات',
      units: 'إدارة الوحدات',
      settings: 'الإعدادات',
      close: 'إغلاق',
      name: 'اسم المنتج',
      nameAr: 'الاسم بالعربية',
      nameEn: 'الاسم بالإنجليزية',
      category: 'الفئة',
      price: 'السعر (د.ك)',
      unit: 'الوحدة',
      unitAr: 'الوحدة بالعربية',
      unitEn: 'الوحدة بالإنجليزية',
      stock: 'الكمية المتاحة',
      image: 'رابط الصورة',
      description: 'الوصف',
      descriptionAr: 'الوصف بالعربية',
      descriptionEn: 'الوصف بالإنجليزية',
      published: 'منشور',
      save: 'حفظ',
      cancel: 'إلغاء',
      edit: 'تعديل',
      delete: 'حذف',
      confirm: 'تأكيد',
      fruits: 'فواكه',
      vegetables: 'خضار',
      leafy: 'ورقيات',
      baskets: 'سلات',
      deliverySettings: 'إعدادات التوصيل',
      deliveryPrice: 'سعر التوصيل (د.ك)',
      kg: 'كيلو',
      bunch: 'سحارة',
      piece: 'حبة',
      deleteConfirm: 'هل أنت متأكد من حذف هذا المنتج؟',
      unitsManagement: 'إدارة الوحدات',
      addUnit: 'إضافة وحدة جديدة',
      unitsList: 'قائمة الوحدات',
      unitArabic: 'الوحدة بالعربية',
      unitEnglish: 'الوحدة بالإنجليزية',
      addNewUnit: 'إضافة وحدة',
      editUnit: 'تعديل الوحدة',
      saveUnit: 'حفظ الوحدة',
      deleteUnit: 'حذف الوحدة',
      deleteUnitConfirm: 'هل أنت متأكد من حذف هذه الوحدة؟',
      // Orders texts
      ordersManagement: 'إدارة الطلبات',
      orderNumber: 'رقم الطلب',
      customer: 'العميل',
      customerInfo: 'بيانات العميل',
      phone: 'الهاتف',
      email: 'البريد الإلكتروني',
      address: 'العنوان',
      area: 'المحافظة',
      orderDate: 'تاريخ الطلب',
      orderTime: 'وقت الطلب',
      orderItems: 'عناصر الطلب',
      quantity: 'الكمية',
      unitPrice: 'سعر الوحدة',
      itemTotal: 'المجموع',
      subtotal: 'المجموع الفرعي',
      delivery: 'التوصيل',
      totalAmount: 'المبلغ الإجمالي',
      paymentMethod: 'طريقة الدفع',
      cash: 'نقدي',
      link: 'لينك',
      orderStatus: 'حالة الطلب',
      pending: 'قيد الانتظار',
      confirmed: 'مؤكد',
      delivered: 'تم التوصيل',
      cancelled: 'ملغي',
      changeStatus: 'تغيير الحالة',
      viewDetails: 'عرض التفاصيل',
      printInvoice: 'طباعة الفاتورة',
      items: 'العناصر',
      kwd: 'د.ك',
      deliveryFee: 'رسوم التوصيل',
      total: 'المجموع',
      logout: 'تسجيل خروج',
      search: 'البحث',
      searchPlaceholder: 'ابحث عن منتج...',
      filterByCategory: 'تصفية حسب الفئة',
      filterByStatus: 'تصفية حسب الحالة',
      allCategories: 'جميع الفئات',
      allStatuses: 'جميع الحالات',
      statusPublished: 'منشور',
      statusUnpublished: 'مخفي',
      noResults: 'لا توجد نتائج',
      clearSearch: 'مسح البحث'
    },
    en: {
      title: 'Admin Panel',
      dashboard: 'Dashboard',
      productList: 'Product List',
      addProduct: 'Add Product',
      orders: 'Orders Management',
      units: 'Units Management',
      settings: 'Settings',
      close: 'Close',
      name: 'Product Name',
      nameAr: 'Name in Arabic',
      nameEn: 'Name in English',
      category: 'Category',
      price: 'Price (KWD)',
      unit: 'Unit',
      unitAr: 'Unit in Arabic',
      unitEn: 'Unit in English',
      stock: 'Stock',
      image: 'Image URL',
      description: 'Description',
      descriptionAr: 'Description in Arabic',
      descriptionEn: 'Description in English',
      published: 'Published',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      confirm: 'Confirm',
      fruits: 'Fruits',
      vegetables: 'Vegetables',
      leafy: 'Leafy Greens',
      baskets: 'Baskets',
      deliverySettings: 'Delivery Settings',
      deliveryPrice: 'Delivery Price (KWD)',
      kg: 'kg',
      bunch: 'bunch',
      piece: 'piece',
      deleteConfirm: 'Are you sure you want to delete this product?',
      unitsManagement: 'Units Management',
      addUnit: 'Add New Unit',
      unitsList: 'Units List',
      unitArabic: 'Unit in Arabic',
      unitEnglish: 'Unit in English',
      addNewUnit: 'Add Unit',
      editUnit: 'Edit Unit',
      saveUnit: 'Save Unit',
      deleteUnit: 'Delete Unit',
      deleteUnitConfirm: 'Are you sure you want to delete this unit?',
      // Orders texts
      ordersManagement: 'Orders Management',
      orderNumber: 'Order Number',
      customer: 'Customer',
      customerInfo: 'Customer Info',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      area: 'Area',
      orderDate: 'Order Date',
      orderTime: 'Order Time',
      orderItems: 'Order Items',
      quantity: 'Quantity',
      unitPrice: 'Unit Price',
      itemTotal: 'Total',
      subtotal: 'Subtotal',
      delivery: 'Delivery',
      totalAmount: 'Total Amount',
      paymentMethod: 'Payment Method',
      cash: 'Cash',
      link: 'Link',
      orderStatus: 'Order Status',
      pending: 'Pending',
      confirmed: 'Confirmed',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      changeStatus: 'Change Status',
      viewDetails: 'View Details',
      printInvoice: 'Print Invoice',
      items: 'Items',
      kwd: 'KWD',
      deliveryFee: 'Delivery Fee',
      total: 'Total',
      logout: 'Logout',
      search: 'Search',
      searchPlaceholder: 'Search for product...',
      filterByCategory: 'Filter by Category',
      filterByStatus: 'Filter by Status',
      allCategories: 'All Categories',
      allStatuses: 'All Statuses',
      statusPublished: 'Published',
      statusUnpublished: 'Hidden',
      noResults: 'No results found',
      clearSearch: 'Clear Search'
    }
  };

  const currentTexts = texts[language];

  // Sample orders data
  const sampleOrders = [
    {
      id: '1001',
      date: '2024-01-15 10:30 ص',
      status: 'pending',
      customer: {
        name: 'أحمد محمد',
        phone: '+965 9999 8888',
        email: 'ahmed@email.com',
        address: 'شارع الخليج العربي، بيت 15',
        area: 'الجهراء'
      },
      items: [
        { name: 'موز', quantity: 2, unit: 'كيلو', price: 1.500 },
        { name: 'تفاح أحمر', quantity: 1, unit: 'كيلو', price: 2.250 }
      ],
      subtotal: 3.750,
      deliveryFee: 1.000,
      total: 4.750,
      paymentMethod: 'نقداً عند التوصيل'
    },
    {
      id: '1002',
      date: '2024-01-15 11:45 ص',
      status: 'confirmed',
      customer: {
        name: 'فاطمة علي',
        phone: '+965 7777 6666',
        email: 'fatima@email.com',
        address: 'شارع الملك فهد، شقة 25',
        area: 'حولي'
      },
      items: [
        { name: 'برتقال', quantity: 3, unit: 'كيلو', price: 1.750 },
        { name: 'عنب أخضر', quantity: 1, unit: 'علبة', price: 3.500 }
      ],
      subtotal: 8.750,
      deliveryFee: 1.000,
      total: 9.750,
      paymentMethod: 'كي نت'
    },
    {
      id: '1003',
      date: '2024-01-15 14:20 م',
      status: 'delivered',
      customer: {
        name: 'خالد السالم',
        phone: '+965 5555 4444',
        email: 'khalid@email.com',
        address: 'شارع الأحمدي، بيت 8',
        area: 'الأحمدي'
      },
      items: [
        { name: 'فراولة', quantity: 2, unit: 'علبة', price: 2.500 },
        { name: 'كيوي', quantity: 1, unit: 'كيلو', price: 4.250 }
      ],
      subtotal: 9.250,
      deliveryFee: 1.500,
      total: 10.750,
      paymentMethod: 'فيزا'
    }
  ];

  const categories: { key: ProductCategory; label: string }[] = [
    { key: 'fruits', label: currentTexts.fruits },
    { key: 'vegetables', label: currentTexts.vegetables },
    { key: 'leafy', label: currentTexts.leafy },
    { key: 'baskets', label: currentTexts.baskets },
  ];

  // Use the managed units instead of hardcoded options
  const unitOptions = units;

  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    category: 'fruits' as ProductCategory,
    units: [{ id: 1, unit: { ar: 'كيلو', en: 'kg' }, price: 0, isDefault: true }],
    stock: 0,
    images: [] as string[],
    imageFiles: [] as File[],
    tags: [] as string[],
    descriptionAr: '',
    descriptionEn: '',
    isPublished: true,
  });

  const resetForm = () => {
    setFormData({
      nameAr: '',
      nameEn: '',
      category: 'fruits',
      units: [{ id: 1, unit: { ar: 'كيلو', en: 'kg' }, price: 0, isDefault: true }],
      stock: 0,
      images: [],
      imageFiles: [],
      tags: [],
      descriptionAr: '',
      descriptionEn: '',
      isPublished: true,
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nameAr: product.name.ar,
      nameEn: product.name.en,
      category: product.category,
      units: product.units,
      stock: product.stock,
      images: product.images,
      tags: product.tags || [],
      imageFiles: [],
      descriptionAr: product.description?.ar || '',
      descriptionEn: product.description?.en || '',
      isPublished: product.isPublished,
    });
    setActiveTab('add');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: { ar: formData.nameAr, en: formData.nameEn },
      category: formData.category,
      units: formData.units,
      stock: formData.stock,
      tags: formData.tags,
      images: formData.images,
      description: formData.descriptionAr || formData.descriptionEn ? {
        ar: formData.descriptionAr,
        en: formData.descriptionEn,
      } : undefined,
      isPublished: formData.isPublished,
    };

    if (editingProduct) {
      onUpdateProduct(editingProduct.id, productData);
    } else {
      onAddProduct(productData);
    }

    resetForm();
    setActiveTab('list');
  };

  const handleDelete = (id: number) => {
    if (window.confirm(currentTexts.deleteConfirm)) {
      onDeleteProduct(id);
    }
  };

  const togglePublished = (product: Product) => {
    onUpdateProduct(product.id, { isPublished: !product.isPublished });
  };

  // Units management functions for products
  const addUnitToProduct = () => {
    const newId = Math.max(...formData.units.map(u => u.id), 0) + 1;
    const newUnit = {
      id: newId,
      unit: { ar: '', en: '' },
      price: 0,
      isDefault: false
    };
    setFormData({
      ...formData,
      units: [...formData.units, newUnit]
    });
  };

  const updateProductUnit = (unitId: number, field: string, value: any) => {
    setFormData({
      ...formData,
      units: formData.units.map(unit => {
        if (unit.id === unitId) {
          if (field === 'unitAr') {
            return { ...unit, unit: { ...unit.unit, ar: value } };
          } else if (field === 'unitEn') {
            return { ...unit, unit: { ...unit.unit, en: value } };
          } else if (field === 'price') {
            return { ...unit, price: parseFloat(value) || 0 };
          } else if (field === 'isDefault') {
            // Ensure only one default unit
            const updatedUnits = formData.units.map(u => ({ ...u, isDefault: false }));
            return { ...unit, isDefault: true };
          }
        }
        return unit;
      })
    });
  };

  const removeProductUnit = (unitId: number) => {
    if (formData.units.length > 1) {
      const updatedUnits = formData.units.filter(unit => unit.id !== unitId);
      // If we removed the default unit, make the first one default
      if (formData.units.find(u => u.id === unitId)?.isDefault) {
        updatedUnits[0].isDefault = true;
      }
      setFormData({
        ...formData,
        units: updatedUnits
      });
    }
  };

  // Image management functions
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageUrls: string[] = [];
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          imageUrls.push(event.target.result as string);
          if (imageUrls.length === files.length) {
            setFormData({
              ...formData,
              images: [...formData.images, ...imageUrls],
              imageFiles: [...formData.imageFiles, ...files]
            });
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
      imageFiles: formData.imageFiles.filter((_, i) => i !== index)
    });
  };

  // Tags management functions
  const addTag = (tag: string) => {
    const t = tag.trim();
    if (!t) return;
    if (formData.tags.includes(t)) return;
    setFormData({ ...formData, tags: [...formData.tags, t] });
  };

  const removeTag = (index: number) => {
    setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== index) });
  };

  const quickAddTag = (tag: string) => {
    addTag(tag);
  };

  // Units management functions
  const handleAddUnit = () => {
    if (newUnit.ar.trim() && newUnit.en.trim()) {
      const newId = Math.max(...units.map(u => u.id)) + 1;
      setUnits([...units, { id: newId, ...newUnit }]);
      setNewUnit({ ar: '', en: '' });
    }
  };

  const handleEditUnit = (unit: { id: number; ar: string; en: string }) => {
    setEditingUnit(unit);
  };

  const handleSaveUnit = () => {
    if (editingUnit && editingUnit.ar.trim() && editingUnit.en.trim()) {
      setUnits(units.map(u => u.id === editingUnit.id ? editingUnit : u));
      setEditingUnit(null);
    }
  };

  const handleDeleteUnit = (id: number) => {
    if (window.confirm(currentTexts.deleteUnitConfirm)) {
      setUnits(units.filter(u => u.id !== id));
    }
  };

  // Order management functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#3b82f6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      pending: currentTexts.pending,
      confirmed: currentTexts.confirmed,
      delivered: currentTexts.delivered,
      cancelled: currentTexts.cancelled
    };
    return statusTexts[status as keyof typeof statusTexts] || status;
  };

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name.en.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'published' && product.isPublished) ||
      (statusFilter === 'unpublished' && !product.isPublished);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
  };

  return (
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-container" onClick={(e) => e.stopPropagation()}>
        <div className="admin-header">
          <h2>{currentTexts.title}</h2>
          <div className="header-actions">
            {onLogout && (
              <button className="logout-btn" onClick={onLogout}>
                🚪 {currentTexts.logout}
              </button>
            )}
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 {currentTexts.dashboard}
          </button>
          <button
            className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            📋 {currentTexts.productList}
          </button>
          <button
            className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            ➕ {currentTexts.addProduct}
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 {currentTexts.orders}
          </button>
          <button
            className={`tab-btn ${activeTab === 'units' ? 'active' : ''}`}
            onClick={() => setActiveTab('units')}
          >
            📏 {currentTexts.units}
          </button>
          <button
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ {currentTexts.settings}
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'dashboard' && (
            <AdminDashboard language={language} />
          )}
          
          {activeTab === 'list' && (
            <div className="product-list-container">
              {/* Search and Filter Controls */}
              <div className="search-filter-controls">
                <div className="search-section">
                  <div className="search-input-container">
                    <input
                      type="text"
                      placeholder={currentTexts.searchPlaceholder}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                    <span className="search-icon">🔍</span>
                  </div>
                  
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">{currentTexts.allCategories}</option>
                    <option value="fruits">فواكه / Fruits</option>
                    <option value="vegetables">خضروات / Vegetables</option>
                  </select>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">{currentTexts.allStatuses}</option>
                    <option value="published">{currentTexts.statusPublished}</option>
                    <option value="unpublished">{currentTexts.statusUnpublished}</option>
                  </select>
                  
                  {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all') && (
                    <button onClick={clearFilters} className="clear-filters-btn">
                      ❌ {currentTexts.clearSearch}
                    </button>
                  )}
                </div>
                
                <div className="results-info">
                  <span>
                    {filteredProducts.length} {language === 'ar' ? 'منتج' : 'products'}
                  </span>
                </div>
              </div>

              {/* Products Grid */}
              <div className="products-grid">
                {filteredProducts.length === 0 ? (
                  <div className="no-results">
                    <h3>😔 {currentTexts.noResults}</h3>
                    <p>{language === 'ar' ? 'جرب تعديل كلمات البحث أو التصفية' : 'Try adjusting your search or filters'}</p>
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <div key={product.id} className={`product-card ${!product.isPublished ? 'unpublished' : ''}`}>
                      <div className="product-image">
                        <img src={product.images[0] || '/placeholder.jpg'} alt={product.name[language]} />
                        <div className="product-status-badge">
                          <span className={`status-indicator ${product.isPublished ? 'published' : 'unpublished'}`}>
                            {product.isPublished ? '🟢' : '🔴'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="product-info">
                        <h4 className="product-title">{product.name[language]}</h4>
                        
                        <div className="product-units">
                          {product.units.map(unit => (
                            <div key={unit.id} className={`unit-price ${unit.isDefault ? 'default-unit' : ''}`}>
                              <span className="price">{unit.price.toFixed(3)} د.ك</span>
                              <span className="unit">/ {unit.unit[language]}</span>
                              {unit.isDefault && <span className="default-badge">افتراضي</span>}
                            </div>
                          ))}
                        </div>
                        
                        {product.tags && product.tags.length > 0 && (
                          <div className="product-tags">
                            {product.tags.slice(0, 2).map((tag, i) => (
                              <span key={i} className="tag-badge">{tag}</span>
                            ))}
                            {product.tags.length > 2 && (
                              <span className="more-tags">+{product.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                        
                        <div className="product-meta">
                          <span className="stock-info">المخزون: {product.stock}</span>
                          <span className="category-info">{product.category === 'fruits' ? '🥭' : '🥬'}</span>
                        </div>
                      </div>
                      
                      <div className="product-actions">
                        <button
                          className={`action-btn toggle-btn ${product.isPublished ? 'published' : 'unpublished'}`}
                          onClick={() => togglePublished(product)}
                          title={product.isPublished ? 'إخفاء المنتج' : 'نشر المنتج'}
                        >
                          {product.isPublished ? '👁️' : '🙈'}
                        </button>
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(product)}
                          title="تعديل المنتج"
                        >
                          ✏️
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(product.id)}
                          title="حذف المنتج"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'add' && (
            <form className="product-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>{currentTexts.nameAr}</label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{currentTexts.nameEn}</label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{currentTexts.category}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                  >
                    {categories.map((cat) => (
                      <option key={cat.key} value={cat.key}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>إدارة الوحدات والأسعار</label>
                  <div className="units-management">
                    {formData.units.map((unit, index) => (
                      <div key={unit.id} className="unit-item">
                        <div className="unit-inputs">
                          <input
                            type="text"
                            placeholder="الوحدة بالعربي"
                            value={unit.unit.ar}
                            onChange={(e) => updateProductUnit(unit.id, 'unitAr', e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="Unit in English"
                            value={unit.unit.en}
                            onChange={(e) => updateProductUnit(unit.id, 'unitEn', e.target.value)}
                          />
                          <input
                            type="number"
                            step="0.001"
                            placeholder="السعر"
                            value={unit.price}
                            onChange={(e) => updateProductUnit(unit.id, 'price', e.target.value)}
                          />
                          <label className="default-checkbox">
                            <input
                              type="checkbox"
                              checked={unit.isDefault}
                              onChange={(e) => updateProductUnit(unit.id, 'isDefault', e.target.checked)}
                            />
                            افتراضي
                          </label>
                          {formData.units.length > 1 && (
                            <button
                              type="button"
                              className="remove-unit-btn"
                              onClick={() => removeProductUnit(unit.id)}
                            >
                              حذف
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="add-unit-btn"
                      onClick={addUnitToProduct}
                    >
                      إضافة وحدة جديدة
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>{currentTexts.stock}</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>الصور</label>
                <div className="images-management">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="image-upload-input"
                  />
                  <div className="images-preview">
                    {formData.images.map((image, index) => (
                      <div key={index} className="image-preview-item">
                        <img src={image} alt={`صورة ${index + 1}`} />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => removeImage(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                </div>

                <div className="form-group">
                  <label>شارات (Tags)</label>
                  <div className="tags-management">
                    <div className="add-tag-row">
                      <input
                        type="text"
                        placeholder="أضف شارة جديدة..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(newTag); setNewTag(''); } }}
                      />
                      <button type="button" className="add-unit-btn" onClick={() => { addTag(newTag); setNewTag(''); }}>
                        إضافة
                      </button>
                    </div>
                    <div className="quick-tags">
                      <button type="button" className="category-btn" onClick={() => quickAddTag('بدون حب')}>بدون حب</button>
                      <button type="button" className="category-btn" onClick={() => quickAddTag('فاكهه موسمية')}>فاكهه موسمية</button>
                      <button type="button" className="category-btn" onClick={() => quickAddTag('جودة ممتازة')}>جودة ممتازة</button>
                      <button type="button" className="category-btn" onClick={() => quickAddTag('قريباً ينتهي')}>قريباً ينتهي</button>
                    </div>
                    <div className="tags-list">
                      {formData.tags.map((tag, idx) => (
                        <span key={idx} className="tag-badge">
                          {tag}
                          <button type="button" className="remove-tag-btn" onClick={() => removeTag(idx)}>✕</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-row">
                <div className="form-group">
                  <label>{currentTexts.descriptionAr}</label>
                  <textarea
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>{currentTexts.descriptionEn}</label>
                  <textarea
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  />
                  {currentTexts.published}
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={resetForm}>
                  {currentTexts.cancel}
                </button>
                <button type="submit" className="save-btn">
                  {currentTexts.save}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'units' && (
            <div className="units-panel">
              <div className="units-section">
                <h3>{currentTexts.unitsManagement}</h3>
                
                {/* Add New Unit Form */}
                <div className="add-unit-form">
                  <h4>{currentTexts.addUnit}</h4>
                  <div className="unit-form-row">
                    <div className="form-group">
                      <label>{currentTexts.unitArabic}</label>
                      <input
                        type="text"
                        value={newUnit.ar}
                        onChange={(e) => setNewUnit({ ...newUnit, ar: e.target.value })}
                        placeholder="مثال: كيلو"
                      />
                    </div>
                    <div className="form-group">
                      <label>{currentTexts.unitEnglish}</label>
                      <input
                        type="text"
                        value={newUnit.en}
                        onChange={(e) => setNewUnit({ ...newUnit, en: e.target.value })}
                        placeholder="Example: kg"
                      />
                    </div>
                    <button 
                      className="add-unit-btn"
                      onClick={handleAddUnit}
                      disabled={!newUnit.ar.trim() || !newUnit.en.trim()}
                    >
                      ➕ {currentTexts.addNewUnit}
                    </button>
                  </div>
                </div>

                {/* Units List */}
                <div className="units-list">
                  <h4>{currentTexts.unitsList}</h4>
                  <div className="units-table">
                    <div className="units-header">
                      <div className="col">{currentTexts.unitArabic}</div>
                      <div className="col">{currentTexts.unitEnglish}</div>
                      <div className="col">الإجراءات</div>
                    </div>
                    {units.map((unit) => (
                      <div key={unit.id} className="unit-row">
                        {editingUnit && editingUnit.id === unit.id ? (
                          <>
                            <div className="col">
                              <input
                                type="text"
                                value={editingUnit.ar}
                                onChange={(e) => setEditingUnit({ ...editingUnit, ar: e.target.value })}
                              />
                            </div>
                            <div className="col">
                              <input
                                type="text"
                                value={editingUnit.en}
                                onChange={(e) => setEditingUnit({ ...editingUnit, en: e.target.value })}
                              />
                            </div>
                            <div className="col actions">
                              <button 
                                className="save-btn"
                                onClick={handleSaveUnit}
                              >
                                ✅ {currentTexts.saveUnit}
                              </button>
                              <button 
                                className="cancel-btn"
                                onClick={() => setEditingUnit(null)}
                              >
                                ❌ {currentTexts.cancel}
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="col unit-ar">{unit.ar}</div>
                            <div className="col unit-en">{unit.en}</div>
                            <div className="col actions">
                              <button 
                                className="edit-btn"
                                onClick={() => handleEditUnit(unit)}
                              >
                                ✏️ {currentTexts.edit}
                              </button>
                              <button 
                                className="delete-btn"
                                onClick={() => handleDeleteUnit(unit.id)}
                              >
                                🗑️ {currentTexts.delete}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-tab">
              <h3>{currentTexts.ordersManagement}</h3>
              <div className="orders-list">
                {sampleOrders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <h4>{currentTexts.orderNumber}: #{order.id}</h4>
                        <p className="order-date">{order.date}</p>
                      </div>
                      <div className="order-status">
                        <span 
                          className="status-badge" 
                          style={{ backgroundColor: getStatusColor(order.status), color: 'white' }}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="customer-info">
                      <h5>{currentTexts.customer}:</h5>
                      <p><strong>{currentTexts.name}:</strong> {order.customer.name}</p>
                      <p><strong>{currentTexts.phone}:</strong> {order.customer.phone}</p>
                      <p><strong>{currentTexts.email}:</strong> {order.customer.email}</p>
                      <p><strong>{currentTexts.address}:</strong> {order.customer.address}</p>
                      <p><strong>{currentTexts.area}:</strong> {order.customer.area}</p>
                    </div>

                    <div className="order-items">
                      <h5>{currentTexts.items}:</h5>
                      {order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <span>{item.name}</span>
                          <span>{item.quantity} {item.unit}</span>
                          <span>{item.price} {currentTexts.kwd}</span>
                        </div>
                      ))}
                    </div>

                    <div className="order-summary">
                      <div className="order-totals">
                        <p><strong>{currentTexts.subtotal}:</strong> {order.subtotal} {currentTexts.kwd}</p>
                        <p><strong>{currentTexts.deliveryFee}:</strong> {order.deliveryFee} {currentTexts.kwd}</p>
                        <p><strong>{currentTexts.total}:</strong> {order.total} {currentTexts.kwd}</p>
                      </div>
                      <div className="order-payment">
                        <p><strong>{currentTexts.paymentMethod}:</strong> {order.paymentMethod}</p>
                      </div>
                    </div>

                    <div className="order-actions">
                      <select 
                        value={order.status} 
                        onChange={(e) => {
                          // Update order status logic here
                          console.log(`تم تغيير حالة الطلب ${order.id} إلى ${e.target.value}`);
                        }}
                        className="status-select"
                      >
                        <option value="pending">{currentTexts.pending}</option>
                        <option value="confirmed">{currentTexts.confirmed}</option>
                        <option value="delivered">{currentTexts.delivered}</option>
                        <option value="cancelled">{currentTexts.cancelled}</option>
                      </select>
                      <button className="print-invoice-btn">
                        🖨️ {currentTexts.printInvoice}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-panel">
              <div className="settings-section">
                <h3>{currentTexts.deliverySettings}</h3>
                <div className="form-group">
                  <label>{currentTexts.deliveryPrice}</label>
                  <input
                    type="number"
                    step="0.001"
                    value={deliveryPrice}
                    onChange={(e) => setDeliveryPrice(parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;