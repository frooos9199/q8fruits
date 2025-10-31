import React, { useState } from 'react';
import { Product, Language, ProductCategory } from '../../types';
import './AddProductPage.css';

interface AddProductPageProps {
  language: Language;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onBack: () => void;
}

const AddProductPage: React.FC<AddProductPageProps> = ({
  language,
  onAddProduct,
  onBack,
}) => {
  const [newProductName, setNewProductName] = useState({ ar: '', en: '' });
  const [newProductCategory, setNewProductCategory] = useState<ProductCategory>('fruits');
  const [newProductUnits, setNewProductUnits] = useState([
    { id: 1, unit: { ar: 'كيلو', en: 'kg' }, price: 0, isDefault: true }
  ]);
  const [newProductImages, setNewProductImages] = useState<File[]>([]);
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
  const [newProductTags, setNewProductTags] = useState<string[]>([]);
  const [newProductStock, setNewProductStock] = useState(0);
  const [tagInput, setTagInput] = useState('');

  const texts = {
    ar: {
      addProduct: 'إضافة منتج جديد',
      back: 'رجوع',
      productName: 'اسم المنتج',
      arabicName: 'الاسم بالعربية',
      englishName: 'الاسم بالإنجليزية',
      category: 'الفئة',
      fruits: 'فواكه',
      vegetables: 'خضار',
      leafy: 'خضار ورقية',
      baskets: 'سلال مختلطة',
      units: 'الوحدات والأسعار',
      unitName: 'اسم الوحدة',
      arabicUnit: 'الوحدة بالعربية',
      englishUnit: 'الوحدة بالإنجليزية',
      price: 'السعر (د.ك)',
      isDefault: 'وحدة افتراضية',
      addUnit: 'إضافة وحدة',
      removeUnit: 'حذف الوحدة',
      images: 'صور المنتج',
      imageUrl: 'اختيار صورة',
      addImage: 'إضافة صورة من الجهاز',
      removeImage: 'حذف الصورة',
      tags: 'الوسوم',
      addTag: 'إضافة وسم',
      stock: 'الكمية المتوفرة',
      save: 'حفظ المنتج',
      cancel: 'إلغاء',
      fillAllFields: 'يرجى ملء جميع الحقول المطلوبة',
      selectDefaultUnit: 'يرجى تحديد وحدة افتراضية واحدة على الأقل',
      addImageUrl: 'يرجى إضافة صورة واحدة على الأقل'
    },
    en: {
      addProduct: 'Add New Product',
      back: 'Back',
      productName: 'Product Name',
      arabicName: 'Arabic Name',
      englishName: 'English Name',
      category: 'Category',
      fruits: 'Fruits',
      vegetables: 'Vegetables',
      leafy: 'Leafy Vegetables',
      baskets: 'Mixed Baskets',
      units: 'Units & Prices',
      unitName: 'Unit Name',
      arabicUnit: 'Arabic Unit',
      englishUnit: 'English Unit',
      price: 'Price (KWD)',
      isDefault: 'Default Unit',
      addUnit: 'Add Unit',
      removeUnit: 'Remove Unit',
      images: 'Product Images',
      imageUrl: 'Choose Image',
      addImage: 'Add Image from Device',
      removeImage: 'Remove Image',
      tags: 'Tags',
      addTag: 'Add Tag',
      stock: 'Stock Quantity',
      save: 'Save Product',
      cancel: 'Cancel',
      fillAllFields: 'Please fill all required fields',
      selectDefaultUnit: 'Please select at least one default unit',
      addImageUrl: 'Please add at least one image'
    }
  };

  const currentTexts = texts[language];

  const addUnit = () => {
    const newId = Math.max(...newProductUnits.map(u => u.id)) + 1;
    setNewProductUnits([
      ...newProductUnits,
      { id: newId, unit: { ar: '', en: '' }, price: 0, isDefault: false }
    ]);
  };

  const removeUnit = (index: number) => {
    if (newProductUnits.length > 1) {
      setNewProductUnits(newProductUnits.filter((_, i) => i !== index));
    }
  };

  const updateUnit = (index: number, field: string, value: any) => {
    const updatedUnits = [...newProductUnits];
    if (field === 'unit.ar' || field === 'unit.en') {
      const lang = field.split('.')[1] as 'ar' | 'en';
      updatedUnits[index].unit[lang] = value;
    } else if (field === 'isDefault') {
      updatedUnits.forEach((unit, i) => {
        unit.isDefault = i === index ? value : false;
      });
    } else {
      (updatedUnits[index] as any)[field] = value;
    }
    setNewProductUnits(updatedUnits);
  };

  const addImage = () => {
    // إنشاء input مخفي لاختيار الملف
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setNewProductImages([...newProductImages, file]);
        // إنشاء preview للصورة وحفظها في localStorage
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target?.result as string;
          setImagesPreviews([...imagesPreviews, imageData]);
          
          // حفظ الصورة في localStorage مع معرف فريد
          const imageId = `product_image_${Date.now()}_${Math.random()}`;
          localStorage.setItem(imageId, imageData);
          console.log('Image saved to localStorage with ID:', imageId);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const removeImage = (index: number) => {
    if (newProductImages.length > 1) {
      const updatedImages = newProductImages.filter((_, i) => i !== index);
      const updatedPreviews = imagesPreviews.filter((_, i) => i !== index);
      setNewProductImages(updatedImages);
      setImagesPreviews(updatedPreviews);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !newProductTags.includes(tagInput.trim())) {
      setNewProductTags([...newProductTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setNewProductTags(newProductTags.filter((_, i) => i !== index));
  };

  const handleAddProduct = async () => {
    // Validation
    if (!newProductName.ar.trim() || !newProductName.en.trim()) {
      alert(currentTexts.fillAllFields);
      return;
    }

    const hasDefaultUnit = newProductUnits.some(unit => unit.isDefault);
    if (!hasDefaultUnit) {
      alert(currentTexts.selectDefaultUnit);
      return;
    }

    if (newProductImages.length === 0) {
      alert(currentTexts.addImageUrl);
      return;
    }

    // حفظ الصور بمعرفات دائمة
    const permanentImageUrls = imagesPreviews.map((imageData, index) => {
      const productId = Date.now(); // معرف مؤقت للمنتج
      const imageId = `product_${productId}_image_${index}`;
      localStorage.setItem(imageId, imageData);
      return imageId; // نرجع المعرف بدلاً من البيانات
    });

    const productToAdd = {
      name: newProductName,
      category: newProductCategory,
      units: newProductUnits.filter(unit => unit.unit.ar.trim() && unit.unit.en.trim()),
      image: permanentImageUrls[0] || '',
      images: permanentImageUrls,
      tags: newProductTags,
      description: { ar: '', en: '' },
      isPublished: true,
      stock: newProductStock,
      minStock: 5,
      barcode: '',
      supplier: '',
      origin: { ar: '', en: '' },
      nutritionFacts: {
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        fiber: '',
        vitamins: ''
      },
      storageInstructions: { ar: '', en: '' },
      isOrganic: false,
      isFresh: true,
      shelfLife: '',
      discount: {
        enabled: false,
        percentage: 0,
        startDate: '',
        endDate: ''
      }
    };

    console.log('Product to add:', productToAdd);
    onAddProduct(productToAdd);
    onBack();
  };

  return (
    <div className="add-product-page">
      {/* Header */}
      <div className="add-product-header">
        <button className="back-btn" onClick={onBack}>
          {language === 'ar' ? '← ' + currentTexts.back : '← ' + currentTexts.back}
        </button>
        <h1 className="page-title">{currentTexts.addProduct}</h1>
      </div>

      <div className="add-product-content">
        <div className="form-section">
          {/* Product Name */}
          <div className="form-group">
            <h3 className="section-title">{currentTexts.productName}</h3>
            <div className="name-inputs">
              <div className="input-group">
                <label>{currentTexts.arabicName}</label>
                <input
                  type="text"
                  value={newProductName.ar}
                  onChange={(e) => setNewProductName({...newProductName, ar: e.target.value})}
                  placeholder="اسم المنتج بالعربية"
                  className="form-input"
                />
              </div>
              <div className="input-group">
                <label>{currentTexts.englishName}</label>
                <input
                  type="text"
                  value={newProductName.en}
                  onChange={(e) => setNewProductName({...newProductName, en: e.target.value})}
                  placeholder="Product name in English"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="form-group">
            <h3 className="section-title">{currentTexts.category}</h3>
            <select
              value={newProductCategory}
              onChange={(e) => setNewProductCategory(e.target.value as ProductCategory)}
              className="form-select"
            >
              <option value="fruits">{currentTexts.fruits}</option>
              <option value="vegetables">{currentTexts.vegetables}</option>
              <option value="leafy">{currentTexts.leafy}</option>
              <option value="baskets">{currentTexts.baskets}</option>
            </select>
          </div>

          {/* Units */}
          <div className="form-group">
            <h3 className="section-title">{currentTexts.units}</h3>
            <div className="units-container">
              {newProductUnits.map((unit, index) => (
                <div key={unit.id} className="unit-item">
                  <div className="unit-inputs">
                    <div className="input-group">
                      <label>{currentTexts.arabicUnit}</label>
                      <input
                        type="text"
                        value={unit.unit.ar}
                        onChange={(e) => updateUnit(index, 'unit.ar', e.target.value)}
                        placeholder="كيلو، حبة، علبة..."
                        className="form-input"
                      />
                    </div>
                    <div className="input-group">
                      <label>{currentTexts.englishUnit}</label>
                      <input
                        type="text"
                        value={unit.unit.en}
                        onChange={(e) => updateUnit(index, 'unit.en', e.target.value)}
                        placeholder="kg, piece, box..."
                        className="form-input"
                      />
                    </div>
                    <div className="input-group">
                      <label>{currentTexts.price}</label>
                      <input
                        type="number"
                        step="0.001"
                        value={unit.price}
                        onChange={(e) => updateUnit(index, 'price', parseFloat(e.target.value) || 0)}
                        className="form-input"
                      />
                    </div>
                    <div className="input-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={unit.isDefault}
                          onChange={(e) => updateUnit(index, 'isDefault', e.target.checked)}
                        />
                        {currentTexts.isDefault}
                      </label>
                    </div>
                  </div>
                  {newProductUnits.length > 1 && (
                    <button 
                      className="remove-btn"
                      onClick={() => removeUnit(index)}
                    >
                      {currentTexts.removeUnit}
                    </button>
                  )}
                </div>
              ))}
              <button className="add-btn" onClick={addUnit}>
                {currentTexts.addUnit}
              </button>
            </div>
          </div>

          {/* Images */}
          <div className="form-group">
            <h3 className="section-title">{currentTexts.images}</h3>
            <div className="images-container">
              {imagesPreviews.length > 0 ? (
                imagesPreviews.map((preview, index) => (
                  <div key={index} className="image-item">
                    <div className="image-preview">
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`}
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <span className="image-name">{newProductImages[index]?.name || `صورة ${index + 1}`}</span>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => removeImage(index)}
                    >
                      {currentTexts.removeImage}
                    </button>
                  </div>
                ))
              ) : (
                <div className="no-images">
                  <p>لم يتم اختيار أي صور بعد</p>
                </div>
              )}
              <button className="add-btn" onClick={addImage}>
                📷 {currentTexts.addImage}
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <h3 className="section-title">{currentTexts.tags}</h3>
            <div className="tags-input">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="أدخل وسم واضغط Enter"
                className="form-input"
              />
              <button className="add-btn" onClick={addTag}>
                {currentTexts.addTag}
              </button>
            </div>
            <div className="tags-display">
              {newProductTags.map((tag, index) => (
                <span key={index} className="tag-item">
                  {tag}
                  <button onClick={() => removeTag(index)}>×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Stock */}
          <div className="form-group">
            <h3 className="section-title">{currentTexts.stock}</h3>
            <input
              type="number"
              value={newProductStock}
              onChange={(e) => setNewProductStock(parseInt(e.target.value) || 0)}
              className="form-input"
              min="0"
            />
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button className="save-btn" onClick={handleAddProduct}>
              {currentTexts.save}
            </button>
            <button className="cancel-btn" onClick={onBack}>
              {currentTexts.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;