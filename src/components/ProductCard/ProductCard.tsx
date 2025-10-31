import React, { useState } from 'react';
import { Product, Language, ProductUnit } from '../../types';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  language: Language;
  onAddToCart: (product: Product, selectedUnit: ProductUnit, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  language,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState<ProductUnit>(
    product.units.find(unit => unit.isDefault) || product.units[0]
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  // استرجاع الصورة من localStorage إذا كانت محفوظة كـ ID
  const getImageUrl = (imageId: string) => {
    if (imageId.startsWith('product_') && imageId.includes('_image_')) {
      const savedImage = localStorage.getItem(imageId);
      return savedImage || imageId;
    }
    return imageId;
  };

  const currentImages = product.images.map(img => getImageUrl(img));

  const texts = {
    ar: {
      addToCart: 'أضف للسلة',
      quantity: 'الكمية',
      price: 'د.ك',
      outOfStock: 'غير متوفر',
      added: 'تم الإضافة!',
      unit: 'الوحدة',
      selectUnit: 'اختر الوحدة',
      viewFullPage: 'عرض صفحة كاملة'
    },
    en: {
      addToCart: 'Add to Cart',
      quantity: 'Quantity',
      price: 'KWD',
      outOfStock: 'Out of Stock',
      added: 'Added!',
      unit: 'Unit',
      selectUnit: 'Select Unit',
      viewFullPage: 'View Full Page'
    }
  };

  const currentTexts = texts[language];

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    
    setIsAdding(true);
    onAddToCart(product, selectedUnit, quantity);
    
    // Reset animation after 1 second
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
    }, 1000);
  };

  const categoryEmojis = {
    fruits: '🍎',
    vegetables: '🥕',
    leafy: '🥬',
    baskets: '🧺'
  };

  return (
    <div className={`product-card ${product.stock === 0 ? 'out-of-stock' : ''}`}>
      {/* Product Images Carousel */}
      <div className="product-image-container">
        <img
          src={currentImages[selectedImageIndex]}
          alt={product.name[language]}
          className="product-image"
          loading="lazy"
        />
        
        {/* Image navigation dots */}
        {currentImages.length > 1 && (
          <div className="image-dots">
            {currentImages.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === selectedImageIndex ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(index);
                }}
              />
            ))}
          </div>
        )}
        
        <div className="category-badge">
          {categoryEmojis[product.category]}
        </div>
        {product.stock === 0 && (
          <div className="out-of-stock-overlay">
            <span>{currentTexts.outOfStock}</span>
          </div>
        )}
        
        {/* View Full Page overlay */}
        <div className="view-fullpage-overlay">
          <span>{currentTexts.viewFullPage}</span>
        </div>
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h3 className="product-name">{product.name[language]}</h3>
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="product-tags">
            {product.tags.map((tag, idx) => (
              <span key={idx} className="tag-badge">{tag}</span>
            ))}
          </div>
        )}
        
        {/* Unit Selection */}
        <div className="unit-selection">
          <label className="unit-label">{currentTexts.selectUnit}:</label>
          <select 
            className="unit-select"
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
        
        <div className="product-details">
          <div className="price-container">
            <span className="price">
              {selectedUnit.price.toFixed(3)} {currentTexts.price}
            </span>
            <span className="unit">/ {selectedUnit.unit[language]}</span>
          </div>
          
          {product.stock > 0 && product.stock <= 5 && (
            <div className="low-stock-warning">
              ⚠️ {product.stock} متبقي
            </div>
          )}
        </div>

        {/* Quantity & Add to Cart */}
        {product.stock > 0 && (
          <div className="product-actions">
            <div className="quantity-selector">
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
              className={`add-to-cart-btn ${isAdding ? 'adding' : ''}`}
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? currentTexts.added : currentTexts.addToCart}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;