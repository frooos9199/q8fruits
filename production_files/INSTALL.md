# تعليمات رفع خادم API إلى q8fruit.com

## 1. رفع الملفات
ارفع هذه الملفات إلى مجلد على خادم q8fruit.com:
- api-server.js
- package.json

## 2. تثبيت المكتبات
```bash
cd /path/to/api/directory
npm install
```

## 3. إنشاء مجلد البيانات
```bash
mkdir data
chmod 755 data
```

## 4. تشغيل الخادم
```bash
# للاختبار
node api-server.js

# للإنتاج (مع PM2)
npm install -g pm2
pm2 start api-server.js --name "q8fruit-api"
pm2 startup
pm2 save
```

## 5. تكوين الخادم
أضف هذا إلى تكوين Nginx أو Apache:

### Nginx:
```nginx
location /api {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Apache (.htaccess):
```apache
RewriteEngine On
RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
```

## 6. اختبار
```bash
curl https://q8fruit.com/api/health
```
