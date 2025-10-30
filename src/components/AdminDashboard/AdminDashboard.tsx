import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { InvoiceService, InvoiceData } from '../../services/InvoiceService.ts';
import './AdminDashboard.css';

export interface OrderStats {
  totalOrders: number;
  todayOrders: number;
  weekOrders: number;
  monthOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

export interface UserStats {
  totalUsers: number;
  newUsersToday: number;
  newUsersWeek: number;
  newUsersMonth: number;
  activeUsers: number;
}

export interface RecentOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerArea: string;
  customerEmail?: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
  items: number;
  products: Array<{
    name: { ar: string; en: string };
    quantity: number;
    price: number;
    unit: { ar: string; en: string };
  }>;
  paymentMethod: 'cash' | 'link';
  deliveryPrice: number;
}

export interface DashboardData {
  orderStats: OrderStats;
  userStats: UserStats;
  recentOrders: RecentOrder[];
  dailyOrders: { date: string; count: number; revenue: number }[];
}

interface AdminDashboardProps {
  language: Language;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ language }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    orderStats: {
      totalOrders: 0,
      todayOrders: 0,
      weekOrders: 0,
      monthOrders: 0,
      totalRevenue: 0,
      todayRevenue: 0,
      weekRevenue: 0,
      monthRevenue: 0,
      pendingOrders: 0,
      completedOrders: 0,
      cancelledOrders: 0
    },
    userStats: {
      totalUsers: 0,
      newUsersToday: 0,
      newUsersWeek: 0,
      newUsersMonth: 0,
      activeUsers: 0
    },
    recentOrders: [],
    dailyOrders: []
  });

  // Load real data from localStorage
  useEffect(() => {
    loadRealDashboardData();
  }, []);

  const loadRealDashboardData = () => {
    // Load users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Load all orders
    const allOrders: any[] = [];
    registeredUsers.forEach((user: any) => {
      const userOrders = JSON.parse(localStorage.getItem(`orders_${user.email}`) || '[]');
      userOrders.forEach((order: any) => {
        allOrders.push({
          ...order,
          userEmail: user.email,
          userName: user.name,
          customerInfo: order.customerInfo || { name: user.name, phone: user.phone || '', address: user.address || '', area: user.area || '' }
        });
      });
    });

    // Calculate date ranges
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Calculate order stats
    const todayOrders = allOrders.filter(order => order.date.startsWith(todayStr));
    const weekOrders = allOrders.filter(order => new Date(order.date) >= weekAgo);
    const monthOrders = allOrders.filter(order => new Date(order.date) >= monthAgo);

    const orderStats: OrderStats = {
      totalOrders: allOrders.length,
      todayOrders: todayOrders.length,
      weekOrders: weekOrders.length,
      monthOrders: monthOrders.length,
      totalRevenue: allOrders.reduce((sum, order) => sum + (order.total || 0), 0),
      todayRevenue: todayOrders.reduce((sum, order) => sum + (order.total || 0), 0),
      weekRevenue: weekOrders.reduce((sum, order) => sum + (order.total || 0), 0),
      monthRevenue: monthOrders.reduce((sum, order) => sum + (order.total || 0), 0),
      pendingOrders: allOrders.filter(order => order.status === 'pending').length,
      completedOrders: allOrders.filter(order => order.status === 'delivered' || order.status === 'completed').length,
      cancelledOrders: allOrders.filter(order => order.status === 'cancelled').length
    };

    // Calculate user stats
    const todayUsers = registeredUsers.filter((user: any) => {
      const joinDate = user.joinDate || user.registrationDate || '';
      return joinDate.startsWith(todayStr);
    });
    const weekUsers = registeredUsers.filter((user: any) => {
      const joinDate = new Date(user.joinDate || user.registrationDate || '');
      return joinDate >= weekAgo;
    });
    const monthUsers = registeredUsers.filter((user: any) => {
      const joinDate = new Date(user.joinDate || user.registrationDate || '');
      return joinDate >= monthAgo;
    });

    const userStats: UserStats = {
      totalUsers: registeredUsers.length,
      newUsersToday: todayUsers.length,
      newUsersWeek: weekUsers.length,
      newUsersMonth: monthUsers.length,
      activeUsers: registeredUsers.filter((user: any) => user.isActive !== false).length
    };

    // Get recent orders (last 10)
    const recentOrders: RecentOrder[] = allOrders
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
      .map(order => ({
        id: order.orderNumber || order.id,
        customerName: order.customerInfo?.name || order.userName,
        customerPhone: order.customerInfo?.phone || '',
        customerAddress: order.customerInfo?.address || '',
        customerArea: order.customerInfo?.area || '',
        customerEmail: order.userEmail,
        total: order.total || 0,
        status: order.status || 'pending',
        date: order.date,
        items: order.items?.length || 0,
        products: order.items || [],
        paymentMethod: order.paymentMethod || 'cash',
        deliveryPrice: order.deliveryPrice || 0
      }));

    // Calculate daily orders for the last 7 days
    const dailyOrders = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayOrders = allOrders.filter(order => order.date.startsWith(dateStr));
      dailyOrders.push({
        date: dateStr,
        count: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + (order.total || 0), 0)
      });
    }

    setDashboardData({
      orderStats,
      userStats,
      recentOrders,
      dailyOrders
    });
  };

  const texts = {
        customerAddress: 'الفروانية، شقة 18',
        customerArea: 'الفروانية',
  const texts = {
    ar: {
      dashboard: 'لوحة المعلومات',
      orderStats: 'إحصائيات الطلبات',
      userStats: 'إحصائيات المستخدمين',
      recentOrders: 'الطلبات الحديثة',
      orderChart: 'رسم بياني للطلبات',
      totalOrders: 'إجمالي الطلبات',
      todayOrders: 'طلبات اليوم',
      weekOrders: 'طلبات الأسبوع',
      monthOrders: 'طلبات الشهر',
      totalRevenue: 'إجمالي الإيرادات',
      todayRevenue: 'إيرادات اليوم',
      weekRevenue: 'إيرادات الأسبوع',
      monthRevenue: 'إيرادات الشهر',
      pendingOrders: 'طلبات قيد الانتظار',
      completedOrders: 'طلبات مكتملة',
      cancelledOrders: 'طلبات ملغية',
      totalUsers: 'إجمالي المستخدمين',
      newUsersToday: 'مستخدمين جدد اليوم',
      newUsersWeek: 'مستخدمين جدد هذا الأسبوع',
      newUsersMonth: 'مستخدمين جدد هذا الشهر',
      activeUsers: 'مستخدمين نشطين',
      customerName: 'اسم العميل',
      customerPhone: 'رقم الهاتف',
      customerArea: 'المنطقة',
      total: 'المجموع',
      status: 'الحالة',
      date: 'التاريخ',
      items: 'العناصر',
      paymentMethod: 'طريقة الدفع',
      pending: 'قيد الانتظار',
      completed: 'مكتمل',
      cancelled: 'ملغي',
      cash: 'دفع عند التوصيل',
      link: 'دفع إلكتروني',
      currency: 'د.ك',
      viewOrder: 'عرض الطلب',
      downloadInvoice: 'تحميل الفاتورة'
    },
    en: {
      dashboard: 'Dashboard',
      orderStats: 'Order Statistics',
      userStats: 'User Statistics',
      recentOrders: 'Recent Orders',
      orderChart: 'Order Chart',
      totalOrders: 'Total Orders',
      todayOrders: "Today's Orders",
      weekOrders: 'Week Orders',
      monthOrders: 'Month Orders',
      totalRevenue: 'Total Revenue',
      todayRevenue: "Today's Revenue",
      weekRevenue: 'Week Revenue',
      monthRevenue: 'Month Revenue',
      pendingOrders: 'Pending Orders',
      completedOrders: 'Completed Orders',
      cancelledOrders: 'Cancelled Orders',
      totalUsers: 'Total Users',
      newUsersToday: 'New Users Today',
      newUsersWeek: 'New Users This Week',
      newUsersMonth: 'New Users This Month',
      activeUsers: 'Active Users',
      customerName: 'Customer Name',
      customerPhone: 'Phone Number',
      customerArea: 'Area',
      total: 'Total',
      status: 'Status',
      date: 'Date',
      items: 'Items',
      paymentMethod: 'Payment Method',
      pending: 'Pending',
      completed: 'Completed',
      cancelled: 'Cancelled',
      cash: 'Cash on Delivery',
      link: 'Online Payment',
      currency: 'KD',
      viewOrder: 'View Order',
      downloadInvoice: 'Download Invoice'
    }
  };

  const currentTexts = texts[language];
    ar: {
      dashboard: 'لوحة المعلومات',
      orderStats: 'إحصائيات الطلبات',
      userStats: 'إحصائيات المستخدمين',
      recentOrders: 'الطلبات الأخيرة',
      orderChart: 'مخطط الطلبات الأسبوعي',
      totalOrders: 'إجمالي الطلبات',
      todayOrders: 'طلبات اليوم',
      weekOrders: 'طلبات الأسبوع',
      monthOrders: 'طلبات الشهر',
      totalRevenue: 'إجمالي الإيرادات',
      todayRevenue: 'إيرادات اليوم',
      weekRevenue: 'إيرادات الأسبوع',
      monthRevenue: 'إيرادات الشهر',
      pendingOrders: 'طلبات معلقة',
      completedOrders: 'طلبات مكتملة',
      cancelledOrders: 'طلبات ملغية',
      totalUsers: 'إجمالي المستخدمين',
      newUsersToday: 'مستخدمين جدد اليوم',
      newUsersWeek: 'مستخدمين جدد هذا الأسبوع',
      newUsersMonth: 'مستخدمين جدد هذا الشهر',
      activeUsers: 'مستخدمين نشطين',
      orderNumber: 'رقم الطلب',
      customer: 'العميل',
      total: 'المجموع',
      status: 'الحالة',
      date: 'التاريخ',
      items: 'عدد المنتجات',
      pending: 'معلق',
      completed: 'مكتمل',
      cancelled: 'ملغي',
      currency: 'د.ك',
      viewAll: 'عرض الكل',
      refresh: 'تحديث',
      viewInvoice: 'انقر على رقم الطلب لعرض الفاتورة',
      downloadInvoice: 'تحميل الفاتورة'
    },
    en: {
      dashboard: 'Dashboard',
      orderStats: 'Order Statistics',
      userStats: 'User Statistics',
      recentOrders: 'Recent Orders',
      orderChart: 'Weekly Orders Chart',
      totalOrders: 'Total Orders',
      todayOrders: 'Today Orders',
      weekOrders: 'Week Orders',
      monthOrders: 'Month Orders',
      totalRevenue: 'Total Revenue',
      todayRevenue: 'Today Revenue',
      weekRevenue: 'Week Revenue',
      monthRevenue: 'Month Revenue',
      pendingOrders: 'Pending Orders',
      completedOrders: 'Completed Orders',
      cancelledOrders: 'Cancelled Orders',
      totalUsers: 'Total Users',
      newUsersToday: 'New Users Today',
      newUsersWeek: 'New Users This Week',
      newUsersMonth: 'New Users This Month',
      activeUsers: 'Active Users',
      orderNumber: 'Order Number',
      customer: 'Customer',
      total: 'Total',
      status: 'Status',
      date: 'Date',
      items: 'Items',
      pending: 'Pending',
      completed: 'Completed',
      cancelled: 'Cancelled',
      currency: 'KWD',
      viewAll: 'View All',
      refresh: 'Refresh',
      viewInvoice: 'View Invoice',
      downloadInvoice: 'Download Invoice'
    }
  };

  const currentTexts = texts[language];

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

  const handleViewInvoice = async (order: RecentOrder) => {
    try {
      const subtotal = order.total - order.deliveryPrice;
      
      const invoiceData: InvoiceData = {
        orderNumber: order.id,
        date: order.date,
        customerInfo: {
          name: order.customerName,
          phone: order.customerPhone,
          address: order.customerAddress,
          area: order.customerArea,
        },
        items: order.products.map(product => ({
          product: {
            id: 1,
            name: product.name,
            category: 'fruits',
            units: [{
              id: 1,
              unit: product.unit,
              price: product.price,
              isDefault: true
            }],
            images: [''],
            isPublished: true,
            stock: 0,
            tags: []
          },
          selectedUnit: {
            id: 1,
            unit: product.unit,
            price: product.price,
            isDefault: true
          },
          quantity: product.quantity
        })),
        subtotal,
        deliveryPrice: order.deliveryPrice,
        total: order.total,
        paymentMethod: order.paymentMethod,
        language,
      };

      const invoiceService = InvoiceService.getInstance();
      await invoiceService.downloadInvoice(invoiceData);
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('حدث خطأ في إنشاء الفاتورة');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>{currentTexts.dashboard}</h2>
        <button className="refresh-btn" onClick={() => window.location.reload()}>
          🔄 {currentTexts.refresh}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {/* Orders Stats */}
        <div className="stats-section">
          <h3>{currentTexts.orderStats}</h3>
          <div className="stats-cards">
            <div className="stat-card primary">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <div className="stat-number">{dashboardData.orderStats.totalOrders}</div>
                <div className="stat-label">{currentTexts.totalOrders}</div>
              </div>
            </div>
            
            <div className="stat-card success">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <div className="stat-number">{dashboardData.orderStats.todayOrders}</div>
                <div className="stat-label">{currentTexts.todayOrders}</div>
              </div>
            </div>
            
            <div className="stat-card info">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-number">{dashboardData.orderStats.weekOrders}</div>
                <div className="stat-label">{currentTexts.weekOrders}</div>
              </div>
            </div>
            
            <div className="stat-card warning">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <div className="stat-number">{dashboardData.orderStats.pendingOrders}</div>
                <div className="stat-label">{currentTexts.pendingOrders}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="stats-section">
          <h3>الإيرادات</h3>
          <div className="stats-cards">
            <div className="stat-card revenue">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-number">{dashboardData.orderStats.totalRevenue.toFixed(3)}</div>
                <div className="stat-label">{currentTexts.totalRevenue} ({currentTexts.currency})</div>
              </div>
            </div>
            
            <div className="stat-card revenue-today">
              <div className="stat-icon">💵</div>
              <div className="stat-content">
                <div className="stat-number">{dashboardData.orderStats.todayRevenue.toFixed(3)}</div>
                <div className="stat-label">{currentTexts.todayRevenue} ({currentTexts.currency})</div>
              </div>
            </div>
            
            <div className="stat-card revenue-week">
              <div className="stat-icon">💳</div>
              <div className="stat-content">
                <div className="stat-number">{dashboardData.orderStats.weekRevenue.toFixed(3)}</div>
                <div className="stat-label">{currentTexts.weekRevenue} ({currentTexts.currency})</div>
              </div>
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div className="stats-section">
          <h3>{currentTexts.userStats}</h3>
          <div className="stats-cards">
            <div className="stat-card users">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-number">{dashboardData.userStats.totalUsers}</div>
                <div className="stat-label">{currentTexts.totalUsers}</div>
              </div>
            </div>
            
            <div className="stat-card new-users">
              <div className="stat-icon">👤</div>
              <div className="stat-content">
                <div className="stat-number">{dashboardData.userStats.newUsersToday}</div>
                <div className="stat-label">{currentTexts.newUsersToday}</div>
              </div>
            </div>
            
            <div className="stat-card active-users">
              <div className="stat-icon">🟢</div>
              <div className="stat-content">
                <div className="stat-number">{dashboardData.userStats.activeUsers}</div>
                <div className="stat-label">{currentTexts.activeUsers}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>{currentTexts.orderChart}</h3>
          <div className="simple-chart">
            {dashboardData.dailyOrders.map((day, index) => (
              <div key={index} className="chart-bar">
                <div 
                  className="bar" 
                  style={{ height: `${(day.count / 25) * 100}%` }}
                  title={`${day.date}: ${day.count} طلبات - ${day.revenue.toFixed(3)} د.ك`}
                >
                </div>
                <div className="bar-label">{day.date.split('-')[2]}</div>
                <div className="bar-value">{day.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders-section">
        <div className="section-header">
          <h3>{currentTexts.recentOrders}</h3>
          <button className="view-all-btn">{currentTexts.viewAll}</button>
        </div>
        
        <div className="orders-table">
          <div className="table-header">
            <div className="col">
              {currentTexts.orderNumber}
              <span className="clickable-hint">📋 (انقر للفاتورة)</span>
            </div>
            <div className="col">{currentTexts.customer}</div>
            <div className="col">{currentTexts.total}</div>
            <div className="col">{currentTexts.status}</div>
            <div className="col">{currentTexts.date}</div>
            <div className="col">{currentTexts.items}</div>
            <div className="col">الإجراءات</div>
          </div>
          
          {dashboardData.recentOrders.map((order) => (
            <div key={order.id} className="table-row">
              <div className="col order-id">
                <button 
                  className="order-number-btn"
                  onClick={() => handleViewInvoice(order)}
                  title={currentTexts.viewInvoice}
                >
                  {order.id}
                </button>
              </div>
              <div className="col customer-name">{order.customerName}</div>
              <div className="col total-amount">{order.total.toFixed(3)} {currentTexts.currency}</div>
              <div className="col status">
                <span className={`status-badge ${order.status}`}>
                  {getStatusIcon(order.status)} {getStatusText(order.status)}
                </span>
              </div>
              <div className="col order-date">{order.date}</div>
              <div className="col items-count">{order.items}</div>
              <div className="col actions">
                <button 
                  className="invoice-btn"
                  onClick={() => handleViewInvoice(order)}
                  title={currentTexts.viewInvoice}
                >
                  📄
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;