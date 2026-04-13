import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// Saudi Dealers and Showrooms Database
const saudiDealers: Record<string, { name: string; nameAr: string; type: 'agency' | 'showroom'; cities: string[]; phone: string; rating: number }[]> = {
  'تويوتا': [
    { name: 'Toyota Arabia', nameAr: 'تويوتا العربية', type: 'agency', cities: ['الرياض', 'جدة', 'الدمام'], phone: '920000555', rating: 4.8 },
    { name: 'Al Jomaih Automotive', nameAr: 'الجميح للسيارات', type: 'agency', cities: ['الرياض', 'الدمام', 'الأحساء'], phone: '920000222', rating: 4.7 },
    { name: 'Alattieh Motors', nameAr: 'العطية موتورز', type: 'showroom', cities: ['جدة', 'مكة'], phone: '0126000000', rating: 4.5 },
  ],
  'هيونداي': [
    { name: 'Hyundai Arabia', nameAr: 'هيونداي العربية', type: 'agency', cities: ['الرياض', 'جدة', 'الدمام'], phone: '920001555', rating: 4.7 },
    { name: 'Al Majdouie', nameAr: 'المجدوعي', type: 'agency', cities: ['الدمام', 'الخبر', 'الجبيل'], phone: '920000333', rating: 4.6 },
    { name: 'Centennial Motors', nameAr: 'سنتينيال موتورز', type: 'showroom', cities: ['الرياض'], phone: '0114000000', rating: 4.4 },
  ],
  'نيسان': [
    { name: 'Nissan Arabia', nameAr: 'نيسان العربية', type: 'agency', cities: ['الرياض', 'جدة', 'الدمام'], phone: '920002555', rating: 4.6 },
    { name: 'Al Ghassan Motors', nameAr: 'الغسان للسيارات', type: 'showroom', cities: ['جدة', 'الطائف'], phone: '0126500000', rating: 4.5 },
    { name: 'Petrosaudi', nameAr: 'بيترو سعودي', type: 'showroom', cities: ['الرياض', 'الخبر'], phone: '0114500000', rating: 4.3 },
  ],
  'مرسيدس': [
    { name: 'Mercedes-Benz Arabia', nameAr: 'مرسيدس بنز العربية', type: 'agency', cities: ['الرياض', 'جدة'], phone: '920003555', rating: 4.9 },
    { name: 'Juffali Automotive', nameAr: 'جفالي للسيارات', type: 'agency', cities: ['جدة', 'الرياض', 'الدمام'], phone: '920000444', rating: 4.8 },
    { name: 'Elite Motors', nameAr: 'إليت موتورز', type: 'showroom', cities: ['الرياض'], phone: '0115000000', rating: 4.6 },
  ],
  'بي ام دبليو': [
    { name: 'BMW Arabia', nameAr: 'بي ام دبليو العربية', type: 'agency', cities: ['الرياض', 'جدة', 'الدمام'], phone: '920004555', rating: 4.8 },
    { name: 'Al Jammaz', nameAr: 'الجمّاز', type: 'showroom', cities: ['الرياض', 'الدمام'], phone: '0114550000', rating: 4.5 },
    { name: 'Bavarian Auto', nameAr: 'بافاريان أوتو', type: 'showroom', cities: ['جدة'], phone: '0127000000', rating: 4.4 },
  ],
  'لكزس': [
    { name: 'Lexus Arabia', nameAr: 'لكزس العربية', type: 'agency', cities: ['الرياض', 'جدة', 'الدمام'], phone: '920005555', rating: 4.8 },
    { name: 'Al Jomaih Lexus', nameAr: 'الجميح لكزس', type: 'agency', cities: ['الرياض', 'الدمام'], phone: '920000666', rating: 4.7 },
  ],
  'كيا': [
    { name: 'Kia Arabia', nameAr: 'كيا العربية', type: 'agency', cities: ['الرياض', 'جدة', 'الدمام'], phone: '920006555', rating: 4.5 },
    { name: 'Al Mousa Motors', nameAr: 'الموسى موتورز', type: 'showroom', cities: ['الرياض', 'جدة'], phone: '0114600000', rating: 4.3 },
  ],
  'فورد': [
    { name: 'Ford Arabia', nameAr: 'فورد العربية', type: 'agency', cities: ['الرياض', 'جدة', 'الدمام'], phone: '920007555', rating: 4.5 },
    { name: 'Al Jazirah Vehicles', nameAr: 'الجزيرة للمركبات', type: 'agency', cities: ['الرياض', 'القصيم'], phone: '920000777', rating: 4.6 },
  ],
};

// Generate dealers and showrooms for a specific car
function generateDealersAndShowrooms(brand: string, model: string, year: number, condition: string) {
  const dealers = saudiDealers[brand] || [
    { name: 'Auto Mall', nameAr: 'أوتو مول', type: 'showroom' as const, cities: ['الرياض', 'جدة'], phone: '920008555', rating: 4.3 },
    { name: 'Car Souq', nameAr: 'كار سوق', type: 'showroom' as const, cities: ['الرياض'], phone: '0114800000', rating: 4.2 },
    { name: 'Motory Showroom', nameAr: 'موتوري', type: 'showroom' as const, cities: ['جدة', 'الدمام'], phone: '0127500000', rating: 4.1 },
  ];

  return dealers.map(dealer => {
    // Generate price variation based on dealer and condition
    const basePrice = getBrandBasePrice(brand);
    let priceMultiplier = 1;
    
    if (condition === 'new') {
      priceMultiplier = dealer.type === 'agency' ? 1.05 : 0.98; // Agencies slightly higher for new
    } else {
      priceMultiplier = dealer.type === 'showroom' ? 0.95 : 1.0; // Showrooms competitive for used
    }

    const estimatedPrice = Math.round(basePrice * priceMultiplier);

    return {
      id: `dealer_${dealer.name.toLowerCase().replace(/\s/g, '_')}`,
      name: dealer.name,
      nameAr: dealer.nameAr,
      type: dealer.type,
      typeAr: dealer.type === 'agency' ? 'وكيل معتمد' : 'معرض سيارات',
      cities: dealer.cities,
      phone: dealer.phone,
      rating: dealer.rating,
      estimatedPrice: estimatedPrice,
      availability: condition === 'new' ? 'متوفر للحجز' : 'متوفر للفحص',
      features: dealer.type === 'agency' 
        ? ['ضمان الوكيل', 'صيانة معتمدة', 'قطع غيار أصلية']
        : ['أسعار تنافسية', 'تسهيلات دفع', 'ضمان المعرض'],
      workingHours: 'السبت - الخميس: 9 ص - 10 م',
      carDetails: {
        brand: brand,
        model: model,
        year: year,
        condition: condition
      }
    };
  });
}

// Helper function to get brand base price
function getBrandBasePrice(brand: string): number {
  const brandPrices: Record<string, number> = {
    'تويوتا': 120000,
    'هيونداي': 100000,
    'نيسان': 110000,
    'كيا': 95000,
    'مرسيدس': 350000,
    'بي ام دبليو': 300000,
    'لكزس': 250000,
    'انفينيتي': 220000,
    'فورد': 130000,
    'شيفروليه': 110000,
    'هوندا': 110000,
    'مازدا': 100000,
    'فولكس واجن': 120000,
    'أودي': 280000,
    'بورش': 500000,
    'لاند روفر': 400000,
    'جيب': 180000,
    'ميتسوبيشي': 90000,
    'سوزوكي': 70000,
  };
  return brandPrices[brand] || 110000;
}

// Helper function to calculate depreciation
function calculateDepreciation(basePrice: number, year: number, mileage: number, condition: string): number {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  
  // Annual depreciation rate (15-20% per year for most cars)
  let depreciationRate = 0.15;
  
  // Adjust for condition
  if (condition === 'excellent') depreciationRate = 0.12;
  else if (condition === 'good') depreciationRate = 0.15;
  else if (condition === 'fair') depreciationRate = 0.20;
  else if (condition === 'poor') depreciationRate = 0.25;
  
  // Calculate age depreciation
  const ageDepreciation = Math.pow(1 - depreciationRate, age);
  
  // Calculate mileage depreciation (per 10,000 km)
  const mileageDepreciation = Math.max(0.7, 1 - (mileage / 100000) * 0.03);
  
  // Combined depreciation
  const finalPrice = basePrice * ageDepreciation * mileageDepreciation;
  
  return Math.round(finalPrice);
}

// Calculate price range based on car details
function calculatePriceRange(
  brand: string,
  model: string,
  year: number,
  mileage: number,
  condition: string,
  category?: string
) {
  const currentYear = new Date().getFullYear();
  const basePrice = getBrandBasePrice(brand);
  
  // Category adjustments
  let categoryMultiplier = 1;
  if (category?.includes('SUV') || category?.includes('دفع رباعي')) {
    categoryMultiplier = 1.3;
  } else if (category?.includes('Luxury') || category?.includes('فاخرة')) {
    categoryMultiplier = 1.5;
  } else if (category?.includes('Sports') || category?.includes('رياضية')) {
    categoryMultiplier = 1.4;
  } else if (category?.includes('Truck') || category?.includes('شاحنة')) {
    categoryMultiplier = 1.25;
  }
  
  const adjustedBasePrice = basePrice * categoryMultiplier;
  
  if (condition === 'new' || year >= currentYear) {
    // New car pricing
    const newCarPrice = adjustedBasePrice * (1 + (currentYear - year) * 0.03);
    return {
      new: {
        min: Math.round(newCarPrice * 0.9),
        max: Math.round(newCarPrice * 1.1),
        average: Math.round(newCarPrice)
      },
      used: null
    };
  }
  
  // Used car pricing based on condition
  const conditions = ['excellent', 'good', 'fair', 'poor'];
  const conditionIndex = conditions.indexOf(condition) >= 0 ? conditions.indexOf(condition) : 1;
  
  // Calculate prices for different conditions
  const excellentPrice = calculateDepreciation(adjustedBasePrice, year, mileage, 'excellent');
  const goodPrice = calculateDepreciation(adjustedBasePrice, year, mileage, 'good');
  const fairPrice = calculateDepreciation(adjustedBasePrice, year, mileage, 'fair');
  const poorPrice = calculateDepreciation(adjustedBasePrice, year, mileage, 'poor');
  
  // New car price for reference
  const newPrice = adjustedBasePrice * (1 + (currentYear - Math.min(year, currentYear)) * 0.03);
  
  // Select price based on condition
  const usedPrices = [excellentPrice, goodPrice, fairPrice, poorPrice];
  const selectedPrice = usedPrices[conditionIndex];
  
  return {
    new: {
      min: Math.round(newPrice * 0.95),
      max: Math.round(newPrice * 1.05),
      average: Math.round(newPrice)
    },
    used: {
      min: Math.round(selectedPrice * 0.85),
      max: Math.round(selectedPrice * 1.15),
      average: Math.round(selectedPrice),
      byCondition: {
        excellent: Math.round(excellentPrice),
        good: Math.round(goodPrice),
        fair: Math.round(fairPrice),
        poor: Math.round(poorPrice)
      }
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      brand, 
      model, 
      year: yearStr, 
      mileage: mileageStr, 
      condition,
      category 
    } = body;

    console.log('Received valuation request:', { brand, model, yearStr, mileageStr, condition, category });

    const year = parseInt(yearStr) || new Date().getFullYear();
    const mileage = parseInt(mileageStr) || 0;
    const carCondition = condition || 'new';

    console.log('Parsed values:', { year, mileage, carCondition });

    // Calculate local price estimates first (always available as fallback)
    const calculatedPrices = calculatePriceRange(brand || '', model || '', year, mileage, carCondition, category);
    console.log('Calculated prices:', calculatedPrices);

    // Generate dealers and showrooms based on brand
    const dealersAndShowrooms = generateDealersAndShowrooms(brand || '', model || '', year, carCondition);

    let aiPriceData = null;
    let marketTrend = 'stable';
    let priceAnalysis = '';
    let recommendation = '';
    let priceFactors = null;

    try {
      const zai = await ZAI.create();

      // Build specific search queries based on condition
      let searchQuery = '';
      if (carCondition === 'new' || year >= new Date().getFullYear()) {
        searchQuery = `سعر ${brand || ''} ${model || ''} ${year} جديدة في السعودية الوكيل 2025`;
      } else {
        const conditionText = carCondition === 'excellent' ? 'ممتازة' : 
                             carCondition === 'good' ? 'جيدة' : 
                             carCondition === 'fair' ? 'مقبولة' : '';
        searchQuery = `سعر ${brand || ''} ${model || ''} ${year} مستعملة ${conditionText} ${mileage} كم السعودية`;
      }

      console.log('Search query:', searchQuery);

      // Search for actual market prices
      const searchResults = await zai.functions.invoke('web_search', {
        query: searchQuery,
        num: 5,
        recency_days: 7
      });

      console.log('Search results count:', searchResults?.length || 0);

      // Use AI to analyze and validate prices
      const contextData = searchResults && searchResults.length > 0
        ? searchResults.slice(0, 3).map((r: any, i: number) => `${i + 1}. ${r.name}\n${r.snippet}`).join('\n\n')
        : 'لا توجد نتائج بحث متاحة';

      const aiAnalysis = await zai.chat.completions.create({
        messages: [
          {
            role: 'assistant',
            content: `أنت خبير تقييم سيارات في السوق السعودي. قم بتحليل البيانات وتقديم أسعار واقعية.
يجب أن ترد بتنسيق JSON فقط:
{
  "marketPrices": {
    "newCarPrice": سعر السيارة الجديدة,
    "usedPriceRange": {
      "excellent": سعر الحالة الممتازة,
      "good": سعر الحالة الجيدة,
      "fair": سعر الحالة المقبولة,
      "poor": سعر الحالة الضعيفة
    }
  },
  "priceFactors": {
    "depreciation": "نسبة التناقص السنوي",
    "mileageImpact": "تأثير الممشى على السعر",
    "marketDemand": "الطلب في السوق (high/medium/low)"
  },
  "priceAnalysis": "تحليل مختصر للسعر في السوق السعودي",
  "recommendation": "توصية للشراء أو الانتظار",
  "fairPrice": "السعر العادل لهذه السيارة"
}`
          },
          {
            role: 'user',
            content: `قم تقييم سيارة:
الماركة: ${brand || 'غير محدد'}
الموديل: ${model || 'غير محدد'}
السنة: ${year}
الممشى: ${mileage} كم
الحالة: ${carCondition === 'new' ? 'جديدة' : carCondition === 'excellent' ? 'ممتازة' : carCondition === 'good' ? 'جيدة' : carCondition === 'fair' ? 'مقبولة' : 'ضعيفة'}

نتائج البحث من السوق:
${contextData}

الأسعار المحسوبة تقريباً:
${JSON.stringify(calculatedPrices)}`
          }
        ],
        thinking: { type: 'disabled' }
      });

      const aiContent = aiAnalysis.choices[0]?.message?.content || '';
      console.log('AI response:', aiContent.substring(0, 200));
      
      try {
        aiPriceData = JSON.parse(aiContent);
        console.log('Parsed AI data:', aiPriceData);
        
        if (aiPriceData.priceFactors?.marketDemand) {
          marketTrend = aiPriceData.priceFactors.marketDemand === 'high' ? 'rising' : 
                       aiPriceData.priceFactors.marketDemand === 'low' ? 'falling' : 'stable';
        }
        priceAnalysis = aiPriceData.priceAnalysis || '';
        recommendation = aiPriceData.recommendation || '';
        priceFactors = aiPriceData.priceFactors || null;
      } catch (parseError) {
        console.log('Failed to parse AI response, using calculated prices');
      }
    } catch (aiError) {
      console.log('AI search failed, using calculated prices:', aiError);
      // Continue with calculated prices only
    }

    // Calculate fair price
    const fairPrice = aiPriceData?.fairPrice 
      ? parseInt(aiPriceData.fairPrice.toString().replace(/[^0-9]/g, ''))
      : (calculatedPrices.used?.average || calculatedPrices.new?.average || getBrandBasePrice(brand || ''));

    // Merge calculated prices with AI analysis
    const finalPriceData = {
      brand: brand || 'غير محدد',
      model: model || 'غير محدد',
      year: year,
      mileage: mileage,
      condition: carCondition,
      prices: calculatedPrices,
      marketPrices: aiPriceData?.marketPrices || null,
      priceFactors: priceFactors,
      priceAnalysis: priceAnalysis || `تقييم ${brand || ''} ${model || ''} ${year} في السوق السعودي. الأسعار تقديرية وقد تختلف حسب حالة السيارة والسوق.`,
      recommendation: recommendation || (carCondition === 'new' ? 'يُنصح بالتواصل مع الوكيل للحصول على أفضل سعر' : 'يُنصح بفحص السيارة من مركز معتمد قبل الشراء'),
      fairPrice: fairPrice,
      currency: 'SAR',
      marketTrend: marketTrend,
      dealersAndShowrooms: dealersAndShowrooms,
      lastUpdated: new Date().toLocaleDateString('ar-SA')
    };

    console.log('Final price data:', finalPriceData);

    return NextResponse.json({
      success: true,
      data: finalPriceData,
      lastUpdate: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Car Prices Error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في الحصول على أسعار السيارات', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint for quick price check
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const brand = searchParams.get('brand');
  const model = searchParams.get('model');
  const year = parseInt(searchParams.get('year') || '') || new Date().getFullYear();
  const mileage = parseInt(searchParams.get('mileage') || '') || 0;
  const condition = searchParams.get('condition') || 'new';

  try {
    const calculatedPrices = calculatePriceRange(brand || '', model || '', year, mileage, condition);

    return NextResponse.json({
      success: true,
      query: { brand, model, year, mileage, condition },
      prices: calculatedPrices
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الحساب' },
      { status: 500 }
    );
  }
}
