'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { toast } from '@/hooks/use-toast';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

// Icons
import {
  Link, Upload, Image as ImageIcon, Sparkles, Calculator, MessageCircle,
  TrendingUp, Sun, Moon, Zap, Fuel, Gauge, Cog, Shield, Wifi,
  ChevronLeft, ChevronRight, Loader2, CheckCircle2, AlertCircle, DollarSign,
  Calendar, RefreshCw, X, Plus, Send, Bot, User, Globe, Languages, Camera, QrCode,
  Ruler, Users, Box, Award, Car, Palette, Road, CircleDot, DoorOpen, Package, GaugeIcon, LayoutGrid,
  FileText, ClipboardList, Building2, LogIn, LogOut, Settings, Bell, Ticket, MapPin, Phone, Clock,
  Star, ArrowRight, Lightbulb, ShoppingCart, GitCompare, ArrowLeftRight, PartyPopper, Search, Copy,
  Target, Wallet, Percent, Handshake, TrendingDown, PieChart, BarChart3, CreditCard, Landmark,
  CheckCheck, CircleCheck, Timer, Rocket, Crown, Diamond, Gift, Heart, ThumbsUp, Eye
} from 'lucide-react';

// Types
type Language = 'ar' | 'en';

// Car Models by Brand
const carModelsByBrand: Record<string, string[]> = {
  'Toyota': ['Camry', 'Corolla', 'Yaris', 'Land Cruiser', 'Prado', 'Hilux', 'RAV4', 'Highlander', 'Innova', 'Fortuner'],
  'Hyundai': ['Elantra', 'Sonata', 'Accent', 'Tucson', 'Santa Fe', 'Palisade', 'Kona', 'Creta', 'Veloster', 'Ioniq'],
  'Honda': ['Accord', 'Civic', 'City', 'CR-V', 'HR-V', 'Pilot', 'Odyssey', 'Fit', 'BR-V', 'Passport'],
  'Kia': ['Optima', 'K5', 'Rio', 'Sportage', 'Sorento', 'Telluride', 'Seltos', 'Carnival', 'Stinger', 'EV6'],
  'Nissan': ['Altima', 'Sentra', 'Sunny', 'Patrol', 'X-Trail', 'Murano', 'Kicks', 'Navara', 'Titan', 'Juke'],
  'Mazda': ['Mazda3', 'Mazda6', 'CX-3', 'CX-5', 'CX-9', 'CX-30', 'MX-5', 'Mazda2', 'BT-50', 'CX-7'],
  'Ford': ['Fusion', 'Focus', 'Fiesta', 'Explorer', 'Edge', 'Escape', 'F-150', 'Expedition', 'Ranger', 'Bronco'],
  'Chevrolet': ['Malibu', 'Cruze', 'Spark', 'Equinox', 'Traverse', 'Tahoe', 'Suburban', 'Silverado', 'Trailblazer', 'Blazer'],
  'Mercedes': ['C-Class', 'E-Class', 'S-Class', 'A-Class', 'GLC', 'GLE', 'GLS', 'G-Class', 'CLA', 'AMG GT'],
  'BMW': ['3 Series', '5 Series', '7 Series', 'X3', 'X5', 'X7', 'M3', 'M5', 'X6', 'i4'],
  'Lexus': ['ES', 'LS', 'IS', 'RX', 'NX', 'GX', 'LX', 'UX', 'LC', 'RC'],
  'Audi': ['A3', 'A4', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'RS6', 'e-tron']
};

// Saudi Banks Data
const saudiBanks = [
  { id: 'rajhi', nameAr: 'بنك الراجحي', nameEn: 'Al Rajhi Bank', rate: 3.5, minSalary: 3000, logo: '🏦' },
  { id: 'ncb', nameAr: 'البنك الأهلي', nameEn: 'NCB', rate: 3.75, minSalary: 4000, logo: '🏛️' },
  { id: 'riyad', nameAr: 'بنك الرياض', nameEn: 'Riyad Bank', rate: 3.6, minSalary: 3500, logo: '💎' },
  { id: 'samba', nameAr: 'بنك سامبا', nameEn: 'Samba Bank', rate: 3.8, minSalary: 4000, logo: '🔷' },
  { id: 'alinma', nameAr: 'بنك الإنماء', nameEn: 'Alinma Bank', rate: 3.4, minSalary: 3000, logo: '🌟' },
  { id: 'fransi', nameAr: 'البنك السعودي الفرنسي', nameEn: 'Saudi Fransi Bank', rate: 3.65, minSalary: 3500, logo: '🔶' },
];

// Translations
const translations = {
  ar: {
    title: 'Car Link',
    subtitle: 'منصة السيارات الذكية',
    heroTitle: 'منصة السيارات',
    heroHighlight: 'الذكية',
    heroDesc: 'تجربة متكاملة لخدمات السيارات بالذكاء الاصطناعي',
    pasteLink: 'الصق رابط السيارة',
    pasteLinkDesc: 'حلل سيارة من أي موقع',
    analyzing: 'تحليل',
    services: 'الخدمات',
    
    // Services Names
    serviceCalculator: 'الحسبة الذكية',
    serviceTracking: 'تتبع الطلب',
    serviceNewCar: 'طلب سيارة',
    serviceOffers: 'العروض',
    serviceCompare: 'المقارنة',
    serviceValuation: 'التقييم',
    serviceMaintenance: 'الصيانة',
    serviceWarranty: 'الضمان',
    
    // Calculator Service
    calcTitle: 'حاسبة التمويل الذكية',
    calcSubtitle: 'احسب أقساطك بذكاء',
    calcStep1: 'الراتب',
    calcStep2: 'المبلغ',
    calcStep3: 'المدة',
    calcStep4: 'النتيجة',
    salaryQuestion: 'ما هو راتبك الشهري؟',
    salaryHint: 'أدخل راتبك لتحديد قدرتك الشرائية',
    amountQuestion: 'ما سعر السيارة المطلوبة؟',
    amountHint: 'أدخل سعر السيارة التي تريدها',
    termQuestion: 'اختر مدة التمويل',
    termHint: 'اختر المدة المناسبة لك',
    downPayment: 'الدفعة المقدمة',
    monthlyPayment: 'القسط الشهري',
    totalAmount: 'المبلغ الإجمالي',
    profitRate: 'نسبة الربح',
    eligible: 'مؤهل للتمويل',
    notEligible: 'تحتاج دفعة أكبر',
    recommendedCars: 'السيارات المقترحة',
    startOver: 'ابدأ من جديد',
    nextStep: 'التالي',
    prevStep: 'السابق',
    calculate: 'احسب الآن',
    
    // Tracking Service
    trackingTitle: 'تتبع طلبك',
    trackingSubtitle: 'تابع حالة طلبك لحظة بلحظة',
    trackingSearch: 'أدخل رقم الطلب',
    trackingSearchBtn: 'بحث',
    trackingNotFound: 'لم يتم العثور على الطلب',
    trackingStatus: 'الحالة',
    trackingProgress: 'التقدم',
    trackingETA: 'الوقت المتوقع',
    
    // Order Statuses
    statusPending: 'قيد المراجعة',
    statusApproved: 'موافقة مبدئية',
    statusDocuments: 'استكمال المستندات',
    statusFinalApproval: 'الموافقة النهائية',
    statusContract: 'توقيع العقد',
    statusDelivery: 'تسليم السيارة',
    
    // New Car Request
    newCarTitle: 'طلب سيارة جديدة',
    newCarSubtitle: 'اختر سيارتك المفضلة',
    selectBrand: 'اختر الماركة',
    selectModel: 'اختر الموديل',
    selectYear: 'اختر السنة',
    selectColor: 'اختر اللون',
    selectTrim: 'اختر الفئة',
    personalInfo: 'معلوماتك الشخصية',
    fullName: 'الاسم الكامل',
    phone: 'رقم الجوال',
    city: 'المدينة',
    submit: 'إرسال الطلب',
    orderSubmitted: 'تم تقديم طلبك بنجاح!',
    orderNumber: 'رقم الطلب',
    
    // Offers
    offersTitle: 'العروض الخاصة',
    offersSubtitle: 'أفضل عروض السيارات',
    grabOffer: 'احصل على العرض',
    offerEnds: 'ينتهي في',
    limitedOffer: 'عرض محدود',
    
    // Compare
    compareTitle: 'مقارنة السيارات',
    compareSubtitle: 'قارن بين السيارات',
    addCar: 'أضف سيارة',
    removeCar: 'إزالة',
    
    // Valuation
    valuationTitle: 'تقييم سيارتك',
    valuationSubtitle: 'اعرف قيمة سيارتك',
    enterDetails: 'أدخل تفاصيل السيارة',
    estimatedValue: 'القيمة التقديرية',
    
    // Maintenance
    maintenanceTitle: 'جدول الصيانة',
    maintenanceSubtitle: 'حافظ على سيارتك',
    nextService: 'الخدمة القادمة',
    serviceHistory: 'سجل الصيانة',
    
    // Warranty
    warrantyTitle: 'الضمان الممتد',
    warrantySubtitle: 'حماية إضافية لسيارتك',
    warrantyPlans: 'خطط الضمان',
    choosePlan: 'اختر الخطة',
    
    // Common
    year: 'السنة',
    price: 'السعر',
    currency: 'ريال',
    sar: 'ريال سعودي',
    monthly: 'شهرياً',
    years: 'سنوات',
    months: 'شهر',
    loading: 'جاري التحميل...',
    error: 'حدث خطأ',
    success: 'تم بنجاح',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    close: 'إغلاق',
    back: 'رجوع',
    continue: 'متابعة',
    finish: 'إنهاء',
    
    // Quick Actions
    quickActions: 'إجراءات سريعة',
    quickAnalyze: 'تحليل سريع',
    quickCalculate: 'حساب سريع',
    quickTrack: 'تتبع سريع',
    
    language: 'اللغة',
    arabic: 'العربية',
    english: 'English',
  },
  en: {
    title: 'Car Link',
    subtitle: 'Smart Car Platform',
    heroTitle: 'Car Platform',
    heroHighlight: 'Smart',
    heroDesc: 'Complete AI-powered car services experience',
    pasteLink: 'Paste car link',
    pasteLinkDesc: 'Analyze a car from any website',
    analyzing: 'Analyze',
    services: 'Services',
    
    serviceCalculator: 'Smart Calculator',
    serviceTracking: 'Order Tracking',
    serviceNewCar: 'New Car Request',
    serviceOffers: 'Offers',
    serviceCompare: 'Compare',
    serviceValuation: 'Valuation',
    serviceMaintenance: 'Maintenance',
    serviceWarranty: 'Warranty',
    
    calcTitle: 'Smart Finance Calculator',
    calcSubtitle: 'Calculate your payments smartly',
    calcStep1: 'Salary',
    calcStep2: 'Amount',
    calcStep3: 'Term',
    calcStep4: 'Result',
    salaryQuestion: 'What is your monthly salary?',
    salaryHint: 'Enter your salary to determine purchasing power',
    amountQuestion: 'What is the car price you want?',
    amountHint: 'Enter the price of the car you want',
    termQuestion: 'Choose financing term',
    termHint: 'Choose the suitable term for you',
    downPayment: 'Down Payment',
    monthlyPayment: 'Monthly Payment',
    totalAmount: 'Total Amount',
    profitRate: 'Profit Rate',
    eligible: 'Eligible for financing',
    notEligible: 'Need larger down payment',
    recommendedCars: 'Recommended Cars',
    startOver: 'Start Over',
    nextStep: 'Next',
    prevStep: 'Previous',
    calculate: 'Calculate Now',
    
    trackingTitle: 'Track Your Order',
    trackingSubtitle: 'Follow your order status moment by moment',
    trackingSearch: 'Enter order number',
    trackingSearchBtn: 'Search',
    trackingNotFound: 'Order not found',
    trackingStatus: 'Status',
    trackingProgress: 'Progress',
    trackingETA: 'Estimated Time',
    
    statusPending: 'Under Review',
    statusApproved: 'Initial Approval',
    statusDocuments: 'Complete Documents',
    statusFinalApproval: 'Final Approval',
    statusContract: 'Sign Contract',
    statusDelivery: 'Car Delivery',
    
    newCarTitle: 'New Car Request',
    newCarSubtitle: 'Choose your favorite car',
    selectBrand: 'Select Brand',
    selectModel: 'Select Model',
    selectYear: 'Select Year',
    selectColor: 'Select Color',
    selectTrim: 'Select Trim',
    personalInfo: 'Your Personal Information',
    fullName: 'Full Name',
    phone: 'Phone Number',
    city: 'City',
    submit: 'Submit Request',
    orderSubmitted: 'Your request submitted successfully!',
    orderNumber: 'Order Number',
    
    offersTitle: 'Special Offers',
    offersSubtitle: 'Best car offers',
    grabOffer: 'Get Offer',
    offerEnds: 'Ends in',
    limitedOffer: 'Limited Offer',
    
    compareTitle: 'Compare Cars',
    compareSubtitle: 'Compare between cars',
    addCar: 'Add Car',
    removeCar: 'Remove',
    
    valuationTitle: 'Valuate Your Car',
    valuationSubtitle: 'Know your car value',
    enterDetails: 'Enter car details',
    estimatedValue: 'Estimated Value',
    
    maintenanceTitle: 'Maintenance Schedule',
    maintenanceSubtitle: 'Maintain your car',
    nextService: 'Next Service',
    serviceHistory: 'Service History',
    
    warrantyTitle: 'Extended Warranty',
    warrantySubtitle: 'Additional protection for your car',
    warrantyPlans: 'Warranty Plans',
    choosePlan: 'Choose Plan',
    
    year: 'Year',
    price: 'Price',
    currency: 'SAR',
    sar: 'Saudi Riyal',
    monthly: 'Monthly',
    years: 'Years',
    months: 'months',
    loading: 'Loading...',
    error: 'Error occurred',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    back: 'Back',
    continue: 'Continue',
    finish: 'Finish',
    
    quickActions: 'Quick Actions',
    quickAnalyze: 'Quick Analyze',
    quickCalculate: 'Quick Calculate',
    quickTrack: 'Quick Track',
    
    language: 'Language',
    arabic: 'العربية',
    english: 'English',
  },
};

// Service Card Component
interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  icon: any;
  gradient: string;
  onClick: () => void;
  badge?: string;
  isRTL: boolean;
}

const ServiceCard = ({ id, title, description, icon: Icon, gradient, onClick, badge, isRTL }: ServiceCardProps) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="relative cursor-pointer group"
  >
    <div className={`relative overflow-hidden rounded-2xl ${gradient} p-5 transition-all duration-300 shadow-lg hover:shadow-xl`}>
      {badge && (
        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-white">
          {badge}
        </div>
      )}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-white mb-1">{title}</h3>
          <p className="text-sm text-white/80 line-clamp-2">{description}</p>
        </div>
      </div>
      <div className={`absolute bottom-0 ${isRTL ? 'left-0' : 'right-0'} w-24 h-24 bg-white/10 rounded-full -translate-x-1/2 translate-y-1/2`} />
    </div>
  </motion.div>
);

// Animated Progress Steps Component
interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
  isRTL: boolean;
}

const ProgressSteps = ({ steps, currentStep, isRTL }: ProgressStepsProps) => (
  <div className="flex items-center justify-center gap-1 mb-8">
    {steps.map((step, index) => (
      <div key={index} className="flex items-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{
            scale: index === currentStep ? 1.1 : 1,
            backgroundColor: index <= currentStep ? '#0ea5e9' : '#e5e7eb'
          }}
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
            index <= currentStep ? 'text-white' : 'text-gray-400'
          }`}
        >
          {index < currentStep ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            index + 1
          )}
        </motion.div>
        {index < steps.length - 1 && (
          <div className={`w-8 sm:w-16 h-1 rounded transition-all duration-500 ${
            index < currentStep ? 'bg-sky-500' : 'bg-gray-200'
          }`} />
        )}
      </div>
    ))}
  </div>
);

// Main Page Component
export default function CarLinkPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<Language>('ar');
  const t = translations[language];
  const isRTL = language === 'ar';
  
  // Service States
  const [activeService, setActiveService] = useState<string | null>(null);
  const [serviceSheetOpen, setServiceSheetOpen] = useState(false);
  
  // Calculator States
  const [calcStep, setCalcStep] = useState(0);
  const [calcSalary, setCalcSalary] = useState('');
  const [calcAmount, setCalcAmount] = useState('');
  const [calcTerm, setCalcTerm] = useState(5);
  const [calcDownPayment, setCalcDownPayment] = useState(20);
  const [calcResult, setCalcResult] = useState<any>(null);
  
  // Tracking States
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [trackingNotFound, setTrackingNotFound] = useState(false);
  
  // New Car Request States
  const [carRequestStep, setCarRequestStep] = useState(0);
  const [carRequestData, setCarRequestData] = useState({
    brand: '',
    model: '',
    year: '2024',
    color: '',
    trim: '',
    name: '',
    phone: '',
    city: '',
  });
  const [carRequestSubmitted, setCarRequestSubmitted] = useState(false);
  const [carRequestOrderNumber, setCarRequestOrderNumber] = useState('');
  
  // Compare States
  const [compareCars, setCompareCars] = useState<any[]>([]);
  const [compareSearchBrand, setCompareSearchBrand] = useState('');
  const [compareSearchModel, setCompareSearchModel] = useState('');
  
  // Offers Data
  const [offers] = useState([
    { id: 1, brand: 'Toyota', model: 'Camry 2024', oldPrice: 125000, newPrice: 105000, discount: 16, endsIn: '3 أيام', gradient: 'bg-gradient-to-br from-red-500 to-orange-500' },
    { id: 2, brand: 'Hyundai', model: 'Elantra 2024', oldPrice: 85000, newPrice: 72000, discount: 15, endsIn: '5 أيام', gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
    { id: 3, brand: 'Honda', model: 'Accord 2024', oldPrice: 135000, newPrice: 118000, discount: 13, endsIn: '7 أيام', gradient: 'bg-gradient-to-br from-purple-500 to-pink-500' },
    { id: 4, brand: 'Kia', model: 'Sportage 2024', oldPrice: 105000, newPrice: 92000, discount: 12, endsIn: '4 أيام', gradient: 'bg-gradient-to-br from-green-500 to-teal-500' },
  ]);
  
  // Valuation States
  const [valuationBrand, setValuationBrand] = useState('');
  const [valuationModel, setValuationModel] = useState('');
  const [valuationYear, setValuationYear] = useState('2020');
  const [valuationMileage, setValuationMileage] = useState('');
  const [valuationCondition, setValuationCondition] = useState<'excellent' | 'good' | 'fair'>('good');
  const [valuationResult, setValuationResult] = useState<any>(null);
  
  // Maintenance States
  const [maintenanceMileage, setMaintenanceMileage] = useState('');
  const [maintenanceResult, setMaintenanceResult] = useState<any>(null);
  
  // Warranty States
  const [warrantyPlan, setWarrantyPlan] = useState<'basic' | 'premium' | 'ultimate'>('premium');
  const [warrantyCarPrice, setWarrantyCarPrice] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate Financing
  const calculateFinancing = () => {
    const salary = parseInt(calcSalary) || 0;
    const carPrice = parseInt(calcAmount) || 0;
    const downPaymentAmount = carPrice * (calcDownPayment / 100);
    const financedAmount = carPrice - downPaymentAmount;
    const months = calcTerm * 12;
    const rate = 0.045 / 12; // 4.5% annual rate
    
    const monthlyPayment = financedAmount * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    const totalAmount = monthlyPayment * months;
    const profitAmount = totalAmount - financedAmount;
    
    // Check eligibility (monthly payment should not exceed 33% of salary)
    const maxMonthlyPayment = salary * 0.33;
    const isEligible = monthlyPayment <= maxMonthlyPayment;
    
    setCalcResult({
      monthlyPayment: Math.round(monthlyPayment),
      totalAmount: Math.round(totalAmount),
      profitAmount: Math.round(profitAmount),
      downPaymentAmount: Math.round(downPaymentAmount),
      financedAmount: Math.round(financedAmount),
      isEligible,
      maxMonthlyPayment: Math.round(maxMonthlyPayment),
    });
    
    setCalcStep(3);
  };

  // Search Order
  const searchOrder = () => {
    // Simulate order lookup
    if (trackingNumber.length >= 6) {
      const statuses = ['pending', 'approved', 'documents', 'final_approval', 'contract', 'delivery'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const statusIndex = statuses.indexOf(randomStatus);
      
      setTrackingResult({
        number: trackingNumber,
        status: randomStatus,
        progress: Math.round(((statusIndex + 1) / statuses.length) * 100),
        car: 'Toyota Camry 2024',
        bank: 'بنك الراجحي',
        amount: '95,000 ريال',
        monthlyPayment: '2,450 ريال',
        eta: '5-7 أيام عمل',
      });
      setTrackingNotFound(false);
    } else {
      setTrackingResult(null);
      setTrackingNotFound(true);
    }
  };

  // Submit Car Request
  const submitCarRequest = () => {
    const orderNumber = `CL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setCarRequestOrderNumber(orderNumber);
    setCarRequestSubmitted(true);
  };

  // Calculate Valuation
  const calculateValuation = () => {
    const basePrice = 80000;
    const yearDepreciation = (2024 - parseInt(valuationYear)) * 0.08;
    const mileageDepreciation = (parseInt(valuationMileage) || 0) / 100000 * 0.1;
    const conditionMultiplier = valuationCondition === 'excellent' ? 1.1 : valuationCondition === 'good' ? 1 : 0.85;
    
    const estimatedValue = Math.round(basePrice * (1 - yearDepreciation - mileageDepreciation) * conditionMultiplier);
    
    setValuationResult({
      min: Math.round(estimatedValue * 0.9),
      max: Math.round(estimatedValue * 1.1),
      average: estimatedValue,
    });
  };

  // Get Maintenance Schedule
  const getMaintenanceSchedule = () => {
    const mileage = parseInt(maintenanceMileage) || 0;
    const services = [];
    
    if (mileage < 5000) {
      services.push({ name: 'تغيير الزيت', due: '5,000 كم', urgency: 'upcoming' });
    } else if (mileage < 10000) {
      services.push({ name: 'تغيير الزيت والفلتر', due: '10,000 كم', urgency: 'soon' });
    } else {
      services.push({ name: 'صيانة شاملة', due: 'فورية', urgency: 'urgent' });
    }
    
    services.push(
      { name: 'فحص الفرامل', due: `${mileage + 10000} كم`, urgency: 'upcoming' },
      { name: 'تغيير الإطارات', due: `${mileage + 20000} كم`, urgency: 'upcoming' },
      { name: 'فحص البطارية', due: `${mileage + 15000} كم`, urgency: 'upcoming' }
    );
    
    setMaintenanceResult(services);
  };

  // Open Service
  const openService = (serviceId: string) => {
    setActiveService(serviceId);
    setServiceSheetOpen(true);
    // Reset states based on service
    if (serviceId === 'calculator') {
      setCalcStep(0);
      setCalcResult(null);
    } else if (serviceId === 'tracking') {
      setTrackingResult(null);
      setTrackingNotFound(false);
      setTrackingNumber('');
    } else if (serviceId === 'newcar') {
      setCarRequestStep(0);
      setCarRequestSubmitted(false);
      setCarRequestData({ brand: '', model: '', year: '2024', color: '', trim: '', name: '', phone: '', city: '' });
    }
  };

  // Services List
  const services = [
    { id: 'calculator', title: t.serviceCalculator, description: t.calcSubtitle, icon: Calculator, gradient: 'bg-gradient-to-br from-sky-500 to-blue-600' },
    { id: 'tracking', title: t.serviceTracking, description: t.trackingSubtitle, icon: ClipboardList, gradient: 'bg-gradient-to-br from-cyan-500 to-teal-600' },
    { id: 'newcar', title: t.serviceNewCar, description: t.newCarSubtitle, icon: Plus, gradient: 'bg-gradient-to-br from-emerald-500 to-green-600', badge: 'جديد' },
    { id: 'offers', title: t.serviceOffers, description: t.offersSubtitle, icon: Gift, gradient: 'bg-gradient-to-br from-amber-500 to-orange-600', badge: `${offers.length} عروض` },
    { id: 'compare', title: t.serviceCompare, description: t.compareSubtitle, icon: GitCompare, gradient: 'bg-gradient-to-br from-purple-500 to-violet-600' },
    { id: 'valuation', title: t.serviceValuation, description: t.valuationSubtitle, icon: DollarSign, gradient: 'bg-gradient-to-br from-rose-500 to-pink-600' },
    { id: 'maintenance', title: t.serviceMaintenance, description: t.maintenanceSubtitle, icon: Cog, gradient: 'bg-gradient-to-br from-orange-500 to-red-600' },
    { id: 'warranty', title: t.serviceWarranty, description: t.warrantySubtitle, icon: Shield, gradient: 'bg-gradient-to-br from-indigo-500 to-blue-600' },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg"
            >
              <Link className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">{t.title}</h1>
              <p className="text-xs text-muted-foreground">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            >
              <Globe className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {t.heroTitle}{' '}
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              {t.heroHighlight}
            </span>
          </h2>
          <p className="text-muted-foreground">{t.heroDesc}</p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ServiceCard
                id={service.id}
                title={service.title}
                description={service.description}
                icon={service.icon}
                gradient={service.gradient}
                onClick={() => openService(service.id)}
                badge={service.badge}
                isRTL={isRTL}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 bg-white dark:bg-slate-900 rounded-2xl border shadow-sm"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            {t.quickActions}
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2" onClick={() => openService('calculator')}>
              <Calculator className="w-4 h-4" />
              {t.quickCalculate}
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => openService('tracking')}>
              <Eye className="w-4 h-4" />
              {t.quickTrack}
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => openService('offers')}>
              <Gift className="w-4 h-4" />
              {t.offersTitle}
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Service Sheet */}
      <Sheet open={serviceSheetOpen} onOpenChange={setServiceSheetOpen}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl p-0">
          <SheetHeader className="p-6 pb-2">
            <SheetTitle className="text-xl">
              {services.find(s => s.id === activeService)?.title}
            </SheetTitle>
            <SheetDescription>
              {services.find(s => s.id === activeService)?.description}
            </SheetDescription>
          </SheetHeader>
          
          <ScrollArea className="h-[calc(90vh-120px)] px-6 pb-6">
            {/* Calculator Service */}
            {activeService === 'calculator' && (
              <div className="py-4">
                <ProgressSteps 
                  steps={[t.calcStep1, t.calcStep2, t.calcStep3, t.calcStep4]} 
                  currentStep={calcStep}
                  isRTL={isRTL}
                />
                
                <AnimatePresence mode="wait">
                  {calcStep === 0 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Wallet className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{t.salaryQuestion}</h3>
                        <p className="text-sm text-muted-foreground">{t.salaryHint}</p>
                      </div>
                      
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0"
                          value={calcSalary}
                          onChange={(e) => setCalcSalary(e.target.value)}
                          className="text-center text-3xl font-bold h-16 border-2 focus:border-sky-500"
                          dir="ltr"
                        />
                        <span className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground ${isRTL ? 'left-4' : 'right-4'}`}>
                          {t.currency}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2">
                        {[5000, 10000, 15000, 20000].map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            className="h-12"
                            onClick={() => setCalcSalary(amount.toString())}
                          >
                            {amount.toLocaleString()}
                          </Button>
                        ))}
                      </div>
                      
                      <Button
                        className="w-full h-14 text-lg bg-gradient-to-r from-sky-500 to-blue-600"
                        disabled={!calcSalary}
                        onClick={() => setCalcStep(1)}
                      >
                        {t.nextStep}
                        <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                      </Button>
                    </motion.div>
                  )}
                  
                  {calcStep === 1 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Car className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{t.amountQuestion}</h3>
                        <p className="text-sm text-muted-foreground">{t.amountHint}</p>
                      </div>
                      
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0"
                          value={calcAmount}
                          onChange={(e) => setCalcAmount(e.target.value)}
                          className="text-center text-3xl font-bold h-16 border-2 focus:border-emerald-500"
                          dir="ltr"
                        />
                        <span className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground ${isRTL ? 'left-4' : 'right-4'}`}>
                          {t.currency}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <Label>{t.downPayment}</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            value={[calcDownPayment]}
                            onValueChange={([value]) => setCalcDownPayment(value)}
                            min={5}
                            max={50}
                            step={5}
                            className="flex-1"
                          />
                          <Badge variant="secondary" className="text-lg px-4">{calcDownPayment}%</Badge>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 h-14"
                          onClick={() => setCalcStep(0)}
                        >
                          {t.prevStep}
                        </Button>
                        <Button
                          className="flex-1 h-14 text-lg bg-gradient-to-r from-emerald-500 to-green-600"
                          disabled={!calcAmount}
                          onClick={() => setCalcStep(2)}
                        >
                          {t.nextStep}
                          <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                  
                  {calcStep === 2 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Calendar className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{t.termQuestion}</h3>
                        <p className="text-sm text-muted-foreground">{t.termHint}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4, 5, 6].map((year) => (
                          <Button
                            key={year}
                            variant={calcTerm === year ? 'default' : 'outline'}
                            className={`h-16 text-lg ${calcTerm === year ? 'bg-gradient-to-r from-purple-500 to-violet-600' : ''}`}
                            onClick={() => setCalcTerm(year)}
                          >
                            {year} {t.years}
                          </Button>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 h-14"
                          onClick={() => setCalcStep(1)}
                        >
                          {t.prevStep}
                        </Button>
                        <Button
                          className="flex-1 h-14 text-lg bg-gradient-to-r from-purple-500 to-violet-600"
                          onClick={calculateFinancing}
                        >
                          <Sparkles className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          {t.calculate}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                  
                  {calcStep === 3 && calcResult && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      {/* Eligibility Badge */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                        className={`text-center p-6 rounded-2xl ${calcResult.isEligible ? 'bg-gradient-to-br from-emerald-500 to-green-600' : 'bg-gradient-to-br from-amber-500 to-orange-600'}`}
                      >
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                          {calcResult.isEligible ? (
                            <CheckCircle2 className="w-8 h-8 text-white" />
                          ) : (
                            <AlertCircle className="w-8 h-8 text-white" />
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          {calcResult.isEligible ? t.eligible : t.notEligible}
                        </h3>
                      </motion.div>
                      
                      {/* Results Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 bg-muted rounded-xl text-center">
                          <p className="text-sm text-muted-foreground">{t.monthlyPayment}</p>
                          <p className="text-2xl font-bold text-sky-500">
                            {calcResult.monthlyPayment.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">{t.currency}</p>
                        </div>
                        <div className="p-4 bg-muted rounded-xl text-center">
                          <p className="text-sm text-muted-foreground">{t.totalAmount}</p>
                          <p className="text-2xl font-bold text-emerald-500">
                            {calcResult.totalAmount.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">{t.currency}</p>
                        </div>
                        <div className="p-4 bg-muted rounded-xl text-center">
                          <p className="text-sm text-muted-foreground">{t.downPayment}</p>
                          <p className="text-2xl font-bold text-purple-500">
                            {calcResult.downPaymentAmount.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">{t.currency}</p>
                        </div>
                        <div className="p-4 bg-muted rounded-xl text-center">
                          <p className="text-sm text-muted-foreground">{t.profitRate}</p>
                          <p className="text-2xl font-bold text-amber-500">4.5%</p>
                          <p className="text-xs text-muted-foreground">{t.years}</p>
                        </div>
                      </div>
                      
                      {/* Bank Offers */}
                      <div className="space-y-3">
                        <h4 className="font-semibold">{t.recommendedCars}</h4>
                        {saudiBanks.slice(0, 3).map((bank, i) => (
                          <motion.div
                            key={bank.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-3 p-3 bg-muted rounded-xl"
                          >
                            <span className="text-2xl">{bank.logo}</span>
                            <div className="flex-1">
                              <p className="font-medium">{isRTL ? bank.nameAr : bank.nameEn}</p>
                              <p className="text-sm text-muted-foreground">{bank.rate}% {isRTL ? 'سنوياً' : 'annually'}</p>
                            </div>
                            <Badge variant={i === 0 ? 'default' : 'outline'} className={i === 0 ? 'bg-sky-500' : ''}>
                              {i === 0 ? (isRTL ? 'الأفضل' : 'Best') : `${bank.rate}%`}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                      
                      <Button
                        variant="outline"
                        className="w-full h-14"
                        onClick={() => {
                          setCalcStep(0);
                          setCalcSalary('');
                          setCalcAmount('');
                          setCalcResult(null);
                        }}
                      >
                        <RefreshCw className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {t.startOver}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            {/* Tracking Service */}
            {activeService === 'tracking' && (
              <div className="py-4 space-y-6">
                <div className="relative">
                  <Input
                    placeholder={t.trackingSearch}
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="h-14 text-lg pr-24"
                  />
                  <Button
                    className={`absolute top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-teal-600 ${isRTL ? 'left-2' : 'right-2'}`}
                    onClick={searchOrder}
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                </div>
                
                {trackingNotFound && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8 text-muted-foreground"
                  >
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 text-amber-500" />
                    <p>{t.trackingNotFound}</p>
                  </motion.div>
                )}
                
                {trackingResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Progress Ring */}
                    <div className="flex justify-center">
                      <div className="relative w-32 h-32">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="none"
                            className="text-muted"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={`${trackingResult.progress * 3.52} 352`}
                            className="text-sky-500 transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold">{trackingResult.progress}%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Timeline */}
                    <div className="space-y-2">
                      {[
                        { status: 'pending', label: t.statusPending, icon: Loader2 },
                        { status: 'approved', label: t.statusApproved, icon: CheckCircle2 },
                        { status: 'documents', label: t.statusDocuments, icon: FileText },
                        { status: 'final_approval', label: t.statusFinalApproval, icon: Award },
                        { status: 'contract', label: t.statusContract, icon: Calendar },
                        { status: 'delivery', label: t.statusDelivery, icon: Car },
                      ].map((step, index) => {
                        const isActive = step.status === trackingResult.status;
                        const isPast = ['pending', 'approved', 'documents', 'final_approval', 'contract', 'delivery'].indexOf(trackingResult.status) > index;
                        
                        return (
                          <motion.div
                            key={step.status}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                              isActive ? 'bg-sky-500/10 border border-sky-500/30' : 
                              isPast ? 'bg-emerald-500/5' : 'bg-muted/50'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isActive ? 'bg-sky-500 text-white' : 
                              isPast ? 'bg-emerald-500 text-white' : 'bg-muted'
                            }`}>
                              {isActive ? <Loader2 className="w-5 h-5 animate-spin" /> : <step.icon className="w-5 h-5" />}
                            </div>
                            <span className={isActive ? 'font-medium' : isPast ? 'text-emerald-600' : 'text-muted-foreground'}>
                              {step.label}
                            </span>
                            {isActive && (
                              <Badge className="ml-auto bg-sky-500">
                                {isRTL ? 'الحالي' : 'Current'}
                              </Badge>
                            )}
                            {isPast && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto" />
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                    
                    {/* Order Details */}
                    <div className="p-4 bg-muted rounded-xl space-y-2">
                      <h4 className="font-semibold mb-3">{isRTL ? 'تفاصيل الطلب' : 'Order Details'}</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-muted-foreground">{isRTL ? 'السيارة' : 'Car'}</p>
                        <p className="font-medium">{trackingResult.car}</p>
                        <p className="text-muted-foreground">{isRTL ? 'البنك' : 'Bank'}</p>
                        <p className="font-medium">{trackingResult.bank}</p>
                        <p className="text-muted-foreground">{isRTL ? 'المبلغ' : 'Amount'}</p>
                        <p className="font-medium">{trackingResult.amount}</p>
                        <p className="text-muted-foreground">{isRTL ? 'القسط' : 'Payment'}</p>
                        <p className="font-medium">{trackingResult.monthlyPayment}</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-sky-500/10 border border-sky-500/30 rounded-xl text-center">
                      <Timer className="w-8 h-8 text-sky-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">{t.trackingETA}</p>
                      <p className="font-bold text-sky-500">{trackingResult.eta}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
            
            {/* New Car Request Service */}
            {activeService === 'newcar' && (
              <div className="py-4">
                {carRequestSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-6"
                    >
                      <PartyPopper className="w-12 h-12 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">{t.orderSubmitted}</h3>
                    <p className="text-muted-foreground mb-4">{t.orderNumber}:</p>
                    <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
                      <span className="text-xl font-mono font-bold">{carRequestOrderNumber}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <ProgressSteps 
                      steps={[isRTL ? 'السيارة' : 'Car', isRTL ? 'المواصفات' : 'Specs', isRTL ? 'بياناتك' : 'Info', isRTL ? 'التأكيد' : 'Confirm']} 
                      currentStep={carRequestStep}
                      isRTL={isRTL}
                    />
                    
                    <AnimatePresence mode="wait">
                      {carRequestStep === 0 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <h3 className="text-lg font-semibold text-center">{t.selectBrand}</h3>
                          <div className="grid grid-cols-3 gap-2">
                            {Object.keys(carModelsByBrand).map((brand) => (
                              <Button
                                key={brand}
                                variant={carRequestData.brand === brand ? 'default' : 'outline'}
                                className={`h-16 ${carRequestData.brand === brand ? 'bg-gradient-to-r from-emerald-500 to-green-600' : ''}`}
                                onClick={() => setCarRequestData({ ...carRequestData, brand, model: '' })}
                              >
                                {brand}
                              </Button>
                            ))}
                          </div>
                          <Button
                            className="w-full h-14 bg-gradient-to-r from-emerald-500 to-green-600"
                            disabled={!carRequestData.brand}
                            onClick={() => setCarRequestStep(1)}
                          >
                            {t.nextStep}
                            <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                          </Button>
                        </motion.div>
                      )}
                      
                      {carRequestStep === 1 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <h3 className="text-lg font-semibold text-center">{t.selectModel}</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {(carModelsByBrand[carRequestData.brand] || []).map((model) => (
                              <Button
                                key={model}
                                variant={carRequestData.model === model ? 'default' : 'outline'}
                                className={`h-14 ${carRequestData.model === model ? 'bg-gradient-to-r from-purple-500 to-violet-600' : ''}`}
                                onClick={() => setCarRequestData({ ...carRequestData, model })}
                              >
                                {model}
                              </Button>
                            ))}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="mb-2 block">{t.selectYear}</Label>
                              <select
                                className="w-full h-12 rounded-lg border bg-background px-3"
                                value={carRequestData.year}
                                onChange={(e) => setCarRequestData({ ...carRequestData, year: e.target.value })}
                              >
                                {['2025', '2024', '2023', '2022', '2021'].map((year) => (
                                  <option key={year} value={year}>{year}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <Label className="mb-2 block">{t.selectColor}</Label>
                              <div className="flex gap-2">
                                {['أبيض', 'أسود', 'فضي', 'رمادي'].map((color) => (
                                  <button
                                    key={color}
                                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                                      carRequestData.color === color ? 'border-sky-500 scale-110' : 'border-transparent'
                                    }`}
                                    style={{ 
                                      backgroundColor: color === 'أبيض' ? '#fff' : color === 'أسود' ? '#000' : color === 'فضي' ? '#c0c0c0' : '#808080'
                                    }}
                                    onClick={() => setCarRequestData({ ...carRequestData, color })}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1 h-14" onClick={() => setCarRequestStep(0)}>
                              {t.prevStep}
                            </Button>
                            <Button
                              className="flex-1 h-14 bg-gradient-to-r from-purple-500 to-violet-600"
                              disabled={!carRequestData.model}
                              onClick={() => setCarRequestStep(2)}
                            >
                              {t.nextStep}
                              <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                            </Button>
                          </div>
                        </motion.div>
                      )}
                      
                      {carRequestStep === 2 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <h3 className="text-lg font-semibold text-center">{t.personalInfo}</h3>
                          
                          <div className="space-y-3">
                            <div>
                              <Label>{t.fullName}</Label>
                              <Input
                                value={carRequestData.name}
                                onChange={(e) => setCarRequestData({ ...carRequestData, name: e.target.value })}
                                className="h-12"
                              />
                            </div>
                            <div>
                              <Label>{t.phone}</Label>
                              <Input
                                type="tel"
                                value={carRequestData.phone}
                                onChange={(e) => setCarRequestData({ ...carRequestData, phone: e.target.value })}
                                className="h-12"
                                placeholder="05XXXXXXXX"
                                dir="ltr"
                              />
                            </div>
                            <div>
                              <Label>{t.city}</Label>
                              <select
                                className="w-full h-12 rounded-lg border bg-background px-3"
                                value={carRequestData.city}
                                onChange={(e) => setCarRequestData({ ...carRequestData, city: e.target.value })}
                              >
                                <option value="">{isRTL ? 'اختر المدينة' : 'Select City'}</option>
                                {['الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة', 'الخبر'].map((city) => (
                                  <option key={city} value={city}>{city}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1 h-14" onClick={() => setCarRequestStep(1)}>
                              {t.prevStep}
                            </Button>
                            <Button
                              className="flex-1 h-14 bg-gradient-to-r from-amber-500 to-orange-600"
                              disabled={!carRequestData.name || !carRequestData.phone || !carRequestData.city}
                              onClick={() => setCarRequestStep(3)}
                            >
                              {t.nextStep}
                              <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                            </Button>
                          </div>
                        </motion.div>
                      )}
                      
                      {carRequestStep === 3 && (
                        <motion.div
                          key="step4"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-4"
                        >
                          <h3 className="text-lg font-semibold text-center">{isRTL ? 'تأكيد الطلب' : 'Confirm Request'}</h3>
                          
                          <div className="p-4 bg-muted rounded-xl space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">{isRTL ? 'السيارة' : 'Car'}</span>
                              <span className="font-medium">{carRequestData.brand} {carRequestData.model} {carRequestData.year}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">{isRTL ? 'اللون' : 'Color'}</span>
                              <span className="font-medium">{carRequestData.color || '-'}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">{isRTL ? 'الاسم' : 'Name'}</span>
                              <span className="font-medium">{carRequestData.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">{isRTL ? 'الجوال' : 'Phone'}</span>
                              <span className="font-medium" dir="ltr">{carRequestData.phone}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">{isRTL ? 'المدينة' : 'City'}</span>
                              <span className="font-medium">{carRequestData.city}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1 h-14" onClick={() => setCarRequestStep(2)}>
                              {t.prevStep}
                            </Button>
                            <Button
                              className="flex-1 h-14 bg-gradient-to-r from-emerald-500 to-green-600"
                              onClick={submitCarRequest}
                            >
                              <CheckCircle2 className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              {t.submit}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            )}
            
            {/* Offers Service */}
            {activeService === 'offers' && (
              <div className="py-4 space-y-4">
                {offers.map((offer, index) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative overflow-hidden rounded-2xl ${offer.gradient} p-5 text-white`}
                  >
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
                      {offer.discount}% {isRTL ? 'خصم' : 'OFF'}
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                        <Car className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{offer.brand} {offer.model}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white/60 line-through">{offer.oldPrice.toLocaleString()} {t.currency}</span>
                          <span className="text-2xl font-bold">{offer.newPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <Timer className="w-4 h-4" />
                          {t.offerEnds}: {offer.endsIn}
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white border border-white/30">
                      {t.grabOffer}
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Compare Service */}
            {activeService === 'compare' && (
              <div className="py-4 space-y-4">
                {compareCars.length === 0 ? (
                  <div className="text-center py-8">
                    <GitCompare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">{isRTL ? 'أضف سيارات للمقارنة' : 'Add cars to compare'}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {compareCars.map((car, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-muted rounded-xl relative"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => setCompareCars(compareCars.filter((_, i) => i !== index))}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <p className="font-medium">{car.brand}</p>
                        <p className="text-sm text-muted-foreground">{car.model}</p>
                        <p className="text-lg font-bold mt-2">{car.price}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {compareCars.length < 4 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        className="h-12 rounded-lg border bg-background px-3"
                        value={compareSearchBrand}
                        onChange={(e) => setCompareSearchBrand(e.target.value)}
                      >
                        <option value="">{isRTL ? 'اختر الماركة' : 'Select Brand'}</option>
                        {Object.keys(carModelsByBrand).map((brand) => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                      <select
                        className="h-12 rounded-lg border bg-background px-3"
                        value={compareSearchModel}
                        onChange={(e) => setCompareSearchModel(e.target.value)}
                      >
                        <option value="">{isRTL ? 'اختر الموديل' : 'Select Model'}</option>
                        {(carModelsByBrand[compareSearchBrand] || []).map((model) => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-purple-500 to-violet-600"
                      disabled={!compareSearchBrand || !compareSearchModel}
                      onClick={() => {
                        if (compareSearchBrand && compareSearchModel) {
                          setCompareCars([...compareCars, { 
                            brand: compareSearchBrand, 
                            model: compareSearchModel, 
                            price: `${Math.floor(Math.random() * 100000 + 50000).toLocaleString()} ${t.currency}` 
                          }]);
                          setCompareSearchBrand('');
                          setCompareSearchModel('');
                        }
                      }}
                    >
                      <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t.addCar}
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {/* Valuation Service */}
            {activeService === 'valuation' && (
              <div className="py-4 space-y-4">
                {!valuationResult ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="mb-2 block">{isRTL ? 'الماركة' : 'Brand'}</Label>
                        <select
                          className="w-full h-12 rounded-lg border bg-background px-3"
                          value={valuationBrand}
                          onChange={(e) => setValuationBrand(e.target.value)}
                        >
                          <option value="">{isRTL ? 'اختر' : 'Select'}</option>
                          {Object.keys(carModelsByBrand).map((brand) => (
                            <option key={brand} value={brand}>{brand}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="mb-2 block">{isRTL ? 'الموديل' : 'Model'}</Label>
                        <select
                          className="w-full h-12 rounded-lg border bg-background px-3"
                          value={valuationModel}
                          onChange={(e) => setValuationModel(e.target.value)}
                        >
                          <option value="">{isRTL ? 'اختر' : 'Select'}</option>
                          {(carModelsByBrand[valuationBrand] || []).map((model) => (
                            <option key={model} value={model}>{model}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="mb-2 block">{isRTL ? 'السنة' : 'Year'}</Label>
                        <select
                          className="w-full h-12 rounded-lg border bg-background px-3"
                          value={valuationYear}
                          onChange={(e) => setValuationYear(e.target.value)}
                        >
                          {Array.from({ length: 10 }, (_, i) => 2024 - i).map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="mb-2 block">{isRTL ? 'الممشى (كم)' : 'Mileage (km)'}</Label>
                        <Input
                          type="number"
                          value={valuationMileage}
                          onChange={(e) => setValuationMileage(e.target.value)}
                          className="h-12"
                          dir="ltr"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="mb-2 block">{isRTL ? 'الحالة' : 'Condition'}</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'excellent', label: isRTL ? 'ممتازة' : 'Excellent' },
                          { value: 'good', label: isRTL ? 'جيدة' : 'Good' },
                          { value: 'fair', label: isRTL ? 'مقبولة' : 'Fair' },
                        ].map((cond) => (
                          <Button
                            key={cond.value}
                            variant={valuationCondition === cond.value ? 'default' : 'outline'}
                            className={`h-12 ${valuationCondition === cond.value ? 'bg-gradient-to-r from-rose-500 to-pink-600' : ''}`}
                            onClick={() => setValuationCondition(cond.value as 'excellent' | 'good' | 'fair')}
                          >
                            {cond.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <Button
                      className="w-full h-14 bg-gradient-to-r from-rose-500 to-pink-600"
                      disabled={!valuationBrand || !valuationModel || !valuationMileage}
                      onClick={calculateValuation}
                    >
                      <DollarSign className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {isRTL ? 'احسب التقييم' : 'Calculate Valuation'}
                    </Button>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mx-auto mb-6">
                      <DollarSign className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-muted-foreground mb-2">{t.estimatedValue}</p>
                    <p className="text-4xl font-bold mb-2">{valuationResult.average.toLocaleString()} {t.currency}</p>
                    <p className="text-sm text-muted-foreground">
                      {valuationResult.min.toLocaleString()} - {valuationResult.max.toLocaleString()} {t.currency}
                    </p>
                    
                    <Button
                      variant="outline"
                      className="mt-6"
                      onClick={() => setValuationResult(null)}
                    >
                      {isRTL ? 'تقييم سيارة أخرى' : 'Valuate Another Car'}
                    </Button>
                  </motion.div>
                )}
              </div>
            )}
            
            {/* Maintenance Service */}
            {activeService === 'maintenance' && (
              <div className="py-4 space-y-4">
                {!maintenanceResult ? (
                  <>
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-4">
                        <Cog className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-muted-foreground">{isRTL ? 'أدخل مشوار سيارتك الحالي' : 'Enter your current mileage'}</p>
                    </div>
                    
                    <div className="relative">
                      <Input
                        type="number"
                        value={maintenanceMileage}
                        onChange={(e) => setMaintenanceMileage(e.target.value)}
                        className="h-16 text-center text-2xl font-bold"
                        placeholder="0"
                        dir="ltr"
                      />
                      <span className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground ${isRTL ? 'left-4' : 'right-4'}`}>
                        كم
                      </span>
                    </div>
                    
                    <Button
                      className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-600"
                      disabled={!maintenanceMileage}
                      onClick={getMaintenanceSchedule}
                    >
                      {isRTL ? 'عرض جدول الصيانة' : 'Show Maintenance Schedule'}
                    </Button>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                  >
                    {maintenanceResult.map((service: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center gap-3 p-4 rounded-xl ${
                          service.urgency === 'urgent' ? 'bg-red-500/10 border border-red-500/30' :
                          service.urgency === 'soon' ? 'bg-amber-500/10 border border-amber-500/30' :
                          'bg-muted'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          service.urgency === 'urgent' ? 'bg-red-500 text-white' :
                          service.urgency === 'soon' ? 'bg-amber-500 text-white' :
                          'bg-muted'
                        }`}>
                          <Cog className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-muted-foreground">{isRTL ? 'موعد:' : 'Due:'} {service.due}</p>
                        </div>
                        {service.urgency === 'urgent' && (
                          <Badge className="bg-red-500">{isRTL ? 'عاجل' : 'Urgent'}</Badge>
                        )}
                      </motion.div>
                    ))}
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setMaintenanceResult(null)}
                    >
                      {isRTL ? 'تحديث المشوار' : 'Update Mileage'}
                    </Button>
                  </motion.div>
                )}
              </div>
            )}
            
            {/* Warranty Service */}
            {activeService === 'warranty' && (
              <div className="py-4 space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-muted-foreground">{isRTL ? 'اختر خطة الضمان المناسبة' : 'Choose your warranty plan'}</p>
                </div>
                
                <div className="space-y-3">
                  {[
                    { id: 'basic', name: isRTL ? 'الأساسية' : 'Basic', price: '2,500', years: 1, coverage: isRTL ? 'المكونات الأساسية' : 'Basic Components', gradient: 'from-slate-500 to-slate-600' },
                    { id: 'premium', name: isRTL ? 'المميزة' : 'Premium', price: '4,500', years: 2, coverage: isRTL ? 'تغطية شاملة' : 'Full Coverage', gradient: 'from-indigo-500 to-blue-600', recommended: true },
                    { id: 'ultimate', name: isRTL ? 'المتقدمة' : 'Ultimate', price: '7,500', years: 3, coverage: isRTL ? 'تغطية كاملة + المساعدة' : 'Full + Roadside', gradient: 'from-amber-500 to-orange-600' },
                  ].map((plan) => (
                    <motion.div
                      key={plan.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setWarrantyPlan(plan.id as 'basic' | 'premium' | 'ultimate')}
                      className={`relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all ${
                        warrantyPlan === plan.id ? 'ring-2 ring-sky-500' : ''
                      } ${plan.recommended ? 'border-2 border-sky-500' : ''}`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${plan.gradient} opacity-10`} />
                      {plan.recommended && (
                        <Badge className="absolute top-2 right-2 bg-sky-500">
                          {isRTL ? 'الأكثر طلباً' : 'Most Popular'}
                        </Badge>
                      )}
                      <div className="relative flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center`}>
                          {plan.id === 'basic' ? <Shield className="w-7 h-7 text-white" /> :
                           plan.id === 'premium' ? <Crown className="w-7 h-7 text-white" /> :
                           <Diamond className="w-7 h-7 text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold">{plan.name}</p>
                          <p className="text-sm text-muted-foreground">{plan.coverage}</p>
                          <p className="text-xs text-muted-foreground">{plan.years} {isRTL ? 'سنوات' : 'years'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">{plan.price}</p>
                          <p className="text-xs text-muted-foreground">{t.currency}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <Button className="w-full h-14 bg-gradient-to-r from-indigo-500 to-blue-600">
                  {isRTL ? 'اشترك الآن' : 'Subscribe Now'}
                </Button>
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Car Link • {isRTL ? 'جميع الحقوق محفوظة' : 'All rights reserved'}</p>
        </div>
      </footer>
    </div>
  );
}
