import React, { useState } from 'react';
import { Product, Language, ProductUnit } from '../../types';
import './ProductModal.css';

interface ProductModalProps {
  product: Product;
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, selectedUnit: ProductUnit, quantity: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  language,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState<ProductUnit>(
    product.units.find(unit => unit.isDefault) || product.units[0]
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const texts = {
    ar: {
      addToCart: 'أضف للسلة',
      quantity: 'الكمية',
      price: 'د.ك',
      outOfStock: 'غير متوفر',
      added: 'تم الإضافة!',
      unit: 'الوحدة',
      selectUnit: 'اختر الوحدة',
      close: 'إغلاق',
      productDetails: 'تفاصيل المنتج',
      category: 'الفئة',
      tags: 'الوسوم',
      availability: 'التوفر',
      inStock: 'متوفر',
      stock: 'الكمية المتوفرة',
      description: 'الوصف'
    },
    en: {
      addToCart: 'Add to Cart',
      quantity: 'Quantity',
      price: 'KWD',
      outOfStock: 'Out of Stock',
      added: 'Added!',
      unit: 'Unit',
      selectUnit: 'Select Unit',
      close: 'Close',
      productDetails: 'Product Details',
      category: 'Category',
      tags: 'Tags',
      availability: 'Availability',
      inStock: 'In Stock',
      stock: 'Stock Quantity',
      description: 'Description'
    }
  };

  const currentTexts = texts[language];

  const categoryNames = {
    ar: {
      fruits: 'فواكه',
      vegetables: 'خضار',
      leafy: 'خضار ورقية',
      baskets: 'سلال مختلطة'
    },
    en: {
      fruits: 'Fruits',
      vegetables: 'Vegetables',
      leafy: 'Leafy Vegetables',
      baskets: 'Mixed Baskets'
    }
  };

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    
    setIsAdding(true);
    onAddToCart(product, selectedUnit, quantity);
    
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
    }, 1000);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="product-modal-overlay" onClick={handleBackdropClick}>
      <div className="product-modal">
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="modal-content">
          {/* Left side - Images */}
          <div className="modal-images">
            <div className="main-image">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name[language]}
                className="modal-main-image"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img src={image} alt={`${product.name[language]} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right side - Details */}
          <div className="modal-details">
            <div className="modal-header">
              <h2 className="modal-title">{product.name[language]}</h2>
              <div className="product-category">
                {categoryNames[language][product.category]}
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="modal-tags">
                <span className="tags-label">{currentTexts.tags}:</span>
                <div className="tags-container">
                  {product.tags.map((tag, idx) => (
                    <span key={idx} className="modal-tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="stock-info">
              <span className="availability-label">{currentTexts.availability}:</span>
              <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? currentTexts.inStock : currentTexts.outOfStock}
              </span>
              {product.stock > 0 && (
                <span className="stock-count">
                  ({product.stock} {currentTexts.stock})
                </span>
              )}
            </div>

            {/* Unit Selection */}
            <div className="modal-unit-selection">
              <label className="modal-unit-label">{currentTexts.selectUnit}:</label>
              <select 
                className="modal-unit-select"
                value={selectedUnit.id}
                onChange={(e) => {
                  const unit = product.units.find(u => u.id === parseInt(e.target.value));
                  if (unit) setSelectedUnit(unit);
                }}
              >
                {product.units.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.unit[language]} - {unit.price.toFixed(3)} {currentTexts.price}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="modal-price">
              <span className="price-amount">
                {selectedUnit.price.toFixed(3)} {currentTexts.price}
              </span>
              <span className="price-unit">/ {selectedUnit.unit[language]}</span>
            </div>

            {/* Actions */}
            {product.stock > 0 && (
              <div className="modal-actions">
                <div className="modal-quantity">
                  <label className="quantity-label">{currentTexts.quantity}:</label>
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-value">{quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className={`modal-add-to-cart ${isAdding ? 'adding' : ''}`}
                  onClick={handleAddToCart}
                  disabled={isAdding}
                >
                  {isAdding ? currentTexts.added : currentTexts.addToCart}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;