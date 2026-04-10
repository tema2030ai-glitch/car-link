import { NextRequest, NextResponse } from 'next/server';

// Saudi Banks Financing Data 2024-2025 - Updated rates and offers
const SAUDI_BANK_OFFERS = [
  {
    id: 'bank_rajhi',
    bankName: 'بنك الراجحي',
    bankNameEn: 'Al Rajhi Bank',
    interestRate: 2.49,
    minDownPayment: 0,
    maxLoanTerm: 60,
    maxLoanAmount: 1000000,
    fees: 0,
    logo: '🕌',
    color: '#1B5E20',
    features: ['تمويل إسلامي 100%', 'بدون فائدة ربوية', 'موافقة فورية', 'تأجيل قسطين في السنة'],
    featuresEn: ['100% Islamic financing', 'No usury interest', 'Instant approval', 'Defer 2 installments/year'],
    popular: true,
    lastUpdated: '2024-12'
  },
  {
    id: 'bank_snb',
    bankName: 'البنك الأهلي السعودي',
    bankNameEn: 'Saudi National Bank (SNB)',
    interestRate: 2.99,
    minDownPayment: 10,
    maxLoanTerm: 72,
    maxLoanAmount: 1500000,
    fees: 1000,
    logo: '🏦',
    color: '#006341',
    features: ['أكبر بنك في السعودية', 'تأمين مجاني للسيارة', 'برنامج نقاط مكافآت', 'خدمة عملاء 24/7'],
    featuresEn: ['Largest Saudi bank', 'Free car insurance', 'Rewards points program', '24/7 customer service'],
    popular: true,
    lastUpdated: '2024-12'
  },
  {
    id: 'bank_riyad',
    bankName: 'بنك الرياض',
    bankNameEn: 'Riyad Bank',
    interestRate: 2.75,
    minDownPayment: 10,
    maxLoanTerm: 60,
    maxLoanAmount: 800000,
    fees: 750,
    logo: '🏢',
    color: '#00897B',
    features: ['أقل الأقساط الشهرية', 'تأجيل قسطين', 'برنامج هدايا', 'تأمين شامل بخصم'],
    featuresEn: ['Lowest monthly installments', 'Defer 2 installments', 'Gifts program', 'Discounted comprehensive insurance'],
    popular: false,
    lastUpdated: '2024-12'
  },
  {
    id: 'bank_sabb',
    bankName: 'بنك ساب',
    bankNameEn: 'SABB Bank',
    interestRate: 2.99,
    minDownPayment: 15,
    maxLoanTerm: 60,
    maxLoanAmount: 750000,
    fees: 1250,
    logo: '🏛️',
    color: '#1565C0',
    features: ['خدمة VIP', 'برنامج نقاط شريك', 'تأمين شامل', 'أقساط مريحة'],
    featuresEn: ['VIP service', 'Partner points program', 'Comprehensive insurance', 'Easy installments'],
    popular: false,
    lastUpdated: '2024-12'
  },
  {
    id: 'bank_aljazira',
    bankName: 'بنك الجزيرة',
    bankNameEn: 'Bank AlJazira',
    interestRate: 2.85,
    minDownPayment: 10,
    maxLoanTerm: 60,
    maxLoanAmount: 600000,
    fees: 500,
    logo: '🌟',
    color: '#7B1FA2',
    features: ['تمويل إسلامي متوافق', 'عمولة مخفضة', 'مرونة في السداد', 'تأجيل قسط'],
    featuresEn: ['Compliant Islamic financing', 'Reduced commission', 'Payment flexibility', 'Defer 1 installment'],
    popular: false,
    lastUpdated: '2024-12'
  },
  {
    id: 'bank_alinma',
    bankName: 'بنك الإنماء',
    bankNameEn: 'Alinma Bank',
    interestRate: 2.65,
    minDownPayment: 10,
    maxLoanTerm: 60,
    maxLoanAmount: 700000,
    fees: 500,
    logo: '🕋',
    color: '#004D40',
    features: ['تمويل إسلامي', 'سرعة الإنجاز', 'بدون رسوم خفية', 'خدمة متميزة'],
    featuresEn: ['Islamic financing', 'Quick processing', 'No hidden fees', 'Premium service'],
    popular: true,
    lastUpdated: '2024-12'
  },
  {
    id: 'bank_albilad',
    bankName: 'بنك البلاد',
    bankNameEn: 'Bank Albilad',
    interestRate: 2.90,
    minDownPayment: 10,
    maxLoanTerm: 60,
    maxLoanAmount: 500000,
    fees: 350,
    logo: '🏛️',
    color: '#0D47A1',
    features: ['تمويل إسلامي', 'أقل رسوم', 'تأجيل قسطين', 'برنامج مكافآت'],
    featuresEn: ['Islamic financing', 'Lowest fees', 'Defer 2 installments', 'Rewards program'],
    popular: false,
    lastUpdated: '2024-12'
  },
  {
    id: 'bank_anb',
    bankName: 'البنك العربي الوطني',
    bankNameEn: 'Arab National Bank',
    interestRate: 3.15,
    minDownPayment: 15,
    maxLoanTerm: 60,
    maxLoanAmount: 600000,
    fees: 1000,
    logo: '🏦',
    color: '#B71C1C',
    features: ['خدمة شخصية', 'تأمين مفضل', 'برنامج ولاء', 'أقساط مرنة'],
    featuresEn: ['Personal service', 'Preferred insurance', 'Loyalty program', 'Flexible installments'],
    popular: false,
    lastUpdated: '2024-12'
  }
];

function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  months: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  
  const payment = 
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  
  return Math.round(payment * 100) / 100;
}

function calculateTotalWithProfit(
  principal: number,
  annualRate: number,
  months: number
): { totalAmount: number; profitAmount: number } {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, months);
  const totalAmount = monthlyPayment * months;
  const profitAmount = totalAmount - principal;
  
  return {
    totalAmount: Math.round(totalAmount * 100) / 100,
    profitAmount: Math.round(profitAmount * 100) / 100,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { vehiclePrice, downPayment, downPaymentPercent, loanTerm, interestRate, language = 'ar' } = await request.json();

    if (!vehiclePrice) {
      return NextResponse.json({ error: 'Vehicle price is required' }, { status: 400 });
    }

    const isArabic = language === 'ar';

    // Calculate down payment amount if percentage is provided
    const downPaymentAmount = downPayment || Math.round(vehiclePrice * (downPaymentPercent || 20) / 100);
    const principal = vehiclePrice - downPaymentAmount;
    const rate = interestRate || 3.5;
    const term = loanTerm || 60;

    // Calculate main financing
    const monthlyPayment = calculateMonthlyPayment(principal, rate, term);
    const { totalAmount, profitAmount } = calculateTotalWithProfit(principal, rate, term);

    // Calculate offers from all Saudi banks
    const bankOffers = SAUDI_BANK_OFFERS.map(bank => {
      const bankDownPayment = Math.round(vehiclePrice * bank.minDownPayment / 100);
      const bankPrincipal = vehiclePrice - bankDownPayment;
      const bankTerm = Math.min(term, bank.maxLoanTerm);
      
      if (bankPrincipal > bank.maxLoanAmount) {
        return {
          ...bank,
          eligible: false,
          reason: isArabic ? 'المبلغ يتجاوز الحد الأقصى للتمويل' : 'Amount exceeds maximum financing limit',
        };
      }

      const bankMonthlyPayment = calculateMonthlyPayment(bankPrincipal, bank.interestRate, bankTerm);
      const { totalAmount, profitAmount } = calculateTotalWithProfit(bankPrincipal, bank.interestRate, bankTerm);
      const totalProfitRate = ((profitAmount / bankPrincipal) * 100).toFixed(2);

      return {
        ...bank,
        eligible: true,
        downPaymentRequired: bankDownPayment,
        downPaymentPercent: bank.minDownPayment,
        monthlyPayment: bankMonthlyPayment,
        totalAmount,
        profitAmount,
        totalProfitRate,
        totalCost: totalAmount + bank.fees,
        financingAmount: bankPrincipal,
        principal: bankPrincipal,
        loanTerm: bankTerm
      };
    });

    // Sort by monthly payment (lowest first)
    const sortedOffers = bankOffers
      .filter(b => b.eligible)
      .sort((a, b) => a.monthlyPayment - b.monthlyPayment);

    // Get best offer
    const bestOffer = sortedOffers[0];

    // Calculate average market rate
    const avgRate = SAUDI_BANK_OFFERS.reduce((sum, b) => sum + b.interestRate, 0) / SAUDI_BANK_OFFERS.length;

    return NextResponse.json({
      success: true,
      currency: 'SAR',
      currencyAr: 'ريال سعودي',
      calculation: {
        vehiclePrice,
        downPayment: downPaymentAmount,
        downPaymentPercent: ((downPaymentAmount / vehiclePrice) * 100).toFixed(1),
        principal,
        interestRate: rate,
        loanTerm: term,
        monthlyPayment,
        totalAmount,
        profitAmount,
      },
      bankOffers: bankOffers.sort((a, b) => 
        a.eligible && b.eligible ? a.monthlyPayment - b.monthlyPayment : a.eligible ? -1 : 1
      ),
      bestOffer,
      marketStats: {
        averageRate: avgRate.toFixed(2),
        minRate: Math.min(...SAUDI_BANK_OFFERS.map(b => b.interestRate)),
        maxRate: Math.max(...SAUDI_BANK_OFFERS.map(b => b.interestRate)),
        totalBanks: SAUDI_BANK_OFFERS.length
      },
      recommendations: isArabic ? [
        'بنك الراجحي يقدم أفضل الأسعار للتمويل الإسلامي',
        'الدفع المقدم الأعلى يقلل الأقساط الشهرية',
        'قارن العروض واختر الأنسب لميزانيتك'
      ] : [
        'Al Rajhi Bank offers best rates for Islamic financing',
        'Higher down payment reduces monthly installments',
        'Compare offers and choose what fits your budget'
      ],
      lastUpdated: '2024-12-2025',
      dataSource: 'البنوك السعودية الرسمية'
    });

  } catch (error) {
    console.error('Financing calculation error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    currency: 'SAR',
    currencyAr: 'ريال سعودي',
    banks: SAUDI_BANK_OFFERS,
    lastUpdated: '2024-12'
  });
}
