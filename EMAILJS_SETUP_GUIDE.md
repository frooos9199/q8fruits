# 📧 إعداد EmailJS لـ Q8 Fruit - دليل شامل

## 🎯 المعلومات المطلوبة:
- **إيميل المدير:** summit_kw@hotmail.com
- **اسم العمل:** Q8 Fruit  
- **رقم الهاتف:** 98899426

---

## 🚀 خطوات الإعداد:

### الخطوة 1: إنشاء حساب EmailJS

1. اذهب إلى: [https://dashboard.emailjs.com/sign-up](https://dashboard.emailjs.com/sign-up)
2. سجل باستخدام إيميل المدير: **summit_kw@hotmail.com**
3. أكد الحساب من الإيميل

### الخطوة 2: إنشاء Email Service

1. من Dashboard، اضغط **"Add New Service"**
2. اختر **"Outlook"** (لأن الإيميل Hotmail/Outlook)
3. أدخل بيانات الإيميل:
   - **Email:** summit_kw@hotmail.com
   - **Password:** [كلمة مرور الإيميل]
4. اختر **Service Name:** "Q8_Fruit_Service"
5. احفظ واحصل على **Service ID**

### الخطوة 3: إنشاء Email Template

1. اضغط **"Create New Template"**
2. **Template Name:** "Q8_Fruit_Invoice"
3. **From Name:** Q8 Fruit
4. **Subject:** 
```
فاتورة طلبكم من Q8 Fruit - رقم {{order_number}}
```

5. **Content/Body:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; }
        .header { background: #22c55e; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background: #f3f4f6; padding: 15px; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Q8 Fruit</h1>
        <h2>فاتورة شراء</h2>
    </div>
    
    <div class="content">
        <p>مرحباً <strong>{{customer_name}}</strong>،</p>
        
        <p>شكراً لطلبكم من Q8 Fruit!</p>
        
        <h3>تفاصيل الطلب:</h3>
        <ul>
            <li><strong>رقم الطلب:</strong> {{order_number}}</li>
            <li><strong>التاريخ:</strong> {{invoice_date}}</li>
            <li><strong>المجموع:</strong> {{total_amount}}</li>
        </ul>
        
        <p>ستجدون الفاتورة مرفقة مع هذا الإيميل.</p>
        
        <p>{{message}}</p>
    </div>
    
    <div class="footer">
        <p><strong>للاستفسار:</strong></p>
        <p>📱 واتساب: {{business_phone}}</p>
        <p>📧 إيميل: {{from_email}}</p>
        <p>💚 شكراً لاختياركم Q8 Fruit</p>
    </div>
</body>
</html>
```

6. **Test Variables:** أضف هذه المتغيرات للاختبار:
```
to_email: test@example.com
customer_name: أحمد محمد
order_number: FK1730000001
invoice_date: 30/10/2025
total_amount: 12.500 د.ك
business_phone: 98899426
from_email: summit_kw@hotmail.com
message: شكراً لكم
```

7. احفظ واحصل على **Template ID**

### الخطوة 4: الحصول على Public Key

1. اذهب إلى **Account** → **API Keys**
2. انسخ **Public Key**

### الخطوة 5: تحديث المفاتيح في Vercel

1. اذهب إلى [Vercel Dashboard](https://vercel.com)
2. اختر مشروع **q8fruits**
3. اذهب إلى **Settings** → **Environment Variables**
4. أضف هذه المتغيرات:

```
REACT_APP_EMAILJS_SERVICE_ID = service_xxxxxxx
REACT_APP_EMAILJS_TEMPLATE_ID = template_xxxxxxx  
REACT_APP_EMAILJS_PUBLIC_KEY = your_public_key_here
```

5. **Redeploy** المشروع

---

## 🧪 اختبار النظام:

### اختبار محلي:
1. أضف المفاتيح في `.env.local`
2. شغل الموقع محلياً: `npm start`
3. جرب طلب تجريبي مع إيميلك

### اختبار مباشر:
1. اذهب إلى q8fruit.com
2. أضف منتجات للسلة
3. في الطلب، أدخل إيميلك التجريبي
4. أكمل الطلب
5. تحقق من وصول الفاتورة

---

## 🔧 استكشاف الأخطاء:

### لا تصل الإيميلات:
- ✅ تأكد من صحة مفاتيح EmailJS
- ✅ تحقق من مجلد Spam
- ✅ تأكد من تفعيل الخدمة في EmailJS
- ✅ راجع Console للأخطاء

### رسائل خطأ:
- **401 Unauthorized:** خطأ في Public Key
- **404 Not Found:** خطأ في Service ID أو Template ID
- **Network Error:** مشكلة اتصال

---

## 📋 بعد الإعداد:

### الميزات التي ستعمل:
✅ إرسال تلقائي للفواتير عند الطلب  
✅ إرسال يدوي من صفحة التأكيد  
✅ رسائل مخصصة بالعربية والإنجليزية  
✅ فواتير PDF مرفقة  
✅ إشعارات للعملاء  

### للمدير:
- ستصل نسخة من كل فاتورة لإيميل المدير
- تتبع سهل للطلبات
- أرشيف تلقائي للفواتير

---

## 🎉 انتهاء الإعداد:

بعد إكمال هذه الخطوات، سيعمل نظام إرسال الفواتير بشكل كامل وتلقائي!

**Q8 Fruit جاهز للعمل مع نظام فواتير احترافي! 🚀**