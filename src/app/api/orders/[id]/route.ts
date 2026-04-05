import { NextRequest, NextResponse } from 'next/server';

// Demo orders database with new status types
// Statuses: pending, initial-approval, final-approval, delivery, approved, rejected
const demoOrders = [
  {
    id: 'CL-2024-001',
    status: 'pending',
    carBrand: 'تويوتا',
    carModel: 'كامري',
    carYear: 2024,
    price: 115000,
    currency: 'SAR',
    customerName: 'محمد أحمد',
    program: 'المرابحة',
    bank: 'بنك الراجحي',
    downPayment: 30000,
    monthlyPayment: 1792,
    termMonths: 60,
    profitRate: 3.75,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    timeline: [
      { status: 'submitted', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), label: 'تم التقديم', labelEn: 'Submitted' },
    ]
  },
  {
    id: 'CL-2024-002',
    status: 'initial-approval',
    carBrand: 'هوندا',
    carModel: 'أكورد',
    carYear: 2024,
    price: 125000,
    currency: 'SAR',
    customerName: 'علي محمود',
    program: 'التمويل المنتهي بالتمليك',
    bank: 'بنك الإنماء',
    downPayment: 25000,
    monthlyPayment: 1950,
    termMonths: 60,
    profitRate: 4.25,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    timeline: [
      { status: 'submitted', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), label: 'تم التقديم', labelEn: 'Submitted' },
      { status: 'documents_verified', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), label: 'تم التحقق من المستندات', labelEn: 'Documents Verified' },
      { status: 'initial-approval', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), label: 'الموافقة المبدئية', labelEn: 'Initial Approval' },
    ]
  },
  {
    id: 'CL-2024-003',
    status: 'final-approval',
    carBrand: 'مرسيدس',
    carModel: 'C200',
    carYear: 2024,
    price: 195000,
    currency: 'SAR',
    customerName: 'خالد سعيد',
    program: 'المرابحة',
    bank: 'بنك الرياض',
    downPayment: 40000,
    monthlyPayment: 3200,
    termMonths: 60,
    profitRate: 4.75,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    timeline: [
      { status: 'submitted', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), label: 'تم التقديم', labelEn: 'Submitted' },
      { status: 'documents_verified', date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), label: 'تم التحقق من المستندات', labelEn: 'Documents Verified' },
      { status: 'initial-approval', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), label: 'الموافقة المبدئية', labelEn: 'Initial Approval' },
      { status: 'final-approval', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), label: 'الموافقة النهائية', labelEn: 'Final Approval' },
    ]
  },
  {
    id: 'CL-2024-004',
    status: 'delivery',
    carBrand: 'تويوتا',
    carModel: 'RAV4',
    carYear: 2024,
    price: 135000,
    currency: 'SAR',
    customerName: 'فهد العمري',
    program: 'برنامج التقسيط المباشر',
    bank: 'بنك البلاد',
    downPayment: 35000,
    monthlyPayment: 1920,
    termMonths: 60,
    profitRate: 4.00,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    timeline: [
      { status: 'submitted', date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), label: 'تم التقديم', labelEn: 'Submitted' },
      { status: 'documents_verified', date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), label: 'تم التحقق من المستندات', labelEn: 'Documents Verified' },
      { status: 'initial-approval', date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), label: 'الموافقة المبدئية', labelEn: 'Initial Approval' },
      { status: 'final-approval', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), label: 'الموافقة النهائية', labelEn: 'Final Approval' },
      { status: 'delivery', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), label: 'التوقيع والاستلام', labelEn: 'Signing & Delivery' },
    ]
  },
  {
    id: 'CL-2024-005',
    status: 'rejected',
    carBrand: 'هيونداي',
    carModel: 'سوناتا',
    carYear: 2024,
    price: 95000,
    currency: 'SAR',
    customerName: 'سامي الحربي',
    program: 'التمويل المنتهي بالتمليك',
    bank: 'البنك الأهلي السعودي',
    downPayment: 20000,
    monthlyPayment: 1580,
    termMonths: 48,
    profitRate: 4.50,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    rejectionReason: 'عدم استيفاء شروط الدخل',
    rejectionReasonEn: 'Income requirements not met',
    timeline: [
      { status: 'submitted', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), label: 'تم التقديم', labelEn: 'Submitted' },
      { status: 'documents_verified', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), label: 'تم التحقق من المستندات', labelEn: 'Documents Verified' },
      { status: 'rejected', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), label: 'مرفوض', labelEn: 'Rejected' },
    ]
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = id?.toUpperCase();
    
    // Search for order
    const order = demoOrders.find(o => o.id === orderId);
    
    if (!order) {
      return NextResponse.json({ 
        success: false, 
        error: 'الطلب غير موجود',
        errorEn: 'Order not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      order
    });
    
  } catch (error) {
    console.error('Order lookup error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'حدث خطأ في البحث',
      errorEn: 'Search error occurred'
    }, { status: 500 });
  }
}
