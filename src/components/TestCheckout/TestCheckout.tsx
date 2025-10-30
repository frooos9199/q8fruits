import React, { useState } from 'react';
import './TestCheckout.css';

const TestCheckout: React.FC = () => {
  const [testResults, setTestResults] = useState<{[key: string]: string}>({});

  const showResult = (key: string, message: string, isError: boolean = false) => {
    setTestResults(prev => ({
      ...prev,
      [key]: `${isError ? '❌' : '✅'} ${message}`
    }));
  };

  const setupTestUser = () => {
    try {
      const testUser = {
        name: 'أحمد محمد',
        email: 'test@example.com',
        phone: '99887766',
        address: 'الفروانية، شارع الرئيسي',
        area: 'الفروانية',
        password: '123456',
        orderCount: 0,
        totalSpent: 0,
        joinDate: new Date().toISOString()
      };

      let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const existingIndex = registeredUsers.findIndex((user: any) => user.email === testUser.email);
      
      if (existingIndex !== -1) {
        registeredUsers[existingIndex] = testUser;
      } else {
        registeredUsers.push(testUser);
      }
      
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      showResult('user', 'تم إنشاء المستخدم التجريبي بنجاح');
    } catch (error: any) {
      showResult('user', `خطأ في إنشاء المستخدم: ${error.message}`, true);
    }
  };

  const loginTestUser = () => {
    try {
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userEmail', 'test@example.com');
      localStorage.setItem('userName', 'أحمد محمد');
      localStorage.setItem('userPhone', '99887766');
      localStorage.setItem('userAddress', 'الفروانية، شارع الرئيسي');
      showResult('user', 'تم تسجيل دخول المستخدم التجريبي');
    } catch (error: any) {
      showResult('user', `خطأ في تسجيل الدخول: ${error.message}`, true);
    }
  };

  const setupTestCart = () => {
    try {
      const testCart = [
        {
          product: {
            id: 1,
            name: 'تفاح أحمر',
            category: 'فواكه',
            image: '/images/apple.jpg'
          },
          selectedUnit: {
            unit: 'كيلو',
            price: 2.5
          },
          quantity: 3
        },
        {
          product: {
            id: 2,
            name: 'موز',
            category: 'فواكه',
            image: '/images/banana.jpg'
          },
          selectedUnit: {
            unit: 'كيلو',
            price: 1.8
          },
          quantity: 2
        }
      ];

      localStorage.setItem('cart', JSON.stringify(testCart));
      showResult('cart', `تم إضافة ${testCart.length} منتج للسلة`);
    } catch (error: any) {
      showResult('cart', `خطأ في إعداد السلة: ${error.message}`, true);
    }
  };

  const testOrderProcess = () => {
    try {
      const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      if (!isLoggedIn) {
        showResult('order', 'يجب تسجيل دخول المستخدم أولاً', true);
        return;
      }

      if (cart.length === 0) {
        showResult('order', 'السلة فارغة - يجب إضافة منتجات أولاً', true);
        return;
      }

      // Simulate order data
      const orderData = {
        orderNumber: 'ORD-' + Date.now(),
        date: new Date().toLocaleDateString('ar-SA'),
        items: cart,
        total: cart.reduce((sum: number, item: any) => sum + (item.selectedUnit.price * item.quantity), 0) + 2,
        deliveryPrice: 2,
        paymentMethod: 'نقدي عند التسليم',
        customerInfo: {
          name: localStorage.getItem('userName'),
          email: localStorage.getItem('userEmail'),
          phone: localStorage.getItem('userPhone'),
          address: localStorage.getItem('userAddress'),
          area: 'الفروانية',
          notes: 'طلب تجريبي'
        }
      };

      // Test saving order to history
      const userEmail = localStorage.getItem('userEmail');
      const orderHistory = JSON.parse(localStorage.getItem(`orders_${userEmail}`) || '[]');
      
      const newOrder = {
        id: Date.now().toString(),
        orderNumber: orderData.orderNumber,
        date: orderData.date,
        items: orderData.items.map((item: any) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.selectedUnit.price,
          unit: item.selectedUnit.unit
        })),
        total: orderData.total,
        status: 'pending' as const,
        paymentMethod: orderData.paymentMethod,
        deliveryPrice: orderData.deliveryPrice,
        customerInfo: orderData.customerInfo
      };
      
      orderHistory.unshift(newOrder);
      localStorage.setItem(`orders_${userEmail}`, JSON.stringify(orderHistory));

      // Update user statistics
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userIndex = registeredUsers.findIndex((user: any) => user.email === userEmail);
      
      if (userIndex !== -1) {
        registeredUsers[userIndex].orderCount = orderHistory.length;
        registeredUsers[userIndex].totalSpent = orderHistory.reduce((sum: number, order: any) => sum + order.total, 0);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      }

      // Clear cart
      localStorage.removeItem('cart');

      showResult('order', `تم إتمام الطلب بنجاح! رقم الطلب: ${orderData.orderNumber} - الإجمالي: ${orderData.total} د.ك`);
      
    } catch (error: any) {
      showResult('order', `خطأ في معالجة الطلب: ${error.message}`, true);
    }
  };

  const checkData = () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const orderHistory = userEmail ? JSON.parse(localStorage.getItem(`orders_${userEmail}`) || '[]') : [];
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
      
      showResult('data', 
        `المستخدم مسجل دخول: ${isLoggedIn ? 'نعم' : 'لا'} | ` +
        `السلة: ${cart.length} منتج | ` +
        `الطلبات: ${orderHistory.length} طلب`
      );
    } catch (error: any) {
      showResult('data', `خطأ في فحص البيانات: ${error.message}`, true);
    }
  };

  return (
    <div className="test-checkout">
      <div className="test-container">
        <h1>🧪 اختبار نظام الطلبات</h1>
        
        <div className="test-section">
          <h3>👤 إعداد المستخدم</h3>
          <button onClick={setupTestUser}>إنشاء مستخدم تجريبي</button>
          <button onClick={loginTestUser}>تسجيل دخول</button>
          {testResults.user && <div className="result">{testResults.user}</div>}
        </div>

        <div className="test-section">
          <h3>🛒 إعداد السلة</h3>
          <button onClick={setupTestCart}>إضافة منتجات للسلة</button>
          {testResults.cart && <div className="result">{testResults.cart}</div>}
        </div>

        <div className="test-section">
          <h3>📝 اختبار الطلب</h3>
          <button onClick={testOrderProcess}>إتمام الطلب</button>
          {testResults.order && <div className="result">{testResults.order}</div>}
        </div>

        <div className="test-section">
          <h3>📊 فحص البيانات</h3>
          <button onClick={checkData}>فحص البيانات المحفوظة</button>
          {testResults.data && <div className="result">{testResults.data}</div>}
        </div>

        <div className="navigation">
          <a href="/">العودة للصفحة الرئيسية</a>
        </div>
      </div>
    </div>
  );
};

export default TestCheckout;