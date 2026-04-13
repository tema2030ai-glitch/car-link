import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brand, model, year, price, mileage, condition, features } = body;

    const zai = await ZAI.create();

    // Search for reliability and reviews
    const reliabilitySearch = await zai.functions.invoke('web_search', {
      query: `تقييم ${brand || ''} ${model || ''} ${year || ''} موثوقية مشاكل أعطال`,
      num: 8,
      recency_days: 30
    });

    // Search for pros and cons
    const prosConsSearch = await zai.functions.invoke('web_search', {
      query: `مميزات وعيوب ${brand || ''} ${model || ''} ${year || ''} تجربة الملاك`,
      num: 8,
      recency_days: 30
    });

    // Search for maintenance costs
    const maintenanceSearch = await zai.functions.invoke('web_search', {
      query: `تكلفة صيانة ${brand || ''} ${model || ''} قطع غيار أسعار`,
      num: 5,
      recency_days: 30
    });

    // Combine all search results for AI analysis
    const allContext = `
=== تقييم الموثوقية ===
${reliabilitySearch.slice(0, 3).map((r: any) => `${r.name}\n${r.snippet}`).join('\n\n')}

=== المميزات والعيوب ===
${prosConsSearch.slice(0, 3).map((r: any) => `${r.name}\n${r.snippet}`).join('\n\n')}

=== تكاليف الصيانة ===
${maintenanceSearch.slice(0, 2).map((r: any) => `${r.name}\n${r.snippet}`).join('\n\n')}
    `;

    // AI Analysis
    const aiAnalysis = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: `أنت خبير سيارات محترف في السوق السعودي. قم بتحليل السيارة وتقديم تقييم شامل.
يجب أن ترد بتنسيق JSON فقط:
{
  "overallScore": رقم من 1 إلى 10,
  "reliability": {
    "score": رقم من 1 إلى 10,
    "verdict": "تقييم مختصر للموثوقية",
    "commonIssues": ["مشكلة 1", "مشكلة 2"]
  },
  "valueForMoney": {
    "score": رقم من 1 إلى 10,
    "analysis": "تحليل القيمة مقابل السعر"
  },
  "pros": ["ميزة 1", "ميزة 2", "ميزة 3"],
  "cons": ["عيب 1", "عيب 2"],
  "maintenanceCost": {
    "level": "low/medium/high",
    "annualEstimate": "التكلفة السنوية التقريبية",
    "partsAvailability": "متوفر/محدود"
  },
  "resaleValue": {
    "rating": "ممتاز/جيد/متوسط/ضعيف",
    "depreciation": "نسبة التناقص السنوي"
  },
  "suitableFor": ["الاستخدام 1", "الاستخدام 2"],
  "verdict": "التوصية النهائية",
  "saudiClimateRating": "تقييم ملاءمة المناخ السعودي",
  "fuelEfficiency": "تقييم استهلاك الوقود"
}`
        },
        {
          role: 'user',
          content: `قم بتحليل هذه السيارة:
الماركة: ${brand || 'غير محدد'}
الموديل: ${model || 'غير محدد'}
السنة: ${year || 'غير محدد'}
السعر: ${price ? price + ' ريال' : 'غير محدد'}
الممشى: ${mileage ? mileage + ' كم' : 'جديدة'}
الحالة: ${condition || 'جديدة'}
المميزات: ${features?.join(', ') || 'غير محدد'}

معلومات من السوق:
${allContext}`
        }
      ],
      thinking: { type: 'disabled' }
    });

    let analysisData;
    try {
      analysisData = JSON.parse(aiAnalysis.choices[0]?.message?.content || '{}');
    } catch {
      analysisData = {
        overallScore: 7,
        reliability: { score: 7, verdict: 'جيدة', commonIssues: [] },
        valueForMoney: { score: 7, analysis: 'جيدة' },
        pros: ['متوفرة في السوق'],
        cons: ['قد تحتاج صيانة دورية'],
        maintenanceCost: { level: 'medium', annualEstimate: '3000-5000 ريال', partsAvailability: 'متوفر' },
        resaleValue: { rating: 'جيد', depreciation: '15% سنوياً' },
        suitableFor: ['الاستخدام اليومي'],
        verdict: 'خيار جيد',
        saudiClimateRating: 'جيد',
        fuelEfficiency: 'متوسط'
      };
    }

    return NextResponse.json({
      success: true,
      analysis: analysisData,
      sources: {
        reliability: reliabilitySearch.slice(0, 3).map((r: any) => ({
          title: r.name,
          url: r.url
        })),
        reviews: prosConsSearch.slice(0, 3).map((r: any) => ({
          title: r.name,
          url: r.url
        }))
      },
      lastUpdate: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Car Analysis Error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في تحليل السيارة' },
      { status: 500 }
    );
  }
}
