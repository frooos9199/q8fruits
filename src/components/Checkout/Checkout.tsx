import React, { useState, useEffect } from 'react';
import { CartItem, Language } from '../../types';
import { InvoiceService, InvoiceData } from '../../services/InvoiceService.ts';
import './Checkout.css';

interface CheckoutProps {
  items: CartItem[];
  language: Language;
  deliveryPrice: number;
  paymentMethod: 'link' | 'cash';
  onClose: () => void;
  onOrderComplete: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({
  items,
  language,
  deliveryPrice,
  paymentMethod,
  onClose,
  onOrderComplete,
}) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    area: '',
    notes: '',
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [sendOptions, setSendOptions] = useState({
    sendEmail: false,
    sendWhatsApp: false,
  });
  
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [showAddressSelection, setShowAddressSelection] = useState(false);

  // Load saved user data on component mount
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    
    if (isLoggedIn && userEmail) {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const currentUser = registeredUsers.find((user: any) => user.email === userEmail);
      
      if (currentUser) {
        setCustomerInfo({
          name: currentUser.name || '',
          phone: currentUser.phone || '',
          email: currentUser.email || '',
          address: currentUser.address || '',
          area: currentUser.area || '',
          notes: '',
        });
        
        // Load saved addresses
        setSavedAddresses(currentUser.addresses || []);
      }
    }
  }, []);

  const texts = {
    ar: {
      title: 'إتمام الطلب',
      customerInfo: 'بيانات العميل',
      name: 'الاسم الكامل',
      phone: 'رقم الهاتف',
      email: 'البريد الإلكتروني (اختياري)',
      address: 'العنوان',
      area: 'المحافظة',
      notes: 'ملاحظات إضافية (اختياري)',
      orderSummary: 'ملخص الطلب',
      subtotal: 'المجموع الفرعي',
      delivery: 'التوصيل',
      total: 'المجموع الكلي',
      paymentMethod: 'طريقة الدفع',
      cash: 'دفع نقدي',
      link: 'دفع لينك',
      currency: 'د.ك',
      placeOrder: 'تأكيد الطلب',
      processing: 'جاري المعالجة...',
      orderSuccess: 'تم تأكيد طلبكم بنجاح!',
      orderNumber: 'رقم الطلب',
      downloadInvoice: 'تحميل الفاتورة',
      sendEmail: 'إرسال الفاتورة للإيميل',
      sendWhatsApp: 'إرسال الفاتورة عبر واتساب',
      emailSent: 'تم إرسال الفاتورة للإيميل',
      whatsappSent: 'سيتم فتح واتساب لإرسال الفاتورة',
      newOrder: 'طلب جديد',
      close: 'إغلاق',
      required: 'مطلوب',
      areas: [
        'العاصمة',
        'حولي',
        'الأحمدي',
        'الجهراء',
        'مبارك الكبير',
        'الفروانية'
      ],
      savedAddresses: 'العناوين المحفوظة',
      selectAddress: 'اختر عنوان',
      useThisAddress: 'استخدم هذا العنوان',
      orEnterNew: 'أو أدخل عنوان جديد'
    },
    en: {
      title: 'Checkout',
      customerInfo: 'Customer Information',
      name: 'Full Name',
      phone: 'Phone Number',
      email: 'Email (Optional)',
      address: 'Address',
      area: 'Area',
      notes: 'Additional Notes (Optional)',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal',
      delivery: 'Delivery',
      total: 'Total',
      paymentMethod: 'Payment Method',
      cash: 'Cash Payment',
      link: 'Link Payment',
      currency: 'KWD',
      placeOrder: 'Place Order',
      processing: 'Processing...',
      orderSuccess: 'Your order has been confirmed successfully!',
      orderNumber: 'Order Number',
      downloadInvoice: 'Download Invoice',
      sendEmail: 'Send Invoice via Email',
      sendWhatsApp: 'Send Invoice via WhatsApp',
      emailSent: 'Invoice sent to email successfully',
      whatsappSent: 'WhatsApp will open to send invoice',
      newOrder: 'New Order',
      close: 'Close',
      required: 'Required',
      areas: [
        'Capital',
        'Hawalli',
        'Ahmadi',
        'Jahra',
        'Mubarak Al-Kabeer',
        'Farwaniya'
      ],
      savedAddresses: 'Saved Addresses',
      selectAddress: 'Select Address',
      useThisAddress: 'Use This Address',
      orEnterNew: 'Or Enter New Address'
    }
  };

  const currentTexts = texts[language];
  const subtotal = items.reduce((sum, item) => sum + (item.selectedUnit.price * item.quantity), 0);
  const total = subtotal + deliveryPrice;

  // Function to handle address selection from saved addresses
  const handleAddressSelect = (selectedAddress: any) => {
    setCustomerInfo({
      ...customerInfo,
      address: selectedAddress.address,
      area: selectedAddress.area
    });
    setShowAddressSelection(false);
  };

  // Function to update user data in localStorage
  const updateUserData = (updatedInfo: any) => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
      
      if (!isLoggedIn || !userEmail) {
        console.log('User not logged in, skipping user data update');
        return;
      }

      console.log('Updating user data for:', userEmail);
      
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userIndex = registeredUsers.findIndex((user: any) => user.email === userEmail);
      
      if (userIndex === -1) {
        console.warn('User not found in registeredUsers');
        return;
      }

      // Update user data (excluding notes which are order-specific)
      registeredUsers[userIndex] = {
        ...registeredUsers[userIndex],
        name: updatedInfo.name,
        phone: updatedInfo.phone,
        address: updatedInfo.address,
        area: updatedInfo.area,
        email: updatedInfo.email,
      };
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      console.log('User data updated successfully');
      
    } catch (error) {
      console.error('Error updating user data:', error);
      // Don't throw error, just log it since this is not critical for order completion
    }
  };

  // Function to save order to user's order history
  const saveOrderToHistory = (orderData: any) => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
      
      if (!isLoggedIn || !userEmail) {
        console.log('User not logged in, skipping order history save');
        return;
      }

      console.log('Saving order to history for user:', userEmail);
      
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
      
      orderHistory.unshift(newOrder); // Add to beginning of array (most recent first)
      localStorage.setItem(`orders_${userEmail}`, JSON.stringify(orderHistory));
      console.log('Order saved to history successfully');
      
      // Update user's order count in registeredUsers
      try {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userIndex = registeredUsers.findIndex((user: any) => user.email === userEmail);
        
        if (userIndex !== -1) {
          registeredUsers[userIndex].orderCount = orderHistory.length;
          registeredUsers[userIndex].totalSpent = orderHistory.reduce((sum: number, order: any) => sum + order.total, 0);
          localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
          console.log('Updated user statistics successfully');
        }
      } catch (statsError) {
        console.warn('Failed to update user statistics:', statsError);
        // Don't throw error, just log warning
      }
      
    } catch (error) {
      console.error('Error saving order to history:', error);
      throw error; // Re-throw so handleSubmit can handle it
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      console.log('Starting order processing...');
      
      // Validate required fields
      if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || !customerInfo.area) {
        throw new Error('Missing required customer information');
      }

      // Generate order number
      const newOrderNumber = `FK${Date.now()}`;
      setOrderNumber(newOrderNumber);
      console.log('Generated order number:', newOrderNumber);

      // Update user data in localStorage before processing order
      try {
        updateUserData(customerInfo);
        console.log('Updated user data successfully');
      } catch (userDataError) {
        console.warn('Failed to update user data:', userDataError);
        // Continue processing even if user data update fails
      }

      // Create order data for saving to history
      const orderData = {
        orderNumber: newOrderNumber,
        date: new Date().toLocaleDateString(language === 'ar' ? 'ar-KW' : 'en-US'),
        customerInfo: {
          name: customerInfo.name,
          phone: customerInfo.phone,
          address: customerInfo.address,
          area: customerInfo.area,
          notes: customerInfo.notes,
          email: customerInfo.email,
        },
        items,
        subtotal,
        deliveryPrice,
        total,
        paymentMethod,
      };

      // Save order to user's history
      try {
        saveOrderToHistory(orderData);
        console.log('Saved order to history successfully');
      } catch (historyError) {
        console.warn('Failed to save order history:', historyError);
        // Continue processing even if history save fails
      }

      // Try to send email if provided (optional, don't fail if this fails)
      if (customerInfo.email) {
        try {
          console.log('Attempting to send email...');
          const invoiceData: InvoiceData = {
            orderNumber: newOrderNumber,
            date: new Date().toLocaleDateString(language === 'ar' ? 'ar-KW' : 'en-US'),
            customerInfo: {
              name: customerInfo.name,
              phone: customerInfo.phone,
              address: customerInfo.address,
              area: customerInfo.area,
              notes: customerInfo.notes,
              email: customerInfo.email,
            },
            items,
            subtotal,
            deliveryPrice,
            total,
            paymentMethod,
            language,
          };

          const invoiceService = InvoiceService.getInstance();
          await invoiceService.sendInvoiceByEmail(invoiceData, customerInfo.email);
          console.log('Email sent successfully');
        } catch (emailError) {
          console.warn('Failed to send email (continuing anyway):', emailError);
          // Don't fail the order if email fails
        }
      }

      // Simulate order processing delay and complete
      console.log('Order processing completed, showing success...');
      setTimeout(() => {
        setIsProcessing(false);
        setOrderComplete(true);
        console.log('Order marked as complete');
      }, 1500);

    } catch (error) {
      console.error('Error processing order:', error);
      setIsProcessing(false);
      
      // Show user-friendly error message
      const errorMessage = language === 'ar' 
        ? 'حدث خطأ في معالجة الطلب. يرجى التأكد من ملء جميع البيانات المطلوبة والمحاولة مرة أخرى.'
        : 'An error occurred while processing your order. Please check all required fields and try again.';
      
      alert(errorMessage);
    }
  };

  const handleDownloadInvoice = async () => {
    const invoiceData: InvoiceData = {
      orderNumber,
      date: new Date().toLocaleDateString(language === 'ar' ? 'ar-KW' : 'en-US'),
      customerInfo: {
        name: customerInfo.name,
        phone: customerInfo.phone,
        address: customerInfo.address,
        area: customerInfo.area,
        notes: customerInfo.notes,
        email: customerInfo.email,
      },
      items,
      subtotal,
      deliveryPrice,
      total,
      paymentMethod,
      language,
    };

    const invoiceService = InvoiceService.getInstance();
    await invoiceService.downloadInvoice(invoiceData);
  };

  const handleSendEmail = async () => {
    if (!customerInfo.email) {
      alert(language === 'ar' ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter email address');
      return;
    }

    try {
      const invoiceData: InvoiceData = {
        orderNumber,
        date: new Date().toLocaleDateString(language === 'ar' ? 'ar-KW' : 'en-US'),
        customerInfo: {
          name: customerInfo.name,
          phone: customerInfo.phone,
          address: customerInfo.address,
          area: customerInfo.area,
          notes: customerInfo.notes,
          email: customerInfo.email,
        },
        items,
        subtotal,
        deliveryPrice,
        total,
        paymentMethod,
        language,
      };

      const invoiceService = InvoiceService.getInstance();
      await invoiceService.sendInvoiceByEmail(invoiceData, customerInfo.email);
      alert(currentTexts.emailSent);
    } catch (error) {
      console.error('Error sending email:', error);
      alert(language === 'ar' ? 'حدث خطأ في إرسال الإيميل' : 'Error sending email');
    }
  };

  const handleSendWhatsApp = async () => {
    if (!customerInfo.phone) {
      alert(language === 'ar' ? 'يرجى إدخال رقم الهاتف' : 'Please enter phone number');
      return;
    }

    try {
      const invoiceData: InvoiceData = {
        orderNumber,
        date: new Date().toLocaleDateString(language === 'ar' ? 'ar-KW' : 'en-US'),
        customerInfo: {
          name: customerInfo.name,
          phone: customerInfo.phone,
          address: customerInfo.address,
          area: customerInfo.area,
          notes: customerInfo.notes,
          email: customerInfo.email,
        },
        items,
        subtotal,
        deliveryPrice,
        total,
        paymentMethod,
        language,
      };

      const invoiceService = InvoiceService.getInstance();
      await invoiceService.sendInvoiceViaWhatsApp(invoiceData, customerInfo.phone);
      alert(currentTexts.whatsappSent);
    } catch (error) {
      console.error('Error sending WhatsApp:', error);
      alert(language === 'ar' ? 'حدث خطأ في إرسال الواتساب' : 'Error sending WhatsApp');
    }
  };

  const handleNewOrder = () => {
    onOrderComplete();
    onClose();
  };

  if (orderComplete) {
    return (
      <div className="checkout-overlay" onClick={onClose}>
        <div className="checkout-container success" onClick={(e) => e.stopPropagation()}>
          <div className="success-content">
            <div className="success-icon">✅</div>
            <h2>{currentTexts.orderSuccess}</h2>
            <p>
              <strong>{currentTexts.orderNumber}:</strong> {orderNumber}
            </p>
            
            <div className="success-actions">
              <button className="download-btn" onClick={handleDownloadInvoice}>
                📄 {currentTexts.downloadInvoice}
              </button>
              
              {customerInfo.email && (
                <button className="email-btn" onClick={handleSendEmail}>
                  📧 {currentTexts.sendEmail}
                </button>
              )}
              
              {customerInfo.phone && (
                <button className="whatsapp-btn" onClick={handleSendWhatsApp}>
                  📱 {currentTexts.sendWhatsApp}
                </button>
              )}
              
              <button className="new-order-btn" onClick={handleNewOrder}>
                🛒 {currentTexts.newOrder}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-container" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-header">
          <h2>{currentTexts.title}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="checkout-content">
          <form onSubmit={handleSubmit} className="checkout-form">
            {/* Customer Information */}
            <div className="form-section">
              <h3>{currentTexts.customerInfo}</h3>
              
              <div className="form-group">
                <label>{currentTexts.name} *</label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>{currentTexts.phone} *</label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>{currentTexts.email}</label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                />
              </div>

              {/* Saved Addresses Section */}
              {savedAddresses.length > 0 && (
                <div className="form-group">
                  <label>{currentTexts.savedAddresses}</label>
                  <div className="saved-addresses">
                    <button
                      type="button"
                      className="select-address-btn"
                      onClick={() => setShowAddressSelection(!showAddressSelection)}
                    >
                      {currentTexts.selectAddress} ({savedAddresses.length})
                    </button>
                    
                    {showAddressSelection && (
                      <div className="address-options">
                        {savedAddresses.map((address) => (
                          <div key={address.id} className="address-option">
                            <div className="address-details">
                              <h4>{address.label}</h4>
                              <p>{address.area}</p>
                              <p>{address.address}</p>
                            </div>
                            <button
                              type="button"
                              className="use-address-btn"
                              onClick={() => handleAddressSelect(address)}
                            >
                              {currentTexts.useThisAddress}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {showAddressSelection && <p className="or-text">{currentTexts.orEnterNew}</p>}
                </div>
              )}

              <div className="form-group">
                <label>{currentTexts.area} *</label>
                <select
                  value={customerInfo.area}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, area: e.target.value })}
                  required
                >
                  <option value="">اختر المحافظة</option>
                  {currentTexts.areas.map((area, index) => (
                    <option key={index} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>{currentTexts.address} *</label>
                <textarea
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label>{currentTexts.notes}</label>
                <textarea
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                  rows={3}
                  placeholder={language === 'ar' ? 'أي ملاحظات خاصة بالطلب...' : 'Any special notes for your order...'}
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="form-section">
              <h3>{currentTexts.orderSummary}</h3>
              
              <div className="order-items">
                {items.map((item) => (
                  <div key={item.product.id} className="order-item">
                    <span className="item-description">
                      {item.product.name[language]} × {item.quantity} {item.selectedUnit.unit[language]}
                    </span>
                    <span className="item-total">
                      {(item.selectedUnit.price * item.quantity).toFixed(3)} {currentTexts.currency}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-totals">
                <div className="total-line">
                  <span>{currentTexts.subtotal}:</span>
                  <span>{subtotal.toFixed(3)} {currentTexts.currency}</span>
                </div>
                <div className="total-line">
                  <span>{currentTexts.delivery}:</span>
                  <span>{deliveryPrice.toFixed(3)} {currentTexts.currency}</span>
                </div>
                <div className="total-line final">
                  <span>{currentTexts.total}:</span>
                  <span>{total.toFixed(3)} {currentTexts.currency}</span>
                </div>
              </div>

              <div className="payment-info">
                <p>
                  <strong>{currentTexts.paymentMethod}:</strong>{' '}
                  {paymentMethod === 'cash' ? currentTexts.cash : currentTexts.link}
                </p>
              </div>
            </div>

            <button 
              type="submit" 
              className="place-order-btn"
              disabled={isProcessing}
            >
              {isProcessing ? currentTexts.processing : currentTexts.placeOrder}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;