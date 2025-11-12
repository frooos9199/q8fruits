import React from 'react';
import { Language, ProductCategory } from '../../types';
import './CategoryFilter.css';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  language: Language;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  language,
}) => {
  const categories = [
    { key: 'all', ar: 'جميع المنتجات', en: 'All Products', emoji: '🛒' },
    { key: 'fruits', ar: 'فواكه', en: 'Fruits', emoji: '🍎' },
    { key: 'vegetables', ar: 'خضار', en: 'Vegetables', emoji: '🥕' },
    { key: 'leafy', ar: 'ورقيات', en: 'Leafy Greens', emoji: '🥬' },
  ];

  return (
    <div className="category-filter">
      <div className="category-buttons">
        {categories.map((category) => (
          <button
            key={category.key}
            className={`category-btn ${selectedCategory === category.key ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.key)}
          >
            <span className="category-emoji">{category.emoji}</span>
            <span className="category-text">
              {language === 'ar' ? category.ar : category.en}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
