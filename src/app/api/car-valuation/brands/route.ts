import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Popular car brands in Saudi Arabia with their base data
const defaultBrands = [
  { name: 'Toyota', nameAr: 'تويوتا', country: 'Japan', isPopular: true },
  { name: 'Honda', nameAr: 'هوندا', country: 'Japan', isPopular: true },
  { name: 'Nissan', nameAr: 'نيسان', country: 'Japan', isPopular: true },
  { name: 'Hyundai', nameAr: 'هيونداي', country: 'South Korea', isPopular: true },
  { name: 'Kia', nameAr: 'كيا', country: 'South Korea', isPopular: true },
  { name: 'Ford', nameAr: 'فورد', country: 'USA', isPopular: true },
  { name: 'Chevrolet', nameAr: 'شيفروليه', country: 'USA', isPopular: true },
  { name: 'Mercedes-Benz', nameAr: 'مرسيدس بنز', country: 'Germany', isPopular: true },
  { name: 'BMW', nameAr: 'بي ام دبليو', country: 'Germany', isPopular: true },
  { name: 'Lexus', nameAr: 'لكزس', country: 'Japan', isPopular: true },
  { name: 'Mazda', nameAr: 'مازدا', country: 'Japan', isPopular: true },
  { name: 'Volkswagen', nameAr: 'فولكس واجن', country: 'Germany', isPopular: true },
  { name: 'MG', nameAr: 'ام جي', country: 'UK/China', isPopular: true },
  { name: 'Jeep', nameAr: 'جيب', country: 'USA', isPopular: true },
  { name: 'Land Rover', nameAr: 'لاند روفر', country: 'UK', isPopular: true },
  { name: 'Audi', nameAr: 'اودي', country: 'Germany', isPopular: false },
  { name: 'Porsche', nameAr: 'بورش', country: 'Germany', isPopular: false },
  { name: 'Genesis', nameAr: 'جينيسيس', country: 'South Korea', isPopular: false },
  { name: 'Infiniti', nameAr: 'انفينيتي', country: 'Japan', isPopular: false },
  { name: 'Acura', nameAr: 'اكيورا', country: 'Japan', isPopular: false },
  { name: 'Mitsubishi', nameAr: 'ميتسوبيشي', country: 'Japan', isPopular: true },
  { name: 'Suzuki', nameAr: 'سوزوكي', country: 'Japan', isPopular: true },
  { name: 'Isuzu', nameAr: 'ايسوزو', country: 'Japan', isPopular: false },
  { name: 'Peugeot', nameAr: 'بيجو', country: 'France', isPopular: false },
  { name: 'Renault', nameAr: 'رينو', country: 'France', isPopular: false },
  { name: 'GMC', nameAr: 'جي ام سي', country: 'USA', isPopular: true },
  { name: 'Cadillac', nameAr: 'كاديلاك', country: 'USA', isPopular: false },
  { name: 'Lincoln', nameAr: 'لينكولن', country: 'USA', isPopular: false },
  { name: 'Changan', nameAr: 'شانجان', country: 'China', isPopular: true },
  { name: 'Haval', nameAr: 'هافال', country: 'China', isPopular: true },
];

export async function GET() {
  try {
    // Try to fetch from database
    const brands = await db.carBrand.findMany({
      orderBy: [
        { isPopular: 'desc' },
        { name: 'asc' }
      ]
    });

    // If no brands in database, seed with defaults
    if (brands.length === 0) {
      try {
        // Insert brands one by one to avoid duplicates
        for (const brand of defaultBrands) {
          await db.carBrand.create({
            data: brand
          });
        }
      } catch (seedError) {
        // Ignore duplicate errors
        console.log('Some brands may already exist');
      }
      
      // Fetch again after seeding
      const newBrands = await db.carBrand.findMany({
        orderBy: [
          { isPopular: 'desc' },
          { name: 'asc' }
        ]
      });
      
      return NextResponse.json({ brands: newBrands });
    }

    return NextResponse.json({ brands });
  } catch (error) {
    console.error('Error fetching brands:', error);
    
    // Return default brands if database fails
    return NextResponse.json({ 
      brands: defaultBrands.map((b, i) => ({
        id: (i + 1).toString(),
        ...b
      }))
    });
  }
}
