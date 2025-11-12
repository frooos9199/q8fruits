import React, { useState } from 'react';
import { Product, Language, ProductUnit } from '../../types';
import ProductCard from '../ProductCard/ProductCard.tsx';
import CategoryFilter from '../CategoryFilter/CategoryFilter.tsx';
import './ProductGrid.css';

interface ProductGridProps {
  products: Product[];
  language: Language;
  onAddToCart: (product: Product, selectedUnit: ProductUnit, quantity: number) => void;
  searchTerm?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  language,
  onAddToCart,
  searchTerm = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const texts = {
    ar: {
      title: 'منتجاتنا الطازجة',
      noProducts: 'لا توجد منتجات متاحة',
      allCategories: 'جميع الفئات'
    },
    en: {
      title: 'Our Fresh Products',
      noProducts: 'No products available',
      allCategories: 'All Categories'
    }
  };

  const currentTexts = texts[language];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name[language].toLowerCase().includes(searchTerm.toLowerCase());
    const isPublished = product.isPublished;
    
    return matchesCategory && matchesSearch && isPublished;
  });

  return (
    <div className="product-grid-container">
      <div className="product-grid-header">
        <h2 className="section-title">{currentTexts.title}</h2>
        
      </div>

      {/* Category Filter */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        language={language}
      />

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <span className="no-products-icon">📦</span>
            <p>{currentTexts.noProducts}</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              language={language}
              onAddToCart={onAddToCart}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductGrid;