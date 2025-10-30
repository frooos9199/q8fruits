import React, { useState } from 'react';
import { CartItem, Language } from '../../types';
import './Cart.css';

interface CartProps {
  items: CartItem[];
  language: Language;
  deliveryPrice: number;
  onUpdateItem: (productId: number, unitId: number, quantity: number) => void;
  onClearCart: () => void;
  onClose: () => void;
  onCheckout: (paymentMethod: 'link' | 'cash') => void;
}

const Cart: React.FC<CartProps> = ({
  items,
  language,
  deliveryPrice,
  onUpdateItem,
  onClearCart,
  onClose,
  onCheckout,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'link' | 'cash'>('cash');

  const texts = {
    ar: {
      cart: 'السلة',
      empty: 'السلة فارغة',
      subtotal: 'المجموع الفرعي',
      delivery: 'التوصيل',
      total: 'المجموع الكلي',
      clear: 'إفراغ السلة',
      checkout: 'إتمام الطلب',
      paymentMethod: 'طريقة الدفع',
      cash: 'دفع نقدي',
      link: 'دفع لينك',
      close: 'إغلاق',
      currency: 'د.ك',
      quantity: 'الكمية',
      price: 'السعر',
      continueShopping: 'متابعة التسوق'
    },
    en: {
      cart: 'Cart',
      empty: 'Cart is empty',
      subtotal: 'Subtotal',
      delivery: 'Delivery',
      total: 'Total',
      clear: 'Clear Cart',
      checkout: 'Checkout',
      paymentMethod: 'Payment Method',
      cash: 'Cash Payment',
      link: 'Link Payment',
      close: 'Close',
      currency: 'KWD',
      quantity: 'Quantity',
      price: 'Price',
      continueShopping: 'Continue Shopping'
    }
  };

  const currentTexts = texts[language];

  const subtotal = items.reduce((sum, item) => sum + (item.selectedUnit.price * item.quantity), 0);
  const total = subtotal + deliveryPrice;

  const handleQuantityChange = (productId: number, unitId: number, newQuantity: number) => {
    onUpdateItem(productId, unitId, newQuantity);
  };

  const handleRemoveItem = (productId: number, unitId: number) => {
    onUpdateItem(productId, unitId, 0);
  };

  if (items.length === 0) {
    return (
      <div className="cart-overlay" onClick={onClose}>
        <div className="cart-container empty" onClick={(e) => e.stopPropagation()}>
          <div className="cart-header">
            <h2>{currentTexts.cart}</h2>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
          <div className="empty-cart">
            <span className="empty-icon">🛒</span>
            <p>{currentTexts.empty}</p>
            <button className="continue-btn" onClick={onClose}>
              {currentTexts.continueShopping}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-container" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>{currentTexts.cart}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            {items.map((item, index) => (
              <div key={`${item.product.id}-${item.selectedUnit.id}-${index}`} className="cart-item">
                <div className="item-image">
                  <img src={item.product.images[0]} alt={item.product.name[language]} />
                </div>
                
                <div className="item-details">
                  <h4 className="item-name">{item.product.name[language]}</h4>
                  <p className="item-unit">{item.selectedUnit.unit[language]}</p>
                  <p className="item-price">
                    {item.selectedUnit.price.toFixed(3)} {currentTexts.currency}
                  </p>
                </div>

                <div className="item-controls">
                  <div className="quantity-controls">
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.product.id, item.selectedUnit.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.product.id, item.selectedUnit.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="item-total">
                    {(item.selectedUnit.price * item.quantity).toFixed(3)} {currentTexts.currency}
                  </div>
                  
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.product.id, item.selectedUnit.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <div className="summary-line">
              <span>{currentTexts.subtotal}:</span>
              <span>{subtotal.toFixed(3)} {currentTexts.currency}</span>
            </div>
            <div className="summary-line">
              <span>{currentTexts.delivery}:</span>
              <span>{deliveryPrice.toFixed(3)} {currentTexts.currency}</span>
            </div>
            <div className="summary-line total-line">
              <span>{currentTexts.total}:</span>
              <span>{total.toFixed(3)} {currentTexts.currency}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="payment-section">
            <h3>{currentTexts.paymentMethod}</h3>
            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'link')}
                />
                <span>💵 {currentTexts.cash}</span>
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="link"
                  checked={paymentMethod === 'link'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'link')}
                />
                <span>💳 {currentTexts.link}</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="cart-actions">
            <button className="clear-btn" onClick={onClearCart}>
              {currentTexts.clear}
            </button>
            <button className="checkout-btn" onClick={() => onCheckout(paymentMethod)}>
              {currentTexts.checkout}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;