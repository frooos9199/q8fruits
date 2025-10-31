# نشر خادم API على q8fruit.com

## المتطلبات
- Node.js 16 أو أحدث
- npm أو yarn
- خادم ويب (Apache/Nginx)

## خطوات النشر

### 1. رفع الملفات
قم برفع الملفات التالية إلى خادم q8fruit.com:
```
api-server.js
api-package.json (rename to package.json)
```

### 2. تثبيت المكتبات
```bash
cd /path/to/api/directory
cp api-package.json package.json
npm install
```

### 3. إنشاء مجلد البيانات
```bash
mkdir data
chmod 755 data
```

### 4. تكوين PM2 (اختياري)
```bash
npm install -g pm2
pm2 start api-server.js --name "q8fruit-api"
pm2 startup
pm2 save
```

### 5. تكوين Nginx (مثال)
أضف هذا إلى تكوين Nginx:
```nginx
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

### 6. تكوين Apache (مثال)
أضف هذا إلى .htaccess أو تكوين Apache:
```apache
RewriteEngine On
RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
ProxyPreserveHost On
ProxyRequests Off
```

## اختبار الخادم

### تحقق من حالة الخادم:
```bash
curl https://q8fruit.com/api/health
```

### اختبار المنتجات:
```bash
curl https://q8fruit.com/api/products
```

## ملفات البيانات

البيانات ستُحفظ في مجلد `data/`:
- `products.json` - بيانات المنتجات
- `orders.json` - بيانات الطلبات
- `users.json` - بيانات المستخدمين
- `settings.json` - إعدادات التطبيق

## الأمان

1. **تشفير كلمات المرور**: أضف bcrypt للتشفير
2. **JWT Tokens**: استخدم JWT للمصادقة
3. **Rate Limiting**: أضف حد للطلبات
4. **HTTPS**: تأكد من استخدام HTTPS

## المراقبة

### عرض سجلات PM2:
```bash
pm2 logs q8fruit-api
```

### إعادة تشغيل الخادم:
```bash
pm2 restart q8fruit-api
```

### حالة الخادم:
```bash
pm2 status
```

## استكشاف الأخطاء

### تحقق من المنافذ:
```bash
netstat -tulpn | grep :3001
```

### تحقق من العمليات:
```bash
ps aux | grep node
```

### سجلات النظام:
```bash
tail -f /var/log/nginx/error.log
tail -f /var/log/apache2/error.log
```