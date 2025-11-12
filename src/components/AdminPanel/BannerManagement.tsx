// إضافة هذا الكود قبل renderSettings في AdminPanel.tsx

  const renderBannerManagement = () => (
    <div className="banner-management">
      <div className="section-header">
        <h2>🖼️ إدارة البانر</h2>
        <p className="section-description">إدارة صور البانر المتحرك في الصفحة الرئيسية</p>
      </div>

      <div className="banner-grid">
        {/* Banner 1 */}
        <div className="banner-card">
          <div className="banner-preview">
            <img 
              src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&h=400&fit=crop" 
              alt="Banner 1"
            />
          </div>
          <div className="banner-info">
            <h3>البانر الأول</h3>
            <div className="banner-controls">
              <button className="btn-edit">
                ✏️ تعديل الصورة
              </button>
              <button className="btn-delete">
                🗑️ حذف
              </button>
            </div>
          </div>
        </div>

        {/* Banner 2 */}
        <div className="banner-card">
          <div className="banner-preview">
            <img 
              src="https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=800&h=400&fit=crop" 
              alt="Banner 2"
            />
          </div>
          <div className="banner-info">
            <h3>البانر الثاني</h3>
            <div className="banner-controls">
              <button className="btn-edit">
                ✏️ تعديل الصورة
              </button>
              <button className="btn-delete">
                🗑️ حذف
              </button>
            </div>
          </div>
        </div>

        {/* Banner 3 */}
        <div className="banner-card">
          <div className="banner-preview">
            <img 
              src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=400&fit=crop" 
              alt="Banner 3"
            />
          </div>
          <div className="banner-info">
            <h3>البانر الثالث</h3>
            <div className="banner-controls">
              <button className="btn-edit">
                ✏️ تعديل الصورة
              </button>
              <button className="btn-delete">
                🗑️ حذف
              </button>
            </div>
          </div>
        </div>

        {/* Add New Banner Card */}
        <div className="banner-card add-banner">
          <div className="add-banner-content">
            <div className="upload-icon">➕</div>
            <h3>إضافة بانر جديد</h3>
            <p>انقر لرفع صورة جديدة</p>
            <input 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              id="banner-upload"
            />
            <label htmlFor="banner-upload" className="btn-upload">
              📤 اختر صورة
            </label>
          </div>
        </div>
      </div>

      <div className="banner-settings">
        <h3>⚙️ إعدادات البانر</h3>
        <div className="setting-row">
          <label>
            <input type="checkbox" defaultChecked />
            تفعيل التبديل التلقائي
          </label>
        </div>
        <div className="setting-row">
          <label>مدة عرض كل صورة (بالثواني):</label>
          <input type="number" defaultValue="3.5" min="1" max="10" step="0.5" />
        </div>
        <div className="setting-row">
          <label>نوع الانتقال:</label>
          <select>
            <option value="fade">تلاشي</option>
            <option value="slide">انزلاق</option>
            <option value="zoom">تكبير</option>
          </select>
        </div>
        <div className="setting-row">
          <button className="btn-save-settings">
            💾 حفظ الإعدادات
          </button>
        </div>
      </div>

      <style jsx>{`
        .banner-management {
          padding: 20px;
        }

        .section-header {
          margin-bottom: 30px;
          border-bottom: 2px solid #e0e0e0;
          padding-bottom: 15px;
        }

        .section-header h2 {
          font-size: 24px;
          color: #2c3e50;
          margin: 0 0 10px 0;
        }

        .section-description {
          color: #7f8c8d;
          margin: 0;
        }

        .banner-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .banner-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .banner-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }

        .banner-preview {
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #f5f5f5;
        }

        .banner-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .banner-info {
          padding: 15px;
        }

        .banner-info h3 {
          margin: 0 0 15px 0;
          font-size: 18px;
          color: #2c3e50;
        }

        .banner-controls {
          display: flex;
          gap: 10px;
        }

        .banner-controls button {
          flex: 1;
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .btn-edit {
          background: #3498db;
          color: white;
        }

        .btn-edit:hover {
          background: #2980b9;
        }

        .btn-delete {
          background: #e74c3c;
          color: white;
        }

        .btn-delete:hover {
          background: #c0392b;
        }

        .add-banner {
          border: 2px dashed #bdc3c7;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .add-banner:hover {
          border-color: #3498db;
          background: #e8f4fd;
        }

        .add-banner-content {
          text-align: center;
          padding: 40px 20px;
        }

        .upload-icon {
          font-size: 48px;
          color: #bdc3c7;
          margin-bottom: 15px;
        }

        .add-banner-content h3 {
          color: #7f8c8d;
          margin-bottom: 10px;
        }

        .add-banner-content p {
          color: #95a5a6;
          font-size: 14px;
          margin-bottom: 15px;
        }

        .btn-upload {
          display: inline-block;
          padding: 10px 20px;
          background: #3498db;
          color: white;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-upload:hover {
          background: #2980b9;
        }

        .banner-settings {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .banner-settings h3 {
          margin: 0 0 20px 0;
          font-size: 20px;
          color: #2c3e50;
        }

        .setting-row {
          margin-bottom: 20px;
        }

        .setting-row label {
          display: block;
          margin-bottom: 8px;
          color: #34495e;
          font-weight: 500;
        }

        .setting-row input[type="number"],
        .setting-row select {
          width: 100%;
          max-width: 300px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .setting-row input[type="checkbox"] {
          margin-left: 10px;
          width: 18px;
          height: 18px;
        }

        .btn-save-settings {
          padding: 12px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-save-settings:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        @media (max-width: 768px) {
          .banner-grid {
            grid-template-columns: 1fr;
          }

          .setting-row input[type="number"],
          .setting-row select {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
