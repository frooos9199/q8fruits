import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import './UserProfile.css';

interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
  area: string;
  joinDate: string;
  orderCount: number;
  totalSpent: number;
  addresses: SavedAddress[];
  orders: OrderHistory[];
}

interface SavedAddress {
  id: string;
  label: string;
  address: string;
  area: string;
  isDefault: boolean;
}

interface OrderHistory {
  id: string;
  orderNumber: string;
  date: string;
  items: Array<{
    name: { ar: string; en: string };
    quantity: number;
    price: number;
    unit: { ar: string; en: string };
  }>;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: 'cash' | 'link';
  deliveryPrice: number;
  customerInfo: {
    name: string;
    phone: string;
    address: string;
    area: string;
  };
}

interface UserProfileProps {
  language: Language;
  userType: 'admin' | 'user';
  userName: string;
  userEmail: string;
  onLogout: () => void;
  onAdminPanel?: () => void;
  isDropdown?: boolean;
  onClose?: () => void;
  onOpenFullProfile?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  language,
  userType,
  userName,
  userEmail,
  onLogout,
  onAdminPanel,
  isDropdown = true,
  onClose,
  onOpenFullProfile
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'orders' | 'addresses' | 'settings'>('overview');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: '',
    area: ''
  });
  const [newAddress, setNewAddress] = useState({
    label: '',
    address: '',
    area: ''
  });
  const [showAddAddress, setShowAddAddress] = useState(false);

  const texts = {
    ar: {
      welcome: 'مرحباً',
      admin: 'مدير النظام',
      user: 'عضو',
      adminPanel: 'لوحة الإدارة',
      logout: 'تسجيل خروج',
      profile: 'الملف الشخصي',
      orders: 'طلباتي',
      settings: 'الإعدادات',
      overview: 'نظرة عامة',
      addresses: 'العناوين المحفوظة',
      editProfile: 'تعديل الملف الشخصي',
      save: 'حفظ',
      cancel: 'إلغاء',
      name: 'الاسم',
      phone: 'رقم الهاتف',
      email: 'البريد الإلكتروني',
      address: 'العنوان',
      area: 'المحافظة',
      joinDate: 'تاريخ التسجيل',
      totalOrders: 'إجمالي الطلبات',
      totalSpent: 'إجمالي المبلغ المدفوع',
      currency: 'د.ك',
      orderHistory: 'سجل الطلبات',
      orderNumber: 'رقم الطلب',
      date: 'التاريخ',
      total: 'المجموع',
      status: 'الحالة',
      items: 'المنتجات',
      pending: 'معلق',
      completed: 'مكتمل',
      cancelled: 'ملغي',
      noOrders: 'لا توجد طلبات سابقة',
      addAddress: 'إضافة عنوان جديد',
      addressLabel: 'اسم العنوان',
      setDefault: 'تعيين كافتراضي',
      deleteAddress: 'حذف العنوان',
      noAddresses: 'لا توجد عناوين محفوظة',
      paymentMethod: 'طريقة الدفع',
      cash: 'نقداً',
      link: 'رابط دفع',
      deliveryPrice: 'سعر التوصيل',
      subtotal: 'المجموع الفرعي',
      viewDetails: 'عرض التفاصيل',
      close: 'إغلاق'
    },
    en: {
      welcome: 'Welcome',
      admin: 'Administrator',
      user: 'Member',
      adminPanel: 'Admin Panel',
      logout: 'Logout',
      profile: 'Profile',
      orders: 'My Orders',
      settings: 'Settings',
      overview: 'Overview',
      addresses: 'Saved Addresses',
      editProfile: 'Edit Profile',
      save: 'Save',
      cancel: 'Cancel',
      name: 'Name',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      area: 'Area',
      joinDate: 'Join Date',
      totalOrders: 'Total Orders',
      totalSpent: 'Total Spent',
      currency: 'KWD',
      orderHistory: 'Order History',
      orderNumber: 'Order Number',
      date: 'Date',
      total: 'Total',
      status: 'Status',
      items: 'Items',
      pending: 'Pending',
      completed: 'Completed',
      cancelled: 'Cancelled',
      noOrders: 'No previous orders',
      addAddress: 'Add New Address',
      addressLabel: 'Address Label',
      setDefault: 'Set as Default',
      deleteAddress: 'Delete Address',
      noAddresses: 'No saved addresses',
      paymentMethod: 'Payment Method',
      cash: 'Cash',
      link: 'Payment Link',
      deliveryPrice: 'Delivery Price',
      subtotal: 'Subtotal',
      viewDetails: 'View Details',
      close: 'Close'
    }
  };

  const currentTexts = texts[language];

  // Load user data on component mount
  useEffect(() => {
    if (userEmail) {
      loadUserData();
    }
  }, [userEmail, userName]);

  const loadUserData = () => {
    console.log('Loading user data for:', userEmail);
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const currentUser = registeredUsers.find((user: any) => user.email === userEmail);
    
    console.log('Found user:', currentUser);
    
    if (currentUser) {
      // Load user orders from localStorage
      const userOrders = JSON.parse(localStorage.getItem(`orders_${userEmail}`) || '[]');
      
      const userData: UserData = {
        name: currentUser.name || userName,
        email: userEmail,
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        area: currentUser.area || '',
        joinDate: currentUser.joinDate || new Date().toLocaleDateString(),
        orderCount: userOrders.length,
        totalSpent: userOrders.reduce((sum: number, order: OrderHistory) => sum + order.total, 0),
        addresses: currentUser.addresses || [],
        orders: userOrders
      };
      
      console.log('Setting user data:', userData);
      setUserData(userData);
      setEditForm({
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
        area: userData.area
      });
    } else {
      // If user not found, create default user data
      const userOrders = JSON.parse(localStorage.getItem(`orders_${userEmail}`) || '[]');
      
      const defaultUserData: UserData = {
        name: userName || 'مستخدم',
        email: userEmail,
        phone: '',
        address: '',
        area: '',
        joinDate: new Date().toLocaleDateString(),
        orderCount: userOrders.length,
        totalSpent: userOrders.reduce((sum: number, order: OrderHistory) => sum + order.total, 0),
        addresses: [],
        orders: userOrders
      };
      
      console.log('Setting default user data:', defaultUserData);
      setUserData(defaultUserData);
      setEditForm({
        name: defaultUserData.name,
        phone: defaultUserData.phone,
        address: defaultUserData.address,
        area: defaultUserData.area
      });
    }
  };

  const handleSaveProfile = () => {
    if (!userData) return;
    
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = registeredUsers.findIndex((user: any) => user.email === userEmail);
    
    if (userIndex !== -1) {
      registeredUsers[userIndex] = {
        ...registeredUsers[userIndex],
        name: editForm.name,
        phone: editForm.phone,
        address: editForm.address,
        area: editForm.area
      };
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      // Update userName in App state
      localStorage.setItem('userName', editForm.name);
      
      setUserData({
        ...userData,
        name: editForm.name,
        phone: editForm.phone,
        address: editForm.address,
        area: editForm.area
      });
      
      setIsEditing(false);
    }
  };

  const handleAddAddress = () => {
    if (!userData || !newAddress.label || !newAddress.address || !newAddress.area) return;
    
    const newAddressObj: SavedAddress = {
      id: Date.now().toString(),
      label: newAddress.label,
      address: newAddress.address,
      area: newAddress.area,
      isDefault: userData.addresses.length === 0
    };
    
    const updatedAddresses = [...userData.addresses, newAddressObj];
    
    // Update user in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = registeredUsers.findIndex((user: any) => user.email === userEmail);
    
    if (userIndex !== -1) {
      registeredUsers[userIndex].addresses = updatedAddresses;
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      setUserData({
        ...userData,
        addresses: updatedAddresses
      });
      
      setNewAddress({ label: '', address: '', area: '' });
      setShowAddAddress(false);
    }
  };

  const handleDeleteAddress = (addressId: string) => {
    if (!userData) return;
    
    const updatedAddresses = userData.addresses.filter(addr => addr.id !== addressId);
    
    // Update user in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = registeredUsers.findIndex((user: any) => user.email === userEmail);
    
    if (userIndex !== -1) {
      registeredUsers[userIndex].addresses = updatedAddresses;
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      setUserData({
        ...userData,
        addresses: updatedAddresses
      });
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return currentTexts.pending;
      case 'completed': return currentTexts.completed;
      case 'cancelled': return currentTexts.cancelled;
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '📦';
    }
  };

  if (isDropdown) {
    // Original dropdown view
    return (
      <div className="user-profile-dropdown">
        <div className="profile-header">
          <div className="user-avatar">
            {userType === 'admin' ? '👑' : '👤'}
          </div>
          <div className="user-info">
            <h4>{currentTexts.welcome}, {userName}</h4>
            <p className={`user-type ${userType}`}>
              {userType === 'admin' ? currentTexts.admin : currentTexts.user}
            </p>
            <span className="user-email">{userEmail}</span>
          </div>
        </div>

        <div className="profile-actions">
          {userType === 'admin' && onAdminPanel && (
            <button className="profile-btn admin-btn" onClick={onAdminPanel}>
              ⚙️ {currentTexts.adminPanel}
            </button>
          )}
          
          <button className="profile-btn" onClick={() => onOpenFullProfile && onOpenFullProfile()}>
            👤 {currentTexts.profile}
          </button>
          
          <button className="profile-btn" onClick={() => {
            if (onOpenFullProfile) {
              onOpenFullProfile();
              setTimeout(() => setActiveTab('orders'), 100);
            }
          }}>
            📦 {currentTexts.orders}
          </button>
          
          <button className="profile-btn" onClick={() => {
            if (onOpenFullProfile) {
              onOpenFullProfile();
              setTimeout(() => setActiveTab('addresses'), 100);
            }
          }}>
            📍 {currentTexts.addresses}
          </button>
          
          <button className="profile-btn" onClick={() => {
            if (onOpenFullProfile) {
              onOpenFullProfile();
              setTimeout(() => setActiveTab('settings'), 100);
            }
          }}>
            ⚙️ {currentTexts.settings}
          </button>
          
          <button className="profile-btn logout-btn" onClick={onLogout}>
            🚪 {currentTexts.logout}
          </button>
        </div>
      </div>
    );
  }

  // Full profile view
  if (!userData) {
    return (
      <div className="user-profile-full">
        <div className="profile-header-full">
          <h2>{currentTexts.profile}</h2>
          {onClose && <button className="close-btn" onClick={onClose}>✕</button>}
        </div>
        <div className="user-profile-loading">
          <div className="loading-spinner">🔄</div>
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-full">
      {onClose && (
        <div className="profile-header-full">
          <h2>{currentTexts.profile}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
      )}
      
      <div className="profile-navigation">
        <button 
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 {currentTexts.overview}
        </button>
        <button 
          className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 {currentTexts.profile}
        </button>
        <button 
          className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 {currentTexts.orders}
        </button>
        <button 
          className={`nav-btn ${activeTab === 'addresses' ? 'active' : ''}`}
          onClick={() => setActiveTab('addresses')}
        >
          📍 {currentTexts.addresses}
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="user-stats">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <h3>{userData.orderCount}</h3>
                  <p>{currentTexts.totalOrders}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>{userData.totalSpent.toFixed(3)} {currentTexts.currency}</h3>
                  <p>{currentTexts.totalSpent}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <h3>{userData.joinDate}</h3>
                  <p>{currentTexts.joinDate}</p>
                </div>
              </div>
            </div>
            
            <div className="recent-orders">
              <h3>{currentTexts.orderHistory}</h3>
              {userData.orders.slice(0, 3).map((order) => (
                <div key={order.id} className="order-summary">
                  <div className="order-header">
                    <span className="order-number">#{order.orderNumber}</span>
                    <span className="order-status">
                      {getStatusIcon(order.status)} {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="order-details">
                    <span className="order-date">{order.date}</span>
                    <span className="order-total">{order.total.toFixed(3)} {currentTexts.currency}</span>
                  </div>
                </div>
              ))}
              {userData.orders.length === 0 && (
                <p className="no-data">{currentTexts.noOrders}</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-section">
            <div className="profile-form">
              <div className="form-header">
                <h3>{currentTexts.profile}</h3>
                {!isEditing ? (
                  <button className="edit-btn" onClick={() => setIsEditing(true)}>
                    ✏️ {currentTexts.editProfile}
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="save-btn" onClick={handleSaveProfile}>
                      {currentTexts.save}
                    </button>
                    <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                      {currentTexts.cancel}
                    </button>
                  </div>
                )}
              </div>
              
              <div className="form-fields">
                <div className="field-group">
                  <label>{currentTexts.name}</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    />
                  ) : (
                    <span>{userData.name}</span>
                  )}
                </div>
                
                <div className="field-group">
                  <label>{currentTexts.email}</label>
                  <span>{userData.email}</span>
                </div>
                
                <div className="field-group">
                  <label>{currentTexts.phone}</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    />
                  ) : (
                    <span>{userData.phone || 'غير محدد'}</span>
                  )}
                </div>
                
                <div className="field-group">
                  <label>{currentTexts.area}</label>
                  {isEditing ? (
                    <select
                      value={editForm.area}
                      onChange={(e) => setEditForm({...editForm, area: e.target.value})}
                    >
                      <option value="">اختر المحافظة</option>
                      <option value="العاصمة">العاصمة</option>
                      <option value="حولي">حولي</option>
                      <option value="الفروانية">الفروانية</option>
                      <option value="الأحمدي">الأحمدي</option>
                      <option value="الجهراء">الجهراء</option>
                      <option value="مبارك الكبير">مبارك الكبير</option>
                    </select>
                  ) : (
                    <span>{userData.area || 'غير محدد'}</span>
                  )}
                </div>
                
                <div className="field-group">
                  <label>{currentTexts.address}</label>
                  {isEditing ? (
                    <textarea
                      value={editForm.address}
                      onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                      rows={3}
                    />
                  ) : (
                    <span>{userData.address || 'غير محدد'}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <h3>{currentTexts.orderHistory}</h3>
            {userData.orders.length > 0 ? (
              <div className="orders-list">
                {userData.orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <h4>#{order.orderNumber}</h4>
                        <p className="order-date">{order.date}</p>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge ${order.status}`}>
                          {getStatusIcon(order.status)} {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="order-items">
                      <p><strong>{currentTexts.items}:</strong></p>
                      <ul>
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {language === 'ar' ? item.name.ar : item.name.en} 
                            - {item.quantity} {language === 'ar' ? item.unit.ar : item.unit.en}
                            ({item.price.toFixed(3)} {currentTexts.currency})
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="order-summary">
                      <div className="summary-row">
                        <span>{currentTexts.subtotal}:</span>
                        <span>{(order.total - order.deliveryPrice).toFixed(3)} {currentTexts.currency}</span>
                      </div>
                      <div className="summary-row">
                        <span>{currentTexts.deliveryPrice}:</span>
                        <span>{order.deliveryPrice.toFixed(3)} {currentTexts.currency}</span>
                      </div>
                      <div className="summary-row total">
                        <span>{currentTexts.total}:</span>
                        <span>{order.total.toFixed(3)} {currentTexts.currency}</span>
                      </div>
                    </div>
                    
                    <div className="order-payment">
                      <span><strong>{currentTexts.paymentMethod}:</strong></span>
                      <span>{order.paymentMethod === 'cash' ? currentTexts.cash : currentTexts.link}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-orders">
                <p>{currentTexts.noOrders}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="addresses-section">
            <div className="section-header">
              <h3>{currentTexts.addresses}</h3>
              <button 
                className="add-btn"
                onClick={() => setShowAddAddress(!showAddAddress)}
              >
                ➕ {currentTexts.addAddress}
              </button>
            </div>
            
            {showAddAddress && (
              <div className="add-address-form">
                <div className="form-fields">
                  <input
                    type="text"
                    placeholder={currentTexts.addressLabel}
                    value={newAddress.label}
                    onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                  />
                  <select
                    value={newAddress.area}
                    onChange={(e) => setNewAddress({...newAddress, area: e.target.value})}
                  >
                    <option value="">اختر المحافظة</option>
                    <option value="العاصمة">العاصمة</option>
                    <option value="حولي">حولي</option>
                    <option value="الفروانية">الفروانية</option>
                    <option value="الأحمدي">الأحمدي</option>
                    <option value="الجهراء">الجهراء</option>
                    <option value="مبارك الكبير">مبارك الكبير</option>
                  </select>
                  <textarea
                    placeholder={currentTexts.address}
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="form-actions">
                  <button className="save-btn" onClick={handleAddAddress}>
                    {currentTexts.save}
                  </button>
                  <button className="cancel-btn" onClick={() => setShowAddAddress(false)}>
                    {currentTexts.cancel}
                  </button>
                </div>
              </div>
            )}
            
            {userData.addresses.length > 0 ? (
              <div className="addresses-list">
                {userData.addresses.map((address) => (
                  <div key={address.id} className="address-card">
                    <div className="address-header">
                      <h4>{address.label}</h4>
                      {address.isDefault && (
                        <span className="default-badge">افتراضي</span>
                      )}
                    </div>
                    <p className="address-area">{address.area}</p>
                    <p className="address-text">{address.address}</p>
                    <div className="address-actions">
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteAddress(address.id)}
                      >
                        🗑️ {currentTexts.deleteAddress}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-addresses">
                <p>{currentTexts.noAddresses}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;