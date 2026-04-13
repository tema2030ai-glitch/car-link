import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// Saudi Banks List
const SAUDI_BANKS = [
  'البنك الأهلي السعودي',
  'بنك الراجحي',
  'بنك السعودي الفرنسي',
  'بنك سامبا',
  'البنك الأول',
  'بنك الرياض',
  'البنك العربي الوطني',
  'بنك الجزيرة',
  'بنك الخليج الدولي',
  'البنك السعودي للاستثمار'
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { carPrice, downPayment, loanTerm, salary } = body;

    const zai = await ZAI.create();

    // Search for latest financing offers from Saudi banks
    const financingSearch = await zai.functions.invoke('web_search', {
      query: 'عروض تمويل السيارات البنوك السعودية 2025 أسعار الفائدة',
      num: 15,
      recency_days: 7
    });

    // Search for Islamic financing options
    const islamicSearch = await zai.functions.invoke('web_search', {
      query: 'تمويل السيارات المرابحة الإسلامي البنوك السعودية عروض',
      num: 10,
      recency_days: 7
    });

    // Search for lease-to-own options
    const leaseSearch = await zai.functions.invoke('web_search', {
      query: 'تمويل السيارات الإيجار المنتهي بالتمليك السعودية عروض',
      num: 8,
      recency_days: 14
    });

    // Combine results
    const allResults = [
      ...financingSearch,
      ...islamicSearch,
      ...leaseSearch
    ];

    // AI Analysis of financing offers
    const contextData = allResults
      .slice(0, 8)
      .map((r: any, i: number) => `${i + 1}. ${r.name}\n${r.snippet}`)
      .join('\n\n');

    const aiAnalysis = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: `أنت مستشار تمويل متخصص في السوق السعودي. قم بتحليل عروض التمويل وتقديم توصيات.
يجب أن ترد بتنسيق JSON فقط:
{
  "bestOffers": [
    {
      "bankName": "اسم البنك",
      "programType": "نوع البرنامج (مرابحة/تمليك/تأجير)",
      "profitRate": "نسبة الربح السنوية",
      "monthlyPayment": القسط الشهري التقديري,
      "downPayment": "الدفعة المقدمة المطلوبة",
      "term": "مدة التمويل",
      "features": ["ميزة 1", "ميزة 2"],
      "eligibility": "شروط الأهلية",
      "rating": رقم من 1 إلى 5
    }
  ],
  "marketTrends": {
    "averageProfitRate": "متوسط نسبة الربح",
    "downPaymentTrend": "اتجاه الدفعة المقدمة",
    "competitiveBanks": ["البنك 1", "البنك 2"]
  },
  "recommendations": {
    "bestForLowRate": "أفضل بنك لنسبة ربح منخفضة",
    "bestForFlexibility": "أفضل بنك للمرونة",
    "bestForFastApproval": "أفضل بنك للموافقة السريعة"
  },
  "tips": ["نصيحة 1", "نصيحة 2"]
}`
        },
        {
          role: 'user',
          content: `قم بتحليل عروض تمويل السيارات في السعودية:
سعر السيارة: ${carPrice || 'غير محدد'} ريال
الدفعة المقدمة المتاحة: ${downPayment || 'غير محدد'} ريال
مدة التمويل المفضلة: ${loanTerm || 'غير محدد'} سنة
الراتب الشهري: ${salary || 'غير محدد'} ريال

نتائج البحث عن العروض الحالية:
${contextData}`
        }
      ],
      thinking: { type: 'disabled' }
    });

    let offersData;
    try {
      offersData = JSON.parse(aiAnalysis.choices[0]?.message?.content || '{}');
    } catch {
      offersData = {
        bestOffers: [
          {
            bankName: 'البنك الأهلي',
            programType: 'مرابحة',
            profitRate: '3.5%',
            monthlyPayment: 2000,
            downPayment: '20%',
            term: '5 سنوات',
            features: ['موافقة سريعة', 'تأجيل قسط'],
            eligibility: 'راتب 5000+',
            rating: 4
          }
        ],
        marketTrends: {
          averageProfitRate: '3.5-5%',
          downPaymentTrend: '15-20%',
          competitiveBanks: ['البنك الأهلي', 'الراجحي']
        },
        recommendations: {
          bestForLowRate: 'بنك الراجحي',
          bestForFlexibility: 'البنك الأهلي',
          bestForFastApproval: 'بنك الرياض'
        },
        tips: ['قارن بين البنوك', 'تحقق من الشروط']
      };
    }

    return NextResponse.json({
      success: true,
      offers: offersData,
      searchResults: allResults.slice(0, 10).map((r: any) => ({
        title: r.name,
        snippet: r.snippet,
        url: r.url,
        date: r.date
      })),
      lastUpdate: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Financing Offers Error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في الحصول على عروض التمويل' },
      { status: 500 }
    );
  }
}

// GET for quick offers
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const bank = searchParams.get('bank');

  try {
    const zai = await ZAI.create();

    const query = bank 
      ? `عروض تمويل السيارات ${bank} السعودية 2025`
      : 'عروض تمويل السيارات البنوك السعودية اليوم';

    const searchResults = await zai.functions.invoke('web_search', {
      query,
      num: 10,
      recency_days: 3
    });

    return NextResponse.json({
      success: true,
      results: searchResults.map((r: any) => ({
        title: r.name,
        snippet: r.snippet,
        url: r.url,
        date: r.date
      }))
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في البحث' },
      { status: 500 }
    );
  }
}
