import React from 'react';
import { RecentOrder } from '../AdminDashboard/AdminDashboard.tsx';
import { Language } from '../../types';
import './OrderDetailsModal.css';

interface OrderDetailsModalProps {
  order: RecentOrder;
  language: Language;
  onClose: () => void;
  onDownloadInvoice: (order: RecentOrder) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  language,
  onClose,
  onDownloadInvoice,
}) => {
  // Calculate correct subtotal and total
  const calculateSubtotal = () => {
    return order.products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal + order.deliveryPrice;
  const texts = {
    ar: {
      orderDetails: 'تفاصيل الطلب',
      orderNumber: 'رقم الطلب',
      customer: 'العميل',
      phone: 'الهاتف',
      address: 'العنوان',
      area: 'المحافظة',
      email: 'البريد الإلكتروني',
      date: 'التاريخ',
      status: 'الحالة',
      paymentMethod: 'طريقة الدفع',
      products: 'المنتجات',
      product: 'المنتج',
      quantity: 'الكمية',
      price: 'السعر',
      total: 'المجموع',
      subtotal: 'المجموع الفرعي',
      delivery: 'التوصيل',
      finalTotal: 'المجموع النهائي',
      currency: 'د.ك',
      cash: 'دفع نقدي',
      link: 'دفع إلكتروني',
      pending: 'معلق',
      completed: 'مكتمل',
      cancelled: 'ملغي',
      close: 'إغلاق',
      downloadInvoice: 'تحميل الفاتورة',
      noEmail: 'غير محدد'
    },
    en: {
      orderDetails: 'Order Details',
      orderNumber: 'Order Number',
      customer: 'Customer',
      phone: 'Phone',
      address: 'Address',
      area: 'Area',
      email: 'Email',
      date: 'Date',
      status: 'Status',
      paymentMethod: 'Payment Method',
      products: 'Products',
      product: 'Product',
      quantity: 'Quantity',
      price: 'Price',
      total: 'Total',
      subtotal: 'Subtotal',
      delivery: 'Delivery',
      finalTotal: 'Final Total',
      currency: 'KWD',
      cash: 'Cash Payment',
      link: 'Electronic Payment',
      pending: 'Pending',
      completed: 'Completed',
      cancelled: 'Cancelled',
      close: 'Close',
      downloadInvoice: 'Download Invoice',
      noEmail: 'Not specified'
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

  return (
    <div className="order-modal-overlay" onClick={onClose}>
      <div className="order-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="order-modal-header">
          <h2>{currentTexts.orderDetails}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="order-modal-content">
          {/* Order Info */}
          <div className="order-info-section">
            <div className="info-grid">
              <div className="info-item">
                <label>{currentTexts.orderNumber}:</label>
                <span className="order-number">{order.id}</span>
              </div>
              <div className="info-item">
                <label>{currentTexts.date}:</label>
                <span>{order.date}</span>
              </div>
              <div className="info-item">
                <label>{currentTexts.status}:</label>
                <span className={`status-badge ${order.status}`}>
                  {getStatusIcon(order.status)} {getStatusText(order.status)}
                </span>
              </div>
              <div className="info-item">
                <label>{currentTexts.paymentMethod}:</label>
                <span>
                  {order.paymentMethod === 'cash' ? '💵 ' + currentTexts.cash : '💳 ' + currentTexts.link}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="customer-info-section">
            <h3>{currentTexts.customer}</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>{currentTexts.customer}:</label>
                <span>{order.customerName}</span>
              </div>
              <div className="info-item">
                <label>{currentTexts.phone}:</label>
                <span>{order.customerPhone}</span>
              </div>
              <div className="info-item">
                <label>{currentTexts.area}:</label>
                <span>{order.customerArea}</span>
              </div>
              <div className="info-item">
                <label>{currentTexts.email}:</label>
                <span>{order.customerEmail || currentTexts.noEmail}</span>
              </div>
              <div className="info-item full-width">
                <label>{currentTexts.address}:</label>
                <span>{order.customerAddress}</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="products-section">
            <h3>{currentTexts.products}</h3>
            <div className="products-table">
              <div className="table-header">
                <div className="col">{currentTexts.product}</div>
                <div className="col">{currentTexts.quantity}</div>
                <div className="col">{currentTexts.price}</div>
                <div className="col">{currentTexts.total}</div>
              </div>
              {order.products.map((product, index) => (
                <div key={index} className="table-row">
                  <div className="col product-name">
                    {product.name[language]}
                    <span className="unit">/ {product.unit[language]}</span>
                  </div>
                  <div className="col quantity">{product.quantity}</div>
                  <div className="col price">{product.price.toFixed(3)} {currentTexts.currency}</div>
                  <div className="col total">{(product.price * product.quantity).toFixed(3)} {currentTexts.currency}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="summary-line">
              <span>{currentTexts.subtotal}:</span>
              <span>{subtotal.toFixed(3)} {currentTexts.currency}</span>
            </div>
            <div className="summary-line">
              <span>{currentTexts.delivery}:</span>
              <span>{order.deliveryPrice.toFixed(3)} {currentTexts.currency}</span>
            </div>
            <div className="summary-line total-line">
              <span>{currentTexts.finalTotal}:</span>
              <span>{total.toFixed(3)} {currentTexts.currency}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="order-actions">
            <button className="close-modal-btn" onClick={onClose}>
              {currentTexts.close}
            </button>
            <button className="download-invoice-btn" onClick={() => onDownloadInvoice(order)}>
              📄 {currentTexts.downloadInvoice}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;