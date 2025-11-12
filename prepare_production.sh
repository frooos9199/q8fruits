#!/bin/bash
# Script to prepare production files for q8fruit.com

echo "📦 تحضير ملفات الإنتاج لـ q8fruit.com..."

# Create production directory
mkdir -p production_files

# Copy necessary files
cp api-server.js production_files/
cp api-package.json production_files/package.json

# Create deployment instructions
cat > production_files/INSTALL.md << 'EOF'
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
EOF

echo "✅ ملفات الإنتاج جاهزة في مجلد production_files/"
echo "📁 الملفات المطلوبة:"
ls -la production_files/