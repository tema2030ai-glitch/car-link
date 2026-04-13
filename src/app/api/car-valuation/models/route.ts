import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Default models for each brand
const defaultModelsByBrand: { [key: string]: { name: string; nameAr?: string; category: string; basePrice?: number }[] } = {
  'Toyota': [
    { name: 'Camry', nameAr: 'كامري', category: 'Sedan', basePrice: 115000 },
    { name: 'Corolla', nameAr: 'كورولا', category: 'Sedan', basePrice: 75000 },
    { name: 'Hilux', nameAr: 'هايلكس', category: 'Pickup', basePrice: 105000 },
    { name: 'Land Cruiser', nameAr: 'لاندكروزر', category: 'SUV', basePrice: 335000 },
    { name: 'RAV4', nameAr: 'راف 4', category: 'SUV', basePrice: 125000 },
    { name: 'Yaris', nameAr: 'ياريس', category: 'Sedan', basePrice: 60000 },
    { name: 'Highlander', nameAr: 'هايلاندر', category: 'SUV', basePrice: 175000 },
    { name: 'Fortuner', nameAr: 'فورتشنر', category: 'SUV', basePrice: 145000 },
    { name: 'Innova', nameAr: 'انوفا', category: 'MPV', basePrice: 110000 },
    { name: 'Prius', nameAr: 'بريوس', category: 'Hatchback', basePrice: 95000 },
    { name: 'Prado', nameAr: 'برادو', category: 'SUV', basePrice: 215000 },
    { name: 'Tacoma', nameAr: 'تاكوما', category: 'Pickup', basePrice: 135000 },
  ],
  'Honda': [
    { name: 'Accord', nameAr: 'أكورد', category: 'Sedan', basePrice: 135000 },
    { name: 'Civic', nameAr: 'سيفيك', category: 'Sedan', basePrice: 85000 },
    { name: 'CR-V', nameAr: 'سي ار في', category: 'SUV', basePrice: 125000 },
    { name: 'Pilot', nameAr: 'بايلوت', category: 'SUV', basePrice: 165000 },
    { name: 'HR-V', nameAr: 'اتش ار في', category: 'SUV', basePrice: 95000 },
    { name: 'City', nameAr: 'سيتي', category: 'Sedan', basePrice: 70000 },
    { name: 'Odyssey', nameAr: 'اوديسي', category: 'MPV', basePrice: 145000 },
    { name: 'Ridgeline', nameAr: 'ريدجلاين', category: 'Pickup', basePrice: 155000 },
  ],
  'Nissan': [
    { name: 'Altima', nameAr: 'التيما', category: 'Sedan', basePrice: 105000 },
    { name: 'Sentra', nameAr: 'سنترا', category: 'Sedan', basePrice: 65000 },
    { name: 'Patrol', nameAr: 'باترول', category: 'SUV', basePrice: 285000 },
    { name: 'X-Trail', nameAr: 'اكس تريل', category: 'SUV', basePrice: 105000 },
    { name: 'Sunny', nameAr: 'صني', category: 'Sedan', basePrice: 55000 },
    { name: 'Maxima', nameAr: 'ماكسيما', category: 'Sedan', basePrice: 145000 },
    { name: 'Kicks', nameAr: 'كيكس', category: 'SUV', basePrice: 85000 },
    { name: 'Murano', nameAr: 'مورانو', category: 'SUV', basePrice: 135000 },
    { name: 'Titan', nameAr: 'تيتان', category: 'Pickup', basePrice: 185000 },
    { name: 'Navara', nameAr: 'نافارا', category: 'Pickup', basePrice: 115000 },
    { name: 'Armada', nameAr: 'ارمادا', category: 'SUV', basePrice: 195000 },
  ],
  'Hyundai': [
    { name: 'Elantra', nameAr: 'النترا', category: 'Sedan', basePrice: 75000 },
    { name: 'Sonata', nameAr: 'سوناتا', category: 'Sedan', basePrice: 105000 },
    { name: 'Tucson', nameAr: 'توسان', category: 'SUV', basePrice: 95000 },
    { name: 'Santa Fe', nameAr: 'سانتافي', category: 'SUV', basePrice: 135000 },
    { name: 'Accent', nameAr: 'اكسنت', category: 'Sedan', basePrice: 55000 },
    { name: 'Kona', nameAr: 'كونا', category: 'SUV', basePrice: 85000 },
    { name: 'Palisade', nameAr: 'باليسيد', category: 'SUV', basePrice: 175000 },
    { name: 'Venue', nameAr: 'فينيوي', category: 'SUV', basePrice: 65000 },
    { name: 'Azera', nameAr: 'ازيرا', category: 'Sedan', basePrice: 135000 },
    { name: 'Ioniq', nameAr: 'ايونيك', category: 'Hatchback', basePrice: 115000 },
  ],
  'Kia': [
    { name: 'Optima', nameAr: 'اوبتيما', category: 'Sedan', basePrice: 95000 },
    { name: 'Cerato', nameAr: 'سيراتو', category: 'Sedan', basePrice: 70000 },
    { name: 'Sportage', nameAr: 'سبورتاج', category: 'SUV', basePrice: 95000 },
    { name: 'Sorento', nameAr: 'سورينتو', category: 'SUV', basePrice: 125000 },
    { name: 'Rio', nameAr: 'ريو', category: 'Sedan', basePrice: 50000 },
    { name: 'K5', nameAr: 'كي 5', category: 'Sedan', basePrice: 105000 },
    { name: 'Seltos', nameAr: 'سيلتوس', category: 'SUV', basePrice: 85000 },
    { name: 'Telluride', nameAr: 'تيلورايد', category: 'SUV', basePrice: 165000 },
    { name: 'Carnival', nameAr: 'كارنيفال', category: 'MPV', basePrice: 135000 },
    { name: 'Stinger', nameAr: 'ستينجر', category: 'Sedan', basePrice: 145000 },
    { name: 'Soul', nameAr: 'سول', category: 'SUV', basePrice: 75000 },
  ],
  'Ford': [
    { name: 'Fusion', nameAr: 'فيوجن', category: 'Sedan', basePrice: 95000 },
    { name: 'Focus', nameAr: 'فوكس', category: 'Sedan', basePrice: 75000 },
    { name: 'Explorer', nameAr: 'اكسبلورر', category: 'SUV', basePrice: 155000 },
    { name: 'Escape', nameAr: 'اسكيب', category: 'SUV', basePrice: 105000 },
    { name: 'Edge', nameAr: 'ايدج', category: 'SUV', basePrice: 135000 },
    { name: 'F-150', nameAr: 'اف 150', category: 'Pickup', basePrice: 155000 },
    { name: 'Mustang', nameAr: 'موستانج', category: 'Coupe', basePrice: 175000 },
    { name: 'Expedition', nameAr: 'اكسبديشن', category: 'SUV', basePrice: 215000 },
    { name: 'Ranger', nameAr: 'رينجر', category: 'Pickup', basePrice: 115000 },
    { name: 'Bronco', nameAr: 'برونكو', category: 'SUV', basePrice: 175000 },
    { name: 'Figo', nameAr: 'فيجو', category: 'Hatchback', basePrice: 45000 },
    { name: 'Taurus', nameAr: 'توروس', category: 'Sedan', basePrice: 115000 },
  ],
  'Chevrolet': [
    { name: 'Malibu', nameAr: 'ماليبو', category: 'Sedan', basePrice: 95000 },
    { name: 'Cruze', nameAr: 'كروز', category: 'Sedan', basePrice: 65000 },
    { name: 'Equinox', nameAr: 'اكوينوكس', category: 'SUV', basePrice: 105000 },
    { name: 'Traverse', nameAr: 'ترافرس', category: 'SUV', basePrice: 135000 },
    { name: 'Tahoe', nameAr: 'تاهو', category: 'SUV', basePrice: 235000 },
    { name: 'Suburban', nameAr: 'سوبربان', category: 'SUV', basePrice: 265000 },
    { name: 'Silverado', nameAr: 'سيلفرادو', category: 'Pickup', basePrice: 165000 },
    { name: 'Camaro', nameAr: 'كمارو', category: 'Coupe', basePrice: 165000 },
    { name: 'Trailblazer', nameAr: 'تريل بليزر', category: 'SUV', basePrice: 115000 },
    { name: 'Trax', nameAr: 'تراكس', category: 'SUV', basePrice: 75000 },
    { name: 'Spark', nameAr: 'سبارك', category: 'Hatchback', basePrice: 45000 },
  ],
  'Mercedes-Benz': [
    { name: 'C-Class', nameAr: 'سي كلاس', category: 'Sedan', basePrice: 225000 },
    { name: 'E-Class', nameAr: 'اي كلاس', category: 'Sedan', basePrice: 295000 },
    { name: 'S-Class', nameAr: 'اس كلاس', category: 'Sedan', basePrice: 495000 },
    { name: 'GLC', nameAr: 'جي ال سي', category: 'SUV', basePrice: 245000 },
    { name: 'GLE', nameAr: 'جي ال اي', category: 'SUV', basePrice: 325000 },
    { name: 'GLS', nameAr: 'جي ال اس', category: 'SUV', basePrice: 425000 },
    { name: 'G-Class', nameAr: 'جي كلاس', category: 'SUV', basePrice: 595000 },
    { name: 'A-Class', nameAr: 'اي كلاس', category: 'Sedan', basePrice: 175000 },
    { name: 'CLA', nameAr: 'سي ال اي', category: 'Coupe', basePrice: 195000 },
    { name: 'AMG GT', nameAr: 'اي ام جي جي تي', category: 'Coupe', basePrice: 595000 },
  ],
  'BMW': [
    { name: '3 Series', nameAr: 'الفئة 3', category: 'Sedan', basePrice: 215000 },
    { name: '5 Series', nameAr: 'الفئة 5', category: 'Sedan', basePrice: 295000 },
    { name: '7 Series', nameAr: 'الفئة 7', category: 'Sedan', basePrice: 495000 },
    { name: 'X3', nameAr: 'اكس 3', category: 'SUV', basePrice: 235000 },
    { name: 'X5', nameAr: 'اكس 5', category: 'SUV', basePrice: 325000 },
    { name: 'X7', nameAr: 'اكس 7', category: 'SUV', basePrice: 435000 },
    { name: 'X6', nameAr: 'اكس 6', category: 'SUV', basePrice: 375000 },
    { name: '4 Series', nameAr: 'الفئة 4', category: 'Coupe', basePrice: 245000 },
    { name: 'M3', nameAr: 'ام 3', category: 'Sedan', basePrice: 395000 },
    { name: 'M5', nameAr: 'ام 5', category: 'Sedan', basePrice: 545000 },
  ],
  'Lexus': [
    { name: 'ES', nameAr: 'اي اس', category: 'Sedan', basePrice: 185000 },
    { name: 'LS', nameAr: 'ال اس', category: 'Sedan', basePrice: 425000 },
    { name: 'RX', nameAr: 'ار اكس', category: 'SUV', basePrice: 235000 },
    { name: 'NX', nameAr: 'ان اكس', category: 'SUV', basePrice: 185000 },
    { name: 'GX', nameAr: 'جي اكس', category: 'SUV', basePrice: 295000 },
    { name: 'LX', nameAr: 'ال اكس', category: 'SUV', basePrice: 495000 },
    { name: 'IS', nameAr: 'اي اس', category: 'Sedan', basePrice: 175000 },
    { name: 'LC', nameAr: 'ال سي', category: 'Coupe', basePrice: 445000 },
    { name: 'RC', nameAr: 'ار سي', category: 'Coupe', basePrice: 245000 },
    { name: 'UX', nameAr: 'يو اكس', category: 'SUV', basePrice: 145000 },
  ],
  'Mazda': [
    { name: 'Mazda 3', nameAr: 'مازدا 3', category: 'Sedan', basePrice: 75000 },
    { name: 'Mazda 6', nameAr: 'مازدا 6', category: 'Sedan', basePrice: 105000 },
    { name: 'CX-3', nameAr: 'سي اكس 3', category: 'SUV', basePrice: 75000 },
    { name: 'CX-5', nameAr: 'سي اكس 5', category: 'SUV', basePrice: 105000 },
    { name: 'CX-9', nameAr: 'سي اكس 9', category: 'SUV', basePrice: 155000 },
    { name: 'CX-30', nameAr: 'سي اكس 30', category: 'SUV', basePrice: 95000 },
    { name: 'MX-5', nameAr: 'ام اكس 5', category: 'Convertible', basePrice: 145000 },
  ],
  'Volkswagen': [
    { name: 'Jetta', nameAr: 'جيتا', category: 'Sedan', basePrice: 85000 },
    { name: 'Passat', nameAr: 'باسات', category: 'Sedan', basePrice: 115000 },
    { name: 'Tiguan', nameAr: 'تيجوان', category: 'SUV', basePrice: 115000 },
    { name: 'Touareg', nameAr: 'تواريغ', category: 'SUV', basePrice: 195000 },
    { name: 'Golf', nameAr: 'جولف', category: 'Hatchback', basePrice: 95000 },
    { name: 'Teramont', nameAr: 'تيرامونت', category: 'SUV', basePrice: 145000 },
    { name: 'T-Cross', nameAr: 'تي كروس', category: 'SUV', basePrice: 85000 },
    { name: 'Polo', nameAr: 'بولو', category: 'Hatchback', basePrice: 65000 },
  ],
  'MG': [
    { name: 'MG5', nameAr: 'ام جي 5', category: 'Sedan', basePrice: 45000 },
    { name: 'MG6', nameAr: 'ام جي 6', category: 'Sedan', basePrice: 65000 },
    { name: 'MG ZS', nameAr: 'ام جي زي اس', category: 'SUV', basePrice: 55000 },
    { name: 'MG RX5', nameAr: 'ام جي ار اكس 5', category: 'SUV', basePrice: 75000 },
    { name: 'MG GT', nameAr: 'ام جي جي تي', category: 'Sedan', basePrice: 55000 },
    { name: 'MG HS', nameAr: 'ام جي اتش اس', category: 'SUV', basePrice: 75000 },
    { name: 'MG One', nameAr: 'ام جي وان', category: 'SUV', basePrice: 65000 },
    { name: 'MG RX8', nameAr: 'ام جي ار اكس 8', category: 'SUV', basePrice: 105000 },
  ],
  'Jeep': [
    { name: 'Wrangler', nameAr: 'رانجلر', category: 'SUV', basePrice: 185000 },
    { name: 'Grand Cherokee', nameAr: 'جراند شيروكي', category: 'SUV', basePrice: 215000 },
    { name: 'Cherokee', nameAr: 'شيروكي', category: 'SUV', basePrice: 145000 },
    { name: 'Compass', nameAr: 'كومباس', category: 'SUV', basePrice: 105000 },
    { name: 'Renegade', nameAr: 'رينيجيد', category: 'SUV', basePrice: 95000 },
    { name: 'Gladiator', nameAr: 'جليديتر', category: 'Pickup', basePrice: 225000 },
  ],
  'Land Rover': [
    { name: 'Range Rover', nameAr: 'رنج روفر', category: 'SUV', basePrice: 645000 },
    { name: 'Range Rover Sport', nameAr: 'رنج روفر سبورت', category: 'SUV', basePrice: 475000 },
    { name: 'Range Rover Velar', nameAr: 'رنج روفر فيلار', category: 'SUV', basePrice: 335000 },
    { name: 'Range Rover Evoque', nameAr: 'رنج روفر ايفوك', category: 'SUV', basePrice: 255000 },
    { name: 'Defender', nameAr: 'ديفندر', category: 'SUV', basePrice: 295000 },
    { name: 'Discovery', nameAr: 'ديسكفري', category: 'SUV', basePrice: 295000 },
    { name: 'Discovery Sport', nameAr: 'ديسكفري سبورت', category: 'SUV', basePrice: 195000 },
  ],
  'Mitsubishi': [
    { name: 'Lancer', nameAr: 'لانسر', category: 'Sedan', basePrice: 55000 },
    { name: 'Attrage', nameAr: 'اتراج', category: 'Sedan', basePrice: 45000 },
    { name: 'Outlander', nameAr: 'اوتلندر', category: 'SUV', basePrice: 85000 },
    { name: 'Pajero', nameAr: 'باجيرو', category: 'SUV', basePrice: 135000 },
    { name: 'ASX', nameAr: 'اي اس اكس', category: 'SUV', basePrice: 75000 },
    { name: 'Eclipse Cross', nameAr: 'اكليبس كروس', category: 'SUV', basePrice: 95000 },
    { name: 'Xpander', nameAr: 'اكسبندر', category: 'MPV', basePrice: 75000 },
  ],
  'Suzuki': [
    { name: 'Swift', nameAr: 'سويفت', category: 'Hatchback', basePrice: 45000 },
    { name: 'Ciaz', nameAr: 'ساز', category: 'Sedan', basePrice: 50000 },
    { name: 'Vitara', nameAr: 'فيتارا', category: 'SUV', basePrice: 75000 },
    { name: 'Jimny', nameAr: 'جيمني', category: 'SUV', basePrice: 85000 },
    { name: 'Dzire', nameAr: 'ديزاير', category: 'Sedan', basePrice: 45000 },
    { name: 'S-Cross', nameAr: 'اس كروس', category: 'SUV', basePrice: 75000 },
  ],
  'GMC': [
    { name: 'Acadia', nameAr: 'اكاديا', category: 'SUV', basePrice: 155000 },
    { name: 'Terrain', nameAr: 'تيرين', category: 'SUV', basePrice: 115000 },
    { name: 'Yukon', nameAr: 'يوكون', category: 'SUV', basePrice: 265000 },
    { name: 'Yukon XL', nameAr: 'يوكون اكس ال', category: 'SUV', basePrice: 295000 },
    { name: 'Sierra', nameAr: 'سييرا', category: 'Pickup', basePrice: 175000 },
    { name: 'Canyon', nameAr: 'كانيون', category: 'Pickup', basePrice: 125000 },
  ],
  'Changan': [
    { name: 'Alsvin', nameAr: 'السفين', category: 'Sedan', basePrice: 45000 },
    { name: 'Raeton', nameAr: 'رايتون', category: 'Sedan', basePrice: 65000 },
    { name: 'CS35 Plus', nameAr: 'سي اس 35 بلس', category: 'SUV', basePrice: 55000 },
    { name: 'CS55', nameAr: 'سي اس 55', category: 'SUV', basePrice: 65000 },
    { name: 'CS75', nameAr: 'سي اس 75', category: 'SUV', basePrice: 75000 },
    { name: 'CS95', nameAr: 'سي اس 95', category: 'SUV', basePrice: 105000 },
    { name: 'Uni-K', nameAr: 'يوني كي', category: 'SUV', basePrice: 115000 },
  ],
  'Haval': [
    { name: 'H2', nameAr: 'اتش 2', category: 'SUV', basePrice: 55000 },
    { name: 'H6', nameAr: 'اتش 6', category: 'SUV', basePrice: 75000 },
    { name: 'H9', nameAr: 'اتش 9', category: 'SUV', basePrice: 115000 },
    { name: 'Jolion', nameAr: 'جوليون', category: 'SUV', basePrice: 65000 },
    { name: 'Tank 300', nameAr: 'تانك 300', category: 'SUV', basePrice: 115000 },
    { name: 'Tank 500', nameAr: 'تانك 500', category: 'SUV', basePrice: 165000 },
  ],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get('brandId');

  if (!brandId) {
    return NextResponse.json({ models: [], error: 'Brand ID is required' });
  }

  try {
    // Try to fetch from database
    const models = await db.carModel.findMany({
      where: { brandId },
      orderBy: { name: 'asc' }
    });

    if (models.length > 0) {
      return NextResponse.json({ models });
    }

    // If no models in database, get brand name and return defaults
    const brand = await db.carBrand.findUnique({
      where: { id: brandId }
    });

    if (brand && defaultModelsByBrand[brand.name]) {
      // Seed models to database
      const modelsToCreate = defaultModelsByBrand[brand.name].map(m => ({
        ...m,
        brandId
      }));

      try {
        // Insert models one by one to avoid duplicates
        for (const modelData of modelsToCreate) {
          await db.carModel.create({
            data: modelData
          });
        }

        const newModels = await db.carModel.findMany({
          where: { brandId },
          orderBy: { name: 'asc' }
        });

        return NextResponse.json({ models: newModels });
      } catch (seedError) {
        // If seeding fails, just return the default data
        console.error('Seed error:', seedError);
      }
    }

    // Fallback to default models
    const brandName = Object.keys(defaultModelsByBrand).find(name => {
      const models = defaultModelsByBrand[name];
      return true; // We'll use brandId to match
    });

    // Map brandId to a brand name if we have defaults
    const brandNameFromId = brandId;
    const defaultModels = defaultModelsByBrand[brandNameFromId] || defaultModelsByBrand['Toyota'];

    return NextResponse.json({
      models: defaultModels.map((m, i) => ({
        id: `${brandId}-${i}`,
        brandId,
        ...m
      }))
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    
    // Return some default models as fallback
    return NextResponse.json({
      models: [
        { id: '1', brandId, name: 'Model S', category: 'Sedan' },
        { id: '2', brandId, name: 'Model X', category: 'SUV' },
        { id: '3', brandId, name: 'Model 3', category: 'Sedan' },
        { id: '4', brandId, name: 'Model Y', category: 'SUV' },
      ]
    });
  }
}
