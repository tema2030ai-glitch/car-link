import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brand, category, priceRange, city } = body;

    const zai = await ZAI.create();

    // Search for latest car offers in Saudi market
    const offersSearch = await zai.functions.invoke('web_search', {
      query: 'عروض السيارات السعودية 2025 خصومات تنزيلات',
      num: 15,
      recency_days: 3
    });

    // Search for specific brand offers
    const brandOffersSearch = brand ? await zai.functions.invoke('web_search', {
      query: `عروض ${brand} في السعودية 2025 خصومات`,
      num: 10,
      recency_days: 7
    }) : [];

    // Search for category-specific offers
    const categoryOffersSearch = category ? await zai.functions.invoke('web_search', {
      query: `عروض سيارات ${category} السعودية تنزيلات`,
      num: 10,
      recency_days: 7
    }) : [];

    // Combine all search results
    const allResults = [...offersSearch, ...brandOffersSearch, ...categoryOffersSearch];

    // Use AI to structure the offers
    const contextData = allResults
      .slice(0, 10)
      .map((r: any, i: number) => `${i + 1}. ${r.name}\n${r.snippet}`)
      .join('\n\n');

    const aiAnalysis = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: `أنت خبير سوق سيارات في السعودية. قم بتحليل العروض وتنظيمها.
يجب أن ترد بتنسيق JSON فقط:
{
  "featuredOffers": [
    {
      "title": "عنوان العرض",
      "brand": "الماركة",
      "model": "الموديل",
      "originalPrice": السعر الأصلي,
      "offerPrice": سعر العرض,
      "discount": "نسبة الخصم أو المبلغ",
      "validUntil": "تاريخ انتهاء العرض",
      "dealer": "اسم المعرض أو الوكيل",
      "city": "المدينة",
      "features": ["ميزة 1", "ميزة 2"],
      "isHotDeal": true/false
    }
  ],
  "categories": {
    "sedans": [{"brand": "الماركة", "offer": "العرض"}],
    "suvs": [{"brand": "الماركة", "offer": "العرض"}],
    "electric": [{"brand": "الماركة", "offer": "العرض"}]
  },
  "trendingBrands": ["الماركة 1", "الماركة 2"],
  "bestDeals": {
    "highestDiscount": {"brand": "", "discount": ""},
    "bestValue": {"brand": "", "reason": ""}
  },
  "marketInsights": "تحليل السوق الحالي"
}`
        },
        {
          role: 'user',
          content: `قم بتحليل عروض السيارات في السعودية:
الماركة المطلوبة: ${brand || 'الكل'}
الفئة: ${category || 'الكل'}
نطاق السعر: ${priceRange || 'الكل'}
المدينة: ${city || 'الكل'}

نتائج البحث:
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
        featuredOffers: [],
        categories: { sedans: [], suvs: [], electric: [] },
        trendingBrands: [],
        bestDeals: {},
        marketInsights: 'لا توجد بيانات كافية'
      };
    }

    return NextResponse.json({
      success: true,
      offers: offersData,
      rawResults: allResults.slice(0, 15).map((r: any) => ({
        title: r.name,
        snippet: r.snippet,
        url: r.url,
        date: r.date
      })),
      lastUpdate: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Car Offers Error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في الحصول على عروض السيارات' },
      { status: 500 }
    );
  }
}

// GET for quick offers check
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || 'عروض السيارات السعودية اليوم';

  try {
    const zai = await ZAI.create();

    const searchResults = await zai.functions.invoke('web_search', {
      query,
      num: 10,
      recency_days: 1 // Very recent results
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
