import { NextRequest, NextResponse } from 'next/server';

// Default fallback data when AI services are unavailable
const defaultData = {
  lastUpdate: new Date().toLocaleString('ar-SA'),
  marketOverview: {
    trend: 'stable',
    summary: 'السوق مستقر مع طلب معتدل على السيارات',
    topSellingBrands: ['تويوتا', 'هيونداي', 'نيسان', 'كيا', 'هوندا']
  },
  priceHighlights: [
    { brand: 'تويوتا', model: 'كامري 2024', price: '115,000 - 135,000 ريال', change: 'مستقر' },
    { brand: 'هيونداي', model: 'سوناتا 2024', price: '95,000 - 115,000 ريال', change: 'انخفاض طفيف' },
    { brand: 'نيسان', model: 'ألتيما 2024', price: '100,000 - 120,000 ريال', change: 'مستقر' }
  ],
  financingHighlights: [
    { bank: 'مصرف الراجحي', rate: '2.99%', feature: 'موافقة فورية عبر التطبيق' },
    { bank: 'البنك الأهلي', rate: '3.5%', feature: 'تأجيل أول قسط' },
    { bank: 'بنك الجزيرة', rate: '3.25%', feature: 'مرونة في السداد' }
  ],
  topOffers: [
    { title: 'عروض نهاية الموسم', discount: 'حتى 15,000 ريال', validUntil: 'نهاية الشهر' },
    { title: 'ضمان إضافي مجاني', discount: 'سنة إضافية', validUntil: 'مستمر' }
  ],
  recommendations: {
    bestTimeToBuy: 'الوقت الحالي مناسب مع توفر عروض نهاية السنة',
    financingAdvice: 'قارن بين 3 بنوك على الأقل قبل اتخاذ القرار',
    marketPrediction: 'توقع استقرار الأسعار مع زيادة العروض'
  },
  newsHeadlines: [
    'زيادة مبيعات السيارات الكهربائية في السعودية',
    'عروض مميزة على سيارات الدفع الرباعي',
    'افتتاح معارض جديدة للسيارات الفاخرة'
  ]
};

export async function GET(request: NextRequest) {
  // Always return default data immediately to prevent server crashes
  return NextResponse.json({
    success: true,
    summary: defaultData,
    rawData: {
      carPrices: [],
      financingOffers: [],
      carOffers: [],
      marketTrends: []
    },
    timestamp: new Date().toISOString(),
    source: 'default'
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type } = body;

  return NextResponse.json({
    success: true,
    type,
    results: [],
    timestamp: new Date().toISOString(),
    source: 'disabled'
  });
}
