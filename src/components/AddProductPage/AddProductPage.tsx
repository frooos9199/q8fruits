import React, { useState } from 'react';
import './AddProductPage.css';

interface AddProductPageProps {
  language: 'ar' | 'en';
  onAddProduct: (product: any) => Promise<void>;
  onBack: () => void;
}

const AddProductPage: React.FC<AddProductPageProps> = ({
  language,
  onAddProduct,
  onBack
}) => {
  // حالة النموذج الكامل
  const [productName, setProductName] = useState({ ar: '', en: '' });
  const [productCategory, setProductCategory] = useState('fruits');
  const [productDescription, setProductDescription] = useState({ ar: '', en: '' });
  const [productImage, setProductImage] = useState('');
  const [productStock, setProductStock] = useState(0);
  const [productTags, setProductTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // وحدات وأسعار متعددة
  const [productUnits, setProductUnits] = useState([
    { id: 1, unit: { ar: 'كيلو', en: 'Kilo' }, price: 0, isDefault: true }
  ]);

  // النصوص متعددة اللغات
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
      leafy: 'ورقيات',
      baskets: 'سلال مختلطة',
      description: 'الوصف',
      arabicDesc: 'الوصف بالعربية',
      englishDesc: 'الوصف بالإنجليزية',
      image: 'صورة المنتج',
      imageUrl: 'رابط الصورة',
      stock: 'المخزون المتوفر',
      units: 'الوحدات والأسعار',
      unitName: 'اسم الوحدة',
      arabicUnit: 'الوحدة بالعربية',
      englishUnit: 'الوحدة بالإنجليزية',
      price: 'السعر (د.ك)',
      isDefault: 'افتراضي',
      addUnit: 'إضافة وحدة',
      removeUnit: 'حذف',
      tags: 'العلامات',
      addTag: 'إضافة علامة',
      tagPlaceholder: 'مثال: طازج، عضوي، موسمي',
      save: 'حفظ المنتج',
      cancel: 'إلغاء',
      fillRequired: 'يرجى ملء جميع الحقول المطلوبة',
      selectDefault: 'يرجى تحديد وحدة افتراضية',
      productSaved: 'تم حفظ المنتج بنجاح!',
      saveError: 'خطأ في حفظ المنتج'
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
      leafy: 'Leafy Greens',
      baskets: 'Mixed Baskets',
      description: 'Description',
      arabicDesc: 'Arabic Description',
      englishDesc: 'English Description',
      image: 'Product Image',
      imageUrl: 'Image URL',
      stock: 'Stock Available',
      units: 'Units and Prices',
      unitName: 'Unit Name',
      arabicUnit: 'Arabic Unit',
      englishUnit: 'English Unit',
      price: 'Price (KD)',
      isDefault: 'Default',
      addUnit: 'Add Unit',
      removeUnit: 'Remove',
      tags: 'Tags',
      addTag: 'Add Tag',
      tagPlaceholder: 'Example: Fresh, Organic, Seasonal',
      save: 'Save Product',
      cancel: 'Cancel',
      fillRequired: 'Please fill all required fields',
      selectDefault: 'Please select a default unit',
      productSaved: 'Product saved successfully!',
      saveError: 'Error saving product'
    }
  };

  const currentTexts = texts[language];

  // إضافة وحدة جديدة
  const addUnit = () => {
    const newId = Math.max(...productUnits.map(u => u.id)) + 1;
    setProductUnits([
      ...productUnits,
      { id: newId, unit: { ar: '', en: '' }, price: 0, isDefault: false }
    ]);
  };

  // حذف وحدة
  const removeUnit = (index: number) => {
    if (productUnits.length > 1) {
      setProductUnits(productUnits.filter((_, i) => i !== index));
    }
  };

  // تحديث وحدة
  const updateUnit = (index: number, field: string, value: any) => {
    const updatedUnits = [...productUnits];
    if (field === 'unit.ar') {
      updatedUnits[index].unit.ar = value;
    } else if (field === 'unit.en') {
      updatedUnits[index].unit.en = value;
    } else if (field === 'price') {
      updatedUnits[index].price = parseFloat(value) || 0;
    } else if (field === 'isDefault') {
      // إلغاء الافتراضي للكل وتفعيله للوحدة المحددة
      updatedUnits.forEach((unit, i) => {
        unit.isDefault = i === index ? value : false;
      });
    }
    setProductUnits(updatedUnits);
  };

  // إضافة علامة
  const addTag = () => {
    if (tagInput.trim() && !productTags.includes(tagInput.trim())) {
      setProductTags([...productTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  // حذف علامة
  const removeTag = (index: number) => {
    setProductTags(productTags.filter((_, i) => i !== index));
  };

  // توليد صورة من المجلد المحلي
  const generateLocalImage = (name: string, category: string) => {
    const fruitImages = [
      '/images/products/apple.svg',
      '/images/products/orange.svg', 
      '/images/products/banana.svg',
      '/images/products/grapes.svg',
      '/images/products/mango.svg',
      '/images/products/strawberry.svg',
      '/images/products/kiwi.svg'
    ];
    const vegetableImages = ['/images/products/apple.svg']; // يمكن إضافة صور خضار لاحقاً
    const leafyImages = ['/images/products/apple.svg']; // يمكن إضافة صور ورقيات لاحقاً
    const basketImages = ['/images/products/apple.svg']; // يمكن إضافة صور سلال لاحقاً
    
    let images = fruitImages;
    if (category === 'vegetables') images = vegetableImages;
    else if (category === 'leafy') images = leafyImages;
    else if (category === 'baskets') images = basketImages;
    
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return images[Math.abs(hash) % images.length];
  };

  const handleSave = async () => {
    console.log('🔴 SAVING COMPLETE PRODUCT DATA');
    console.log('🔴 Product name:', productName);
    console.log('🔴 Category:', productCategory);
    console.log('🔴 Units:', productUnits);
    
    // التحقق من الحقول المطلوبة
    if (!productName.ar || !productName.en) {
      const errorMsg = language === 'ar' 
        ? `❌ خطأ في البيانات المطلوبة\n\n🔍 التفاصيل:\n• الاسم بالعربية: ${productName.ar || 'مفقود ❌'}\n• الاسم بالإنجليزية: ${productName.en || 'مفقود ❌'}\n\n📝 يرجى ملء جميع الحقول المطلوبة`
        : `❌ Required Fields Error\n\n🔍 Details:\n• Arabic Name: ${productName.ar || 'Missing ❌'}\n• English Name: ${productName.en || 'Missing ❌'}\n\n📝 Please fill all required fields`;
      
      console.error('❌ Validation Error: Missing required names', { productName });
      alert(errorMsg);
      return;
    }

    // التحقق من وجود وحدة افتراضية
    const hasDefaultUnit = productUnits.some(unit => unit.isDefault);
    if (!hasDefaultUnit) {
      const errorMsg = language === 'ar'
        ? `❌ خطأ في الوحدات\n\n🔍 التفاصيل:\n• عدد الوحدات: ${productUnits.length}\n• الوحدة الافتراضية: غير محددة ❌\n\n📝 يرجى تحديد وحدة افتراضية واحدة على الأقل`
        : `❌ Units Error\n\n🔍 Details:\n• Units count: ${productUnits.length}\n• Default unit: Not selected ❌\n\n📝 Please select at least one default unit`;
      
      console.error('❌ Validation Error: No default unit', { productUnits });
      alert(errorMsg);
      return;
    }

    setIsSaving(true);
    console.log('🚀 Starting save process...');

    try {
      const completeProduct = {
        name: productName,
        category: productCategory,
        description: productDescription,
        image: productImage || generateLocalImage(productName.ar || productName.en, productCategory),
        stock: productStock,
        units: productUnits,
        tags: productTags,
        isPublished: true,
        minStock: 0,
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

      console.log('� Complete product data prepared:', completeProduct);
      console.log('📊 Product data size:', JSON.stringify(completeProduct).length, 'characters');
      
      // التحقق من حجم البيانات
      const productDataSize = JSON.stringify(completeProduct).length;
      if (productDataSize > 100000) { // 100KB
        console.warn('⚠️ Large product data detected:', productDataSize, 'characters');
      }

      console.log('🔄 Calling onAddProduct function...');
      await onAddProduct(completeProduct);
      console.log('✅ onAddProduct completed successfully');
      
      // رسالة نجاح مفصلة
      const successMessage = language === 'ar' 
        ? `✅ تم حفظ المنتج بنجاح!\n\n📦 اسم المنتج: ${productName.ar}\n💰 السعر: ${productUnits.find(u => u.isDefault)?.price} د.ك\n📊 المخزون: ${productStock}\n🖼️ الصورة: ${completeProduct.image}\n\n🔄 تم تحديث الموقع المباشر تلقائياً`
        : `✅ Product saved successfully!\n\n📦 Product: ${productName.en}\n💰 Price: ${productUnits.find(u => u.isDefault)?.price} KD\n📊 Stock: ${productStock}\n🖼️ Image: ${completeProduct.image}\n\n🔄 Live website updated automatically`;
      
      console.log('🎉 Success message:', successMessage);
      alert(successMessage);
      
      // إعادة تعيين النموذج
      console.log('🔄 Resetting form...');
      setProductName({ ar: '', en: '' });
      setProductCategory('fruits');
      setProductDescription({ ar: '', en: '' });
      setProductImage('');
      setProductStock(0);
      setProductTags([]);
      setProductUnits([
        { id: 1, unit: { ar: 'كيلو', en: 'Kilo' }, price: 0, isDefault: true }
      ]);
      console.log('✅ Form reset completed');
      
    } catch (error) {
      console.error('🔴 DETAILED ERROR INFORMATION:');
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error?.constructor?.name);
      console.error('Error message:', error instanceof Error ? error.message : error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      console.error('Full error object:', error);
      
      // معلومات إضافية للتصحيح
      console.error('🔍 DEBUG INFO:');
      console.error('Product name:', productName);
      console.error('Product units:', productUnits);
      console.error('LocalStorage available:', typeof(Storage) !== "undefined");
      console.error('onAddProduct function:', typeof onAddProduct);
      
      // رسالة خطأ مفصلة جداً
      const errorMessage = language === 'ar'
        ? `❌ خطأ في حفظ المنتج\n\n🔍 تفاصيل الخطأ:\n• نوع الخطأ: ${error?.constructor?.name || 'غير محدد'}\n• رسالة الخطأ: ${error instanceof Error ? error.message : error}\n• الوقت: ${new Date().toLocaleString()}\n\n📊 بيانات المنتج:\n• الاسم: ${productName.ar}\n• الفئة: ${productCategory}\n• عدد الوحدات: ${productUnits.length}\n\n💾 حالة التخزين:\n• localStorage متوفر: ${typeof(Storage) !== "undefined" ? 'نعم ✅' : 'لا ❌'}\n• دالة الحفظ: ${typeof onAddProduct === 'function' ? 'متوفرة ✅' : 'غير متوفرة ❌'}\n\n🔧 يرجى:\n1. التحقق من اتصال الإنترنت\n2. تحديث الصفحة والمحاولة مرة أخرى\n3. التحقق من Console للمزيد من التفاصيل (F12)`
        : `❌ Product Save Error\n\n🔍 Error Details:\n• Error Type: ${error?.constructor?.name || 'Unknown'}\n• Error Message: ${error instanceof Error ? error.message : error}\n• Time: ${new Date().toLocaleString()}\n\n📊 Product Data:\n• Name: ${productName.en}\n• Category: ${productCategory}\n• Units Count: ${productUnits.length}\n\n💾 Storage Status:\n• localStorage Available: ${typeof(Storage) !== "undefined" ? 'Yes ✅' : 'No ❌'}\n• Save Function: ${typeof onAddProduct === 'function' ? 'Available ✅' : 'Unavailable ❌'}\n\n🔧 Please:\n1. Check internet connection\n2. Refresh page and try again\n3. Check Console for more details (F12)`;
      
      alert(errorMessage);
    } finally {
      setIsSaving(false);
      console.log('🔄 Save process completed, isSaving set to false');
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-header">
        <button className="back-btn" onClick={onBack}>
          ← {currentTexts.back}
        </button>
        <h1 className="page-title">{currentTexts.addProduct}</h1>
      </div>

      <div className="add-product-content">
        <div className="form-section">
          
          {/* اسم المنتج */}
          <div className="form-group">
            <h3 className="section-title">{currentTexts.productName}</h3>
            <div className="name-inputs">
              <div className="input-group">
                <label>{currentTexts.arabicName}</label>
                <input
                  type="text"
                  value={productName.ar}
                  onChange={(e) => setProductName({...productName, ar: e.target.value})}
                  placeholder="اسم المنتج بالعربية"
                  className="form-input"
                />
              </div>
              <div className="input-group">
                <label>{currentTexts.englishName}</label>
                <input
                  type="text"
                  value={productName.en}
                  onChange={(e) => setProductName({...productName, en: e.target.value})}
                  placeholder="Product name in English"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* الفئة */}
          <div className="form-group">
            <h3 className="section-title">{currentTexts.category}</h3>
            <select
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value as any)}
              className="form-select"
            >
              <option value="fruits">{currentTexts.fruits}</option>
              <option value="vegetables">{currentTexts.vegetables}</option>
              <option value="leafy">{currentTexts.leafy}</option>
              <option value="baskets">{currentTexts.baskets}</option>
            </select>
          </div>

          {/* الوصف */}
          <div className="form-group">
            <h3 className="section-title">{currentTexts.description}</h3>
            <div className="description-inputs">
              <div className="input-group">
                <label>{currentTexts.arabicDesc}</label>
                <textarea
                  value={productDescription.ar}
                  onChange={(e) => setProductDescription({...productDescription, ar: e.target.value})}
                  placeholder="وصف المنتج بالعربية"
                  className="form-textarea"
                  rows={3}
                />
              </div>
              <div className="input-group">
                <label>{currentTexts.englishDesc}</label>
                <textarea
                  value={productDescription.en}
                  onChange={(e) => setProductDescription({...productDescription, en: e.target.value})}
                  placeholder="Product description in English"
                  className="form-textarea"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* صورة المنتج */}
          <div className="form-group">
            <h3 className="section-title">{currentTexts.image}</h3>
            <div className="input-group">
              <label>{currentTexts.imageUrl}</label>
              <input
                type="url"
                value={productImage}
                onChange={(e) => setProductImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="form-input"
              />
              <small>اتركه فارغاً لاستخدام صورة رمزية تلقائية</small>
            </div>
          </div>

          {/* الوحدات والأسعار */}
          <div className="form-group">
            <h3 className="section-title">{currentTexts.units}</h3>
            {productUnits.map((unit, index) => (
              <div key={unit.id} className="unit-row">
                <div className="unit-inputs">
                  <div className="unit-name-group">
                    <input
                      type="text"
                      placeholder={currentTexts.arabicUnit}
                      value={unit.unit.ar}
                      onChange={(e) => updateUnit(index, 'unit.ar', e.target.value)}
                      className="unit-input"
                    />
                    <input
                      type="text"
                      placeholder={currentTexts.englishUnit}
                      value={unit.unit.en}
                      onChange={(e) => updateUnit(index, 'unit.en', e.target.value)}
                      className="unit-input"
                    />
                  </div>
                  <input
                    type="number"
                    placeholder={currentTexts.price}
                    value={unit.price}
                    onChange={(e) => updateUnit(index, 'price', e.target.value)}
                    className="price-input"
                    step="0.001"
                    min="0"
                  />
                  <label className="default-checkbox">
                    <input
                      type="checkbox"
                      checked={unit.isDefault}
                      onChange={(e) => updateUnit(index, 'isDefault', e.target.checked)}
                    />
                    {currentTexts.isDefault}
                  </label>
                  {productUnits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUnit(index)}
                      className="remove-unit-btn"
                    >
                      {currentTexts.removeUnit}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addUnit}
              className="add-unit-btn"
            >
              + {currentTexts.addUnit}
            </button>
          </div>

          {/* المخزون */}
          <div className="form-group">
            <h3 className="section-title">{currentTexts.stock}</h3>
            <input
              type="number"
              value={productStock}
              onChange={(e) => setProductStock(parseInt(e.target.value) || 0)}
              className="form-input"
              min="0"
              placeholder="عدد القطع المتوفرة"
            />
          </div>

          {/* العلامات */}
          <div className="form-group">
            <h3 className="section-title">{currentTexts.tags}</h3>
            <div className="tags-input-group">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder={currentTexts.tagPlaceholder}
                className="form-input"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={addTag}
                className="add-tag-btn"
              >
                {currentTexts.addTag}
              </button>
            </div>
            
            {productTags.length > 0 && (
              <div className="tags-display">
                {productTags.map((tag, index) => (
                  <div key={index} className="tag-item">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="remove-tag-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* أزرار الحفظ */}
          <div className="form-actions">
            <button
              className="save-btn"
              onClick={handleSave}
              disabled={isSaving}
              style={{
                opacity: isSaving ? 0.7 : 1,
                cursor: isSaving ? 'not-allowed' : 'pointer'
              }}
            >
              {isSaving 
                ? (language === 'ar' ? '🔄 جاري الحفظ...' : '🔄 Saving...') 
                : currentTexts.save
              }
            </button>
            <button
              className="cancel-btn"
              onClick={onBack}
              disabled={isSaving}
            >
              {currentTexts.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
