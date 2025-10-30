import React, { useState, useEffect } from 'react';
import { Product, Language, ProductCategory } from '../../types';
import AdminDashboard from '../AdminDashboard/AdminDashboard.tsx';
import './AdminPanel.css';

interface AdminPanelProps {
  language: Language;
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: number, product: Partial<Product>) => void;
  onDeleteProduct: (id: number) => void;
  onClose: () => void;
  onLogout?: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  area: string;
  joinDate: string;
  orderCount: number;
  totalSpent: number;
  isActive: boolean;
}

interface Order {
  id: string;
  orderNumber: string;
  userEmail: string;
  userName: string;
  date: string;
  items: any[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
  paymentMethod: string;
  deliveryPrice: number;
  customerInfo: any;
  notes?: string;
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'orders' | 'products' | 'delivery' | 'inventory' | 'settings'>('dashboard');
  const [activeSubTab, setActiveSubTab] = useState<string>('list');

  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showUserEditModal, setShowUserEditModal] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [showUserViewModal, setShowUserViewModal] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [showOrderViewModal, setShowOrderViewModal] = useState(false);

  // Products state
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // For forcing re-render
  const [newProduct, setNewProduct] = useState({
    name: { ar: '', en: '' },
    category: 'fruits' as ProductCategory,
    prices: [{ quantity: 1, unit: { ar: 'كيلو', en: 'kg' }, price: 0 }],
    image: '',
    description: { ar: '', en: '' },
    isPublished: false
  });

  // Delivery state
  const [deliverySettings, setDeliverySettings] = useState({
    defaultPrice: 2.000,
    freeDeliveryMinimum: 15.000,
    estimatedTime: 'خلال 2-3 ساعات',
    notes: '',
    areas: [
      { id: 1, name: 'الفروانية', price: 2.000, isActive: true },
      { id: 2, name: 'حولي', price: 2.500, isActive: true },
      { id: 3, name: 'الأحمدي', price: 3.000, isActive: true },
      { id: 4, name: 'الجهراء', price: 3.500, isActive: true },
      { id: 5, name: 'مبارك الكبير', price: 2.500, isActive: true },
      { id: 6, name: 'العاصمة', price: 2.000, isActive: true }
    ],
    timeSlots: [
      { id: 1, time: '9:00 - 12:00', isActive: true },
      { id: 2, time: '12:00 - 15:00', isActive: true },
      { id: 3, time: '15:00 - 18:00', isActive: true },
      { id: 4, time: '18:00 - 21:00', isActive: true }
    ]
  });

  // Load data on component mount
  useEffect(() => {
    loadUsers();
    loadOrders();
    loadDeliverySettings();
  }, []);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // Refresh orders when switching to orders tab
  useEffect(() => {
    if (activeTab === 'orders') {
      loadOrders();
    }
  }, [activeTab]);

  // Load delivery settings from localStorage
  const loadDeliverySettings = () => {
    try {
      const savedSettings = localStorage.getItem('deliverySettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setDeliverySettings(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('Error loading delivery settings:', error);
    }
  };

  // Load users from localStorage
  const loadUsers = () => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const usersWithStats = registeredUsers.map((user: any) => ({
      ...user,
      id: user.email,
      isActive: true
    }));
    setUsers(usersWithStats);
    setFilteredUsers(usersWithStats);
  };

  // Load orders from localStorage
  const loadOrders = () => {
    const allOrders: Order[] = [];
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    registeredUsers.forEach((user: any) => {
      const userOrders = JSON.parse(localStorage.getItem(`orders_${user.email}`) || '[]');
      userOrders.forEach((order: any) => {
        allOrders.push({
          ...order,
          userEmail: user.email,
          userName: user.name
        });
      });
    });
    
    allOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setOrders(allOrders);
    setFilteredOrders(allOrders);
  };

  // Refresh orders - to be called when admin panel opens or needs update
  const refreshOrders = () => {
    loadOrders();
  };

  // Filter functions
  const filterUsers = () => {
    let filtered = users;
    
    if (userSearchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.phone.includes(userSearchTerm)
      );
    }
    
    setFilteredUsers(filtered);
  };

  const filterOrders = () => {
    let filtered = orders;
    
    if (orderSearchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
        order.userName.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
        order.userEmail.toLowerCase().includes(orderSearchTerm.toLowerCase())
      );
    }
    
    if (orderStatusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === orderStatusFilter);
    }
    
    setFilteredOrders(filtered);
  };

  const filterProducts = () => {
    let filtered = products;
    
    if (productSearchTerm) {
      filtered = filtered.filter(product => 
        product.name[language].toLowerCase().includes(productSearchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    setFilteredProducts(filtered);
  };

  useEffect(filterUsers, [users, userSearchTerm]);
  useEffect(filterOrders, [orders, orderSearchTerm, orderStatusFilter]);
  useEffect(filterProducts, [products, productSearchTerm, categoryFilter, language, refreshKey]);

  // Update order status
  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Update in localStorage
    const userOrders = JSON.parse(localStorage.getItem(`orders_${order.userEmail}`) || '[]');
    const orderIndex = userOrders.findIndex((o: any) => o.id === orderId);
    
    if (orderIndex !== -1) {
      userOrders[orderIndex].status = newStatus;
      localStorage.setItem(`orders_${order.userEmail}`, JSON.stringify(userOrders));
      
      // Update local state
      const updatedOrders = orders.map(o => 
        o.id === orderId ? { ...o, status: newStatus } : o
      );
      setOrders(updatedOrders);
    }
  };

  // Toggle user active status
  const toggleUserStatus = (userId: string) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = registeredUsers.findIndex((user: any) => user.email === userId);
    
    if (userIndex !== -1) {
      registeredUsers[userIndex].isActive = !registeredUsers[userIndex].isActive;
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      loadUsers();
    }
  };

  // Edit user functions
  const openEditUser = (user: User) => {
    setEditingUser({ ...user });
    setShowUserEditModal(true);
  };

  const closeEditUser = () => {
    setEditingUser(null);
    setShowUserEditModal(false);
  };

  const saveUserChanges = () => {
    if (!editingUser) return;

    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = registeredUsers.findIndex((user: any) => user.email === editingUser.email);
    
    if (userIndex !== -1) {
      registeredUsers[userIndex] = {
        ...registeredUsers[userIndex],
        name: editingUser.name,
        phone: editingUser.phone,
        address: editingUser.address,
        area: editingUser.area
      };
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      loadUsers();
      closeEditUser();
    }
  };

  const deleteUser = (userId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟ سيتم حذف جميع طلباته أيضاً.')) {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const filteredUsers = registeredUsers.filter((user: any) => user.email !== userId);
      localStorage.setItem('registeredUsers', JSON.stringify(filteredUsers));
      
      // Also delete user's orders
      localStorage.removeItem(`orders_${userId}`);
      
      loadUsers();
      loadOrders();
    }
  };

  // View user details
  const openViewUser = (user: User) => {
    setViewingUser(user);
    setShowUserViewModal(true);
  };

  const closeViewUser = () => {
    setViewingUser(null);
    setShowUserViewModal(false);
  };

  // View order details and invoice
  const openViewOrder = (order: Order) => {
    console.log('Opening order:', order); // للتصحيح
    setViewingOrder(order);
    setShowOrderViewModal(true);
  };

  const closeViewOrder = () => {
    setViewingOrder(null);
    setShowOrderViewModal(false);
  };

  // Print order invoice
  const printOrderInvoice = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>فاتورة ${order.orderNumber}</title>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
          .invoice { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 800px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 3px solid #4CAF50; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 2rem; color: #4CAF50; font-weight: bold; margin-bottom: 10px; }
          .company-info { color: #666; font-size: 0.9rem; }
          .contact-info { color: #4CAF50; font-weight: bold; margin-top: 10px; }
          .invoice-details { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
          .section-title { font-weight: bold; color: #4CAF50; border-bottom: 2px solid #e9ecef; padding-bottom: 5px; margin-bottom: 15px; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; padding: 5px 0; }
          .info-label { font-weight: 600; color: #333; }
          .info-value { color: #666; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .items-table th { background: #4CAF50; color: white; padding: 12px; text-align: center; }
          .items-table td { padding: 10px; text-align: center; border-bottom: 1px solid #e9ecef; }
          .items-table tr:nth-child(even) { background: #f8f9fa; }
          .totals { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #4CAF50; }
          .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .final-total { font-size: 1.2rem; font-weight: bold; color: #4CAF50; border-top: 2px solid #4CAF50; padding-top: 10px; }
          .status-badge { padding: 5px 15px; border-radius: 20px; color: white; background: #4CAF50; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e9ecef; color: #666; }
          @media print { body { background: white; } .invoice { box-shadow: none; } }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <div class="logo">🍎 فكهاني الكويت - Q8 Fruit</div>
            <div class="company-info">
              أفضل الفواكه والخضار الطازجة في الكويت<br>
              هاتف: 98899426 | بريد إلكتروني: summit_kw@hotmail.com
            </div>
          </div>

          <div class="invoice-details">
            <div>
              <div class="section-title">تفاصيل الطلب</div>
              <div class="info-row">
                <span class="info-label">رقم الطلب:</span>
                <span class="info-value">${order.orderNumber}</span>
              </div>
              <div class="info-row">
                <span class="info-label">تاريخ الطلب:</span>
                <span class="info-value">${order.date}</span>
              </div>
              <div class="info-row">
                <span class="info-label">طريقة الدفع:</span>
                <span class="info-value">${order.paymentMethod}</span>
              </div>
              <div class="info-row">
                <span class="info-label">الحالة:</span>
                <span class="status-badge">${getStatusText(order.status)}</span>
              </div>
            </div>

            <div>
              <div class="section-title">بيانات العميل</div>
              <div class="info-row">
                <span class="info-label">الاسم:</span>
                <span class="info-value">${order.customerInfo.name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">الهاتف:</span>
                <span class="info-value">${order.customerInfo.phone}</span>
              </div>
              <div class="info-row">
                <span class="info-label">العنوان:</span>
                <span class="info-value">${order.customerInfo.address}</span>
              </div>
              <div class="info-row">
                <span class="info-label">المنطقة:</span>
                <span class="info-value">${order.customerInfo.area}</span>
              </div>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>المنتج</th>
                <th>الكمية</th>
                <th>الوحدة</th>
                <th>السعر</th>
                <th>المجموع</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${item.unit}</td>
                  <td>${item.price.toFixed(3)} د.ك</td>
                  <td>${(item.price * item.quantity).toFixed(3)} د.ك</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>المجموع الفرعي:</span>
              <span>${(order.total - order.deliveryPrice).toFixed(3)} د.ك</span>
            </div>
            <div class="total-row">
              <span>رسوم التوصيل:</span>
              <span>${order.deliveryPrice.toFixed(3)} د.ك</span>
            </div>
            <div class="total-row final-total">
              <span>المجموع النهائي:</span>
              <span>${order.total.toFixed(3)} د.ك</span>
            </div>
          </div>

          ${order.customerInfo.notes ? `
            <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
              <strong>ملاحظات:</strong> ${order.customerInfo.notes}
            </div>
          ` : ''}

          <div class="footer">
            شكراً لتسوقكم معنا! نتطلع لخدمتكم مرة أخرى<br>
            تم إنشاء هذه الفاتورة في: ${new Date().toLocaleString('ar-SA')}
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  // Helper function to get status text
  const getStatusText = (status: string) => {
    const statusMap: {[key: string]: string} = {
      'pending': 'قيد الانتظار',
      'confirmed': 'مؤكد',
      'preparing': 'قيد التحضير',
      'delivering': 'قيد التوصيل',
      'delivered': 'تم التوصيل',
      'cancelled': 'ملغي'
    };
    return statusMap[status] || status;
  };

  // Product management functions
  const handleEditProduct = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setEditingProduct(product);
      setShowEditProductModal(true);
    }
  };

  const handleDeleteProduct = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const productName = language === 'ar' ? product.name.ar : product.name.en;
      if (confirm(`هل أنت متأكد من حذف المنتج: ${productName}؟`)) {
        onDeleteProduct(productId);
        alert('تم حذف المنتج بنجاح');
      }
    }
  };

  const handleToggleProductStatus = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const updatedProduct = { ...product, isPublished: !product.isPublished };
      onUpdateProduct(productId, updatedProduct);
      alert(updatedProduct.isPublished ? 'تم نشر المنتج بنجاح ✅' : 'تم إخفاء المنتج بنجاح 🔒');
      
      // Force re-render to show updated status
      setRefreshKey(prev => prev + 1);
    }
  };

  // Handle image upload for new product
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملف صورة صالح');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الصورة كبير جداً. يرجى اختيار صورة أصغر من 5 ميجابايت');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setNewProduct(prev => ({
          ...prev,
          image: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload for editing product
  const handleEditImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملف صورة صالح');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الصورة كبير جداً. يرجى اختيار صورة أصغر من 5 ميجابايت');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setEditingProduct(prev => prev ? ({
          ...prev,
          images: [base64String]
        }) : null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new product
  const handleAddProduct = () => {
    if (!newProduct.name.ar || !newProduct.name.en || !newProduct.prices[0].price) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const productToAdd = {
      name: newProduct.name,
      category: newProduct.category,
      units: [{
        id: 1,
        unit: newProduct.prices[0].unit,
        price: newProduct.prices[0].price,
        isDefault: true
      }],
      images: newProduct.image ? [newProduct.image] : [],
      description: newProduct.description,
      stock: 100, // Default stock
      isPublished: newProduct.isPublished
    };

    onAddProduct(productToAdd);
    setShowAddProductModal(false);
    setNewProduct({
      name: { ar: '', en: '' },
      category: 'fruits' as ProductCategory,
      prices: [{ quantity: 1, unit: { ar: 'كيلو', en: 'kg' }, price: 0 }],
      image: '',
      description: { ar: '', en: '' },
      isPublished: false
    });
    alert('تم إضافة المنتج بنجاح');
  };

  const handleEditProductSave = () => {
    if (!editingProduct) return;

    if (!editingProduct.name.ar || !editingProduct.name.en || !editingProduct.units[0]?.price) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const updatedProducts = products.map(product =>
      product.id === editingProduct.id ? editingProduct : product
    );

    // Update products in localStorage
    try {
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      setShowEditProductModal(false);
      setEditingProduct(null);
      alert('تم تحديث المنتج بنجاح');
      window.location.reload(); // Refresh to show updated data
    } catch (error) {
      console.error('Error updating product:', error);
      alert('حدث خطأ في تحديث المنتج');
    }
  };

  // Save delivery settings
  const saveDeliverySettings = () => {
    try {
      localStorage.setItem('deliverySettings', JSON.stringify(deliverySettings));
      alert('تم حفظ إعدادات التوصيل بنجاح');
    } catch (error) {
      console.error('Error saving delivery settings:', error);
      alert('حدث خطأ في حفظ الإعدادات');
    }
  };

  const texts = {
    ar: {
      adminPanel: 'لوحة الإدارة',
      dashboard: 'لوحة التحكم',
      users: 'إدارة المستخدمين',
      orders: 'إدارة الطلبات',
      products: 'إدارة المنتجات',
      delivery: 'إدارة التوصيل',
      inventory: 'إدارة المخزون',
      settings: 'الإعدادات',
      close: 'إغلاق',
      logout: 'تسجيل خروج',
      search: 'بحث',
      filter: 'تصفية',
      add: 'إضافة',
      edit: 'تعديل',
      delete: 'حذف',
      save: 'حفظ',
      cancel: 'إلغاء',
      status: 'الحالة',
      actions: 'الإجراءات',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      address: 'العنوان',
      joinDate: 'تاريخ التسجيل',
      orderCount: 'عدد الطلبات',
      totalSpent: 'إجمالي المبلغ',
      active: 'نشط',
      inactive: 'غير نشط',
      orderNumber: 'رقم الطلب',
      customer: 'العميل',
      date: 'التاريخ',
      total: 'الإجمالي',
      paymentMethod: 'طريقة الدفع',
      pending: 'قيد الانتظار',
      confirmed: 'مؤكد',
      preparing: 'قيد التحضير',
      delivering: 'قيد التوصيل',
      delivered: 'تم التوصيل',
      cancelled: 'ملغي',
      category: 'الفئة',
      price: 'السعر',
      stock: 'المخزون',
      published: 'منشور',
      draft: 'مسودة',
      deliveryPrice: 'سعر التوصيل',
      area: 'المنطقة',
      timeSlot: 'وقت التوصيل',
      freeDeliveryMinimum: 'حد التوصيل المجاني'
    },
    en: {
      adminPanel: 'Admin Panel',
      dashboard: 'Dashboard',
      users: 'User Management',
      orders: 'Order Management',
      products: 'Product Management',
      delivery: 'Delivery Management',
      inventory: 'Inventory Management',
      settings: 'Settings',
      close: 'Close',
      logout: 'Logout',
      search: 'Search',
      filter: 'Filter',
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      status: 'Status',
      actions: 'Actions',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      joinDate: 'Join Date',
      orderCount: 'Orders',
      totalSpent: 'Total Spent',
      active: 'Active',
      inactive: 'Inactive',
      orderNumber: 'Order Number',
      customer: 'Customer',
      date: 'Date',
      total: 'Total',
      paymentMethod: 'Payment Method',
      pending: 'Pending',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      delivering: 'Delivering',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      category: 'Category',
      price: 'Price',
      stock: 'Stock',
      published: 'Published',
      draft: 'Draft',
      deliveryPrice: 'Delivery Price',
      area: 'Area',
      timeSlot: 'Time Slot',
      freeDeliveryMinimum: 'Free Delivery Minimum'
    }
  };

  const currentTexts = texts[language];

  const renderTabButtons = () => (
    <div className="admin-tabs">
      <button
        className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
        onClick={() => setActiveTab('dashboard')}
      >
        📊 {currentTexts.dashboard}
      </button>
      <button
        className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
        onClick={() => setActiveTab('users')}
      >
        👥 {currentTexts.users}
      </button>
      <button
        className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
        onClick={() => setActiveTab('orders')}
      >
        📋 {currentTexts.orders}
      </button>
      <button
        className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
        onClick={() => setActiveTab('products')}
      >
        🛍️ {currentTexts.products}
      </button>
      <button
        className={`tab-btn ${activeTab === 'delivery' ? 'active' : ''}`}
        onClick={() => setActiveTab('delivery')}
      >
        🚚 {currentTexts.delivery}
      </button>
      <button
        className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
        onClick={() => setActiveTab('inventory')}
      >
        📦 {currentTexts.inventory}
      </button>
      <button
        className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
        onClick={() => setActiveTab('settings')}
      >
        ⚙️ {currentTexts.settings}
      </button>
    </div>
  );

  const renderUsersManagement = () => (
    <div className="users-management">
      <div className="section-header">
        <h2>👥 {currentTexts.users}</h2>
        <div className="search-filter-bar">
          <input
            type="text"
            placeholder={`${currentTexts.search}...`}
            value={userSearchTerm}
            onChange={(e) => setUserSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="users-stats">
        <div className="stat-card">
          <h4>إجمالي المستخدمين</h4>
          <span className="stat-number">{users.length}</span>
        </div>
        <div className="stat-card">
          <h4>المستخدمين النشطين</h4>
          <span className="stat-number">{users.filter(u => u.isActive).length}</span>
        </div>
        <div className="stat-card">
          <h4>إجمالي الطلبات</h4>
          <span className="stat-number">{users.reduce((sum, u) => sum + u.orderCount, 0)}</span>
        </div>
        <div className="stat-card">
          <h4>إجمالي المبيعات</h4>
          <span className="stat-number">{users.reduce((sum, u) => sum + u.totalSpent, 0).toFixed(3)} د.ك</span>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>{currentTexts.name}</th>
              <th>{currentTexts.email}</th>
              <th>{currentTexts.phone}</th>
              <th>{currentTexts.area}</th>
              <th>{currentTexts.orderCount}</th>
              <th>{currentTexts.totalSpent}</th>
              <th>{currentTexts.status}</th>
              <th>{currentTexts.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <span 
                    className="user-name-link"
                    onClick={() => openViewUser(user)}
                    style={{ cursor: 'pointer', color: 'var(--primary-color)', fontWeight: '500' }}
                  >
                    {user.name}
                  </span>
                </td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.area}</td>
                <td>{user.orderCount}</td>
                <td>{user.totalSpent.toFixed(3)} د.ك</td>
                <td>
                  <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? currentTexts.active : currentTexts.inactive}
                  </span>
                </td>
                <td>
                  <button
                    className="action-btn edit"
                    onClick={() => openEditUser(user)}
                  >
                    تعديل
                  </button>
                  <button
                    className={`action-btn ${user.isActive ? 'deactivate' : 'activate'}`}
                    onClick={() => toggleUserStatus(user.id)}
                  >
                    {user.isActive ? 'إلغاء تفعيل' : 'تفعيل'}
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => deleteUser(user.id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrdersManagement = () => (
    <div className="orders-management">
      <div className="section-header">
        <h2>📋 {currentTexts.orders}</h2>
        <div className="search-filter-bar">
          <input
            type="text"
            placeholder={`${currentTexts.search}...`}
            value={orderSearchTerm}
            onChange={(e) => setOrderSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={orderStatusFilter}
            onChange={(e) => setOrderStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">جميع الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="confirmed">مؤكد</option>
            <option value="preparing">قيد التحضير</option>
            <option value="delivering">قيد التوصيل</option>
            <option value="delivered">تم التوصيل</option>
            <option value="cancelled">ملغي</option>
          </select>
          <button 
            className="refresh-btn"
            onClick={refreshOrders}
            title="تحديث الطلبات"
          >
            🔄 تحديث
          </button>
        </div>
      </div>

      <div className="orders-stats">
        <div className="stat-card">
          <h4>إجمالي الطلبات</h4>
          <span className="stat-number">{orders.length}</span>
        </div>
        <div className="stat-card">
          <h4>قيد الانتظار</h4>
          <span className="stat-number">{orders.filter(o => o.status === 'pending').length}</span>
        </div>
        <div className="stat-card">
          <h4>مؤكدة</h4>
          <span className="stat-number">{orders.filter(o => o.status === 'confirmed').length}</span>
        </div>
        <div className="stat-card">
          <h4>تم التوصيل</h4>
          <span className="stat-number">{orders.filter(o => o.status === 'delivered').length}</span>
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>{currentTexts.orderNumber}</th>
              <th>{currentTexts.customer}</th>
              <th>{currentTexts.date}</th>
              <th>العناصر</th>
              <th>{currentTexts.total}</th>
              <th>{currentTexts.status}</th>
              <th>{currentTexts.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>{order.orderNumber}</td>
                <td>{order.userName}</td>
                <td>{order.date}</td>
                <td>{order.items.length} عنصر</td>
                <td>{order.total.toFixed(3)} د.ك</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                    className="status-select"
                  >
                    <option value="pending">قيد الانتظار</option>
                    <option value="confirmed">مؤكد</option>
                    <option value="preparing">قيد التحضير</option>
                    <option value="delivering">قيد التوصيل</option>
                    <option value="delivered">تم التوصيل</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </td>
                <td>
                  <button 
                    className="action-btn view"
                    onClick={() => openViewOrder(order)}
                  >
                    عرض الفاتورة
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProductsManagement = () => (
    <div className="products-management">
      <div className="section-header">
        <h2>🛍️ {currentTexts.products}</h2>
        <div className="search-filter-bar">
          <input
            type="text"
            placeholder={`${currentTexts.search}...`}
            value={productSearchTerm}
            onChange={(e) => setProductSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">جميع الفئات</option>
            <option value="fruits">فواكه</option>
            <option value="vegetables">خضروات</option>
          </select>
          <button 
            className="add-product-btn"
            onClick={() => setShowAddProductModal(true)}
          >
            ➕ إضافة منتج جديد
          </button>
        </div>
      </div>

      <div className="sub-tabs">
        <button
          className={`sub-tab-btn ${activeSubTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('list')}
        >
          📋 قائمة المنتجات
        </button>
        <button
          className={`sub-tab-btn ${activeSubTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('add')}
        >
          ➕ إضافة منتج
        </button>
      </div>

      {activeSubTab === 'list' && (
        <div className="products-table-container" key={`products-list-${refreshKey}`}>
          <table className="products-table">
            <thead>
              <tr>
                <th>صورة</th>
                <th>{currentTexts.name}</th>
                <th>{currentTexts.category}</th>
                <th>{currentTexts.price}</th>
                <th>{currentTexts.stock}</th>
                <th>{currentTexts.status}</th>
                <th>{currentTexts.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    <img 
                      src={product.images[0]} 
                      alt={product.name[language]}
                      className="product-thumbnail"
                    />
                  </td>
                  <td>{product.name[language]}</td>
                  <td>{product.category === 'fruits' ? 'فواكه' : 'خضروات'}</td>
                  <td>
                    {product.units.find(u => u.isDefault)?.price.toFixed(3)} د.ك
                  </td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`status-badge ${product.isPublished ? 'published' : 'draft'}`}>
                      {product.isPublished ? 'منشور' : 'مسودة'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="action-btn edit"
                      onClick={() => handleEditProduct(product.id)}
                    >
                      تعديل
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      حذف
                    </button>
                    <button 
                      className="action-btn publish"
                      onClick={() => handleToggleProductStatus(product.id)}
                    >
                      {product.isPublished ? 'إخفاء' : 'نشر'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === 'add' && (
        <div className="add-product-form">
          <h3>إضافة منتج جديد</h3>
          {/* Add product form will be implemented here */}
          <p>نموذج إضافة المنتج سيتم تطويره هنا</p>
        </div>
      )}
    </div>
  );

  const renderDeliveryManagement = () => (
    <div className="delivery-management">
      <div className="section-header">
        <h2>🚚 {currentTexts.delivery}</h2>
      </div>

      <div className="delivery-settings">
        <div className="settings-section">
          <h3>إعدادات التوصيل العامة</h3>
          <div className="setting-item">
            <label>سعر التوصيل الافتراضي:</label>
            <input
              type="number"
              step="0.001"
              value={deliverySettings.defaultPrice}
              onChange={(e) => setDeliverySettings(prev => ({
                ...prev,
                defaultPrice: parseFloat(e.target.value)
              }))}
            />
            <span>د.ك</span>
          </div>
          <div className="setting-item">
            <label>الحد الأدنى للتوصيل:</label>
            <input
              type="number"
              step="0.001"
              value={deliverySettings.freeDeliveryMinimum}
              onChange={(e) => setDeliverySettings(prev => ({
                ...prev,
                freeDeliveryMinimum: parseFloat(e.target.value)
              }))}
            />
            <span>د.ك</span>
          </div>
          <div className="setting-item">
            <label>وقت التوصيل المتوقع:</label>
            <input
              type="text"
              placeholder="مثال: خلال 2-3 ساعات"
              value={deliverySettings.estimatedTime || ''}
              onChange={(e) => setDeliverySettings(prev => ({
                ...prev,
                estimatedTime: e.target.value
              }))}
            />
          </div>
          <div className="setting-item">
            <label>ملاحظات التوصيل:</label>
            <textarea
              placeholder="ملاحظات إضافية حول التوصيل..."
              value={deliverySettings.notes || ''}
              onChange={(e) => setDeliverySettings(prev => ({
                ...prev,
                notes: e.target.value
              }))}
            />
          </div>
          <button 
            className="save-btn"
            onClick={saveDeliverySettings}
          >
            💾 حفظ الإعدادات
          </button>
        </div>

        <div className="settings-section">
          <h3>مناطق التوصيل</h3>
          <div className="areas-table-container">
            <table className="areas-table">
              <thead>
                <tr>
                  <th>المنطقة</th>
                  <th>السعر</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {deliverySettings.areas.map(area => (
                  <tr key={area.id}>
                    <td>{area.name}</td>
                    <td>{area.price.toFixed(3)} د.ك</td>
                    <td>
                      <span className={`status-badge ${area.isActive ? 'active' : 'inactive'}`}>
                        {area.isActive ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn edit">تعديل</button>
                      <button className="action-btn toggle">
                        {area.isActive ? 'إلغاء تفعيل' : 'تفعيل'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="settings-section">
          <h3>فترات التوصيل</h3>
          <div className="time-slots-container">
            {deliverySettings.timeSlots.map(slot => (
              <div key={slot.id} className="time-slot-item">
                <span>{slot.time}</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={slot.isActive}
                    onChange={() => {
                      setDeliverySettings(prev => ({
                        ...prev,
                        timeSlots: prev.timeSlots.map(s =>
                          s.id === slot.id ? { ...s, isActive: !s.isActive } : s
                        )
                      }));
                    }}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventoryManagement = () => (
    <div className="inventory-management">
      <div className="section-header">
        <h2>📦 {currentTexts.inventory}</h2>
      </div>

      <div className="inventory-stats">
        <div className="stat-card">
          <h4>إجمالي المنتجات</h4>
          <span className="stat-number">{products.length}</span>
        </div>
        <div className="stat-card">
          <h4>منتجات منخفضة المخزون</h4>
          <span className="stat-number">{products.filter(p => p.stock < 10).length}</span>
        </div>
        <div className="stat-card">
          <h4>منتجات نفد مخزونها</h4>
          <span className="stat-number">{products.filter(p => p.stock === 0).length}</span>
        </div>
      </div>

      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>المنتج</th>
              <th>المخزون الحالي</th>
              <th>الحد الأدنى</th>
              <th>حالة المخزون</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name[language]}</td>
                <td>{product.stock}</td>
                <td>10</td>
                <td>
                  <span className={`status-badge ${
                    product.stock === 0 ? 'out-of-stock' :
                    product.stock < 10 ? 'low-stock' : 'in-stock'
                  }`}>
                    {product.stock === 0 ? 'نفد المخزون' :
                     product.stock < 10 ? 'مخزون منخفض' : 'متوفر'}
                  </span>
                </td>
                <td>
                  <button className="action-btn edit">تحديث المخزون</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="settings-management">
      <div className="section-header">
        <h2>⚙️ {currentTexts.settings}</h2>
      </div>

      <div className="settings-sections">
        <div className="settings-section">
          <h3>إعدادات الموقع</h3>
          <div className="setting-item">
            <label>اسم الموقع:</label>
            <input type="text" defaultValue="فكهاني الكويت" />
          </div>
          <div className="setting-item">
            <label>رقم الهاتف:</label>
            <input type="text" defaultValue="98899426" />
          </div>
          <div className="setting-item">
            <label>البريد الإلكتروني:</label>
            <input type="email" defaultValue="summit_kw@hotmail.com" />
          </div>
        </div>

        <div className="settings-section">
          <h3>إعدادات الدفع</h3>
          <div className="setting-item">
            <label>تفعيل الدفع النقدي:</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting-item">
            <label>تفعيل الدفع الإلكتروني:</label>
            <input type="checkbox" defaultChecked />
          </div>
        </div>

        <div className="settings-section">
          <h3>إعدادات الإشعارات</h3>
          <div className="setting-item">
            <label>إشعارات الطلبات الجديدة:</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting-item">
            <label>إشعارات المخزون المنخفض:</label>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-panel-overlay">
      <div className="admin-panel">
        <div className="admin-header">
          <h1>🛠️ {currentTexts.adminPanel}</h1>
          <div className="admin-header-actions">
            {onLogout && (
              <button className="logout-btn" onClick={onLogout}>
                🚪 {currentTexts.logout}
              </button>
            )}
            <button className="close-btn" onClick={onClose}>
              ✖️ {currentTexts.close}
            </button>
          </div>
        </div>

        {renderTabButtons()}

        <div className="admin-content">
          {activeTab === 'dashboard' && (
            <AdminDashboard language={language} />
          )}

          {activeTab === 'users' && renderUsersManagement()}
          {activeTab === 'orders' && renderOrdersManagement()}
          {activeTab === 'products' && renderProductsManagement()}
          {activeTab === 'delivery' && renderDeliveryManagement()}
          {activeTab === 'inventory' && renderInventoryManagement()}
          {activeTab === 'settings' && renderSettings()}
        </div>

        {/* User Edit Modal */}
        {showUserEditModal && editingUser && (
          <div className="modal-overlay" onClick={closeEditUser}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>تعديل بيانات المستخدم</h3>
                <button className="modal-close-btn" onClick={closeEditUser}>✖️</button>
              </div>
              
              <div className="modal-body">
                <div className="form-group">
                  <label>الاسم:</label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>رقم الهاتف:</label>
                  <input
                    type="text"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>العنوان:</label>
                  <input
                    type="text"
                    value={editingUser.address}
                    onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>المنطقة:</label>
                  <select
                    value={editingUser.area}
                    onChange={(e) => setEditingUser({ ...editingUser, area: e.target.value })}
                    className="form-select"
                  >
                    <option value="الفروانية">الفروانية</option>
                    <option value="حولي">حولي</option>
                    <option value="الأحمدي">الأحمدي</option>
                    <option value="الجهراء">الجهراء</option>
                    <option value="مبارك الكبير">مبارك الكبير</option>
                    <option value="العاصمة">العاصمة</option>
                  </select>
                </div>
                
                <div className="info-section">
                  <p><strong>البريد الإلكتروني:</strong> {editingUser.email}</p>
                  <p><strong>تاريخ التسجيل:</strong> {editingUser.joinDate}</p>
                  <p><strong>عدد الطلبات:</strong> {editingUser.orderCount}</p>
                  <p><strong>إجمالي المبلغ:</strong> {editingUser.totalSpent.toFixed(3)} د.ك</p>
                </div>
              </div>
              
              <div className="modal-footer">
                <button className="save-btn" onClick={saveUserChanges}>
                  💾 حفظ التغييرات
                </button>
                <button className="cancel-btn" onClick={closeEditUser}>
                  ❌ إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User View Modal */}
        {showUserViewModal && viewingUser && (
          <div className="modal-overlay" onClick={closeViewUser}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>تفاصيل المستخدم - {viewingUser.name}</h3>
                <button className="modal-close-btn" onClick={closeViewUser}>✖️</button>
              </div>
              
              <div className="modal-body">
                <div className="user-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">👤 الاسم:</span>
                    <span className="detail-value">{viewingUser.name}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">📧 البريد الإلكتروني:</span>
                    <span className="detail-value">{viewingUser.email}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">📱 رقم الهاتف:</span>
                    <span className="detail-value">{viewingUser.phone}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">🏠 العنوان:</span>
                    <span className="detail-value">{viewingUser.address}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">📍 المنطقة:</span>
                    <span className="detail-value">{viewingUser.area}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">📅 تاريخ التسجيل:</span>
                    <span className="detail-value">{new Date(viewingUser.joinDate).toLocaleDateString('ar-SA')}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">🛒 عدد الطلبات:</span>
                    <span className="detail-value">{viewingUser.orderCount} طلب</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">💰 إجمالي المبلغ:</span>
                    <span className="detail-value">{viewingUser.totalSpent.toFixed(3)} د.ك</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">⚡ الحالة:</span>
                    <span className={`status-badge ${viewingUser.isActive ? 'active' : 'inactive'}`}>
                      {viewingUser.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">📊 متوسط قيمة الطلب:</span>
                    <span className="detail-value">
                      {viewingUser.orderCount > 0 ? (viewingUser.totalSpent / viewingUser.orderCount).toFixed(3) : '0.000'} د.ك
                    </span>
                  </div>
                </div>
                
                <div className="user-stats-section">
                  <h4>📈 إحصائيات سريعة</h4>
                  <div className="quick-stats">
                    <div className="quick-stat">
                      <span className="stat-icon">🎯</span>
                      <span className="stat-text">
                        عميل {viewingUser.orderCount >= 10 ? 'VIP' : viewingUser.orderCount >= 5 ? 'مميز' : 'جديد'}
                      </span>
                    </div>
                    <div className="quick-stat">
                      <span className="stat-icon">🏆</span>
                      <span className="stat-text">
                        {viewingUser.totalSpent >= 100 ? 'عميل ذهبي' : viewingUser.totalSpent >= 50 ? 'عميل فضي' : 'عميل برونزي'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button className="save-btn" onClick={() => {
                  closeViewUser();
                  openEditUser(viewingUser);
                }}>
                  ✏️ تعديل البيانات
                </button>
                <button className="cancel-btn" onClick={closeViewUser}>
                  ❌ إغلاق
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order View Modal - Invoice */}
        {showOrderViewModal && viewingOrder && (
          <div className="modal-overlay" onClick={closeViewOrder}>
            <div className="modal-content order-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>📋 فاتورة الطلب - {viewingOrder.orderNumber}</h3>
                <button className="modal-close-btn" onClick={closeViewOrder}>✖️</button>
              </div>
              
              <div className="modal-body">
                <div className="invoice-container">
                  {/* Order Header */}
                  <div className="invoice-header">
                    <div className="company-logo">
                      <h2>🍎 فكهاني الكويت</h2>
                      <p>أفضل الفواكه والخضار الطازجة</p>
                    </div>
                    <div className="invoice-details-header">
                      <div className="detail-item">
                        <span className="detail-label">رقم الطلب:</span>
                        <span className="detail-value">{viewingOrder.orderNumber}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">التاريخ:</span>
                        <span className="detail-value">{viewingOrder.date}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">الحالة:</span>
                        <span className={`status-badge ${viewingOrder.status}`}>
                          {getStatusText(viewingOrder.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="customer-info">
                    <h4>🧑‍💼 بيانات العميل</h4>
                    <div className="customer-details">
                      <div className="detail-item">
                        <span className="detail-label">👤 الاسم:</span>
                        <span className="detail-value">{viewingOrder.customerInfo?.name || viewingOrder.userName}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">📧 البريد:</span>
                        <span className="detail-value">{viewingOrder.userEmail}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">📱 الهاتف:</span>
                        <span className="detail-value">{viewingOrder.customerInfo?.phone || 'غير محدد'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">🏠 العنوان:</span>
                        <span className="detail-value">{viewingOrder.customerInfo?.address || 'غير محدد'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">📍 المنطقة:</span>
                        <span className="detail-value">{viewingOrder.customerInfo?.area || 'غير محدد'}</span>
                      </div>
                      {viewingOrder.customerInfo?.notes && (
                        <div className="detail-item notes">
                          <span className="detail-label">📝 ملاحظات:</span>
                          <span className="detail-value">{viewingOrder.customerInfo.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="order-items">
                    <h4>🛒 تفاصيل الطلب</h4>
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>المنتج</th>
                          <th>الكمية</th>
                          <th>الوحدة</th>
                          <th>السعر</th>
                          <th>المجموع</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewingOrder.items && viewingOrder.items.map((item, index) => (
                          <tr key={index}>
                            <td>{item.name || 'منتج غير محدد'}</td>
                            <td>{item.quantity || 0}</td>
                            <td>{item.unit || 'قطعة'}</td>
                            <td>{(item.price || 0).toFixed(3)} د.ك</td>
                            <td>{((item.price || 0) * (item.quantity || 0)).toFixed(3)} د.ك</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Order Summary */}
                  <div className="order-summary">
                    <div className="summary-row">
                      <span>المجموع الفرعي:</span>
                      <span>{(viewingOrder.total - viewingOrder.deliveryPrice).toFixed(3)} د.ك</span>
                    </div>
                    <div className="summary-row">
                      <span>رسوم التوصيل:</span>
                      <span>{viewingOrder.deliveryPrice.toFixed(3)} د.ك</span>
                    </div>
                    <div className="summary-row total">
                      <span>المجموع النهائي:</span>
                      <span>{viewingOrder.total.toFixed(3)} د.ك</span>
                    </div>
                    <div className="payment-info">
                      <span>💳 طريقة الدفع: {viewingOrder.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  className="save-btn print-btn"
                  onClick={() => printOrderInvoice(viewingOrder)}
                >
                  🖨️ طباعة الفاتورة
                </button>
                <button 
                  className="save-btn"
                  onClick={() => {
                    closeViewOrder();
                    // Could add email functionality here
                  }}
                >
                  📧 إرسال بالإيميل
                </button>
                <button className="cancel-btn" onClick={closeViewOrder}>
                  ❌ إغلاق
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddProductModal && (
          <div className="modal-overlay" onClick={() => setShowAddProductModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>➕ إضافة منتج جديد</h3>
                <button className="modal-close-btn" onClick={() => setShowAddProductModal(false)}>✖️</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>اسم المنتج (عربي):</label>
                  <input
                    type="text"
                    value={newProduct.name.ar}
                    onChange={(e) => setNewProduct(prev => ({
                      ...prev,
                      name: { ...prev.name, ar: e.target.value }
                    }))}
                    placeholder="أدخل اسم المنتج بالعربية"
                  />
                </div>
                <div className="form-group">
                  <label>اسم المنتج (إنجليزي):</label>
                  <input
                    type="text"
                    value={newProduct.name.en}
                    onChange={(e) => setNewProduct(prev => ({
                      ...prev,
                      name: { ...prev.name, en: e.target.value }
                    }))}
                    placeholder="Enter product name in English"
                  />
                </div>
                <div className="form-group">
                  <label>الفئة:</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(prev => ({
                      ...prev,
                      category: e.target.value as ProductCategory
                    }))}
                  >
                    <option value="fruits">فواكه</option>
                    <option value="vegetables">خضار</option>
                    <option value="herbs">أعشاب</option>
                    <option value="nuts">مكسرات</option>
                    <option value="dairy">ألبان</option>
                    <option value="beverages">مشروبات</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>السعر:</label>
                  <input
                    type="number"
                    step="0.001"
                    value={newProduct.prices[0].price}
                    onChange={(e) => setNewProduct(prev => ({
                      ...prev,
                      prices: [{
                        ...prev.prices[0],
                        price: parseFloat(e.target.value) || 0
                      }]
                    }))}
                    placeholder="0.000"
                  />
                  <span>د.ك</span>
                </div>
                <div className="form-group">
                  <label>الوحدة (عربي):</label>
                  <input
                    type="text"
                    value={newProduct.prices[0].unit.ar}
                    onChange={(e) => setNewProduct(prev => ({
                      ...prev,
                      prices: [{
                        ...prev.prices[0],
                        unit: { ...prev.prices[0].unit, ar: e.target.value }
                      }]
                    }))}
                    placeholder="كيلو"
                  />
                </div>
                <div className="form-group">
                  <label>الوحدة (إنجليزي):</label>
                  <input
                    type="text"
                    value={newProduct.prices[0].unit.en}
                    onChange={(e) => setNewProduct(prev => ({
                      ...prev,
                      prices: [{
                        ...prev.prices[0],
                        unit: { ...prev.prices[0].unit, en: e.target.value }
                      }]
                    }))}
                    placeholder="kg"
                  />
                </div>
                <div className="form-group">
                  <label>الصورة:</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="image-upload-input"
                      id="new-product-image"
                    />
                    <label htmlFor="new-product-image" className="image-upload-label">
                      📁 اختر صورة من الجهاز
                    </label>
                    {newProduct.image && (
                      <div className="image-preview">
                        <img 
                          src={newProduct.image} 
                          alt="معاينة الصورة" 
                          className="preview-image"
                        />
                        <button 
                          type="button"
                          onClick={() => setNewProduct(prev => ({ ...prev, image: '' }))}
                          className="remove-image-btn"
                        >
                          ❌ إزالة الصورة
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="or-divider">أو</div>
                  <input
                    type="url"
                    value={newProduct.image.startsWith('data:') ? '' : newProduct.image}
                    onChange={(e) => setNewProduct(prev => ({
                      ...prev,
                      image: e.target.value
                    }))}
                    placeholder="أدخل رابط الصورة (https://...)"
                    className="url-input"
                  />
                </div>
                <div className="form-group">
                  <label>الوصف (عربي):</label>
                  <textarea
                    value={newProduct.description.ar}
                    onChange={(e) => setNewProduct(prev => ({
                      ...prev,
                      description: { ...prev.description, ar: e.target.value }
                    }))}
                    placeholder="وصف المنتج بالعربية"
                  />
                </div>
                <div className="form-group">
                  <label>الوصف (إنجليزي):</label>
                  <textarea
                    value={newProduct.description.en}
                    onChange={(e) => setNewProduct(prev => ({
                      ...prev,
                      description: { ...prev.description, en: e.target.value }
                    }))}
                    placeholder="Product description in English"
                  />
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={newProduct.isPublished}
                      onChange={(e) => setNewProduct(prev => ({
                        ...prev,
                        isPublished: e.target.checked
                      }))}
                    />
                    منشور للعملاء
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="save-btn" onClick={handleAddProduct}>
                  ✅ إضافة المنتج
                </button>
                <button className="cancel-btn" onClick={() => setShowAddProductModal(false)}>
                  ❌ إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {showEditProductModal && editingProduct && (
          <div className="modal-overlay" onClick={() => setShowEditProductModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>✏️ تعديل المنتج</h3>
                <button className="modal-close-btn" onClick={() => setShowEditProductModal(false)}>✖️</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>اسم المنتج (عربي):</label>
                  <input
                    type="text"
                    value={editingProduct.name.ar}
                    onChange={(e) => setEditingProduct(prev => prev ? ({
                      ...prev,
                      name: { ...prev.name, ar: e.target.value }
                    }) : null)}
                    placeholder="أدخل اسم المنتج بالعربية"
                  />
                </div>
                <div className="form-group">
                  <label>اسم المنتج (إنجليزي):</label>
                  <input
                    type="text"
                    value={editingProduct.name.en}
                    onChange={(e) => setEditingProduct(prev => prev ? ({
                      ...prev,
                      name: { ...prev.name, en: e.target.value }
                    }) : null)}
                    placeholder="Enter product name in English"
                  />
                </div>
                <div className="form-group">
                  <label>الفئة:</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct(prev => prev ? ({
                      ...prev,
                      category: e.target.value as ProductCategory
                    }) : null)}
                  >
                    <option value="fruits">فواكه</option>
                    <option value="vegetables">خضار</option>
                    <option value="herbs">أعشاب</option>
                    <option value="nuts">مكسرات</option>
                    <option value="dairy">ألبان</option>
                    <option value="beverages">مشروبات</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>السعر:</label>
                  <input
                    type="number"
                    step="0.001"
                    value={editingProduct.units[0]?.price || 0}
                    onChange={(e) => setEditingProduct(prev => prev ? ({
                      ...prev,
                      units: prev.units.map((unit, index) => 
                        index === 0 ? { ...unit, price: parseFloat(e.target.value) || 0 } : unit
                      )
                    }) : null)}
                    placeholder="0.000"
                  />
                  <span>د.ك</span>
                </div>
                <div className="form-group">
                  <label>الوحدة (عربي):</label>
                  <input
                    type="text"
                    value={editingProduct.units[0]?.unit.ar || ''}
                    onChange={(e) => setEditingProduct(prev => prev ? ({
                      ...prev,
                      units: prev.units.map((unit, index) => 
                        index === 0 ? { ...unit, unit: { ...unit.unit, ar: e.target.value } } : unit
                      )
                    }) : null)}
                    placeholder="كيلو"
                  />
                </div>
                <div className="form-group">
                  <label>الوحدة (إنجليزي):</label>
                  <input
                    type="text"
                    value={editingProduct.units[0]?.unit.en || ''}
                    onChange={(e) => setEditingProduct(prev => prev ? ({
                      ...prev,
                      units: prev.units.map((unit, index) => 
                        index === 0 ? { ...unit, unit: { ...unit.unit, en: e.target.value } } : unit
                      )
                    }) : null)}
                    placeholder="kg"
                  />
                </div>
                <div className="form-group">
                  <label>الصورة:</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageUpload}
                      className="image-upload-input"
                      id="edit-product-image"
                    />
                    <label htmlFor="edit-product-image" className="image-upload-label">
                      📁 اختر صورة من الجهاز
                    </label>
                    {editingProduct.images[0] && (
                      <div className="image-preview">
                        <img 
                          src={editingProduct.images[0]} 
                          alt="معاينة الصورة" 
                          className="preview-image"
                        />
                        <button 
                          type="button"
                          onClick={() => setEditingProduct(prev => prev ? ({ ...prev, images: [''] }) : null)}
                          className="remove-image-btn"
                        >
                          ❌ إزالة الصورة
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="or-divider">أو</div>
                  <input
                    type="url"
                    value={editingProduct.images[0]?.startsWith('data:') ? '' : (editingProduct.images[0] || '')}
                    onChange={(e) => setEditingProduct(prev => prev ? ({
                      ...prev,
                      images: [e.target.value]
                    }) : null)}
                    placeholder="أدخل رابط الصورة (https://...)"
                    className="url-input"
                  />
                </div>
                <div className="form-group">
                  <label>الوصف (عربي):</label>
                  <textarea
                    value={editingProduct.description?.ar || ''}
                    onChange={(e) => setEditingProduct(prev => prev ? ({
                      ...prev,
                      description: { 
                        ar: e.target.value, 
                        en: prev.description?.en || '' 
                      }
                    }) : null)}
                    placeholder="وصف المنتج بالعربية"
                  />
                </div>
                <div className="form-group">
                  <label>الوصف (إنجليزي):</label>
                  <textarea
                    value={editingProduct.description?.en || ''}
                    onChange={(e) => setEditingProduct(prev => prev ? ({
                      ...prev,
                      description: { 
                        ar: prev.description?.ar || '', 
                        en: e.target.value 
                      }
                    }) : null)}
                    placeholder="Product description in English"
                  />
                </div>
                <div className="form-group">
                  <label>المخزون:</label>
                  <input
                    type="number"
                    value={editingProduct.stock || 0}
                    onChange={(e) => setEditingProduct(prev => prev ? ({
                      ...prev,
                      stock: parseInt(e.target.value) || 0
                    }) : null)}
                    placeholder="الكمية المتوفرة"
                  />
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={editingProduct.isPublished}
                      onChange={(e) => setEditingProduct(prev => prev ? ({
                        ...prev,
                        isPublished: e.target.checked
                      }) : null)}
                    />
                    منشور للعملاء
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="save-btn" onClick={handleEditProductSave}>
                  ✅ حفظ التغييرات
                </button>
                <button className="cancel-btn" onClick={() => setShowEditProductModal(false)}>
                  ❌ إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;