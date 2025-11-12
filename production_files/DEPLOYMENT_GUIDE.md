# 🚀 دليل النشر للإنتاج - Q8 Fruit API

## 📋 الملفات المطلوبة للرفع

### الملفات الأساسية:
1. `api-server.js` - خادم API الرئيسي
2. `package.json` - معلومات المشروع والمكتبات
3. `check_api.js` - فحص حالة API بعد النشر

## 🔧 خطوات التثبيت على q8fruit.com

### الخطوة 1: رفع الملفات
```bash
# رفع الملفات إلى خادم q8fruit.com
# يمكن استخدام FTP، cPanel، أو SSH

# مثال باستخدام SCP:
scp api-server.js user@q8fruit.com:/home/user/api/
scp package.json user@q8fruit.com:/home/user/api/
scp check_api.js user@q8fruit.com:/home/user/api/
```

### الخطوة 2: الاتصال بالخادم وتثبيت المكتبات
```bash
# الاتصال بالخادم
ssh user@q8fruit.com

# الانتقال لمجلد API
cd /home/user/api/

# تثبيت Node.js (إذا لم يكن مثبت)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# تثبيت المكتبات
npm install

# إنشاء مجلد البيانات
mkdir data
chmod 755 data
```

### الخطوة 3: تشغيل الخادم
```bash
# للاختبار المؤقت
node api-server.js

# للإنتاج الدائم (باستخدام PM2)
npm install -g pm2
pm2 start api-server.js --name "q8fruit-api"
pm2 startup
pm2 save
```

### الخطوة 4: تكوين الخادم الويب

#### إذا كنت تستخدم Nginx:
```nginx
# إضافة هذا إلى تكوين Nginx
location /api {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

#### إذا كنت تستخدم Apache:
```apache
# إضافة هذا إلى .htaccess أو ملف التكوين
RewriteEngine On
RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
ProxyPreserveHost On
ProxyRequests Off
```

#### إذا كنت تستخدم cPanel:
1. اذهب إلى **Node.js Apps**
2. أنشئ تطبيق جديد
3. حدد Node.js version 16 أو أحدث
4. حدد مجلد التطبيق
5. اضبط startup file على `api-server.js`
6. في **Apache & Nginx Settings**، أضف:
   ```
   location /api {
       proxy_pass http://localhost:3001;
   }
   ```

### الخطوة 5: اختبار التثبيت
```bash
# فحص حالة الخادم
curl http://localhost:3001/api/health

# فحص من الخارج
curl https://q8fruit.com/api/health

# تشغيل فحص شامل
node check_api.js
```

## 🛡️ الأمان والحماية

### 1. حماية الملفات:
```bash
chmod 600 package.json
chmod 700 api-server.js
chmod 755 data/
```

### 2. متغيرات البيئة:
```bash
# إنشاء ملف .env (اختياري)
echo "PORT=3001" > .env
echo "NODE_ENV=production" >> .env
```

### 3. Firewall:
```bash
# السماح فقط للمنافذ المطلوبة
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw deny 3001  # حماية منفذ API المباشر
```

## 📊 المراقبة والصيانة

### فحص حالة PM2:
```bash
pm2 status
pm2 logs q8fruit-api
pm2 restart q8fruit-api
```

### نسخ احتياطية:
```bash
# نسخ احتياطي للبيانات
tar -czf backup-$(date +%Y%m%d).tar.gz data/

# جدولة نسخ احتياطية (crontab)
0 2 * * * cd /home/user/api && tar -czf backup-$(date +\%Y\%m\%d).tar.gz data/
```

## 🚨 استكشاف الأخطاء

### مشاكل شائعة:

1. **منفذ 3001 مستخدم:**
   ```bash
   lsof -ti:3001 | xargs kill -9
   ```

2. **أذونات الملفات:**
   ```bash
   chown -R $USER:$USER /home/user/api/
   ```

3. **مكتبات مفقودة:**
   ```bash
   npm install --force
   ```

4. **تحقق من السجلات:**
   ```bash
   pm2 logs q8fruit-api --lines 50
   ```

## ✅ التحقق من النجاح

### اختبارات أساسية:
1. ✅ `curl https://q8fruit.com/api/health` يرجع `{"status":"OK"}`
2. ✅ `curl https://q8fruit.com/api/products` يرجع قائمة فارغة أو منتجات
3. ✅ التطبيق iOS يتصل بنجاح ولا يظهر "غير متصل"

### عند النجاح:
- 🎉 التطبيق سيعرض المنتجات من الخادم
- 📱 يمكن إنشاء طلبات جديدة
- 🔄 البيانات متزامنة مع الموقع

---

## 📞 المساعدة

إذا واجهت مشاكل:
1. شغل `node check_api.js` للتشخيص
2. تحقق من سجلات PM2: `pm2 logs`
3. تأكد من تكوين الخادم الويب صحيح

**🚀 بعد اتباع هذه الخطوات، سيعمل التطبيق iOS مع البيانات الفعلية من q8fruit.com!**