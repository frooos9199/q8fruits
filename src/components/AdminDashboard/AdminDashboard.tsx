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
      totalOrders: 156,
      todayOrders: 12,
      weekOrders: 78,
      monthOrders: 156,
      totalRevenue: 29.500,
      todayRevenue: 18.900,
      weekRevenue: 25.100,
      monthRevenue: 29.500,
      pendingOrders: 8,
      completedOrders: 140,
      cancelledOrders: 8
    },
    userStats: {
      totalUsers: 284,
      newUsersToday: 5,
      newUsersWeek: 23,
      newUsersMonth: 67,
      activeUsers: 142
    },
    recentOrders: [
      { 
        id: 'FK1698567890123', 
        customerName: 'أحمد محمد', 
        customerPhone: '99887766',
        customerAddress: 'شارع الخليج العربي، بيت 15',
        customerArea: 'العاصمة',
        customerEmail: 'ahmed@email.com',
        total: 5.800, 
        status: 'pending', 
        date: '2025-10-28', 
        items: 5,
        products: [
          { name: { ar: 'تفاح أحمر', en: 'Red Apple' }, quantity: 2, price: 1.500, unit: { ar: 'كيلو', en: 'kg' } },
          { name: { ar: 'موز', en: 'Banana' }, quantity: 1, price: 0.800, unit: { ar: 'سحارة', en: 'bunch' } }
        ],
        paymentMethod: 'cash',
        deliveryPrice: 2.000
      },
      { 
        id: 'FK1698567890124', 
        customerName: 'فاطمة علي', 
        customerPhone: '55443322',
        customerAddress: 'شارع السالمية، شقة 25',
        customerArea: 'حولي',
        total: 4.200, 
        status: 'completed', 
        date: '2025-10-28', 
        items: 3,
        products: [
          { name: { ar: 'خس', en: 'Lettuce' }, quantity: 2, price: 0.500, unit: { ar: 'حبة', en: 'piece' } },
          { name: { ar: 'طماطم', en: 'Tomato' }, quantity: 1, price: 1.200, unit: { ar: 'كيلو', en: 'kg' } }
        ],
        paymentMethod: 'link',
        deliveryPrice: 2.000
      },
      { 
        id: 'FK1698567890125', 
        customerName: 'خالد يوسف', 
        customerPhone: '77665544',
        customerAddress: 'منطقة الفنطاس، فيلا 8',
        customerArea: 'الأحمدي',
        total: 7.700, 
        status: 'completed', 
        date: '2025-10-28', 
        items: 7,
        products: [
          { name: { ar: 'تفاح أحمر', en: 'Red Apple' }, quantity: 3, price: 1.500, unit: { ar: 'كيلو', en: 'kg' } },
          { name: { ar: 'موز', en: 'Banana' }, quantity: 2, price: 0.800, unit: { ar: 'سحارة', en: 'bunch' } }
        ],
        paymentMethod: 'cash',
        deliveryPrice: 2.000
      },
      { 
        id: 'FK1698567890126', 
        customerName: 'نورا سالم', 
        customerPhone: '66554433',
        customerAddress: 'شارع الجهراء، بيت 42',
        customerArea: 'الجهراء',
        total: 6.400, 
        status: 'pending', 
        date: '2025-10-27', 
        items: 4,
        products: [
          { name: { ar: 'خس', en: 'Lettuce' }, quantity: 4, price: 0.500, unit: { ar: 'حبة', en: 'piece' } },
          { name: { ar: 'طماطم', en: 'Tomato' }, quantity: 2, price: 1.200, unit: { ar: 'كيلو', en: 'kg' } }
        ],
        paymentMethod: 'cash',
        deliveryPrice: 2.000
      },
      { 
        id: 'FK1698567890127', 
        customerName: 'سعد العتيبي', 
        customerPhone: '88776655',
        customerAddress: 'الفروانية، شقة 18',
        customerArea: 'الفروانية',
        total: 6.600, 
        status: 'completed', 
        date: '2025-10-27', 
        items: 6,
        products: [
          { name: { ar: 'تفاح أحمر', en: 'Red Apple' }, quantity: 2, price: 1.500, unit: { ar: 'كيلو', en: 'kg' } },
          { name: { ar: 'موز', en: 'Banana' }, quantity: 2, price: 0.800, unit: { ar: 'سحارة', en: 'bunch' } },
          { name: { ar: 'خس', en: 'Lettuce' }, quantity: 2, price: 0.500, unit: { ar: 'حبة', en: 'piece' } }
        ],
        paymentMethod: 'link',
        deliveryPrice: 2.000
      }
    ],
    dailyOrders: [
      { date: '2025-10-22', count: 8, revenue: 65.750 },
      { date: '2025-10-23', count: 12, revenue: 89.500 },
      { date: '2025-10-24', count: 15, revenue: 112.250 },
      { date: '2025-10-25', count: 10, revenue: 78.000 },
      { date: '2025-10-26', count: 18, revenue: 145.500 },
      { date: '2025-10-27', count: 22, revenue: 167.750 },
      { date: '2025-10-28', count: 12, revenue: 89.500 }
    ]
  });

  const texts = {
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