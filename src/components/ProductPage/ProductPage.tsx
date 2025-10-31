import React, { useState } from 'react';
import { Product, Language, ProductUnit } from '../../types';
import './ProductPage.css';

interface ProductPageProps {
  product: Product;
  language: Language;
  onAddToCart: (product: Product, selectedUnit: ProductUnit, quantity: number) => void;
  onBack: () => void;
}

const ProductPage: React.FC<ProductPageProps> = ({
  product,
  language,
  onAddToCart,
  onBack,
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
      back: 'رجوع',
      productDetails: 'تفاصيل المنتج',
      category: 'الفئة',
      tags: 'الوسوم',
      availability: 'التوفر',
      inStock: 'متوفر',
      stock: 'الكمية المتوفرة',
      description: 'الوصف',
      gallery: 'معرض الصور'
    },
    en: {
      addToCart: 'Add to Cart',
      quantity: 'Quantity',
      price: 'KWD',
      outOfStock: 'Out of Stock',
      added: 'Added!',
      unit: 'Unit',
      selectUnit: 'Select Unit',
      back: 'Back',
      productDetails: 'Product Details',
      category: 'Category',
      tags: 'Tags',
      availability: 'Availability',
      inStock: 'In Stock',
      stock: 'Stock Quantity',
      description: 'Description',
      gallery: 'Image Gallery'
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

  const categoryEmojis = {
    fruits: '🍎',
    vegetables: '🥕',
    leafy: '🥬',
    baskets: '🧺'
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

  return (
    <div className="product-page">
      {/* Header */}
      <div className="product-page-header">
        <button className="back-btn" onClick={onBack}>
          {language === 'ar' ? '← ' + currentTexts.back : '← ' + currentTexts.back}
        </button>
        <h1 className="page-title">{currentTexts.productDetails}</h1>
      </div>

      <div className="product-page-content">
        {/* Left side - Images */}
        <div className="product-gallery">
          <div className="main-image-container">
            <img
              src={currentImages[selectedImageIndex]}
              alt={product.name[language]}
              className="main-product-image"
            />
            {product.stock === 0 && (
              <div className="out-of-stock-badge">
                {currentTexts.outOfStock}
              </div>
            )}
          </div>
          
          {currentImages.length > 1 && (
            <div className="image-gallery">
              <h3 className="gallery-title">{currentTexts.gallery}</h3>
              <div className="image-thumbnails">
                {currentImages.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail-btn ${index === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img src={image} alt={`${product.name[language]} ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right side - Details */}
        <div className="product-details">
          <div className="product-header">
            <h1 className="product-title">{product.name[language]}</h1>
            <div className="category-info">
              <span className="category-emoji">{categoryEmojis[product.category]}</span>
              <span className="category-name">{categoryNames[language][product.category]}</span>
            </div>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="product-tags-section">
              <h3 className="section-title">{currentTexts.tags}</h3>
              <div className="tags-grid">
                {product.tags.map((tag, idx) => (
                  <span key={idx} className="product-tag">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div className="stock-section">
            <h3 className="section-title">{currentTexts.availability}</h3>
            <div className="stock-info">
              <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? currentTexts.inStock : currentTexts.outOfStock}
              </span>
              {product.stock > 0 && (
                <span className="stock-count">
                  ({product.stock} {currentTexts.stock})
                </span>
              )}
            </div>
          </div>

          {/* Unit Selection */}
          <div className="unit-section">
            <h3 className="section-title">{currentTexts.selectUnit}</h3>
            <select 
              className="unit-selector"
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
          <div className="price-section">
            <div className="price-display">
              <span className="price-amount">
                {selectedUnit.price.toFixed(3)} {currentTexts.price}
              </span>
              <span className="price-unit">/ {selectedUnit.unit[language]}</span>
            </div>
          </div>

          {/* Actions */}
          {product.stock > 0 && (
            <div className="actions-section">
              <div className="quantity-section">
                <h3 className="section-title">{currentTexts.quantity}</h3>
                <div className="quantity-selector">
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="qty-display">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className={`add-to-cart-main ${isAdding ? 'adding' : ''}`}
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
  );
};

export default ProductPage;