import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// Saudi Bank Financing Offers - Real banks with typical rates
const SAUDI_BANK_OFFERS = [
  {
    id: 'bank_rajhi',
    bankName: 'بنك الراجحي',
    bankNameEn: 'Al Rajhi Bank',
    interestRate: 3.75,
    minDownPayment: 10,
    maxLoanTerm: 60,
    maxLoanAmount: 500000,
    fees: 1000,
    logo: '🏛️',
  },
  {
    id: 'bank_inma',
    bankName: 'بنك الإنماء',
    bankNameEn: 'Alinma Bank',
    interestRate: 4.25,
    minDownPayment: 15,
    maxLoanTerm: 60,
    maxLoanAmount: 400000,
    fees: 500,
    logo: '🏦',
  },
  {
    id: 'bank_snb',
    bankName: 'البنك الأهلي السعودي',
    bankNameEn: 'Saudi National Bank (SNB)',
    interestRate: 4.50,
    minDownPayment: 20,
    maxLoanTerm: 72,
    maxLoanAmount: 750000,
    fees: 1500,
    logo: '🏦',
  },
  {
    id: 'bank_riyad',
    bankName: 'بنك الرياض',
    bankNameEn: 'Riyad Bank',
    interestRate: 4.75,
    minDownPayment: 15,
    maxLoanTerm: 60,
    maxLoanAmount: 500000,
    fees: 750,
    logo: '🏛️',
  },
  {
    id: 'bank_albilad',
    bankName: 'بنك البلاد',
    bankNameEn: 'Bank Albilad',
    interestRate: 4.00,
    minDownPayment: 10,
    maxLoanTerm: 60,
    maxLoanAmount: 300000,
    fees: 500,
    logo: '🏦',
  },
  {
    id: 'bank_anb',
    bankName: 'البنك العربي الوطني',
    bankNameEn: 'Arab National Bank',
    interestRate: 4.35,
    minDownPayment: 20,
    maxLoanTerm: 60,
    maxLoanAmount: 400000,
    fees: 1000,
    logo: '🏛️',
  },
  {
    id: 'bank_sab',
    bankName: 'البنك السعودي الأول',
    bankNameEn: 'Saudi Awwal Bank (SAB)',
    interestRate: 4.60,
    minDownPayment: 15,
    maxLoanTerm: 72,
    maxLoanAmount: 600000,
    fees: 1250,
    logo: '🏦',
  },
  {
    id: 'bank_jazira',
    bankName: 'بنك الجزيرة',
    bankNameEn: 'Bank AlJazira',
    interestRate: 4.15,
    minDownPayment: 15,
    maxLoanTerm: 60,
    maxLoanAmount: 350000,
    fees: 600,
    logo: '🏛️',
  },
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
    const { vehiclePrice, downPayment, downPaymentPercent, loanTerm, interestRate } = await request.json();

    if (!vehiclePrice) {
      return NextResponse.json({ error: 'Vehicle price is required' }, { status: 400 });
    }

    // Calculate down payment amount if percentage is provided
    const downPaymentAmount = downPayment || Math.round(vehiclePrice * (downPaymentPercent || 20) / 100);
    const principal = vehiclePrice - downPaymentAmount;
    const rate = interestRate || 4.5;
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
          reason: 'المبلغ يتجاوز الحد الأقصى للتمويل',
          reasonEn: 'Amount exceeds maximum financing limit',
        };
      }

      const monthlyPayment = calculateMonthlyPayment(bankPrincipal, bank.interestRate, bankTerm);
      const { totalAmount, profitAmount } = calculateTotalWithProfit(bankPrincipal, bank.interestRate, bankTerm);

      return {
        ...bank,
        eligible: true,
        downPaymentRequired: bankDownPayment,
        monthlyPayment,
        totalAmount,
        profitAmount,
        totalCost: totalAmount + bank.fees,
        financingAmount: bankPrincipal,
        principal: bankPrincipal,
      };
    });

    return NextResponse.json({
      success: true,
      currency: 'SAR',
      currencyAr: 'ريال',
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
    currencyAr: 'ريال',
    banks: SAUDI_BANK_OFFERS,
  });
}
