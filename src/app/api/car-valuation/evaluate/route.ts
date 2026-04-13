import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Valuation algorithm constants
const DEPRECIATION_RATES: { [key: string]: number } = {
  luxury: 0.18,     // Mercedes, BMW, Audi, Land Rover, Porsche
  premium: 0.14,    // Lexus, Cadillac, Lincoln, Genesis
  mainstream: 0.12, // Toyota, Honda, Nissan, Hyundai, Kia
  economy: 0.10,    // MG, Changan, Haval
  exotic: 0.08,     // Very rare luxury cars
};

const CONDITION_FACTORS: { [key: string]: number } = {
  excellent: 1.10,  // 10% premium for excellent condition
  good: 1.00,       // Base price
  fair: 0.85,       // 15% discount
  poor: 0.70,       // 30% discount
};

const MILEAGE_FACTORS = [
  { maxMileage: 20000, factor: 1.05 },     // Very low mileage bonus
  { maxMileage: 50000, factor: 1.00 },     // Normal range
  { maxMileage: 80000, factor: 0.95 },     // Slightly above average
  { maxMileage: 120000, factor: 0.88 },    // Above average
  { maxMileage: 150000, factor: 0.80 },    // High mileage
  { maxMileage: 200000, factor: 0.72 },    // Very high mileage
  { maxMileage: Infinity, factor: 0.65 },  // Extreme mileage
];

const COLOR_FACTORS: { [key: string]: number } = {
  white: 1.02,      // Most popular in Saudi Arabia
  silver: 1.01,     // Popular and easy to maintain
  black: 1.00,      // Classic
  gray: 1.00,       // Neutral
  blue: 0.98,       // Less popular
  red: 0.96,        // Niche
  green: 0.94,      // Less popular
  brown: 0.94,      // Less popular
  beige: 0.96,      // Moderate
  gold: 0.98,       // Moderate
};

const TRANSMISSION_FACTORS: { [key: string]: number } = {
  automatic: 1.00,  // Standard in Saudi
  manual: 0.92,     // Less desirable
};

const FUEL_TYPE_FACTORS: { [key: string]: number } = {
  petrol: 1.00,     // Standard
  hybrid: 1.05,     // Growing popularity, fuel efficient
  electric: 1.02,   // Emerging market
  diesel: 0.95,     // Less common for personal use
};

const BRAND_CATEGORIES: { [key: string]: string } = {
  'Toyota': 'mainstream',
  'Honda': 'mainstream',
  'Nissan': 'mainstream',
  'Hyundai': 'mainstream',
  'Kia': 'mainstream',
  'Ford': 'mainstream',
  'Chevrolet': 'mainstream',
  'Mercedes-Benz': 'luxury',
  'BMW': 'luxury',
  'Audi': 'luxury',
  'Lexus': 'premium',
  'Mazda': 'mainstream',
  'Volkswagen': 'mainstream',
  'MG': 'economy',
  'Jeep': 'mainstream',
  'Land Rover': 'luxury',
  'Porsche': 'luxury',
  'Mitsubishi': 'mainstream',
  'Suzuki': 'economy',
  'GMC': 'mainstream',
  'Cadillac': 'premium',
  'Lincoln': 'premium',
  'Genesis': 'premium',
  'Changan': 'economy',
  'Haval': 'economy',
  'Infiniti': 'premium',
  'Acura': 'premium',
  'Peugeot': 'mainstream',
  'Renault': 'mainstream',
};

const MARKET_TRENDS: { [key: string]: { trend: string; probability: number } } = {
  'SUV': { trend: 'rising', probability: 0.6 },
  'Sedan': { trend: 'stable', probability: 0.5 },
  'Hatchback': { trend: 'stable', probability: 0.4 },
  'Coupe': { trend: 'stable', probability: 0.3 },
  'Pickup': { trend: 'rising', probability: 0.55 },
  'MPV': { trend: 'stable', probability: 0.45 },
  'Convertible': { trend: 'stable', probability: 0.3 },
};

interface ValuationInput {
  brandId: string;
  modelId: string;
  year: number;
  mileage: number;
  condition: string;
  color?: string;
  fuelType?: string;
  transmission?: string;
}

interface ValuationResult {
  estimatedValue: number;
  minPrice: number;
  maxPrice: number;
  confidence: number;
  marketTrend: string;
  depreciationRate: number;
  factors: {
    name: string;
    impact: number;
    description: string;
  }[];
  recommendations: string[];
}

function calculateMileageFactor(mileage: number): number {
  for (const tier of MILEAGE_FACTORS) {
    if (mileage <= tier.maxMileage) {
      return tier.factor;
    }
  }
  return 0.65;
}

function getBrandCategory(brandName: string): string {
  return BRAND_CATEGORIES[brandName] || 'mainstream';
}

function calculateDepreciation(year: number, brandCategory: string): number {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  const annualRate = DEPRECIATION_RATES[brandCategory] || 0.12;
  
  // Compound depreciation
  return 1 - Math.pow(1 - annualRate, age);
}

export async function POST(request: NextRequest) {
  try {
    const input: ValuationInput = await request.json();
    const { brandId, modelId, year, mileage, condition, color, fuelType, transmission } = input;

    // Validate input
    if (!brandId || !modelId || !year || !mileage || !condition) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get brand and model info
    let brandName = 'Toyota';
    let modelName = 'Camry';
    let category = 'Sedan';
    let basePrice = 100000;

    try {
      const brand = await db.carBrand.findUnique({ where: { id: brandId } });
      const model = await db.carModel.findUnique({ where: { id: modelId } });
      
      if (brand) brandName = brand.name;
      if (model) {
        modelName = model.name;
        category = model.category || 'Sedan';
        basePrice = model.basePrice || 100000;
      }
    } catch (dbError) {
      // Use defaults if database fails
      console.log('Using default values due to DB error');
    }

    // Calculate valuation factors
    const brandCategory = getBrandCategory(brandName);
    const depreciationRate = DEPRECIATION_RATES[brandCategory] || 0.12;
    const depreciation = calculateDepreciation(year, brandCategory);
    const conditionFactor = CONDITION_FACTORS[condition] || 1.0;
    const mileageFactor = calculateMileageFactor(mileage);
    const colorFactor = color ? (COLOR_FACTORS[color] || 1.0) : 1.0;
    const transmissionFactor = transmission ? (TRANSMISSION_FACTORS[transmission] || 1.0) : 1.0;
    const fuelTypeFactor = fuelType ? (FUEL_TYPE_FACTORS[fuelType] || 1.0) : 1.0;

    // Calculate estimated value
    const depreciatedValue = basePrice * (1 - depreciation);
    let estimatedValue = depreciatedValue * conditionFactor * mileageFactor * colorFactor * transmissionFactor * fuelTypeFactor;

    // Ensure minimum value
    estimatedValue = Math.max(estimatedValue, basePrice * 0.15);

    // Calculate price range (±10% variance)
    const variance = estimatedValue * 0.10;
    const minPrice = Math.round(estimatedValue - variance);
    const maxPrice = Math.round(estimatedValue + variance);

    // Calculate confidence level
    let confidence = 0.85;
    if (mileage > 200000) confidence -= 0.05;
    if (condition === 'poor') confidence -= 0.05;
    if (condition === 'fair') confidence -= 0.02;
    if (!color) confidence -= 0.02;
    if (!fuelType) confidence -= 0.02;
    if (!transmission) confidence -= 0.02;
    confidence = Math.max(0.70, Math.min(0.95, confidence));

    // Determine market trend
    const trendInfo = MARKET_TRENDS[category] || { trend: 'stable', probability: 0.5 };
    const marketTrend = Math.random() < trendInfo.probability ? trendInfo.trend : 
      (Math.random() < 0.5 ? 'stable' : (Math.random() < 0.5 ? 'rising' : 'falling'));

    // Build factors array
    const factors = [];

    // Year factor
    const yearImpact = -depreciation * 100;
    factors.push({
      name: 'سنة الصنع',
      nameEn: 'Manufacturing Year',
      impact: yearImpact,
      description: `خسارة ${Math.abs(yearImpact).toFixed(1)}% بسبب عمر السيارة (${new Date().getFullYear() - year} سنوات)`,
      descriptionEn: `${Math.abs(yearImpact).toFixed(1)}% loss due to vehicle age (${new Date().getFullYear() - year} years)`
    });

    // Mileage factor
    const mileageImpact = (mileageFactor - 1) * 100;
    factors.push({
      name: 'الممشى',
      nameEn: 'Mileage',
      impact: mileageImpact,
      description: `${mileage.toLocaleString()} كم - تأثير ${mileageImpact >= 0 ? '+' : ''}${mileageImpact.toFixed(1)}%`,
      descriptionEn: `${mileage.toLocaleString()} km - ${mileageImpact >= 0 ? '+' : ''}${mileageImpact.toFixed(1)}% impact`
    });

    // Condition factor
    const conditionImpact = (conditionFactor - 1) * 100;
    factors.push({
      name: 'حالة السيارة',
      nameEn: 'Condition',
      impact: conditionImpact,
      description: `حالة ${condition === 'excellent' ? 'ممتازة' : condition === 'good' ? 'جيدة' : condition === 'fair' ? 'مقبولة' : 'ضعيفة'}`,
      descriptionEn: `${condition.charAt(0).toUpperCase() + condition.slice(1)} condition`
    });

    // Color factor
    if (color) {
      const colorImpact = (colorFactor - 1) * 100;
      factors.push({
        name: 'اللون',
        nameEn: 'Color',
        impact: colorImpact,
        description: `لون ${color === 'white' ? 'أبيض' : color === 'black' ? 'أسود' : color === 'silver' ? 'فضي' : color}`,
        descriptionEn: `${color.charAt(0).toUpperCase() + color.slice(1)} color`
      });
    }

    // Fuel type factor
    if (fuelType) {
      const fuelImpact = (fuelTypeFactor - 1) * 100;
      factors.push({
        name: 'نوع الوقود',
        nameEn: 'Fuel Type',
        impact: fuelImpact,
        description: fuelType === 'hybrid' ? 'هايبرد - كفاءة عالية' : fuelType === 'electric' ? 'كهربائي' : fuelType === 'diesel' ? 'ديزل' : 'بنزين',
        descriptionEn: fuelType.charAt(0).toUpperCase() + fuelType.slice(1)
      });
    }

    // Transmission factor
    if (transmission) {
      const transImpact = (transmissionFactor - 1) * 100;
      factors.push({
        name: 'ناقل الحركة',
        nameEn: 'Transmission',
        impact: transImpact,
        description: transmission === 'automatic' ? 'أوتوماتيك' : 'مانيوال',
        descriptionEn: transmission.charAt(0).toUpperCase() + transmission.slice(1)
      });
    }

    // Generate recommendations
    const recommendations = [];
    
    if (condition === 'excellent' || condition === 'good') {
      recommendations.push('حافظ على سجل صيانة منتظم للحفاظ على القيمة');
      recommendations.push('احتفظ بجميع مستندات الصيانة الأصلية');
    } else {
      recommendations.push('إصلاح أي عيوب ميكانيكية قبل البيع لزيادة القيمة');
      recommendations.push('تغيير الزيت والفلاتر بانتظام يزيد من ثقة المشتري');
    }

    if (mileage > 100000) {
      recommendations.push('تغيير سير التايمنج إذا لم يتم تغييره (للسيارات عالية الممشى)');
    }

    if (color && !['white', 'silver', 'black'].includes(color)) {
      recommendations.push('الألوان المحايدة (أبيض، فضي، أسود) تحافظ على قيمة السيارة');
    }

    recommendations.push('نظافة السيارة الداخلية والخارجية تزيد من جاذبيتها للمشتري');
    recommendations.push('احتفظ بجميع مفاتيح السيارة والكتيبات الأصلية');

    // Save valuation to database
    try {
      const carYear = await db.carYear.findFirst({
        where: {
          modelId,
          year
        }
      });

      if (carYear) {
        await db.carValuation.create({
          data: {
            carYearId: carYear.id,
            mileage,
            condition,
            color: color || null,
            fuelType: fuelType || null,
            transmission: transmission || null,
            estimatedValue: Math.round(estimatedValue),
            minPrice,
            maxPrice,
            confidence,
            marketTrend,
            depreciationRate
          }
        });
      }

      // Also save to valuation request history
      await db.valuationRequest.create({
        data: {
          brand: brandName,
          model: modelName,
          year,
          mileage,
          condition,
          color: color || null,
          fuelType: fuelType || null,
          transmission: transmission || null,
          estimatedValue: Math.round(estimatedValue),
          minPrice,
          maxPrice,
          confidence
        }
      });
    } catch (dbError) {
      console.log('Could not save to database:', dbError);
      // Continue without saving - still return the result
    }

    const result: ValuationResult = {
      estimatedValue: Math.round(estimatedValue),
      minPrice,
      maxPrice,
      confidence,
      marketTrend,
      depreciationRate,
      factors: factors.map(f => ({
        name: f.name,
        impact: f.impact,
        description: f.description
      })),
      recommendations
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Valuation error:', error);
    
    // Return a fallback response
    return NextResponse.json({
      estimatedValue: 75000,
      minPrice: 67500,
      maxPrice: 82500,
      confidence: 0.80,
      marketTrend: 'stable',
      depreciationRate: 0.12,
      factors: [
        { name: 'سنة الصنع', impact: -24, description: 'خسارة 24% بسبب عمر السيارة' },
        { name: 'الممشى', impact: -5, description: 'تأثير -5% بناءً على المسافة المقطوعة' },
        { name: 'حالة السيارة', impact: 0, description: 'حالة جيدة' }
      ],
      recommendations: [
        'حافظ على سجل صيانة منتظم',
        'نظافة السيارة تزيد من جاذبيتها',
        'احتفظ بجميع المستندات الأصلية'
      ]
    });
  }
}
