# تطبيق Q8 Fruit Pro - React Native 🍎🥕

تطبيق موبايل (iOS و Android) لمتجر Q8 Fruit للفواكه والخضروات.

> **ملاحظة**: هذا الفرع (`mobile-app`) يحتوي على تطبيق React Native.  
> لمشروع الويب، راجع الفرع `main`.

---

## المميزات ✨

- ✅ عرض المنتجات مع الصور والأسعار
- ✅ تصفح حسب الفئات (فواكه، خضار، ورقيات)
- ✅ سلة تسوق ذكية مع حفظ تلقائي (AsyncStorage)
- ✅ شاشة تفاصيل المنتج
- ✅ شاشة دفع مع التحقق من البيانات
- ✅ تكامل كامل مع API حقيقي
- ✅ شاشة تأكيد الطلب بعد الشراء
- ✅ معالجة الأخطاء والحالات الفارغة

---

## المتطلبات 📋

- Node.js >= 18
- React Native CLI
- Xcode (للـ iOS)
- Android Studio (للـ Android)

راجع [دليل إعداد البيئة](https://reactnative.dev/docs/set-up-your-environment) لمزيد من التفاصيل.

---

## التثبيت 🚀

### 1. تثبيت Dependencies

```bash
npm install
```

### 2. تثبيت CocoaPods (iOS فقط)

```bash
cd ios
bundle install
pod install
cd ..
```

---

## التشغيل ▶️

### iOS

```bash
npm run ios
# أو
npx react-native run-ios
```

### Android

```bash
npm run android
# أو
npx react-native run-android
```

---

## الضبط ⚙️

عدّل ملف `src/config.ts` لضبط عنوان API الخاص بك:

```typescript
export const API_BASE_URL = 'https://www.q8fruit.com';
export const ORDERS_PATH = '/api/orders';
```

---

## هيكل المشروع 📁

```
src/
├── config.ts              # إعدادات التطبيق والـ API
├── services/
│   └── api.ts            # خدمات الاتصال بالـ API
├── context/
│   └── CartContext.tsx   # إدارة حالة السلة (Context API)
├── components/
│   └── Button.tsx        # مكونات قابلة لإعادة الاستخدام
└── screens/
    ├── HomeScreen.tsx              # الصفحة الرئيسية
    ├── CategoriesScreen.tsx        # الفئات
    ├── ProductDetailScreen.tsx     # تفاصيل المنتج
    ├── CartScreen.tsx              # السلة
    ├── CheckoutScreen.tsx          # الدفع
    └── OrderConfirmationScreen.tsx # تأكيد الطلب
```

---

## API Endpoints

التطبيق يتصل بالـ endpoints التالية:

- `GET /api/products` - جلب المنتجات
- `GET /api/banners` - جلب البانرات
- `POST /api/orders` - إنشاء طلب جديد

---

## الفروع 🌿

- **`main`**: تطبيق الويب (React) - منشور على Vercel
- **`mobile-app`**: تطبيق الموبايل (React Native) - هذا الفرع

---

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
