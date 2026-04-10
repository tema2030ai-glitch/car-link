import { NextRequest, NextResponse } from 'next/server';

// Complete vehicle data for image analysis
const vehicleDatabase: Record<string, any> = {
  'camry': { brand: 'تويوتا', brandEn: 'Toyota', model: 'كامري', modelEn: 'Camry', year: 2024, price: 115000, bodyType: 'سيدان', bodyTypeEn: 'Sedan', engine: '2.5L Hybrid', engineCode: 'A25A-FXS', horsepower: 208, torque: 221, acceleration: 7.5, topSpeed: 180, fuelType: 'هايبرد', fuelTypeEn: 'Hybrid', fuelConsumption: 4.7, transmission: 'أوتوماتيك', transmissionEn: 'Automatic', gears: 8, drivetrain: 'FWD', length: 4885, width: 1840, height: 1445, wheelbase: 2825, weight: 1595, groundClearance: 150, seats: 5, doors: 4, trunkCapacity: 524, fuelTankCapacity: 50, wheelSize: 18, tireSize: '235/45 R18', warranty: '5 سنوات / 150,000 كم', warrantyYears: 5, warrantyKm: 150000, country: 'اليابان', countryEn: 'Japan', safetyFeatures: ['Toyota Safety Sense', '6 وسائد هوائية', 'نظام الفرامل ABS', 'التحكم بالثبات'], techFeatures: ['شاشة 9 بوصة', 'Apple CarPlay', 'Android Auto', 'Bluetooth'], comfortFeatures: ['مكيف أوتوماتيك ثنائي', 'مقاعد جلدية', 'تدفئة المقاعد', 'فتحة سقف'], condition: 'new', mileage: 0, color: 'أبيض لؤلؤي', confidence: 95 },
  'sonata': { brand: 'هيونداي', brandEn: 'Hyundai', model: 'سوناتا', modelEn: 'Sonata', year: 2024, price: 95000, bodyType: 'سيدان', bodyTypeEn: 'Sedan', engine: '2.5L Smartstream GDI', engineCode: 'G4SC', horsepower: 191, torque: 245, acceleration: 8.5, topSpeed: 210, fuelType: 'بنزين', fuelTypeEn: 'Gasoline', fuelConsumption: 7.1, transmission: 'أوتوماتيك 8 سرعات', transmissionEn: '8-Speed Automatic', gears: 8, drivetrain: 'FWD', length: 4900, width: 1860, height: 1445, wheelbase: 2840, weight: 1520, groundClearance: 150, seats: 5, doors: 4, trunkCapacity: 510, fuelTankCapacity: 60, wheelSize: 18, tireSize: '235/45 R18', warranty: '5 سنوات / غير محدود', warrantyYears: 5, warrantyKm: 999999, country: 'كوريا الجنوبية', countryEn: 'South Korea', safetyFeatures: ['Hyundai SmartSense', '7 وسائد هوائية', 'نظام الفرامل ABS'], techFeatures: ['شاشة 10.25 بوصة', 'Apple CarPlay', 'Android Auto'], comfortFeatures: ['مكيف أوتوماتيك ثنائي', 'مقاعد جلدية', 'تدفئة المقاعد'], condition: 'new', color: 'أزرق داكن', confidence: 94 },
  'accord': { brand: 'هوندا', brandEn: 'Honda', model: 'أكورد', modelEn: 'Accord', year: 2024, price: 125000, bodyType: 'سيدان', bodyTypeEn: 'Sedan', engine: '2.0L Turbo', engineCode: 'K20C4', horsepower: 252, torque: 370, acceleration: 5.8, topSpeed: 210, fuelType: 'بنزين', fuelTypeEn: 'Gasoline', fuelConsumption: 7.8, transmission: 'أوتوماتيك 10 سرعات', transmissionEn: '10-Speed Automatic', gears: 10, drivetrain: 'FWD', length: 4880, width: 1860, height: 1450, wheelbase: 2830, weight: 1620, groundClearance: 150, seats: 5, doors: 4, trunkCapacity: 473, fuelTankCapacity: 56, wheelSize: 19, tireSize: '235/40 R19', warranty: '5 سنوات / غير محدود', warrantyYears: 5, warrantyKm: 999999, country: 'اليابان', countryEn: 'Japan', safetyFeatures: ['Honda Sensing', '8 وسائد هوائية', 'نظام الفرامل ABS'], techFeatures: ['شاشة 8 بوصة', 'Apple CarPlay', 'Android Auto'], comfortFeatures: ['مكيف أوتوماتيك ثنائي', 'مقاعد جلدية', 'تدفئة المقاعد'], condition: 'new', color: 'أزرق', confidence: 93 },
  'altima': { brand: 'نيسان', brandEn: 'Nissan', model: 'التيما', modelEn: 'Altima', year: 2024, price: 98000, bodyType: 'سيدان', bodyTypeEn: 'Sedan', engine: '2.5L 4-cylinder', engineCode: 'QR25DD', horsepower: 188, torque: 244, acceleration: 8.2, topSpeed: 200, fuelType: 'بنزين', fuelTypeEn: 'Gasoline', fuelConsumption: 6.5, transmission: 'أوتوماتيك CVT', transmissionEn: 'CVT', gears: 7, drivetrain: 'FWD', length: 4900, width: 1850, height: 1440, wheelbase: 2825, weight: 1480, groundClearance: 145, seats: 5, doors: 4, trunkCapacity: 435, fuelTankCapacity: 56, wheelSize: 17, tireSize: '215/55 R17', warranty: '3 سنوات / 100,000 كم', warrantyYears: 3, warrantyKm: 100000, country: 'اليابان', countryEn: 'Japan', safetyFeatures: ['Nissan Safety Shield', '6 وسائد هوائية', 'نظام الفرامل ABS'], techFeatures: ['شاشة 8 بوصة', 'Apple CarPlay', 'Android Auto'], comfortFeatures: ['مكيف أوتوماتيك', 'مقاعد قماشية', 'تدفئة المقاعد'], condition: 'new', color: 'فضي', confidence: 91 },
  'k5': { brand: 'كيا', brandEn: 'Kia', model: 'كي 5', modelEn: 'K5', year: 2024, price: 102000, bodyType: 'سيدان', bodyTypeEn: 'Sedan', engine: '2.5L GDI', engineCode: 'G4SC', horsepower: 180, torque: 232, acceleration: 8.8, topSpeed: 205, fuelType: 'بنزين', fuelTypeEn: 'Gasoline', fuelConsumption: 6.8, transmission: 'أوتوماتيك 8 سرعات', transmissionEn: '8-Speed Automatic', gears: 8, drivetrain: 'FWD', length: 4905, width: 1860, height: 1445, wheelbase: 2850, weight: 1490, groundClearance: 145, seats: 5, doors: 4, trunkCapacity: 475, fuelTankCapacity: 60, wheelSize: 18, tireSize: '235/45 R18', warranty: '5 سنوات / غير محدود', warrantyYears: 5, warrantyKm: 999999, country: 'كوريا الجنوبية', countryEn: 'South Korea', safetyFeatures: ['Kia Drive Wise', '6 وسائد هوائية', 'نظام الفرامل ABS'], techFeatures: ['شاشة 10.25 بوصة', 'Apple CarPlay', 'Android Auto'], comfortFeatures: ['مكيف أوتوماتيك ثنائي', 'مقاعد جلدية', 'تدفئة المقاعد'], condition: 'new', color: 'أسود', confidence: 92 },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;
    
    if (!imageFile) {
      return NextResponse.json({ error: 'Image is required', success: false }, { status: 400 });
    }

    // Get random vehicle from database
    const vehicleKeys = Object.keys(vehicleDatabase);
    const randomKey = vehicleKeys[Math.floor(Math.random() * vehicleKeys.length)];
    const vehicle = { ...vehicleDatabase[randomKey] };

    // Add metadata
    vehicle.id = `img_${Date.now()}`;
    vehicle.source = 'image';
    vehicle.createdAt = new Date().toISOString();
    vehicle.currency = 'SAR';
    vehicle.confidence = 85 + Math.floor(Math.random() * 10);

    return NextResponse.json({
      success: true,
      vehicle,
      demoMode: true,
      message: 'الوضع التجريبي - البيانات للعرض فقط'
    });

  } catch (error) {
    console.error('Image analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed', success: false },
      { status: 500 }
    );
  }
}
