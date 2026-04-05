import { NextRequest, NextResponse } from 'next/server';

// Demo competitor data based on vehicle segment
function getDemoCompetitors(vehicle: any, language: string) {
  const isArabic = language === 'ar';
  
  // Determine segment based on vehicle data
  const isSedan = !vehicle.bodyType || vehicle.bodyType?.includes('سيدان') || vehicle.bodyType?.includes('Sedan');
  const isSUV = vehicle.bodyType?.includes('SUV') || vehicle.bodyType?.includes('دفع');
  const isLuxury = vehicle.price && vehicle.price > 150000;
  
  const competitors = [];
  const basePrice = vehicle.price || 100000;
  
  if (isSUV) {
    // SUV competitors
    competitors.push({
      brand: isArabic ? 'تويوتا' : 'Toyota',
      model: 'RAV4',
      year: 2024,
      priceRange: { min: 120000, max: 155000 },
      averagePrice: 137000,
      horsepower: 203,
      fuelConsumption: 6.8,
      engine: '2.5L 4-Cylinder',
      transmission: isArabic ? 'أوتوماتيك 8 سرعات' : '8-Speed Automatic',
      keyFeatures: isArabic 
        ? ['تويوتا سيفتي سينس', 'اقتصاد وقود ممتاز', 'موسوقية عالية']
        : ['Toyota Safety Sense', 'Excellent fuel economy', 'High reliability'],
      pros: isArabic 
        ? ['موثوقية ممتازة', 'قيمة بيع جيدة', 'صيانة اقتصادية']
        : ['Excellent reliability', 'Good resale value', 'Economical maintenance'],
      cons: isArabic 
        ? ['أداء متوسط', 'تصميم محافظ']
        : ['Average performance', 'Conservative design'],
      overallRating: 8.5,
      currency: 'SAR',
      priceDifference: basePrice ? 137000 - basePrice : null,
      priceStatus: basePrice < 137000 * 0.9 ? 'cheaper' : basePrice > 137000 * 1.1 ? 'more_expensive' : 'similar',
      valueScore: 8.2
    });
    
    competitors.push({
      brand: isArabic ? 'هيونداي' : 'Hyundai',
      model: 'Tucson',
      year: 2024,
      priceRange: { min: 95000, max: 130000 },
      averagePrice: 112000,
      horsepower: 187,
      fuelConsumption: 7.2,
      engine: '2.0L 4-Cylinder',
      transmission: isArabic ? 'أوتوماتيك 6 سرعات' : '6-Speed Automatic',
      keyFeatures: isArabic 
        ? ['ضمان 5 سنوات', 'تصميم عصري', 'تقنيات متقدمة']
        : ['5-year warranty', 'Modern design', 'Advanced tech'],
      pros: isArabic 
        ? ['قيمة ممتازة', 'ضمان طويل', 'ميزات كثيرة']
        : ['Great value', 'Long warranty', 'Many features'],
      cons: isArabic 
        ? ['قيمة بيع أقل', 'استهلاك وقود أعلى']
        : ['Lower resale value', 'Higher fuel consumption'],
      overallRating: 7.8,
      currency: 'SAR',
      priceDifference: basePrice ? 112000 - basePrice : null,
      priceStatus: basePrice < 112000 * 0.9 ? 'cheaper' : basePrice > 112000 * 1.1 ? 'more_expensive' : 'similar',
      valueScore: 8.0
    });
    
    competitors.push({
      brand: isArabic ? 'نيسان' : 'Nissan',
      model: 'X-Trail',
      year: 2024,
      priceRange: { min: 105000, max: 140000 },
      averagePrice: 122000,
      horsepower: 188,
      fuelConsumption: 7.0,
      engine: '2.5L 4-Cylinder',
      transmission: isArabic ? 'CVT أوتوماتيك' : 'CVT Automatic',
      keyFeatures: isArabic 
        ? ['7 مقاعد متاحة', 'مساحة واسعة', 'نظام أمان شامل']
        : ['7 seats available', 'Spacious interior', 'Comprehensive safety'],
      pros: isArabic 
        ? ['مساحة ركاب ممتازة', 'خيار 7 مقاعد', 'راحة عالية']
        : ['Great passenger space', '7-seat option', 'High comfort'],
      cons: isArabic 
        ? ['محرك هادئ جداً', 'CVT ليس للجميع']
        : ['Engine too quiet', 'CVT not for everyone'],
      overallRating: 7.9,
      currency: 'SAR',
      priceDifference: basePrice ? 122000 - basePrice : null,
      priceStatus: basePrice < 122000 * 0.9 ? 'cheaper' : basePrice > 122000 * 1.1 ? 'more_expensive' : 'similar',
      valueScore: 7.8
    });
    
    competitors.push({
      brand: isArabic ? 'هوندا' : 'Honda',
      model: 'CR-V',
      year: 2024,
      priceRange: { min: 125000, max: 160000 },
      averagePrice: 142000,
      horsepower: 190,
      fuelConsumption: 6.9,
      engine: '1.5L Turbo',
      transmission: isArabic ? 'CVT أوتوماتيك' : 'CVT Automatic',
      keyFeatures: isArabic 
        ? ['هوندا سينسنج', 'جودة عالية', 'مساحة ممتازة']
        : ['Honda Sensing', 'High quality', 'Excellent space'],
      pros: isArabic 
        ? ['جودة تصنيع ممتازة', 'تقنيات أمان متقدمة', 'قيمة بيع جيدة']
        : ['Excellent build quality', 'Advanced safety tech', 'Good resale value'],
      cons: isArabic 
        ? ['سعر أعلى', 'ضمان أقصر']
        : ['Higher price', 'Shorter warranty'],
      overallRating: 8.3,
      currency: 'SAR',
      priceDifference: basePrice ? 142000 - basePrice : null,
      priceStatus: basePrice < 142000 * 0.9 ? 'cheaper' : basePrice > 142000 * 1.1 ? 'more_expensive' : 'similar',
      valueScore: 7.9
    });
    
  } else if (isLuxury) {
    // Luxury sedan competitors
    competitors.push({
      brand: isArabic ? 'مرسيدس' : 'Mercedes-Benz',
      model: 'C200',
      year: 2024,
      priceRange: { min: 180000, max: 220000 },
      averagePrice: 195000,
      horsepower: 204,
      fuelConsumption: 6.5,
      engine: '1.5L Turbo + Mild Hybrid',
      transmission: isArabic ? '9G-TRONIC أوتوماتيك' : '9G-TRONIC Automatic',
      keyFeatures: isArabic 
        ? ['MBUX', 'PRE-SAFE', 'تصميم فاخر']
        : ['MBUX', 'PRE-SAFE', 'Luxury design'],
      pros: isArabic 
        ? ['فخامة ألمانية', 'تقنيات متقدمة', 'قيمة احتفاظ عالية']
        : ['German luxury', 'Advanced tech', 'High retention value'],
      cons: isArabic 
        ? ['صيانة مكلفة', 'قطع غيار غالية']
        : ['Expensive maintenance', 'Costly parts'],
      overallRating: 8.7,
      currency: 'SAR',
      priceDifference: basePrice ? 195000 - basePrice : null,
      priceStatus: basePrice < 195000 * 0.9 ? 'cheaper' : basePrice > 195000 * 1.1 ? 'more_expensive' : 'similar',
      valueScore: 8.0
    });
    
    competitors.push({
      brand: isArabic ? 'بي إم دبليو' : 'BMW',
      model: '320i',
      year: 2024,
      priceRange: { min: 170000, max: 210000 },
      averagePrice: 185000,
      horsepower: 184,
      fuelConsumption: 6.3,
      engine: '2.0L TwinPower Turbo',
      transmission: isArabic ? 'Steptronic 8 سرعات' : '8-Speed Steptronic',
      keyFeatures: isArabic 
        ? ['iDrive 7', 'قيادة رياضية', 'M Sport']
        : ['iDrive 7', 'Sporty drive', 'M Sport'],
      pros: isArabic 
        ? ['قيادة ممتعة', 'تصميم رياضي', 'أداء متميز']
        : ['Fun to drive', 'Sporty design', 'Great performance'],
      cons: isArabic 
        ? ['صيانة مكلفة', 'استهلاك أعلى']
        : ['Expensive maintenance', 'Higher consumption'],
      overallRating: 8.5,
      currency: 'SAR',
      priceDifference: basePrice ? 185000 - basePrice : null,
      priceStatus: basePrice < 185000 * 0.9 ? 'cheaper' : basePrice > 185000 * 1.1 ? 'more_expensive' : 'similar',
      valueScore: 7.9
    });
    
    competitors.push({
      brand: isArabic ? 'أودي' : 'Audi',
      model: 'A4',
      year: 2024,
      priceRange: { min: 175000, max: 215000 },
      averagePrice: 192000,
      horsepower: 190,
      fuelConsumption: 6.4,
      engine: '2.0L TFSI',
      transmission: isArabic ? 'S tronic 7 سرعات' : '7-Speed S tronic',
      keyFeatures: isArabic 
        ? ['Quattro AWD', 'Virtual Cockpit', 'MMI']
        : ['Quattro AWD', 'Virtual Cockpit', 'MMI'],
      pros: isArabic 
        ? ['تصميم أنيق', 'دفع رباعي', 'تقنيات متقدمة']
        : ['Elegant design', 'AWD', 'Advanced tech'],
      cons: isArabic 
        ? ['صيانة مكلفة', 'قيمة بيع أقل']
        : ['Expensive maintenance', 'Lower resale value'],
      overallRating: 8.4,
      currency: 'SAR',
      priceDifference: basePrice ? 192000 - basePrice : null,
      priceStatus: basePrice < 192000 * 0.9 ? 'cheaper' : basePrice > 192000 * 1.1 ? 'more_expensive' : 'similar',
      valueScore: 7.8
    });
    
    competitors.push({
      brand: isArabic ? 'لكزس' : 'Lexus',
      model: 'ES300',
      year: 2024,
      priceRange: { min: 165000, max: 200000 },
      averagePrice: 180000,
      horsepower: 215,
      fuelConsumption: 5.8,
      engine: '2.5L Hybrid',
      transmission: isArabic ? 'CVT أوتوماتيك' : 'CVT Automatic',
      keyFeatures: isArabic 
        ? ['هايبرد', 'موثوقية يابانية', 'راحة فائقة']
        : ['Hybrid', 'Japanese reliability', 'Ultimate comfort'],
      pros: isArabic 
        ? ['موثوقية ممتازة', 'اقتصاد وقود', 'صيانة قليلة']
        : ['Excellent reliability', 'Fuel economy', 'Low maintenance'],
      cons: isArabic 
        ? ['أداء هادئ', 'تصميم محافظ']
        : ['Quiet performance', 'Conservative design'],
      overallRating: 8.6,
      currency: 'SAR',
      priceDifference: basePrice ? 180000 - basePrice : null,
      priceStatus: basePrice < 180000 * 0.9 ? 'cheaper' : basePrice > 180000 * 1.1 ? 'more_expensive' : 'similar',
      valueScore: 8.5
    });
    
  } else {
    // Regular sedan competitors
    competitors.push({
      brand: isArabic ? 'تويوتا' : 'Toyota',
      model: 'Camry',
      year: 2024,
      priceRange: { min: 100000, max: 130000 },
      averagePrice: 115000,
      horsepower: 208,
      fuelConsumption: 4.7,
      engine: '2.5L Hybrid',
      transmission: isArabic ? 'أوتوماتيك 8 سرعات' : '8-Speed Automatic',
      keyFeatures: isArabic 
        ? ['تويوتا سافتي سينس', 'هايبرد', 'موثوقية عالية']
        : ['Toyota Safety Sense', 'Hybrid', 'High reliability'],
      pros: isArabic 
        ? ['موثوقية ممتازة', 'اقتصاد وقود', 'قيمة بيع جيدة']
        : ['Excellent reliability', 'Fuel economy', 'Good resale value'],
      cons: isArabic 
        ? ['تصميم محافظ', 'أداء متوسط']
        : ['Conservative design', 'Average performance'],
      overallRating: 8.5,
      currency: 'SAR',
      priceDifference: basePrice ? 115000 - basePrice : null,
      priceStatus: basePrice < 115000 * 0.9 ? 'cheaper' : basePrice > 115000 * 1.1 ? 'more_expensive' : 'similar',
      valueScore: 8.7
    });
    
    competitors.push({
      brand: isArabic ? 'هوندا' : 'Honda',
      model: 'Accord',
      year: 2024,
      priceRange: { min: 110000, max: 140000 },
      averagePrice: 125000,
      horsepower: 252,
      fuelConsumption: 7.8,
      engine: '2.0L Turbo',
      transmission: isArabic ? 'أوتوماتيك 10 سرعات' : '10-Speed Automatic',
      keyFeatures: isArabic 
        ? ['هوندا سينسنج', 'محرك توربو', 'أداء رياضي']
        : ['Honda Sensing', 'Turbo engine', 'Sporty performance'],
      pros: isArabic 
        ? ['أداء ممتاز', 'تقنيات أمان', 'تصميم أنيق']
        : ['Great performance', 'Safety tech', 'Sleek design'],
      cons: isArabic 
        ? ['استهلاك أعلى', 'قيمة بيع متوسطة']
        : ['Higher consumption', 'Average resale value'],
      overallRating: 8.3,
      currency: 'SAR',
      priceDifference: basePrice ? 125000 - basePrice : null,
      priceStatus: basePrice < 125000 * 0.9 ? 'cheaper' : basePrice > 125000 * 1.1 ? 'more_expensive' : 'similar',
      valueScore: 8.0
    });
    
    competitors.push({
      brand: isArabic ? 'هيونداي' : 'Hyundai',
      model: 'Sonata',
      year: 2024,
      priceRange: { min: 85000, max: 110000 },
      averagePrice: 95000,
      horsepower: 191,
      fuelConsumption: 7.1,
      engine: '2.5L GDI',
      transmission: isArabic ? 'أوتوماتيك 8 سرعات' : '8-Speed Automatic',
      keyFeatures: isArabic 
        ? ['ضمان 5 سنوات', 'تصميم عصري', 'قيمة ممتازة']
        : ['5-year warranty', 'Modern design', 'Great value'],
      pros: isArabic 
        ? ['قيمة ممتازة', 'ضمان طويل', 'ميزات كثيرة']
        : ['Great value', 'Long warranty', 'Many features'],
      cons: isArabic 
        ? ['قيمة بيع أقل', 'جودة متوسطة']
        : ['Lower resale value', 'Average quality'],
      overallRating: 7.8,
      currency: 'SAR',
      priceDifference: basePrice ? 95000 - basePrice : null,
      priceStatus: basePrice < 95000 * 0.9 ? 'cheaper' : basePrice > 95000 * 1.1 ? 'more_expensive' : 'similar',
      valueScore: 8.5
    });
    
    competitors.push({
      brand: isArabic ? 'نيسان' : 'Nissan',
      model: 'Altima',
      year: 2024,
      priceRange: { min: 90000, max: 120000 },
      averagePrice: 105000,
      horsepower: 188,
      fuelConsumption: 6.8,
      engine: '2.5L 4-Cylinder',
      transmission: isArabic ? 'CVT أوتوماتيك' : 'CVT Automatic',
      keyFeatures: isArabic 
        ? ['نيسان بروبايلوت', 'راحة عالية', 'Zero Gravity']
        : ['ProPILOT Assist', 'High comfort', 'Zero Gravity seats'],
      pros: isArabic 
        ? ['راحة ممتازة', 'سعر معقول', 'تقنيات أمان']
        : ['Excellent comfort', 'Reasonable price', 'Safety tech'],
      cons: isArabic 
        ? ['CVT للاستخدام المحدود', 'قيمة بيع أقل']
        : ['Limited CVT use', 'Lower resale value'],
      overallRating: 7.6,
      currency: 'SAR',
      priceDifference: basePrice ? 105000 - basePrice : null,
      priceStatus: basePrice < 105000 * 0.9 ? 'cheaper' : basePrice > 105000 * 1.1 ? 'more_expensive' : 'similar',
      valueScore: 8.2
    });
  }
  
  return competitors;
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

    const isArabic = language === 'ar';
    
    // Get demo competitors
    const competitors = getDemoCompetitors(vehicle, language);
    
    // Determine segment info
    const isSUV = vehicle.bodyType?.includes('SUV') || vehicle.bodyType?.includes('دفع');
    const isLuxury = vehicle.price && vehicle.price > 150000;
    
    let segmentName = isLuxury ? 'Luxury Sedan' : isSUV ? 'Compact SUV' : 'Mid-size Sedan';
    let segmentNameAr = isLuxury ? 'سيدان فاخرة' : isSUV ? 'SUV مدمجة' : 'سيدان متوسطة';

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 600));

    return NextResponse.json({
      success: true,
      currentVehicle: {
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        price: vehicle.price,
        currency: 'SAR',
      },
      segmentInfo: {
        name: segmentName,
        nameAr: segmentNameAr,
        popularIn: ['السعودية', 'الإمارات', 'الكويت']
      },
      competitors,
      recommendation: isArabic 
        ? 'تويوتا كامري توفر أفضل قيمة وموثوقية في هذه الفئة'
        : 'Toyota Camry offers the best value and reliability in this segment',
      searchSources: [
        { title: 'مقارنة سيارات السوق السعودي', url: 'https://example.com' }
      ],
      demoMode: true,
      message: 'الوضع التجريبي - البيانات للعرض فقط'
    });

  } catch (error) {
    console.error('Competitors analysis error:', error);
    return NextResponse.json({ 
      error: 'حدث خطأ في تحليل المنافسين',
      errorEn: 'Competitors analysis error occurred'
    }, { status: 500 });
  }
}
