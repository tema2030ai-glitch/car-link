# 🚗 Car Link - منصة تحليل السيارات بالذكاء الاصطناعي

## 📋 معلومات المشروع

- **اسم المشروع**: Car Link
- **الإصدار**: 1.0.0
- **تاريخ النسخة الاحتياطية**: 2025-04-13
- **المطور**: تم تطويره بواسطة الذكاء الاصطناعي

---

## ✨ المميزات الرئيسية

### 1. تحليل السيارات
- تحليل السيارات من الروابط
- تحليل السيارات من الصور
- التعرف على السيارات بالذكاء الاصطناعي

### 2. حاسبة التمويل
- حساب الأقساط الشهرية
- التحقق من الأهلية حسب الراتب
- مقارنة عروض البنوك السعودية

### 3. الالتزامات الشهرية (جديد)
- قرض شخصي
- قرض عقاري
- قروض أخرى
- إجمالي الالتزامات التلقائي

### 4. مقارنة السيارات
- مقارنة حتى 4 سيارات
- ملخص المقارنة السريع
- زر "قدم طلبك الآن" عند 3 سيارات

### 5. سيارات تناسب ميزانيتك
- عرض السيارات حسب القدرة الشرائية
- سنة الموديل 2026

### 6. بوت التمويل الذكي
- محادثة تفاعلية لطلب التمويل
- تتبع حالة الطلب

---

## 🛠️ التقنيات المستخدمة

| التقنية | الإصدار |
|---------|---------|
| Next.js | 16.x |
| React | 19.x |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| shadcn/ui | latest |
| Prisma | 6.x |
| Zustand | 5.x |
| Framer Motion | 12.x |
| Lucide Icons | latest |
| z-ai-web-dev-sdk | 0.0.17 |

---

## 📁 هيكل المشروع

```
my-project/
├── src/
│   ├── app/
│   │   ├── page.tsx          # الصفحة الرئيسية (11,551 سطر)
│   │   ├── layout.tsx        # التخطيط الرئيسي
│   │   └── api/              # APIs
│   │       ├── ai-car-analysis/
│   │       ├── ai-car-prices/
│   │       ├── ai-financing-offers/
│   │       ├── analyze-link/
│   │       ├── analyze-image/
│   │       ├── analyze-uploaded-image/
│   │       ├── car-valuation/
│   │       ├── chat/
│   │       ├── competitors/
│   │       ├── financing/
│   │       └── market-analysis/
│   ├── components/
│   │   └── ui/               # مكونات shadcn/ui
│   ├── hooks/
│   │   ├── use-toast.ts
│   │   └── use-mobile.ts
│   ├── lib/
│   │   ├── db.ts
│   │   └── utils.ts
│   ├── store/
│   │   └── car-link-store.ts # Zustand store
│   └── types/
│       └── index.ts
├── prisma/
│   └── schema.prisma
├── public/
│   └── logo.svg
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── .env
```

---

## 🚀 طريقة التشغيل

### المتطلبات:
- Node.js 18+ أو Bun
- npm أو yarn أو bun

### الخطوات:

```bash
# 1. إنشاء مشروع جديد
npx create-next-app@latest car-link --typescript --tailwind --eslint

# 2. الدخول للمجلد
cd car-link

# 3. تثبيت المكتبات
npm install framer-motion lucide-react zustand next-themes z-ai-web-dev-sdk

# 4. تثبيت shadcn/ui
npx shadcn@latest init

# 5. تثبيت المكونات المطلوبة
npx shadcn@latest add button card input label tabs dialog badge slider scroll-area separator progress textarea avatar dropdown-menu tooltip sheet

# 6. نسخ الملفات
# - انسخ src/app/page.tsx
# - انسخ src/store/car-link-store.ts
# - انسخ src/types/index.ts

# 7. تشغيل المشروع
npm run dev
```

---

## ⚙️ متغيرات البيئة (.env)

```env
# AI SDK
Z_API_KEY=your_api_key_here

# Database (اختياري)
DATABASE_URL="file:./dev.db"

# NextAuth (اختياري)
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
```

---

## 📦 النشر على Vercel

### الطريقة 1: من GitHub
1. ارفع المشروع على GitHub
2. اذهب إلى vercel.com
3. اضغط "New Project"
4. اختر الـ repository
5. اضغط "Deploy"

### الطريقة 2: مباشرة
```bash
npm i -g vercel
vercel
```

---

## 📝 آخر التحديثات

### 2025-04-13
- ✅ تعديل الالتزامات الشهرية (قرض شخصي، قرض عقاري، قروض أخرى)
- ✅ إضافة إجمالي الالتزامات التلقائي
- ✅ تغيير سنة الموديل إلى 2026
- ✅ إضافة زر "قدم طلبك الآن" في مقارنة 3 سيارات

---

## 📞 الدعم

للمساعدة أو الاستفسارات، يمكنك التواصل عبر المشروع.

---

**تم إنشاء هذا الدليل للحفاظ على المشروع وتوثيقه.**
