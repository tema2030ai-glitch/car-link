import { NextRequest, NextResponse } from 'next/server';

// Demo market analysis data
function getDemoMarketAnalysis(vehicle: any, language: string) {
  const isArabic = language === 'ar';
  const basePrice = vehicle.price || 100000;
  
  // Calculate realistic market data
  const marketPrice = Math.round(basePrice * (0.9 + Math.random() * 0.2));
  const minPrice = Math.round(marketPrice * 0.85);
  const maxPrice = Math.round(marketPrice * 1.15);
  
  // Determine price status
  let priceStatus = 'average';
  let priceAnalysis = '';
  
  if (vehicle.price) {
    if (vehicle.price < minPrice) {
      priceStatus = 'good';
      priceAnalysis = isArabic 
        ? 'السعر أقل من متوسط السوق - صفقة جيدة!'
        : 'Price is below market average - good deal!';
    } else if (vehicle.price > maxPrice) {
      priceStatus = 'overpriced';
      priceAnalysis = isArabic
        ? 'السعر أعلى من متوسط السوق - قد يكون غالياً'
        : 'Price is above market average - might be overpriced';
    } else {
      priceStatus = 'average';
      priceAnalysis = isArabic
        ? 'السعر ضمن نطاق السوق العادل'
        : 'Price is within fair market range';
    }
  }

  return {
    averageMarketPrice: marketPrice,
    priceRange: {
      min: minPrice,
      max: maxPrice
    },
    priceStatus,
    priceAnalysis,
    marketTrends: isArabic ? [
      'أسعار هذه الفئة مستقرة في السوق السعودي',
      'الطلب متوسط على هذا النوع من السيارات',
      'قيمة البيع متوقعة بعد 3 سنوات: 65-70%'
    ] : [
      'Prices for this segment are stable in Saudi market',
      'Moderate demand for this type of vehicle',
      'Expected resale value after 3 years: 65-70%'
    ],
    reliabilityScore: 7 + Math.floor(Math.random() * 3),
    commonIssues: isArabic ? [
      'تحقق من سجل الصيانة الدورية',
      'افحص نظام التبريد بعد 60,000 كم',
      'راجع حالة الإطارات والفرامل'
    ] : [
      'Check regular maintenance history',
      'Inspect cooling system after 60,000 km',
      'Review tire and brake condition'
    ],
    pros: isArabic ? [
      'مواصفات جيدة للسعر',
      'قطع غيار متوفرة',
      'استهلاك وقود اقتصادي'
    ] : [
      'Good specifications for the price',
      'Available spare parts',
      'Economical fuel consumption'
    ],
    cons: isArabic ? [
      'قد يحتاج صيانة دورية مكلفة',
      'فحص شامل قبل الشراء ضروري'
    ] : [
      'May require expensive periodic maintenance',
      'Full inspection before purchase is essential'
    ],
    alternatives: isArabic ? [
      `${vehicle.brand === 'تويوتا' ? 'هوندا' : 'تويوتا'} - نفس الفئة`,
      'هيونداي - خيار اقتصادي',
      'نيسان - قيمة جيدة'
    ] : [
      `${vehicle.brand === 'Toyota' ? 'Honda' : 'Toyota'} - same class`,
      'Hyundai - economical option',
      'Nissan - good value'
    ],
    recommendation: isArabic
      ? 'سيارة جيدة للشراء بعد الفحص الشامل. السعر عادل مقارنة بالسوق.'
      : 'Good car to buy after full inspection. Price is fair compared to market.'
  };
}

export async function POST(request: NextRequest) {
  try {
    const { vehicle, language = 'ar' } = await request.json();

    if (!vehicle || !vehicle.brand || !vehicle.model) {
      return NextResponse.json({ 
        error: 'معلومات السيارة مطلوبة',
        errorEn: 'Vehicle information is required'
      }, { status: 400 });
    }

    // Generate demo market analysis
    const marketAnalysis = getDemoMarketAnalysis(vehicle, language);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({
      success: true,
      marketAnalysis,
      searchResults: {
        prices: [
          { title: `${vehicle.brand} ${vehicle.model} - موقع سيارات`, url: 'https://example.com', snippet: 'أسعار محدثة' },
          { title: `سعر ${vehicle.brand} ${vehicle.model} في السوق`, url: 'https://example.com', snippet: 'مقارنة أسعار' }
        ],
        reviews: [
          { title: `تقييم ${vehicle.brand} ${vehicle.model}`, url: 'https://example.com', snippet: 'مراجعة شاملة' }
        ]
      },
      demoMode: true,
      message: 'الوضع التجريبي - البيانات للعرض فقط'
    });

  } catch (error) {
    console.error('Market analysis error:', error);
    return NextResponse.json({ 
      error: 'حدث خطأ في تحليل السوق',
      errorEn: 'Market analysis error occurred'
    }, { status: 500 });
  }
}
