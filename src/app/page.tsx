'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useCarLinkStore } from '@/store/car-link-store';
import type { Vehicle } from '@/types';
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
  Ruler, Users, Box, Award, Car, Palette, CircleDot, DoorOpen, Package, GaugeIcon, LayoutGrid,
  FileText, ClipboardList, Building2, LogIn, LogOut, Settings, Bell, Ticket, MapPin, Phone, Clock,
  Star, ArrowRight, Lightbulb, ShoppingCart, GitCompare, ArrowLeftRight, PartyPopper, Search, Copy,
  Target, Wallet, Percent, Handshake, TrendingDown, PieChart, BarChart3, CreditCard, Landmark, Info
} from 'lucide-react';

// Translations
const translations = {
  ar: {
    title: 'Car Link',
    subtitle: 'تحليل السيارات بالذكاء الاصطناعي',
    newAnalysis: 'تحليل جديد',
    heroTitle: 'منصة السيارات',
    heroHighlight: 'المدعوم بالذكاء الاصطناعي',
    heroDesc: 'الصق رابط سيارة أو ارفع صورة. احصل على المواصفات وتحليل الأسعار وخيارات التمويل ونصائح الخبراء الفورية.',
    pasteLink: 'الصق رابط السيارة',
    pasteLinkDesc: 'حلل سيارة من أي موقع',
    uploadImage: 'ارفع صورة السيارة',
    uploadImageDesc: 'الذكاء الاصطناعي سيتعرف على السيارة',
    capturePhoto: 'تصوير السيارة',
    capturePhotoDesc: 'التقط صورة مباشرة للسيارة',
    scanQR: 'مسح QR',
    scanQRDesc: 'امسح رمز QR للحصول على بيانات السيارة',
    analyzing: 'تحليل',
    clickToUpload: 'انقر للرفع أو اسحب الملف',
    analyzingVehicle: 'جاري تحليل السيارة...',
    extractingData: 'استخراج البيانات من الرابط',
    identifyingCar: 'التعرف على السيارة من الصورة',
    features: {
      specs: 'مواصفات المركبة',
      price: 'تحليل الأسعار',
      finance: 'التمويل',
      advisor: 'المساعد الذكي',
    },
    tabs: {
      specs: 'المواصفات والسوق',
      financing: 'التمويل',
      compare: 'مقارنة',
      advisor: 'المساعد',
    },
    performance: 'الأداء',
    engineFuel: 'المحرك والوقود',
    transmission: 'ناقل الحركة',
    safetyFeatures: 'ميزات الأمان',
    technology: 'التقنيات',
    dimensions: 'الأبعاد',
    capacity: 'السعة',
    wheels: 'العجلات والإطارات',
    warranty: 'الضمان',
    comfortFeatures: 'ميزات الراحة',
    exteriorFeatures: 'الميزات الخارجية',
    additionalInfo: 'معلومات إضافية',
    source: 'المصدر',
    horsepower: 'القوة',
    torque: 'العزم',
    acceleration: 'التسارع 0-100',
    topSpeed: 'السرعة القصوى',
    engine: 'المحرك',
    engineCode: 'كود المحرك',
    fuelType: 'نوع الوقود',
    consumption: 'الاستهلاك',
    type: 'النوع',
    gears: 'السرعات',
    drivetrain: 'الدفع',
    length: 'الطول',
    width: 'العرض',
    height: 'الارتفاع',
    wheelbase: 'قاعدة العجلات',
    weight: 'الوزن',
    groundClearance: 'ارتفاع الأرض',
    seats: 'عدد المقاعد',
    doors: 'عدد الأبواب',
    trunkCapacity: 'سعة الصندوق',
    fuelTankCapacity: 'سعة الخزان',
    wheelSize: 'حجم الجنط',
    tireSize: 'مقاس الإطارات',
    warrantyYears: 'ضمان السنوات',
    warrantyKm: 'ضمان الكيلومترات',
    mileage: 'الممشى',
    condition: 'الحالة',
    color: 'اللون',
    newCar: 'جديدة',
    usedCar: 'مستعملة',
    km: 'كم',
    kmh: 'كم/س',
    liter: 'لتر',
    mm: 'مم',
    kg: 'كجم',
    priceAnalysis: 'تحليل السعر',
    reliability: 'الموثوقية',
    prosCons: 'المميزات والعيوب',
    pros: 'المميزات',
    cons: 'العيوب',
    commonIssues: 'المشاكل الشائعة',
    alternatives: 'بدائل مقترحة',
    marketRange: 'نطاق السوق',
    score: 'التقييم',
    loanCalculator: 'حاسبة التمويل',
    financingCalculator: 'حاسبة التمويل',
    salaryBased: 'حسب الراتب',
    salaryBasedCalc: 'الحساب حسب الراتب',
    monthlySalary: 'الراتب الشهري',
    enterSalary: 'أدخل راتبك الشهري',
    selectBank: 'اختر البنك',
    allBanks: 'جميع البنوك',
    eligibilityCheck: 'التحقق من الأهلية',
    eligible: 'مؤهل',
    notEligible: 'غير مؤهل',
    maxMonthlyPayment: 'القسط الأقصى المسموح',
    recommendedDownPayment: 'الدفعة المقترحة',
    debtToIncomeRatio: 'نسبة المديونية',
    salaryRequirement: 'متطلبات الراتب',
    bankRequirements: 'متطلبات البنك',
    minSalary: 'الحد الأدنى للراتب',
    salaryHint: 'الراتب الشهري يساعد في تحديد أهليتك للتمويل',
    autoCalculate: 'حساب تلقائي',
    basedOnSalary: 'بناءً على الراتب',
    affordabilityAnalysis: 'تحليل القدرة الشرائية',
    salaryToPaymentRatio: 'نسبة القسط من الراتب',
    remainingAfterPayment: 'المتبقي بعد القسط',
    recommendedBudget: 'الميزانية المقترحة',
    carsWithinBudget: 'سيارات تناسب ميزانيتك',
    carsWithinBudgetDesc: 'تحديث حتى 60 سيارة • بناءً على راتبك وقدرتك الشرائية',
    monthlyPaymentRange: 'القسط الشهري',
    viewDetails: 'عرض التفاصيل',
    affordableCars: 'السيارات المتاحة',
    noAffordableCars: 'لا توجد سيارات في هذه الميزانية',
    increaseDownPayment: 'جرب زيادة الدفعة المقدمة',
    orIncreaseTerm: 'أو زيادة مدة التمويل',
    basedOnYourSalary: 'بناءً على راتبك',
    maxBudget: 'الميزانية القصوى',
    downPayment: 'الدفعة المقدمة',
    loanTerm: 'مدة التمويل',
    interestRate: 'نسبة الربح',
    monthlyPayment: 'القسط الشهري',
    totalInterest: 'إجمالي الربح',
    bankOffers: 'عروض التمويل من البنوك السعودية',
    compareBanks: 'قارن عروض التمويل من البنوك السعودية',
    bestRate: 'أفضل عرض',
    annually: 'سنوياً',
    monthly: 'شهرياً',
    years: 'سنوات',
    months: 'شهر',
    financingAmount: 'مبلغ التمويل',
    totalCost: 'التكلفة الإجمالية',
    fees: 'الرسوم',
    minDownPayment: 'أقل دفعة',
    profitRate: 'نسبة الربح',
    saudiBanks: 'البنوك السعودية',
    // Financing Programs
    financingPrograms: 'برامج التمويل المتاحة',
    financingProgramsDesc: 'اختر البرنامج المناسب لاحتياجاتك',
    murabaha: 'المرابحة',
    murabahaDesc: 'تمويل شرعي يقوم البنك فيه بشراء السيارة وبيعها عليك بهامش ربح متفق عليه',
    murabahaFeatures: 'عقد شرعي واضح | ملكية فورية بعد السداد | أقساط ثابتة معلومة',
    murabahaTip: 'مناسب لمن يرغب في ملكية فورية ووضوح في الأقساط',
    ownershipFinancing: 'التمويل المنتهي بالتمليك',
    ownershipFinancingDesc: 'تستأجر السيارة لمدة محددة ثم تنتقل ملكيتها إليك بنهاية العقد',
    ownershipFinancingFeatures: 'أقساط أقل شهرياً | مرونة في المدة | خيار الشراء في النهاية',
    ownershipFinancingTip: 'مناسب لمن يريد أقساط شهرية أقل ومرونة في السداد',
    installmentProgram: 'برنامج التقسيط المباشر',
    installmentProgramDesc: 'تقسيط مباشر من الوكيل أو الشركة الممولة بدون وسيط',
    installmentProgramFeatures: 'إجراءات سهلة وسريعة | عروض خاصة أحياناً | ضمان من الوكيل',
    installmentProgramTip: 'مناسب لمن يبحث عن سهولة في الإجراءات وعروض الوكيل',
    leaseProgram: 'برنامج التأجير',
    leaseProgramDesc: 'استخدام السيارة لمدة محددة مقابل أجرة شهرية مع إمكانية التجديد',
    leaseProgramFeatures: 'أقساط شهرية منخفضة | إمكانية تغيير السيارة | صيانة مشمولة أحياناً',
    leaseProgramTip: 'مناسب لمن يرغب في تغيير السيارة كل فترة',
    programFeatures: 'المميزات',
    programTips: 'نصيحة',
    suitableFor: 'مناسب لـ',
    applyNow: 'قدم طلبك الآن',
    chooseProgram: 'اختر البرنامج المناسب',
    comparePrograms: 'قارن بين البرامج',
    // Financing Application Chatbot
    financingApplication: 'طلب التمويل',
    applicationChat: 'محادثة طلب التمويل',
    welcomeMessage: 'مرحباً! أنا مساعد التمويل الذكي. سأساعدك في إكمال طلب التمويل.',
    letsStart: 'لنبدأ ببعض الأسئلة لتحديد الخيار الأنسب لك',
    preferredCarType: 'ما نوع السيارة المفضلة لديك؟',
    sedan: 'سيدان',
    suv: 'دفع رباعي',
    hatchback: 'هاتشباك',
    sports: 'رياضية',
    truck: 'شاحنة',
    salaryQuestion: 'ما هو راتبك الشهري؟',
    monthlyBudget: 'ما الميزانية الشهرية المتاحة للقسط؟',
    downPaymentQ: 'ما المبلغ المتاح للدفعة المقدمة؟',
    employmentTypeQ: 'ما نوع وظيفتك؟',
    government: 'حكومية',
    private: 'قطاع خاص',
    selfEmployed: 'عمل حر',
    retired: 'متقاعد',
    workDurationQ: 'كم مدة عملك الحالية؟',
    cityQ: 'في أي مدينة تقيم؟',
    contactInfo: 'معلومات التواصل',
    phoneQ: 'رقم الجوال للتواصل',
    summaryTitle: 'ملخص الطلب',
    confirmApplication: 'تأكيد الطلب',
    editInfo: 'تعديل البيانات',
    applicationSubmitted: 'تم تقديم الطلب بنجاح!',
    applicationNumber: 'رقم الطلب',
    orderTracking: 'تتبع الطلب',
    statusPending: 'قيد المراجعة',
    statusApproved: 'موافقة مبدئية',
    statusDocuments: 'استكمال المستندات',
    statusFinalApproval: 'الموافقة النهائية',
    statusContract: 'توقيع العقد',
    statusDelivery: 'تسليم السيارة',
    estimatedTime: 'الوقت المتوقع',
    contactSupport: 'تواصل مع الدعم',
    nextStep: 'الخطوة التالية',
    previousStep: 'الخطوة السابقة',
    aiTyping: 'المساعد الذكي يكتب...',
    selectOption: 'اختر من الخيارات',
    typeAnswer: 'اكتب إجابتك',
    send: 'إرسال',
    recommendedCars: 'السيارات المقترحة لك',
    basedOnBudget: 'بناءً على ميزانيتك',
    loadingRecommendations: 'جاري تحميل الاقتراحات...',
    competitors: 'المنافسون في نفس الفئة',
    competitorsDesc: 'سيارات منافسة في نفس فئة السيارة',
    bestSellingCars: 'الأكثر مبيعاً',
    bestSellingCarsDesc: 'السيارات الأكثر طلباً في السوق السعودي',
    clickToAnalyze: 'انقر للتحليل',
    popularChoice: 'خيار شائع',
    segment: 'الفئة',
    priceDifference: 'فرق السعر',
    cheaper: 'أرخص',
    moreExpensive: 'أغلى',
    similar: 'مشابه',
    valueScore: 'تقييم القيمة',
    addToComparison: 'أضف للمقارنة',
    recommendation: 'التوصية',
    bestValue: 'أفضل قيمة',
    loadingCompetitors: 'جاري تحميل المنافسين...',
    compareVehicles: 'مقارنة السيارات',
    compareUpTo: 'قارن حتى 4 سيارات جنباً إلى جنب',
    addCurrentVehicle: 'أضف السيارة الحالية',
    noVehiclesToCompare: 'لا توجد سيارات للمقارنة',
    power: 'القوة',
    aiAdvisor: 'المساعد الذكي للسيارات',
    askAnything: 'اسأل أي سؤال عن هذه السيارة أو شراء السيارات بشكل عام',
    startConversation: 'ابدأ المحادثة',
    askAbout: 'اسأل عن السعر أو البدائل أو الموثوقية أو التمويل',
    quickQuestions: 'أسئلة سريعة',
    goodPrice: 'سعر ممتاز',
    averagePrice: 'سعر متوسط',
    highPrice: 'سعر مرتفع',
    notAvailable: 'غير متوفر',
    yearUnknown: 'سنة غير محددة',
    hp: 'حصان',
    nm: 'نيوتن/متر',
    seconds: 'ثانية',
    poweredByAI: 'مدعوم بالذكاء الاصطناعي',
    enterUrl: 'الرجاء إدخال رابط',
    analysisSuccess: 'تم تحليل السيارة بنجاح!',
    analysisFailed: 'فشل التحليل',
    pleaseTryAgain: 'الرجاء المحاولة مرة أخرى',
    carIdentified: 'تم التعرف على السيارة!',
    confidence: 'ثقة',
    addedToComparison: 'تمت الإضافة للمقارنة',
    failedToGetResponse: 'فشل الحصول على رد',
    quickQs: [
      'هل هذا سعر جيد؟',
      'ما هي المشاكل الشائعة؟',
      'ما هي البدائل المتاحة؟',
      'هل السعر عادل؟',
      'ما مدى موثوقيتها؟',
      'ما هي تكاليف الصيانة؟',
      'كم استهلاك الوقود الفعلي؟',
      'هل قطع الغيار متوفرة؟',
      'ما هي افضل سنة موديل؟',
      'هل تناسب العائلة؟',
      'ما قيمة اعادة البيع؟',
      'هل هناك حملات استدعاء؟',
      'ما افضل بنك للتمويل؟',
      'هل انصح بشرائها مستعملة؟',
      'كيف أداء المكيف في الصيف؟',
      'ما هي استهلاك الزيت؟',
      'هل المحرك قوي؟',
      'ما هي فترة الضمان؟',
      'هل قطع الغيار أصلية متوفرة؟',
      'ما هي ميزات الأمان؟',
      'هل تناسب الطرق الوعرة؟',
      'ما الفرق بينها وبين المنافسين؟',
      'هل قيمة الاستهلاك عالية؟',
      'ما هي تكلفة التأمين؟',
      'هل أنصح بها للسفر؟',
      'ما هي أعطال شائعة في هذه الفئة؟',
      'كيف جودة المواد الداخلية؟',
      'هل المقاعد مريحة للرحلات الطويلة؟',
      'ما هي مدة خدمة الوكيل؟',
      'هل يوجد خصم على التأمين؟',
    ],
    language: 'اللغة',
    arabic: 'العربية',
    english: 'English',
    // Vehicle Origin & Climate Section
    vehicleOrigin: 'معلومات السيارة',
    manufacturingCountry: 'بلد التصنيع',
    brandOverview: 'نبذة عن الماركة',
    categoryModel: 'الفئة والطراز',
    climateUsage: 'المناخ وطريقة الاستخدام',
    countryInfo: 'معلومات البلد',
    brandInfo: 'معلومات الماركة',
    categoryInfo: 'معلومات الفئة',
    climateInfo: 'معلومات المناخ',
    suitableForSaudi: 'مناسبة للمناخ السعودي',
    fuelEfficiency: 'كفاءة استهلاك الوقود',
    maintenanceCost: 'تكلفة الصيانة',
    partsAvailability: 'توفر قطع الغيار',
    resaleValue: 'قيمة إعادة البيع',
    brandReputation: 'سمعة الماركة',
    marketPresence: 'التواجد في السوق',
    afterSalesService: 'خدمة ما بعد البيع',
    segmentClass: 'فئة السيارة',
    bodyType: 'نوع الهيكل',
    seatingCapacity: 'عدد المقاعد',
    typicalUsage: 'الاستخدام النمطي',
    cityDriving: 'قيادة المدينة',
    highwayDriving: 'قيادة الطرق السريعة',
    offroadCapability: 'قدرة على الطرق الوعرة',
    summerPerformance: 'أداء الصيف',
    winterPerformance: 'أداء الشتاء',
    sandDustResistance: 'مقاومة الرمال والغبار',
    acPerformance: 'أداء المكيف',
    excellent: 'ممتاز',
    good: 'جيد',
    average: 'متوسط',
    poor: 'ضعيف',
    high: 'مرتفع',
    low: 'منخفض',
    medium: 'متوسط',
    widelyAvailable: 'متوفر بكثرة',
    limited: 'محدود',
    popular: 'شائع',
    rare: 'نادر',
  },
  en: {
    title: 'Car Link',
    subtitle: 'AI-Powered Car Analysis',
    newAnalysis: 'New Analysis',
    heroTitle: 'Car Platform',
    heroHighlight: 'AI-Powered',
    heroDesc: 'Paste a car listing link or upload an image. Get instant specs, price analysis, financing options, and expert advice.',
    pasteLink: 'Paste Car Link',
    pasteLinkDesc: 'Analyze a car listing from any website',
    uploadImage: 'Upload Car Image',
    uploadImageDesc: 'AI will identify the car from a photo',
    capturePhoto: 'Capture Photo',
    capturePhotoDesc: 'Take a direct photo of the car',
    scanQR: 'Scan QR',
    scanQRDesc: 'Scan QR code to get vehicle data',
    analyzing: 'Analyze',
    clickToUpload: 'Click to upload or drag and drop',
    analyzingVehicle: 'Analyzing Vehicle...',
    extractingData: 'Extracting data from listing',
    identifyingCar: 'Identifying car from image',
    features: {
      specs: 'Vehicle Specs',
      price: 'Price Analysis',
      finance: 'Financing',
      advisor: 'Smart Assistant',
    },
    tabs: {
      specs: 'Specs & Market',
      financing: 'Finance',
      compare: 'Compare',
      advisor: 'Assistant',
    },
    performance: 'Performance',
    engineFuel: 'Engine & Fuel',
    transmission: 'Transmission',
    safetyFeatures: 'Safety Features',
    technology: 'Technology',
    dimensions: 'Dimensions',
    capacity: 'Capacity',
    wheels: 'Wheels & Tires',
    warranty: 'Warranty',
    comfortFeatures: 'Comfort Features',
    exteriorFeatures: 'Exterior Features',
    additionalInfo: 'Additional Info',
    source: 'Source',
    horsepower: 'Horsepower',
    torque: 'Torque',
    acceleration: '0-100 km/h',
    topSpeed: 'Top Speed',
    engine: 'Engine',
    engineCode: 'Engine Code',
    fuelType: 'Fuel Type',
    consumption: 'Consumption',
    type: 'Type',
    gears: 'Gears',
    drivetrain: 'Drivetrain',
    length: 'Length',
    width: 'Width',
    height: 'Height',
    wheelbase: 'Wheelbase',
    weight: 'Weight',
    groundClearance: 'Ground Clearance',
    seats: 'Seats',
    doors: 'Doors',
    trunkCapacity: 'Trunk Capacity',
    fuelTankCapacity: 'Fuel Tank',
    wheelSize: 'Wheel Size',
    tireSize: 'Tire Size',
    warrantyYears: 'Warranty Years',
    warrantyKm: 'Warranty Km',
    mileage: 'Mileage',
    condition: 'Condition',
    color: 'Color',
    newCar: 'New',
    usedCar: 'Used',
    km: 'km',
    kmh: 'km/h',
    liter: 'L',
    mm: 'mm',
    kg: 'kg',
    priceAnalysis: 'Price Analysis',
    reliability: 'Reliability',
    prosCons: 'Pros & Cons',
    pros: 'Pros',
    cons: 'Cons',
    commonIssues: 'Common Issues',
    alternatives: 'Alternative Vehicles',
    marketRange: 'Market Range',
    score: 'Score',
    loanCalculator: 'Finance Calculator',
    financingCalculator: 'Finance Calculator',
    salaryBased: 'Based on Salary',
    salaryBasedCalc: 'Salary-Based Calculation',
    monthlySalary: 'Monthly Salary',
    enterSalary: 'Enter your monthly salary',
    selectBank: 'Select Bank',
    allBanks: 'All Banks',
    eligibilityCheck: 'Eligibility Check',
    eligible: 'Eligible',
    notEligible: 'Not Eligible',
    maxMonthlyPayment: 'Max Allowed Payment',
    recommendedDownPayment: 'Recommended Down Payment',
    debtToIncomeRatio: 'Debt-to-Income Ratio',
    salaryRequirement: 'Salary Requirements',
    bankRequirements: 'Bank Requirements',
    minSalary: 'Minimum Salary',
    salaryHint: 'Monthly salary helps determine your financing eligibility',
    autoCalculate: 'Auto Calculate',
    basedOnSalary: 'Based on Salary',
    affordabilityAnalysis: 'Affordability Analysis',
    salaryToPaymentRatio: 'Payment-to-Salary Ratio',
    remainingAfterPayment: 'Remaining After Payment',
    recommendedBudget: 'Recommended Budget',
    carsWithinBudget: 'Cars Within Your Budget',
    carsWithinBudgetDesc: 'Updated up to 60 cars • Based on your salary and affordability',
    monthlyPaymentRange: 'Monthly Payment',
    viewDetails: 'View Details',
    affordableCars: 'Available Cars',
    noAffordableCars: 'No cars available in this budget',
    increaseDownPayment: 'Try increasing down payment',
    orIncreaseTerm: 'Or increase loan term',
    basedOnYourSalary: 'Based on your salary',
    maxBudget: 'Max Budget',
    downPayment: 'Down Payment',
    loanTerm: 'Finance Term',
    interestRate: 'Profit Rate',
    monthlyPayment: 'Monthly Payment',
    totalInterest: 'Total Profit',
    bankOffers: 'Saudi Banks Financing Offers',
    compareBanks: 'Compare financing offers from Saudi banks',
    bestRate: 'Best Offer',
    annually: 'annually',
    monthly: 'monthly',
    years: 'years',
    months: 'months',
    financingAmount: 'Financing Amount',
    totalCost: 'Total Cost',
    fees: 'Fees',
    minDownPayment: 'Min Down Payment',
    profitRate: 'Profit Rate',
    saudiBanks: 'Saudi Banks',
    // Financing Programs
    financingPrograms: 'Available Financing Programs',
    financingProgramsDesc: 'Choose the program that suits your needs',
    murabaha: 'Murabaha',
    murabahaDesc: 'Sharia-compliant financing where the bank buys the car and sells it to you at an agreed profit margin',
    murabahaFeatures: 'Clear Sharia contract | Immediate ownership after payment | Fixed known installments',
    murabahaTip: 'Suitable for those who want immediate ownership and clear installments',
    ownershipFinancing: 'Lease-to-Own',
    ownershipFinancingDesc: 'You lease the car for a specified period, then ownership transfers to you at the end of the contract',
    ownershipFinancingFeatures: 'Lower monthly installments | Flexible duration | Purchase option at the end',
    ownershipFinancingTip: 'Suitable for those who want lower monthly payments and flexibility',
    installmentProgram: 'Direct Installment Program',
    installmentProgramDesc: 'Direct installment from the dealer or financing company without intermediary',
    installmentProgramFeatures: 'Easy and fast procedures | Special offers sometimes | Dealer warranty',
    installmentProgramTip: 'Suitable for those seeking easy procedures and dealer offers',
    leaseProgram: 'Lease Program',
    leaseProgramDesc: 'Use the car for a specified period for a monthly rent with the possibility of renewal',
    leaseProgramFeatures: 'Low monthly payments | Possibility to change the car | Maintenance sometimes included',
    leaseProgramTip: 'Suitable for those who like to change cars periodically',
    programFeatures: 'Features',
    programTips: 'Tip',
    suitableFor: 'Suitable for',
    applyNow: 'Apply Now',
    chooseProgram: 'Choose the Right Program',
    comparePrograms: 'Compare Programs',
    // Financing Application Chatbot
    financingApplication: 'Financing Application',
    applicationChat: 'Financing Application Chat',
    welcomeMessage: 'Hello! I\'m the smart financing assistant. I\'ll help you complete your financing application.',
    letsStart: 'Let\'s start with some questions to find the best option for you',
    preferredCarType: 'What is your preferred car type?',
    sedan: 'Sedan',
    suv: 'SUV',
    hatchback: 'Hatchback',
    sports: 'Sports',
    truck: 'Truck',
    salaryQuestion: 'What is your monthly salary?',
    monthlyBudget: 'What is your available monthly budget for the installment?',
    downPaymentQ: 'What amount is available for the down payment?',
    employmentTypeQ: 'What is your employment type?',
    government: 'Government',
    private: 'Private Sector',
    selfEmployed: 'Self-Employed',
    retired: 'Retired',
    workDurationQ: 'How long have you been at your current job?',
    cityQ: 'Which city do you live in?',
    contactInfo: 'Contact Information',
    phoneQ: 'Phone number for contact',
    summaryTitle: 'Application Summary',
    confirmApplication: 'Confirm Application',
    editInfo: 'Edit Information',
    applicationSubmitted: 'Application submitted successfully!',
    applicationNumber: 'Application Number',
    orderTracking: 'Order Tracking',
    statusPending: 'Under Review',
    statusApproved: 'Initial Approval',
    statusDocuments: 'Complete Documents',
    statusFinalApproval: 'Final Approval',
    statusContract: 'Sign Contract',
    statusDelivery: 'Car Delivery',
    estimatedTime: 'Estimated Time',
    contactSupport: 'Contact Support',
    nextStep: 'Next Step',
    previousStep: 'Previous Step',
    aiTyping: 'AI Assistant is typing...',
    selectOption: 'Select from options',
    typeAnswer: 'Type your answer',
    send: 'Send',
    recommendedCars: 'Recommended Cars for You',
    basedOnBudget: 'Based on your budget',
    loadingRecommendations: 'Loading recommendations...',
    competitors: 'Competitors in Same Class',
    competitorsDesc: 'Competing vehicles in the same category',
    bestSellingCars: 'Best Selling Cars',
    bestSellingCarsDesc: 'Most demanded cars in Saudi market',
    clickToAnalyze: 'Click to Analyze',
    popularChoice: 'Popular Choice',
    segment: 'Segment',
    priceDifference: 'Price Difference',
    cheaper: 'Cheaper',
    moreExpensive: 'More Expensive',
    similar: 'Similar',
    valueScore: 'Value Score',
    addToComparison: 'Add to Comparison',
    recommendation: 'Recommendation',
    bestValue: 'Best Value',
    loadingCompetitors: 'Loading competitors...',
    compareVehicles: 'Compare Vehicles',
    compareUpTo: 'Compare up to 4 vehicles side by side',
    addCurrentVehicle: 'Add Current Vehicle',
    noVehiclesToCompare: 'No vehicles added for comparison',
    power: 'Power',
    aiAdvisor: 'AI Car Assistant',
    askAnything: 'Ask anything about this vehicle or car buying in general',
    startConversation: 'Start a conversation',
    askAbout: 'Ask about pricing, alternatives, reliability, or financing',
    quickQuestions: 'Quick Questions',
    goodPrice: 'GOOD PRICE',
    averagePrice: 'AVERAGE PRICE',
    highPrice: 'OVERPRICED',
    notAvailable: 'N/A',
    yearUnknown: 'Unknown Year',
    hp: 'hp',
    nm: 'Nm',
    seconds: 's',
    poweredByAI: 'Built with AI',
    enterUrl: 'Please enter a URL',
    analysisSuccess: 'Vehicle analyzed successfully!',
    analysisFailed: 'Analysis failed',
    pleaseTryAgain: 'Please try again',
    carIdentified: 'Vehicle identified!',
    confidence: 'confidence',
    addedToComparison: 'Added to comparison',
    failedToGetResponse: 'Failed to get response',
    quickQs: [
      'Is this a good deal?',
      'What are common issues?',
      'What alternatives exist?',
      'Is the price fair?',
      'How reliable is it?',
      'What are the maintenance costs?',
      'What is the real fuel consumption?',
      'Are spare parts available?',
      'Which model year is best?',
      'Is it family-friendly?',
      'What is the resale value?',
      'Are there any recalls?',
      'Which bank offers best financing?',
      'Would you recommend buying used?',
      'How is the AC performance in summer?',
      'What is the oil consumption?',
      'Is the engine powerful enough?',
      'What is the warranty period?',
      'Are genuine parts available?',
      'What are the safety features?',
      'Is it suitable for off-road?',
      'How does it compare to competitors?',
      'Is the depreciation high?',
      'What is the insurance cost?',
      'Is it good for road trips?',
      'What are common issues in this segment?',
      'How is the interior material quality?',
      'Are the seats comfortable for long trips?',
      'What is the dealer service duration?',
      'Is there an insurance discount?',
    ],
    language: 'Language',
    arabic: 'العربية',
    english: 'English',
    // Vehicle Origin & Climate Section
    vehicleOrigin: 'Vehicle Information',
    manufacturingCountry: 'Manufacturing Country',
    brandOverview: 'Brand Overview',
    categoryModel: 'Category & Model',
    climateUsage: 'Climate & Usage',
    countryInfo: 'Country Info',
    brandInfo: 'Brand Info',
    categoryInfo: 'Category Info',
    climateInfo: 'Climate Info',
    suitableForSaudi: 'Suitable for Saudi Climate',
    fuelEfficiency: 'Fuel Efficiency',
    maintenanceCost: 'Maintenance Cost',
    partsAvailability: 'Parts Availability',
    resaleValue: 'Resale Value',
    brandReputation: 'Brand Reputation',
    marketPresence: 'Market Presence',
    afterSalesService: 'After Sales Service',
    segmentClass: 'Segment Class',
    bodyType: 'Body Type',
    seatingCapacity: 'Seating Capacity',
    typicalUsage: 'Typical Usage',
    cityDriving: 'City Driving',
    highwayDriving: 'Highway Driving',
    offroadCapability: 'Off-road Capability',
    summerPerformance: 'Summer Performance',
    winterPerformance: 'Winter Performance',
    sandDustResistance: 'Sand & Dust Resistance',
    acPerformance: 'AC Performance',
    excellent: 'Excellent',
    good: 'Good',
    average: 'Average',
    poor: 'Poor',
    high: 'High',
    low: 'Low',
    medium: 'Medium',
    widelyAvailable: 'Widely Available',
    limited: 'Limited',
    popular: 'Popular',
    rare: 'Rare',
  },
};

type Language = 'ar' | 'en';

export default function CarLinkPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<Language>('ar');
  const t = translations[language];
  const isRTL = language === 'ar';
  
  const {
    currentVehicle,
    viewState,
    analysisMode,
    comparisonVehicles,
    chatMessages,
    chatLoading,
    financingParams,
    financingResult,
    salaryEligibility,
    setCurrentVehicle,
    setViewState,
    setAnalysisMode,
    addComparisonVehicle,
    removeComparisonVehicle,
    addChatMessage,
    setChatLoading,
    setFinancingParams,
    setFinancingResult,
    setSalaryEligibility,
    reset,
  } = useCarLinkStore();

  const [linkUrl, setLinkUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [marketAnalysis, setMarketAnalysis] = useState<any>(null);
  const [competitors, setCompetitors] = useState<any>(null);
  const [loadingCompetitors, setLoadingCompetitors] = useState(false);
  const [activeTab, setActiveTab] = useState('specs');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [chatInput, setChatInput] = useState('');
  const [bankOffers, setBankOffers] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [serviceDetailOpen, setServiceDetailOpen] = useState(false);
  const [appsSheetOpen, setAppsSheetOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  const [offerDetailOpen, setOfferDetailOpen] = useState(false);
  const [offerClaimed, setOfferClaimed] = useState(false);
  const [claimedCoupons, setClaimedCoupons] = useState<any[]>([]);
  const [showCoupon, setShowCoupon] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState<any | null>(null);
  
  // Car Detail Dialog States
  const [selectedCarDetail, setSelectedCarDetail] = useState<any | null>(null);
  const [carDetailOpen, setCarDetailOpen] = useState(false);
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  const [orderFormData, setOrderFormData] = useState({
    name: '',
    phone: '',
    city: '',
    notes: ''
  });
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  
  // Comparison Animation State
  const [isAddingToCompare, setIsAddingToCompare] = useState(false);
  const [showComparisonSuccess, setShowComparisonSuccess] = useState(false);
  const [comparisonSuccessData, setComparisonSuccessData] = useState<{brand: string, model: string, count: number} | null>(null);
  
  // Feature Dialog States
  const [finDownPayment, setFinDownPayment] = useState(20);
  const [finYears, setFinYears] = useState(5);
  const [manualCarPrice, setManualCarPrice] = useState<number>(0);
  const [carMileage, setCarMileage] = useState(currentVehicle?.mileage || 50000);
  const [valBrand, setValBrand] = useState('');
  const [valModel, setValModel] = useState('');
  const [valYear, setValYear] = useState(2026);
  const [valMileage, setValMileage] = useState(50000);
  const [valCondition, setValCondition] = useState<'excellent' | 'good' | 'fair'>('good');
  const [showValuation, setShowValuation] = useState(false);
  const [insuranceType, setInsuranceType] = useState<'comprehensive' | 'thirdParty'>('comprehensive');
  
  // Budget Cars Refresh State
  const [budgetCarsOffset, setBudgetCarsOffset] = useState(0);
  const [isRefreshingBudgetCars, setIsRefreshingBudgetCars] = useState(false);
  const [selectedBudgetCar, setSelectedBudgetCar] = useState<any | null>(null);
  const [budgetCarRequestOpen, setBudgetCarRequestOpen] = useState(false);
  const [budgetCarRequestData, setBudgetCarRequestData] = useState({
    name: '',
    phone: '',
    city: '',
    notes: ''
  });
  const [budgetCarRequestSubmitted, setBudgetCarRequestSubmitted] = useState(false);

  // Use comparisonVehicles from store - sync with main comparison
  const compareList = comparisonVehicles.map(cv => ({
    id: cv.vehicle.id,
    brand: cv.vehicle.brand,
    model: cv.vehicle.model,
    price: cv.vehicle.price,
    hp: cv.vehicle.horsepower,
    year: cv.vehicle.year?.toString() || '2024',
    transmission: cv.vehicle.transmission || 'AT',
    consumption: cv.vehicle.fuelConsumption || 6.5,
    seats: cv.vehicle.seats || 5,
    category: 'Sedan'
  }));

  // Financing Application Chatbot States
  const [financingChatOpen, setFinancingChatOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [applicationStep, setApplicationStep] = useState(0);
  const [applicationData, setApplicationData] = useState<any>({
    programType: '',
    bankName: '',
    vehicle: null,
    carBrand: '',
    carCategory: '',
    trimLevel: '',
    employmentType: '',
    workDuration: '',
    salary: '',
    monthlyBudget: '',
    downPaymentCapability: '',
    city: '',
    phone: '',
  });
  const [applicationMessages, setApplicationMessages] = useState<any[]>([]);
  const [applicationStatus, setApplicationStatus] = useState<'chat' | 'summary' | 'submitted' | 'tracking' | 'result'>('chat');
  const [orderStatus, setOrderStatus] = useState<string>('pending');
  const [showDocumentsForm, setShowDocumentsForm] = useState(false);
  const [documentsSubmitted, setDocumentsSubmitted] = useState(false);
  const [documentsData, setDocumentsData] = useState({
    fullName: '',
    nationalId: '',
    birthDate: '',
    phone: '',
    email: '',
    city: '',
    employmentType: '',
    companyName: '',
    jobTitle: '',
    workDuration: '',
    salary: '',
    bankName: '',
    idDocument: null as File | null,
    salaryCertificate: null as File | null,
    bankStatement: null as File | null,
    workContract: null as File | null,
  });
  const [applicationLoading, setApplicationLoading] = useState(false);

  // New Car Request Form States
  const [carRequestBrand, setCarRequestBrand] = useState('');
  const [carRequestModel, setCarRequestModel] = useState('');
  const [carRequestYear, setCarRequestYear] = useState('');
  const [carRequestCategory, setCarRequestCategory] = useState('');
  const [carRequestTrim, setCarRequestTrim] = useState('');
  const [carRequestColor, setCarRequestColor] = useState('');
  const [carRequestFuelType, setCarRequestFuelType] = useState('');
  const [carRequestDriveType, setCarRequestDriveType] = useState('');
  const [carRequestTransmission, setCarRequestTransmission] = useState('');
  const [carRequestWheels, setCarRequestWheels] = useState('');
  const [carRequestSunroof, setCarRequestSunroof] = useState('');
  const [carRequestLeather, setCarRequestLeather] = useState('');
  const [carRequestFullName, setCarRequestFullName] = useState('');
  const [carRequestPhone, setCarRequestPhone] = useState('');
  const [carRequestEmail, setCarRequestEmail] = useState('');
  const [carRequestCity, setCarRequestCity] = useState('');
  const [carRequestNationalId, setCarRequestNationalId] = useState('');
  const [carRequestBirthDate, setCarRequestBirthDate] = useState('');
  const [carRequestEmploymentType, setCarRequestEmploymentType] = useState('');
  const [carRequestCompanyName, setCarRequestCompanyName] = useState('');
  const [carRequestJobTitle, setCarRequestJobTitle] = useState('');
  const [carRequestWorkDuration, setCarRequestWorkDuration] = useState('');
  const [carRequestSalary, setCarRequestSalary] = useState('');
  const [carRequestBank, setCarRequestBank] = useState('');
  const [carRequestSubmitting, setCarRequestSubmitting] = useState(false);
  const [carRequestSubmitted, setCarRequestSubmitted] = useState(false);
  const [carRequestTrackingNumber, setCarRequestTrackingNumber] = useState('');

  // Manual Car Entry for Analysis States
  const [manualCarEntryOpen, setManualCarEntryOpen] = useState(false);
  const [manualCarData, setManualCarData] = useState({
    brand: '',
    model: '',
    year: '2026',
    trim: '',
    price: '',
    mileage: '',
    condition: 'new' as 'new' | 'used',
    color: '',
    fuelType: '',
    transmission: '',
    engine: '',
    horsepower: '',
    seats: '',
    drivetrain: '',
  });

  // Market Price Car Registration States
  const [showMarketPriceForm, setShowMarketPriceForm] = useState(false);
  const [marketPriceCars, setMarketPriceCars] = useState<any[]>([]);
  const [mpBrand, setMpBrand] = useState('');
  const [mpCondition, setMpCondition] = useState<'new' | 'used'>('new');
  const [mpModel, setMpModel] = useState('');
  const [mpYear, setMpYear] = useState('2026');
  const [mpTrim, setMpTrim] = useState('');
  const [mpPrice, setMpPrice] = useState('');
  const [dealerRefreshCount, setDealerRefreshCount] = useState(0);

  // Car Models by Brand - must be defined before getAvailableModels
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

  // Function to calculate market prices based on brand, model, year, and condition
  const getMarketPrices = () => {
    if (!mpBrand || !mpModel || !mpYear) return null;
    
    // Base prices by brand category
    const brandBasePrices: Record<string, number> = {
      'Toyota': 95000,
      'Hyundai': 75000,
      'Honda': 85000,
      'Kia': 70000,
      'Nissan': 80000,
      'Mazda': 78000,
      'Ford': 90000,
      'Chevrolet': 85000,
      'Mercedes': 250000,
      'BMW': 220000,
      'Lexus': 180000,
      'Audi': 200000
    };
    
    // Model price adjustment factors
    const modelFactors: Record<string, number> = {
      'Camry': 1.0, 'Corolla': 0.7, 'Land Cruiser': 2.8, 'Prado': 2.0, 'RAV4': 1.1,
      'Elantra': 0.8, 'Sonata': 1.0, 'Tucson': 1.0, 'Santa Fe': 1.4,
      'Accord': 1.1, 'Civic': 0.85, 'CR-V': 1.2,
      'Optima': 0.9, 'Sportage': 1.0, 'Sorento': 1.3,
      'Altima': 0.95, 'Patrol': 2.6, 'X-Trail': 1.1,
      'Mazda3': 0.85, 'Mazda6': 1.0, 'CX-5': 1.15,
      'Explorer': 1.5, 'F-150': 1.8,
      'Tahoe': 2.2, 'Silverado': 1.7,
      'C-Class': 1.0, 'E-Class': 1.4, 'S-Class': 2.5, 'G-Class': 4.0,
      '3 Series': 0.9, '5 Series': 1.3, '7 Series': 2.2, 'X5': 1.5,
      'ES': 1.0, 'LS': 2.0, 'LX': 3.5,
      'A4': 1.0, 'A6': 1.4, 'Q7': 1.6
    };
    
    const basePrice = brandBasePrices[mpBrand] || 80000;
    const modelFactor = modelFactors[mpModel] || 1.0;
    const yearNum = parseInt(mpYear);
    const currentYear = 2026;
    
    // Year depreciation (5% per year for used, 0% for new)
    const yearDiff = currentYear - yearNum;
    const yearFactor = mpCondition === 'new' ? 1.0 : Math.max(0.5, 1 - (yearDiff * 0.08));
    
    // Condition factor
    const conditionFactor = mpCondition === 'new' ? 1.0 : 0.75;
    
    // Calculate prices
    const avgPrice = Math.round(basePrice * modelFactor * yearFactor * conditionFactor);
    const lowestPrice = Math.round(avgPrice * 0.85);
    const highestPrice = Math.round(avgPrice * 1.15);
    
    return { lowestPrice, avgPrice, highestPrice };
  };

  // Calculate car valuation based on brand, model, year, condition, and mileage
  const calculateValuation = () => {
    if (!valBrand || !valModel) return null;

    // Base prices by brand
    const brandBasePrices: Record<string, number> = {
      'Toyota': 95000,
      'Hyundai': 75000,
      'Honda': 85000,
      'Kia': 70000,
      'Nissan': 80000,
      'Mazda': 78000,
      'Ford': 90000,
      'Chevrolet': 85000,
      'Mercedes': 250000,
      'BMW': 220000,
      'Lexus': 180000,
      'Audi': 200000
    };

    // Model factors
    const modelFactors: Record<string, number> = {
      'Camry': 1.0, 'Corolla': 0.7, 'Land Cruiser': 2.8, 'Prado': 2.0, 'RAV4': 1.1,
      'Elantra': 0.8, 'Sonata': 1.0, 'Tucson': 1.0, 'Santa Fe': 1.4,
      'Accord': 1.1, 'Civic': 0.85, 'CR-V': 1.2,
      'Optima': 0.9, 'Sportage': 1.0, 'Sorento': 1.3,
      'Altima': 0.95, 'Patrol': 2.6, 'X-Trail': 1.1,
      'Mazda3': 0.85, 'Mazda6': 1.0, 'CX-5': 1.15,
      'Explorer': 1.5, 'F-150': 1.8,
      'Tahoe': 2.2, 'Silverado': 1.7,
      'C-Class': 1.0, 'E-Class': 1.4, 'S-Class': 2.5, 'G-Class': 4.0,
      '3 Series': 0.9, '5 Series': 1.3, '7 Series': 2.2, 'X5': 1.5,
      'ES': 1.0, 'LS': 2.0, 'LX': 3.5,
      'A4': 1.0, 'A6': 1.4, 'Q7': 1.6
    };

    const basePrice = brandBasePrices[valBrand] || 80000;
    const modelFactor = modelFactors[valModel] || 1.0;

    // Year depreciation (8% per year from 2026)
    const yearDiff = 2026 - valYear;
    const yearFactor = Math.max(0.3, 1 - (yearDiff * 0.08));

    // Condition factor
    const conditionFactors = {
      'excellent': 1.0,
      'good': 0.85,
      'fair': 0.70
    };
    const conditionFactor = conditionFactors[valCondition];

    // Mileage factor (deduct based on mileage)
    const avgMileagePerYear = 15000;
    const expectedMileage = Math.max(0, 2026 - valYear) * avgMileagePerYear;
    const mileageDiff = valMileage - expectedMileage;
    let mileageFactor = 1.0;
    if (mileageDiff > 0) {
      // Deduct 1% for every 10,000 km over expected
      mileageFactor = Math.max(0.7, 1 - (mileageDiff / 1000000));
    } else if (mileageDiff < 0) {
      // Add up to 5% for lower than expected mileage
      mileageFactor = Math.min(1.05, 1 + (Math.abs(mileageDiff) / 200000));
    }

    // Calculate base value
    const baseValue = basePrice * modelFactor * yearFactor * conditionFactor * mileageFactor;

    // Calculate range
    const marketValue = Math.round(baseValue);
    const dealerValue = Math.round(baseValue * 0.92); // Dealer pays less
    const privateSaleValue = Math.round(baseValue * 1.05); // Private sale can be higher
    const lowRange = Math.round(baseValue * 0.90);
    const highRange = Math.round(baseValue * 1.10);

    return {
      marketValue,
      dealerValue,
      privateSaleValue,
      lowRange,
      highRange
    };
  };

  // Get dealers based on condition and refresh count
  const getDealers = () => {
    const prices = getMarketPrices();
    if (!prices) return [];

    // Multiple dealer sets that rotate on refresh
    const newDealersSets = [
      [ // Set 1
        {
          dealer: isRTL ? 'الوكيل الرسمي' : 'Official Dealer',
          price: prices.highestPrice,
          status: 'new',
          location: isRTL ? 'الرياض' : 'Riyadh',
          rating: 5,
          verified: true,
          phone: '+966500000001'
        },
        {
          dealer: isRTL ? 'معرض الخليج' : 'Gulf Showroom',
          price: Math.round(prices.avgPrice * 1.05),
          status: 'new',
          location: isRTL ? 'جدة' : 'Jeddah',
          rating: 4.5,
          verified: true,
          phone: '+966500000002'
        },
        {
          dealer: isRTL ? 'معرض النور' : 'Al Noor Showroom',
          price: prices.avgPrice,
          status: 'new',
          location: isRTL ? 'الدمام' : 'Dammam',
          rating: 4,
          verified: false,
          phone: '+966500000003'
        },
        {
          dealer: isRTL ? 'معرض الرياض' : 'Riyadh Showroom',
          price: Math.round(prices.avgPrice * 0.98),
          status: 'new',
          location: isRTL ? 'الرياض' : 'Riyadh',
          rating: 4,
          verified: true,
          phone: '+966500000004'
        },
        {
          dealer: isRTL ? 'معرض الجزيرة' : 'Al Jazira Showroom',
          price: Math.round(prices.avgPrice * 0.95),
          status: 'new',
          location: isRTL ? 'الخبر' : 'Khobar',
          rating: 4.2,
          verified: true,
          phone: '+966500000005'
        },
      ],
      [ // Set 2
        {
          dealer: isRTL ? 'وكالة تويوتا' : 'Toyota Agency',
          price: Math.round(prices.avgPrice * 1.02),
          status: 'new',
          location: isRTL ? 'جدة' : 'Jeddah',
          rating: 4.8,
          verified: true,
          phone: '+966500000101'
        },
        {
          dealer: isRTL ? 'معرض السلام' : 'Al Salam Showroom',
          price: Math.round(prices.avgPrice * 0.97),
          status: 'new',
          location: isRTL ? 'الرياض' : 'Riyadh',
          rating: 4.6,
          verified: true,
          phone: '+966500000102'
        },
        {
          dealer: isRTL ? 'معرض الأمانة' : 'Al Amana Showroom',
          price: Math.round(prices.avgPrice * 0.94),
          status: 'new',
          location: isRTL ? 'الخبر' : 'Khobar',
          rating: 4.3,
          verified: true,
          phone: '+966500000103'
        },
        {
          dealer: isRTL ? 'معرض الوفاء' : 'Al Wefaq Showroom',
          price: Math.round(prices.avgPrice * 0.92),
          status: 'new',
          location: isRTL ? 'الدمام' : 'Dammam',
          rating: 4.1,
          verified: false,
          phone: '+966500000104'
        },
        {
          dealer: isRTL ? 'معرض النخبة' : 'Elite Showroom',
          price: Math.round(prices.avgPrice * 0.96),
          status: 'new',
          location: isRTL ? 'الرياض' : 'Riyadh',
          rating: 4.7,
          verified: true,
          phone: '+966500000105'
        },
      ],
      [ // Set 3
        {
          dealer: isRTL ? 'معرض العاصمة' : 'Capital Showroom',
          price: Math.round(prices.avgPrice * 0.93),
          status: 'new',
          location: isRTL ? 'الرياض' : 'Riyadh',
          rating: 4.4,
          verified: true,
          phone: '+966500000201'
        },
        {
          dealer: isRTL ? 'معرض البحر' : 'Al Bahr Showroom',
          price: Math.round(prices.avgPrice * 0.99),
          status: 'new',
          location: isRTL ? 'جدة' : 'Jeddah',
          rating: 4.5,
          verified: true,
          phone: '+966500000202'
        },
        {
          dealer: isRTL ? 'معرض الصفاء' : 'Al Safa Showroom',
          price: Math.round(prices.avgPrice * 0.91),
          status: 'new',
          location: isRTL ? 'مكة' : 'Makkah',
          rating: 4.2,
          verified: false,
          phone: '+966500000203'
        },
        {
          dealer: isRTL ? 'معرض الرواد' : 'Pioneers Showroom',
          price: Math.round(prices.avgPrice * 0.95),
          status: 'new',
          location: isRTL ? 'الطائف' : 'Taif',
          rating: 4.0,
          verified: true,
          phone: '+966500000204'
        },
        {
          dealer: isRTL ? 'معرض المدينة' : 'City Showroom',
          price: Math.round(prices.avgPrice * 0.97),
          status: 'new',
          location: isRTL ? 'المدينة' : 'Madinah',
          rating: 4.6,
          verified: true,
          phone: '+966500000205'
        },
      ],
    ];

    const usedDealersSets = [
      [ // Set 1
        {
          dealer: isRTL ? 'معرض السيارات المستعملة' : 'Used Cars Showroom',
          price: Math.round(prices.avgPrice * 0.85),
          status: 'used',
          location: isRTL ? 'الرياض' : 'Riyadh',
          rating: 4.2,
          verified: true,
          km: Math.round((2026 - parseInt(mpYear)) * 15000),
          phone: '+966500000010'
        },
        {
          dealer: isRTL ? 'سوق السيارات' : 'Cars Market',
          price: Math.round(prices.avgPrice * 0.8),
          status: 'used',
          location: isRTL ? 'جدة' : 'Jeddah',
          rating: 3.8,
          verified: false,
          km: Math.round((2026 - parseInt(mpYear)) * 20000),
          phone: '+966500000011'
        },
        {
          dealer: isRTL ? 'معرض النور للمستعمل' : 'Al Noor Used Cars',
          price: Math.round(prices.avgPrice * 0.9),
          status: 'used',
          location: isRTL ? 'الدمام' : 'Dammam',
          rating: 4.5,
          verified: true,
          km: Math.round((2026 - parseInt(mpYear)) * 12000),
          phone: '+966500000012'
        },
        {
          dealer: isRTL ? 'حراج السيارات' : 'Cars Auction',
          price: `${(prices.lowestPrice * 0.9 / 1000).toFixed(0)}K - ${(prices.avgPrice * 0.95 / 1000).toFixed(0)}K`,
          status: 'used',
          location: isRTL ? 'متعدد' : 'Various',
          rating: 3.5,
          verified: false,
          km: isRTL ? 'متفاوت' : 'Varies',
          phone: '+966500000013'
        },
      ],
      [ // Set 2
        {
          dealer: isRTL ? 'معرض الفاخر للمستعمل' : 'Fakher Used Cars',
          price: Math.round(prices.avgPrice * 0.88),
          status: 'used',
          location: isRTL ? 'الرياض' : 'Riyadh',
          rating: 4.4,
          verified: true,
          km: Math.round((2026 - parseInt(mpYear)) * 10000),
          phone: '+966500000110'
        },
        {
          dealer: isRTL ? 'معرض الإمتياز' : 'Excellence Showroom',
          price: Math.round(prices.avgPrice * 0.82),
          status: 'used',
          location: isRTL ? 'جدة' : 'Jeddah',
          rating: 4.0,
          verified: true,
          km: Math.round((2026 - parseInt(mpYear)) * 18000),
          phone: '+966500000111'
        },
        {
          dealer: isRTL ? 'سوق الحراج' : 'Auction Market',
          price: Math.round(prices.avgPrice * 0.78),
          status: 'used',
          location: isRTL ? 'الخبر' : 'Khobar',
          rating: 3.6,
          verified: false,
          km: Math.round((2026 - parseInt(mpYear)) * 25000),
          phone: '+966500000112'
        },
        {
          dealer: isRTL ? 'معرض الدار' : 'Dar Showroom',
          price: Math.round(prices.avgPrice * 0.86),
          status: 'used',
          location: isRTL ? 'الدمام' : 'Dammam',
          rating: 4.3,
          verified: true,
          km: Math.round((2026 - parseInt(mpYear)) * 14000),
          phone: '+966500000113'
        },
      ],
      [ // Set 3
        {
          dealer: isRTL ? 'معرض الذهب للمستعمل' : 'Gold Used Cars',
          price: Math.round(prices.avgPrice * 0.84),
          status: 'used',
          location: isRTL ? 'مكة' : 'Makkah',
          rating: 4.1,
          verified: true,
          km: Math.round((2026 - parseInt(mpYear)) * 16000),
          phone: '+966500000210'
        },
        {
          dealer: isRTL ? 'معرض الريان' : 'Rayan Showroom',
          price: Math.round(prices.avgPrice * 0.81),
          status: 'used',
          location: isRTL ? 'الطائف' : 'Taif',
          rating: 3.9,
          verified: false,
          km: Math.round((2026 - parseInt(mpYear)) * 22000),
          phone: '+966500000211'
        },
        {
          dealer: isRTL ? 'معرض الأصالة' : 'Asala Showroom',
          price: Math.round(prices.avgPrice * 0.87),
          status: 'used',
          location: isRTL ? 'المدينة' : 'Madinah',
          rating: 4.5,
          verified: true,
          km: Math.round((2026 - parseInt(mpYear)) * 11000),
          phone: '+966500000212'
        },
        {
          dealer: isRTL ? 'معرض النجمة' : 'Star Showroom',
          price: Math.round(prices.avgPrice * 0.79),
          status: 'used',
          location: isRTL ? 'جازان' : 'Jazan',
          rating: 3.7,
          verified: false,
          km: Math.round((2026 - parseInt(mpYear)) * 28000),
          phone: '+966500000213'
        },
      ],
    ];

    if (mpCondition === 'new') {
      return newDealersSets[dealerRefreshCount % newDealersSets.length];
    } else {
      return usedDealersSets[dealerRefreshCount % usedDealersSets.length];
    }
  };

  // Saudi Banks Data
  const saudiBanks = [
    { id: 1, nameAr: 'البنك الأهلي', nameEn: 'SNB', logo: '🏦', rate: 4.5, minSalary: 3000 },
    { id: 2, nameAr: 'بنك الراجحي', nameEn: 'Al Rajhi', logo: '🏛️', rate: 4.25, minSalary: 3000 },
    { id: 3, nameAr: 'بنك الرياض', nameEn: 'Riyad Bank', logo: '🏢', rate: 4.75, minSalary: 4000 },
    { id: 4, nameAr: 'البنك العربي', nameEn: 'Arab Bank', logo: '🏛️', rate: 4.9, minSalary: 5000 },
    { id: 5, nameAr: 'بنك الجزيرة', nameEn: 'Al Jazira', logo: '🏦', rate: 4.85, minSalary: 4000 },
    { id: 6, nameAr: 'البنك السعودي الفرنسي', nameEn: 'Banque Saudi Fransi', logo: '🏛️', rate: 4.95, minSalary: 4500 },
  ];

  // Get models based on selected brand
  const getAvailableModels = () => {
    if (!carRequestBrand || !carModelsByBrand[carRequestBrand]) return [];
    return carModelsByBrand[carRequestBrand];
  };

  // Trim levels
  const trimLevels = [
    { id: 'full', nameAr: 'فل كامل', nameEn: 'Full Option' },
    { id: 'high', nameAr: 'عالي', nameEn: 'High' },
    { id: 'medium', nameAr: 'متوسط', nameEn: 'Medium' },
    { id: 'basic', nameAr: 'أساسي', nameEn: 'Basic' },
  ];

  // Order Tracking States
  const [orderTrackingOpen, setOrderTrackingOpen] = useState(false);
  const [orderSearchNumber, setOrderSearchNumber] = useState('');
  const [foundOrder, setFoundOrder] = useState<any>(null);
  const [ordersList, setOrdersList] = useState<any[]>([]);

  // Service Provider Dashboard States
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [adminPinError, setAdminPinError] = useState(false);
  const [pendingAdminAction, setPendingAdminAction] = useState<string | null>(null);
  const [isNavigatingFromDashboard, setIsNavigatingFromDashboard] = useState(false);
  const ADMIN_PIN = '0011003300';
  const [adminEmail, setAdminEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [loginStep, setLoginStep] = useState<'email' | 'sending' | 'code'>('email');
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [providerType, setProviderType] = useState<'agency' | 'financing' | ''>('');
  const [providerName, setProviderName] = useState('');
  const [providerEmail, setProviderEmail] = useState('');
  const [providerPassword, setProviderPassword] = useState('');
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedProviderOrders, setSelectedProviderOrders] = useState<any[]>([]);

  // Announcement Form States
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementDesc, setAnnouncementDesc] = useState('');
  const [announcementStartDate, setAnnouncementStartDate] = useState('');
  const [announcementEndDate, setAnnouncementEndDate] = useState('');
  const [announcementType, setAnnouncementType] = useState('');
  const [announcementImage, setAnnouncementImage] = useState<string | null>(null);
  const [announcementSubmitting, setAnnouncementSubmitting] = useState(false);

  // Special Offer Form States
  const [offerTitle, setOfferTitle] = useState('');
  const [offerDesc, setOfferDesc] = useState('');
  const [offerDiscount, setOfferDiscount] = useState('');
  const [offerStartDate, setOfferStartDate] = useState('');
  const [offerEndDate, setOfferEndDate] = useState('');
  const [offerTerms, setOfferTerms] = useState('');
  const [offerSubmitting, setOfferSubmitting] = useState(false);

  // Service Provider Form States
  const [spName, setSpName] = useState('');
  const [spType, setSpType] = useState('');
  const [spRegion, setSpRegion] = useState('');
  const [spAddress, setSpAddress] = useState('');
  const [spPhone, setSpPhone] = useState('');
  const [spEmail, setSpEmail] = useState('');
  const [spAuthorizedBrands, setSpAuthorizedBrands] = useState('');
  const [spSubmitting, setSpSubmitting] = useState(false);

  // Compare Form States
  const [compareSearchBrand, setCompareSearchBrand] = useState('');
  const [compareSearchModel, setCompareSearchModel] = useState('');
  const [compareSearchYear, setCompareSearchYear] = useState('2024');
  const [showCompareForm, setShowCompareForm] = useState(false);
  const [comparisonStarted, setComparisonStarted] = useState(false);

  // Privacy & Terms Dialog States
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [selectedSettingsItem, setSelectedSettingsItem] = useState<string | null>(null);

  // Published Announcements & Offers
  const [publishedAnnouncements, setPublishedAnnouncements] = useState<any[]>([]);
  const [publishedOffers, setPublishedOffers] = useState<any[]>([]);
  const [hasNewOffers, setHasNewOffers] = useState(false);

  // Car Services & Features - مرتبة حسب الأهمية والأولوية
  const appFeatures = [
    {
      id: 'order-tracking',
      titleAr: 'تتبع الطلب',
      titleEn: 'Order Tracking',
      descriptionAr: 'تتبع حالة طلب التمويل الخاص بك',
      descriptionEn: 'Track your financing application status',
      icon: ClipboardList,
      color: 'bg-cyan-500',
    },
    {
      id: 'financing',
      titleAr: 'الحسبة',
      titleEn: 'Calculation',
      descriptionAr: 'حساب التمويل حسب الراتب وعروض البنوك',
      descriptionEn: 'Salary-based financing calculation and bank offers',
      icon: Calculator,
      color: 'bg-blue-500',
    },
    {
      id: 'bank-offers',
      titleAr: 'عروض التمويل',
      titleEn: 'Bank Offers',
      descriptionAr: 'قارن عروض التمويل من البنوك السعودية',
      descriptionEn: 'Compare financing offers from Saudi banks',
      icon: Landmark,
      color: 'bg-green-600',
    },
    {
      id: 'car-offers',
      titleAr: 'عروض السيارات',
      titleEn: 'Car Offers',
      descriptionAr: 'أفضل عروض السيارات الجديدة والمستعملة',
      descriptionEn: 'Best new and used car offers',
      icon: Car,
      color: 'bg-cyan-500',
    },
    {
      id: 'market-prices',
      titleAr: 'أسعار السوق',
      titleEn: 'Market Prices',
      descriptionAr: 'مقارنة أسعار السيارات في السوق السعودي',
      descriptionEn: 'Compare car prices in Saudi market',
      icon: TrendingUp,
      color: 'bg-emerald-500',
    },
    {
      id: 'valuation',
      titleAr: 'تقييم السيارة',
      titleEn: 'Car Valuation',
      descriptionAr: 'تقييم قيمة سيارتك في السوق',
      descriptionEn: 'Evaluate your car market value',
      icon: DollarSign,
      color: 'bg-purple-500',
    },
    {
      id: 'offers',
      titleAr: 'العروض',
      titleEn: 'Offers',
      descriptionAr: 'عروض السيارات والعناية بالسيارات',
      descriptionEn: 'Cars and car care offers',
      icon: Sparkles,
      color: 'bg-amber-500',
    },
    {
      id: 'maintenance',
      titleAr: 'الصيانة',
      titleEn: 'Maintenance',
      descriptionAr: 'جدول صيانة سيارتك ونصائح العناية',
      descriptionEn: 'Your car maintenance schedule and care tips',
      icon: Cog,
      color: 'bg-orange-500',
    },
    {
      id: 'extended-warranty',
      titleAr: 'الضمان الممتد',
      titleEn: 'Extended Warranty',
      descriptionAr: 'ضمان يبدأ بعد انتهاء ضمان الوكيل',
      descriptionEn: 'Warranty after dealer warranty expires',
      icon: Shield,
      color: 'bg-teal-500',
    },
    {
      id: 'settings',
      titleAr: 'الإعدادات والضبط',
      titleEn: 'Settings',
      descriptionAr: 'إعدادات التطبيق والتفضيلات',
      descriptionEn: 'App settings and preferences',
      icon: Settings,
      color: 'bg-gray-500',
    },
  ];

  // Currency helper
  const getCurrencyDisplay = () => isRTL ? 'ريال' : 'SAR';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load bank offers on mount
  useEffect(() => {
    // Helper function to calculate monthly payment
    const calculateMonthlyPayment = (principal: number, months: number, annualRate: number) => {
      const r = annualRate / 12;
      return principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    };

    // Default car price for initial calculations
    const defaultCarPrice = 100000;

    const defaultBankOffers = [
      { id: 'alrajhi', bankName: 'بنك الراجحي', bankNameEn: 'Al Rajhi Bank', interestRate: 4.75, minDownPayment: 10, maxLoanTerm: 60, minSalary: 3000, eligible: true, features: ['أقل نسبة ربح', 'موافقة سريعة', 'تأجيل قسط'], fees: 1500, logo: '🏦' },
      { id: 'albilad', bankName: 'بنك البلاد', bankNameEn: 'Al Bilad Bank', interestRate: 4.85, minDownPayment: 15, maxLoanTerm: 60, minSalary: 3500, eligible: true, features: ['تمويل فوري', 'بدون رسوم'], fees: 1000, logo: '🏦' },
      { id: 'snb', bankName: 'البنك الأهلي السعودي', bankNameEn: 'SNB', interestRate: 4.9, minDownPayment: 15, maxLoanTerm: 72, minSalary: 4000, eligible: true, features: ['أطول فترة سداد', 'برنامج ولاء'], fees: 2000, logo: '🏦' },
      { id: 'riyadbank', bankName: 'بنك الرياض', bankNameEn: 'Riyad Bank', interestRate: 5.0, minDownPayment: 20, maxLoanTerm: 60, minSalary: 4500, eligible: true, features: ['تأمين مجاني', 'خدمة متميزة'], fees: 1800, logo: '🏦' },
      { id: 'arabnational', bankName: 'البنك العربي الوطني', bankNameEn: 'Arab National Bank', interestRate: 5.1, minDownPayment: 20, maxLoanTerm: 60, minSalary: 4000, eligible: true, features: ['مرونة في السداد'], fees: 1200, logo: '🏦' },
      { id: 'sabb', bankName: 'بنك ساب', bankNameEn: 'SABB', interestRate: 5.25, minDownPayment: 20, maxLoanTerm: 48, minSalary: 5000, eligible: true, features: ['خدمة VIP'], fees: 2500, logo: '🏦' },
      { id: 'alinma', bankName: 'بنك الإنماء', bankNameEn: 'Alinma Bank', interestRate: 4.95, minDownPayment: 15, maxLoanTerm: 60, minSalary: 3500, eligible: true, features: ['تمويل إسلامي', 'موافقة فورية'], fees: 800, logo: '🏦' },
      { id: 'firstab', bankName: 'البنك الأول', bankNameEn: 'First Abu Dhabi', interestRate: 5.15, minDownPayment: 20, maxLoanTerm: 60, minSalary: 5000, eligible: true, features: ['خدمة مخصصة'], fees: 2200, logo: '🏦' },
    ].map(bank => {
      const financingAmount = Math.round(defaultCarPrice * (100 - bank.minDownPayment) / 100);
      const months = bank.maxLoanTerm;
      const annualRate = bank.interestRate / 100;
      const monthlyPayment = Math.round(calculateMonthlyPayment(financingAmount, months, annualRate));
      const totalAmount = Math.round(monthlyPayment * months);
      const profitAmount = Math.round(totalAmount - financingAmount);

      return {
        ...bank,
        financingAmount,
        monthlyPayment,
        totalAmount,
        profitAmount,
      };
    });

    setBankOffers(defaultBankOffers);
  }, []);

  useEffect(() => {
    // Smooth scroll to bottom when chat messages change
    const chatContainer = document.querySelector('[data-chat-scroll] > div');
    if (chatContainer) {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatMessages]);

  // Auto-scroll financing chatbot to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [applicationMessages, applicationLoading]);

  // Handle Manual Car Entry Analysis
  const handleManualCarAnalysis = () => {
    if (!manualCarData.brand || !manualCarData.model) {
      toast({ title: isRTL ? 'الرجاء إدخال الماركة والموديل' : 'Please enter brand and model', variant: 'destructive' });
      return;
    }

    // Create vehicle object from manual data
    const vehicle: Vehicle = {
      id: `manual-${Date.now()}`,
      brand: manualCarData.brand,
      model: manualCarData.model,
      year: manualCarData.year ? parseInt(manualCarData.year) : undefined,
      trim: manualCarData.trim || undefined,
      price: manualCarData.price ? parseFloat(manualCarData.price) : undefined,
      currency: 'SAR',
      mileage: manualCarData.mileage ? parseInt(manualCarData.mileage) : undefined,
      condition: manualCarData.condition,
      color: manualCarData.color || undefined,
      engine: manualCarData.engine || undefined,
      horsepower: manualCarData.horsepower ? parseInt(manualCarData.horsepower) : undefined,
      transmission: manualCarData.transmission || undefined,
      fuelType: manualCarData.fuelType || undefined,
      drivetrain: manualCarData.drivetrain || undefined,
      seats: manualCarData.seats ? parseInt(manualCarData.seats) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCurrentVehicle(vehicle);
    setViewState('results');
    setManualCarEntryOpen(false);

    // Reset form
    setManualCarData({
      brand: '', model: '', year: '2026', trim: '', price: '', mileage: '',
      condition: 'new', color: '', fuelType: '', transmission: '',
      engine: '', horsepower: '', seats: '', drivetrain: '',
    });

    // Fetch market analysis and competitors for the manual entry
    fetchMarketAnalysis(vehicle);
    fetchCompetitors(vehicle);

    // Calculate financing if price is provided
    if (vehicle.price) {
      calculateFinancing(vehicle.price);
    }

    toast({
      title: isRTL ? 'تم تحليل السيارة' : 'Car Analyzed',
      description: `${vehicle.brand} ${vehicle.model}`,
    });
  };

  // Analyze link
  const handleAnalyzeLink = async () => {
    if (!linkUrl.trim()) {
      toast({ title: t.enterUrl, variant: 'destructive' });
      return;
    }

    setIsAnalyzing(true);
    setViewState('analyzing');

    try {
      const response = await fetch('/api/analyze-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: linkUrl }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || t.analysisFailed);
      }

      setCurrentVehicle(data.vehicle);
      setViewState('results');
      toast({ title: t.analysisSuccess, description: `${data.vehicle.brand} ${data.vehicle.model}` });
      
      if (data.vehicle.price) {
        calculateFinancing(data.vehicle.price);
      }
      
      fetchMarketAnalysis(data.vehicle);
      fetchCompetitors(data.vehicle);

    } catch (error) {
      console.error('Analysis error:', error);
      toast({ 
        title: t.analysisFailed, 
        description: error instanceof Error ? error.message : t.pleaseTryAgain,
        variant: 'destructive' 
      });
      setViewState('input');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Analyze image
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setViewState('analyzing');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || t.analysisFailed);
      }

      setCurrentVehicle(data.vehicle);
      setViewState('results');
      toast({ title: t.carIdentified, description: `${data.vehicle.brand} ${data.vehicle.model} (${data.vehicle.confidence}% ${t.confidence})` });
      
      if (data.vehicle.price) {
        calculateFinancing(data.vehicle.price);
      }
      
      fetchMarketAnalysis(data.vehicle);
      fetchCompetitors(data.vehicle);

    } catch (error) {
      console.error('Image analysis error:', error);
      toast({ 
        title: t.analysisFailed, 
        description: error instanceof Error ? error.message : t.pleaseTryAgain,
        variant: 'destructive' 
      });
      setViewState('input');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle QR Scan
  const handleQRScan = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setViewState('analyzing');

    try {
      // For QR scanning, we'll use the image analysis API
      // In a real app, you'd have a dedicated QR scanning API
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || t.analysisFailed);
      }

      setCurrentVehicle(data.vehicle);
      setViewState('results');
      toast({ title: t.carIdentified, description: `${data.vehicle.brand} ${data.vehicle.model}` });
      
      if (data.vehicle.price) {
        calculateFinancing(data.vehicle.price);
      }
      
      fetchMarketAnalysis(data.vehicle);
      fetchCompetitors(data.vehicle);

    } catch (error) {
      console.error('QR scan error:', error);
      toast({ 
        title: t.analysisFailed, 
        description: error instanceof Error ? error.message : t.pleaseTryAgain,
        variant: 'destructive' 
      });
      setViewState('input');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Fetch market analysis
  const fetchMarketAnalysis = async (vehicle: Vehicle) => {
    try {
      const response = await fetch('/api/market-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicle, language }),
      });

      const data = await response.json();

      if (data.success) {
        setMarketAnalysis(data.marketAnalysis);
      }
    } catch (error) {
      console.error('Market analysis error:', error);
    }
  };

  // Fetch competitors
  const fetchCompetitors = async (vehicle: Vehicle) => {
    setLoadingCompetitors(true);
    try {
      const response = await fetch('/api/competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicle, language }),
      });

      const data = await response.json();

      if (data.success) {
        setCompetitors(data);
      }
    } catch (error) {
      console.error('Competitors fetch error:', error);
    } finally {
      setLoadingCompetitors(false);
    }
  };

  // Handle competitor click - analyze the competitor
  const handleCompetitorClick = async (comp: any) => {
    setIsAnalyzing(true);
    setViewState('analyzing');
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    toast({ 
      title: isRTL ? `جاري تحليل ${comp.brand} ${comp.model}` : `Analyzing ${comp.brand} ${comp.model}...`,
      description: isRTL ? 'يرجى الانتظار' : 'Please wait...',
    });
    
    try {
      // Fetch full vehicle data from the API
      const response = await fetch('/api/analyze-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: `https://example.com/${comp.brand.toLowerCase()}-${comp.model.toLowerCase()}`,
          language 
        }),
      });

      const data = await response.json();

      if (data.success && data.vehicle) {
        setCurrentVehicle(data.vehicle);
        setViewState('results');
        setActiveTab('specs');
        
        if (data.vehicle.price) {
          calculateFinancing(data.vehicle.price);
        }
        
        await fetchMarketAnalysis(data.vehicle);
        await fetchCompetitors(data.vehicle);
        
        setIsAnalyzing(false);
        
        toast({ 
          title: isRTL ? `تم تحليل ${comp.brand} ${comp.model}` : `${comp.brand} ${comp.model} Analyzed!`,
          description: isRTL ? 'يمكنك الآن مراجعة التحليل الكامل' : 'You can now review the full analysis',
        });
      } else {
        throw new Error('Failed to get vehicle data');
      }
    } catch (error) {
      // Fallback to basic data if API fails
      const competitorVehicle: Vehicle = {
        brand: comp.brand,
        model: comp.model,
        year: comp.year || 2024,
        price: comp.averagePrice,
        horsepower: comp.horsepower,
        fuelConsumption: comp.fuelConsumption,
        confidence: 100,
      };
      
      setCurrentVehicle(competitorVehicle);
      setViewState('results');
      setActiveTab('specs');
      
      if (comp.averagePrice) {
        calculateFinancing(comp.averagePrice);
      }
      
      await fetchMarketAnalysis(competitorVehicle);
      await fetchCompetitors(competitorVehicle);
      
      setIsAnalyzing(false);
      
      toast({ 
        title: isRTL ? `تم تحليل ${comp.brand} ${comp.model}` : `${comp.brand} ${comp.model} Analyzed!`,
        description: isRTL ? 'تم تحميل البيانات الأساسية' : 'Basic data loaded',
      });
    }
  };

  // Best Selling Cars Data
  const bestSellingCars = [
    { brand: 'Toyota', model: 'Camry', year: 2024, price: 115000, horsepower: 203, fuelConsumption: 6.5, category: 'Sedan', salesRank: 1, image: '/cars/camry.jpg' },
    { brand: 'Hyundai', model: 'Elantra', year: 2024, price: 75000, horsepower: 147, fuelConsumption: 5.8, category: 'Sedan', salesRank: 2, image: '/cars/elantra.jpg' },
    { brand: 'Toyota', model: 'Corolla', year: 2024, price: 85000, horsepower: 169, fuelConsumption: 5.5, category: 'Sedan', salesRank: 3, image: '/cars/corolla.jpg' },
    { brand: 'Hyundai', model: 'Tucson', year: 2024, price: 105000, horsepower: 187, fuelConsumption: 7.2, category: 'SUV', salesRank: 4, image: '/cars/tucson.jpg' },
    { brand: 'Toyota', model: 'Land Cruiser', year: 2024, price: 335000, horsepower: 409, fuelConsumption: 12.5, category: 'SUV', salesRank: 5, image: '/cars/landcruiser.jpg' },
    { brand: 'Honda', model: 'Accord', year: 2024, price: 125000, horsepower: 192, fuelConsumption: 6.2, category: 'Sedan', salesRank: 6, image: '/cars/accord.jpg' },
    { brand: 'Kia', model: 'Sportage', year: 2024, price: 95000, horsepower: 187, fuelConsumption: 7.0, category: 'SUV', salesRank: 7, image: '/cars/sportage.jpg' },
    { brand: 'Nissan', model: 'Patrol', year: 2024, price: 295000, horsepower: 400, fuelConsumption: 14.0, category: 'SUV', salesRank: 8, image: '/cars/patrol.jpg' },
  ];

  // Handle best selling car click - analyze the car
  const handleBestSellingCarClick = async (car: any) => {
    setIsAnalyzing(true);
    setViewState('analyzing');
    
    toast({ 
      title: isRTL ? `جاري تحليل ${car.brand} ${car.model}` : `Analyzing ${car.brand} ${car.model}...`,
      description: isRTL ? 'يرجى الانتظار' : 'Please wait...',
    });
    
    try {
      // Fetch full vehicle data from the API
      const response = await fetch('/api/analyze-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: `https://example.com/${car.brand.toLowerCase()}-${car.model.toLowerCase()}`,
          language 
        }),
      });

      const data = await response.json();

      if (data.success && data.vehicle) {
        setCurrentVehicle(data.vehicle);
        setViewState('results');
        setActiveTab('specs');
        
        if (data.vehicle.price) {
          calculateFinancing(data.vehicle.price);
        }
        
        await fetchMarketAnalysis(data.vehicle);
        await fetchCompetitors(data.vehicle);
        
        toast({ 
          title: isRTL ? `تم تحليل ${car.brand} ${car.model}` : `${car.brand} ${car.model} Analyzed!`,
          description: isRTL ? 'يمكنك الآن مراجعة التحليل الكامل' : 'You can now review the full analysis',
        });
      } else {
        throw new Error('Failed to get vehicle data');
      }
    } catch (error) {
      // Fallback to basic data if API fails
      const carVehicle: Vehicle = {
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
        horsepower: car.horsepower,
        fuelConsumption: car.fuelConsumption,
        confidence: 100,
      };
      
      setCurrentVehicle(carVehicle);
      setViewState('results');
      setActiveTab('specs');
      
      if (car.price) {
        calculateFinancing(car.price);
      }
      
      await fetchMarketAnalysis(carVehicle);
      await fetchCompetitors(carVehicle);
      
      toast({ 
        title: isRTL ? `تم تحليل ${car.brand} ${car.model}` : `${car.brand} ${car.model} Analyzed!`,
        description: isRTL ? 'تم تحميل البيانات الأساسية' : 'Basic data loaded',
      });
    }
    
    setIsAnalyzing(false);
  };

  // Handle alternative vehicle click - analyze the alternative
  const handleAlternativeClick = async (altString: string) => {
    setIsAnalyzing(true);
    setViewState('analyzing');
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Parse the alternative string to extract brand and model
    // Examples: "Toyota Camry", "Hyundai Elantra 2024", "Honda Accord"
    const parts = altString.split(' ');
    let brand = '';
    let model = '';
    
    // Common brand names to identify
    const knownBrands = ['Toyota', 'Hyundai', 'Honda', 'Nissan', 'Kia', 'Mazda', 'Ford', 'Chevrolet', 'Mercedes', 'BMW', 'Audi', 'Lexus', 'تويوتا', 'هيونداي', 'هوندا', 'نيسان', 'كيا', 'مازدا', 'فورد', 'شيفروليه', 'مرسيدس', 'بي إم دبليو', 'أودي', 'لكزس'];
    
    for (const part of parts) {
      if (knownBrands.some(b => b.toLowerCase() === part.toLowerCase())) {
        brand = part;
      } else if (brand && !part.match(/^\d{4}$/)) {
        // Add to model if it's not a year
        model = model ? `${model} ${part}` : part;
      }
    }
    
    // If brand not found, use first word as brand
    if (!brand && parts.length > 0) {
      brand = parts[0];
      model = parts.slice(1).filter(p => !p.match(/^\d{4}$/)).join(' ');
    }
    
    toast({ 
      title: isRTL ? `جاري تحليل ${altString}` : `Analyzing ${altString}...`,
      description: isRTL ? 'يرجى الانتظار' : 'Please wait...',
    });
    
    try {
      // Fetch full vehicle data from the API
      const response = await fetch('/api/analyze-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: `https://example.com/${brand.toLowerCase()}-${model.toLowerCase().replace(/\s+/g, '-')}`,
          language 
        }),
      });

      const data = await response.json();

      if (data.success && data.vehicle) {
        setCurrentVehicle(data.vehicle);
        setViewState('results');
        setActiveTab('specs');
        
        if (data.vehicle.price) {
          calculateFinancing(data.vehicle.price);
        }
        
        await fetchMarketAnalysis(data.vehicle);
        await fetchCompetitors(data.vehicle);
        
        setIsAnalyzing(false);
        
        toast({ 
          title: isRTL ? `تم تحليل ${altString}` : `${altString} Analyzed!`,
          description: isRTL ? 'يمكنك الآن مراجعة التحليل الكامل' : 'You can now review the full analysis',
        });
      } else {
        throw new Error('Failed to get vehicle data');
      }
    } catch (error) {
      // Fallback to basic data if API fails
      const altVehicle: Vehicle = {
        brand: brand,
        model: model,
        year: 2024,
        confidence: 100,
      };
      
      setCurrentVehicle(altVehicle);
      setViewState('results');
      setActiveTab('specs');
      
      await fetchMarketAnalysis(altVehicle);
      await fetchCompetitors(altVehicle);
      
      toast({ 
        title: isRTL ? `تم تحليل ${altString}` : `${altString} Analyzed!`,
        description: isRTL ? 'تم تحميل البيانات الأساسية' : 'Basic data loaded',
      });
    }
    
    setIsAnalyzing(false);
  };

  // Calculate financing
  const calculateFinancing = async (price: number, params?: Partial<typeof financingParams>) => {
    const finalParams = { ...financingParams, ...params };
    
    try {
      const response = await fetch('/api/financing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehiclePrice: price,
          downPaymentPercent: finalParams.downPayment,
          loanTerm: finalParams.loanTerm,
          interestRate: finalParams.interestRate,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFinancingResult(data.calculation);
        setBankOffers(data.bankOffers);
      }
    } catch (error) {
      console.error('Financing calculation error:', error);
    }
  };

  // Send chat message
  const handleSendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = {
      id: `msg_${Date.now()}`,
      role: 'user' as const,
      content: chatInput,
      timestamp: new Date(),
    };

    addChatMessage(userMessage);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: chatInput,
          vehicle: currentVehicle,
          history: chatMessages.map(m => ({ role: m.role, content: m.content })),
          language,
        }),
      });

      const data = await response.json();

      if (data.success) {
        addChatMessage({
          id: `msg_${Date.now()}_ai`,
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({ title: t.failedToGetResponse, variant: 'destructive' });
    } finally {
      setChatLoading(false);
    }
  };

  // Add to comparison with auto-adding competitors
  const handleAddToComparison = async () => {
    if (currentVehicle) {
      // Check if vehicle is already in comparison
      const alreadyAdded = comparisonVehicles.some(v => v.vehicle.id === currentVehicle.id);
      if (alreadyAdded) {
        toast({ 
          title: isRTL ? '🚗 السيارة موجودة بالفعل في المقارنة' : '🚗 Vehicle already in comparison',
          description: isRTL ? 'هذه السيارة مضافة بالفعل' : 'This vehicle is already added',
          variant: 'destructive'
        });
        return;
      }
      
      // Check if comparison is full
      if (comparisonVehicles.length >= 4) {
        toast({ 
          title: isRTL ? '⚠️ المقارنة ممتلئة' : '⚠️ Comparison is full',
          description: isRTL ? 'يمكنك مقارنة 4 سيارات كحد أقصى' : 'You can compare up to 4 vehicles',
          variant: 'destructive'
        });
        return;
      }
      
      // Trigger animation
      setIsAddingToCompare(true);
      
      // Add current vehicle
      addComparisonVehicle(currentVehicle);
      
      // Auto-add competitor cars from same category (up to 3 more to fill 4 slots)
      if (competitors?.competitors?.length > 0) {
        const availableSlots = 4 - comparisonVehicles.length - 1; // -1 for current vehicle
        const competitorsToAdd = competitors.competitors.slice(0, availableSlots);
        
        for (const comp of competitorsToAdd) {
          // Create a vehicle object from competitor data
          const competitorVehicle: Vehicle = {
            id: `comp-${comp.brand}-${comp.model}-${Date.now()}`,
            brand: comp.brand,
            model: comp.model,
            year: comp.year || 2024,
            price: comp.averagePrice,
            horsepower: comp.horsepower,
            fuelConsumption: comp.fuelConsumption,
            confidence: 100,
          };
          
          // Add to comparison if not already there
          if (!comparisonVehicles.some(v => v.vehicle.brand === comp.brand && v.vehicle.model === comp.model)) {
            addComparisonVehicle(competitorVehicle);
          }
        }
      }
      
      setIsAddingToCompare(false);
      
      // Show success animation
      setComparisonSuccessData({
        brand: currentVehicle.brand,
        model: currentVehicle.model,
        count: Math.min(comparisonVehicles.length + 1 + (competitors?.competitors?.slice(0, 3).length || 0), 4)
      });
      setShowComparisonSuccess(true);
      
      // Hide success animation after delay
      setTimeout(() => {
        setShowComparisonSuccess(false);
      }, 2500);
      
      // Show enhanced success toast with animation
      const addedCompetitors = competitors?.competitors?.length > 0 
        ? ` + ${Math.min(competitors.competitors.length, 3)} ${isRTL ? 'منافسين' : 'competitors'}`
        : '';
      toast({ 
        title: isRTL ? '🎉 تمت الإضافة للمقارنة بنجاح!' : '🎉 Added to comparison successfully!',
        description: `${currentVehicle.brand} ${currentVehicle.model}${addedCompetitors}`,
        className: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/30'
      });
      
      // Auto-switch to compare tab after adding with smooth transition
      setTimeout(() => {
        setActiveTab('compare');
      }, 800);
    }
  };

  // Reset and start over
  const handleStartOver = () => {
    reset();
    setLinkUrl('');
    setMarketAnalysis(null);
    setBankOffers([]);
    setActiveTab('specs');
  };

  // Financing Application Chatbot Functions
  const getApplicationQuestions = (hasBank: boolean, hasProgram: boolean, selectedBrand?: string, hasCar?: boolean) => [
    // Step 0: Program selection (if bank is selected but program is not)
    ...(hasBank && !hasProgram ? [{
      key: 'programType',
      question: isRTL ? 'اختر برنامج التمويل المناسب' : 'Select financing program',
      options: [
        isRTL ? 'المرابحة' : 'Murabaha',
        isRTL ? 'التمويل المنتهي بالتمليك' : 'Lease-to-Own',
        isRTL ? 'برنامج التقسيط المباشر' : 'Direct Installment',
        isRTL ? 'برنامج التأجير' : 'Lease Program'
      ]
    }] : []),
    // Step 0 or 1: Bank selection (if not already selected)
    ...(!hasBank ? [{
      key: 'bankName',
      question: isRTL ? 'اختر البنك المفضل لديك' : 'Select your preferred bank',
      options: [
        isRTL ? 'بنك الراجحي' : 'Al Rajhi Bank',
        isRTL ? 'البنك الأهلي' : 'NCB',
        isRTL ? 'بنك الرياض' : 'Riyad Bank',
        isRTL ? 'بنك سامبا' : 'Samba Bank',
        isRTL ? 'بنك الإنماء' : 'Alinma Bank',
        isRTL ? 'البنك السعودي الفرنسي' : 'Saudi Fransi Bank',
      ]
    }] : []),
    // Car Brand (skip if car is already selected)
    ...(!hasCar ? [{
      key: 'carBrand',
      question: isRTL ? 'اختر ماركة السيارة' : 'Select car brand',
      options: [
        'Toyota', 'Hyundai', 'Honda', 'Kia', 'Nissan', 'Mazda',
        'Ford', 'Chevrolet', 'Mercedes', 'BMW', 'Lexus', 'Audi'
      ]
    }] : []),
    // Car Model (dynamic based on brand) - skip if car is already selected
    ...(!hasCar ? [{
      key: 'carModel',
      question: isRTL ? 'اختر موديل السيارة' : 'Select car model',
      options: selectedBrand && carModelsByBrand[selectedBrand]
        ? carModelsByBrand[selectedBrand]
        : ['Camry', 'Corolla', 'Elantra', 'Sonata', 'Accord', 'Civic']
    }] : []),
    // Car Category - skip if car is already selected
    ...(!hasCar ? [{
      key: 'carCategory',
      question: isRTL ? 'اختر فئة السيارة' : 'Select car category',
      options: [
        isRTL ? 'سيدان' : 'Sedan',
        isRTL ? 'دفع رباعي (SUV)' : 'SUV',
        isRTL ? 'هاتشباك' : 'Hatchback',
        isRTL ? 'كروس أوفر' : 'Crossover',
        isRTL ? 'رياضية' : 'Sports',
        isRTL ? 'شاحنة' : 'Truck'
      ]
    }] : []),
    // Trim Level - skip if car is already selected
    ...(!hasCar ? [{
      key: 'trimLevel',
      question: isRTL ? 'اختر مستوى التجهيز' : 'Select trim level',
      options: [
        isRTL ? 'فل كامل' : 'Full Option',
        isRTL ? 'متوسط' : 'Mid Option',
        isRTL ? 'أساسي' : 'Base Model'
      ]
    }] : []),
    // Model Year - skip if car is already selected
    ...(!hasCar ? [{
      key: 'modelYear',
      question: isRTL ? 'اختر سنة الموديل' : 'Select model year',
      options: ['2025', '2024', '2023', '2022', '2021', '2020']
    }] : []),
    // Employment Type
    {
      key: 'employmentType',
      question: isRTL ? 'ما نوع وظيفتك؟' : 'What is your employment type?',
      options: [
        isRTL ? 'حكومية' : 'Government',
        isRTL ? 'قطاع خاص' : 'Private Sector',
        isRTL ? 'عمل حر' : 'Self-Employed',
        isRTL ? 'متقاعد' : 'Retired'
      ]
    },
    // Work Duration
    {
      key: 'workDuration',
      question: isRTL ? 'كم مدة عملك الحالية؟' : 'How long at current job?',
      options: [
        isRTL ? 'أقل من سنة' : 'Less than 1 year',
        isRTL ? '1-3 سنوات' : '1-3 years',
        isRTL ? '3-5 سنوات' : '3-5 years',
        isRTL ? 'أكثر من 5 سنوات' : 'More than 5 years'
      ]
    },
    // Salary
    {
      key: 'salary',
      question: isRTL ? 'ما هو راتبك الشهري؟' : 'What is your monthly salary?',
      type: 'number',
      placeholder: isRTL ? 'مثال: 15000' : 'Example: 15000'
    },
    // City
    {
      key: 'city',
      question: isRTL ? 'في أي مدينة تقيم؟' : 'Which city do you live in?',
      options: [
        isRTL ? 'الرياض' : 'Riyadh',
        isRTL ? 'جدة' : 'Jeddah',
        isRTL ? 'الدمام' : 'Dammam',
        isRTL ? 'مكة' : 'Makkah',
        isRTL ? 'المدينة' : 'Madinah',
        isRTL ? 'الخبر' : 'Khobar',
        isRTL ? 'أخرى' : 'Other'
      ]
    },
    // Phone
    {
      key: 'phone',
      question: isRTL ? 'رقم الجوال للتواصل' : 'Phone number for contact',
      type: 'tel',
      placeholder: '05XXXXXXXX'
    },
  ];

  // Calculate preliminary financing result (automatic calculation based on salary)
  const calculatePreliminaryFinancing = (data: any) => {
    const salary = parseInt(data.salary) || 0;
    
    // Calculate automatic values based on salary
    // Max monthly payment is 33% of salary (bank standard)
    const maxMonthlyPayment = salary * 0.33;
    
    // Recommended down payment is 15-20% of estimated car price
    // We estimate based on 3 years of salary as max car affordability
    const estimatedMaxCarPrice = salary * 36;
    const recommendedDownPayment = Math.round(estimatedMaxCarPrice * 0.15);
    
    // Calculate eligible financing amount (60 months average, 5% rate)
    const rate = 0.05 / 12; // Monthly rate
    const months = 60;
    const maxFinancingAmount = maxMonthlyPayment * ((1 - Math.pow(1 + rate, -months)) / rate);
    
    // Calculate affordability score
    let affordabilityScore = 0;
    if (salary >= 5000) affordabilityScore += 25;
    if (salary >= 10000) affordabilityScore += 25;
    if (salary >= 15000) affordabilityScore += 15;
    if (salary >= 20000) affordabilityScore += 10;
    if (data.employmentType === (isRTL ? 'حكومية' : 'Government')) affordabilityScore += 15;
    if (data.employmentType === (isRTL ? 'قطاع خاص' : 'Private Sector')) affordabilityScore += 10;
    if (data.workDuration === (isRTL ? 'أكثر من 5 سنوات' : 'More than 5 years')) affordabilityScore += 10;
    if (data.workDuration === (isRTL ? '3-5 سنوات' : '3-5 years')) affordabilityScore += 5;
    
    // Determine eligibility status
    let eligibilityStatus = '';
    let eligibilityColor = '';
    if (affordabilityScore >= 70) {
      eligibilityStatus = isRTL ? 'مؤهل - فرصة موافقة عالية' : 'Eligible - High approval chance';
      eligibilityColor = 'green';
    } else if (affordabilityScore >= 50) {
      eligibilityStatus = isRTL ? 'مؤهل - فرصة موافقة متوسطة' : 'Eligible - Medium approval chance';
      eligibilityColor = 'yellow';
    } else {
      eligibilityStatus = isRTL ? 'يحتاج مراجعة - فرصة موافقة منخفضة' : 'Needs review - Low approval chance';
      eligibilityColor = 'red';
    }
    
    // Estimate car price range
    const minCarPrice = Math.round(maxFinancingAmount * 0.6);
    const maxCarPrice = Math.round(maxFinancingAmount);
    
    // Calculate estimated monthly payment for different terms
    const calculateMonthly = (principal: number, months: number, annualRate: number) => {
      const r = annualRate / 12;
      return principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    };

    // Calculate different term options (1-4 years) with varying profit rates
    // Shorter terms have lower rates as per Saudi banking standards
    const termOptions = {
      '1': {
        months: 12,
        rate: '3.0%',
        monthly: Math.round(calculateMonthly(maxFinancingAmount * 0.85, 12, 0.03)),
        totalAmount: Math.round(calculateMonthly(maxFinancingAmount * 0.85, 12, 0.03) * 12),
        profitAmount: Math.round(calculateMonthly(maxFinancingAmount * 0.85, 12, 0.03) * 12 - maxFinancingAmount * 0.85)
      },
      '2': {
        months: 24,
        rate: '3.5%',
        monthly: Math.round(calculateMonthly(maxFinancingAmount * 0.85, 24, 0.035)),
        totalAmount: Math.round(calculateMonthly(maxFinancingAmount * 0.85, 24, 0.035) * 24),
        profitAmount: Math.round(calculateMonthly(maxFinancingAmount * 0.85, 24, 0.035) * 24 - maxFinancingAmount * 0.85)
      },
      '3': {
        months: 36,
        rate: '4.0%',
        monthly: Math.round(calculateMonthly(maxFinancingAmount * 0.85, 36, 0.04)),
        totalAmount: Math.round(calculateMonthly(maxFinancingAmount * 0.85, 36, 0.04) * 36),
        profitAmount: Math.round(calculateMonthly(maxFinancingAmount * 0.85, 36, 0.04) * 36 - maxFinancingAmount * 0.85)
      },
      '4': {
        months: 48,
        rate: '4.5%',
        monthly: Math.round(calculateMonthly(maxFinancingAmount * 0.85, 48, 0.045)),
        totalAmount: Math.round(calculateMonthly(maxFinancingAmount * 0.85, 48, 0.045) * 48),
        profitAmount: Math.round(calculateMonthly(maxFinancingAmount * 0.85, 48, 0.045) * 48 - maxFinancingAmount * 0.85)
      },
    };

    return {
      maxMonthlyPayment: Math.round(maxMonthlyPayment),
      maxFinancingAmount: Math.round(maxFinancingAmount),
      affordabilityScore: Math.min(100, affordabilityScore),
      eligibilityStatus,
      eligibilityColor,
      minCarPrice,
      maxCarPrice,
      termOptions,
      recommendedDownPayment,
      profitRate: '4.5%',
      notes: generateFinancingNotes(data, affordabilityScore)
    };
  };

  // Generate financing notes based on application data
  const generateFinancingNotes = (data: any, score: number) => {
    const notes: string[] = [];
    
    if (data.employmentType === (isRTL ? 'حكومية' : 'Government')) {
      notes.push(isRTL ? '✅ وظيفة حكومية - تزيد فرصة الموافقة' : '✅ Government job - Increases approval chance');
    }
    
    if (data.workDuration === (isRTL ? 'أقل من سنة' : 'Less than 1 year')) {
      notes.push(isRTL ? '⚠️ مدة عمل قصيرة - قد تتطلب كفيل' : '⚠️ Short work duration - May require guarantor');
    }
    
    if (parseInt(data.salary) >= 15000) {
      notes.push(isRTL ? '✅ راتب ممتاز - يؤهل لتمويلات كبيرة' : '✅ Excellent salary - Qualifies for larger financing');
    }
    
    return notes;
  };

  const openFinancingChatbot = (programType: string, bank: any = null, selectedCar: any = null) => {
    const hasBank = bank !== null;
    const hasProgram = programType !== null && programType !== '';
    const hasCar = selectedCar !== null || currentVehicle !== null;
    const carToUse = selectedCar || currentVehicle;
    const questions = getApplicationQuestions(hasBank, hasProgram, '', hasCar);

    setSelectedProgram(programType);
    setSelectedBank(bank);
    setApplicationStep(0);
    setApplicationData({
      programType,
      bankName: bank ? (isRTL ? bank.bankName : bank.bankNameEn) : '',
      vehicle: carToUse,
      carBrand: carToUse?.brand || '',
      carModel: carToUse?.model || '',
      carCategory: '',
      trimLevel: '',
      modelYear: carToUse?.year?.toString() || '',
      employmentType: '',
      workDuration: '',
      salary: '',
      city: '',
      phone: '',
      selectedTerm: '4',
    });

    // Build car info string if car is available
    let carInfoStr = '';
    let dealerInfoStr = '';
    
    if (carToUse) {
      const carBrand = isRTL ? (carToUse.brand || carToUse.brandEn) : (carToUse.brandEn || carToUse.brand);
      const carModel = isRTL ? (carToUse.model || carToUse.modelEn) : (carToUse.modelEn || carToUse.model);
      const carYear = carToUse.year || '';
      const carPrice = carToUse.price ? `${getCurrencyDisplay()} ${carToUse.price.toLocaleString()}` : '';
      const carPayment = carToUse.monthlyPayment ? `${getCurrencyDisplay()} ${Math.round(carToUse.monthlyPayment).toLocaleString()}` : '';

      carInfoStr = `\n${isRTL ? '**السيارة المطلوبة:**' : '**Requested Car:'}** ${carBrand} ${carModel}${carYear ? ` ${carYear}` : ''}`;
      if (carPrice) {
        carInfoStr += `\n${isRTL ? '**السعر:**' : '**Price:**'} ${carPrice}`;
      }
      if (carPayment) {
        carInfoStr += `\n${isRTL ? '**القسط الشهري المتوقع:**' : '**Expected Monthly Payment:**'} ${carPayment}`;
      }
      
      // Add dealer/showroom info if available
      if (carToUse.dealer) {
        dealerInfoStr = `\n\n${isRTL ? '**المعرض/الوكيل:**' : '**Dealer/Showroom:**'} ${carToUse.dealer}`;
        if (carToUse.dealerLocation) {
          dealerInfoStr += `\n${isRTL ? '**الموقع:**' : '**Location:**'} ${carToUse.dealerLocation}`;
        }
        if (carToUse.condition === 'used' && carToUse.km) {
          dealerInfoStr += `\n${isRTL ? '**الحالة:**' : '**Condition:**'} ${isRTL ? 'مستعملة' : 'Used'}`;
        } else {
          dealerInfoStr += `\n${isRTL ? '**الحالة:**' : '**Condition:**'} ${isRTL ? 'جديدة' : 'New'}`;
        }
      }
    }

    // Welcome message based on what's pre-selected
    let introContent = '';
    const welcomeHeader = isRTL ? 'مرحباً! أنا مساعد التمويل الذكي. سأساعدك في إكمال طلب التمويل.' : 'Hello! I\'m the smart financing assistant. I\'ll help you complete your financing application.';

    if (bank && !hasProgram) {
      // Bank selected but no program - user needs to select program first
      introContent = `${welcomeHeader}${carInfoStr}${dealerInfoStr}\n\n${isRTL ? '**البنك:**' : '**Bank:**'} ${isRTL ? bank.bankName : bank.bankNameEn}\n\n${isRTL ? 'يرجى اختيار برنامج التمويل المناسب لك' : 'Please select the financing program that suits you'}`;
    } else if (bank && hasProgram) {
      // Both bank and program selected
      introContent = `${welcomeHeader}${carInfoStr}${dealerInfoStr}\n\n${isRTL ? '**برنامج التمويل:**' : '**Financing Program:**'} ${programType}\n${isRTL ? '**البنك:**' : '**Bank:**'} ${isRTL ? bank.bankName : bank.bankNameEn}\n\n${isRTL ? 'لنبدأ ببعض الأسئلة لتحديد الخيار الأنسب لك' : 'Let\'s start with some questions to find the best option for you'}`;
    } else if (hasProgram) {
      // Only program selected (no bank)
      introContent = `${welcomeHeader}${carInfoStr}${dealerInfoStr}\n\n${isRTL ? '**برنامج التمويل:**' : '**Financing Program:**'} ${programType}\n\n${isRTL ? 'لنبدأ ببعض الأسئلة لتحديد الخيار الأنسب لك' : 'Let\'s start with some questions to find the best option for you'}`;
    } else {
      // No program or bank - just car or general request
      introContent = `${welcomeHeader}${carInfoStr}${dealerInfoStr}\n\n${isRTL ? 'لنبدأ ببعض الأسئلة لتحديد الخيار الأنسب لك' : 'Let\'s start with some questions to find the best option for you'}`;
    }
    
    setApplicationMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: introContent,
        timestamp: new Date(),
      },
    ]);
    setApplicationStatus('chat');
    setFinancingChatOpen(true);
    
    // Add first question after a delay
    setTimeout(() => {
      setApplicationMessages(prev => [...prev, {
        id: `q_0`,
        role: 'assistant',
        content: questions[0].question,
        timestamp: new Date(),
        questionIndex: 0,
      }]);
    }, 1000);
  };

  const handleApplicationAnswer = async (answer: string) => {
    const hasBank = selectedBank !== null;
    const hasProgram = selectedProgram !== null && selectedProgram !== '';
    const hasCar = applicationData.vehicle !== null && applicationData.vehicle !== undefined;

    // Get current questions to find the current question
    const currentQuestions = getApplicationQuestions(hasBank, hasProgram, applicationData.carBrand, hasCar);
    const currentQuestion = currentQuestions[applicationStep];
    
    // Add user's answer
    setApplicationMessages(prev => [...prev, {
      id: `a_${applicationStep}`,
      role: 'user',
      content: answer,
      timestamp: new Date(),
    }]);

    // Update application data
    const newData = {
      ...applicationData,
      [currentQuestion.key]: answer,
    };
    setApplicationData(newData);
    
    // Update selectedProgram if this was the program selection question
    if (currentQuestion.key === 'programType') {
      setSelectedProgram(answer);
    }

    // Get updated brand for dynamic model selection
    const updatedBrand = currentQuestion.key === 'carBrand' ? answer : applicationData.carBrand;
    const updatedHasProgram = currentQuestion.key === 'programType' ? true : hasProgram;

    // Move to next step
    if (applicationStep < currentQuestions.length - 1) {
      const nextStep = applicationStep + 1;
      setApplicationStep(nextStep);

      // Show typing indicator briefly
      setApplicationLoading(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setApplicationLoading(false);

      // Get updated questions with new brand for model selection
      const updatedQuestions = getApplicationQuestions(hasBank, updatedHasProgram, updatedBrand, hasCar);

      // Add next question
      setApplicationMessages(prev => [...prev, {
        id: `q_${nextStep}`,
        role: 'assistant',
        content: updatedQuestions[nextStep].question,
        timestamp: new Date(),
        questionIndex: nextStep,
      }]);
    } else {
      // All questions answered - show calculating message then results
      setApplicationLoading(true);

      // Add calculating message
      setApplicationMessages(prev => [...prev, {
        id: 'calculating',
        role: 'assistant',
        content: isRTL ? '⏳ جاري تحليل بياناتك وحساب التمويل المبدئي...' : '⏳ Analyzing your data and calculating preliminary financing...',
        timestamp: new Date(),
      }]);

      await new Promise(resolve => setTimeout(resolve, 1200));

      // Calculate preliminary financing
      const financingResult = calculatePreliminaryFinancing(newData);

      // Remove calculating message and show results
      setApplicationMessages(prev => prev.filter(m => m.id !== 'calculating'));
      setApplicationLoading(false);
      setApplicationStatus('result');

      // Store financing result
      setApplicationData((prev: any) => ({ ...prev, financingResult }));
    }
  };

  const submitApplication = async () => {
    setApplicationLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate professional tracking number: CL-XXXXXX-XXXX
    const generateTrackingNumber = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let part1 = '';
      let part2 = '';
      for (let i = 0; i < 6; i++) {
        part1 += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      for (let i = 0; i < 4; i++) {
        part2 += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return `CL-${part1}-${part2}`;
    };
    const orderNumber = generateTrackingNumber();

    // Get the selected term details
    const selectedTermData = applicationData.financingResult?.termOptions?.[applicationData.selectedTerm || '4'];

    // Create order object
    const newOrder = {
      orderNumber,
      status: 'pending',
      createdAt: new Date(),
      carBrand: applicationData.carBrand,
      carModel: applicationData.carModel,
      carCategory: applicationData.carCategory,
      trimLevel: applicationData.trimLevel,
      modelYear: applicationData.modelYear,
      programType: applicationData.programType,
      bankName: applicationData.bankName,
      selectedTerm: applicationData.selectedTerm || '4',
      monthlyPayment: selectedTermData?.monthly || 0,
      totalAmount: selectedTermData?.totalAmount || 0,
      employmentType: applicationData.employmentType,
      workDuration: applicationData.workDuration,
      salary: applicationData.salary,
      city: applicationData.city,
      phone: applicationData.phone,
    };
    
    // Add to orders list
    setOrdersList(prev => [...prev, newOrder]);
    
    setApplicationData((prev: any) => ({ ...prev, orderNumber }));
    setApplicationStatus('submitted');
    setOrderStatus('pending');
    setApplicationLoading(false);
    
    toast({ 
      title: t.applicationSubmitted, 
      description: `${t.applicationNumber}: ${orderNumber}` 
    });
  };

  const renderOrderTracking = () => {
    const steps = [
      { status: 'pending', label: t.statusPending, labelEn: 'Under Review', icon: Loader2, color: 'amber', descAr: 'جاري تحليل طلبك تلقائياً بالذكاء الاصطناعي', descEn: 'Your application is being analyzed automatically by AI' },
      { status: 'approved', label: t.statusApproved, labelEn: 'Initial Approval', icon: CheckCircle2, color: 'green', descAr: 'تمت الموافقة المبدئية - سيتم إرسال المستندات المطلوبة إليك', descEn: 'Initial approval received - required documents will be sent to you' },
      { status: 'documents', label: t.statusDocuments, labelEn: 'Documents', icon: FileText, color: 'blue', descAr: 'يرجى استكمال المستندات المطلوبة', descEn: 'Please complete the required documents' },
      { status: 'final_approval', label: t.statusFinalApproval, labelEn: 'Final Approval', icon: CheckCircle2, color: 'green', descAr: 'تمت الموافقة النهائية - جاري إعداد العقد', descEn: 'Final approval received - preparing contract' },
      { status: 'contract', label: t.statusContract, labelEn: 'Contract', icon: Calendar, color: 'purple', descAr: 'العقد جاهز - سيتم إرساله إليك للتوقيع الإلكتروني', descEn: 'Contract ready - will be sent for electronic signature' },
      { status: 'delivery', label: t.statusDelivery, labelEn: 'Delivery', icon: Car, color: 'emerald', descAr: 'السيارة جاهزة للاستلام!', descEn: 'Your car is ready for delivery!' },
    ];

    const currentIndex = steps.findIndex(s => s.status === orderStatus);
    
    // Generate timestamps for each stage
    const getStageTime = (index: number) => {
      if (index === 0) return isRTL ? 'منذ 5 دقائق' : '5 min ago';
      if (index === 1) return isRTL ? 'منذ 3 دقائق' : '3 min ago';
      if (index === 2) return isRTL ? 'منذ دقيقة' : '1 min ago';
      return '';
    };

    // Function to advance to next stage
    const advanceToNextStage = () => {
      if (currentIndex < steps.length - 1) {
        const nextStatus = steps[currentIndex + 1].status;
        setOrderStatus(nextStatus);
        
        // If next status is documents, show documents form
        if (nextStatus === 'documents' && !documentsSubmitted) {
          setShowDocumentsForm(true);
          toast({ title: isRTL ? 'يرجى استكمال المستندات المطلوبة' : 'Please complete required documents' });
        }
      }
    };

    return (
      <div className="py-4">
        {/* Timeline Header */}
        <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h4 className="font-semibold text-sm">{isRTL ? 'مراحل الطلب' : 'Order Stages'}</h4>
          <Badge variant="outline" className="text-xs">
            {isRTL ? `${currentIndex + 1} من ${steps.length}` : `${currentIndex + 1} of ${steps.length}`}
          </Badge>
        </div>

        {/* Vertical Timeline */}
        <div className="relative space-y-0">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const Icon = step.icon;

            return (
              <motion.div
                key={step.status}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                {/* Timeline Line */}
                {index < steps.length - 1 && (
                  <div 
                    className={`absolute top-10 ${isRTL ? 'right-5' : 'left-5'} w-0.5 h-full ${
                      index < currentIndex ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}

                {/* Status Icon */}
                <div className={`
                  relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0
                  ${isCompleted ? `bg-${step.color}-500 border-${step.color}-500 text-white` :
                    isCurrent ? `bg-${step.color}-500/20 border-${step.color}-500 text-${step.color}-500` :
                    'bg-background border-muted text-muted-foreground'}
                `}
                style={{
                  backgroundColor: isCompleted || isCurrent ? 
                    (step.color === 'amber' ? '#f59e0b' : 
                     step.color === 'green' ? '#22c55e' : 
                     step.color === 'blue' ? '#3b82f6' : 
                     step.color === 'purple' ? '#a855f7' : 
                     step.color === 'emerald' ? '#10b981' : 'hsl(var(--primary))') : 
                    undefined,
                  borderColor: isCompleted || isCurrent ? 
                    (step.color === 'amber' ? '#f59e0b' : 
                     step.color === 'green' ? '#22c55e' : 
                     step.color === 'blue' ? '#3b82f6' : 
                     step.color === 'purple' ? '#a855f7' : 
                     step.color === 'emerald' ? '#10b981' : 'hsl(var(--primary))') : 
                    undefined
                }}
                >
                  {isCurrent && index === 0 ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                  
                  {/* Pulse animation for current */}
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full animate-ping opacity-20"
                      style={{
                        backgroundColor: step.color === 'amber' ? '#f59e0b' : 
                         step.color === 'green' ? '#22c55e' : 
                         step.color === 'blue' ? '#3b82f6' : 
                         step.color === 'purple' ? '#a855f7' : 
                         step.color === 'emerald' ? '#10b981' : 'hsl(var(--primary))'
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 pb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-start' : ''}`}>
                    <span className={`font-medium text-sm ${isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.label}
                    </span>
                    
                    {/* Status Badge */}
                    {isCompleted && (
                      <Badge className="bg-green-500 text-white text-[10px] px-1.5 py-0">
                        <CheckCircle2 className="w-3 h-3 mr-0.5" />
                        {isRTL ? 'مكتمل' : 'Done'}
                      </Badge>
                    )}
                    {isCurrent && (
                      <Badge className="text-[10px] px-1.5 py-0 animate-pulse"
                        style={{
                          backgroundColor: step.color === 'amber' ? '#fef3c7' : 
                           step.color === 'green' ? '#dcfce7' : 
                           step.color === 'blue' ? '#dbeafe' : 
                           step.color === 'purple' ? '#f3e8ff' : 
                           step.color === 'emerald' ? '#d1fae5' : 'hsl(var(--primary)/0.1)',
                          color: step.color === 'amber' ? '#b45309' : 
                           step.color === 'green' ? '#166534' : 
                           step.color === 'blue' ? '#1e40af' : 
                           step.color === 'purple' ? '#7e22ce' : 
                           step.color === 'emerald' ? '#047857' : 'hsl(var(--primary))'
                        }}
                      >
                        <Loader2 className="w-3 h-3 mr-0.5 animate-spin" />
                        {isRTL ? 'جاري' : 'In Progress'}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Description */}
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? step.descAr : step.descEn}
                  </p>
                  
                  {/* Timestamp */}
                  {(isCompleted || isCurrent) && (
                    <div className={`flex items-center gap-1 mt-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{getStageTime(index)}</span>
                    </div>
                  )}

                  {/* Documents Button for Documents Stage */}
                  {isCurrent && step.status === 'documents' && !documentsSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3"
                    >
                      <Button
                        className="sky-gradient text-white text-sm"
                        onClick={() => setShowDocumentsForm(true)}
                      >
                        <FileText className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {isRTL ? 'استكمال المستندات' : 'Complete Documents'}
                      </Button>
                    </motion.div>
                  )}

                  {/* Completed Documents Indicator */}
                  {step.status === 'documents' && documentsSubmitted && (
                    <div className={`flex items-center gap-2 mt-2 text-green-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-medium">{isRTL ? 'تم استكمال المستندات' : 'Documents completed'}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-4 border-t space-y-2">
          {currentIndex < steps.length - 1 && (
            <>
              <Button
                onClick={advanceToNextStage}
                className="w-full sky-gradient text-white"
              >
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                {isRTL ? 'المرحلة التالية' : 'Next Stage'}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                {isRTL ? 'انقر للمحاكاة والتقدم للمرحلة التالية' : 'Click to simulate and advance to next stage'}
              </p>
            </>
          )}

          {/* Completion message */}
          {currentIndex === steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center"
            >
              <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="font-bold text-green-600">{isRTL ? 'تم إكمال جميع المراحل!' : 'All stages completed!'}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {isRTL ? 'سيارتك جاهزة للاستلام' : 'Your car is ready for delivery'}
              </p>
            </motion.div>
          )}
        </div>

        {/* AI Badge */}
        <div className={`mt-4 p-3 bg-primary/5 rounded-xl border border-primary/20 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-start' : ''}`}>
            <Bot className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">{isRTL ? 'معالجة آلية بالذكاء الاصطناعي' : 'Automated AI Processing'}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isRTL ? 'طلبك يعالج تلقائياً بدون تدخل بشري - أسرع وأكثر دقة' : 'Your request is processed automatically without human intervention - faster and more accurate'}
          </p>
        </div>
      </div>
    );
  };

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="min-h-screen bg-background flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-2 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setViewState('input');
                setCurrentVehicle(null);
                setLinkUrl('');
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-sky-500 hover:bg-sky-600 transition-colors cursor-pointer"
            >
              <Link className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
            </button>
            <div>
              <h1 className="text-base sm:text-xl font-bold gradient-text">{t.title}</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Notification Bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 sm:w-9 sm:h-9 relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center">{3 + claimedCoupons.length}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="w-72">
                <div className="p-2">
                  <h4 className="font-semibold text-sm mb-2">{isRTL ? 'الإشعارات' : 'Notifications'}</h4>
                  <div className="space-y-1">
                    {/* Claimed Coupons */}
                    {claimedCoupons.map((coupon) => (
                      <DropdownMenuItem 
                        key={coupon.id}
                        className="flex items-start gap-3 p-3 cursor-pointer hover:bg-green-500/5 rounded-lg border border-green-200/50"
                        onClick={() => {
                          setCurrentCoupon(coupon);
                          setShowCoupon(true);
                        }}
                      >
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                          <Ticket className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-600">{isRTL ? 'قسيمتك جاهزة' : 'Your Coupon Ready'}</p>
                          <p className="text-xs text-muted-foreground">{coupon.title}</p>
                          <p className="text-xs text-green-500 mt-1 font-medium">{isRTL ? 'انقر للعرض' : 'Click to view'}</p>
                        </div>
                      </DropdownMenuItem>
                    ))}
                    
                    {/* Order Tracking Notification */}
                    <DropdownMenuItem 
                      className="flex items-start gap-3 p-3 cursor-pointer hover:bg-primary/5 rounded-lg"
                      onClick={() => {
                        setSelectedService('order-tracking');
                        setServiceDetailOpen(true);
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <ClipboardList className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{isRTL ? 'تتبع الطلب' : 'Order Tracking'}</p>
                        <p className="text-xs text-muted-foreground">{isRTL ? 'طلبك CL-ABC123 قيد المراجعة' : 'Your order CL-ABC123 is under review'}</p>
                        <p className="text-xs text-primary mt-1">{isRTL ? 'منذ 5 دقائق' : '5 min ago'}</p>
                      </div>
                    </DropdownMenuItem>
                    
                    {/* Special Offers Notification */}
                    <DropdownMenuItem 
                      className="flex items-start gap-3 p-3 cursor-pointer hover:bg-primary/5 rounded-lg"
                      onClick={() => {
                        setSelectedService('offers');
                        setServiceDetailOpen(true);
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{isRTL ? 'عروض خاصة' : 'Special Offers'}</p>
                        <p className="text-xs text-muted-foreground">{isRTL ? 'خصم 15% على تويوتا كامري 2024' : '15% off Toyota Camry 2024'}</p>
                        <p className="text-xs text-primary mt-1">{isRTL ? 'منذ ساعة' : '1 hour ago'}</p>
                      </div>
                    </DropdownMenuItem>
                    
                    {/* New Announcement Notification */}
                    <DropdownMenuItem 
                      className="flex items-start gap-3 p-3 cursor-pointer hover:bg-primary/5 rounded-lg"
                      onClick={() => {
                        setSelectedService('new-car-request');
                        setServiceDetailOpen(true);
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <Plus className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{isRTL ? 'جديد' : 'New'}</p>
                        <p className="text-xs text-muted-foreground">{isRTL ? 'تم إضافة ميزة طلب السيارات الجديدة' : 'New car request feature added'}</p>
                        <p className="text-xs text-primary mt-1">{isRTL ? 'منذ يوم' : '1 day ago'}</p>
                      </div>
                    </DropdownMenuItem>
                  </div>
                  
                  {/* View All */}
                  <div className="mt-2 pt-2 border-t">
                    <Button 
                      variant="ghost" 
                      className="w-full text-xs text-primary"
                      onClick={() => setViewState('services')}
                    >
                      {isRTL ? 'عرض جميع الإشعارات' : 'View all notifications'}
                    </Button>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Language Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full w-8 h-8 sm:w-9 sm:h-9"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            >
              <Globe className="w-4 h-4" />
            </Button>

            {/* Apps Grid Button - Opens Sheet */}
            <button 
              className="p-1 hover:opacity-70 transition-opacity"
              onClick={() => setAppsSheetOpen(true)}
            >
              <LayoutGrid className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
            {viewState === 'results' && (
              <Button variant="outline" size="sm" onClick={handleStartOver} className="hidden sm:flex">
                <RefreshCw className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t.newAnalysis}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {viewState === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto"
            >
              {/* Hero Section */}
              <div className="text-center mb-10">
                <div className="flex justify-center mb-4">
                  <button
                    onClick={() => {
                      setViewState('input');
                      setCurrentVehicle(null);
                      setLinkUrl('');
                    }}
                    className="relative group cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-sky-500 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                      <Link className="w-8 h-8 text-black" />
                    </div>
                  </button>
                </div>
                <h2 className={`font-bold mb-4 ${isRTL ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-5xl md:text-6xl lg:text-7xl'}`}>
                  {t.heroTitle}{' '}
                  <span className="gradient-text">
                    {t.heroHighlight}
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {t.heroDesc}
                </p>
              </div>

              {/* Main Input Card - Full Width */}
              <Card className="mb-6 overflow-hidden relative">
                {/* Special Offers Quick Access - Same design as notification */}
                <button
                  onClick={() => {
                    setSelectedService('offers');
                    setServiceDetailOpen(true);
                  }}
                  className={`absolute top-5 z-10 hover:scale-110 transition-transform group animate-pulse ${isRTL ? 'left-5' : 'right-5'}`}
                  title={isRTL ? 'عروض خاصة' : 'Special Offers'}
                >
                  <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center relative group-hover:bg-amber-500/20 transition-colors">
                    <Sparkles className="w-7 h-7 text-amber-500" />
                    {/* Green badge for new offers/announcements - pulses when there are items */}
                    <span className={`absolute -bottom-0.5 -right-0.5 min-w-4 h-4 px-1 bg-green-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold shadow-sm ${(publishedOffers.length + publishedAnnouncements.length) > 0 ? 'animate-pulse' : ''}`}>
                      {(publishedOffers.length + publishedAnnouncements.length) || 1}
                    </span>
                  </div>
                </button>
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl sky-gradient flex items-center justify-center flex-shrink-0">
                      <Link className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl">{t.pasteLink}</h3>
                      <p className="text-sm text-muted-foreground">{t.pasteLinkDesc}</p>
                    </div>
                  </div>

                  {/* Input Row with Icons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Input
                      placeholder="https://..."
                      value={linkUrl}
                      onChange={(e) => {
                        setLinkUrl(e.target.value);
                        setAnalysisMode('link');
                      }}
                      className="flex-1 h-12 text-base"
                      dir="ltr"
                    />
                    
                    <div className="flex items-center gap-2">
                      {/* Analyze Button */}
                      <Button 
                        onClick={handleAnalyzeLink} 
                        disabled={isAnalyzing} 
                        className="sky-gradient text-white h-12 px-6"
                      >
                        {isAnalyzing ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Sparkles className="w-5 h-5" />
                        )}
                        <span className="ms-2 hidden sm:inline">{t.analyzing}</span>
                      </Button>

                      {/* Divider */}
                      <div className="w-px h-8 bg-border hidden sm:block" />

                      {/* Image Upload */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className={`h-12 w-12 rounded-xl ${analysisMode === 'image' ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                            onClick={() => { setAnalysisMode('image'); fileInputRef.current?.click(); }}
                            disabled={isAnalyzing}
                          >
                            <ImageIcon className="w-5 h-5 text-primary" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t.uploadImage}</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Camera */}
                      <input
                        type="file"
                        ref={cameraInputRef}
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className={`h-12 w-12 rounded-xl ${analysisMode === 'camera' ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                            onClick={() => { setAnalysisMode('camera'); cameraInputRef.current?.click(); }}
                            disabled={isAnalyzing}
                          >
                            <Camera className="w-5 h-5 text-primary" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t.capturePhoto}</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* QR Scanner */}
                      <input
                        type="file"
                        ref={qrInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleQRScan}
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className={`h-12 w-12 rounded-xl ${analysisMode === 'qr' ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                            onClick={() => { setAnalysisMode('qr'); qrInputRef.current?.click(); }}
                            disabled={isAnalyzing}
                          >
                            <QrCode className="w-5 h-5 text-primary" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t.scanQR}</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Manual Car Entry for Analysis */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 rounded-xl sky-gradient border-0"
                            onClick={() => setManualCarEntryOpen(true)}
                          >
                            <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isRTL ? 'إدخال بيانات سيارة للتحليل' : 'Add Car Data for Analysis'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Features - Primary Color Icons without frame - Inside Card */}
                  <div className="flex flex-wrap justify-center gap-6 mt-6 pt-4 border-t">
                    {[
                      { icon: Gauge, label: t.features.specs },
                      { icon: TrendingUp, label: isRTL ? 'تحليل الأسعار والسوق' : 'Price & Market Analysis' },
                      { icon: Calculator, label: isRTL ? 'طلب تمويل' : 'Request Financing' },
                      { icon: Bot, label: t.features.advisor },
                      { icon: Zap, label: isRTL ? 'طلب أسرع' : 'Fast Request' },
                      { icon: Shield, label: isRTL ? 'الضمان الممتد' : 'Extended Warranty' },
                    ].map((feature) => (
                      <div key={feature.label} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        <feature.icon className="w-6 h-6 text-primary" />
                        <span className="text-sm font-medium">{feature.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tagline - Below Card */}
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-white">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-primary flex-shrink-0"></span>
                <span>{isRTL ? 'بيئة متكاملة لتجربة خدمات السيارات المدعومة بالذكاء الاصطناعي' : 'An integrated environment for experiencing AI-powered car services'}</span>
              </div>
            </motion.div>
          )}

          {viewState === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-muted" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Link className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-2">{t.analyzingVehicle}</h3>
              <p className="text-muted-foreground">
                {analysisMode === 'link' ? t.extractingData : t.identifyingCar}
              </p>
            </motion.div>
          )}

          {viewState === 'results' && currentVehicle && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Vehicle Header */}
              <Card className="mb-6 sky-gradient">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-white/20 text-white">{currentVehicle.year || t.yearUnknown}</Badge>
                        {currentVehicle.trim && <Badge variant="outline" className="border-white/30 text-white">{currentVehicle.trim}</Badge>}
                      </div>
                      <h2 className="text-3xl font-bold">
                        {currentVehicle.brand} {currentVehicle.model}
                      </h2>
                      {currentVehicle.engine && (
                        <p className="text-white/80 mt-1">{currentVehicle.engine}</p>
                      )}
                    </div>
                    <div className={`${isRTL ? 'text-left md:text-left' : 'text-right md:text-right'}`}>
                      {currentVehicle.price && (
                        <>
                          <p className="text-3xl font-bold">
                            {currentVehicle.price.toLocaleString()} {getCurrencyDisplay()}
                          </p>
                          {marketAnalysis?.priceStatus && (
                            <Badge 
                              className="mt-2"
                              variant={
                                marketAnalysis.priceStatus === 'good' ? 'default' : 
                                marketAnalysis.priceStatus === 'average' ? 'secondary' : 
                                'destructive'
                              }
                            >
                              {marketAnalysis.priceStatus === 'good' && <CheckCircle2 className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />}
                              {marketAnalysis.priceStatus === 'overpriced' && <AlertCircle className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />}
                              {marketAnalysis.priceStatus === 'good' ? t.goodPrice : 
                               marketAnalysis.priceStatus === 'average' ? t.averagePrice : 
                               t.highPrice}
                            </Badge>
                          )}
                        </>
                      )}
                      
                      {/* Add to Compare Button - Enhanced Interactive */}
                      <motion.div 
                        className="mt-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {/* Comparison Progress Bar */}
                        <div className="flex items-center gap-2 mb-3">
                          {[1, 2, 3, 4].map((slot) => (
                            <motion.div
                              key={slot}
                              className={`flex-1 h-2 rounded-full ${
                                slot <= comparisonVehicles.length
                                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                                  : 'bg-white/20'
                              }`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: slot * 0.1 }}
                            />
                          ))}
                        </div>
                        
                        <motion.div
                          whileHover={{ scale: comparisonVehicles.some(v => v.vehicle.id === currentVehicle.id) || comparisonVehicles.length >= 4 ? 1 : 1.02 }}
                          whileTap={{ scale: comparisonVehicles.some(v => v.vehicle.id === currentVehicle.id) || comparisonVehicles.length >= 4 ? 1 : 0.98 }}
                        >
                          <Button
                            onClick={handleAddToComparison}
                            disabled={comparisonVehicles.length >= 4 || comparisonVehicles.some(v => v.vehicle.id === currentVehicle.id) || isAddingToCompare}
                            className={`w-full md:w-auto relative overflow-hidden ${
                              comparisonVehicles.some(v => v.vehicle.id === currentVehicle.id)
                                ? 'bg-emerald-500/30 text-emerald-100 border border-emerald-400/50 cursor-default'
                                : 'bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white border border-white/30 hover:border-white/50 shadow-lg hover:shadow-sky-500/25'
                            } transition-all`}
                          >
                            {/* Animated background glow */}
                            {!comparisonVehicles.some(v => v.vehicle.id === currentVehicle.id) && comparisonVehicles.length < 4 && (
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                              />
                            )}
                            
                            <span className="relative flex items-center">
                              {isAddingToCompare ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                                >
                                  <RefreshCw className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                </motion.div>
                              ) : comparisonVehicles.some(v => v.vehicle.id === currentVehicle.id) ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500 }}
                                >
                                  <CheckCircle2 className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                </motion.div>
                              ) : (
                                <motion.div
                                  animate={{ 
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1]
                                  }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  <GitCompare className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                </motion.div>
                              )}
                              <span className="font-semibold">
                                {comparisonVehicles.some(v => v.vehicle.id === currentVehicle.id)
                                  ? (isRTL ? '✓ تمت الإضافة للمقارنة' : '✓ Added to Comparison')
                                  : (isRTL ? 'أضف للمقارنة' : 'Add to Compare')
                                }
                              </span>
                              {comparisonVehicles.length < 4 && !comparisonVehicles.some(v => v.vehicle.id === currentVehicle.id) && (
                                <motion.span 
                                  className="text-xs opacity-80 mr-2 px-2 py-0.5 bg-white/20 rounded-full"
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                >
                                  {comparisonVehicles.length + 1}/4
                                </motion.span>
                              )}
                            </span>
                          </Button>
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs for different views */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className={`grid grid-cols-2 md:grid-cols-4 gap-4 w-full bg-transparent h-auto p-0`}>
                  <TabsTrigger 
                    value="specs" 
                    className={`flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all border-2 border-transparent data-[state=active]:!border-blue-500 data-[state=active]:!bg-muted/50 ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <Gauge className="w-5 h-5" />
                    <span className="text-sm font-medium">{t.tabs.specs}</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="financing" 
                    className={`flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all border-2 border-transparent data-[state=active]:!border-blue-500 data-[state=active]:!bg-muted/50 ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <Calculator className="w-5 h-5" />
                    <span className="text-sm font-medium">{t.tabs.financing}</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="compare"
                    className={`flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all border-2 border-transparent data-[state=active]:!border-blue-500 data-[state=active]:!bg-muted/50 ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <div className="relative">
                      <motion.div
                        animate={comparisonVehicles.length > 0 ? { rotate: [0, 10, -10, 0] } : {}}
                        transition={{ duration: 2, repeat: comparisonVehicles.length > 0 ? Infinity : 0 }}
                      >
                        <GitCompare className="w-5 h-5" />
                      </motion.div>
                      {comparisonVehicles.length > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg"
                        >
                          {comparisonVehicles.length}
                        </motion.span>
                      )}
                    </div>
                    <span className="text-sm font-medium">{t.tabs.compare}</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="advisor" 
                    className={`flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all border-2 border-transparent data-[state=active]:!border-blue-500 data-[state=active]:!bg-muted/50 ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <Bot className="w-5 h-5" />
                    <span className="text-sm font-medium">{t.tabs.advisor}</span>
                  </TabsTrigger>
                </TabsList>

                {/* Specs Tab */}
                <TabsContent value="specs">
                  {/* Vehicle Origin & Climate Info Section */}
                  <Card className="mb-6 relative overflow-hidden">
                    {/* Glowing Border Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 animate-pulse" />
                    <div className="absolute inset-0 backdrop-blur-xl" />
                    <CardHeader className="pb-4 relative z-10">
                      <CardTitle className={`text-lg flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-start text-right' : ''}`}>
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shadow-lg shadow-primary/20">
                          <Globe className="w-5 h-5 text-primary" />
                        </div>
                        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent font-bold">{t.vehicleOrigin}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Manufacturing Country */}
                        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group">
                          <CardContent className={`p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse justify-start' : ''}`}>
                              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all">
                                <span className="text-lg">🏭</span>
                              </div>
                              <h4 className="font-semibold text-sm text-right">{t.manufacturingCountry}</h4>
                            </div>
                            <div className="space-y-2">
                              <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="text-muted-foreground">{t.country}</span>
                                <span className="font-medium">{currentVehicle.country || (isRTL ? 'اليابان' : 'Japan')}</span>
                              </div>
                              <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="text-muted-foreground">{t.quality}</span>
                                <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs">{t.excellent}</Badge>
                              </div>
                              <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="text-muted-foreground">{t.exportQuality}</span>
                                <Badge variant="outline" className="text-xs text-green-500 border-green-500/50">{t.high}</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Brand Overview */}
                        <Card className="bg-gradient-to-br from-emerald-500/10 to-green-600/5 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 group">
                          <CardContent className={`p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse justify-start' : ''}`}>
                              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-all">
                                <Award className="w-5 h-5 text-emerald-500" />
                              </div>
                              <h4 className="font-semibold text-sm text-right">{t.brandOverview}</h4>
                            </div>
                            <div className="space-y-2">
                              <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="text-muted-foreground">{t.brandReputation}</span>
                                <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs">{t.excellent}</Badge>
                              </div>
                              <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="text-muted-foreground">{t.marketPresence}</span>
                                <span className="font-medium">{t.widelyAvailable}</span>
                              </div>
                              <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="text-muted-foreground">{t.afterSalesService}</span>
                                <Badge variant="outline" className="text-xs text-blue-500 border-blue-500/50">{t.good}</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Category & Model */}
                        <Card className="bg-gradient-to-br from-purple-500/10 to-violet-600/5 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group">
                          <CardContent className={`p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse justify-start' : ''}`}>
                              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/30 transition-all">
                                <Car className="w-5 h-5 text-purple-500" />
                              </div>
                              <h4 className="font-semibold text-sm text-right">{t.categoryModel}</h4>
                            </div>
                            <div className="space-y-2">
                              <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="text-muted-foreground">{t.segmentClass}</span>
                                <span className="font-medium">{currentVehicle.segment || (isRTL ? 'سيدان متوسطة' : 'Mid-size Sedan')}</span>
                              </div>
                              <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="text-muted-foreground">{t.bodyType}</span>
                                <span className="font-medium">{currentVehicle.bodyType || (isRTL ? 'سيدان' : 'Sedan')}</span>
                              </div>
                              <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="text-muted-foreground">{t.seatingCapacity}</span>
                                <span className="font-medium">{currentVehicle.seats || '5'} {isRTL ? 'مقاعد' : 'seats'}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Climate & Usage */}
                        <Card className="bg-gradient-to-br from-orange-500/10 to-amber-600/5 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 group">
                          <CardContent className={`p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse justify-start' : ''}`}>
                              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/30 transition-all">
                                <Sun className="w-5 h-5 text-orange-500" />
                              </div>
                              <h4 className="font-semibold text-sm text-right">{t.climateUsage}</h4>
                            </div>
                            <div className="space-y-2">
                              <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="text-muted-foreground">{t.suitableForSaudi}</span>
                                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs">{t.excellent}</Badge>
                              </div>
                              <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="text-muted-foreground">{t.sandDustResistance}</span>
                                <Badge variant="outline" className="text-xs text-orange-500 border-orange-500/50">{t.good}</Badge>
                              </div>
                              <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="text-muted-foreground">{t.acPerformance}</span>
                                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs">{t.excellent}</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Usage & Performance Bars */}
                      <div className={`mt-4 pt-4 border-t border-primary/10 grid grid-cols-2 md:grid-cols-4 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className="p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
                          <div className={`flex items-center justify-between mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="text-xs text-muted-foreground">{t.cityDriving}</span>
                            <span className="text-xs font-bold text-blue-500">{t.excellent}</span>
                          </div>
                          <Progress value={90} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-cyan-500" />
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                          <div className={`flex items-center justify-between mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="text-xs text-muted-foreground">{t.highwayDriving}</span>
                            <span className="text-xs font-bold text-emerald-500">{t.excellent}</span>
                          </div>
                          <Progress value={95} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-green-500" />
                        </div>
                        <div className="p-2 rounded-lg bg-orange-500/5 border border-orange-500/10">
                          <div className={`flex items-center justify-between mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="text-xs text-muted-foreground">{t.summerPerformance}</span>
                            <span className="text-xs font-bold text-orange-500">{t.excellent}</span>
                          </div>
                          <Progress value={92} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-orange-500 [&>div]:to-amber-500" />
                        </div>
                        <div className="p-2 rounded-lg bg-primary/5 border border-primary/10">
                          <div className={`flex items-center justify-between mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="text-xs text-muted-foreground">{t.fuelEfficiency}</span>
                            <span className="text-xs font-bold text-primary">{t.good}</span>
                          </div>
                          <Progress value={80} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-primary/60" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Vehicle Specs Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Performance */}
                    <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 border border-yellow-500/20 hover:border-yellow-500/40">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent" />
                      <CardHeader className="pb-2 relative z-10">
                        <CardTitle className={`text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                            <Zap className="w-4 h-4 text-yellow-500" />
                          </div>
                          {t.performance}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 relative z-10">
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-yellow-500/5 hover:bg-yellow-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.horsepower}</span>
                          <span className="font-bold text-yellow-600">{currentVehicle.horsepower ? `${currentVehicle.horsepower} ${t.hp}` : t.notAvailable}</span>
                        </div>
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-yellow-500/5 hover:bg-yellow-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.torque}</span>
                          <span className="font-bold text-yellow-600">{currentVehicle.torque ? `${currentVehicle.torque} ${t.nm}` : t.notAvailable}</span>
                        </div>
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-yellow-500/5 hover:bg-yellow-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.acceleration}</span>
                          <span className="font-bold text-yellow-600">{currentVehicle.acceleration ? `${currentVehicle.acceleration}${t.seconds}` : t.notAvailable}</span>
                        </div>
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-yellow-500/5 hover:bg-yellow-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.topSpeed}</span>
                          <span className="font-bold text-yellow-600">{currentVehicle.topSpeed ? `${currentVehicle.topSpeed} ${t.kmh}` : t.notAvailable}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Engine & Fuel */}
                    <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 border border-blue-500/20 hover:border-blue-500/40">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
                      <CardHeader className="pb-2 relative z-10">
                        <CardTitle className={`text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Fuel className="w-4 h-4 text-blue-500" />
                          </div>
                          {t.engineFuel}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 relative z-10">
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-blue-500/5 hover:bg-blue-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.engine}</span>
                          <span className="font-bold text-blue-600">{currentVehicle.engine || t.notAvailable}</span>
                        </div>
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-blue-500/5 hover:bg-blue-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.engineCode}</span>
                          <span className="font-bold text-blue-600">{currentVehicle.engineCode || t.notAvailable}</span>
                        </div>
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-blue-500/5 hover:bg-blue-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.fuelType}</span>
                          <span className="font-bold text-blue-600">{currentVehicle.fuelType || t.notAvailable}</span>
                        </div>
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-blue-500/5 hover:bg-blue-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.consumption}</span>
                          <span className="font-bold text-blue-600">{currentVehicle.fuelConsumption ? `${currentVehicle.fuelConsumption} ${t.literPer100km}` : t.notAvailable}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Transmission */}
                    <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-gray-500/10 transition-all duration-300 border border-gray-500/20 hover:border-gray-400/40">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-transparent" />
                      <CardHeader className="pb-2 relative z-10">
                        <CardTitle className={`text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <div className="w-8 h-8 rounded-lg bg-gray-500/20 flex items-center justify-center shadow-lg shadow-gray-500/20">
                            <Cog className="w-4 h-4 text-gray-400" />
                          </div>
                          {t.transmission}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 relative z-10">
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-gray-500/5 hover:bg-gray-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.type}</span>
                          <span className="font-bold text-gray-300">{currentVehicle.transmission || t.notAvailable}</span>
                        </div>
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-gray-500/5 hover:bg-gray-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.gears}</span>
                          <span className="font-bold text-gray-300">{currentVehicle.gears ? `${currentVehicle.gears}` : t.notAvailable}</span>
                        </div>
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-gray-500/5 hover:bg-gray-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.drivetrain}</span>
                          <span className="font-bold text-gray-300">{currentVehicle.drivetrain || t.notAvailable}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Dimensions */}
                    <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 border border-purple-500/20 hover:border-purple-500/40">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
                      <CardHeader className="pb-2 relative z-10">
                        <CardTitle className={`text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Ruler className="w-4 h-4 text-purple-500" />
                          </div>
                          {t.dimensions}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 relative z-10">
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-purple-500/5 hover:bg-purple-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.length}</span>
                          <span className="font-bold text-purple-400">{currentVehicle.length ? `${currentVehicle.length} ${t.mm}` : t.notAvailable}</span>
                        </div>
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-purple-500/5 hover:bg-purple-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.width}</span>
                          <span className="font-bold text-purple-400">{currentVehicle.width ? `${currentVehicle.width} ${t.mm}` : t.notAvailable}</span>
                        </div>
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-purple-500/5 hover:bg-purple-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.height}</span>
                          <span className="font-bold text-purple-400">{currentVehicle.height ? `${currentVehicle.height} ${t.mm}` : t.notAvailable}</span>
                        </div>
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-purple-500/5 hover:bg-purple-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.wheelbase}</span>
                          <span className="font-bold text-purple-400">{currentVehicle.wheelbase ? `${currentVehicle.wheelbase} ${t.mm}` : t.notAvailable}</span>
                        </div>
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-purple-500/5 hover:bg-purple-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.weight}</span>
                          <span className="font-bold text-purple-400">{currentVehicle.weight ? `${currentVehicle.weight} ${t.kg}` : t.notAvailable}</span>
                        </div>
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-purple-500/5 hover:bg-purple-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.groundClearance}</span>
                          <span className="font-bold text-purple-400">{currentVehicle.groundClearance ? `${currentVehicle.groundClearance} ${t.mm}` : t.notAvailable}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Capacity */}
                    <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 border border-green-500/20 hover:border-green-500/40">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
                      <CardHeader className="pb-2 relative z-10">
                        <CardTitle className={`text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center shadow-lg shadow-green-500/20">
                            <Users className="w-4 h-4 text-green-500" />
                          </div>
                          {t.capacity}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 relative z-10">
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-green-500/5 hover:bg-green-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.seats}</span>
                          <span className="font-bold text-green-500">{currentVehicle.seats || t.notAvailable}</span>
                        </div>
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-green-500/5 hover:bg-green-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.doors}</span>
                          <span className="font-bold text-green-500">{currentVehicle.doors || t.notAvailable}</span>
                        </div>
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-green-500/5 hover:bg-green-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.trunkCapacity}</span>
                          <span className="font-bold text-green-500">{currentVehicle.trunkCapacity != null ? `${currentVehicle.trunkCapacity} ${t.liter}` : t.notAvailable}</span>
                        </div>
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-green-500/5 hover:bg-green-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.fuelTankCapacity}</span>
                          <span className="font-bold text-green-500">{currentVehicle.fuelTankCapacity ? `${currentVehicle.fuelTankCapacity} ${t.liter}` : t.notAvailable}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Wheels & Tires */}
                    <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 border border-orange-500/20 hover:border-orange-500/40">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />
                      <CardHeader className="pb-2 relative z-10">
                        <CardTitle className={`text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <CircleDot className="w-4 h-4 text-orange-500" />
                          </div>
                          {t.wheels}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 relative z-10">
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-orange-500/5 hover:bg-orange-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.wheelSize}</span>
                          <span className="font-bold text-orange-500">{currentVehicle.wheelSize ? `${currentVehicle.wheelSize}"` : t.notAvailable}</span>
                        </div>
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-orange-500/5 hover:bg-orange-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.tireSize}</span>
                          <span className="font-bold text-orange-500">{currentVehicle.tireSize || t.notAvailable}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Warranty */}
                    <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 border border-amber-500/20 hover:border-amber-500/40">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
                      <CardHeader className="pb-2 relative z-10">
                        <CardTitle className={`text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Award className="w-4 h-4 text-amber-500" />
                          </div>
                          {t.warranty}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 relative z-10">
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-amber-500/5 hover:bg-amber-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.warrantyYears}</span>
                          <span className="font-bold text-amber-500">{currentVehicle.warrantyYears ? `${currentVehicle.warrantyYears} ${t.years}` : t.notAvailable}</span>
                        </div>
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-amber-500/5 hover:bg-amber-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.warrantyKm}</span>
                          <span className="font-bold text-amber-500">{currentVehicle.warrantyKm ? `${currentVehicle.warrantyKm.toLocaleString()} ${t.km}` : t.notAvailable}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Additional Info */}
                    <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 border border-indigo-500/20 hover:border-indigo-500/40">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent" />
                      <CardHeader className="pb-2 relative z-10">
                        <CardTitle className={`text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Car className="w-4 h-4 text-indigo-500" />
                          </div>
                          {t.additionalInfo}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 relative z-10">
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.condition}</span>
                          <span className="font-bold text-indigo-400">{currentVehicle.condition === 'new' ? t.newCar : currentVehicle.condition === 'used' ? t.usedCar : t.notAvailable}</span>
                        </div>
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.mileage}</span>
                          <span className="font-bold text-indigo-400">{currentVehicle.mileage != null ? `${currentVehicle.mileage.toLocaleString()} ${t.km}` : t.notAvailable}</span>
                        </div>
                        <div className={`flex justify-between items-center p-2 rounded-lg bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-sm">{t.color}</span>
                          <span className="font-bold text-indigo-400">{currentVehicle.color || t.notAvailable}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Safety Features */}
                    <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 border border-red-500/20 hover:border-red-500/40">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent" />
                      <CardHeader className="pb-2 relative z-10">
                        <CardTitle className={`text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center shadow-lg shadow-red-500/20">
                            <Shield className="w-4 h-4 text-red-500" />
                          </div>
                          {t.safetyFeatures}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="flex flex-wrap gap-2">
                          {(currentVehicle.safetyFeatures || [isRTL ? 'نظام ABS' : 'ABS System', isRTL ? 'وسائد هوائية' : 'Airbags', isRTL ? 'التحكم بالثبات' : 'Stability Control', isRTL ? 'كاميرا خلفية' : 'Rear Camera', isRTL ? 'مستشعرات ركن' : 'Parking Sensors']).map((feature, i) => (
                            <Badge key={i} className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tech Features */}
                    <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 border border-cyan-500/20 hover:border-cyan-500/40">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent" />
                      <CardHeader className="pb-2 relative z-10">
                        <CardTitle className={`text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <Wifi className="w-4 h-4 text-cyan-500" />
                          </div>
                          {t.technology}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="flex flex-wrap gap-2">
                          {(currentVehicle.techFeatures || [isRTL ? 'شاشة لمسية' : 'Touchscreen', isRTL ? 'بلوتوث' : 'Bluetooth', isRTL ? 'Apple CarPlay' : 'Apple CarPlay', isRTL ? 'Android Auto' : 'Android Auto', isRTL ? 'نظام صوتي' : 'Audio System']).map((feature, i) => (
                            <Badge key={i} className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Comfort Features */}
                    <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 border border-teal-500/20 hover:border-teal-500/40">
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent" />
                      <CardHeader className="pb-2 relative z-10">
                        <CardTitle className={`text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center shadow-lg shadow-teal-500/20">
                            <Package className="w-4 h-4 text-teal-500" />
                          </div>
                          {t.comfortFeatures}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="flex flex-wrap gap-2">
                          {(currentVehicle.comfortFeatures || [isRTL ? 'تكييف أوتوماتيكي' : 'Auto AC', isRTL ? 'مقاعد جلدية' : 'Leather Seats', isRTL ? 'تسخين المقاعد' : 'Heated Seats', isRTL ? 'فتحة سقف' : 'Sunroof', isRTL ? 'تحكم بالمقاعد' : 'Seat Control']).map((feature, i) => (
                            <Badge key={i} className="bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20 transition-colors text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Exterior Features */}
                    <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 border border-sky-500/20 hover:border-sky-500/40">
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent" />
                      <CardHeader className="pb-2 relative z-10">
                        <CardTitle className={`text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center shadow-lg shadow-sky-500/20">
                            <Palette className="w-4 h-4 text-sky-500" />
                          </div>
                          {t.exteriorFeatures}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="flex flex-wrap gap-2">
                          {[isRTL ? 'مصابيح LED' : 'LED Lights', isRTL ? 'مرايات كهربائية' : 'Electric Mirrors', isRTL ? 'سقف بانورامي' : 'Panoramic Roof', isRTL ? 'جنوط ألمنيوم' : 'Alloy Wheels', isRTL ? 'سنسور مطر' : 'Rain Sensor'].map((feature, i) => (
                            <Badge key={i} className="bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 transition-colors text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Source Info */}
                    {currentVehicle.sourceUrl && (
                      <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 border border-primary/20 hover:border-primary/40">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                        <CardHeader className="pb-2 relative z-10">
                          <CardTitle className={`text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shadow-lg shadow-primary/20">
                              <Link className="w-4 h-4 text-primary" />
                            </div>
                            {t.source}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                          <a 
                            href={currentVehicle.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline break-all"
                            dir="ltr"
                          >
                            {currentVehicle.sourceUrl}
                          </a>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Market Analysis Section - Merged */}
                  <div className="mt-8 space-y-6">
                    <h3 className={`text-xl font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      <TrendingUp className="w-5 h-5 text-primary" />
                      {t.priceAnalysis}
                    </h3>
                    
                    {marketAnalysis ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Price Analysis */}
                        <Card>
                          <CardHeader>
                            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                              <DollarSign className="w-5 h-5 text-green-500" />
                              {t.priceAnalysis}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {marketAnalysis.priceRange && (
                              <div className="space-y-2">
                                <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  <span>{t.marketRange}</span>
                                  <span className="font-medium">
                                    {getCurrencyDisplay()} {marketAnalysis.priceRange.min?.toLocaleString()} - {marketAnalysis.priceRange.max?.toLocaleString()}
                                  </span>
                                </div>
                                {currentVehicle.price && marketAnalysis.priceRange.max && (
                                  <Progress 
                                    value={((currentVehicle.price - (marketAnalysis.priceRange.min || 0)) / ((marketAnalysis.priceRange.max || 1) - (marketAnalysis.priceRange.min || 0))) * 100}
                                    className="h-2"
                                  />
                                )}
                              </div>
                            )}
                            <p className="text-sm text-muted-foreground text-right">
                              {marketAnalysis.priceAnalysis}
                            </p>
                          </CardContent>
                        </Card>

                        {/* Reliability */}
                        <Card>
                          <CardHeader>
                            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                              <Shield className="w-5 h-5 text-blue-500" />
                              {t.reliability}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {marketAnalysis.reliabilityScore && (
                              <div className="space-y-2">
                                <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  <span>{t.score}</span>
                                  <span className="font-medium">{marketAnalysis.reliabilityScore}/10</span>
                                </div>
                                <Progress value={marketAnalysis.reliabilityScore * 10} className="h-2" />
                              </div>
                            )}
                            {marketAnalysis.commonIssues?.length > 0 && (
                              <div>
                                <p className="text-sm font-medium mb-2 text-right">{t.commonIssues}</p>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  {marketAnalysis.commonIssues.map((issue: string, i: number) => (
                                    <li key={i} className={`flex items-start gap-2 text-sm ${isRTL ? 'flex-row-reverse justify-start' : ''}`}>
                                      <AlertCircle className="w-4 h-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                                      <span>{issue}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Pros & Cons */}
                        <Card className="md:col-span-2">
                          <CardHeader>
                            <CardTitle className={isRTL ? 'text-right' : ''}>{t.prosCons}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className={`flex flex-col md:flex-row gap-6`}>
                              {/* المميزات - Pros */}
                              <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                                <h4 className="font-medium text-green-500 mb-2">{t.pros}</h4>
                                <ul className="space-y-2">
                                  {marketAnalysis.pros?.map((pro: string, i: number) => (
                                    <li key={i} className={`flex items-start gap-2 text-sm ${isRTL ? 'flex-row-reverse justify-start' : ''}`}>
                                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                                      <span>{pro}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {/* فاصل - Divider */}
                              <div className="hidden md:block w-px bg-border"></div>
                              {/* العيوب - Cons */}
                              <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                                <h4 className="font-medium text-red-500 mb-2">{t.cons}</h4>
                                <ul className="space-y-2">
                                  {marketAnalysis.cons?.map((con: string, i: number) => (
                                    <li key={i} className={`flex items-start gap-2 text-sm ${isRTL ? 'flex-row-reverse justify-start' : ''}`}>
                                      <X className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" />
                                      <span>{con}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Alternatives - Premium Rectangular Design */}
                        {marketAnalysis.alternatives?.length > 0 && (
                          <Card className="md:col-span-2 overflow-hidden relative">
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/15 via-cyan-500/10 to-transparent rounded-full blur-3xl -translate-y-48 translate-x-48 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-amber-500/10 via-primary/10 to-transparent rounded-full blur-3xl translate-y-36 -translate-x-36 pointer-events-none" />
                            
                            <CardHeader className="relative z-10 pb-4">
                              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <CardTitle className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  <div className="relative">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-cyan-500 to-emerald-500 flex items-center justify-center shadow-xl shadow-primary/40">
                                      <Sparkles className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
                                      <Star className="w-3 h-3 text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">{t.alternatives}</h3>
                                    <p className="text-sm text-muted-foreground font-normal mt-0.5">
                                      {isRTL ? 'اختر من بين أفضل البدائل المقترحة' : 'Choose from the best suggested alternatives'}
                                    </p>
                                  </div>
                                </CardTitle>
                                <Badge variant="secondary" className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-primary/10 to-cyan-500/10 border-primary/20">
                                  {marketAnalysis.alternatives.length} {isRTL ? 'خيارات متاحة' : 'options available'}
                                </Badge>
                              </div>
                            </CardHeader>
                            
                            <CardContent className="relative z-10 pt-2">
                              {/* 3 Rectangular Car Frames */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {marketAnalysis.alternatives.slice(0, 3).map((alt: string, i: number) => {
                                  // Premium gradient colors for each card
                                  const cardStyles = [
                                    {
                                      gradient: 'from-rose-500/10 via-orange-500/5 to-amber-500/10',
                                      border: 'hover:border-rose-400/50',
                                      accent: 'from-rose-500 to-orange-500',
                                      iconBg: 'bg-gradient-to-br from-rose-500 to-orange-500',
                                      glow: 'shadow-rose-500/20',
                                      badge: 'bg-rose-500/90'
                                    },
                                    {
                                      gradient: 'from-cyan-500/10 via-blue-500/5 to-indigo-500/10',
                                      border: 'hover:border-cyan-400/50',
                                      accent: 'from-cyan-500 to-blue-500',
                                      iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-500',
                                      glow: 'shadow-cyan-500/20',
                                      badge: 'bg-cyan-500/90'
                                    },
                                    {
                                      gradient: 'from-emerald-500/10 via-teal-500/5 to-cyan-500/10',
                                      border: 'hover:border-emerald-400/50',
                                      accent: 'from-emerald-500 to-teal-500',
                                      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500',
                                      glow: 'shadow-emerald-500/20',
                                      badge: 'bg-emerald-500/90'
                                    }
                                  ];
                                  const style = cardStyles[i % cardStyles.length];
                                  
                                  return (
                                    <motion.div
                                      key={i}
                                      initial={{ opacity: 0, y: 30 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: i * 0.15, duration: 0.5 }}
                                      whileHover={{ scale: 1.02, y: -6 }}
                                      whileTap={{ scale: 0.98 }}
                                      className="cursor-pointer"
                                      onClick={() => handleAlternativeClick(alt)}
                                    >
                                      <Card className={`relative overflow-hidden border-2 border-transparent ${style.border} bg-gradient-to-br ${style.gradient} transition-all duration-500 hover:shadow-2xl ${style.glow}`}>
                                        {/* Rank Badge */}
                                        <div className="absolute top-3 left-3 z-20">
                                          <div className={`px-3 py-1.5 rounded-full ${style.badge} text-white text-xs font-bold shadow-lg flex items-center gap-1.5`}>
                                            <Award className="w-3.5 h-3.5" />
                                            #{i + 1}
                                          </div>
                                        </div>
                                        
                                        {/* Car Image Area - Rectangular Frame */}
                                        <div className="relative h-40 overflow-hidden">
                                          {/* Gradient Background */}
                                          <div className={`absolute inset-0 bg-gradient-to-br ${style.accent} opacity-20`} />
                                          
                                          {/* Pattern Overlay */}
                                          <div className="absolute inset-0 opacity-30" style={{
                                            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                                            backgroundSize: '24px 24px'
                                          }} />
                                          
                                          {/* Car Icon */}
                                          <div className="absolute inset-0 flex items-center justify-center">
                                            <motion.div 
                                              className={`w-24 h-24 rounded-3xl ${style.iconBg} flex items-center justify-center shadow-2xl`}
                                              whileHover={{ rotate: 5, scale: 1.1 }}
                                              transition={{ type: "spring", stiffness: 300 }}
                                            >
                                              <Car className="w-12 h-12 text-white" />
                                            </motion.div>
                                          </div>
                                          
                                          {/* Shine Effect */}
                                          <motion.div 
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                            initial={{ x: '-100%' }}
                                            whileHover={{ x: '100%' }}
                                            transition={{ duration: 0.8, ease: "easeInOut" }}
                                          />
                                        </div>
                                        
                                        {/* Content Area */}
                                        <CardContent className={`p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                                          <div className="space-y-3">
                                            {/* Car Name */}
                                            <div className="min-h-[3rem]">
                                              <h4 className="font-bold text-lg leading-tight line-clamp-2">{alt}</h4>
                                              <p className="text-xs text-muted-foreground mt-1">
                                                {isRTL ? 'سيارة بديلة موصى بها' : 'Recommended alternative'}
                                              </p>
                                            </div>
                                            
                                            {/* Features Preview */}
                                            <div className={`flex flex-wrap gap-1.5 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                                              <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-background/50">
                                                {isRTL ? 'تحليل شامل' : 'Full Analysis'}
                                              </Badge>
                                              <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-background/50">
                                                {isRTL ? 'مقارنة فورية' : 'Quick Compare'}
                                              </Badge>
                                            </div>
                                            
                                            {/* Action Button */}
                                            <Button 
                                              size="sm" 
                                              className={`w-full ${style.iconBg} text-white text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleAlternativeClick(alt);
                                              }}
                                            >
                                              <Zap className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                              {isRTL ? 'تحليل الآن' : 'Analyze Now'}
                                              <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                                            </Button>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </motion.div>
                                  );
                                })}
                              </div>
                              
                              {/* Show More Button if more than 3 alternatives */}
                              {marketAnalysis.alternatives.length > 3 && (
                                <motion.div 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.5 }}
                                  className="mt-4"
                                >
                                  <Button 
                                    variant="outline" 
                                    className="w-full border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300"
                                    onClick={() => {
                                      const moreAlts = marketAnalysis.alternatives.slice(3);
                                      if (moreAlts.length > 0) {
                                        handleAlternativeClick(moreAlts[0]);
                                      }
                                    }}
                                  >
                                    <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                    {isRTL 
                                      ? `+ ${marketAnalysis.alternatives.length - 3} خيارات أخرى متاحة`
                                      : `+ ${marketAnalysis.alternatives.length - 3} more alternatives available`}
                                  </Button>
                                </motion.div>
                              )}
                              
                              {/* Pro Tip */}
                              <div className={`mt-5 p-4 rounded-2xl bg-gradient-to-r from-primary/5 via-amber-500/5 to-primary/5 border border-primary/10 ${isRTL ? 'text-right' : 'text-left'}`}>
                                <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/30">
                                    <Lightbulb className="w-6 h-6 text-white" />
                                  </div>
                                  <div>
                                    <h4 className={`font-semibold text-sm mb-1.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                                      {isRTL ? '💡 نصيحة ذكية' : '💡 Smart Tip'}
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                      {isRTL 
                                        ? 'قارن بين السيارات البديلة للعثور على أفضل خيار يناسب احتياجاتك وميزانيتك. انقر على أي سيارة للحصول على تحليل شامل ومفصل.'
                                        : 'Compare alternative vehicles to find the best match for your needs and budget. Click any car for a comprehensive detailed analysis.'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                        
                        {/* Competitors Section */}
                        <Card className="md:col-span-2">
                          <CardHeader>
                            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                              <GitCompare className="w-5 h-5 text-primary" />
                              {t.competitors}
                            </CardTitle>
                            <CardDescription className={isRTL ? 'text-right' : ''}>{t.competitorsDesc}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            {loadingCompetitors ? (
                              <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-muted-foreground`}>{t.loadingCompetitors}</span>
                              </div>
                            ) : competitors?.competitors?.length > 0 ? (
                              <div className="space-y-4">
                                {/* Segment Info */}
                                {competitors.segmentInfo && (
                                  <div className={`flex items-center gap-2 mb-4 p-3 bg-muted/50 rounded-lg ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                                    <Link className="w-5 h-5 text-primary" />
                                    <span className="text-sm">
                                      <strong>{isRTL ? competitors.segmentInfo.nameAr : competitors.segmentInfo.name}</strong>
                                    </span>
                                  </div>
                                )}
                                
                                {/* Competitors Grid */}
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                  {competitors.competitors.map((comp: any, i: number) => (
                                    <Card 
                                      key={i} 
                                      className={`${i === 0 ? 'border-2 border-primary bg-primary/5' : ''} cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden`}
                                      onClick={() => handleCompetitorClick(comp)}
                                    >
                                      {/* Click indicator overlay */}
                                      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                      
                                      {/* Analyze button overlay */}
                                      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button size="sm" className="w-full sky-gradient text-white text-xs">
                                          <Sparkles className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                          {isRTL ? 'تحليل المنافس' : 'Analyze Competitor'}
                                        </Button>
                                      </div>
                                      
                                      <CardContent className={`p-4 ${isRTL ? 'text-right' : 'text-left'} pb-12`}>
                                        <div className="space-y-3">
                                          <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                            <div className={isRTL ? 'text-right' : 'text-left'}>
                                              <h4 className="font-bold text-base group-hover:text-primary transition-colors">{comp.brand} {comp.model}</h4>
                                              <p className="text-xs text-muted-foreground">{comp.year || ''}</p>
                                            </div>
                                            {i === 0 && (
                                              <Badge className="bg-primary text-white text-xs">{t.bestValue}</Badge>
                                            )}
                                          </div>
                                          
                                          <div className="space-y-2">
                                            <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                              <span className="text-muted-foreground">{t.price}</span>
                                              <span className="font-semibold">
                                                {comp.averagePrice?.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}
                                              </span>
                                            </div>
                                            
                                            {comp.priceDifference !== null && (
                                              <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                <span className="text-muted-foreground">{t.priceDifference}</span>
                                                <Badge variant={
                                                  comp.priceStatus === 'cheaper' ? 'default' :
                                                  comp.priceStatus === 'more_expensive' ? 'destructive' :
                                                  'secondary'
                                                }>
                                                  {comp.priceStatus === 'cheaper' && `- ${Math.abs(comp.priceDifference).toLocaleString()}`}
                                                  {comp.priceStatus === 'more_expensive' && `+ ${comp.priceDifference.toLocaleString()}`}
                                                  {comp.priceStatus === 'similar' && t.similar}
                                                </Badge>
                                              </div>
                                            )}
                                            
                                            <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                              <span className="text-muted-foreground">{t.horsepower}</span>
                                              <span className="font-medium text-yellow-500">{comp.horsepower ? `${comp.horsepower} ${t.hp}` : t.notAvailable}</span>
                                            </div>
                                            
                                            <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                              <span className="text-muted-foreground">{t.consumption}</span>
                                              <span className="font-medium text-green-500">{comp.fuelConsumption ? `${comp.fuelConsumption} ${t.literPer100km}` : t.notAvailable}</span>
                                            </div>
                                            
                                            <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                              <span className="text-muted-foreground">{t.valueScore}</span>
                                              <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                <Progress value={comp.valueScore * 10} className="w-12 h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-cyan-500" />
                                                <span className="text-xs font-bold text-primary">{comp.valueScore?.toFixed(1)}</span>
                                              </div>
                                            </div>
                                          </div>
                                          
                                          <div className="pt-2 border-t">
                                            <div className="flex flex-wrap gap-1">
                                              {comp.keyFeatures?.slice(0, 2).map((f: string, j: number) => (
                                                <Badge key={j} variant="outline" className="text-xs border-primary/30 text-primary">{f}</Badge>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                                
                                {/* Recommendation */}
                                {competitors.recommendation && (
                                  <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                                    <h4 className={`font-semibold mb-1 ${isRTL ? 'text-right' : ''}`}>{t.recommendation}</h4>
                                    <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : ''}`}>{competitors.recommendation}</p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-muted-foreground">
                                {isRTL ? 'لا توجد بيانات منافسين متاحة' : 'No competitor data available'}
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Best Selling Cars Section */}
                        <Card className="md:col-span-2">
                          <CardHeader>
                            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                              <TrendingUp className="w-5 h-5 text-amber-500" />
                              {t.bestSellingCars}
                            </CardTitle>
                            <CardDescription className={isRTL ? 'text-right' : ''}>{t.bestSellingCarsDesc}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                              {bestSellingCars.map((car, i) => (
                                <Card 
                                  key={i}
                                  className={`${i === 0 ? 'border-2 border-amber-500 bg-amber-500/5' : ''} cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden`}
                                  onClick={() => handleBestSellingCarClick(car)}
                                >
                                  {/* Click indicator overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                  
                                  {/* Rank Badge */}
                                  <div className="absolute top-2 left-2 z-10">
                                    <Badge className={`text-xs font-bold ${i < 3 ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                                      #{car.salesRank}
                                    </Badge>
                                  </div>
                                  
                                  {/* Analyze button overlay */}
                                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="sm" className="w-full sky-gradient text-white text-xs">
                                      <Sparkles className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                      {t.clickToAnalyze}
                                    </Button>
                                  </div>
                                  
                                  <CardContent className={`p-4 ${isRTL ? 'text-right' : 'text-left'} pb-12`}>
                                    <div className="space-y-3">
                                      <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <div className={isRTL ? 'text-right' : 'text-left'}>
                                          <h4 className="font-bold text-base group-hover:text-primary transition-colors">{car.brand} {car.model}</h4>
                                          <p className="text-xs text-muted-foreground">{car.year}</p>
                                        </div>
                                        {i === 0 && (
                                          <Badge className="bg-amber-500 text-white text-xs">{t.popularChoice}</Badge>
                                        )}
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                          <span className="text-muted-foreground">{t.price}</span>
                                          <span className="font-semibold">
                                            {car.price?.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}
                                          </span>
                                        </div>
                                        
                                        <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                          <span className="text-muted-foreground">{t.horsepower}</span>
                                          <span className="font-medium text-yellow-500">{car.horsepower} {t.hp}</span>
                                        </div>
                                        
                                        <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                          <span className="text-muted-foreground">{t.consumption}</span>
                                          <span className="font-medium text-green-500">{car.fuelConsumption} {t.literPer100km}</span>
                                        </div>
                                        
                                        <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                          <span className="text-muted-foreground text-sm">{isRTL ? 'الفئة' : 'Category'}</span>
                                          <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                                            {car.category}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>

                            {/* Best Selling Recommendation */}
                            <div className="mt-4 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/20">
                              <h4 className={`font-semibold mb-2 flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-start text-right' : ''}`}>
                                <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                <span>{t.recommendation}</span>
                              </h4>
                              <p className={`text-sm text-muted-foreground leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                                {isRTL 
                                  ? 'تويوتا كامري هي السيارة الأكثر مبيعاً في السوق السعودي لموثوقيتها العالية وقيمة إعادة البيع الممتازة. تقدم توازناً مثالياً بين الراحة والأداء والاقتصادية في استهلاك الوقود، مما يجعلها الخيار الأمثل للعائلات والاستخدام اليومي.'
                                  : 'Toyota Camry is the best-selling car in the Saudi market due to its high reliability and excellent resale value. It offers the perfect balance between comfort, performance, and fuel economy, making it the ideal choice for families and daily use.'}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">{isRTL ? 'جاري تحليل بيانات السوق...' : 'Analyzing market data...'}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                {/* Financing Tab */}
                <TabsContent value="financing">
                  {/* Financing Programs Section */}
                  <Card className="mb-6">
                    <CardHeader className="pb-4">
                      <CardTitle className={`text-lg flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-start text-right' : ''}`}>
                        <span className="text-2xl">💰</span>
                        <span>{t.financingPrograms}</span>
                      </CardTitle>
                      <CardDescription className={isRTL ? 'text-right' : ''}>{t.financingProgramsDesc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Murabaha */}
                        <Card className="bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                          <CardContent className={`p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse justify-start' : ''}`}>
                              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              </div>
                              <h4 className="font-bold text-sm">{t.murabaha}</h4>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">{t.murabahaDesc}</p>
                            <div className="space-y-2 mb-3">
                              <div className={`flex items-start gap-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{t.murabahaFeatures.split(' | ')[0]}</span>
                              </div>
                              <div className={`flex items-start gap-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{t.murabahaFeatures.split(' | ')[1]}</span>
                              </div>
                              <div className={`flex items-start gap-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{t.murabahaFeatures.split(' | ')[2]}</span>
                              </div>
                            </div>
                            <div className={`p-2 bg-blue-500/10 rounded-lg mb-3 ${isRTL ? 'text-right' : ''}`}>
                              <p className="text-xs text-blue-600"><strong>{t.programTips}:</strong> {t.murabahaTip}</p>
                            </div>
                            <Button className="w-full sky-gradient text-white group-hover:shadow-lg transition-shadow" onClick={() => openFinancingChatbot(t.murabaha)}>
                              <Send className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              {t.applyNow}
                            </Button>
                          </CardContent>
                        </Card>

                        {/* Ownership Financing */}
                        <Card className="bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                          <CardContent className={`p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse justify-start' : ''}`}>
                              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Award className="w-5 h-5 text-blue-500" />
                              </div>
                              <h4 className="font-bold text-sm">{t.ownershipFinancing}</h4>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">{t.ownershipFinancingDesc}</p>
                            <div className="space-y-2 mb-3">
                              <div className={`flex items-start gap-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <CheckCircle2 className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>{t.ownershipFinancingFeatures.split(' | ')[0]}</span>
                              </div>
                              <div className={`flex items-start gap-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <CheckCircle2 className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>{t.ownershipFinancingFeatures.split(' | ')[1]}</span>
                              </div>
                              <div className={`flex items-start gap-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <CheckCircle2 className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>{t.ownershipFinancingFeatures.split(' | ')[2]}</span>
                              </div>
                            </div>
                            <div className={`p-2 bg-blue-500/10 rounded-lg mb-3 ${isRTL ? 'text-right' : ''}`}>
                              <p className="text-xs text-blue-600"><strong>{t.programTips}:</strong> {t.ownershipFinancingTip}</p>
                            </div>
                            <Button className="w-full sky-gradient text-white group-hover:shadow-lg transition-shadow" onClick={() => openFinancingChatbot(t.ownershipFinancing)}>
                              <Send className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              {t.applyNow}
                            </Button>
                          </CardContent>
                        </Card>

                        {/* Installment Program */}
                        <Card className="bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                          <CardContent className={`p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse justify-start' : ''}`}>
                              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                <Calculator className="w-5 h-5 text-purple-500" />
                              </div>
                              <h4 className="font-bold text-sm">{t.installmentProgram}</h4>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">{t.installmentProgramDesc}</p>
                            <div className="space-y-2 mb-3">
                              <div className={`flex items-start gap-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <CheckCircle2 className="w-3 h-3 text-purple-500 mt-0.5 flex-shrink-0" />
                                <span>{t.installmentProgramFeatures.split(' | ')[0]}</span>
                              </div>
                              <div className={`flex items-start gap-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <CheckCircle2 className="w-3 h-3 text-purple-500 mt-0.5 flex-shrink-0" />
                                <span>{t.installmentProgramFeatures.split(' | ')[1]}</span>
                              </div>
                              <div className={`flex items-start gap-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <CheckCircle2 className="w-3 h-3 text-purple-500 mt-0.5 flex-shrink-0" />
                                <span>{t.installmentProgramFeatures.split(' | ')[2]}</span>
                              </div>
                            </div>
                            <div className={`p-2 bg-blue-500/10 rounded-lg mb-3 ${isRTL ? 'text-right' : ''}`}>
                              <p className="text-xs text-blue-600"><strong>{t.programTips}:</strong> {t.installmentProgramTip}</p>
                            </div>
                            <Button className="w-full sky-gradient text-white group-hover:shadow-lg transition-shadow" onClick={() => openFinancingChatbot(t.installmentProgram)}>
                              <Send className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              {t.applyNow}
                            </Button>
                          </CardContent>
                        </Card>

                        {/* Lease Program */}
                        <Card className="bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                          <CardContent className={`p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse justify-start' : ''}`}>
                              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                <Car className="w-5 h-5 text-orange-500" />
                              </div>
                              <h4 className="font-bold text-sm">{t.leaseProgram}</h4>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">{t.leaseProgramDesc}</p>
                            <div className="space-y-2 mb-3">
                              <div className={`flex items-start gap-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <CheckCircle2 className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                                <span>{t.leaseProgramFeatures.split(' | ')[0]}</span>
                              </div>
                              <div className={`flex items-start gap-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <CheckCircle2 className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                                <span>{t.leaseProgramFeatures.split(' | ')[1]}</span>
                              </div>
                              <div className={`flex items-start gap-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <CheckCircle2 className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                                <span>{t.leaseProgramFeatures.split(' | ')[2]}</span>
                              </div>
                            </div>
                            <div className={`p-2 bg-blue-500/10 rounded-lg mb-3 ${isRTL ? 'text-right' : ''}`}>
                              <p className="text-xs text-blue-600"><strong>{t.programTips}:</strong> {t.leaseProgramTip}</p>
                            </div>
                            <Button className="w-full sky-gradient text-white group-hover:shadow-lg transition-shadow" onClick={() => openFinancingChatbot(t.leaseProgram)}>
                              <Send className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              {t.applyNow}
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Calculator - Enhanced */}
                    <Card className="lg:col-span-1 overflow-hidden relative">
                      {/* Decorative gradient */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl -translate-y-16 translate-x-16 pointer-events-none" />
                      
                      <CardHeader className="relative z-10">
                        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg">
                            <Calculator className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <span className="text-lg font-bold">{t.loanCalculator}</span>
                            <p className="text-xs text-muted-foreground font-normal">{t.salaryBasedCalc}</p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="space-y-5 relative z-10">
                        {/* Car Price Input - Always show */}
                        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                          <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                            <DollarSign className="w-5 h-5 text-amber-500" />
                            <Label className="font-semibold text-amber-600">{isRTL ? 'سعر السيارة' : 'Car Price'}</Label>
                          </div>
                          <div className="relative">
                            <Input
                              type="text"
                              inputMode="numeric"
                              placeholder={isRTL ? 'أدخل سعر السيارة' : 'Enter car price'}
                              value={(currentVehicle.price || manualCarPrice) || ''}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                const price = Number(value);
                                setManualCarPrice(price);
                                if (price > 0) {
                                  calculateFinancing(price);
                                }
                              }}
                              className={`text-lg font-bold ${isRTL ? 'text-right pr-16' : 'text-left pl-16'} h-12 border-amber-500/30 focus:border-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                            />
                            <span className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground font-medium ${isRTL ? 'left-3' : 'right-3'}`}>
                              {isRTL ? 'ريال' : 'SAR'}
                            </span>
                          </div>
                        </div>

                        {/* Salary Input Section - Always show */}
                        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                          <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                            <DollarSign className="w-5 h-5 text-emerald-500" />
                            <Label className="font-semibold text-emerald-600">{t.monthlySalary}</Label>
                          </div>
                          <div className="relative">
                            <Input
                              type="text"
                              inputMode="numeric"
                              placeholder={t.enterSalary}
                              value={financingParams.salary || ''}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                const salary = Number(value);
                                setFinancingParams({ salary });
                                // Auto-calculate eligibility
                                if (salary > 0 && financingResult) {
                                  const maxPayment = salary * 0.33; // 33% of salary
                                  const isEligible = financingResult.monthlyPayment <= maxPayment;
                                  setSalaryEligibility({
                                    isEligible,
                                    maxMonthlyPayment: maxPayment,
                                    recommendedDownPayment: Math.max(20, Math.round((1 - (maxPayment * financingParams.loanTerm) / (currentVehicle.price || manualCarPrice || 100000)) * 100)),
                                    debtToIncomeRatio: Math.round((financingResult.monthlyPayment / salary) * 100)
                                  });
                                }
                              }}
                              className={`text-lg font-bold ${isRTL ? 'text-right pr-16' : 'text-left pl-16'} h-12 border-emerald-500/30 focus:border-emerald-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                            />
                                <span className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground font-medium ${isRTL ? 'left-3' : 'right-3'}`}>
                                  {isRTL ? 'ريال' : 'SAR'}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {t.salaryHint}
                              </p>
                            </div>

                            {/* Bank Selection */}
                            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
                              <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                                <Building2 className="w-5 h-5 text-blue-500" />
                                <Label className="font-semibold text-blue-600">{t.selectBank}</Label>
                              </div>
                              <select
                                value={financingParams.selectedBank || ''}
                                onChange={(e) => {
                                  const bankId = e.target.value;
                                  setFinancingParams({ selectedBank: bankId || null });
                                  if (bankId) {
                                    const selectedBank = bankOffers.find(b => b.id === bankId);
                                    if (selectedBank) {
                                      setFinancingParams({ 
                                        interestRate: selectedBank.interestRate,
                                        selectedBank: bankId 
                                      });
                                      calculateFinancing(currentVehicle.price || manualCarPrice || 100000, { interestRate: selectedBank.interestRate });
                                    }
                                  }
                                }}
                                className={`w-full h-10 rounded-lg border border-blue-500/30 bg-background px-3 ${isRTL ? 'text-right' : 'text-left'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                              >
                                <option value="">{t.allBanks}</option>
                                {bankOffers.map(bank => (
                                  <option key={bank.id} value={bank.id}>
                                    {isRTL ? bank.bankName : bank.bankNameEn} - {bank.interestRate}%
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Eligibility Check Result */}
                            {salaryEligibility && financingParams.salary > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-xl border ${salaryEligibility.isEligible ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}
                              >
                                <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                                  {salaryEligibility.isEligible ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                  )}
                                  <span className={`font-bold ${salaryEligibility.isEligible ? 'text-green-600' : 'text-red-600'}`}>
                                    {salaryEligibility.isEligible ? t.eligible : t.notEligible}
                                  </span>
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-muted-foreground">{t.maxMonthlyPayment}</span>
                                    <span className="font-semibold">{getCurrencyDisplay()} {Math.round(salaryEligibility.maxMonthlyPayment).toLocaleString()}</span>
                                  </div>
                                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-muted-foreground">{t.debtToIncomeRatio}</span>
                                    <span className={`font-semibold ${salaryEligibility.debtToIncomeRatio > 33 ? 'text-red-500' : 'text-green-500'}`}>
                                      {salaryEligibility.debtToIncomeRatio}%
                                    </span>
                                  </div>
                                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-muted-foreground">{t.recommendedDownPayment}</span>
                                    <span className="font-semibold">{salaryEligibility.recommendedDownPayment}%</span>
                                  </div>
                                </div>
                              </motion.div>
                            )}

                            <Separator />

                            {/* Down Payment Slider */}
                            <div>
                              <div className={`flex justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <Label className="font-medium">{t.downPayment}</Label>
                                <span className="text-sm font-bold text-primary">{financingParams.downPayment}%</span>
                              </div>
                              <Slider
                                value={[financingParams.downPayment]}
                                onValueChange={([value]) => {
                                  setFinancingParams({ downPayment: value });
                                  calculateFinancing(currentVehicle.price || manualCarPrice || 100000, { downPayment: value });
                                }}
                                min={5}
                                max={50}
                                step={5}
                                className="py-2"
                              />
                              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                = {getCurrencyDisplay()} {Math.round((currentVehicle.price || manualCarPrice || 100000) * financingParams.downPayment / 100).toLocaleString()}
                              </p>
                            </div>

                            {/* Loan Term Slider */}
                            <div>
                              <div className={`flex justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <Label className="font-medium">{t.loanTerm}</Label>
                                <span className="text-sm font-bold text-primary">{financingParams.loanTerm} {t.months}</span>
                              </div>
                              <Slider
                                value={[financingParams.loanTerm]}
                                onValueChange={([value]) => {
                                  setFinancingParams({ loanTerm: value });
                                  calculateFinancing(currentVehicle.price || manualCarPrice || 100000, { loanTerm: value });
                                }}
                                min={12}
                                max={84}
                                step={12}
                                className="py-2"
                              />
                              <p className="text-sm text-muted-foreground mt-1">
                                = {financingParams.loanTerm / 12} {t.years}
                              </p>
                            </div>

                            {/* Interest Rate Slider */}
                            <div>
                              <div className={`flex justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <Label className="font-medium">{t.interestRate}</Label>
                                <span className="text-sm font-bold text-primary">{financingParams.interestRate}%</span>
                              </div>
                              <Slider
                                value={[financingParams.interestRate]}
                                onValueChange={([value]) => {
                                  setFinancingParams({ interestRate: value });
                                  calculateFinancing(currentVehicle.price || manualCarPrice || 100000, { interestRate: value });
                                }}
                                min={1}
                                max={15}
                                step={0.1}
                                className="py-2"
                              />
                            </div>

                            <Separator className="my-4" />

                            {/* Results */}
                            {financingResult && (
                              <div className="space-y-3">
                                <div className={`p-4 rounded-xl bg-gradient-to-r from-primary/10 to-cyan-500/10 border border-primary/20 ${isRTL ? 'text-right' : 'text-left'}`}>
                                  <div className="text-sm text-muted-foreground mb-1">{t.monthlyPayment}</div>
                                  <div className="text-3xl font-bold text-primary">
                                    {getCurrencyDisplay()} {Math.round(financingResult.monthlyPayment).toLocaleString()}
                                  </div>
                                  {financingParams.salary > 0 && (
                                    <div className="mt-2 flex items-center gap-2">
                                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                        <div 
                                          className={`h-full rounded-full ${salaryEligibility?.debtToIncomeRatio > 33 ? 'bg-red-500' : 'bg-green-500'}`}
                                          style={{ width: `${Math.min(100, (financingResult.monthlyPayment / financingParams.salary) * 100)}%` }}
                                        />
                                      </div>
                                      <span className="text-xs text-muted-foreground">
                                        {Math.round((financingResult.monthlyPayment / financingParams.salary) * 100)}%
                                      </span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="space-y-2 text-sm">
                                  <div className={`flex justify-between p-2 rounded-lg bg-muted/50 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-muted-foreground">{t.financingAmount}</span>
                                    <span className="font-semibold">{getCurrencyDisplay()} {Math.round(financingResult.principal).toLocaleString()}</span>
                                  </div>
                                  <div className={`flex justify-between p-2 rounded-lg bg-muted/50 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-muted-foreground">{t.totalInterest}</span>
                                    <span className="font-semibold text-amber-500">{getCurrencyDisplay()} {Math.round(financingResult.profitAmount || financingResult.totalInterest).toLocaleString()}</span>
                                  </div>
                                  <div className={`flex justify-between p-2 rounded-lg bg-muted/50 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-muted-foreground">{t.totalCost}</span>
                                    <span className="font-semibold">{getCurrencyDisplay()} {Math.round(financingResult.totalAmount || financingResult.totalPayment).toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Unified "Submit Your Request Now" Button - After Financing Result */}
                            {financingResult && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4"
                              >
                                <Button 
                                  className="w-full h-14 sky-gradient text-white text-base font-bold shadow-lg hover:shadow-xl transition-all group"
                                  onClick={() => {
                                    // Get selected bank if any
                                    const selectedBankData = financingParams.selectedBank 
                                      ? bankOffers.find(b => b.id === financingParams.selectedBank) 
                                      : null;
                                    openFinancingChatbot('', selectedBankData || null);
                                  }}
                                >
                                  <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                    className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}
                                  >
                                    <Send className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                                    <span>{t.applyNow}</span>
                                    <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-3 rotate-180' : 'ml-3'} group-hover:translate-x-1 transition-transform`} />
                                  </motion.div>
                                </Button>
                                <p className="text-xs text-center text-muted-foreground mt-2">
                                  {isRTL ? 'احصل على موافقة مبدئية خلال دقائق' : 'Get preliminary approval in minutes'}
                                </p>
                              </motion.div>
                            )}
                            
                            {/* Cars Within Budget - Visual Design */}
                            {financingParams.salary > 0 && salaryEligibility && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2"
                              >
                                <Separator className="my-3" />
                                
                                {/* Section Header - Single Line Bold */}
                                <div className="relative overflow-hidden rounded-2xl mb-4">
                                  {/* Background - Light gradient */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50" />
                                  <div className="absolute inset-0 border border-emerald-200 rounded-2xl" />

                                  {/* Decorative pattern */}
                                  <div className="absolute inset-0 opacity-50">
                                    <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-teal-100 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                                  </div>

                                  {/* Content - Single Line */}
                                  <div className="relative px-4 py-3">
                                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                      {/* Icon with glow effect */}
                                      <div className="relative flex-shrink-0">
                                        <motion.div
                                          initial={{ scale: 0.8, rotate: -10 }}
                                          animate={{ scale: 1, rotate: 0 }}
                                          className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg"
                                        >
                                          <Car className="w-5 h-5 text-white" />
                                        </motion.div>
                                      </div>

                                      {/* Title - Single Line with Different Styles */}
                                      <motion.div
                                        initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex-1"
                                      >
                                        <h4 className={`text-base drop-shadow-sm ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                                          <span className="font-black text-black">{t.carsWithinBudget}</span>
                                          <span className="text-black/40 mx-1.5">•</span>
                                          <span className="font-normal text-black/70">{t.basedOnYourSalary}</span>
                                        </h4>
                                      </motion.div>

                                      {/* Refresh Button */}
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                      >
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 rounded-full bg-white/80 hover:bg-white border border-emerald-200 shadow-sm"
                                          onClick={() => {
                                            setIsRefreshingBudgetCars(true);
                                            setTimeout(() => {
                                              setBudgetCarsOffset(prev => prev + 10);
                                              setIsRefreshingBudgetCars(false);
                                            }, 300);
                                          }}
                                        >
                                          <RefreshCw className={`w-4 h-4 text-emerald-600 ${isRefreshingBudgetCars ? 'animate-spin' : ''}`} />
                                        </Button>
                                      </motion.div>
                                    </div>
                                  </div>
                                </div>
                                
                                {(() => {
                                  // Car categories: 1=economy, 2=compact, 3=mid-size, 4=full-size, 5=luxury
                                  // Extended car list with 40+ cars for refresh functionality
                                  const allCars = [
                                    // Economy Cars
                                    { brand: 'تويوتا', brandEn: 'Toyota', model: 'يارس', modelEn: 'Yaris', year: 2024, price: 58000, hp: 107, fuelConsumption: '5.5', engine: '1.5L', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 1 },
                                    { brand: 'نيسان', brandEn: 'Nissan', model: 'صني', modelEn: 'Sunny', year: 2024, price: 55000, hp: 108, fuelConsumption: '5.8', engine: '1.6L', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 1 },
                                    { brand: 'هيونداي', brandEn: 'Hyundai', model: 'أكسنت', modelEn: 'Accent', year: 2024, price: 62000, hp: 120, fuelConsumption: '5.4', engine: '1.4L', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 1 },
                                    { brand: 'كيا', brandEn: 'Kia', model: 'بيكانتو', modelEn: 'Picanto', year: 2024, price: 52000, hp: 85, fuelConsumption: '5.0', engine: '1.0L', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 1 },
                                    { brand: 'سوزوكي', brandEn: 'Suzuki', model: 'سيليرو', modelEn: 'Celerio', year: 2024, price: 48000, hp: 68, fuelConsumption: '4.5', engine: '1.0L', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 1 },
                                    // Compact Cars
                                    { brand: 'كيا', brandEn: 'Kia', model: 'ريو', modelEn: 'Rio', year: 2024, price: 65000, hp: 118, fuelConsumption: '5.6', engine: '1.4L', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 2 },
                                    { brand: 'ميتسوبيشي', brandEn: 'Mitsubishi', model: 'لانسر', modelEn: 'Lancer', year: 2024, price: 72000, hp: 148, fuelConsumption: '6.2', engine: '1.6L', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 2 },
                                    { brand: 'كيا', brandEn: 'Kia', model: 'سيراتو', modelEn: 'Cerato', year: 2024, price: 78000, hp: 147, fuelConsumption: '6.0', engine: '2.0L', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 2 },
                                    { brand: 'هيونداي', brandEn: 'Hyundai', model: 'فيرونا', modelEn: 'Verna', year: 2024, price: 68000, hp: 123, fuelConsumption: '5.5', engine: '1.4L', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 2 },
                                    { brand: 'رينو', brandEn: 'Renault', model: 'ميجان', modelEn: 'Megane', year: 2024, price: 75000, hp: 140, fuelConsumption: '5.8', engine: '1.3L Turbo', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 2 },
                                    // Mid-Size Cars
                                    { brand: 'هيونداي', brandEn: 'Hyundai', model: 'إلنترا', modelEn: 'Elantra', year: 2024, price: 82000, hp: 147, fuelConsumption: '5.9', engine: '2.0L', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 3 },
                                    { brand: 'تويوتا', brandEn: 'Toyota', model: 'كورولا', modelEn: 'Corolla', year: 2024, price: 85000, hp: 169, fuelConsumption: '5.2', engine: '2.0L', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 3 },
                                    { brand: 'شيفروليه', brandEn: 'Chevrolet', model: 'ماليبو', modelEn: 'Malibu', year: 2024, price: 88000, hp: 160, fuelConsumption: '6.5', engine: '1.5L Turbo', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 3 },
                                    { brand: 'هوندا', brandEn: 'Honda', model: 'سيفيك', modelEn: 'Civic', year: 2024, price: 88000, hp: 158, fuelConsumption: '5.7', engine: '2.0L', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 3 },
                                    { brand: 'سكودا', brandEn: 'Skoda', model: 'أوكتافيا', modelEn: 'Octavia', year: 2024, price: 92000, hp: 150, fuelConsumption: '5.4', engine: '1.5L TSI', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 3 },
                                    { brand: 'فولكسفاغن', brandEn: 'Volkswagen', model: 'جيتا', modelEn: 'Jetta', year: 2024, price: 90000, hp: 158, fuelConsumption: '5.6', engine: '1.4L TSI', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 3 },
                                    { brand: 'بيجو', brandEn: 'Peugeot', model: '508', modelEn: '508', year: 2024, price: 98000, hp: 180, fuelConsumption: '5.8', engine: '1.6L PureTech', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 3 },
                                    // Full-Size Cars
                                    { brand: 'فورد', brandEn: 'Ford', model: 'فيوجن', modelEn: 'Fusion', year: 2024, price: 95000, hp: 175, fuelConsumption: '6.8', engine: '1.5L EcoBoost', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 4 },
                                    { brand: 'نيسان', brandEn: 'Nissan', model: 'التيما', modelEn: 'Altima', year: 2024, price: 98000, hp: 188, fuelConsumption: '6.2', engine: '2.5L', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 4 },
                                    { brand: 'مازدا', brandEn: 'Mazda', model: '6', modelEn: '6', year: 2024, price: 105000, hp: 187, fuelConsumption: '6.0', engine: '2.5L', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 4 },
                                    { brand: 'هيونداي', brandEn: 'Hyundai', model: 'سوناتا', modelEn: 'Sonata', year: 2024, price: 108000, hp: 191, fuelConsumption: '6.3', engine: '2.5L', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 4 },
                                    { brand: 'هوندا', brandEn: 'Honda', model: 'أكورد', modelEn: 'Accord', year: 2024, price: 115000, hp: 192, fuelConsumption: '5.9', engine: '1.5L Turbo', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 4 },
                                    { brand: 'كيا', brandEn: 'Kia', model: 'كي 5', modelEn: 'K5', year: 2024, price: 102000, hp: 180, fuelConsumption: '6.1', engine: '2.0L', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 4 },
                                    // Luxury Cars
                                    { brand: 'تويوتا', brandEn: 'Toyota', model: 'كامري', modelEn: 'Camry', year: 2024, price: 118000, hp: 206, fuelConsumption: '5.8', engine: '2.5L', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 5 },
                                    { brand: 'لكزس', brandEn: 'Lexus', model: 'ES', modelEn: 'ES 350', year: 2024, price: 175000, hp: 302, fuelConsumption: '6.8', engine: '3.5L V6', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 5 },
                                    { brand: 'إنفينيتي', brandEn: 'Infiniti', model: 'كي 50', modelEn: 'Q50', year: 2024, price: 165000, hp: 300, fuelConsumption: '7.2', engine: '3.0L Turbo', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 5 },
                                    { brand: 'مرسيدس', brandEn: 'Mercedes', model: 'سي 200', modelEn: 'C200', year: 2024, price: 195000, hp: 204, fuelConsumption: '6.5', engine: '1.5L Turbo', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 5 },
                                    { brand: 'بي إم دبليو', brandEn: 'BMW', model: '320i', modelEn: '320i', year: 2024, price: 188000, hp: 184, fuelConsumption: '6.2', engine: '2.0L Turbo', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 5 },
                                    { brand: 'أودي', brandEn: 'Audi', model: 'A4', modelEn: 'A4', year: 2024, price: 185000, hp: 190, fuelConsumption: '6.0', engine: '2.0L TFSI', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 5 },
                                    // SUV Category
                                    { brand: 'تويوتا', brandEn: 'Toyota', model: 'راش', modelEn: 'Rush', year: 2024, price: 85000, hp: 105, fuelConsumption: '7.2', engine: '1.5L', seats: 7, transmission: 'أوتوماتيك', color: 'متعدد', category: 3 },
                                    { brand: 'هيونداي', brandEn: 'Hyundai', model: 'كريتا', modelEn: 'Creta', year: 2024, price: 88000, hp: 123, fuelConsumption: '6.8', engine: '1.6L', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 3 },
                                    { brand: 'كيا', brandEn: 'Kia', model: 'سبورتاج', modelEn: 'Sportage', year: 2024, price: 105000, hp: 187, fuelConsumption: '7.5', engine: '2.0L', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 4 },
                                    { brand: 'نيسان', brandEn: 'Nissan', model: 'اكس تريل', modelEn: 'X-Trail', year: 2024, price: 115000, hp: 188, fuelConsumption: '7.8', engine: '2.5L', seats: 7, transmission: 'أوتوماتيك', color: 'متعدد', category: 4 },
                                    { brand: 'هوندا', brandEn: 'Honda', model: 'سي آر في', modelEn: 'CR-V', year: 2024, price: 125000, hp: 190, fuelConsumption: '7.2', engine: '1.5L Turbo', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 4 },
                                    { brand: 'تويوتا', brandEn: 'Toyota', model: 'راف 4', modelEn: 'RAV4', year: 2024, price: 135000, hp: 203, fuelConsumption: '7.0', engine: '2.5L', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 5 },
                                    { brand: 'ميتسوبيشي', brandEn: 'Mitsubishi', model: 'اوت لاندر', modelEn: 'Outlander', year: 2024, price: 110000, hp: 181, fuelConsumption: '7.4', engine: '2.4L', seats: 7, transmission: 'أوتوماتيك', color: 'متعدد', category: 4 },
                                    { brand: 'مازدا', brandEn: 'Mazda', model: 'سي اكس 5', modelEn: 'CX-5', year: 2024, price: 118000, hp: 187, fuelConsumption: '7.1', engine: '2.5L', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 4 },
                                    { brand: 'فورد', brandEn: 'Ford', model: 'ايج', modelEn: 'Edge', year: 2024, price: 128000, hp: 245, fuelConsumption: '8.2', engine: '2.0L EcoBoost', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 5 },
                                    { brand: 'شيفروليه', brandEn: 'Chevrolet', model: 'إيكوينوكس', modelEn: 'Equinox', year: 2024, price: 108000, hp: 170, fuelConsumption: '7.6', engine: '1.5L Turbo', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 4 },
                                    { brand: 'جيب', brandEn: 'Jeep', model: 'شيروكي', modelEn: 'Cherokee', year: 2024, price: 138000, hp: 180, fuelConsumption: '8.5', engine: '2.4L', seats: 5, transmission: 'أوتوماتيك', color: 'متعدد', category: 5 },
                                  ];

                                  const calculateCarPayment = (price: number) => {
                                    const principal = price * (1 - financingParams.downPayment / 100);
                                    const monthlyRate = financingParams.interestRate / 100 / 12;
                                    const numPayments = financingParams.loanTerm;
                                    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
                                    return payment;
                                  };

                                  // Get current vehicle category (default to 3 if not found)
                                  const currentCarCategory = allCars.find(c =>
                                    c.brand === currentVehicle?.brand ||
                                    c.brandEn === currentVehicle?.brand ||
                                    c.model === currentVehicle?.model ||
                                    c.modelEn === currentVehicle?.model
                                  )?.category || 3;

                                  // Calculate all cars with payments
                                  const carsWithPayments = allCars
                                    .map(car => ({
                                      ...car,
                                      monthlyPayment: calculateCarPayment(car.price),
                                      downPaymentAmount: Math.round(car.price * financingParams.downPayment / 100),
                                      totalAmount: Math.round(car.price * (1 - financingParams.downPayment / 100) * (1 + (financingParams.interestRate / 100) * (financingParams.loanTerm / 12))),
                                      isWithinBudget: calculateCarPayment(car.price) <= salaryEligibility.maxMonthlyPayment,
                                      budgetGap: calculateCarPayment(car.price) - salaryEligibility.maxMonthlyPayment,
                                    }));

                                  // Affordable cars (within budget) - sorted from highest to lowest (closest to max budget first)
                                  const affordableCars = carsWithPayments
                                    .filter(car => car.isWithinBudget)
                                    .sort((a, b) => b.monthlyPayment - a.monthlyPayment);

                                  // Cars above budget but in same category or higher (max 20% above budget) - sorted from highest to lowest
                                  const aboveBudgetCars = carsWithPayments
                                    .filter(car => !car.isWithinBudget && car.category >= currentCarCategory && car.budgetGap <= salaryEligibility.maxMonthlyPayment * 0.25)
                                    .sort((a, b) => b.monthlyPayment - a.monthlyPayment);

                                  // All eligible cars combined
                                  const allEligibleCars = [...affordableCars, ...aboveBudgetCars];
                                  
                                  // Use offset to rotate through cars (each refresh shows next 10 cars)
                                  const startIndex = budgetCarsOffset % Math.max(1, Math.floor(allEligibleCars.length / 10) * 10);
                                  const displayCars = allEligibleCars.slice(startIndex, startIndex + 10).length >= 10 
                                    ? allEligibleCars.slice(startIndex, startIndex + 10)
                                    : allEligibleCars.slice(0, 10);

                                  if (displayCars.length === 0) {
                                    return (
                                      <div className="text-center py-6 px-3 rounded-xl bg-muted/20 border border-dashed border-muted-foreground/30">
                                        <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-xs font-medium">{t.noAffordableCars}</p>
                                        <p className="text-[10px] text-muted-foreground mt-1">{t.increaseDownPayment}</p>
                                      </div>
                                    );
                                  }

                                  return (
                                    <div className="space-y-1">
                                      {displayCars.map((car, i) => {
                                        const isAboveBudget = !car.isWithinBudget;
                                        const affordableIndex = affordableCars.indexOf(car as any);
                                        const isTopThree = affordableIndex >= 0 && affordableIndex < 3;

                                        return (
                                          <motion.div
                                            key={`${car.brand}-${car.model}`}
                                            initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.02 }}
                                            onClick={() => {
                                              setSelectedCarDetail(car);
                                              setCarDetailOpen(true);
                                            }}
                                            className="group cursor-pointer"
                                          >
                                            <div className={`
                                              relative overflow-hidden
                                              flex items-center justify-between gap-2 p-2.5 rounded-lg
                                              ${isAboveBudget
                                                ? 'bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-400/30'
                                                : isTopThree
                                                  ? 'from-amber-500/10 to-orange-500/5 border border-amber-500/30'
                                                  : 'from-muted/30 to-transparent border border-transparent'}
                                              ${!isAboveBudget ? 'hover:from-emerald-500/10 hover:to-teal-500/5 hover:border-emerald-500/40' : 'hover:from-amber-500/15 hover:to-orange-500/10'}
                                              transition-all duration-200
                                              ${isRTL ? 'flex-row-reverse' : ''}
                                            `}>
                                              {/* Rank Badge */}
                                              <div className={`
                                                w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0
                                                ${isAboveBudget
                                                  ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                                                  : isTopThree && affordableIndex === 0
                                                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md'
                                                    : isTopThree && affordableIndex === 1
                                                      ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                                                      : isTopThree && affordableIndex === 2
                                                        ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
                                                        : 'bg-muted text-muted-foreground'}
                                              `}>
                                                {isAboveBudget ? '⬆' : affordableIndex + 1}
                                              </div>

                                              {/* Car Info */}
                                              <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                                                <div className={`font-semibold text-sm truncate ${isAboveBudget ? 'text-amber-700' : ''}`}>
                                                  {isRTL ? car.brand : car.brandEn} {isRTL ? car.model : car.modelEn}
                                                  {isAboveBudget && <span className="text-[9px] mr-1 text-amber-500">({isRTL ? 'يتطلب راتب أعلى' : 'needs higher salary'})</span>}
                                                </div>
                                                <div className={`text-[10px] text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''} flex items-center gap-1`}>
                                                  <span>{car.year}</span>
                                                  <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground"></span>
                                                  <span>{car.hp} {t.hp}</span>
                                                  <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground"></span>
                                                  <span>{getCurrencyDisplay()} {car.price.toLocaleString()}</span>
                                                </div>
                                              </div>

                                              {/* Payment */}
                                              <div className={`flex items-center gap-1.5 flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                <div className={isRTL ? 'text-left' : 'text-right'}>
                                                  <div className={`font-bold text-sm ${isAboveBudget ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                    {getCurrencyDisplay()} {Math.round(car.monthlyPayment).toLocaleString()}
                                                  </div>
                                                  <div className="text-[9px] text-muted-foreground text-center">{isRTL ? 'شهري' : 'mo'}</div>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${isAboveBudget ? 'bg-amber-100 group-hover:bg-amber-500' : 'bg-muted/50 group-hover:bg-emerald-500'} group-hover:text-white`}>
                                                  <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
                                                </div>
                                              </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="h-px bg-muted rounded-full overflow-hidden mx-2 group-hover:mx-0 transition-all">
                                              <div
                                                className={`h-full rounded-full ${isAboveBudget ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}
                                                style={{ width: `${Math.min(100, (car.monthlyPayment / salaryEligibility.maxMonthlyPayment) * 100)}%` }}
                                              />
                                            </div>
                                          </motion.div>
                                        );
                                      })}

                                      {/* Footer */}
                                      <div className={`flex items-center justify-between pt-2 mt-2 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <div className="flex items-center gap-3">
                                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            {isRTL ? `${affordableCars.length} ضمن الميزانية` : `${affordableCars.length} within budget`}
                                          </span>
                                          {aboveBudgetCars.length > 0 && (
                                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                              {isRTL ? `${Math.min(aboveBudgetCars.length, 5)} خيارات أعلى` : `${Math.min(aboveBudgetCars.length, 5)} higher options`}
                                            </span>
                                          )}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                          {isRTL ? 'انقر للتفاصيل' : 'Click for details'}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </motion.div>
                            )}
                      </CardContent>
                    </Card>

                    {/* Bank Offers - Premium Design */}
                    <Card className="lg:col-span-2 overflow-hidden" id="bank-offers-section">
                      {/* Premium Header Section - Sky Blue Theme */}
                      <div className="relative overflow-hidden">
                        {/* Background - Sky Blue gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400" />

                        {/* Decorative pattern */}
                        <div className="absolute inset-0 opacity-30">
                          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
                        </div>

                        {/* Content - Single Line */}
                        <div className="relative px-4 py-3">
                          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            {/* Icon with glow effect */}
                            <div className="relative flex-shrink-0">
                              <motion.div
                                initial={{ scale: 0.8, rotate: 10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="relative w-10 h-10 rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg"
                              >
                                <Building2 className="w-5 h-5 text-black" />
                              </motion.div>
                            </div>

                            {/* Title - Single Line with Different Styles */}
                            <motion.div
                              initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex-1"
                            >
                              <h3 className={`text-base drop-shadow-sm ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                                <span className="font-black text-black">{t.bankOffers}</span>
                                <span className="text-black/40 mx-1.5">•</span>
                                <span className="font-normal text-black/70">{t.compareBanks}</span>
                              </h3>
                            </motion.div>

                            {/* Badge */}
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2, type: "spring" }}
                              className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-white/40 backdrop-blur-sm border border-white/50"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              <span className="text-xs font-black text-black">
                                {isRTL ? 'أفضل العروض' : 'Best Offers'}
                              </span>
                            </motion.div>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {bankOffers.filter(b => b.eligible).slice(0, 6).map((bank, i) => (
                            <motion.div
                              key={bank.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <Card className={`${i === 0 ? 'border-2 border-primary bg-primary/5' : 'border'} hover:shadow-lg transition-all duration-300`}>
                                <CardContent className="p-4">
                                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                      {/* Rank Badge */}
                                      <div className={`
                                        w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0
                                        ${i === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg' :
                                          i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                                          i === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                                          'bg-muted text-muted-foreground'}
                                      `}>
                                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                                      </div>
                                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 flex items-center justify-center text-2xl">
                                        {bank.logo || '🏦'}
                                      </div>
                                      <div className={isRTL ? 'text-right' : 'text-left'}>
                                        <div className="flex items-center gap-2">
                                          <h4 className="font-bold text-base">{isRTL ? bank.bankName : bank.bankNameEn}</h4>
                                          {i === 0 && (
                                            <Badge className="bg-primary text-white text-xs">
                                              {t.bestRate}
                                            </Badge>
                                          )}
                                        </div>
                                        <div className={`flex items-center gap-3 text-xs text-muted-foreground mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                          <span>{bank.interestRate}% {isRTL ? 'ربح سنوي' : t.annually}</span>
                                          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                                          <span>{isRTL ? 'حتى' : 'up to'} {bank.maxLoanTerm} {t.months}</span>
                                          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                                          <span>{isRTL ? 'أقل دفعة' : 'Min down'}: {bank.minDownPayment}%</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className={`flex flex-col gap-1 ${isRTL ? 'items-start md:items-start' : 'items-start md:items-end'}`}>
                                      <div className="text-2xl font-bold text-primary">
                                        {getCurrencyDisplay()} {Math.round(bank.monthlyPayment).toLocaleString()}
                                      </div>
                                      <div className="text-xs text-muted-foreground">{isRTL ? 'شهرياً' : t.monthly}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {isRTL ? 'التكلفة الإجمالية' : 'Total'}: {getCurrencyDisplay()} {Math.round(bank.totalAmount || bank.totalCost).toLocaleString()}
                                      </div>
                                    </div>
                                  </div>

                                  <div className={`grid grid-cols-3 gap-2 mt-3 pt-3 border-t ${isRTL ? 'direction-rtl' : ''}`}>
                                    <div className="text-center">
                                      <div className="text-xs text-muted-foreground">{t.financingAmount}</div>
                                      <div className="text-sm font-semibold">{getCurrencyDisplay()} {(bank.financingAmount || bank.principal || Math.round((currentVehicle.price || manualCarPrice || 100000) * (100 - (bank.minDownPayment || 20)) / 100) || 0).toLocaleString()}</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-xs text-muted-foreground">{t.totalInterest}</div>
                                      <div className="text-sm font-semibold">{getCurrencyDisplay()} {(Math.round(bank.profitAmount || 0) || 0).toLocaleString()}</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-xs text-muted-foreground">{t.fees}</div>
                                      <div className="text-sm font-semibold">{getCurrencyDisplay()} {(bank.fees || 0).toLocaleString()}</div>
                                    </div>
                                  </div>

                                  {/* Apply Now Button */}
                                  <div className="mt-3 pt-3 border-t">
                                    <Button className="w-full sky-gradient text-white hover:shadow-lg transition-shadow" onClick={() => openFinancingChatbot('', bank)}>
                                      <Send className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                      {t.applyNow}
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Comparison Tab */}
                <TabsContent value="compare">
                  <div className="space-y-6">
                    {/* Premium Header - Matching Services Section Design */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400 shadow-xl"
                    >
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                      
                      <div className={`relative p-6 ${isRTL ? 'text-right direction-rtl' : 'text-left'}`}>
                        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            {/* Animated Icon */}
                            <motion.div 
                              className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg relative"
                              animate={{ 
                                boxShadow: comparisonVehicles.length > 0 
                                  ? ['0 0 20px rgba(255,255,255,0.3)', '0 0 40px rgba(255,255,255,0.5)', '0 0 20px rgba(255,255,255,0.3)']
                                  : '0 0 20px rgba(255,255,255,0.2)'
                              }}
                              transition={{ duration: 2, repeat: comparisonVehicles.length > 0 ? Infinity : 0 }}
                            >
                              <motion.div
                                animate={comparisonVehicles.length > 0 ? { rotate: [0, 15, -15, 0] } : {}}
                                transition={{ duration: 2, repeat: comparisonVehicles.length > 0 ? Infinity : 0, repeatDelay: 1 }}
                              >
                                <GitCompare className="w-7 h-7 text-white drop-shadow-lg" />
                              </motion.div>
                              {comparisonVehicles.length > 0 && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg border-2 border-white"
                                >
                                  {comparisonVehicles.length}
                                </motion.div>
                              )}
                            </motion.div>
                            
                            {/* Title Section */}
                            <div>
                              <motion.h3 
                                className="text-xl font-black text-black drop-shadow-sm"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                              >
                                {t.compareVehicles}
                              </motion.h3>
                              <motion.p 
                                className="text-sm font-normal text-black/80 mt-0.5"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                              >
                                {t.compareUpTo}
                              </motion.p>
                            </div>
                          </div>
                          
                          {/* Vehicle Count Badge */}
                          <motion.div 
                            key={comparisonVehicles.length}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 ${
                              comparisonVehicles.length >= 4 
                                ? 'bg-red-500/30 border-red-400/50' 
                                : comparisonVehicles.length > 0 
                                  ? 'bg-emerald-500/20 border-emerald-400/50'
                                  : ''
                            }`}
                          >
                            <span className="text-sm font-bold text-black">{comparisonVehicles.length}/4</span>
                            {comparisonVehicles.length > 0 && comparisonVehicles.length < 4 && (
                              <span className="text-xs text-black/80">• {isRTL ? `${4 - comparisonVehicles.length} متبقي` : `${4 - comparisonVehicles.length} left`}</span>
                            )}
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Add Current Vehicle Button */}
                    {currentVehicle && comparisonVehicles.length < 4 && (
                      <motion.div 
                        className="flex justify-center"
                        whileHover={{ scale: 1.02 }} 
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          onClick={handleAddToComparison} 
                          disabled={comparisonVehicles.length >= 4 || !currentVehicle} 
                          className="relative overflow-hidden sky-gradient text-white shadow-lg hover:shadow-xl transition-all px-8 py-6 text-base"
                        >
                          {/* Animated shine effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                          />
                          <span className="relative flex items-center font-semibold">
                            <motion.div
                              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <Plus className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            </motion.div>
                            {t.addCurrentVehicle}
                            <span className="text-xs opacity-80 ml-2 px-2 py-0.5 bg-white/20 rounded-full">
                              {comparisonVehicles.length + 1}/4
                            </span>
                          </span>
                        </Button>
                      </motion.div>
                    )}

                    {comparisonVehicles.length > 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        {/* Interactive Comparison Cards - Stack on mobile, side by side on larger screens */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                          <AnimatePresence mode="popLayout">
                            {comparisonVehicles.map(({ vehicle }, index) => {
                              // Find best values for highlighting
                              const prices = comparisonVehicles.map(v => v.vehicle.price).filter(Boolean);
                              const horsepowers = comparisonVehicles.map(v => v.vehicle.horsepower).filter(Boolean);
                              const consumptions = comparisonVehicles.map(v => v.vehicle.fuelConsumption).filter(Boolean);
                              
                              const isBestPrice = vehicle.price && vehicle.price === Math.min(...prices);
                              const isBestPower = vehicle.horsepower && vehicle.horsepower === Math.max(...horsepowers);
                              const isBestConsumption = vehicle.fuelConsumption && vehicle.fuelConsumption === Math.min(...consumptions);
                              
                              return (
                                <motion.div
                                  key={vehicle.id}
                                  layout
                                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                  transition={{ 
                                    type: "spring", 
                                    stiffness: 300, 
                                    damping: 25,
                                    delay: index * 0.1 
                                  }}
                                >
                                  <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl group ${
                                    index === 0 ? 'ring-2 ring-sky-500/50' : ''
                                  }`}>
                                    {/* Gradient header with checkmark for analyzed car */}
                                    <div className={`h-10 flex items-center justify-center ${index === 0 ? 'bg-gradient-to-r from-sky-500 to-cyan-500' : 'bg-gradient-to-r from-muted to-muted'}`}>
                                      {index === 0 ? (
                                        <motion.div
                                          animate={{ scale: [1, 1.2, 1] }}
                                          transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                          <CheckCircle2 className="w-6 h-6 text-white" />
                                        </motion.div>
                                      ) : (
                                        <GitCompare className="w-5 h-5 text-muted-foreground" />
                                      )}
                                    </div>
                                    
                                    <CardHeader className="pb-2 relative">
                                      {/* Remove button */}
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 h-8 w-8 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                        onClick={() => removeComparisonVehicle(vehicle.id)}
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                      
                                      {/* Car brand/model with animation */}
                                      <motion.div
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.1 + 0.1 }}
                                      >
                                        <CardTitle className="text-lg flex items-center gap-2">
                                          {index === 0 ? (
                                            <CheckCircle2 className="w-5 h-5 text-sky-500" />
                                          ) : (
                                            <Car className="w-5 h-5 text-sky-500" />
                                          )}
                                          {vehicle.brand}
                                        </CardTitle>
                                        <CardDescription className="text-base font-medium text-foreground">
                                          {vehicle.model}
                                        </CardDescription>
                                      </motion.div>
                                      
                                      {index === 0 && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          className="absolute bottom-0 left-0"
                                        >
                                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        </motion.div>
                                      )}
                                    </CardHeader>
                                    
                                    <CardContent className="space-y-2 text-sm">
                                      {/* Year */}
                                      <motion.div 
                                        className={`flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                                        whileHover={{ x: 3 }}
                                      >
                                        <span className="text-muted-foreground flex items-center gap-1.5">
                                          <Calendar className="w-3.5 h-3.5" />
                                          {t.year}
                                        </span>
                                        <span className="font-medium">{vehicle.year || t.notAvailable}</span>
                                      </motion.div>
                                      
                                      {/* Price with highlight */}
                                      <motion.div 
                                        className={`flex justify-between items-center p-2 rounded-lg transition-all ${
                                          isBestPrice && comparisonVehicles.length > 1
                                            ? 'bg-emerald-500/10 border border-emerald-500/30'
                                            : 'hover:bg-muted/50'
                                        } ${isRTL ? 'flex-row-reverse' : ''}`}
                                        whileHover={{ x: 3 }}
                                      >
                                        <span className="text-muted-foreground flex items-center gap-1.5">
                                          <DollarSign className="w-3.5 h-3.5" />
                                          {t.price}
                                        </span>
                                        <span className={`font-bold ${isBestPrice && comparisonVehicles.length > 1 ? 'text-emerald-600' : 'text-primary'}`}>
                                          {vehicle.price ? `${vehicle.price.toLocaleString()} ${isRTL ? 'ريال' : 'SAR'}` : t.notAvailable}
                                          {isBestPrice && comparisonVehicles.length > 1 && (
                                            <motion.span 
                                              initial={{ scale: 0 }}
                                              animate={{ scale: 1 }}
                                              className="inline-block mr-1"
                                            >
                                              🏷️
                                            </motion.span>
                                          )}
                                        </span>
                                      </motion.div>
                                      
                                      {/* Power with highlight */}
                                      <motion.div 
                                        className={`flex justify-between items-center p-2 rounded-lg transition-all ${
                                          isBestPower && comparisonVehicles.length > 1
                                            ? 'bg-amber-500/10 border border-amber-500/30'
                                            : 'hover:bg-muted/50'
                                        } ${isRTL ? 'flex-row-reverse' : ''}`}
                                        whileHover={{ x: 3 }}
                                      >
                                        <span className="text-muted-foreground flex items-center gap-1.5">
                                          <Zap className="w-3.5 h-3.5" />
                                          {t.power}
                                        </span>
                                        <span className={`font-medium ${isBestPower && comparisonVehicles.length > 1 ? 'text-amber-600' : ''}`}>
                                          {vehicle.horsepower ? `${vehicle.horsepower} ${t.hp}` : t.notAvailable}
                                          {isBestPower && comparisonVehicles.length > 1 && (
                                            <motion.span 
                                              initial={{ scale: 0 }}
                                              animate={{ scale: 1 }}
                                              className="inline-block mr-1"
                                            >
                                              ⚡
                                            </motion.span>
                                          )}
                                        </span>
                                      </motion.div>
                                      
                                      {/* Consumption with highlight */}
                                      <motion.div 
                                        className={`flex justify-between items-center p-2 rounded-lg transition-all ${
                                          isBestConsumption && comparisonVehicles.length > 1
                                            ? 'bg-green-500/10 border border-green-500/30'
                                            : 'hover:bg-muted/50'
                                        } ${isRTL ? 'flex-row-reverse' : ''}`}
                                        whileHover={{ x: 3 }}
                                      >
                                        <span className="text-muted-foreground flex items-center gap-1.5">
                                          <Fuel className="w-3.5 h-3.5" />
                                          {t.consumption}
                                        </span>
                                        <span className={`font-medium ${isBestConsumption && comparisonVehicles.length > 1 ? 'text-green-600' : ''}`}>
                                          {vehicle.fuelConsumption ? `${vehicle.fuelConsumption} ${t.literPer100km}` : t.notAvailable}
                                          {isBestConsumption && comparisonVehicles.length > 1 && (
                                            <motion.span 
                                              initial={{ scale: 0 }}
                                              animate={{ scale: 1 }}
                                              className="inline-block mr-1"
                                            >
                                              ⛽
                                            </motion.span>
                                          )}
                                        </span>
                                      </motion.div>
                                      
                                      {/* Transmission */}
                                      <motion.div 
                                        className={`flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                                        whileHover={{ x: 3 }}
                                      >
                                        <span className="text-muted-foreground flex items-center gap-1.5">
                                          <Cog className="w-3.5 h-3.5" />
                                          {t.transmission}
                                        </span>
                                        <span className="font-medium">{vehicle.transmission || t.notAvailable}</span>
                                      </motion.div>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                        </div>
                        
                        {/* Quick Comparison Summary */}
                        {comparisonVehicles.length > 1 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <Card className="bg-gradient-to-r from-sky-500/5 to-cyan-500/5 border-sky-500/20">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-sky-500" />
                                  {isRTL ? 'ملخص المقارنة السريع' : 'Quick Comparison Summary'}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                  {(() => {
                                    const prices = comparisonVehicles.map(v => v.vehicle.price).filter(Boolean);
                                    const horsepowers = comparisonVehicles.map(v => v.vehicle.horsepower).filter(Boolean);
                                    const consumptions = comparisonVehicles.map(v => v.vehicle.fuelConsumption).filter(Boolean);
                                    
                                    const cheapestVehicle = comparisonVehicles.find(v => v.vehicle.price === Math.min(...prices))?.vehicle;
                                    const mostPowerful = comparisonVehicles.find(v => v.vehicle.horsepower === Math.max(...horsepowers))?.vehicle;
                                    const mostEfficient = comparisonVehicles.find(v => v.vehicle.fuelConsumption === Math.min(...consumptions))?.vehicle;
                                    
                                    return (
                                      <>
                                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                          <div className="text-xs text-muted-foreground mb-1">{isRTL ? 'أقل سعر' : 'Lowest Price'}</div>
                                          <div className="font-bold text-emerald-600">
                                            {cheapestVehicle ? `${cheapestVehicle.brand} ${cheapestVehicle.model}` : '-'}
                                          </div>
                                          {cheapestVehicle?.price && (
                                            <div className="text-sm font-medium mt-1">
                                              {cheapestVehicle.price.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}
                                            </div>
                                          )}
                                        </div>
                                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                          <div className="text-xs text-muted-foreground mb-1">{isRTL ? 'أعلى قوة' : 'Most Powerful'}</div>
                                          <div className="font-bold text-amber-600">
                                            {mostPowerful ? `${mostPowerful.brand} ${mostPowerful.model}` : '-'}
                                          </div>
                                          {mostPowerful?.horsepower && (
                                            <div className="text-sm font-medium mt-1">
                                              {mostPowerful.horsepower} {t.hp}
                                            </div>
                                          )}
                                        </div>
                                        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                                          <div className="text-xs text-muted-foreground mb-1">{isRTL ? 'أقل استهلاك' : 'Most Efficient'}</div>
                                          <div className="font-bold text-green-600">
                                            {mostEfficient ? `${mostEfficient.brand} ${mostEfficient.model}` : '-'}
                                          </div>
                                          {mostEfficient?.fuelConsumption && (
                                            <div className="text-sm font-medium mt-1">
                                              {mostEfficient.fuelConsumption} {t.literPer100km}
                                            </div>
                                          )}
                                        </div>
                                      </>
                                    );
                                  })()}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}
                        
                        {/* Add more vehicles prompt */}
                        {comparisonVehicles.length < 4 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center justify-center"
                          >
                            <Button
                              variant="outline"
                              className="border-dashed border-2 border-muted-foreground/30 hover:border-sky-500/50 hover:bg-sky-500/5 transition-all"
                              onClick={() => {
                                if (currentVehicle && comparisonVehicles.length < 4) {
                                  handleAddToComparison();
                                }
                              }}
                              disabled={!currentVehicle || comparisonVehicles.length >= 4}
                            >
                              <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              {isRTL 
                                ? `أضف سيارة أخرى (${4 - comparisonVehicles.length} متبقي)` 
                                : `Add another car (${4 - comparisonVehicles.length} left)`}
                            </Button>
                          </motion.div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <Card className="border-dashed border-2">
                          <CardContent className="py-16 text-center">
                            <motion.div
                              initial={{ y: -10 }}
                              animate={{ y: 0 }}
                              transition={{ 
                                repeat: Infinity, 
                                repeatType: "reverse", 
                                duration: 2 
                              }}
                            >
                              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-sky-500/10 to-cyan-500/10 flex items-center justify-center relative">
                                <motion.div
                                  animate={{ rotate: [0, 10, -10, 0] }}
                                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                                >
                                  <GitCompare className="w-10 h-10 text-sky-500" />
                                </motion.div>
                                <motion.div
                                  className="absolute inset-0 rounded-2xl border-2 border-sky-500/30"
                                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                />
                              </div>
                            </motion.div>
                            
                            <h4 className="text-lg font-semibold mb-2">
                              {t.noVehiclesToCompare}
                            </h4>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                              {isRTL 
                                ? 'ابدأ بتحليل سيارة ثم أضفها للمقارنة. يمكنك مقارنة حتى 4 سيارات في وقت واحد.'
                                : 'Start by analyzing a car then add it to comparison. You can compare up to 4 cars at once.'}
                            </p>
                            
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button 
                                onClick={handleAddToComparison} 
                                disabled={!currentVehicle}
                                className="sky-gradient text-white shadow-lg hover:shadow-xl transition-all px-8 py-6 text-base"
                              >
                                <Plus className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                {t.addCurrentVehicle}
                              </Button>
                            </motion.div>
                            
                            {!currentVehicle && (
                              <p className="text-xs text-muted-foreground mt-3">
                                {isRTL 
                                  ? '💡 قم بتحليل سيارة أولاً من خلال إدخال رابط أو صورة'
                                  : '💡 Analyze a car first by entering a link or image'}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </div>
                </TabsContent>

                {/* AI Advisor Tab */}
                <TabsContent value="advisor" data-advisor-section>
                  <div className="grid lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <Bot className="w-5 h-5 text-primary" />
                          {t.aiAdvisor}
                        </CardTitle>
                        <CardDescription className={isRTL ? 'text-right' : ''}>
                          {t.askAnything}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className={`h-[400px] ${isRTL ? 'pl-4' : 'pr-4'}`} data-chat-scroll>
                          {chatMessages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-12">
                              <MessageCircle className="w-12 h-12 mb-4 text-muted-foreground" />
                              <p className="text-muted-foreground mb-2">{t.startConversation}</p>
                              <p className="text-sm text-muted-foreground">
                                {t.askAbout}
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {chatMessages.map((msg) => (
                                <div
                                  key={msg.id}
                                  className={`flex gap-3 ${msg.role === 'user' ? (isRTL ? 'flex-row' : 'flex-row-reverse') : ''} ${isRTL ? 'flex-row-reverse' : ''}`}
                                >
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback className={msg.role === 'user' ? 'bg-primary' : 'bg-purple-500'}>
                                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className={`flex-1 rounded-lg p-3 ${
                                    msg.role === 'user' ? 'bg-primary text-primary-foreground ml-auto max-w-[80%]' : 'bg-muted max-w-[80%]'
                                  } ${isRTL ? 'text-right' : 'text-left'}`}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                  </div>
                                </div>
                              ))}
                              {chatLoading && (
                                <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback className="bg-purple-500">
                                      <Bot className="w-4 h-4" />
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="bg-muted rounded-lg p-3">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </ScrollArea>
                        <div className={`flex gap-2 mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Textarea
                            ref={chatInputRef}
                            placeholder={isRTL ? 'اسأل عن هذه السيارة...' : 'Ask about this car...'}
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                            className={`min-h-[60px] ${isRTL ? 'text-right' : ''}`}
                          />
                          <Button onClick={handleSendMessage} disabled={chatLoading || !chatInput.trim()} className="sky-gradient text-white">
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Questions */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className={`text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <MessageCircle className="w-4 h-4 text-primary" />
                          {t.quickQuestions}
                          <Badge variant="secondary" className="text-xs ml-2">
                            {t.quickQs.length}
                          </Badge>
                        </CardTitle>
                        {currentVehicle && (
                          <CardDescription className={`text-xs flex items-center gap-1.5 mt-1 ${isRTL ? 'text-right flex-row-reverse justify-end' : ''}`}>
                            <Car className="w-3.5 h-3.5 text-primary" />
                            <span className="text-muted-foreground">
                              {isRTL ? 'أسئلة عن' : 'Questions about'}
                            </span>
                            <span className="font-semibold text-primary">
                              {currentVehicle.brand} {currentVehicle.model}
                            </span>
                            {currentVehicle.year && (
                              <span className="text-muted-foreground">
                                {currentVehicle.year}
                              </span>
                            )}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[452px]">
                          <div className="space-y-2">
                            {t.quickQs.map((q, index) => (
                              <motion.div
                                key={q}
                                initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.02 }}
                              >
                                <Button
                                  variant="outline"
                                  className={`w-full h-[38px] py-2 px-3 hover:bg-primary/5 hover:border-primary/50 hover:shadow-sm transition-all group text-xs ${isRTL ? 'flex-row-reverse justify-end text-right' : 'justify-start'}`}
                                  onClick={async () => {
                                    // Set the question and auto-send
                                    setChatInput(q);
                                    // Switch to advisor tab
                                    setActiveTab('advisor');
                                    
                                    // Scroll to advisor/chat section immediately
                                    setTimeout(() => {
                                      const advisorSection = document.querySelector('[data-advisor-section]');
                                      if (advisorSection) {
                                        advisorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                      }
                                    }, 100);
                                    
                                    // Small delay to ensure state is updated, then send
                                    setTimeout(() => {
                                      const userMessage = {
                                        id: `msg_${Date.now()}`,
                                        role: 'user' as const,
                                        content: q,
                                        timestamp: new Date(),
                                      };
                                      addChatMessage(userMessage);
                                      setChatInput('');
                                      setChatLoading(true);
                                      
                                      // Smooth scroll to bottom after adding user message
                                      setTimeout(() => {
                                        const chatContainer = document.querySelector('[data-chat-scroll] > div');
                                        if (chatContainer) {
                                          chatContainer.scrollTo({
                                            top: chatContainer.scrollHeight,
                                            behavior: 'smooth'
                                          });
                                        }
                                      }, 100);
                                      
                                      // Send to API
                                      fetch('/api/chat', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                          message: q,
                                          vehicle: currentVehicle,
                                          history: chatMessages.map(m => ({ role: m.role, content: m.content })),
                                          language,
                                        }),
                                      })
                                        .then(res => res.json())
                                        .then(data => {
                                          if (data.success) {
                                            addChatMessage({
                                              id: `msg_${Date.now()}_ai`,
                                              role: 'assistant',
                                              content: data.response,
                                              timestamp: new Date(),
                                            });
                                            // Smooth scroll to bottom after receiving response
                                            setTimeout(() => {
                                              const chatContainer = document.querySelector('[data-chat-scroll] > div');
                                              if (chatContainer) {
                                                chatContainer.scrollTo({
                                                  top: chatContainer.scrollHeight,
                                                  behavior: 'smooth'
                                                });
                                              }
                                            }, 100);
                                          }
                                        })
                                        .catch(err => {
                                          console.error('Chat error:', err);
                                          toast({ title: t.failedToGetResponse, variant: 'destructive' });
                                        })
                                        .finally(() => {
                                          setChatLoading(false);
                                        });
                                    }, 50);
                                  }}
                                >
                                  <ChevronIcon className={`w-3.5 h-3.5 flex-shrink-0 text-primary group-hover:translate-x-1 transition-transform ${isRTL ? 'ml-1.5 rotate-180 group-hover:-translate-x-1' : 'mr-1.5'}`} />
                                  <span className="text-xs">{q}</span>
                                </Button>
                              </motion.div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Financing Application Chatbot Dialog */}
      <Dialog open={financingChatOpen} onOpenChange={setFinancingChatOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse justify-start' : ''}`}>
              <div className="w-10 h-10 rounded-xl sky-gradient flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span>{t.financingApplication}</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col">
            {applicationStatus === 'chat' && (
              <>
                {/* Chat Messages - Scrollable */}
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4" style={{ maxHeight: '400px' }}>
                  <div className="space-y-4">
                    {applicationMessages.map((msg: any) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? (isRTL ? 'justify-start' : 'justify-end') : (isRTL ? 'justify-end' : 'justify-start')}`}
                      >
                        <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                          <div className={`flex items-end gap-2 ${msg.role === 'user' ? (isRTL ? 'flex-row-reverse' : 'flex-row-reverse justify-end') : ''}`}>
                            {msg.role === 'assistant' && (
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="bg-primary text-white text-xs">
                                  <Bot className="w-3 h-3" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div className={`p-3 rounded-2xl text-sm ${
                              msg.role === 'user'
                                ? 'bg-primary text-white rounded-br-sm'
                                : 'bg-muted rounded-bl-sm'
                            } ${isRTL ? (msg.role === 'user' ? 'rounded-bl-sm' : 'rounded-br-sm') : ''}`}>
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {applicationLoading && (
                      <div className={`flex ${isRTL ? 'justify-end' : 'justify-start'}`}>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-primary text-white text-xs">
                              <Bot className="w-3 h-3" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-muted p-3 rounded-2xl rounded-bl-sm">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Quick Options or Input */}
                {!applicationLoading && applicationStatus === 'chat' && (
                  <div className="border-t p-4 flex-shrink-0">
                    {getApplicationQuestions(selectedBank !== null, selectedProgram !== null && selectedProgram !== '', applicationData.carBrand, applicationData.vehicle !== null)[applicationStep]?.options ? (
                      <div className="grid grid-cols-2 gap-2">
                        {getApplicationQuestions(selectedBank !== null, selectedProgram !== null && selectedProgram !== '', applicationData.carBrand, applicationData.vehicle !== null)[applicationStep].options.map((option: string, i: number) => (
                          <Button
                            key={i}
                            variant="outline"
                            className="h-auto py-3 text-sm justify-center"
                            onClick={() => handleApplicationAnswer(option)}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          type={getApplicationQuestions(selectedBank !== null, selectedProgram !== null && selectedProgram !== '', applicationData.carBrand, applicationData.vehicle !== null)[applicationStep]?.type || 'text'}
                          placeholder={getApplicationQuestions(selectedBank !== null, selectedProgram !== null && selectedProgram !== '', applicationData.carBrand, applicationData.vehicle !== null)[applicationStep]?.placeholder || t.typeAnswer}
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const input = e.currentTarget as HTMLInputElement;
                              if (input.value.trim()) {
                                handleApplicationAnswer(input.value);
                                input.value = '';
                              }
                            }
                          }}
                        />
                        <Button
                          className="sky-gradient text-white"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            if (input.value.trim()) {
                              handleApplicationAnswer(input.value);
                              input.value = '';
                            }
                          }}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            
            {/* Financing Result View */}
            {applicationStatus === 'result' && applicationData.financingResult && (
              <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: '500px' }}>
                <div className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {/* Eligibility Status */}
                  <div className={`p-4 rounded-xl ${
                    applicationData.financingResult.eligibilityColor === 'green' ? 'bg-green-500/10' :
                    applicationData.financingResult.eligibilityColor === 'yellow' ? 'bg-yellow-500/10' :
                    'bg-red-500/10'
                  }`}>
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse justify-start' : ''}`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        applicationData.financingResult.eligibilityColor === 'green' ? 'bg-green-500' :
                        applicationData.financingResult.eligibilityColor === 'yellow' ? 'bg-yellow-500' :
                        'bg-red-500'
                      } text-white`}>
                        {applicationData.financingResult.eligibilityColor === 'green' ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : applicationData.financingResult.eligibilityColor === 'yellow' ? (
                          <AlertCircle className="w-6 h-6" />
                        ) : (
                          <AlertCircle className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{applicationData.financingResult.eligibilityStatus}</h4>
                        <p className="text-sm text-muted-foreground">
                          {isRTL ? `نسبة الأهلية: ${applicationData.financingResult.affordabilityScore}%` : `Eligibility Score: ${applicationData.financingResult.affordabilityScore}%`}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Financing Details */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        {isRTL ? 'تفاصيل التمويل المبدئية' : 'Preliminary Financing Details'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground">{isRTL ? 'أقصى قسط شهري' : 'Max Monthly Payment'}</span>
                          <span className="font-bold text-primary text-lg">{applicationData.financingResult.maxMonthlyPayment.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}</span>
                        </div>
                        <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground">{isRTL ? 'أقصى مبلغ تمويل' : 'Max Financing Amount'}</span>
                          <span className="font-bold">{applicationData.financingResult.maxFinancingAmount.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}</span>
                        </div>
                        <Separator />
                        <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground">{isRTL ? 'نسبة الربح' : 'Profit Rate'}</span>
                          <span className="font-medium">{applicationData.financingResult.profitRate}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Car Price Range */}
                  <Card className="bg-primary/5">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">{isRTL ? 'نطاق سعر السيارة المناسب' : 'Suitable Car Price Range'}</h4>
                      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-muted-foreground">{isRTL ? 'من' : 'From'}</span>
                        <span className="font-bold text-lg">{applicationData.financingResult.minCarPrice.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}</span>
                      </div>
                      <Progress 
                        value={50} 
                        className="my-2"
                      />
                      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-muted-foreground">{isRTL ? 'إلى' : 'To'}</span>
                        <span className="font-bold text-lg text-primary">{applicationData.financingResult.maxCarPrice.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Payment Options - Interactive Selection */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{isRTL ? 'اختر خيار التقسيط المناسب' : 'Select Your Installment Plan'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(applicationData.financingResult.termOptions).map(([years, data]: [string, any]) => {
                          // Format year label properly in Arabic
                          const getYearLabel = (y: string) => {
                            if (isRTL) {
                              if (y === '1') return 'سنة';
                              if (y === '2') return 'سنتين';
                              return `${y} سنوات`;
                            }
                            return y === '1' ? 'Year' : `${y} Years`;
                          };

                          // Check if this is the default option (4 years)
                          const isDefault = years === '4';

                          return (
                          <div
                            key={years}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                              applicationData.selectedTerm === years
                                ? 'border-primary bg-primary/10 shadow-md'
                                : 'border-muted hover:border-primary/50 hover:bg-muted/50'
                            } ${isRTL ? 'text-right' : 'text-left'}`}
                            onClick={() => {
                              setApplicationData((prev: any) => ({ ...prev, selectedTerm: years }));
                            }}
                          >
                            {/* Default badge */}
                            {isDefault && applicationData.selectedTerm !== years && (
                              <div className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full`}>
                                {isRTL ? 'الأكثر استخداماً' : 'Most Popular'}
                              </div>
                            )}

                            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  applicationData.selectedTerm === years ? 'border-primary' : 'border-muted-foreground'
                                }`}>
                                  {applicationData.selectedTerm === years && (
                                    <div className="w-3 h-3 rounded-full bg-primary" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-bold text-lg">{getYearLabel(years)}</div>
                                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <span>{data.months} {isRTL ? 'قسط شهري' : 'monthly installments'}</span>
                                    <span className="text-primary font-medium">• {data.rate}</span>
                                  </div>
                                </div>
                              </div>
                              <div className={`text-left ${isRTL ? 'text-right' : ''}`}>
                                <div className="font-bold text-xl text-primary">{Math.round(data.monthly).toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground">{isRTL ? 'ريال/شهر' : 'SAR/month'}</div>
                              </div>
                            </div>

                            {applicationData.selectedTerm === years && (
                              <div className={`mt-3 pt-3 border-t ${isRTL ? 'text-right' : 'text-left'}`}>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-muted-foreground">{isRTL ? 'إجمالي المبلغ' : 'Total Amount'}</span>
                                    <span className="font-medium">{data.totalAmount?.toLocaleString() || '-'} {isRTL ? 'ريال' : 'SAR'}</span>
                                  </div>
                                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-muted-foreground">{isRTL ? 'مبلغ الربح' : 'Profit Amount'}</span>
                                    <span className="font-medium text-orange-500">{data.profitAmount?.toLocaleString() || '-'} {isRTL ? 'ريال' : 'SAR'}</span>
                                  </div>
                                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''} col-span-2`}>
                                    <span className="text-muted-foreground">{isRTL ? 'نسبة الربح السنوية' : 'Annual Profit Rate'}</span>
                                    <span className="font-medium text-primary">{data.rate}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ); })}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Selected Plan Summary */}
                  {applicationData.selectedTerm && (() => {
                    const getYearLabel = (y: string) => {
                      if (isRTL) {
                        if (y === '1') return 'سنة';
                        if (y === '2') return 'سنتين';
                        return `${y} سنوات`;
                      }
                      return y === '1' ? 'year' : `${y} years`;
                    };
                    const selectedData = applicationData.financingResult.termOptions[applicationData.selectedTerm];
                    return (
                    <Card className="bg-green-500/10 border-green-500/30">
                      <CardContent className="p-4">
                        <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse justify-start' : ''}`}>
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="font-semibold text-green-600">{isRTL ? 'الخطة المحددة' : 'Selected Plan'}</span>
                        </div>
                        <div className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                          {isRTL ? (
                            <>
                              قسط شهري <strong>{Math.round(selectedData?.monthly || 0).toLocaleString()} ريال</strong>
                              {' '}لمدة <strong>{getYearLabel(applicationData.selectedTerm)}</strong>
                              {' '}بنسبة ربح <strong className="text-primary">{selectedData?.rate}</strong>
                            </>
                          ) : (
                            <>
                              Monthly payment <strong>{Math.round(selectedData?.monthly || 0).toLocaleString()} SAR</strong>
                              {' '}for <strong>{getYearLabel(applicationData.selectedTerm)}</strong>
                              {' '}at <strong className="text-primary">{selectedData?.rate}</strong> profit rate
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ); })()}
                  
                  {/* Notes */}
                  {applicationData.financingResult.notes.length > 0 && (
                    <div className={`p-3 bg-blue-500/10 rounded-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                      <h4 className="font-semibold text-sm mb-2">{isRTL ? 'ملاحظات مهمة' : 'Important Notes'}</h4>
                      <ul className="space-y-1">
                        {applicationData.financingResult.notes.map((note: string, i: number) => (
                          <li key={i} className="text-xs text-muted-foreground">{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Vehicle Summary */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{isRTL ? 'ملخص السيارة المطلوبة' : 'Requested Vehicle Summary'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground">{isRTL ? 'الماركة والموديل' : 'Brand & Model'}</span>
                          <span className="font-medium">{applicationData.carBrand} {applicationData.carModel}</span>
                        </div>
                        <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground">{isRTL ? 'الفئة' : 'Category'}</span>
                          <span className="font-medium">{applicationData.carCategory}</span>
                        </div>
                        <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground">{isRTL ? 'مستوى التجهيز' : 'Trim Level'}</span>
                          <span className="font-medium">{applicationData.trimLevel}</span>
                        </div>
                        <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground">{isRTL ? 'سنة الموديل' : 'Model Year'}</span>
                          <span className="font-medium">{applicationData.modelYear}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setApplicationStatus('chat');
                        setApplicationStep(0);
                        setApplicationMessages([{
                          id: 'welcome',
                          role: 'assistant',
                          content: isRTL ? 'مرحباً! دعنا نعيد البدء. اختر برنامج التمويل:' : 'Hello! Let\'s start over. Select financing program:',
                          timestamp: new Date(),
                        }]);
                      }}
                    >
                      {t.editInfo}
                    </Button>
                    <Button
                      className="flex-1 sky-gradient text-white"
                      onClick={submitApplication}
                      disabled={applicationLoading}
                    >
                      {applicationLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        isRTL ? 'تقديم الطلب' : 'Submit Application'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {applicationStatus === 'summary' && (
              <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: '400px' }}>
                <div className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className={`p-4 bg-muted/50 rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h4 className="font-bold mb-3">{isRTL ? 'ملخص الطلب' : 'Application Summary'}</h4>
                    <div className="space-y-2 text-sm">
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-muted-foreground">{isRTL ? 'برنامج التمويل' : 'Financing Program'}</span>
                        <span className="font-medium">{applicationData.programType}</span>
                      </div>
                      {applicationData.bankName && (
                        <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground">{isRTL ? 'البنك' : 'Bank'}</span>
                          <span className="font-medium">{applicationData.bankName}</span>
                        </div>
                      )}
                      <Separator className="my-2" />
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-muted-foreground">{isRTL ? 'ماركة السيارة' : 'Car Brand'}</span>
                        <span className="font-medium">{applicationData.carBrand}</span>
                      </div>
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-muted-foreground">{isRTL ? 'فئة السيارة' : 'Car Category'}</span>
                        <span className="font-medium">{applicationData.carCategory}</span>
                      </div>
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-muted-foreground">{isRTL ? 'مستوى التجهيز' : 'Trim Level'}</span>
                        <span className="font-medium">{applicationData.trimLevel}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-muted-foreground">{isRTL ? 'نوع الوظيفة' : 'Employment Type'}</span>
                        <span className="font-medium">{applicationData.employmentType}</span>
                      </div>
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-muted-foreground">{isRTL ? 'مدة العمل' : 'Work Duration'}</span>
                        <span className="font-medium">{applicationData.workDuration}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-muted-foreground">{isRTL ? 'الراتب الشهري' : 'Monthly Salary'}</span>
                        <span className="font-medium">{applicationData.salary} {isRTL ? 'ريال' : 'SAR'}</span>
                      </div>
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-muted-foreground">{isRTL ? 'الميزانية الشهرية' : 'Monthly Budget'}</span>
                        <span className="font-medium">{applicationData.monthlyBudget} {isRTL ? 'ريال' : 'SAR'}</span>
                      </div>
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-muted-foreground">{isRTL ? 'الدفعة المقدمة' : 'Down Payment'}</span>
                        <span className="font-medium">{applicationData.downPaymentCapability} {isRTL ? 'ريال' : 'SAR'}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-muted-foreground">{isRTL ? 'المدينة' : 'City'}</span>
                        <span className="font-medium">{applicationData.city}</span>
                      </div>
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-muted-foreground">{isRTL ? 'رقم الجوال' : 'Phone'}</span>
                        <span className="font-medium" dir="ltr">{applicationData.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recommended Cars */}
                  {parseInt(applicationData.monthlyBudget) >= 1500 && (
                    <div className={`p-4 bg-green-500/10 rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                      <h4 className="font-bold text-green-600 mb-2">{t.recommendedCars}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{t.basedOnBudget}</p>
                      <div className="space-y-2">
                        {[
                          { name: isRTL ? 'تويوتا كامري' : 'Toyota Camry', installment: '2,100' },
                          { name: isRTL ? 'هيونداي سوناتا' : 'Hyundai Sonata', installment: '1,850' },
                          { name: isRTL ? 'هوندا أكورد' : 'Honda Accord', installment: '2,300' },
                        ].map((car, i) => (
                          <div key={i} className={`flex items-center justify-between p-2 bg-background rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="text-sm font-medium">{car.name}</span>
                            <span className="text-sm text-green-600">{car.installment} {isRTL ? 'ريال/شهر' : 'SAR/mo'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setApplicationStatus('chat');
                        setApplicationStep(0);
                        setApplicationMessages([{
                          id: 'welcome',
                          role: 'assistant',
                          content: t.welcomeMessage,
                          timestamp: new Date(),
                        }]);
                      }}
                    >
                      {t.editInfo}
                    </Button>
                    <Button
                      className="flex-1 sky-gradient text-white"
                      onClick={submitApplication}
                      disabled={applicationLoading}
                    >
                      {applicationLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        t.confirmApplication
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {applicationStatus === 'submitted' && !showDocumentsForm && (
              <div className="p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t.applicationSubmitted}</h3>

                {/* Tracking Number - Prominent Display */}
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 mb-4">
                  <p className="text-sm text-muted-foreground mb-1">{t.applicationNumber}</p>
                  <p className="font-mono text-2xl font-bold text-primary tracking-wider">{applicationData.orderNumber}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {isRTL ? 'احتفظ بهذا الرقم لتتبع طلبك' : 'Keep this number to track your request'}
                  </p>
                </div>

                {renderOrderTracking()}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      // Refresh order status with logic
                      const steps = ['pending', 'approved', 'documents', 'final_approval', 'contract', 'delivery'];
                      const currentIndex = steps.indexOf(orderStatus);
                      
                      if (currentIndex < steps.length - 1) {
                        const nextStatus = steps[currentIndex + 1];
                        
                        // If next status is documents, show documents form
                        if (nextStatus === 'documents' && !documentsSubmitted) {
                          setOrderStatus(nextStatus);
                          setShowDocumentsForm(true);
                          toast({ title: isRTL ? 'يرجى استكمال المستندات المطلوبة' : 'Please complete required documents' });
                        } else {
                          setOrderStatus(nextStatus);
                          toast({ title: isRTL ? 'تم تحديث الحالة' : 'Status updated' });
                        }
                      } else {
                        toast({ title: isRTL ? 'الطلب مكتمل' : 'Order is complete' });
                      }
                    }}
                  >
                    <RefreshCw className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'تحديث الحالة' : 'Refresh Status'}
                  </Button>
                  <Button
                    className="flex-1 sky-gradient text-white"
                    onClick={() => setFinancingChatOpen(false)}
                  >
                    {isRTL ? 'إغلاق' : 'Close'}
                  </Button>
                </div>
              </div>
            )}

            {/* Documents Upload Form */}
            {applicationStatus === 'submitted' && showDocumentsForm && (
              <div className="p-4">
                {/* Header with Progress */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowDocumentsForm(false)}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{isRTL ? 'استكمال المستندات' : 'Complete Documents'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? 'يرجى استكمال البيانات ورفع المستندات المطلوبة' : 'Please complete your information and upload required documents'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="p-3 bg-muted/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">{isRTL ? 'نسبة الإكمال' : 'Completion Rate'}</span>
                      <span className="text-xs font-bold text-primary">
                        {Math.round((
                          (documentsData.fullName ? 1 : 0) +
                          (documentsData.nationalId ? 1 : 0) +
                          (documentsData.birthDate ? 1 : 0) +
                          (documentsData.phone ? 1 : 0) +
                          (documentsData.employmentType ? 1 : 0) +
                          (documentsData.companyName ? 1 : 0) +
                          (documentsData.salary ? 1 : 0) +
                          (documentsData.idDocument ? 1 : 0) +
                          (documentsData.salaryCertificate ? 1 : 0) +
                          (documentsData.bankStatement ? 1 : 0)
                        ) / 10 * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(
                        (documentsData.fullName ? 1 : 0) +
                        (documentsData.nationalId ? 1 : 0) +
                        (documentsData.birthDate ? 1 : 0) +
                        (documentsData.phone ? 1 : 0) +
                        (documentsData.employmentType ? 1 : 0) +
                        (documentsData.companyName ? 1 : 0) +
                        (documentsData.salary ? 1 : 0) +
                        (documentsData.idDocument ? 1 : 0) +
                        (documentsData.salaryCertificate ? 1 : 0) +
                        (documentsData.bankStatement ? 1 : 0)
                      ) / 10 * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Order Number Badge */}
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 mt-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t.applicationNumber}</span>
                    <span className="font-mono font-bold text-primary">{applicationData.orderNumber}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Personal Information Section */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      documentsData.fullName && documentsData.nationalId && documentsData.phone && documentsData.birthDate
                        ? 'bg-green-500/5 border-green-500/30'
                        : 'bg-blue-500/10 border-blue-500/20'
                    } ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          documentsData.fullName && documentsData.nationalId && documentsData.phone && documentsData.birthDate
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-500/20 text-blue-500'
                        }`}>
                          {documentsData.fullName && documentsData.nationalId && documentsData.phone && documentsData.birthDate ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </div>
                        {isRTL ? 'البيانات الشخصية' : 'Personal Information'}
                      </h4>
                      {documentsData.fullName && documentsData.nationalId && documentsData.phone && documentsData.birthDate && (
                        <Badge className="bg-green-500 text-white text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {isRTL ? 'مكتمل' : 'Complete'}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">{isRTL ? 'الاسم الكامل' : 'Full Name'} *</Label>
                        <Input
                          value={documentsData.fullName}
                          onChange={(e) => setDocumentsData({...documentsData, fullName: e.target.value})}
                          placeholder={isRTL ? 'أدخل الاسم الكامل' : 'Enter full name'}
                          className={isRTL ? 'text-right' : 'text-left'}
                        />
                      </div>
                      <div>
                        <Label className="text-sm">{isRTL ? 'رقم الهوية' : 'National ID'} *</Label>
                        <Input
                          value={documentsData.nationalId}
                          onChange={(e) => setDocumentsData({...documentsData, nationalId: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                          placeholder={isRTL ? '10 أرقام' : '10 digits'}
                          className="text-left"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">{isRTL ? 'تاريخ الميلاد' : 'Birth Date'} *</Label>
                        <Input
                          type="date"
                          value={documentsData.birthDate}
                          onChange={(e) => setDocumentsData({...documentsData, birthDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label className="text-sm">{isRTL ? 'رقم الجوال' : 'Mobile Number'} *</Label>
                        <Input
                          value={documentsData.phone}
                          onChange={(e) => setDocumentsData({...documentsData, phone: e.target.value})}
                          placeholder="05xxxxxxxx"
                          dir="ltr"
                          className="text-left"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">{isRTL ? 'البريد الإلكتروني' : 'Email'}</Label>
                        <Input
                          type="email"
                          value={documentsData.email}
                          onChange={(e) => setDocumentsData({...documentsData, email: e.target.value})}
                          placeholder="email@example.com"
                          dir="ltr"
                          className="text-left"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">{isRTL ? 'المدينة' : 'City'}</Label>
                        <select
                          className="w-full h-10 rounded-md border bg-background px-3"
                          value={documentsData.city}
                          onChange={(e) => setDocumentsData({...documentsData, city: e.target.value})}
                        >
                          <option value="">{isRTL ? 'اختر المدينة' : 'Select City'}</option>
                          <option value="riyadh">{isRTL ? 'الرياض' : 'Riyadh'}</option>
                          <option value="jeddah">{isRTL ? 'جدة' : 'Jeddah'}</option>
                          <option value="dammam">{isRTL ? 'الدمام' : 'Dammam'}</option>
                          <option value="mecca">{isRTL ? 'مكة المكرمة' : 'Mecca'}</option>
                          <option value="medina">{isRTL ? 'المدينة المنورة' : 'Medina'}</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>

                  {/* Employment Information Section */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      documentsData.employmentType && documentsData.companyName && documentsData.salary
                        ? 'bg-green-500/5 border-green-500/30'
                        : 'bg-emerald-500/10 border-emerald-500/20'
                    } ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          documentsData.employmentType && documentsData.companyName && documentsData.salary
                            ? 'bg-green-500 text-white'
                            : 'bg-emerald-500/20 text-emerald-500'
                        }`}>
                          {documentsData.employmentType && documentsData.companyName && documentsData.salary ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Building2 className="w-4 h-4" />
                          )}
                        </div>
                        {isRTL ? 'البيانات الوظيفية' : 'Employment Information'}
                      </h4>
                      {documentsData.employmentType && documentsData.companyName && documentsData.salary && (
                        <Badge className="bg-green-500 text-white text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {isRTL ? 'مكتمل' : 'Complete'}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">{isRTL ? 'نوع الوظيفة' : 'Employment Type'} *</Label>
                        <select
                          className="w-full h-10 rounded-md border bg-background px-3"
                          value={documentsData.employmentType}
                          onChange={(e) => setDocumentsData({...documentsData, employmentType: e.target.value})}
                        >
                          <option value="">{isRTL ? 'اختر النوع' : 'Select Type'}</option>
                          <option value="government">{isRTL ? 'حكومية' : 'Government'}</option>
                          <option value="private">{isRTL ? 'قطاع خاص' : 'Private Sector'}</option>
                          <option value="selfEmployed">{isRTL ? 'عمل حر' : 'Self Employed'}</option>
                          <option value="retired">{isRTL ? 'متقاعد' : 'Retired'}</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-sm">{isRTL ? 'اسم الجهة' : 'Company Name'} *</Label>
                        <Input
                          value={documentsData.companyName}
                          onChange={(e) => setDocumentsData({...documentsData, companyName: e.target.value})}
                          placeholder={isRTL ? 'اسم الشركة أو الجهة' : 'Company name'}
                          className={isRTL ? 'text-right' : 'text-left'}
                        />
                      </div>
                      <div>
                        <Label className="text-sm">{isRTL ? 'المسمى الوظيفي' : 'Job Title'}</Label>
                        <Input
                          value={documentsData.jobTitle}
                          onChange={(e) => setDocumentsData({...documentsData, jobTitle: e.target.value})}
                          placeholder={isRTL ? 'المسمى الوظيفي' : 'Job title'}
                          className={isRTL ? 'text-right' : 'text-left'}
                        />
                      </div>
                      <div>
                        <Label className="text-sm">{isRTL ? 'مدة العمل' : 'Work Duration'}</Label>
                        <select
                          className="w-full h-10 rounded-md border bg-background px-3"
                          value={documentsData.workDuration}
                          onChange={(e) => setDocumentsData({...documentsData, workDuration: e.target.value})}
                        >
                          <option value="">{isRTL ? 'اختر المدة' : 'Select Duration'}</option>
                          <option value="less1">{isRTL ? 'أقل من سنة' : 'Less than 1 year'}</option>
                          <option value="1-2">{isRTL ? '1-2 سنة' : '1-2 years'}</option>
                          <option value="2-5">{isRTL ? '2-5 سنوات' : '2-5 years'}</option>
                          <option value="5+">{isRTL ? 'أكثر من 5 سنوات' : 'More than 5 years'}</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-sm">{isRTL ? 'الراتب الشهري' : 'Monthly Salary'} *</Label>
                        <Input
                          type="number"
                          value={documentsData.salary}
                          onChange={(e) => setDocumentsData({...documentsData, salary: e.target.value})}
                          placeholder={isRTL ? 'الراتب الشهري' : 'Monthly salary'}
                          className="text-left"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">{isRTL ? 'البنك' : 'Bank'}</Label>
                        <select
                          className="w-full h-10 rounded-md border bg-background px-3"
                          value={documentsData.bankName}
                          onChange={(e) => setDocumentsData({...documentsData, bankName: e.target.value})}
                        >
                          <option value="">{isRTL ? 'اختر البنك' : 'Select Bank'}</option>
                          <option value="alrajhi">{isRTL ? 'بنك الراجحي' : 'Al Rajhi Bank'}</option>
                          <option value="albilad">{isRTL ? 'بنك البلاد' : 'Bank Albilad'}</option>
                          <option value="aljazira">{isRTL ? 'البنك السعودي الفرنسي' : 'Banque Saudi Fransi'}</option>
                          <option value="snb">{isRTL ? 'البنك الأول' : 'SNB'}</option>
                          <option value="anb">{isRTL ? 'البنك العربي الوطني' : 'ANB'}</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>

                  {/* Required Documents Section */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      documentsData.idDocument && documentsData.salaryCertificate && documentsData.bankStatement
                        ? 'bg-green-500/5 border-green-500/30'
                        : 'bg-amber-500/10 border-amber-500/20'
                    } ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          documentsData.idDocument && documentsData.salaryCertificate && documentsData.bankStatement
                            ? 'bg-green-500 text-white'
                            : 'bg-amber-500/20 text-amber-500'
                        }`}>
                          {documentsData.idDocument && documentsData.salaryCertificate && documentsData.bankStatement ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </div>
                        {isRTL ? 'المستندات المطلوبة' : 'Required Documents'}
                      </h4>
                      {documentsData.idDocument && documentsData.salaryCertificate && documentsData.bankStatement && (
                        <Badge className="bg-green-500 text-white text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {isRTL ? 'مكتمل' : 'Complete'}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      {/* ID Document */}
                      <div className={`p-3 rounded-xl border-2 transition-all ${
                        documentsData.idDocument 
                          ? 'bg-green-500/5 border-green-500/30' 
                          : 'bg-background border-dashed border-muted-foreground/30 hover:border-primary/50'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              documentsData.idDocument ? 'bg-green-500/20' : 'bg-blue-500/20'
                            }`}>
                              {documentsData.idDocument ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                <FileText className="w-5 h-5 text-blue-500" />
                              )}
                            </div>
                            <div className={isRTL ? 'text-right' : 'text-left'}>
                              <p className="font-medium text-sm">{isRTL ? 'صورة الهوية الوطنية' : 'National ID Copy'} *</p>
                              <p className="text-xs text-muted-foreground">{isRTL ? 'ملف PDF أو صورة' : 'PDF or Image'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {documentsData.idDocument && (
                              <Badge className="bg-green-500 text-white text-xs">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                {isRTL ? 'تم الرفع' : 'Uploaded'}
                              </Badge>
                            )}
                            <Input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              id="idDocument"
                              onChange={(e) => setDocumentsData({...documentsData, idDocument: e.target.files?.[0] || null})}
                            />
                            <Button
                              variant={documentsData.idDocument ? "outline" : "default"}
                              size="sm"
                              className={documentsData.idDocument ? '' : 'sky-gradient text-white'}
                              onClick={() => document.getElementById('idDocument')?.click()}
                            >
                              <Upload className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                              {documentsData.idDocument ? (isRTL ? 'تغيير' : 'Change') : (isRTL ? 'رفع' : 'Upload')}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Salary Certificate */}
                      <div className={`p-3 rounded-xl border-2 transition-all ${
                        documentsData.salaryCertificate 
                          ? 'bg-green-500/5 border-green-500/30' 
                          : 'bg-background border-dashed border-muted-foreground/30 hover:border-primary/50'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              documentsData.salaryCertificate ? 'bg-green-500/20' : 'bg-emerald-500/20'
                            }`}>
                              {documentsData.salaryCertificate ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                <FileText className="w-5 h-5 text-emerald-500" />
                              )}
                            </div>
                            <div className={isRTL ? 'text-right' : 'text-left'}>
                              <p className="font-medium text-sm">{isRTL ? 'شهادة الراتب' : 'Salary Certificate'} *</p>
                              <p className="text-xs text-muted-foreground">{isRTL ? 'حديثة (خلال 3 أشهر)' : 'Recent (within 3 months)'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {documentsData.salaryCertificate && (
                              <Badge className="bg-green-500 text-white text-xs">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                {isRTL ? 'تم الرفع' : 'Uploaded'}
                              </Badge>
                            )}
                            <Input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              id="salaryCertificate"
                              onChange={(e) => setDocumentsData({...documentsData, salaryCertificate: e.target.files?.[0] || null})}
                            />
                            <Button
                              variant={documentsData.salaryCertificate ? "outline" : "default"}
                              size="sm"
                              className={documentsData.salaryCertificate ? '' : 'sky-gradient text-white'}
                              onClick={() => document.getElementById('salaryCertificate')?.click()}
                            >
                              <Upload className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                              {documentsData.salaryCertificate ? (isRTL ? 'تغيير' : 'Change') : (isRTL ? 'رفع' : 'Upload')}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Bank Statement */}
                      <div className={`p-3 rounded-xl border-2 transition-all ${
                        documentsData.bankStatement 
                          ? 'bg-green-500/5 border-green-500/30' 
                          : 'bg-background border-dashed border-muted-foreground/30 hover:border-primary/50'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              documentsData.bankStatement ? 'bg-green-500/20' : 'bg-amber-500/20'
                            }`}>
                              {documentsData.bankStatement ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                <FileText className="w-5 h-5 text-amber-500" />
                              )}
                            </div>
                            <div className={isRTL ? 'text-right' : 'text-left'}>
                              <p className="font-medium text-sm">{isRTL ? 'كشف حساب بنكي' : 'Bank Statement'} *</p>
                              <p className="text-xs text-muted-foreground">{isRTL ? 'آخر 3 أشهر' : 'Last 3 months'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {documentsData.bankStatement && (
                              <Badge className="bg-green-500 text-white text-xs">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                {isRTL ? 'تم الرفع' : 'Uploaded'}
                              </Badge>
                            )}
                            <Input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              id="bankStatement"
                              onChange={(e) => setDocumentsData({...documentsData, bankStatement: e.target.files?.[0] || null})}
                            />
                            <Button
                              variant={documentsData.bankStatement ? "outline" : "default"}
                              size="sm"
                              className={documentsData.bankStatement ? '' : 'sky-gradient text-white'}
                              onClick={() => document.getElementById('bankStatement')?.click()}
                            >
                              <Upload className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                              {documentsData.bankStatement ? (isRTL ? 'تغيير' : 'Change') : (isRTL ? 'رفع' : 'Upload')}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Work Contract - Optional */}
                      <div className="p-3 bg-background rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all">
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              documentsData.workContract ? 'bg-green-500/20' : 'bg-purple-500/20'
                            }`}>
                              {documentsData.workContract ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                <FileText className="w-5 h-5 text-purple-500" />
                              )}
                            </div>
                            <div className={isRTL ? 'text-right' : 'text-left'}>
                              <p className="font-medium text-sm">{isRTL ? 'عقد العمل' : 'Work Contract'}</p>
                              <p className="text-xs text-muted-foreground">{isRTL ? 'اختياري' : 'Optional'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {documentsData.workContract && (
                              <Badge className="bg-green-500 text-white text-xs">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                {isRTL ? 'تم الرفع' : 'Uploaded'}
                              </Badge>
                            )}
                            <Input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              id="workContract"
                              onChange={(e) => setDocumentsData({...documentsData, workContract: e.target.files?.[0] || null})}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById('workContract')?.click()}
                            >
                              <Upload className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                              {documentsData.workContract ? (isRTL ? 'تغيير' : 'Change') : (isRTL ? 'رفع' : 'Upload')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowDocumentsForm(false)}
                    >
                      {isRTL ? 'رجوع' : 'Back'}
                    </Button>
                    <Button
                      className="flex-1 sky-gradient text-white"
                      disabled={!documentsData.fullName || !documentsData.nationalId || !documentsData.phone || !documentsData.idDocument || !documentsData.salaryCertificate || !documentsData.bankStatement}
                      onClick={() => {
                        setDocumentsSubmitted(true);
                        setShowDocumentsForm(false);
                        setOrderStatus('final_approval');
                        toast({
                          title: isRTL ? '✅ تم إرسال المستندات بنجاح' : '✅ Documents Submitted Successfully',
                          description: isRTL ? 'سيتم مراجعة طلبك والتواصل معك قريباً' : 'Your application will be reviewed and we will contact you soon'
                        });
                      }}
                    >
                      <Send className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {isRTL ? 'إرسال المستندات' : 'Submit Documents'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Tracking Dialog */}
      <Dialog open={orderTrackingOpen} onOpenChange={setOrderTrackingOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-start' : ''}`}>
              <ClipboardList className="w-5 h-5" />
              {isRTL ? 'سجل الطلبات وتتبعها' : 'Orders & Tracking'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Search Order */}
            <div className={`p-4 bg-muted/30 rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
              <h4 className="font-semibold mb-3">{isRTL ? 'البحث عن طلب' : 'Search Order'}</h4>
              <div className="flex gap-2">
                <Input
                  placeholder={isRTL ? 'أدخل رقم الطلب (مثل: CL-XXXXXX)' : 'Enter order number (e.g., CL-XXXXXX)'}
                  value={orderSearchNumber}
                  onChange={(e) => setOrderSearchNumber(e.target.value.toUpperCase())}
                  className="flex-1"
                  dir="ltr"
                />
                <Button 
                  className="sky-gradient text-white"
                  onClick={() => {
                    const order = ordersList.find(o => o.orderNumber === orderSearchNumber);
                    if (order) {
                      setFoundOrder(order);
                    } else {
                      toast({
                        title: isRTL ? 'لم يتم العثور على الطلب' : 'Order not found',
                        description: isRTL ? 'تأكد من رقم الطلب' : 'Please check the order number',
                        variant: 'destructive'
                      });
                    }
                  }}
                >
                  {isRTL ? 'بحث' : 'Search'}
                </Button>
              </div>
            </div>

            {/* Found Order Details - Success Page Style */}
            {foundOrder && (
              <div className="text-center">
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </motion.div>
                
                <h3 className="text-xl font-bold mb-2">{t.applicationSubmitted}</h3>

                {/* Tracking Number - Prominent Display */}
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 mb-4">
                  <p className="text-sm text-muted-foreground mb-1">{t.applicationNumber}</p>
                  <p className="font-mono text-2xl font-bold text-primary tracking-wider">{foundOrder.orderNumber}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {isRTL ? 'احتفظ بهذا الرقم لتتبع طلبك' : 'Keep this number to track your request'}
                  </p>
                </div>

                {/* Order Tracking Steps */}
                {renderOrderTracking()}
                
                {/* Vehicle Info Card */}
                <div className={`p-4 bg-muted/50 rounded-xl mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Car className="w-4 h-4 text-primary" />
                    {isRTL ? 'معلومات السيارة' : 'Vehicle Info'}
                  </h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className={`flex justify-between p-2 bg-background rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-muted-foreground">{isRTL ? 'الماركة' : 'Brand'}</span>
                      <span className="font-medium">{foundOrder.carBrand}</span>
                    </div>
                    <div className={`flex justify-between p-2 bg-background rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-muted-foreground">{isRTL ? 'الموديل' : 'Model'}</span>
                      <span className="font-medium">{foundOrder.carModel}</span>
                    </div>
                  </div>
                </div>
                
                {/* Financing Info Card */}
                <div className={`p-4 bg-green-500/10 rounded-xl border border-green-500/20 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-green-500" />
                    {isRTL ? 'معلومات التمويل' : 'Financing Info'}
                  </h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className={`flex justify-between p-2 bg-background rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-muted-foreground">{isRTL ? 'البرنامج' : 'Program'}</span>
                      <span className="font-medium">{foundOrder.programType}</span>
                    </div>
                    <div className={`flex justify-between p-2 bg-background rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-muted-foreground">{isRTL ? 'البنك' : 'Bank'}</span>
                      <span className="font-medium">{foundOrder.bankName}</span>
                    </div>
                    <div className={`flex justify-between p-2 bg-background rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-muted-foreground">{isRTL ? 'القسط الشهري' : 'Monthly'}</span>
                      <span className="text-green-600 font-bold">{foundOrder.monthlyPayment?.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}</span>
                    </div>
                    <div className={`flex justify-between p-2 bg-background rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-muted-foreground">{isRTL ? 'المدة' : 'Duration'}</span>
                      <span className="font-medium">{foundOrder.selectedTerm} {isRTL ? 'سنوات' : 'years'}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      // Refresh order status
                      const steps = ['pending', 'approved', 'documents', 'final_approval', 'contract', 'delivery'];
                      const currentIndex = steps.indexOf(orderStatus);
                      if (currentIndex < steps.length - 1) {
                        setOrderStatus(steps[currentIndex + 1]);
                        toast({ title: isRTL ? 'تم تحديث الحالة' : 'Status updated' });
                      } else {
                        toast({ title: isRTL ? 'الطلب مكتمل' : 'Order is complete' });
                      }
                    }}
                  >
                    <RefreshCw className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'تحديث الحالة' : 'Refresh Status'}
                  </Button>
                  <Button
                    className="flex-1 sky-gradient text-white"
                    onClick={() => setOrderTrackingOpen(false)}
                  >
                    {isRTL ? 'إغلاق' : 'Close'}
                  </Button>
                </div>
              </div>
            )}

            {/* All Orders List */}
            {ordersList.length > 0 && (
              <div className={`p-4 bg-muted/30 rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                <h4 className="font-semibold mb-3">{isRTL ? 'طلباتك السابقة' : 'Your Orders'}</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {ordersList.map((order, i) => (
                    <div 
                      key={i}
                      className={`p-3 bg-background rounded-lg border cursor-pointer hover:border-primary transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                      onClick={() => {
                        setOrderSearchNumber(order.orderNumber);
                        setFoundOrder(order);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-primary">{order.orderNumber}</span>
                          <p className="text-xs text-muted-foreground mt-1">
                            {order.carBrand} {order.carModel} - {order.programType}
                          </p>
                        </div>
                        <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                          {order.status === 'pending' ? (isRTL ? 'قيد المراجعة' : 'Pending') : 
                           order.status === 'approved' ? (isRTL ? 'موافق عليه' : 'Approved') :
                           order.status === 'delivered' ? (isRTL ? 'تم التسليم' : 'Delivered') :
                           order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Orders Message */}
            {ordersList.length === 0 && !foundOrder && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{isRTL ? 'لا توجد طلبات سابقة' : 'No previous orders'}</p>
                <p className="text-sm">{isRTL ? 'سيظهر هنا سجل طلباتك' : 'Your order history will appear here'}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Apps Sheet - Side Panel */}
      <Sheet open={appsSheetOpen} onOpenChange={setAppsSheetOpen}>
        <SheetContent 
          side={isRTL ? "left" : "right"} 
          className="!border-0 w-full sm:w-1/4 min-w-[280px] max-w-[400px] h-screen p-0 bg-background"
        >
          {/* Header with Close Button on Left, Title and Icon on Right */}
          <div className={`p-4 bg-background flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Close Button - Always on Left side */}
            <button 
              onClick={() => setAppsSheetOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
            
            {/* Title and Icon - Always on Right side */}
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <LayoutGrid className="w-5 h-5 text-white" />
              </div>
              <SheetTitle className="text-lg font-bold">
                {isRTL ? 'الخدمات' : 'Services'}
              </SheetTitle>
            </div>
          </div>
          
          {/* Blue Gradient Divider Line */}
          <div className="w-full px-4">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 h-[calc(100vh-120px)]">
            <div className="grid grid-cols-2 gap-4">
              {appFeatures.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={feature.id}
                    className="flex flex-col items-center cursor-pointer transition-all duration-200 group p-4 rounded-xl hover:bg-muted/50"
                    onClick={() => {
                      const serviceId = feature.id;
                      setSelectedService(serviceId);
                      setAppsSheetOpen(false);
                      // Delay opening dialog to allow sheet to close first
                      setTimeout(() => {
                        setServiceDetailOpen(true);
                      }, 300);
                    }}
                  >
                    <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm text-center font-medium leading-tight">
                      {isRTL ? feature.titleAr : feature.titleEn}
                    </span>
                    <span className="text-xs text-muted-foreground text-center mt-1 line-clamp-2">
                      {isRTL ? feature.descriptionAr : feature.descriptionEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Service Detail Panel */}
      <Dialog open={serviceDetailOpen} onOpenChange={setServiceDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse justify-start' : ''}`}>
              {selectedService && appFeatures.find(f => f.id === selectedService) && (
                <>
                  {(() => {
                    const feature = appFeatures.find(f => f.id === selectedService)!;
                    const IconComponent = feature.icon;
                    return (
                      <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className={`w-10 h-10 rounded-xl ${feature.color} flex items-center justify-center shadow-lg`}
                      >
                        <IconComponent className="w-5 h-5 text-white" />
                      </motion.div>
                    );
                  })()}
                  <div>
                    <span className="text-lg font-bold">{isRTL ? appFeatures.find(f => f.id === selectedService)?.titleAr : appFeatures.find(f => f.id === selectedService)?.titleEn}</span>
                    <p className="text-xs text-muted-foreground font-normal">{isRTL ? appFeatures.find(f => f.id === selectedService)?.descriptionAr : appFeatures.find(f => f.id === selectedService)?.descriptionEn}</p>
                  </div>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {/* Service Content */}
          <div className="space-y-4">
            {/* ========== خدمة تتبع الطلب - تصميم جديد ========== */}
            {selectedService === 'order-tracking' && (
              <div className="space-y-4">
                {/* شريط البحث */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl" />
                  <div className="relative p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/30">
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Input
                          placeholder={isRTL ? 'أدخل رقم الطلب (مثال: CL-2024-XXXXX)' : 'Enter order number (e.g., CL-2024-XXXXX)'}
                          value={orderSearchNumber}
                          onChange={(e) => setOrderSearchNumber(e.target.value.toUpperCase())}
                          className="h-14 text-lg font-mono bg-white/50 dark:bg-black/20 border-2 border-cyan-500/30 focus:border-cyan-500 rounded-xl"
                          dir="ltr"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          <ClipboardList className="w-5 h-5 text-cyan-500" />
                        </div>
                      </div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl shadow-lg"
                          onClick={() => {
                            if (orderSearchNumber.length < 10) {
                              toast({ title: isRTL ? 'يرجى إدخال رقم طلب صحيح' : 'Please enter a valid order number', variant: 'destructive' });
                              return;
                            }
                            const found = ordersList.find(o => o.orderNumber === orderSearchNumber);
                            if (found) {
                              setFoundOrder(found);
                              setOrderStatus(found.status || 'pending');
                            } else {
                              setFoundOrder({
                                orderNumber: orderSearchNumber,
                                status: 'pending',
                                date: new Date().toLocaleDateString(isRTL ? 'ar-SA' : 'en-US'),
                                carBrand: 'Toyota',
                                carModel: 'Camry',
                                year: 2024,
                                financingAmount: '85,000',
                                bank: isRTL ? 'بنك الراجحي' : 'Al Rajhi Bank',
                              });
                              setOrderStatus('pending');
                            }
                            toast({ title: isRTL ? '✅ تم العثور على الطلب' : '✅ Order found' });
                          }}
                        >
                          <Search className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          {isRTL ? 'بحث' : 'Search'}
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* قائمة الطلبات السابقة */}
                {ordersList.length > 0 && !foundOrder && (
                  <div className="space-y-2">
                    <p className="font-semibold text-sm text-muted-foreground">{isRTL ? '📋 طلباتك السابقة' : '📋 Your Previous Orders'}</p>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {ordersList.map((order: any, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-3 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl flex justify-between items-center cursor-pointer hover:from-cyan-500/10 hover:to-blue-500/10 transition-all border border-transparent hover:border-cyan-500/30"
                          onClick={() => {
                            setOrderSearchNumber(order.orderNumber);
                            setFoundOrder(order);
                            setOrderStatus(order.status || 'pending');
                          }}
                        >
                          <div>
                            <p className="font-mono font-bold text-primary">{order.orderNumber}</p>
                            <p className="text-xs text-muted-foreground">{order.carBrand} {order.carModel}</p>
                          </div>
                          <Badge className={order.status === 'pending' ? 'bg-amber-500' : order.status === 'approved' ? 'bg-green-500' : 'bg-blue-500'}>
                            {order.status === 'pending' ? (isRTL ? 'قيد المراجعة' : 'Pending') : 
                             order.status === 'approved' ? (isRTL ? 'موافق عليه' : 'Approved') : 
                             order.status === 'documents' ? (isRTL ? 'المستندات' : 'Documents') :
                             order.status === 'final_approval' ? (isRTL ? 'الموافقة النهائية' : 'Final Approval') :
                             order.status === 'contract' ? (isRTL ? 'العقد' : 'Contract') :
                             order.status === 'delivery' ? (isRTL ? 'التسليم' : 'Delivery') : order.status}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* نتيجة البحث */}
                {foundOrder && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* بطاقة معلومات الطلب */}
                    <Card className="border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-mono text-base px-4 py-1">
                            {foundOrder.orderNumber}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{foundOrder.date}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-white/50 dark:bg-black/10 rounded-xl">
                            <p className="text-xs text-muted-foreground">{isRTL ? '🚗 السيارة' : '🚗 Car'}</p>
                            <p className="font-bold">{foundOrder.carBrand} {foundOrder.carModel}</p>
                          </div>
                          <div className="p-3 bg-white/50 dark:bg-black/10 rounded-xl">
                            <p className="text-xs text-muted-foreground">{isRTL ? '💰 مبلغ التمويل' : '💰 Amount'}</p>
                            <p className="font-bold">{foundOrder.financingAmount} {isRTL ? 'ريال' : 'SAR'}</p>
                          </div>
                          <div className="p-3 bg-white/50 dark:bg-black/10 rounded-xl">
                            <p className="text-xs text-muted-foreground">{isRTL ? '🏦 البنك' : '🏦 Bank'}</p>
                            <p className="font-bold">{foundOrder.bank}</p>
                          </div>
                          <div className="p-3 bg-white/50 dark:bg-black/10 rounded-xl">
                            <p className="text-xs text-muted-foreground">{isRTL ? '📅 الحالة' : '📅 Status'}</p>
                            <p className="font-bold text-green-600">{isRTL ? 'قيد المعالجة' : 'In Progress'}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* خط الزمن لتتبع الطلب */}
                    <div className="relative">
                      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-500 rounded-full -translate-x-1/2" />
                      <div className="space-y-6">
                        {[
                          { id: 'pending', icon: Clock, title: isRTL ? 'استلام الطلب' : 'Order Received', desc: isRTL ? 'تم استلام طلبك بنجاح' : 'Your order has been received' },
                          { id: 'approved', icon: CheckCircle2, title: isRTL ? 'الموافقة المبدئية' : 'Initial Approval', desc: isRTL ? 'تمت الموافقة المبدئية من البنك' : 'Initial bank approval granted' },
                          { id: 'documents', icon: FileText, title: isRTL ? 'استكمال المستندات' : 'Documents', desc: isRTL ? 'يرجى رفع المستندات المطلوبة' : 'Please upload required documents' },
                          { id: 'final_approval', icon: Award, title: isRTL ? 'الموافقة النهائية' : 'Final Approval', desc: isRTL ? 'الموافقة النهائية من البنك' : 'Final bank approval' },
                          { id: 'contract', icon: FileText, title: isRTL ? 'توقيع العقد' : 'Contract Signing', desc: isRTL ? 'توقيع عقد التمويل' : 'Sign financing contract' },
                          { id: 'delivery', icon: Car, title: isRTL ? 'تسليم السيارة' : 'Car Delivery', desc: isRTL ? 'استلام سيارتك الجديدة' : 'Receive your new car' },
                        ].map((step, index) => {
                          const steps = ['pending', 'approved', 'documents', 'final_approval', 'contract', 'delivery'];
                          const currentIndex = steps.indexOf(orderStatus);
                          const stepIndex = steps.indexOf(step.id);
                          const isCompleted = stepIndex < currentIndex;
                          const isCurrent = stepIndex === currentIndex;
                          const IconComp = step.icon;
                          
                          return (
                            <motion.div
                              key={step.id}
                              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`relative flex items-center gap-4 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                            >
                              <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                <div className={`p-4 rounded-xl ${isCompleted ? 'bg-green-500/10 border border-green-500/30' : isCurrent ? 'bg-cyan-500/10 border-2 border-cyan-500' : 'bg-muted/30'}`}>
                                  <p className={`font-bold ${isCurrent ? 'text-cyan-600' : isCompleted ? 'text-green-600' : ''}`}>{step.title}</p>
                                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                                </div>
                              </div>
                              <div className={`z-10 w-12 h-12 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500' : isCurrent ? 'bg-cyan-500 animate-pulse' : 'bg-muted'}`}>
                                <IconComp className={`w-6 h-6 ${isCompleted || isCurrent ? 'text-white' : 'text-muted-foreground'}`} />
                              </div>
                              <div className="flex-1" />
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* أزرار الإجراءات */}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 h-12 rounded-xl border-2"
                        onClick={() => {
                          setFoundOrder(null);
                          setOrderSearchNumber('');
                        }}
                      >
                        <RefreshCw className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {isRTL ? 'بحث جديد' : 'New Search'}
                      </Button>
                      <Button
                        className="flex-1 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl"
                        onClick={() => toast({ title: isRTL ? '📞 سيتم التواصل معك قريباً' : '📞 We will contact you soon' })}
                      >
                        <Phone className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {isRTL ? 'تواصل معنا' : 'Contact Us'}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* حالة عدم وجود طلبات */}
                {!foundOrder && ordersList.length === 0 && (
                  <div className="text-center py-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-4"
                    >
                      <ClipboardList className="w-10 h-10 text-cyan-500" />
                    </motion.div>
                    <p className="text-muted-foreground">{isRTL ? 'لم تقم بتقديم أي طلبات بعد' : 'You haven\'t submitted any orders yet'}</p>
                    <Button
                      variant="link"
                      className="mt-2 text-cyan-500"
                      onClick={() => {
                        setServiceDetailOpen(false);
                        setSelectedService('new-car-request');
                        setTimeout(() => setServiceDetailOpen(true), 100);
                      }}
                    >
                      {isRTL ? 'قدم طلبك الآن ←' : 'Submit your request now →'}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* ========== خدمة أسعار السوق - تصميم جديد ========== */}
            {selectedService === 'market-prices' && (
              <div className="space-y-4">
                {/* ترحيب */}
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl" />
                  <div className="relative p-5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl border border-emerald-500/30">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                        <TrendingUp className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{isRTL ? 'أسعار السوق المحدثة' : 'Updated Market Prices'}</h4>
                        <p className="text-sm text-muted-foreground">{isRTL ? 'قارن أسعار السيارات في السوق السعودي' : 'Compare car prices in Saudi market'}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* فلتر البحث */}
                <div className="p-4 bg-muted/20 rounded-2xl">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-sm text-muted-foreground">{isRTL ? 'الماركة' : 'Brand'}</Label>
                      <select 
                        className="w-full h-11 rounded-xl border bg-background px-3 mt-1 focus:ring-2 focus:ring-emerald-500/50" 
                        value={mpBrand} 
                        onChange={(e) => setMpBrand(e.target.value)}
                      >
                        <option value="">{isRTL ? 'اختر الماركة' : 'Select Brand'}</option>
                        {Object.keys(carModelsByBrand).map(brand => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">{isRTL ? 'الموديل' : 'Model'}</Label>
                      <select 
                        className="w-full h-11 rounded-xl border bg-background px-3 mt-1" 
                        value={mpModel} 
                        onChange={(e) => setMpModel(e.target.value)}
                        disabled={!mpBrand}
                      >
                        <option value="">{isRTL ? 'اختر الموديل' : 'Select Model'}</option>
                        {mpBrand && carModelsByBrand[mpBrand]?.map(model => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">{isRTL ? 'السنة' : 'Year'}</Label>
                      <select 
                        className="w-full h-11 rounded-xl border bg-background px-3 mt-1" 
                        value={mpYear} 
                        onChange={(e) => setMpYear(e.target.value)}
                      >
                        <option value="">{isRTL ? 'اختر السنة' : 'Select Year'}</option>
                        {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* حالة السيارة */}
                  <div className="mt-3">
                    <Label className="text-sm text-muted-foreground">{isRTL ? 'حالة السيارة' : 'Car Condition'}</Label>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => setMpCondition('new')}
                        className={`flex-1 p-3 rounded-xl border-2 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                          mpCondition === 'new' 
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' 
                            : 'border-muted hover:border-emerald-500/50'
                        }`}
                      >
                        <Sparkles className="w-4 h-4" />
                        {isRTL ? 'جديدة' : 'New'}
                      </button>
                      <button
                        onClick={() => setMpCondition('used')}
                        className={`flex-1 p-3 rounded-xl border-2 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                          mpCondition === 'used' 
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' 
                            : 'border-muted hover:border-emerald-500/50'
                        }`}
                      >
                        <Cog className="w-4 h-4" />
                        {isRTL ? 'مستعملة' : 'Used'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* عرض الأسعار */}
                {mpBrand && mpModel ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* ملخص الأسعار */}
                    <div className="p-5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl border border-emerald-500/30">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-bold">{isRTL ? `أسعار ${mpBrand} ${mpModel} ${mpYear}` : `${mpBrand} ${mpModel} ${mpYear} Prices`}</h5>
                        <Badge className="bg-emerald-500 text-white flex items-center gap-1">
                          <RefreshCw className="w-3 h-3" />
                          {isRTL ? 'محدث اليوم' : 'Updated Today'}
                        </Badge>
                      </div>
                      
                      {(() => {
                        const prices = getMarketPrices();
                        if (!prices) return null;
                        return (
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-white/50 dark:bg-black/10 rounded-xl">
                              <p className="text-xs text-muted-foreground">{isRTL ? '📉 أقل سعر' : '📉 Lowest'}</p>
                              <p className="text-2xl font-bold text-green-600">{prices.lowestPrice.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">{isRTL ? 'ريال' : 'SAR'}</p>
                            </div>
                            <div className="text-center p-3 bg-white/50 dark:bg-black/10 rounded-xl border-2 border-emerald-500">
                              <p className="text-xs text-muted-foreground">{isRTL ? '📊 متوسط السعر' : '📊 Average'}</p>
                              <p className="text-2xl font-bold text-emerald-600">{prices.avgPrice.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">{isRTL ? 'ريال' : 'SAR'}</p>
                            </div>
                            <div className="text-center p-3 bg-white/50 dark:bg-black/10 rounded-xl">
                              <p className="text-xs text-muted-foreground">{isRTL ? '📈 أعلى سعر' : '📈 Highest'}</p>
                              <p className="text-2xl font-bold text-orange-600">{prices.highestPrice.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">{isRTL ? 'ريال' : 'SAR'}</p>
                            </div>
                          </div>
                        );
                      })()}
                      
                      {/* Year and Condition Info */}
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-emerald-500/20">
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                          <Calendar className="w-3 h-3 mr-1" />
                          {mpYear}
                        </Badge>
                        <Badge variant="outline" className={mpCondition === 'new' ? 'bg-green-500/10 text-green-600 border-green-500/30' : 'bg-amber-500/10 text-amber-600 border-amber-500/30'}>
                          {mpCondition === 'new' ? (isRTL ? 'جديدة' : 'New') : (isRTL ? 'مستعملة' : 'Used')}
                        </Badge>
                      </div>
                    </div>

                    {/* قائمة المعارض والأسعار */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="font-semibold text-sm text-muted-foreground">{isRTL ? '🏪 المعارض والوكالات - اضغط للطلب' : '🏪 Showrooms & Dealers - Click to Order'}</h5>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDealerRefreshCount(prev => prev + 1);
                            toast({ title: isRTL ? '🔄 تم تحديث قائمة المعارض والوكلاء' : '🔄 Showrooms list updated' });
                          }}
                          className="flex items-center gap-1 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                        >
                          <RefreshCw className="w-4 h-4" />
                          {isRTL ? 'تحديث' : 'Refresh'}
                        </Button>
                      </div>
                      
                      {getDealers().map((item, i) => (
                        <motion.div
                          key={`${i}-${dealerRefreshCount}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          onClick={() => {
                            const carData = {
                              id: `market-price-${mpBrand}-${mpModel}-${i}`,
                              brand: mpBrand,
                              brandEn: mpBrand,
                              model: mpModel,
                              modelEn: mpModel,
                              year: parseInt(mpYear),
                              price: typeof item.price === 'number' ? item.price : getMarketPrices()?.avgPrice || 0,
                              monthlyPayment: Math.round((typeof item.price === 'number' ? item.price : getMarketPrices()?.avgPrice || 80000) / 48),
                              dealer: item.dealer,
                              dealerLocation: item.location,
                              condition: mpCondition,
                            };
                            openFinancingChatbot('', null, carData);
                          }}
                          className="p-4 bg-muted/30 rounded-xl hover:bg-emerald-500/10 transition-all cursor-pointer border border-transparent hover:border-emerald-500/50 hover:shadow-lg group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.verified ? 'bg-emerald-500/10' : 'bg-muted'}`}>
                                {item.verified ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Building2 className="w-5 h-5 text-muted-foreground" />}
                              </div>
                              <div>
                                <p className="font-semibold group-hover:text-emerald-600 transition-colors">{item.dealer}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant={item.status === 'new' ? 'default' : 'secondary'} className="text-xs">
                                    {item.status === 'new' ? (isRTL ? 'جديدة' : 'New') : (isRTL ? 'مستعملة' : 'Used')}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {item.location}
                                  </span>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Star className="w-3 h-3 text-amber-500" />
                                    {item.rating}
                                  </span>
                                  {'km' in item && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Gauge className="w-3 h-3" />
                                      {typeof item.km === 'number' ? item.km.toLocaleString() : item.km} {isRTL ? 'كم' : 'km'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-emerald-600">
                                {typeof item.price === 'number' ? item.price.toLocaleString() : item.price}
                              </p>
                              <p className="text-xs text-muted-foreground">{isRTL ? 'ريال' : 'SAR'}</p>
                              <p className="text-xs text-emerald-500 mt-1 flex items-center justify-end gap-1">
                                <Send className="w-3 h-3" />
                                {isRTL ? 'اطلب الآن' : 'Order Now'}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* زر تقديم عرض سعر جديد */}
                    <Button
                      className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl"
                      onClick={() => {
                        setMpBrand('');
                        setMpModel('');
                        setMpYear('2026');
                        setMpCondition('new');
                        setDealerRefreshCount(0);
                        toast({ title: isRTL ? '🔄 اختر ماركة وموديل جديد' : '🔄 Select a new brand and model' });
                      }}
                    >
                      <RefreshCw className={`w-5 h-5 text-blue-400 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {isRTL ? 'تقديم عرض سعر جديد' : 'Request New Price Quote'}
                    </Button>
                  </motion.div>
                ) : (
                  <div className="text-center py-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4"
                    >
                      <TrendingUp className="w-10 h-10 text-emerald-500" />
                    </motion.div>
                    <p className="text-muted-foreground">{isRTL ? 'اختر الماركة والموديل لعرض أسعار السوق' : 'Select brand and model to view market prices'}</p>
                  </div>
                )}
              </div>
            )}
            
            {/* ========== خدمة عروض السيارات ========== */}
            {selectedService === 'car-offers' && (
              <div className="space-y-6">
                {/* Premium Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 shadow-xl"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                  
                  <div className={`relative p-6 ${isRTL ? 'text-right direction-rtl' : 'text-left'}`}>
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <motion.div 
                          className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Car className="w-7 h-7 text-white drop-shadow-lg" />
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-black text-white drop-shadow-sm">
                            {isRTL ? 'عروض السيارات الحصرية' : 'Exclusive Car Offers'}
                          </h3>
                          <p className="text-sm text-white/80 mt-0.5">
                            {isRTL ? 'أفضل العروض على السيارات الجديدة والمستعملة' : 'Best offers on new and used cars'}
                          </p>
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span className="text-sm font-bold text-white">{isRTL ? '15 عرض' : '15 Offers'}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Featured Car - Toyota Camry */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="relative overflow-hidden border-2 border-cyan-500 bg-gradient-to-r from-cyan-500/5 to-teal-500/5">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500" />
                    <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'}`}>
                      <Badge className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0 shadow-lg">
                        <Star className="w-3 h-3 mr-1" />
                        {isRTL ? 'عرض مميز' : 'Featured'}
                      </Badge>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg">
                          <span className="text-3xl">🚗</span>
                        </div>
                        <div>
                          <CardTitle className="text-xl text-cyan-600">
                            {isRTL ? 'تويوتا كامري 2025' : 'Toyota Camry 2025'}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {isRTL ? 'عرض حصري من وكالة تويوتا السعودية' : 'Exclusive offer from Toyota Saudi Arabia'}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Key Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 bg-cyan-500/10 rounded-xl text-center">
                          <div className="text-2xl font-bold text-cyan-600">99,900</div>
                          <div className="text-xs text-muted-foreground">{isRTL ? 'السعر (ريال)' : 'Price (SAR)'}</div>
                        </div>
                        <div className="p-3 bg-green-500/10 rounded-xl text-center">
                          <div className="text-2xl font-bold text-green-600">15,000</div>
                          <div className="text-xs text-muted-foreground">{isRTL ? 'خصم مباشر' : 'Direct Discount'}</div>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-xl text-center">
                          <div className="text-2xl font-bold text-blue-600">0%</div>
                          <div className="text-xs text-muted-foreground">{isRTL ? 'فائدة التمويل' : 'Finance Rate'}</div>
                        </div>
                        <div className="p-3 bg-amber-500/10 rounded-xl text-center">
                          <div className="text-2xl font-bold text-amber-600">5 سنوات</div>
                          <div className="text-xs text-muted-foreground">{isRTL ? 'الضمان' : 'Warranty'}</div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-cyan-500/10 text-cyan-600 border-cyan-500/30">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {isRTL ? 'عرض محدود' : 'Limited Offer'}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">
                          <Zap className="w-3 h-3 mr-1" />
                          {isRTL ? 'توصيل مجاني' : 'Free Delivery'}
                        </Badge>
                        <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30">
                          <Shield className="w-3 h-3 mr-1" />
                          {isRTL ? 'ضمان شامل' : 'Full Warranty'}
                        </Badge>
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                          <Calendar className="w-3 h-3 mr-1" />
                          {isRTL ? 'صيانة مجانية' : 'Free Service'}
                        </Badge>
                      </div>

                      {/* Action */}
                      <Button 
                        className="w-full h-12 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white text-base font-bold shadow-lg"
                        onClick={() => {
                          // Create a car object for Toyota Camry
                          const carData = {
                            id: 'toyota-camry-2025-featured',
                            brand: 'Toyota',
                            brandEn: 'Toyota',
                            model: 'Camry',
                            modelEn: 'Camry',
                            year: 2025,
                            price: 99900,
                            monthlyPayment: 1800,
                          };
                          
                          openFinancingChatbot('', null, carData);
                        }}
                      >
                        <Send className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {isRTL ? 'احصل على العرض الآن' : 'Get This Offer Now'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Category Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {[
                    { id: 'all', label: isRTL ? 'الكل' : 'All' },
                    { id: 'new', label: isRTL ? 'جديدة' : 'New' },
                    { id: 'used', label: isRTL ? 'مستعملة' : 'Used' },
                    { id: 'suv', label: 'SUV' },
                    { id: 'sedan', label: isRTL ? 'سيدان' : 'Sedan' },
                  ].map(cat => (
                    <Button
                      key={cat.id}
                      variant="outline"
                      size="sm"
                      className="rounded-full whitespace-nowrap"
                    >
                      {cat.label}
                    </Button>
                  ))}
                </div>

                {/* Other Car Offers */}
                <div className="space-y-3">
                  <h4 className={`font-bold text-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? 'عروض سيارات أخرى' : 'Other Car Offers'}
                  </h4>
                  
                  {[
                    {
                      id: 1,
                      brand: isRTL ? 'هيونداي النترا' : 'Hyundai Elantra',
                      year: 2025,
                      price: 72000,
                      oldPrice: 85000,
                      discount: '15%',
                      features: [isRTL ? 'تمويل 0%' : '0% Finance', isRTL ? 'ضمان 5 سنوات' : '5 Year Warranty'],
                      color: 'from-blue-500 to-cyan-500',
                      emoji: '🚙'
                    },
                    {
                      id: 2,
                      brand: isRTL ? 'هوندا أكورد' : 'Honda Accord',
                      year: 2025,
                      price: 115000,
                      oldPrice: 130000,
                      discount: '12%',
                      features: [isRTL ? 'صيانة مجانية' : 'Free Service', isRTL ? 'توصيل مجاني' : 'Free Delivery'],
                      color: 'from-purple-500 to-violet-500',
                      emoji: '🚗'
                    },
                    {
                      id: 3,
                      brand: isRTL ? 'تويوتا لاندكروزر' : 'Toyota Land Cruiser',
                      year: 2025,
                      price: 285000,
                      oldPrice: 320000,
                      discount: '11%',
                      features: [isRTL ? 'عرض حصري' : 'Exclusive', isRTL ? 'هدايا مجانية' : 'Free Gifts'],
                      color: 'from-emerald-500 to-teal-500',
                      emoji: '🚙'
                    },
                    {
                      id: 4,
                      brand: isRTL ? 'نيسان باترول' : 'Nissan Patrol',
                      year: 2025,
                      price: 265000,
                      oldPrice: 295000,
                      discount: '10%',
                      features: [isRTL ? 'تمويل ميسر' : 'Easy Finance', isRTL ? 'ضمان ممتد' : 'Extended Warranty'],
                      color: 'from-orange-500 to-amber-500',
                      emoji: '🚗'
                    },
                    {
                      id: 5,
                      brand: isRTL ? 'كيا سيراتو' : 'Kia Cerato',
                      year: 2025,
                      price: 65000,
                      oldPrice: 78000,
                      discount: '17%',
                      features: [isRTL ? 'أقل دفعة' : 'Lowest Down', isRTL ? 'موافقة فورية' : 'Instant Approval'],
                      color: 'from-cyan-500 to-teal-500',
                      emoji: '🚙'
                    },
                    {
                      id: 6,
                      brand: isRTL ? 'مازدا 6' : 'Mazda 6',
                      year: 2025,
                      price: 98000,
                      oldPrice: 115000,
                      discount: '15%',
                      features: [isRTL ? 'تصميم رياضي' : 'Sport Design', isRTL ? 'أداء متميز' : 'Great Performance'],
                      color: 'from-slate-500 to-gray-500',
                      emoji: '🚗'
                    },
                  ].map((car, i) => (
                    <motion.div
                      key={car.id}
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                    >
                      <Card 
                        className="hover:shadow-lg transition-all duration-300 hover:border-primary/30 cursor-pointer"
                        onClick={() => {
                          // Create a car object for this offer
                          const carData = {
                            id: `car-offer-${car.id}`,
                            brand: car.brand,
                            brandEn: car.brand,
                            model: car.year.toString(),
                            modelEn: car.year.toString(),
                            year: car.year,
                            price: car.price,
                            monthlyPayment: Math.round(car.price / 48),
                          };
                          
                          openFinancingChatbot('', null, carData);
                        }}
                      >
                        <CardContent className="p-4">
                          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${car.color} flex items-center justify-center text-2xl`}>
                                {car.emoji}
                              </div>
                              <div className={isRTL ? 'text-right' : 'text-left'}>
                                <h5 className="font-bold">{car.brand} {car.year}</h5>
                                <div className={`flex items-center gap-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  <span className="text-cyan-600 font-bold">{car.price.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}</span>
                                  <span className="text-muted-foreground line-through">{car.oldPrice.toLocaleString()}</span>
                                  <Badge className="bg-cyan-500 text-white text-[10px] px-1.5">-{car.discount}</Badge>
                                </div>
                              </div>
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="hover:bg-cyan-500/5 hover:border-cyan-500/50"
                            >
                              {isRTL ? 'التفاصيل' : 'Details'}
                              <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
                            </Button>
                          </div>
                          
                          {/* Features */}
                          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t">
                            {car.features.map((feature, j) => (
                              <Badge key={j} variant="outline" className="text-xs bg-muted/30">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Used Cars Section */}
                <div className="space-y-3 pt-4">
                  <h4 className={`font-bold text-lg flex items-center gap-2 ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}`}>
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">{isRTL ? 'مستعملة' : 'Used'}</Badge>
                    {isRTL ? 'سيارات مستعملة موثوقة' : 'Certified Used Cars'}
                  </h4>
                  
                  {[
                    {
                      id: 1,
                      brand: isRTL ? 'تويوتا كامري' : 'Toyota Camry',
                      year: 2022,
                      price: 75000,
                      km: 35000,
                      condition: isRTL ? 'ممتازة' : 'Excellent',
                      emoji: '🚗'
                    },
                    {
                      id: 2,
                      brand: isRTL ? 'هيونداي توسان' : 'Hyundai Tucson',
                      year: 2023,
                      price: 82000,
                      km: 18000,
                      condition: isRTL ? 'ممتازة' : 'Excellent',
                      emoji: '🚙'
                    },
                    {
                      id: 3,
                      brand: isRTL ? 'هوندا CR-V' : 'Honda CR-V',
                      year: 2021,
                      price: 95000,
                      km: 45000,
                      condition: isRTL ? 'جيدة جداً' : 'Very Good',
                      emoji: '🚗'
                    },
                  ].map((car, i) => (
                    <motion.div
                      key={car.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      <Card 
                        className="hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-amber-500/20 cursor-pointer"
                        onClick={() => {
                          // Create a car object for this used car
                          const carData = {
                            id: `used-car-${car.id}`,
                            brand: car.brand,
                            brandEn: car.brand,
                            model: car.year.toString(),
                            modelEn: car.year.toString(),
                            year: car.year,
                            price: car.price,
                            monthlyPayment: Math.round(car.price / 48),
                            km: car.km,
                            condition: car.condition,
                          };
                          
                          openFinancingChatbot('', null, carData);
                        }}
                      >
                        <CardContent className="p-4">
                          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-2xl">
                                {car.emoji}
                              </div>
                              <div className={isRTL ? 'text-right' : 'text-left'}>
                                <h5 className="font-bold">{car.brand} {car.year}</h5>
                                <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  <span>{car.km.toLocaleString()} {isRTL ? 'كم' : 'km'}</span>
                                  <span>•</span>
                                  <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/30">{car.condition}</Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-amber-600">{car.price.toLocaleString()}</div>
                              <div className="text-[10px] text-muted-foreground">{isRTL ? 'ريال' : 'SAR'}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Note */}
                <div className={`p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Info className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-sm">{isRTL ? 'ملاحظة مهمة' : 'Important Note'}</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isRTL 
                          ? 'الأسعار المعروضة تقديرية وتخضع للشروط والأحكام. يُنصح بالتواصل مع الوكيل مباشرة للحصول على العرض النهائي.'
                          : 'Prices shown are estimates and subject to terms and conditions. We recommend contacting the dealer directly for the final offer.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* ========== خدمة العروض - تصميم جديد ========== */}
            {selectedService === 'offers' && (
              <div className="space-y-4">
                {/* ترحيب */}
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur-xl" />
                  <div className="relative p-5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-500/30">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                        <Sparkles className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{isRTL ? 'عروض حصرية' : 'Exclusive Offers'}</h4>
                        <p className="text-sm text-muted-foreground">{isRTL ? 'استفد من أحدث العروض والخصومات' : 'Take advantage of latest offers'}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* قائمة العروض */}
                <div className="grid gap-3">
                  {[
                    {
                      id: 1,
                      title: isRTL ? 'خصم 15% على صيانة السيارة' : '15% Off Car Maintenance',
                      description: isRTL ? 'خصم على جميع خدمات الصيانة في المراكز المعتمدة' : 'Discount on all maintenance services',
                      discount: '15%',
                      validUntil: isRTL ? 'ينتهي 30 ديسمبر 2024' : 'Until Dec 30, 2024',
                      code: 'MAINT15',
                      gradient: 'from-blue-500 to-cyan-500',
                      icon: Cog
                    },
                    {
                      id: 2,
                      title: isRTL ? 'عرض خاص على تأمين السيارة' : 'Special Insurance Offer',
                      description: isRTL ? 'وفر حتى 20% على تأمين سيارتك الجديدة' : 'Save up to 20% on new car insurance',
                      discount: '20%',
                      validUntil: isRTL ? 'ينتهي 15 يناير 2025' : 'Until Jan 15, 2025',
                      code: 'INSURE20',
                      gradient: 'from-green-500 to-emerald-500',
                      icon: Shield
                    },
                    {
                      id: 3,
                      title: isRTL ? 'غسيل وتنظيف مجاني' : 'Free Car Wash',
                      description: isRTL ? 'احصل على غسيل وتنظيف داخلي مجاني' : 'Get free interior and exterior wash',
                      discount: isRTL ? 'مجاني' : 'Free',
                      validUntil: isRTL ? 'ينتهي 31 ديسمبر 2024' : 'Until Dec 31, 2024',
                      code: 'WASH2024',
                      gradient: 'from-purple-500 to-pink-500',
                      icon: Sparkles
                    },
                    {
                      id: 4,
                      title: isRTL ? 'فحص مجاني للسيارة' : 'Free Car Inspection',
                      description: isRTL ? 'فحص شامل لسيارتك بالكامل' : 'Complete comprehensive car inspection',
                      discount: isRTL ? 'مجاني' : 'Free',
                      validUntil: isRTL ? 'ينتهي 15 فبراير 2025' : 'Until Feb 15, 2025',
                      code: 'CHECK25',
                      gradient: 'from-amber-500 to-orange-500',
                      icon: Car
                    }
                  ].map((offer, i) => {
                    const IconComp = offer.icon;
                    return (
                      <motion.div
                        key={offer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative overflow-hidden"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${offer.gradient} opacity-5 rounded-2xl`} />
                        <Card className="border-0 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all cursor-pointer">
                          <div className={`h-1 bg-gradient-to-r ${offer.gradient}`} />
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${offer.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                                <IconComp className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="font-bold">{offer.title}</h3>
                                  <Badge className={`bg-gradient-to-r ${offer.gradient} text-white`}>{offer.discount}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">{offer.description}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {offer.validUntil}
                                  </span>
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-xs rounded-lg"
                                      onClick={() => {
                                        navigator.clipboard.writeText(offer.code);
                                        toast({ title: isRTL ? '📋 تم نسخ الكود!' : '📋 Code Copied!', description: offer.code });
                                      }}
                                    >
                                      <Ticket className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                      {offer.code}
                                    </Button>
                                  </motion.div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* قسم إدخال كود الخصم */}
                <div className="p-5 bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-2xl border border-amber-500/20">
                  <div className="text-center mb-3">
                    <Ticket className="w-10 h-10 mx-auto text-amber-500 mb-2" />
                    <p className="font-semibold">{isRTL ? 'هل لديك كود خصم؟' : 'Have a discount code?'}</p>
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      placeholder={isRTL ? 'أدخل الكود هنا' : 'Enter code here'} 
                      className="text-center h-12 rounded-xl" 
                    />
                    <Button 
                      className="h-12 px-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl"
                      onClick={() => toast({ title: isRTL ? '✅ تم تطبيق الكود بنجاح!' : '✅ Code applied successfully!' })}
                    >
                      {isRTL ? 'تطبيق' : 'Apply'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* ========== خدمة الضمان الممتد - تصميم جديد ========== */}
            {selectedService === 'extended-warranty' && (
              <div className="space-y-4">
                {/* ترحيب */}
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-2xl blur-xl" />
                  <div className="relative p-5 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-2xl border border-teal-500/30">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg">
                        <Shield className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{isRTL ? 'حماية إضافية لسيارتك' : 'Extra Protection for Your Car'}</h4>
                        <p className="text-sm text-muted-foreground">{isRTL ? 'ضمان ممتد بعد انتهاء ضمان الوكيل' : 'Extended warranty after dealer warranty'}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* باقات الضمان */}
                <div className="grid gap-3">
                  {[
                    {
                      id: 'basic',
                      title: isRTL ? 'الباقة الأساسية' : 'Basic Package',
                      price: '1,500',
                      period: isRTL ? '/ سنة' : '/ year',
                      features: isRTL ? ['المحرك وناقل الحركة', 'نظام التبريد', 'الدعم الفني على مدار الساعة'] : ['Engine & Transmission', 'Cooling System', '24/7 Technical Support'],
                      gradient: 'from-gray-500 to-slate-500',
                      icon: Cog
                    },
                    {
                      id: 'advanced',
                      title: isRTL ? 'الباقة المتقدمة' : 'Advanced Package',
                      price: '2,500',
                      period: isRTL ? '/ سنة' : '/ year',
                      features: isRTL ? ['جميع مميزات الأساسية', 'نظام التعليق', 'نظام الفرامل', 'سيارة بديلة'] : ['All Basic Features', 'Suspension System', 'Brake System', 'Replacement Car'],
                      gradient: 'from-teal-500 to-cyan-500',
                      popular: true,
                      icon: Shield
                    },
                    {
                      id: 'premium',
                      title: isRTL ? 'الباقة الشاملة' : 'Premium Package',
                      price: '4,000',
                      period: isRTL ? '/ سنة' : '/ year',
                      features: isRTL ? ['جميع مميزات المتقدمة', 'نظام الكهرباء', 'التكييف', 'مساعدة على الطريق 24/7', 'سحب مجاني'] : ['All Advanced Features', 'Electrical System', 'AC System', '24/7 Roadside Assistance', 'Free Towing'],
                      gradient: 'from-amber-500 to-orange-500',
                      icon: Award
                    },
                  ].map((pkg, i) => {
                    const IconComp = pkg.icon;
                    return (
                      <motion.div
                        key={pkg.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Card className={`relative overflow-hidden ${pkg.popular ? 'border-2 border-teal-500' : ''}`}>
                          {pkg.popular && (
                            <div className="absolute -top-0 right-4 bg-teal-500 text-white text-xs px-3 py-1 rounded-b-lg">
                              {isRTL ? 'الأكثر طلباً' : 'Most Popular'}
                            </div>
                          )}
                          <div className={`h-1 bg-gradient-to-r ${pkg.gradient}`} />
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pkg.gradient} flex items-center justify-center shadow-lg`}>
                                  <IconComp className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-lg">{pkg.title}</h4>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold">{pkg.price}</p>
                                <p className="text-xs text-muted-foreground">{isRTL ? 'ريال' : 'SAR'}{pkg.period}</p>
                              </div>
                            </div>
                            <ul className="space-y-2 mb-4">
                              {pkg.features.map((feature, j) => (
                                <li key={j} className="flex items-center gap-2 text-sm">
                                  <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                className={`w-full h-12 rounded-xl ${pkg.popular ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white' : ''}`}
                                variant={pkg.popular ? 'default' : 'outline'}
                                onClick={() => toast({ title: isRTL ? `✅ تم اختيار ${pkg.title}` : `✅ ${pkg.title} Selected` })}
                              >
                                {isRTL ? 'اختيار الباقة' : 'Select Package'}
                              </Button>
                            </motion.div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* تواصل للعرض المخصص */}
                <div className="p-5 bg-gradient-to-r from-teal-500/5 to-cyan-500/5 rounded-2xl border border-teal-500/20 text-center">
                  <Phone className="w-8 h-8 mx-auto text-teal-500 mb-2" />
                  <p className="font-semibold">{isRTL ? 'هل تحتاج باقة مخصصة؟' : 'Need a custom package?'}</p>
                  <p className="text-sm text-muted-foreground mb-3">{isRTL ? 'تواصل معنا للحصول على عرض مخصص' : 'Contact us for a custom quote'}</p>
                  <Button variant="outline" className="rounded-xl">
                    {isRTL ? 'تواصل معنا' : 'Contact Us'}
                  </Button>
                </div>
              </div>
            )}

            {/* ========== خدمة الحسبة/التمويل - حاسبة التمويل ========== */}
            {selectedService === 'financing' && (
              <div className="space-y-6">
                {/* Calculator Card */}
                <Card className="overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl -translate-y-16 translate-x-16 pointer-events-none" />
                    
                    <CardHeader className="relative z-10">
                      <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg">
                          <Calculator className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-lg font-bold">{t.loanCalculator}</span>
                          <p className="text-xs text-muted-foreground font-normal">{t.salaryBasedCalc}</p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-5 relative z-10">
                      {/* Car Price Input */}
                      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                        <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <DollarSign className="w-5 h-5 text-amber-500" />
                          <Label className="font-semibold text-amber-600">{isRTL ? 'سعر السيارة' : 'Car Price'}</Label>
                        </div>
                        <div className="relative">
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder={isRTL ? 'أدخل سعر السيارة' : 'Enter car price'}
                            value={manualCarPrice || ''}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              const price = Number(value);
                              setManualCarPrice(price);
                              if (price > 0) {
                                calculateFinancing(price);
                              }
                            }}
                            className={`text-lg font-bold ${isRTL ? 'text-right pr-16' : 'text-left pl-16'} h-12 border-amber-500/30 focus:border-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                          />
                          <span className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground font-medium ${isRTL ? 'left-3' : 'right-3'}`}>
                            {isRTL ? 'ريال' : 'SAR'}
                          </span>
                        </div>
                      </div>

                      {/* Salary Input */}
                      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                        <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <DollarSign className="w-5 h-5 text-emerald-500" />
                          <Label className="font-semibold text-emerald-600">{t.monthlySalary}</Label>
                        </div>
                        <div className="relative">
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder={t.enterSalary}
                            value={financingParams.salary || ''}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              const salary = Number(value);
                              setFinancingParams({ salary });
                              if (salary > 0 && financingResult) {
                                const maxPayment = salary * 0.33;
                                const isEligible = financingResult.monthlyPayment <= maxPayment;
                                setSalaryEligibility({
                                  isEligible,
                                  maxMonthlyPayment: maxPayment,
                                  recommendedDownPayment: Math.max(20, Math.round((1 - (maxPayment * financingParams.loanTerm) / (manualCarPrice || 100000)) * 100)),
                                  debtToIncomeRatio: Math.round((financingResult.monthlyPayment / salary) * 100)
                                });
                              }
                            }}
                            className={`text-lg font-bold ${isRTL ? 'text-right pr-16' : 'text-left pl-16'} h-12 border-emerald-500/30 focus:border-emerald-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                          />
                          <span className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground font-medium ${isRTL ? 'left-3' : 'right-3'}`}>
                            {isRTL ? 'ريال' : 'SAR'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {t.salaryHint}
                        </p>
                      </div>

                      {/* Bank Selection */}
                      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
                        <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <Building2 className="w-5 h-5 text-blue-500" />
                          <Label className="font-semibold text-blue-600">{t.selectBank}</Label>
                        </div>
                        <select
                          value={financingParams.selectedBank || ''}
                          onChange={(e) => {
                            const bankId = e.target.value;
                            setFinancingParams({ selectedBank: bankId || null });
                            if (bankId) {
                              const selectedBank = bankOffers.find(b => b.id === bankId);
                              if (selectedBank) {
                                setFinancingParams({ 
                                  interestRate: selectedBank.interestRate,
                                  selectedBank: bankId 
                                });
                                calculateFinancing(manualCarPrice || 100000, { interestRate: selectedBank.interestRate });
                              }
                            }
                          }}
                          className={`w-full h-10 rounded-lg border border-blue-500/30 bg-background px-3 ${isRTL ? 'text-right' : 'text-left'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                        >
                          <option value="">{t.allBanks}</option>
                          {bankOffers.map(bank => (
                            <option key={bank.id} value={bank.id}>
                              {isRTL ? bank.bankName : bank.bankNameEn} - {bank.interestRate}%
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Eligibility Check Result */}
                      {salaryEligibility && financingParams.salary > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-xl border ${salaryEligibility.isEligible ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}
                        >
                          <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                            {salaryEligibility.isEligible ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-500" />
                            )}
                            <span className={`font-bold ${salaryEligibility.isEligible ? 'text-green-600' : 'text-red-600'}`}>
                              {salaryEligibility.isEligible ? t.eligible : t.notEligible}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className="text-muted-foreground">{t.maxMonthlyPayment}</span>
                              <span className="font-semibold">{getCurrencyDisplay()} {Math.round(salaryEligibility.maxMonthlyPayment).toLocaleString()}</span>
                            </div>
                            <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className="text-muted-foreground">{t.debtToIncomeRatio}</span>
                              <span className={`font-semibold ${salaryEligibility.debtToIncomeRatio > 33 ? 'text-red-500' : 'text-green-500'}`}>
                                {salaryEligibility.debtToIncomeRatio}%
                              </span>
                            </div>
                            <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className="text-muted-foreground">{t.recommendedDownPayment}</span>
                              <span className="font-semibold">{salaryEligibility.recommendedDownPayment}%</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <Separator />

                      {/* Down Payment Slider */}
                      <div>
                        <div className={`flex justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Label className="font-medium">{t.downPayment}</Label>
                          <span className="text-sm font-bold text-primary">{financingParams.downPayment}%</span>
                        </div>
                        <Slider
                          value={[financingParams.downPayment]}
                          onValueChange={([value]) => {
                            // Dynamic interest rate based on down payment
                            // Lower down payment = higher interest rate
                            const baseRate = 5.5;
                            const downPaymentFactor = (20 - value) * 0.05; // 0% down = +1%, 20% down = base rate
                            const newRate = Math.max(4.5, Math.min(7, baseRate + downPaymentFactor));
                            
                            setFinancingParams({ downPayment: value, interestRate: newRate });
                            calculateFinancing(manualCarPrice || 100000, { downPayment: value, interestRate: newRate });
                          }}
                          min={0}
                          max={50}
                          step={5}
                          className="py-2"
                        />
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          = {getCurrencyDisplay()} {Math.round((manualCarPrice || 100000) * financingParams.downPayment / 100).toLocaleString()}
                        </p>
                      </div>

                      {/* Loan Term Slider */}
                      <div>
                        <div className={`flex justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Label className="font-medium">{t.loanTerm}</Label>
                          <span className="text-sm font-bold text-primary">{financingParams.loanTerm} {t.months}</span>
                        </div>
                        <Slider
                          value={[financingParams.loanTerm]}
                          onValueChange={([value]) => {
                            // Dynamic interest rate based on loan term
                            // Longer term = higher interest rate
                            const baseRate = 5.5;
                            const termFactor = (value - 48) * 0.02; // 48 months = base, +0.02% per extra month
                            const downPaymentFactor = (20 - financingParams.downPayment) * 0.05;
                            const newRate = Math.max(4.5, Math.min(7, baseRate + termFactor + downPaymentFactor));
                            
                            setFinancingParams({ loanTerm: value, interestRate: newRate });
                            calculateFinancing(manualCarPrice || 100000, { loanTerm: value, interestRate: newRate });
                          }}
                          min={12}
                          max={84}
                          step={12}
                          className="py-2"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          = {financingParams.loanTerm / 12} {t.years}
                        </p>
                      </div>

                      {/* Interest Rate Slider */}
                      <div>
                        <div className={`flex justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Label className="font-medium">{t.interestRate}</Label>
                          <span className="text-sm font-bold text-primary">{financingParams.interestRate}%</span>
                        </div>
                        <Slider
                          value={[financingParams.interestRate]}
                          onValueChange={([value]) => {
                            setFinancingParams({ interestRate: value });
                            calculateFinancing(manualCarPrice || 100000, { interestRate: value });
                          }}
                          min={1}
                          max={15}
                          step={0.1}
                          className="py-2"
                        />
                      </div>

                      <Separator className="my-4" />

                      {/* Results */}
                      {financingResult && (
                        <div className="space-y-3">
                          <div className={`p-4 rounded-xl bg-gradient-to-r from-primary/10 to-cyan-500/10 border border-primary/20 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <div className="text-sm text-muted-foreground mb-1">{t.monthlyPayment}</div>
                            <div className="text-3xl font-bold text-primary">
                              {getCurrencyDisplay()} {Math.round(financingResult.monthlyPayment).toLocaleString()}
                            </div>
                            {financingParams.salary > 0 && (
                              <div className="mt-2 flex items-center gap-2">
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${salaryEligibility?.debtToIncomeRatio > 33 ? 'bg-red-500' : 'bg-green-500'}`}
                                    style={{ width: `${Math.min(100, (financingResult.monthlyPayment / financingParams.salary) * 100)}%` }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {Math.round((financingResult.monthlyPayment / financingParams.salary) * 100)}%
                                </span>
                              </div>
                            )}
                          </div>

                          <div className={`grid grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <div className="p-3 bg-muted/30 rounded-xl">
                              <p className="text-xs text-muted-foreground">{t.totalCost}</p>
                              <p className="font-bold text-lg">{getCurrencyDisplay()} {Math.round(financingResult.totalAmount || financingResult.totalPayment).toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-xl">
                              <p className="text-xs text-muted-foreground">{t.totalInterest}</p>
                              <p className="font-bold text-lg">{getCurrencyDisplay()} {Math.round(financingResult.totalInterest || 0).toLocaleString()}</p>
                            </div>
                          </div>

                          <Button 
                            className="w-full sky-gradient text-white"
                            onClick={() => openFinancingChatbot('', null)}
                          >
                            <Send className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {t.applyNow}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                {/* Bank Offers */}
                <Card className="overflow-hidden">
                  <div className="relative overflow-hidden rounded-t-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400 p-4">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                    
                    <div className={`relative ${isRTL ? 'text-right direction-rtl' : 'text-left'}`}>
                      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <Landmark className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-base font-black text-black drop-shadow-sm">
                              <span className="font-black">{t.bankOffers}</span>
                            </h3>
                            <span className="font-normal text-black/70 text-xs">{t.compareBanks}</span>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-white/40 backdrop-blur-sm border border-white/50">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-xs font-black text-black">{isRTL ? 'أفضل العروض' : 'Best Offers'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3 max-h-80 overflow-y-auto">
                    {bankOffers.slice(0, 4).map((bank, i) => {
                      // Fixed 48 months duration for Services section
                      const fixedTerm = 48;
                      const carPrice = manualCarPrice || 100000;
                      const downPaymentAmount = carPrice * (bank.minDownPayment / 100);
                      const financingAmount = carPrice - downPaymentAmount;
                      const monthlyRate = bank.interestRate / 100 / 12;
                      const monthlyPayment = financingAmount * (monthlyRate * Math.pow(1 + monthlyRate, fixedTerm)) / (Math.pow(1 + monthlyRate, fixedTerm) - 1);

                      return (
                        <motion.div
                          key={bank.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className={`p-3 rounded-xl border ${i === 0 ? 'border-2 border-primary bg-primary/5' : 'border'}`}
                        >
                          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${i === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-muted'}`}>
                                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                              </div>
                              <div className={isRTL ? 'text-right' : 'text-left'}>
                                <h4 className="font-bold text-sm">{isRTL ? bank.bankName : bank.bankNameEn}</h4>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{bank.interestRate}% {isRTL ? 'ربح سنوي' : t.annually}</span>
                                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                                  <span className="font-semibold text-primary">{fixedTerm} {isRTL ? 'شهر' : 'months'}</span>
                                </div>
                                <div className="text-xs text-emerald-600 font-medium mt-0.5">
                                  {isRTL ? 'قسط شهري:' : 'Monthly:'} {Math.round(monthlyPayment).toLocaleString()} {isRTL ? 'ريال' : 'SAR'}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openFinancingChatbot('', bank)}
                            >
                              {t.applyNow}
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Cars Within Budget Section - Show when salary is entered OR when financing is calculated */}
                {(salaryEligibility || financingResult) && (
                  <Card className="overflow-hidden">
                    <div className="relative overflow-hidden rounded-t-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 p-4">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                      <div className={`relative ${isRTL ? 'text-right direction-rtl' : 'text-left'}`}>
                        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                              <Car className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-base font-black text-black drop-shadow-sm">
                                <span className="font-black">{t.carsWithinBudget}</span>
                              </h3>
                              <span className="font-normal text-black/70 text-xs">
                                {salaryEligibility
                                  ? t.basedOnYourSalary
                                  : isRTL ? 'بناءً على القسط الشهري المحسوب' : 'Based on calculated monthly payment'}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setIsRefreshingBudgetCars(true);
                              setBudgetCarsOffset(prev => prev + 1);
                              setTimeout(() => setIsRefreshingBudgetCars(false), 500);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/40 backdrop-blur-sm border border-white/50 hover:bg-white/60 transition-all cursor-pointer"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isRefreshingBudgetCars ? 'animate-spin' : ''}`} />
                            <span className="text-xs font-black text-black">{isRTL ? 'تحديث' : 'Refresh'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      {(() => {
                        // Car categories: 1=economy, 2=compact, 3=mid-size, 4=full-size, 5=luxury
                        const allCars = [
                          // Economy Cars - Sedan
                          { brand: 'تويوتا', brandEn: 'Toyota', model: 'يارس', modelEn: 'Yaris', year: 2024, price: 58000, hp: 107, fuelConsumption: '5.5', engine: '1.5L', seats: 5, transmission: 'أوتوماتيك', category: 1 },
                          { brand: 'تويوتا', brandEn: 'Toyota', model: 'يارس سيدان', modelEn: 'Yaris Sedan', year: 2024, price: 62000, hp: 107, fuelConsumption: '5.4', engine: '1.5L', seats: 5, transmission: 'أوتوماتيك', category: 1 },
                          { brand: 'نيسان', brandEn: 'Nissan', model: 'صني', modelEn: 'Sunny', year: 2024, price: 55000, hp: 108, fuelConsumption: '5.8', engine: '1.6L', seats: 5, transmission: 'أوتوماتيك', category: 1 },
                          { brand: 'هيونداي', brandEn: 'Hyundai', model: 'أكسنت', modelEn: 'Accent', year: 2024, price: 62000, hp: 120, fuelConsumption: '5.4', engine: '1.4L', seats: 5, transmission: 'أوتوماتيك', category: 1 },
                          { brand: 'كيا', brandEn: 'Kia', model: 'بيكانتو', modelEn: 'Picanto', year: 2024, price: 52000, hp: 85, fuelConsumption: '5.0', engine: '1.0L', seats: 5, transmission: 'أوتوماتيك', category: 1 },
                          { brand: 'شيفروليه', brandEn: 'Chevrolet', model: 'سونيك', modelEn: 'Sonic', year: 2024, price: 57000, hp: 138, fuelConsumption: '5.9', engine: '1.4L', seats: 5, transmission: 'أوتوماتيك', category: 1 },
                          { brand: 'ميتسوبيشي', brandEn: 'Mitsubishi', model: 'ميراج', modelEn: 'Mirage', year: 2024, price: 48000, hp: 78, fuelConsumption: '4.8', engine: '1.2L', seats: 5, transmission: 'أوتوماتيك', category: 1 },
                          // Compact Cars
                          { brand: 'كيا', brandEn: 'Kia', model: 'ريو', modelEn: 'Rio', year: 2024, price: 65000, hp: 118, fuelConsumption: '5.6', engine: '1.4L', seats: 5, transmission: 'أوتوماتيك', category: 2 },
                          { brand: 'كيا', brandEn: 'Kia', model: 'سيراتو', modelEn: 'Cerato', year: 2024, price: 78000, hp: 147, fuelConsumption: '6.0', engine: '2.0L', seats: 5, transmission: 'أوتوماتيك', category: 2 },
                          { brand: 'هيونداي', brandEn: 'Hyundai', model: 'فيرونا', modelEn: 'Verna', year: 2024, price: 68000, hp: 123, fuelConsumption: '5.5', engine: '1.4L', seats: 5, transmission: 'أوتوماتيك', category: 2 },
                          { brand: 'شيفروليه', brandEn: 'Chevrolet', model: 'أفيو', modelEn: 'Aveo', year: 2024, price: 58000, hp: 115, fuelConsumption: '5.7', engine: '1.4L', seats: 5, transmission: 'أوتوماتيك', category: 2 },
                          // Mid-Size Cars
                          { brand: 'هيونداي', brandEn: 'Hyundai', model: 'إلنترا', modelEn: 'Elantra', year: 2024, price: 82000, hp: 147, fuelConsumption: '5.9', engine: '2.0L', seats: 5, transmission: 'أوتوماتيك', category: 3 },
                          { brand: 'تويوتا', brandEn: 'Toyota', model: 'كورولا', modelEn: 'Corolla', year: 2024, price: 85000, hp: 169, fuelConsumption: '5.2', engine: '2.0L', seats: 5, transmission: 'أوتوماتيك', category: 3 },
                          { brand: 'تويوتا', brandEn: 'Toyota', model: 'كورولا هايبرد', modelEn: 'Corolla Hybrid', year: 2024, price: 95000, hp: 134, fuelConsumption: '3.8', engine: '1.8L Hybrid', seats: 5, transmission: 'أوتوماتيك', category: 3 },
                          { brand: 'هوندا', brandEn: 'Honda', model: 'سيفيك', modelEn: 'Civic', year: 2024, price: 88000, hp: 158, fuelConsumption: '5.7', engine: '2.0L', seats: 5, transmission: 'أوتوماتيك', category: 3 },
                          { brand: 'فولكسفاغن', brandEn: 'Volkswagen', model: 'جيتا', modelEn: 'Jetta', year: 2024, price: 90000, hp: 158, fuelConsumption: '5.6', engine: '1.4L TSI', seats: 5, transmission: 'أوتوماتيك', category: 3 },
                          { brand: 'مازدا', brandEn: 'Mazda', model: 'مازدا 3', modelEn: 'Mazda3', year: 2024, price: 92000, hp: 155, fuelConsumption: '5.8', engine: '2.0L', seats: 5, transmission: 'أوتوماتيك', category: 3 },
                          { brand: 'فورد', brandEn: 'Ford', model: 'فيوجن', modelEn: 'Fusion', year: 2024, price: 94000, hp: 175, fuelConsumption: '6.5', engine: '2.5L', seats: 5, transmission: 'أوتوماتيك', category: 3 },
                          { brand: 'سكودا', brandEn: 'Skoda', model: 'أوكتافيا', modelEn: 'Octavia', year: 2024, price: 88000, hp: 148, fuelConsumption: '5.4', engine: '1.4L TSI', seats: 5, transmission: 'أوتوماتيك', category: 3 },
                          // Full-Size Cars
                          { brand: 'نيسان', brandEn: 'Nissan', model: 'التيما', modelEn: 'Altima', year: 2024, price: 98000, hp: 188, fuelConsumption: '6.2', engine: '2.5L', seats: 5, transmission: 'أوتوماتيك', category: 4 },
                          { brand: 'هيونداي', brandEn: 'Hyundai', model: 'سوناتا', modelEn: 'Sonata', year: 2024, price: 108000, hp: 191, fuelConsumption: '6.3', engine: '2.5L', seats: 5, transmission: 'أوتوماتيك', category: 4 },
                          { brand: 'هوندا', brandEn: 'Honda', model: 'أكورد', modelEn: 'Accord', year: 2024, price: 115000, hp: 192, fuelConsumption: '5.9', engine: '1.5L Turbo', seats: 5, transmission: 'أوتوماتيك', category: 4 },
                          { brand: 'كيا', brandEn: 'Kia', model: 'كي 5', modelEn: 'K5', year: 2024, price: 102000, hp: 180, fuelConsumption: '6.1', engine: '2.0L', seats: 5, transmission: 'أوتوماتيك', category: 4 },
                          { brand: 'فولكسفاغن', brandEn: 'Volkswagen', model: 'باسات', modelEn: 'Passat', year: 2024, price: 118000, hp: 174, fuelConsumption: '6.0', engine: '2.0L TSI', seats: 5, transmission: 'أوتوماتيك', category: 4 },
                          { brand: 'مازدا', brandEn: 'Mazda', model: 'مازدا 6', modelEn: 'Mazda6', year: 2024, price: 112000, hp: 187, fuelConsumption: '6.2', engine: '2.5L', seats: 5, transmission: 'أوتوماتيك', category: 4 },
                          // Luxury Cars
                          { brand: 'تويوتا', brandEn: 'Toyota', model: 'كامري', modelEn: 'Camry', year: 2024, price: 118000, hp: 206, fuelConsumption: '5.8', engine: '2.5L', seats: 5, transmission: 'أوتوماتيك', category: 5 },
                          { brand: 'تويوتا', brandEn: 'Toyota', model: 'كامري هايبرد', modelEn: 'Camry Hybrid', year: 2024, price: 132000, hp: 208, fuelConsumption: '4.2', engine: '2.5L Hybrid', seats: 5, transmission: 'أوتوماتيك', category: 5 },
                          { brand: 'نيسان', brandEn: 'Nissan', model: 'ماكسيما', modelEn: 'Maxima', year: 2024, price: 138000, hp: 300, fuelConsumption: '7.5', engine: '3.5L V6', seats: 5, transmission: 'أوتوماتيك', category: 5 },
                          // Small SUV / Crossover
                          { brand: 'تويوتا', brandEn: 'Toyota', model: 'راش', modelEn: 'Rush', year: 2024, price: 85000, hp: 105, fuelConsumption: '7.2', engine: '1.5L', seats: 7, transmission: 'أوتوماتيك', category: 3 },
                          { brand: 'هيونداي', brandEn: 'Hyundai', model: 'كريتا', modelEn: 'Creta', year: 2024, price: 88000, hp: 123, fuelConsumption: '6.8', engine: '1.6L', seats: 5, transmission: 'أوتوماتيك', category: 3 },
                          { brand: 'كيا', brandEn: 'Kia', model: 'سلتوس', modelEn: 'Seltos', year: 2024, price: 92000, hp: 147, fuelConsumption: '6.5', engine: '2.0L', seats: 5, transmission: 'أوتوماتيك', category: 3 },
                          { brand: 'نيسان', brandEn: 'Nissan', model: 'كيكس', modelEn: 'Kicks', year: 2024, price: 78000, hp: 147, fuelConsumption: '6.2', engine: '1.6L', seats: 5, transmission: 'أوتوماتيك', category: 3 },
                          { brand: 'هوندا', brandEn: 'Honda', model: 'إتش آر في', modelEn: 'HR-V', year: 2024, price: 98000, hp: 141, fuelConsumption: '6.0', engine: '1.8L', seats: 5, transmission: 'أوتوماتيك', category: 3 },
                          { brand: 'مازدا', brandEn: 'Mazda', model: 'سي اكس 30', modelEn: 'CX-30', year: 2024, price: 98000, hp: 155, fuelConsumption: '6.4', engine: '2.0L', seats: 5, transmission: 'أوتوماتيك', category: 3 },
                          { brand: 'ميتسوبيشي', brandEn: 'Mitsubishi', model: 'إكس فورس', modelEn: 'Xforce', year: 2024, price: 82000, hp: 103, fuelConsumption: '6.8', engine: '1.5L', seats: 5, transmission: 'أوتوماتيك', category: 3 },
                          { brand: 'شيفروليه', brandEn: 'Chevrolet', model: 'تريلبليزر', modelEn: 'Trailblazer', year: 2024, price: 88000, hp: 137, fuelConsumption: '6.5', engine: '1.2L Turbo', seats: 5, transmission: 'أوتوماتيك', category: 3 },
                          // Mid-Size SUV
                          { brand: 'كيا', brandEn: 'Kia', model: 'سبورتاج', modelEn: 'Sportage', year: 2024, price: 105000, hp: 187, fuelConsumption: '7.5', engine: '2.0L', seats: 5, transmission: 'أوتوماتيك', category: 4 },
                          { brand: 'نيسان', brandEn: 'Nissan', model: 'اكس تريل', modelEn: 'X-Trail', year: 2024, price: 115000, hp: 188, fuelConsumption: '7.8', engine: '2.5L', seats: 7, transmission: 'أوتوماتيك', category: 4 },
                          { brand: 'هوندا', brandEn: 'Honda', model: 'سي آر في', modelEn: 'CR-V', year: 2024, price: 125000, hp: 190, fuelConsumption: '7.2', engine: '1.5L Turbo', seats: 5, transmission: 'أوتوماتيك', category: 4 },
                          { brand: 'تويوتا', brandEn: 'Toyota', model: 'راف 4', modelEn: 'RAV4', year: 2024, price: 135000, hp: 203, fuelConsumption: '7.0', engine: '2.5L', seats: 5, transmission: 'أوتوماتيك', category: 5 },
                          { brand: 'مازدا', brandEn: 'Mazda', model: 'سي اكس 5', modelEn: 'CX-5', year: 2024, price: 118000, hp: 187, fuelConsumption: '7.1', engine: '2.5L', seats: 5, transmission: 'أوتوماتيك', category: 4 },
                          { brand: 'هيونداي', brandEn: 'Hyundai', model: 'توسان', modelEn: 'Tucson', year: 2024, price: 108000, hp: 187, fuelConsumption: '7.2', engine: '2.0L', seats: 5, transmission: 'أوتوماتيك', category: 4 },
                          { brand: 'فورد', brandEn: 'Ford', model: 'إيسكيب', modelEn: 'Escape', year: 2024, price: 118000, hp: 180, fuelConsumption: '7.0', engine: '1.5L EcoBoost', seats: 5, transmission: 'أوتوماتيك', category: 4 },
                          { brand: 'شيفروليه', brandEn: 'Chevrolet', model: 'إيكوينوكس', modelEn: 'Equinox', year: 2024, price: 115000, hp: 170, fuelConsumption: '7.3', engine: '1.5L Turbo', seats: 5, transmission: 'أوتوماتيك', category: 4 },
                          { brand: 'فولكسفاغن', brandEn: 'Volkswagen', model: 'تيغوان', modelEn: 'Tiguan', year: 2024, price: 122000, hp: 184, fuelConsumption: '7.0', engine: '2.0L TSI', seats: 5, transmission: 'أوتوماتيك', category: 4 },
                          { brand: 'ميتسوبيشي', brandEn: 'Mitsubishi', model: 'أوت لاندر', modelEn: 'Outlander', year: 2024, price: 108000, hp: 181, fuelConsumption: '7.4', engine: '2.5L', seats: 7, transmission: 'أوتوماتيك', category: 4 },
                          // Large SUV
                          { brand: 'تويوتا', brandEn: 'Toyota', model: 'هايلاندر', modelEn: 'Highlander', year: 2024, price: 168000, hp: 295, fuelConsumption: '8.5', engine: '3.5L V6', seats: 7, transmission: 'أوتوماتيك', category: 5 },
                          { brand: 'هيونداي', brandEn: 'Hyundai', model: 'سانتافي', modelEn: 'Santa Fe', year: 2024, price: 148000, hp: 277, fuelConsumption: '8.2', engine: '2.5L Turbo', seats: 7, transmission: 'أوتوماتيك', category: 5 },
                          { brand: 'كيا', brandEn: 'Kia', model: 'سورينتو', modelEn: 'Sorento', year: 2024, price: 138000, hp: 277, fuelConsumption: '8.0', engine: '2.5L Turbo', seats: 7, transmission: 'أوتوماتيك', category: 5 },
                          { brand: 'فورد', brandEn: 'Ford', model: 'إكسبلورر', modelEn: 'Explorer', year: 2024, price: 175000, hp: 300, fuelConsumption: '9.0', engine: '2.3L EcoBoost', seats: 7, transmission: 'أوتوماتيك', category: 5 },
                          { brand: 'نيسان', brandEn: 'Nissan', model: 'باثفايندر', modelEn: 'Pathfinder', year: 2024, price: 158000, hp: 284, fuelConsumption: '8.8', engine: '3.5L V6', seats: 7, transmission: 'أوتوماتيك', category: 5 },
                          { brand: 'شيفروليه', brandEn: 'Chevrolet', model: 'ترافيرس', modelEn: 'Traverse', year: 2024, price: 155000, hp: 310, fuelConsumption: '9.2', engine: '3.6L V6', seats: 7, transmission: 'أوتوماتيك', category: 5 },
                          { brand: 'هوندا', brandEn: 'Honda', model: 'بايلوت', modelEn: 'Pilot', year: 2024, price: 172000, hp: 280, fuelConsumption: '8.7', engine: '3.5L V6', seats: 7, transmission: 'أوتوماتيك', category: 5 },
                          { brand: 'مازدا', brandEn: 'Mazda', model: 'سي اكس 9', modelEn: 'CX-9', year: 2024, price: 158000, hp: 250, fuelConsumption: '8.4', engine: '2.5L Turbo', seats: 7, transmission: 'أوتوماتيك', category: 5 },
                          // Pickup Trucks
                          { brand: 'تويوتا', brandEn: 'Toyota', model: 'هيلوكس', modelEn: 'Hilux', year: 2024, price: 115000, hp: 164, fuelConsumption: '8.5', engine: '2.8L Diesel', seats: 5, transmission: 'أوتوماتيك', category: 4 },
                          { brand: 'فورد', brandEn: 'Ford', model: 'رينجر', modelEn: 'Ranger', year: 2024, price: 128000, hp: 197, fuelConsumption: '8.2', engine: '2.0L Diesel', seats: 5, transmission: 'أوتوماتيك', category: 4 },
                          { brand: 'نيسان', brandEn: 'Nissan', model: 'نافارا', modelEn: 'Navara', year: 2024, price: 118000, hp: 188, fuelConsumption: '8.0', engine: '2.3L Diesel', seats: 5, transmission: 'أوتوماتيك', category: 4 },
                          { brand: 'شيفروليه', brandEn: 'Chevrolet', model: 'سيلفرادو', modelEn: 'Silverado', year: 2024, price: 198000, hp: 355, fuelConsumption: '11.0', engine: '5.3L V8', seats: 5, transmission: 'أوتوماتيك', category: 5 },
                          // MPV / Minivan
                          { brand: 'تويوتا', brandEn: 'Toyota', model: 'إنوفا', modelEn: 'Innova', year: 2024, price: 128000, hp: 164, fuelConsumption: '8.0', engine: '2.8L Diesel', seats: 7, transmission: 'أوتوماتيك', category: 4 },
                          { brand: 'كيا', brandEn: 'Kia', model: 'كارنفال', modelEn: 'Carnival', year: 2024, price: 148000, hp: 277, fuelConsumption: '8.5', engine: '2.5L Turbo', seats: 8, transmission: 'أوتوماتيك', category: 5 },
                          { brand: 'هيونداي', brandEn: 'Hyundai', model: 'ستاركس', modelEn: 'Starex', year: 2024, price: 118000, hp: 168, fuelConsumption: '8.8', engine: '2.5L Diesel', seats: 9, transmission: 'أوتوماتيك', category: 4 },
                        ];

                        const calculateCarPayment = (price: number) => {
                          const principal = price * (1 - financingParams.downPayment / 100);
                          const monthlyRate = financingParams.interestRate / 100 / 12;
                          const numPayments = financingParams.loanTerm;
                          const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
                          return payment;
                        };

                        // Determine budget based on salary or current financing calculation
                        const budgetPayment = salaryEligibility?.maxMonthlyPayment || (financingResult?.monthlyPayment || 0);

                        // Calculate all cars with payments
                        const carsWithPayments = allCars
                          .map(car => ({
                            ...car,
                            monthlyPayment: calculateCarPayment(car.price),
                            isWithinBudget: calculateCarPayment(car.price) <= budgetPayment,
                          }));

                        // Affordable cars (within budget) - show ALL cars within the budget range
                        // Sort by payment descending to show the best value cars first
                        const affordableCars = carsWithPayments
                          .filter(car => car.isWithinBudget)
                          .sort((a, b) => b.monthlyPayment - a.monthlyPayment);

                        if (affordableCars.length === 0) {
                          return (
                            <div className="text-center py-6 px-3 rounded-xl bg-muted/20 border border-dashed border-muted-foreground/30">
                              <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-xs font-medium">{t.noAffordableCars}</p>
                              <p className="text-[10px] text-muted-foreground mt-1">{t.increaseDownPayment}</p>
                              <p className="text-[10px] text-muted-foreground mt-1">
                                {isRTL
                                                  ? `الميزانية الحالية: ${Math.round(budgetPayment).toLocaleString()} ريال/شهر`
                                                  : `Current budget: ${Math.round(budgetPayment).toLocaleString()} SAR/month`}
                              </p>
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-2">
                            {/* Summary Header */}
                            <div className={`flex items-center justify-between p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                  <Car className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div className={isRTL ? 'text-right' : 'text-left'}>
                                  <span className="font-bold text-emerald-600 text-lg">{affordableCars.length}</span>
                                  <span className="text-xs text-muted-foreground mr-1"> {isRTL ? 'سيارة متاحة' : 'cars available'}</span>
                                </div>
                              </div>
                              <div className={`text-xs ${isRTL ? 'text-right' : 'text-left'}`}>
                                <span className="text-muted-foreground">{isRTL ? 'الحد الأقصى:' : 'Max:'}</span>
                                <span className="font-bold text-primary mr-1"> {getCurrencyDisplay()} {Math.round(budgetPayment).toLocaleString()}</span>
                                <span className="text-muted-foreground text-[9px]">{isRTL ? '/شهر' : '/mo'}</span>
                              </div>
                            </div>

                            {/* Cars List - Scrollable */}
                            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                              {affordableCars.map((car, i) => (
                                <motion.div
                                  key={`${car.brand}-${car.model}-${budgetCarsOffset}`}
                                  initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.03 }}
                                  onClick={() => {
                                    // Transform car data for chatbot
                                    const carForChatbot = {
                                      brand: isRTL ? car.brand : car.brandEn,
                                      brandEn: car.brandEn,
                                      model: isRTL ? car.model : car.modelEn,
                                      modelEn: car.modelEn,
                                      year: car.year,
                                      price: car.price,
                                      monthlyPayment: car.monthlyPayment,
                                      hp: car.hp,
                                      seats: car.seats,
                                    };
                                    openFinancingChatbot('', null, carForChatbot);
                                  }}
                                  className={`p-3 rounded-xl border ${i === 0 ? 'border-amber-500/50 bg-amber-500/5' : 'border-border bg-muted/30'} hover:border-primary/50 transition-colors cursor-pointer ${isRTL ? 'flex-row-reverse' : ''} flex items-center justify-between gap-3`}
                                >
                                  {/* Rank */}
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${i === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : i < 3 ? 'bg-emerald-500/20 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                                  </div>

                                  {/* Car Info */}
                                  <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                                    <div className="font-semibold text-sm truncate">
                                      {isRTL ? car.brand : car.brandEn} {isRTL ? car.model : car.modelEn}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                      <span>{car.year}</span>
                                      <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground"></span>
                                      <span>{getCurrencyDisplay()} {car.price.toLocaleString()}</span>
                                      <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground"></span>
                                      <span>{car.hp} {isRTL ? 'حصان' : 'hp'}</span>
                                    </div>
                                  </div>

                                  {/* Payment */}
                                  <div className={`flex-shrink-0 ${isRTL ? 'text-left' : 'text-right'}`}>
                                    <div className="font-bold text-sm text-emerald-600">
                                      {getCurrencyDisplay()} {Math.round(car.monthlyPayment).toLocaleString()}
                                    </div>
                                    <div className="text-[9px] text-muted-foreground text-center">{isRTL ? 'شهرياً' : 'monthly'}</div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>

                            {/* Footer Summary */}
                            <div className={`flex items-center justify-between pt-2 border-t text-[10px] text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                {isRTL ? `جميع السيارات المتاحة (${affordableCars.length})` : `All available cars (${affordableCars.length})`}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                {isRTL ? 'الأفضل لميزانيتك' : 'Best for your budget'}
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            
            {/* ========== خدمة عروض التمويل من البنوك السعودية ========== */}
            {selectedService === 'bank-offers' && (
              <div className="space-y-6">
                {/* Premium Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 shadow-xl"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                  
                  <div className={`relative p-6 ${isRTL ? 'text-right direction-rtl' : 'text-left'}`}>
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <motion.div 
                          className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Landmark className="w-7 h-7 text-white drop-shadow-lg" />
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-black text-white drop-shadow-sm">
                            {isRTL ? 'عروض التمويل من البنوك السعودية' : 'Saudi Banks Financing Offers'}
                          </h3>
                          <p className="text-sm text-white/80 mt-0.5">
                            {isRTL ? 'قارن أفضل عروض التمويل من البنوك السعودية' : 'Compare the best financing offers from Saudi banks'}
                          </p>
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span className="text-sm font-bold text-white">{isRTL ? '8 بنوك' : '8 Banks'}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Al Rajhi Bank - Featured */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="relative overflow-hidden border-2 border-green-500 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />
                    <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'}`}>
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                        <Star className="w-3 h-3 mr-1" />
                        {isRTL ? 'الأفضل' : 'Best Offer'}
                      </Badge>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                          <span className="text-3xl">🏦</span>
                        </div>
                        <div>
                          <CardTitle className="text-xl text-green-600">
                            {isRTL ? 'بنك الراجحي' : 'Al Rajhi Bank'}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {isRTL ? 'أقل نسبة ربح في السوق السعودي' : 'Lowest profit rate in Saudi market'}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Key Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 bg-green-500/10 rounded-xl text-center">
                          <div className="text-2xl font-bold text-green-600">4.75%</div>
                          <div className="text-xs text-muted-foreground">{isRTL ? 'نسبة الربح السنوية' : 'Annual Profit Rate'}</div>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-xl text-center">
                          <div className="text-2xl font-bold text-blue-600">10%</div>
                          <div className="text-xs text-muted-foreground">{isRTL ? 'أقل دفعة مقدمة' : 'Min Down Payment'}</div>
                        </div>
                        <div className="p-3 bg-purple-500/10 rounded-xl text-center">
                          <div className="text-2xl font-bold text-purple-600">60</div>
                          <div className="text-xs text-muted-foreground">{isRTL ? 'شهر كحد أقصى' : 'Max Months'}</div>
                        </div>
                        <div className="p-3 bg-amber-500/10 rounded-xl text-center">
                          <div className="text-2xl font-bold text-amber-600">3,000</div>
                          <div className="text-xs text-muted-foreground">{isRTL ? 'الحد الأدنى للراتب' : 'Min Salary'}</div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {isRTL ? 'أقل نسبة ربح' : 'Lowest Profit Rate'}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">
                          <Zap className="w-3 h-3 mr-1" />
                          {isRTL ? 'موافقة سريعة' : 'Fast Approval'}
                        </Badge>
                        <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30">
                          <Calendar className="w-3 h-3 mr-1" />
                          {isRTL ? 'تأجيل قسط' : 'Payment Deferment'}
                        </Badge>
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                          <Shield className="w-3 h-3 mr-1" />
                          {isRTL ? 'تمويل إسلامي' : 'Islamic Finance'}
                        </Badge>
                      </div>

                      {/* Action */}
                      <Button 
                        className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-base font-bold shadow-lg"
                        onClick={() => openFinancingChatbot('', bankOffers.find(b => b.id === 'alrajhi'))}
                      >
                        <Send className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {isRTL ? 'قدم طلبك الآن في بنك الراجحي' : 'Apply Now at Al Rajhi Bank'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Other Banks */}
                <div className="space-y-3">
                  <h4 className={`font-bold text-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? 'بنوك أخرى متاحة' : 'Other Available Banks'}
                  </h4>
                  
                  {bankOffers.filter(b => b.id !== 'alrajhi').map((bank, i) => (
                    <motion.div
                      key={bank.id}
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/30">
                        <CardContent className="p-4">
                          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center text-2xl">
                                {bank.logo || '🏦'}
                              </div>
                              <div className={isRTL ? 'text-right' : 'text-left'}>
                                <h5 className="font-bold">{isRTL ? bank.bankName : bank.bankNameEn}</h5>
                                <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  <span className="text-green-600 font-medium">{bank.interestRate}%</span>
                                  <span>•</span>
                                  <span>{isRTL ? 'حتى' : 'up to'} {bank.maxLoanTerm} {isRTL ? 'شهر' : 'months'}</span>
                                  <span>•</span>
                                  <span>{bank.minDownPayment}% {isRTL ? 'دفعة' : 'down'}</span>
                                </div>
                              </div>
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="hover:bg-primary/5 hover:border-primary/50"
                              onClick={() => openFinancingChatbot('', bank)}
                            >
                              {isRTL ? 'تقديم' : 'Apply'}
                              <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
                            </Button>
                          </div>
                          
                          {/* Features */}
                          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t">
                            {bank.features?.map((feature: string, j: number) => (
                              <Badge key={j} variant="outline" className="text-xs bg-muted/30">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Comparison Note */}
                <div className={`p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-sm">{isRTL ? 'ملاحظة مهمة' : 'Important Note'}</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isRTL 
                          ? 'الأسعار المعروضة هي تقديرية وقد تختلف حسب سياسات البنك والشروط والأحكام. يُنصح بالتواصل مع البنك مباشرة للحصول على العرض النهائي.'
                          : 'The rates shown are estimates and may vary based on bank policies and terms. We recommend contacting the bank directly for the final offer.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {selectedService === 'maintenance' && (
              <div className="space-y-4">
                <div className={`p-4 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-xl border border-orange-500/30 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <h4 className="font-bold text-lg mb-1">{isRTL ? 'جدول الصيانة' : 'Maintenance Schedule'}</h4>
                  <p className="text-sm text-muted-foreground">{isRTL ? 'جدول صيانة سيارتك وتذكيرات الخدمة' : 'Your car maintenance schedule and service reminders'}</p>
                </div>

                {/* Current Mileage Input */}
                <div className="p-4 bg-muted/30 rounded-xl">
                  <Label className="font-semibold">{isRTL ? 'الممشى الحالي (كم)' : 'Current Mileage (km)'}</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="number"
                      placeholder={isRTL ? "مثال: 45000" : "e.g., 45000"}
                      className="text-lg font-bold h-12"
                      value={carMileage || ''}
                      onChange={(e) => setCarMileage(parseInt(e.target.value) || 0)}
                    />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">{isRTL ? 'كم' : 'km'}</span>
                  </div>
                </div>

                {/* Maintenance Schedule */}
                <div className="space-y-3">
                  {[
                    { km: 5000, title: isRTL ? 'الصيانة الأولى' : 'First Service', items: isRTL ? ['تغيير الزيت', 'فحص السوائل', 'فحص الإطارات'] : ['Oil Change', 'Fluid Check', 'Tire Inspection'] },
                    { km: 10000, title: isRTL ? 'الصيانة الثانية' : 'Second Service', items: isRTL ? ['تغيير الزيت', 'تغيير فلتر الهواء', 'فحص الفرامل'] : ['Oil Change', 'Air Filter', 'Brake Check'] },
                    { km: 20000, title: isRTL ? 'الصيانة الكبرى' : 'Major Service', items: isRTL ? ['جميع الخدمات السابقة', 'تغيير سائل الفرامل', 'فحص التعليق'] : ['All Previous Services', 'Brake Fluid', 'Suspension Check'] },
                    { km: 40000, title: isRTL ? 'الصيانة الشاملة' : 'Full Service', items: isRTL ? ['صيانة شاملة', 'تغيير جميع السوائل', 'فحص الأمان'] : ['Full Maintenance', 'All Fluids Change', 'Safety Check'] },
                  ].map((service, i) => {
                    const isPast = carMileage >= service.km;
                    const isNext = carMileage < service.km && (i === 0 || carMileage >= [5000, 10000, 20000, 40000][i - 1]);
                    const remaining = service.km - carMileage;

                    return (
                      <Card key={i} className={`${isNext ? 'border-orange-500 border-2 bg-orange-500/5' : ''} ${isPast ? 'opacity-60' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isPast ? 'bg-green-500/20' : isNext ? 'bg-orange-500/20' : 'bg-muted'}`}>
                              {isPast ? (
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                              ) : isNext ? (
                                <Clock className="w-6 h-6 text-orange-500" />
                              ) : (
                                <span className="font-bold text-muted-foreground">{service.km / 1000}K</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold">{service.title}</h4>
                                  <p className="text-xs text-muted-foreground">{service.km.toLocaleString()} {isRTL ? 'كم' : 'km'}</p>
                                </div>
                                {isNext && (
                                  <Badge className="bg-orange-500 text-white">
                                    {isRTL ? `${remaining.toLocaleString()} كم متبقي` : `${remaining.toLocaleString()} km left`}
                                  </Badge>
                                )}
                                {isPast && (
                                  <Badge variant="outline" className="text-green-500 border-green-500">
                                    {isRTL ? 'تم' : 'Done'}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {service.items.map((item, j) => (
                                  <span key={j} className="text-xs bg-muted px-2 py-1 rounded-full">{item}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Schedule Service Button */}
                <Button
                  className="w-full sky-gradient text-white h-12"
                  onClick={() => {
                    toast({
                      title: isRTL ? 'تم حجز موعد الصيانة' : 'Maintenance Appointment Scheduled',
                      description: isRTL ? 'سيتم التواصل معك لتأكيد الموعد' : 'You will be contacted to confirm the appointment'
                    });
                  }}
                >
                  <Calendar className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? 'حجز موعد صيانة' : 'Schedule Maintenance'}
                </Button>
              </div>
            )}
            
            {selectedService === 'valuation' && (
              <div className="space-y-4">
                <div className={`p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/30 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <h4 className="font-bold text-lg mb-1">{isRTL ? 'تقييم السيارة' : 'Car Valuation'}</h4>
                  <p className="text-sm text-muted-foreground">{isRTL ? 'احصل على تقييم تقديري لسيارتك في السوق' : 'Get an estimated valuation for your car in the market'}</p>
                </div>

                {!showValuation ? (
                  <>
                    {/* Valuation Form */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="font-semibold">{isRTL ? 'الماركة' : 'Brand'}</Label>
                          <select
                            className="w-full h-10 rounded-md border bg-background px-3"
                            value={valBrand}
                            onChange={(e) => {
                              setValBrand(e.target.value);
                              setValModel(''); // Reset model when brand changes
                            }}
                          >
                            <option value="">{isRTL ? 'اختر الماركة' : 'Select Brand'}</option>
                            {Object.keys(carModelsByBrand).map(brand => (
                              <option key={brand} value={brand}>{brand}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label className="font-semibold">{isRTL ? 'الموديل' : 'Model'}</Label>
                          <select
                            className="w-full h-10 rounded-md border bg-background px-3 disabled:opacity-50"
                            value={valModel}
                            onChange={(e) => setValModel(e.target.value)}
                            disabled={!valBrand}
                          >
                            <option value="">{isRTL ? 'اختر الموديل' : 'Select Model'}</option>
                            {valBrand && carModelsByBrand[valBrand]?.map(model => (
                              <option key={model} value={model}>{model}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label className="font-semibold">{isRTL ? 'السنة' : 'Year'}</Label>
                          <select className="w-full h-10 rounded-md border bg-background px-3" value={valYear} onChange={(e) => setValYear(parseInt(e.target.value))}>
                            {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016].map(y => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label className="font-semibold">{isRTL ? 'الممشى (كم)' : 'Mileage (km)'}</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={valMileage || ''}
                            onChange={(e) => setValMileage(parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label className="font-semibold">{isRTL ? 'الحالة' : 'Condition'}</Label>
                          <select className="w-full h-10 rounded-md border bg-background px-3" value={valCondition} onChange={(e) => setValCondition(e.target.value as any)}>
                            <option value="excellent">{isRTL ? 'ممتازة' : 'Excellent'}</option>
                            <option value="good">{isRTL ? 'جيدة' : 'Good'}</option>
                            <option value="fair">{isRTL ? 'مقبولة' : 'Fair'}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full sky-gradient text-white h-12"
                      onClick={() => setShowValuation(true)}
                      disabled={!valBrand || !valModel}
                    >
                      <DollarSign className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {isRTL ? 'تقييم السيارة' : 'Value Car'}
                    </Button>
                  </>
                ) : (
                  /* Valuation Results */
                  <div className="space-y-4">
                    {(() => {
                      const valuation = calculateValuation();
                      if (!valuation) return null;
                      return (
                        <>
                          {/* Estimated Value Card */}
                          <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/30 text-center">
                            <p className="text-sm text-muted-foreground mb-2">{isRTL ? 'القيمة التقديرية' : 'Estimated Value'}</p>
                            <p className="text-4xl font-bold text-purple-600">
                              {valuation.lowRange.toLocaleString()} - {valuation.highRange.toLocaleString()}
                            </p>
                            <p className="text-lg text-muted-foreground">{isRTL ? 'ريال سعودي' : 'SAR'}</p>
                          </div>

                          {/* Value Breakdown */}
                          <div className="space-y-2">
                            <h5 className="font-semibold">{isRTL ? 'تفاصيل التقييم' : 'Valuation Details'}</h5>
                            <div className={`p-3 bg-muted/50 rounded-lg flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className="text-sm text-muted-foreground">{isRTL ? 'القيمة السوقية' : 'Market Value'}</span>
                              <span className="font-bold text-blue-600">{valuation.marketValue.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}</span>
                            </div>
                            <div className={`p-3 bg-muted/50 rounded-lg flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className="text-sm text-muted-foreground">{isRTL ? 'قيمة الوكيل' : 'Dealer Value'}</span>
                              <span className="font-bold text-green-600">{valuation.dealerValue.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}</span>
                            </div>
                            <div className={`p-3 bg-muted/50 rounded-lg flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className="text-sm text-muted-foreground">{isRTL ? 'قيمة البيع المباشر' : 'Private Sale'}</span>
                              <span className="font-bold text-purple-600">{valuation.privateSaleValue.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}</span>
                            </div>
                          </div>

                          {/* Factors */}
                          <div className={`p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <h5 className="font-semibold text-sm mb-2">{isRTL ? 'العوامل المؤثرة' : 'Value Factors'}</h5>
                            <div className="space-y-2 text-sm">
                              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>{isRTL ? `الماركة: ${valBrand}` : `Brand: ${valBrand}`}</span>
                              </div>
                              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>{isRTL ? `الموديل: ${valModel}` : `Model: ${valModel}`}</span>
                              </div>
                              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>{isRTL ? `سنة الصنع: ${valYear}` : `Year: ${valYear}`}</span>
                              </div>
                              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                {valMileage < 50000 ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                ) : valMileage < 100000 ? (
                                  <AlertCircle className="w-4 h-4 text-amber-500" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-red-500" />
                                )}
                                <span>{isRTL ? `الممشى: ${valMileage?.toLocaleString()} كم` : `Mileage: ${valMileage?.toLocaleString()} km`}</span>
                              </div>
                              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>{isRTL ? `الحالة: ${valCondition === 'excellent' ? 'ممتازة' : valCondition === 'good' ? 'جيدة' : 'مقبولة'}` : `Condition: ${valCondition}`}</span>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}

                    {/* Action Buttons */}
                    <Button
                      className="w-full sky-gradient text-white h-12"
                      onClick={() => {
                        setShowValuation(false);
                        setValBrand('');
                        setValModel('');
                        setValYear(2026);
                        setValMileage(50000);
                        setValCondition('good');
                      }}
                    >
                      <RefreshCw className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {isRTL ? 'تقييم جديد' : 'New Valuation'}
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {selectedService === 'settings' && (
              <div className="space-y-4">
                {/* Admin & Management Section */}
                <div className={`p-4 bg-muted/30 rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                  <h4 className="font-semibold mb-2">{isRTL ? 'الإدارة والتحكم' : 'Admin & Management'}</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => { setServiceDetailOpen(false); setDashboardOpen(true); }}>
                    <CardContent className="p-4 text-center">
                      <div className="w-10 h-10 rounded-xl bg-slate-500 flex items-center justify-center mx-auto mb-2">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <p className="font-semibold text-sm">{isRTL ? 'لوحة التحكم' : 'Dashboard'}</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => { setServiceDetailOpen(false); setSelectedService('add-announcement'); setServiceDetailOpen(true); }}>
                    <CardContent className="p-4 text-center">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-2">
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                      <p className="font-semibold text-sm">{isRTL ? 'إضافة إعلان' : 'Add Announcement'}</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => { setServiceDetailOpen(false); setSelectedService('add-offer'); setServiceDetailOpen(true); }}>
                    <CardContent className="p-4 text-center">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-2">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <p className="font-semibold text-sm">{isRTL ? 'إضافة عرض خاص' : 'Add Special Offer'}</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => { setServiceDetailOpen(false); setSelectedService('add-agent'); setServiceDetailOpen(true); }}>
                    <CardContent className="p-4 text-center">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mx-auto mb-2">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <p className="font-semibold text-sm">{isRTL ? 'إضافة مزود خدمات' : 'Add Provider'}</p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Privacy Section */}
                <div className={`p-4 bg-muted/30 rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                  <h4 className="font-semibold mb-2">{isRTL ? 'الخصوصية والبيانات' : 'Privacy & Data'}</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => { setServiceDetailOpen(false); setShowPrivacyPolicy(true); }}>
                    <CardContent className="p-4 text-center">
                      <Shield className="w-8 h-8 mx-auto mb-2 text-teal-500" />
                      <p className="font-semibold text-sm">{isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => { setServiceDetailOpen(false); setShowTermsOfService(true); }}>
                    <CardContent className="p-4 text-center">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <p className="font-semibold text-sm">{isRTL ? 'شروط الاستخدام' : 'Terms of Service'}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            {selectedService === 'add-announcement' && (
              <div className="space-y-4">
                <div className={`p-4 bg-blue-500/10 rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                  <h4 className="font-semibold mb-2">{isRTL ? 'إضافة إعلان جديد' : 'Add New Announcement'}</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>{isRTL ? 'عنوان الإعلان' : 'Announcement Title'}</Label>
                    <Input placeholder={isRTL ? 'أدخل عنوان الإعلان' : 'Enter announcement title'} value={announcementTitle} onChange={(e) => setAnnouncementTitle(e.target.value)} />
                  </div>
                  <div>
                    <Label>{isRTL ? 'وصف الإعلان' : 'Description'}</Label>
                    <Textarea placeholder={isRTL ? 'أدخل وصف الإعلان' : 'Enter description'} value={announcementDesc} onChange={(e) => setAnnouncementDesc(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>{isRTL ? 'تاريخ البداية' : 'Start Date'}</Label>
                      <Input type="date" value={announcementStartDate} onChange={(e) => setAnnouncementStartDate(e.target.value)} />
                    </div>
                    <div>
                      <Label>{isRTL ? 'تاريخ النهاية' : 'End Date'}</Label>
                      <Input type="date" value={announcementEndDate} onChange={(e) => setAnnouncementEndDate(e.target.value)} />
                    </div>
                  </div>
                  <Button className="w-full sky-gradient text-white" onClick={() => { toast({ title: isRTL ? 'تم إضافة الإعلان بنجاح' : 'Announcement added successfully' }); setServiceDetailOpen(false); }}>
                    {isRTL ? 'نشر الإعلان' : 'Publish Announcement'}
                  </Button>
                </div>
              </div>
            )}
            
            {selectedService === 'add-offer' && (
              <div className="space-y-4">
                <div className={`p-4 bg-amber-500/10 rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                  <h4 className="font-semibold mb-2">{isRTL ? 'إضافة عرض خاص جديد' : 'Add New Special Offer'}</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>{isRTL ? 'عنوان العرض' : 'Offer Title'}</Label>
                    <Input placeholder={isRTL ? 'أدخل عنوان العرض' : 'Enter offer title'} value={offerTitle} onChange={(e) => setOfferTitle(e.target.value)} />
                  </div>
                  <div>
                    <Label>{isRTL ? 'وصف العرض' : 'Description'}</Label>
                    <Textarea placeholder={isRTL ? 'أدخل وصف العرض' : 'Enter description'} value={offerDesc} onChange={(e) => setOfferDesc(e.target.value)} />
                  </div>
                  <div>
                    <Label>{isRTL ? 'نسبة الخصم' : 'Discount Percentage'}</Label>
                    <Input placeholder={isRTL ? 'مثال: 15%' : 'e.g., 15%'} value={offerDiscount} onChange={(e) => setOfferDiscount(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>{isRTL ? 'تاريخ البداية' : 'Start Date'}</Label>
                      <Input type="date" value={offerStartDate} onChange={(e) => setOfferStartDate(e.target.value)} />
                    </div>
                    <div>
                      <Label>{isRTL ? 'تاريخ النهاية' : 'End Date'}</Label>
                      <Input type="date" value={offerEndDate} onChange={(e) => setOfferEndDate(e.target.value)} />
                    </div>
                  </div>
                  <Button className="w-full sky-gradient text-white" onClick={() => { toast({ title: isRTL ? 'تم إضافة العرض بنجاح' : 'Offer added successfully' }); setServiceDetailOpen(false); }}>
                    {isRTL ? 'نشر العرض' : 'Publish Offer'}
                  </Button>
                </div>
              </div>
            )}
            
            {selectedService === 'add-agent' && (
              <div className="space-y-4">
                <div className={`p-4 bg-emerald-500/10 rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                  <h4 className="font-semibold mb-2">{isRTL ? 'إضافة مزود خدمات جديد' : 'Add New Service Provider'}</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>{isRTL ? 'اسم المزود' : 'Provider Name'}</Label>
                    <Input placeholder={isRTL ? 'أدخل اسم المزود' : 'Enter provider name'} value={spName} onChange={(e) => setSpName(e.target.value)} />
                  </div>
                  <div>
                    <Label>{isRTL ? 'نوع المزود' : 'Provider Type'}</Label>
                    <select className="w-full h-10 rounded-md border bg-background px-3" value={spType} onChange={(e) => setSpType(e.target.value)}>
                      <option value="">{isRTL ? 'اختر النوع' : 'Select Type'}</option>
                      <option value="agency">{isRTL ? 'وكالة سيارات' : 'Car Agency'}</option>
                      <option value="financing">{isRTL ? 'شركة تمويل' : 'Financing Company'}</option>
                      <option value="insurance">{isRTL ? 'شركة تأمين' : 'Insurance Company'}</option>
                      <option value="maintenance">{isRTL ? 'مركز صيانة' : 'Maintenance Center'}</option>
                    </select>
                  </div>
                  <div>
                    <Label>{isRTL ? 'المنطقة' : 'Region'}</Label>
                    <Input placeholder={isRTL ? 'المنطقة' : 'Region'} value={spRegion} onChange={(e) => setSpRegion(e.target.value)} />
                  </div>
                  <div>
                    <Label>{isRTL ? 'رقم الهاتف' : 'Phone Number'}</Label>
                    <Input placeholder={isRTL ? 'رقم الهاتف' : 'Phone number'} value={spPhone} onChange={(e) => setSpPhone(e.target.value)} />
                  </div>
                  <div>
                    <Label>{isRTL ? 'البريد الإلكتروني' : 'Email'}</Label>
                    <Input placeholder={isRTL ? 'البريد الإلكتروني' : 'Email'} type="email" value={spEmail} onChange={(e) => setSpEmail(e.target.value)} />
                  </div>
                  <Button className="w-full sky-gradient text-white" onClick={() => { toast({ title: isRTL ? 'تم إضافة المزود بنجاح' : 'Provider added successfully' }); setServiceDetailOpen(false); }}>
                    {isRTL ? 'إضافة المزود' : 'Add Provider'}
                  </Button>
                </div>
              </div>
            )}
            
            {selectedService === 'add-announcement' && (
              <div className="space-y-4">
                <div className={`p-4 bg-blue-500/10 rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                  <h4 className="font-semibold mb-2">{isRTL ? 'إضافة إعلان جديد' : 'Add New Announcement'}</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>{isRTL ? 'عنوان الإعلان' : 'Announcement Title'}</Label>
                    <Input placeholder={isRTL ? 'أدخل عنوان الإعلان' : 'Enter announcement title'} value={announcementTitle} onChange={(e) => setAnnouncementTitle(e.target.value)} />
                  </div>
                  <div>
                    <Label>{isRTL ? 'وصف الإعلان' : 'Description'}</Label>
                    <Textarea placeholder={isRTL ? 'أدخل وصف الإعلان' : 'Enter description'} value={announcementDesc} onChange={(e) => setAnnouncementDesc(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>{isRTL ? 'تاريخ البداية' : 'Start Date'}</Label>
                      <Input type="date" value={announcementStartDate} onChange={(e) => setAnnouncementStartDate(e.target.value)} />
                    </div>
                    <div>
                      <Label>{isRTL ? 'تاريخ النهاية' : 'End Date'}</Label>
                      <Input type="date" value={announcementEndDate} onChange={(e) => setAnnouncementEndDate(e.target.value)} />
                    </div>
                  </div>
                  <Button className="w-full sky-gradient text-white" onClick={() => { toast({ title: isRTL ? 'تم إضافة الإعلان بنجاح' : 'Announcement added successfully' }); setServiceDetailOpen(false); }}>
                    {isRTL ? 'نشر الإعلان' : 'Publish Announcement'}
                  </Button>
                </div>
              </div>
            )}
            
            {selectedService === 'add-offer' && (
              <div className="space-y-4">
                <div className={`p-4 bg-amber-500/10 rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                  <h4 className="font-semibold mb-2">{isRTL ? 'إضافة عرض خاص جديد' : 'Add New Special Offer'}</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>{isRTL ? 'عنوان العرض' : 'Offer Title'}</Label>
                    <Input placeholder={isRTL ? 'أدخل عنوان العرض' : 'Enter offer title'} value={offerTitle} onChange={(e) => setOfferTitle(e.target.value)} />
                  </div>
                  <div>
                    <Label>{isRTL ? 'وصف العرض' : 'Description'}</Label>
                    <Textarea placeholder={isRTL ? 'أدخل وصف العرض' : 'Enter description'} value={offerDesc} onChange={(e) => setOfferDesc(e.target.value)} />
                  </div>
                  <div>
                    <Label>{isRTL ? 'نسبة الخصم' : 'Discount Percentage'}</Label>
                    <Input placeholder={isRTL ? 'مثال: 15%' : 'e.g., 15%'} value={offerDiscount} onChange={(e) => setOfferDiscount(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>{isRTL ? 'تاريخ البداية' : 'Start Date'}</Label>
                      <Input type="date" value={offerStartDate} onChange={(e) => setOfferStartDate(e.target.value)} />
                    </div>
                    <div>
                      <Label>{isRTL ? 'تاريخ النهاية' : 'End Date'}</Label>
                      <Input type="date" value={offerEndDate} onChange={(e) => setOfferEndDate(e.target.value)} />
                    </div>
                  </div>
                  <Button className="w-full sky-gradient text-white" onClick={() => { toast({ title: isRTL ? 'تم إضافة العرض بنجاح' : 'Offer added successfully' }); setServiceDetailOpen(false); }}>
                    {isRTL ? 'نشر العرض' : 'Publish Offer'}
                  </Button>
                </div>
              </div>
            )}
            
            {selectedService === 'add-agent' && (
              <div className="space-y-4">
                <div className={`p-4 bg-emerald-500/10 rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                  <h4 className="font-semibold mb-2">{isRTL ? 'إضافة مزود خدمات جديد' : 'Add New Service Provider'}</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>{isRTL ? 'اسم المزود' : 'Provider Name'}</Label>
                    <Input placeholder={isRTL ? 'أدخل اسم المزود' : 'Enter provider name'} value={spName} onChange={(e) => setSpName(e.target.value)} />
                  </div>
                  <div>
                    <Label>{isRTL ? 'نوع المزود' : 'Provider Type'}</Label>
                    <select className="w-full h-10 rounded-md border bg-background px-3" value={spType} onChange={(e) => setSpType(e.target.value)}>
                      <option value="">{isRTL ? 'اختر النوع' : 'Select Type'}</option>
                      <option value="agency">{isRTL ? 'وكالة سيارات' : 'Car Agency'}</option>
                      <option value="financing">{isRTL ? 'شركة تمويل' : 'Financing Company'}</option>
                      <option value="insurance">{isRTL ? 'شركة تأمين' : 'Insurance Company'}</option>
                      <option value="maintenance">{isRTL ? 'مركز صيانة' : 'Maintenance Center'}</option>
                    </select>
                  </div>
                  <div>
                    <Label>{isRTL ? 'المنطقة' : 'Region'}</Label>
                    <Input placeholder={isRTL ? 'المنطقة' : 'Region'} value={spRegion} onChange={(e) => setSpRegion(e.target.value)} />
                  </div>
                  <div>
                    <Label>{isRTL ? 'رقم الهاتف' : 'Phone Number'}</Label>
                    <Input placeholder={isRTL ? 'رقم الهاتف' : 'Phone number'} value={spPhone} onChange={(e) => setSpPhone(e.target.value)} />
                  </div>
                  <div>
                    <Label>{isRTL ? 'البريد الإلكتروني' : 'Email'}</Label>
                    <Input placeholder={isRTL ? 'البريد الإلكتروني' : 'Email'} type="email" value={spEmail} onChange={(e) => setSpEmail(e.target.value)} />
                  </div>
                  <Button className="w-full sky-gradient text-white" onClick={() => { toast({ title: isRTL ? 'تم إضافة المزود بنجاح' : 'Provider added successfully' }); setServiceDetailOpen(false); }}>
                    {isRTL ? 'إضافة المزود' : 'Add Provider'}
                  </Button>
                </div>
              </div>
            )}
            
            {/* Quick Services Navigation */}
            <div className="border-t pt-4 mt-4">
              <p className="text-xs text-muted-foreground mb-2">{isRTL ? 'خدمات أخرى' : 'Other Services'}</p>
              <div className="flex flex-wrap gap-2">
                {appFeatures.filter(f => f.id !== selectedService).slice(0, 5).map((feature) => {
                  const IconComponent = feature.icon;
                  return (
                    <Button
                      key={feature.id}
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => setSelectedService(feature.id)}
                    >
                      <IconComponent className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                      {isRTL ? feature.titleAr : feature.titleEn}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Service Provider Dashboard Dialog */}
      <Dialog open={dashboardOpen} onOpenChange={setDashboardOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-start' : ''}`}>
              <Building2 className="w-5 h-5" />
              {isRTL ? 'لوحة التحكم' : 'Dashboard'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Admin Welcome */}
            <div className={`p-4 bg-green-500/10 rounded-xl border border-green-500/30 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-600">{isRTL ? 'مرحباً بك في لوحة التحكم' : 'Welcome to Dashboard'}</p>
                    <p className="text-xs text-muted-foreground">{isRTL ? 'تم تسجيل الدخول بنجاح' : 'Logged in successfully'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Add Announcement */}
              <Card className="cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-primary/30">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Bell className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{isRTL ? 'إضافة إعلان' : 'Add Announcement'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'إضافة إعلان جديد للمستخدمين' : 'Add new announcement for users'}
                  </p>
                  <Button className="mt-4 sky-gradient text-white w-full" size="sm">
                    <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'إضافة' : 'Add'}
                  </Button>
                </CardContent>
              </Card>

              {/* Add Special Offer */}
              <Card className="cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-primary/30">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{isRTL ? 'إضافة عرض خاص' : 'Add Special Offer'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'إضافة عرض خاص جديد' : 'Add new special offer'}
                  </p>
                  <Button className="mt-4 sky-gradient text-white w-full" size="sm">
                    <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'إضافة' : 'Add'}
                  </Button>
                </CardContent>
              </Card>

              {/* Add Service Provider */}
              <Card className="cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-primary/30">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{isRTL ? 'إضافة مزود خدمات' : 'Add Service Provider'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'إضافة مزود خدمات جديد' : 'Add new service provider'}
                  </p>
                  <Button className="mt-4 sky-gradient text-white w-full" size="sm">
                    <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'إضافة' : 'Add'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{isRTL ? 'إحصائيات سريعة' : 'Quick Stats'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-center">
                    <p className="text-2xl font-bold text-blue-600">12</p>
                    <p className="text-xs text-muted-foreground">{isRTL ? 'الإعلانات' : 'Announcements'}</p>
                  </div>
                  <div className="p-3 bg-amber-500/10 rounded-xl text-center">
                    <p className="text-2xl font-bold text-amber-600">8</p>
                    <p className="text-xs text-muted-foreground">{isRTL ? 'العروض' : 'Offers'}</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-xl text-center">
                    <p className="text-2xl font-bold text-green-600">24</p>
                    <p className="text-xs text-muted-foreground">{isRTL ? 'مزودي الخدمات' : 'Providers'}</p>
                  </div>
                  <div className="p-3 bg-purple-500/10 rounded-xl text-center">
                    <p className="text-2xl font-bold text-purple-600">156</p>
                    <p className="text-xs text-muted-foreground">{isRTL ? 'المستخدمين' : 'Users'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{isRTL ? 'النشاط الأخير' : 'Recent Activity'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className={`p-3 bg-muted/50 rounded-lg flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Bell className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">{isRTL ? 'تم إضافة إعلان جديد' : 'New announcement added'}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{isRTL ? 'منذ 5 دقائق' : '5 min ago'}</span>
                  </div>
                  <div className={`p-3 bg-muted/50 rounded-lg flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span className="text-sm">{isRTL ? 'تم إضافة عرض خاص' : 'Special offer added'}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{isRTL ? 'منذ ساعة' : '1 hour ago'}</span>
                  </div>
                  <div className={`p-3 bg-muted/50 rounded-lg flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Building2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{isRTL ? 'تم تسجيل وكيل جديد' : 'New agent registered'}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{isRTL ? 'منذ 3 ساعات' : '3 hours ago'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Coupon Dialog */}
      <Dialog open={showCoupon} onOpenChange={setShowCoupon}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <VisuallyHidden.Root>
            <DialogTitle>{isRTL ? 'قسيمة الخصم' : 'Discount Coupon'}</DialogTitle>
          </VisuallyHidden.Root>
          {currentCoupon && (
            <div className="relative">
              {/* Coupon Header */}
              <div className="bg-gradient-to-r from-primary to-emerald-500 text-white p-6 rounded-t-lg text-center">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                  <Ticket className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold">{isRTL ? 'قسيمة الخصم' : 'Discount Coupon'}</h2>
                <p className="text-sm text-white/80 mt-1">{currentCoupon.badge}</p>
              </div>

              {/* Coupon Body */}
              <div className="p-6 border-x border-b rounded-b-lg space-y-4">
                {/* Title */}
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{currentCoupon.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{currentCoupon.description}</p>
                </div>

                {/* Discount Code */}
                <div className="bg-muted p-4 rounded-lg text-center border-2 border-dashed border-primary">
                  <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'رمز الخصم' : 'Discount Code'}</p>
                  <p className="text-3xl font-bold font-mono text-primary tracking-wider">{currentCoupon.code}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 text-xs"
                    onClick={() => {
                      navigator.clipboard.writeText(currentCoupon.code);
                      toast({
                        title: isRTL ? '✅ تم النسخ' : '✅ Copied',
                        description: isRTL ? 'تم نسخ رمز الخصم' : 'Discount code copied'
                      });
                    }}
                  >
                    <ClipboardList className="w-3 h-3 me-1" />
                    {isRTL ? 'نسخ الرمز' : 'Copy Code'}
                  </Button>
                </div>

                {/* Validity */}
                <div className={`flex items-center gap-2 p-3 bg-amber-500/10 rounded-lg ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span className="text-sm">
                    {isRTL ? `صالح حتى: ${currentCoupon.validUntil}` : `Valid until: ${currentCoupon.validUntil}`}
                  </span>
                </div>

                {/* Location */}
                <div className={`flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg ${isRTL ? 'flex-row-reverse justify-end text-right' : ''}`}>
                  <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">{isRTL ? 'العنوان' : 'Location'}</p>
                    <p className="text-xs text-muted-foreground">{currentCoupon.location}</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <div className={`flex items-center gap-3 p-2 bg-muted rounded-lg ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{currentCoupon.phone}</span>
                  </div>
                  <div className={`flex items-center gap-3 p-2 bg-green-500/10 rounded-lg ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <MessageCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">WhatsApp: {currentCoupon.whatsapp}</span>
                  </div>
                  <div className={`flex items-center gap-3 p-2 bg-muted rounded-lg ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm">{currentCoupon.workingHours}</span>
                  </div>
                </div>

                {/* Terms */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-xs text-muted-foreground">{isRTL ? 'الشروط والأحكام' : 'Terms & Conditions'}</h4>
                  <ul className="space-y-1">
                    {currentCoupon.terms?.map((term: string, i: number) => (
                      <li key={i} className={`flex items-center gap-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                        <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" />
                        <span>{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Claimed Date */}
                <div className={`text-center text-xs text-muted-foreground pt-2 border-t ${isRTL ? 'text-right' : 'text-left'}`}>
                  {isRTL ? `تم الحصول: ${currentCoupon.claimedAt}` : `Claimed: ${currentCoupon.claimedAt}`}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1 sky-gradient text-white"
                    onClick={() => {
                      window.open(`https://wa.me/${currentCoupon.whatsapp.replace(/\D/g, '')}`, '_blank');
                    }}
                  >
                    <MessageCircle className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowCoupon(false)}
                  >
                    {isRTL ? 'إغلاق' : 'Close'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Budget Car Request Dialog */}
      <Dialog open={budgetCarRequestOpen} onOpenChange={setBudgetCarRequestOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span>{isRTL ? 'طلب السيارة' : 'Request Car'}</span>
            </DialogTitle>
            <DialogDescription className={isRTL ? 'text-right' : 'text-left'}>
              {isRTL ? 'أدخل بياناتك لطلب السيارة' : 'Enter your details to request this car'}
            </DialogDescription>
          </DialogHeader>

          {!budgetCarRequestSubmitted ? (
            <div className="space-y-4 mt-4">
              {/* Selected Car Info */}
              {selectedBudgetCar && (
                <div className={`p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Car className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-bold">
                        {isRTL ? selectedBudgetCar.brand : selectedBudgetCar.brandEn} {isRTL ? selectedBudgetCar.model : selectedBudgetCar.modelEn}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getCurrencyDisplay()} {selectedBudgetCar.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-emerald-600 font-medium">
                        {isRTL ? 'قسط شهري:' : 'Monthly:'} {getCurrencyDisplay()} {Math.round(selectedBudgetCar.monthlyPayment).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Request Form */}
              <div className="space-y-3">
                <div>
                  <Label className={isRTL ? 'text-right block' : ''}>{isRTL ? 'الاسم الكامل' : 'Full Name'}</Label>
                  <Input
                    placeholder={isRTL ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                    value={budgetCarRequestData.name}
                    onChange={(e) => setBudgetCarRequestData({ ...budgetCarRequestData, name: e.target.value })}
                    className={isRTL ? 'text-right' : ''}
                  />
                </div>
                <div>
                  <Label className={isRTL ? 'text-right block' : ''}>{isRTL ? 'رقم الجوال' : 'Phone Number'}</Label>
                  <Input
                    type="tel"
                    placeholder={isRTL ? '05xxxxxxxx' : '05xxxxxxxx'}
                    value={budgetCarRequestData.phone}
                    onChange={(e) => setBudgetCarRequestData({ ...budgetCarRequestData, phone: e.target.value })}
                    className={isRTL ? 'text-right' : ''}
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label className={isRTL ? 'text-right block' : ''}>{isRTL ? 'المدينة' : 'City'}</Label>
                  <select
                    value={budgetCarRequestData.city}
                    onChange={(e) => setBudgetCarRequestData({ ...budgetCarRequestData, city: e.target.value })}
                    className={`w-full h-10 rounded-lg border bg-background px-3 ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    <option value="">{isRTL ? 'اختر المدينة' : 'Select city'}</option>
                    <option value="الرياض">الرياض</option>
                    <option value="جدة">جدة</option>
                    <option value="مكة">مكة</option>
                    <option value="المدينة">المدينة</option>
                    <option value="الدمام">الدمام</option>
                    <option value="الخبر">الخبر</option>
                    <option value="الظهران">الظهران</option>
                    <option value="تبوك">تبوك</option>
                    <option value="أبها">أبها</option>
                    <option value="جازان">جازان</option>
                    <option value="نجران">نجران</option>
                    <option value="حائل">حائل</option>
                    <option value="القصيم">القصيم</option>
                    <option value="الطائف">الطائف</option>
                  </select>
                </div>
                <div>
                  <Label className={isRTL ? 'text-right block' : ''}>{isRTL ? 'ملاحظات إضافية' : 'Additional Notes'}</Label>
                  <Textarea
                    placeholder={isRTL ? 'أي ملاحظات أو متطلبات إضافية' : 'Any additional notes or requirements'}
                    value={budgetCarRequestData.notes}
                    onChange={(e) => setBudgetCarRequestData({ ...budgetCarRequestData, notes: e.target.value })}
                    className={isRTL ? 'text-right' : ''}
                    rows={3}
                  />
                </div>
              </div>

              {/* Financing Details */}
              <div className={`p-3 bg-primary/5 rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="text-sm font-semibold mb-2">{isRTL ? 'تفاصيل التمويل:' : 'Financing Details:'}</div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>{isRTL ? 'الدفعة المقدمة:' : 'Down Payment:'}</span>
                    <span>{financingParams.downPayment}% ({getCurrencyDisplay()} {Math.round((selectedBudgetCar?.price || 0) * financingParams.downPayment / 100).toLocaleString()})</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>{isRTL ? 'مدة التمويل:' : 'Loan Term:'}</span>
                    <span>{financingParams.loanTerm} {isRTL ? 'شهر' : 'months'}</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>{isRTL ? 'نسبة الربح:' : 'Profit Rate:'}</span>
                    <span>{financingParams.interestRate}%</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full sky-gradient text-white h-12"
                disabled={!budgetCarRequestData.name || !budgetCarRequestData.phone || !budgetCarRequestData.city}
                onClick={() => {
                  setBudgetCarRequestSubmitted(true);
                  toast({
                    title: isRTL ? 'تم إرسال طلبك بنجاح!' : 'Request submitted successfully!',
                    description: isRTL ? 'سيتم التواصل معك قريباً' : 'We will contact you soon',
                  });
                }}
              >
                <Send className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isRTL ? 'إرسال الطلب' : 'Submit Request'}
              </Button>
            </div>
          ) : (
            <div className="py-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2">{isRTL ? 'تم إرسال طلبك بنجاح!' : 'Request Submitted!'}</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {isRTL
                  ? `سيتم التواصل معك خلال 24 ساعة بخصوص ${selectedBudgetCar?.brand} ${selectedBudgetCar?.model}`
                  : `We will contact you within 24 hours regarding the ${selectedBudgetCar?.brandEn} ${selectedBudgetCar?.modelEn}`}
              </p>

              {/* Request Summary */}
              <div className={`p-4 bg-muted/50 rounded-xl text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="space-y-2">
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-muted-foreground">{isRTL ? 'رقم الطلب' : 'Request Number'}</span>
                    <span className="font-mono font-bold text-primary">#{Date.now().toString().slice(-8)}</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-muted-foreground">{isRTL ? 'السيارة' : 'Car'}</span>
                    <span>{isRTL ? selectedBudgetCar?.brand : selectedBudgetCar?.brandEn} {isRTL ? selectedBudgetCar?.model : selectedBudgetCar?.modelEn}</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-muted-foreground">{isRTL ? 'القسط الشهري' : 'Monthly Payment'}</span>
                    <span className="font-bold text-emerald-600">{getCurrencyDisplay()} {Math.round(selectedBudgetCar?.monthlyPayment || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full mt-4 sky-gradient text-white"
                onClick={() => setBudgetCarRequestOpen(false)}
              >
                {isRTL ? 'إغلاق' : 'Close'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Dialog */}
      <Dialog open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span>{isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
            </DialogTitle>
          </DialogHeader>

          <div className={`mt-4 space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/10 rounded-xl">
                <h3 className="font-bold text-lg mb-2">{isRTL ? 'مقدمة' : 'Introduction'}</h3>
                <p className="text-sm text-muted-foreground">
                  {isRTL
                    ? 'مرحباً بك في Car Link. نحن نلتزم بحماية خصوصيتك ونحترم ثقتك في استخدام تطبيقنا. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية بياناتك الشخصية.'
                    : 'Welcome to Car Link. We are committed to protecting your privacy and respect your trust in using our application. This Privacy Policy explains how we collect, use, and protect your personal data.'}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">1</span>
                  {isRTL ? 'البيانات التي نجمعها' : 'Data We Collect'}
                </h4>
                <ul className={`space-y-2 text-sm text-muted-foreground ${isRTL ? 'pr-8' : 'pl-8'}`}>
                  <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{isRTL ? 'معلومات المركبة: ماركة السيارة، الموديل، سنة الصنع' : 'Vehicle Information: Car brand, model, year of manufacture'}</span>
                  </li>
                  <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{isRTL ? 'بيانات التواصل: رقم الجوال، البريد الإلكتروني' : 'Contact Data: Mobile number, email address'}</span>
                  </li>
                  <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{isRTL ? 'بيانات التمويل: الراتب، جهة العمل، المدينة' : 'Financing Data: Salary, employer, city'}</span>
                  </li>
                  <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{isRTL ? 'بيانات الاستخدام: كيفية استخدامك للتطبيق' : 'Usage Data: How you use our application'}</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">2</span>
                  {isRTL ? 'كيف نستخدم بياناتك' : 'How We Use Your Data'}
                </h4>
                <ul className={`space-y-2 text-sm text-muted-foreground ${isRTL ? 'pr-8' : 'pl-8'}`}>
                  <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{isRTL ? 'تقديم خدمات تحليل السيارات والتمويل' : 'Provide car analysis and financing services'}</span>
                  </li>
                  <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{isRTL ? 'التواصل معك بخصوص طلباتك واستفساراتك' : 'Communicate about your requests and inquiries'}</span>
                  </li>
                  <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{isRTL ? 'تحسين خدماتنا وتجربة المستخدم' : 'Improve our services and user experience'}</span>
                  </li>
                  <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{isRTL ? 'إرسال العروض والتحديثات المهمة' : 'Send offers and important updates'}</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">3</span>
                  {isRTL ? 'حماية البيانات' : 'Data Protection'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {isRTL
                    ? 'نتخذ جميع التدابير الأمنية اللازمة لحماية بياناتك من الوصول غير المصرح به أو الفقدان أو الإساءة. نستخدم تشفير SSL لحماية نقل البيانات ونحتفظ بنسخ احتياطية آمنة.'
                    : 'We take all necessary security measures to protect your data from unauthorized access, loss, or misuse. We use SSL encryption to protect data transmission and maintain secure backups.'}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">4</span>
                  {isRTL ? 'مشاركة البيانات' : 'Data Sharing'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {isRTL
                    ? 'لا نبيع بياناتك لأي طرف ثالث. قد نشارك بياناتك مع: البنوك وشركات التمويل (لإتمام طلباتك)، الوكالات المعتمدة (للحصول على عروض)، الجهات الحكومية (عند الطلب القانوني).'
                    : 'We do not sell your data to any third party. We may share your data with: Banks and financing companies (to complete your requests), Authorized agencies (for offers), Government entities (upon legal request).'}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">5</span>
                  {isRTL ? 'حقوقك' : 'Your Rights'}
                </h4>
                <ul className={`space-y-2 text-sm text-muted-foreground ${isRTL ? 'pr-8' : 'pl-8'}`}>
                  <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{isRTL ? 'الحق في الوصول إلى بياناتك' : 'Right to access your data'}</span>
                  </li>
                  <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{isRTL ? 'الحق في تصحيح أو تحديث بياناتك' : 'Right to correct or update your data'}</span>
                  </li>
                  <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{isRTL ? 'الحق في طلب حذف بياناتك' : 'Right to request deletion of your data'}</span>
                  </li>
                  <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{isRTL ? 'الحق في الاعتراض على معالجة البيانات' : 'Right to object to data processing'}</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-muted rounded-xl">
                <h4 className="font-semibold mb-2">{isRTL ? 'تواصل معنا' : 'Contact Us'}</h4>
                <p className="text-sm text-muted-foreground">
                  {isRTL
                    ? 'لأي استفسارات حول سياسة الخصوصية، يرجى التواصل معنا على:'
                    : 'For any questions about our Privacy Policy, please contact us at:'}
                </p>
                <p className="text-sm font-medium text-primary mt-1">privacy@carlink.com</p>
              </div>

              <div className="text-center text-xs text-muted-foreground pt-4 border-t">
                {isRTL ? 'آخر تحديث: يناير 2026' : 'Last Updated: January 2026'}
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => {
                  toast({
                    title: isRTL ? 'تمت الموافقة على سياسة الخصوصية' : 'Privacy Policy Accepted',
                    description: isRTL ? 'شكراً لقبولك سياسة الخصوصية' : 'Thank you for accepting our Privacy Policy',
                  });
                  setShowPrivacyPolicy(false);
                }}
                className="sky-gradient text-white"
              >
                <CheckCircle2 className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isRTL ? 'موافقة' : 'Agree'}
              </Button>
              <Button variant="outline" onClick={() => setShowPrivacyPolicy(false)}>
                {isRTL ? 'إغلاق' : 'Close'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms of Service Dialog */}
      <Dialog open={showTermsOfService} onOpenChange={setShowTermsOfService}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span>{isRTL ? 'شروط الاستخدام' : 'Terms of Service'}</span>
            </DialogTitle>
          </DialogHeader>

          <div className={`mt-4 space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-4">
              <div className="p-4 bg-amber-500/10 rounded-xl">
                <h3 className="font-bold text-lg mb-2">{isRTL ? 'مقدمة' : 'Introduction'}</h3>
                <p className="text-sm text-muted-foreground">
                  {isRTL
                    ? 'باستخدامك لتطبيق Car Link، فإنك توافق على الالتزام بشروط الاستخدام هذه. يرجى قراءتها بعناية قبل استخدام التطبيق.'
                    : 'By using the Car Link application, you agree to comply with these Terms of Service. Please read them carefully before using the application.'}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">1</span>
                  {isRTL ? 'استخدام الخدمة' : 'Use of Service'}
                </h4>
                <ul className={`space-y-2 text-sm text-muted-foreground ${isRTL ? 'pr-8' : 'pl-8'}`}>
                  <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{isRTL ? 'يجب استخدام التطبيق للأغراض المشروعة فقط' : 'The application must be used for legitimate purposes only'}</span>
                  </li>
                  <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{isRTL ? 'يُحظر استخدام التطبيق لأي غرض غير قانوني' : 'Using the application for any illegal purpose is prohibited'}</span>
                  </li>
                  <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{isRTL ? 'يجب تقديم معلومات صحيحة ودقيقة' : 'You must provide truthful and accurate information'}</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">2</span>
                  {isRTL ? 'الخدمات المقدمة' : 'Services Provided'}
                </h4>
                <ul className={`space-y-2 text-sm text-muted-foreground ${isRTL ? 'pr-8' : 'pl-8'}`}>
                  <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{isRTL ? 'تحليل السيارات والتقييم' : 'Car analysis and valuation'}</span>
                  </li>
                  <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{isRTL ? 'خدمات التمويل والتقسيط' : 'Financing and installment services'}</span>
                  </li>
                  <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{isRTL ? 'مقارنة أسعار السيارات' : 'Car price comparison'}</span>
                  </li>
                  <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{isRTL ? 'العروض والخصومات' : 'Offers and discounts'}</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">3</span>
                  {isRTL ? 'المسؤوليات' : 'Responsibilities'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card className="p-3">
                    <h5 className="font-semibold text-sm mb-2 text-green-600">{isRTL ? 'مسؤولياتنا' : 'Our Responsibilities'}</h5>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• {isRTL ? 'تقديم خدمات عالية الجودة' : 'Provide high-quality services'}</li>
                      <li>• {isRTL ? 'حماية بياناتك الشخصية' : 'Protect your personal data'}</li>
                      <li>• {isRTL ? 'الاستجابة لاستفساراتك' : 'Respond to your inquiries'}</li>
                      <li>• {isRTL ? 'تحديث التطبيق بانتظام' : 'Update the application regularly'}</li>
                    </ul>
                  </Card>
                  <Card className="p-3">
                    <h5 className="font-semibold text-sm mb-2 text-blue-600">{isRTL ? 'مسؤولياتك' : 'Your Responsibilities'}</h5>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• {isRTL ? 'تقديم معلومات صحيحة' : 'Provide accurate information'}</li>
                      <li>• {isRTL ? 'المحافظة على سرية حسابك' : 'Keep your account confidential'}</li>
                      <li>• {isRTL ? 'استخدام التطبيق بشكل صحيح' : 'Use the application correctly'}</li>
                      <li>• {isRTL ? 'الإبلاغ عن أي مشاكل' : 'Report any issues'}</li>
                    </ul>
                  </Card>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">4</span>
                  {isRTL ? 'إخلاء المسؤولية' : 'Disclaimer'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {isRTL
                    ? 'المعلومات المقدمة في التطبيق هي لأغراض إرشادية فقط. نحن لا نضمن دقة الأسعار أو الموافقة على طلبات التمويل. القرار النهائي يعود للبنوك والجهات المانحة.'
                    : 'The information provided in the application is for guidance purposes only. We do not guarantee price accuracy or financing approval. The final decision rests with banks and granting entities.'}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">5</span>
                  {isRTL ? 'التعديلات والتحديثات' : 'Modifications and Updates'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {isRTL
                    ? 'نحتفظ بالحق في تعديل شروط الاستخدام في أي وقت. سيتم إشعارك بأي تغييرات جوهرية عبر التطبيق أو البريد الإلكتروني. استمرارك في استخدام التطبيق يعني موافقتك على الشروط المحدثة.'
                    : 'We reserve the right to modify the Terms of Service at any time. You will be notified of any material changes via the application or email. Your continued use of the application means you accept the updated terms.'}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">6</span>
                  {isRTL ? 'القانون الحاكم' : 'Governing Law'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {isRTL
                    ? 'تخضع شروط الاستخدام هذه وتفسر وفقاً لقوانين المملكة العربية السعودية. أي نزاعات تنشأ عن هذه الشروط سيتم حلها وفق القانون السعودي.'
                    : 'These Terms of Service are governed by and interpreted in accordance with the laws of the Kingdom of Saudi Arabia. Any disputes arising from these terms will be resolved according to Saudi law.'}
                </p>
              </div>

              <div className="p-4 bg-muted rounded-xl">
                <h4 className="font-semibold mb-2">{isRTL ? 'تواصل معنا' : 'Contact Us'}</h4>
                <p className="text-sm text-muted-foreground">
                  {isRTL
                    ? 'لأي استفسارات حول شروط الاستخدام، يرجى التواصل معنا على:'
                    : 'For any questions about our Terms of Service, please contact us at:'}
                </p>
                <p className="text-sm font-medium text-primary mt-1">support@carlink.com</p>
              </div>

              <div className="text-center text-xs text-muted-foreground pt-4 border-t">
                {isRTL ? 'آخر تحديث: يناير 2026' : 'Last Updated: January 2026'}
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => {
                  toast({
                    title: isRTL ? 'تمت الموافقة على شروط الاستخدام' : 'Terms of Service Accepted',
                    description: isRTL ? 'شكراً لقبولك شروط الاستخدام' : 'Thank you for accepting our Terms of Service',
                  });
                  setShowTermsOfService(false);
                }}
                className="sky-gradient text-white"
              >
                <CheckCircle2 className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isRTL ? 'موافقة' : 'Agree'}
              </Button>
              <Button variant="outline" onClick={() => setShowTermsOfService(false)}>
                {isRTL ? 'إغلاق' : 'Close'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Car Detail Dialog - Side Panel */}
      <Dialog open={carDetailOpen} onOpenChange={setCarDetailOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedCarDetail && !orderFormOpen && !orderSubmitted && (
            <>
              <DialogHeader>
                <DialogTitle className={`text-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                  {isRTL ? selectedCarDetail.brand : selectedCarDetail.brandEn} {isRTL ? selectedCarDetail.model : selectedCarDetail.modelEn}
                </DialogTitle>
                <DialogDescription className={`${isRTL ? 'text-right' : 'text-left'}`}>
                  {selectedCarDetail.year} - {isRTL ? 'سيارة جديدة' : 'New Car'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                {/* Car Image */}
                <div className="relative h-48 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Car className="w-24 h-24 text-emerald-500/50" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-emerald-500 text-white">
                      {isRTL ? 'متوفر' : 'Available'}
                    </Badge>
                  </div>
                </div>
                
                {/* Price Card */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                  <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div>
                      <p className="text-sm text-muted-foreground">{isRTL ? 'السعر' : 'Price'}</p>
                      <p className="text-2xl font-bold text-emerald-600">
                        {getCurrencyDisplay()} {selectedCarDetail.price.toLocaleString()}
                      </p>
                    </div>
                    <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
                      <p className="text-sm text-muted-foreground">{isRTL ? 'القسط الشهري' : 'Monthly Payment'}</p>
                      <p className="text-xl font-bold text-primary">
                        {getCurrencyDisplay()} {Math.round(selectedCarDetail.monthlyPayment).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Specifications Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-lg bg-muted/50 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <p className="text-xs text-muted-foreground">{isRTL ? 'المحرك' : 'Engine'}</p>
                    <p className="font-semibold">{selectedCarDetail.engine}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-muted/50 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <p className="text-xs text-muted-foreground">{t.horsepower}</p>
                    <p className="font-semibold">{selectedCarDetail.hp} {t.hp}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-muted/50 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <p className="text-xs text-muted-foreground">{isRTL ? 'الاستهلاك' : 'Consumption'}</p>
                    <p className="font-semibold">{selectedCarDetail.fuelConsumption} {t.literPer100km}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-muted/50 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <p className="text-xs text-muted-foreground">{isRTL ? 'ناقل الحركة' : 'Transmission'}</p>
                    <p className="font-semibold">{selectedCarDetail.transmission}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-muted/50 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <p className="text-xs text-muted-foreground">{isRTL ? 'عدد المقاعد' : 'Seats'}</p>
                    <p className="font-semibold">{selectedCarDetail.seats}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-muted/50 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <p className="text-xs text-muted-foreground">{isRTL ? 'الألوان' : 'Colors'}</p>
                    <p className="font-semibold">{selectedCarDetail.color}</p>
                  </div>
                </div>
                
                {/* Financing Details */}
                <div className="p-4 rounded-xl border">
                  <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Calculator className="w-4 h-4 text-primary" />
                    {isRTL ? 'تفاصيل التمويل' : 'Financing Details'}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-muted-foreground">{isRTL ? 'الدفعة المقدمة' : 'Down Payment'}</span>
                      <span className="font-medium">{getCurrencyDisplay()} {selectedCarDetail.downPaymentAmount.toLocaleString()}</span>
                    </div>
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-muted-foreground">{isRTL ? 'مبلغ التمويل' : 'Financing Amount'}</span>
                      <span className="font-medium">{getCurrencyDisplay()} {(selectedCarDetail.price - selectedCarDetail.downPaymentAmount).toLocaleString()}</span>
                    </div>
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-muted-foreground">{isRTL ? 'مدة التمويل' : 'Loan Term'}</span>
                      <span className="font-medium">{financingParams.loanTerm} {isRTL ? 'شهر' : 'months'}</span>
                    </div>
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-muted-foreground">{isRTL ? 'نسبة الربح' : 'Profit Rate'}</span>
                      <span className="font-medium">{financingParams.interestRate}%</span>
                    </div>
                    <Separator className="my-2" />
                    <div className={`flex justify-between font-semibold ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span>{isRTL ? 'التكلفة الإجمالية' : 'Total Cost'}</span>
                      <span className="text-primary">{getCurrencyDisplay()} {selectedCarDetail.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    className="w-full sky-gradient text-white h-12 text-base"
                    onClick={() => {
                      // Open financing chatbot with selected car details
                      openFinancingChatbot('', null, selectedCarDetail);
                      setCarDetailOpen(false);
                    }}
                  >
                    <Send className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t.applyNow}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full h-10"
                    onClick={() => {
                      setCarDetailOpen(false);
                    }}
                  >
                    {isRTL ? 'إغلاق' : 'Close'}
                  </Button>
                </div>
              </div>
            </>
          )}
          
          {/* Order Form */}
          {selectedCarDetail && orderFormOpen && !orderSubmitted && (
            <>
              <DialogHeader>
                <DialogTitle className={`text-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                  {isRTL ? 'طلب السيارة' : 'Request Car'}
                </DialogTitle>
                <DialogDescription className={`${isRTL ? 'text-right' : 'text-left'}`}>
                  {isRTL ? selectedCarDetail.brand : selectedCarDetail.brandEn} {isRTL ? selectedCarDetail.model : selectedCarDetail.modelEn} - {selectedCarDetail.year}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-sm">{isRTL ? 'القسط الشهري' : 'Monthly Payment'}</span>
                    <span className="font-bold text-emerald-600">{getCurrencyDisplay()} {Math.round(selectedCarDetail.monthlyPayment).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label className={`${isRTL ? 'text-right block' : ''}`}>{isRTL ? 'الاسم الكامل' : 'Full Name'}</Label>
                    <Input 
                      value={orderFormData.name}
                      onChange={(e) => setOrderFormData({...orderFormData, name: e.target.value})}
                      placeholder={isRTL ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                      className={isRTL ? 'text-right' : ''}
                    />
                  </div>
                  <div>
                    <Label className={`${isRTL ? 'text-right block' : ''}`}>{isRTL ? 'رقم الجوال' : 'Mobile Number'}</Label>
                    <Input 
                      value={orderFormData.phone}
                      onChange={(e) => setOrderFormData({...orderFormData, phone: e.target.value})}
                      placeholder="05xxxxxxxx"
                      className={`${isRTL ? 'text-right' : ''} dir-ltr`}
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <Label className={`${isRTL ? 'text-right block' : ''}`}>{isRTL ? 'المدينة' : 'City'}</Label>
                    <select 
                      className={`w-full h-10 rounded-md border border-input bg-background px-3 ${isRTL ? 'text-right' : 'text-left'}`}
                      value={orderFormData.city}
                      onChange={(e) => setOrderFormData({...orderFormData, city: e.target.value})}
                    >
                      <option value="">{isRTL ? 'اختر المدينة' : 'Select City'}</option>
                      <option value="riyadh">{isRTL ? 'الرياض' : 'Riyadh'}</option>
                      <option value="jeddah">{isRTL ? 'جدة' : 'Jeddah'}</option>
                      <option value="dammam">{isRTL ? 'الدمام' : 'Dammam'}</option>
                      <option value="mecca">{isRTL ? 'مكة المكرمة' : 'Mecca'}</option>
                      <option value="medina">{isRTL ? 'المدينة المنورة' : 'Medina'}</option>
                      <option value="khobar">{isRTL ? 'الخبر' : 'Khobar'}</option>
                    </select>
                  </div>
                  <div>
                    <Label className={`${isRTL ? 'text-right block' : ''}`}>{isRTL ? 'ملاحظات إضافية' : 'Additional Notes'}</Label>
                    <Textarea 
                      value={orderFormData.notes}
                      onChange={(e) => setOrderFormData({...orderFormData, notes: e.target.value})}
                      placeholder={isRTL ? 'أي ملاحظات أو طلبات خاصة' : 'Any notes or special requests'}
                      className={isRTL ? 'text-right' : ''}
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 sky-gradient text-white"
                    onClick={() => {
                      setOrderSubmitted(true);
                      toast({
                        title: isRTL ? 'تم إرسال الطلب بنجاح!' : 'Request Submitted!',
                        description: isRTL ? 'سيتواصل معك فريقنا قريباً' : 'Our team will contact you soon',
                      });
                    }}
                    disabled={!orderFormData.name || !orderFormData.phone || !orderFormData.city}
                  >
                    <Send className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'إرسال الطلب' : 'Submit Request'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setOrderFormOpen(false)}
                  >
                    {isRTL ? 'رجوع' : 'Back'}
                  </Button>
                </div>
              </div>
            </>
          )}
          
          {/* Order Submitted */}
          {selectedCarDetail && orderSubmitted && (
            <div className="py-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2">
                {isRTL ? 'تم إرسال طلبك بنجاح!' : 'Request Submitted!'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {isRTL 
                  ? `طلبك لسيارة ${selectedCarDetail.brand} ${selectedCarDetail.model} قيد المراجعة`
                  : `Your request for ${selectedCarDetail.brandEn} ${selectedCarDetail.modelEn} is being reviewed`}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                {isRTL 
                  ? 'سيتواصل معك أحد مستشارينا خلال 24 ساعة'
                  : 'One of our advisors will contact you within 24 hours'}
              </p>
              <Button 
                className="sky-gradient text-white"
                onClick={() => {
                  setCarDetailOpen(false);
                  setOrderFormOpen(false);
                  setOrderSubmitted(false);
                  setOrderFormData({ name: '', phone: '', city: '', notes: '' });
                }}
              >
                {isRTL ? 'إغلاق' : 'Close'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Comparison Success Animation */}
      <AnimatePresence>
        {showComparisonSuccess && comparisonSuccessData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -100 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none"
          >
            <Card className="bg-gradient-to-br from-emerald-500/95 to-teal-500/95 backdrop-blur-xl border-0 shadow-2xl shadow-emerald-500/30 text-white overflow-hidden">
              <CardContent className="p-8 text-center relative">
                {/* Confetti-like particles */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      opacity: 1, 
                      scale: 0,
                      x: 0, 
                      y: 0 
                    }}
                    animate={{ 
                      opacity: [1, 1, 0],
                      scale: [0, 1, 0],
                      x: (i % 4 - 1.5) * 80,
                      y: (Math.floor(i / 4) - 1) * 80 - 50,
                    }}
                    transition={{ 
                      duration: 1.5,
                      delay: i * 0.05,
                      ease: "easeOut"
                    }}
                    className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: ['#fbbf24', '#f472b6', '#60a5fa', '#34d399', '#a78bfa'][i % 5]
                    }}
                  />
                ))}
                
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <PartyPopper className="w-10 h-10 text-white" />
                  </motion.div>
                </motion.div>
                
                {/* Success Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-2xl font-bold mb-2">
                    {isRTL ? '🎉 تمت الإضافة!' : '🎉 Added Successfully!'}
                  </h3>
                  <p className="text-lg text-white/90 mb-2">
                    {comparisonSuccessData.brand} {comparisonSuccessData.model}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1">
                      {comparisonSuccessData.count}/4 {isRTL ? 'سيارات' : 'cars'}
                    </Badge>
                  </div>
                </motion.div>
                
                {/* Animated scale icon */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 flex items-center justify-center gap-2 text-white/80 text-sm"
                >
                  <GitCompare className="w-4 h-4" />
                  <span>{isRTL ? 'جاري الانتقال للمقارنة...' : 'Moving to comparison...'}</span>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Car Entry Dialog - Simple Form with Brand, Model, Year only */}
      <Dialog open={manualCarEntryOpen} onOpenChange={setManualCarEntryOpen}>
        <DialogContent className="max-w-md" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="w-10 h-10 rounded-xl sky-gradient flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              {isRTL ? 'إدخال بيانات السيارة للتحليل' : 'Enter Car Data for Analysis'}
            </DialogTitle>
            <DialogDescription>
              {isRTL ? 'أدخل الماركة والموديل وسنة الموديل للتحليل' : 'Enter brand, model, and year for analysis'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Brand */}
            <div>
              <Label className="text-base font-semibold">{isRTL ? 'الماركة *' : 'Brand *'}</Label>
              <select
                className="w-full h-12 rounded-xl border bg-background px-4 mt-2 text-base"
                value={manualCarData.brand}
                onChange={(e) => {
                  setManualCarData({ ...manualCarData, brand: e.target.value, model: '' });
                }}
              >
                <option value="">{isRTL ? 'اختر الماركة' : 'Select Brand'}</option>
                {Object.keys(carModelsByBrand).map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div>
              <Label className="text-base font-semibold">{isRTL ? 'الموديل *' : 'Model *'}</Label>
              <select
                className="w-full h-12 rounded-xl border bg-background px-4 mt-2 text-base"
                value={manualCarData.model}
                onChange={(e) => setManualCarData({ ...manualCarData, model: e.target.value })}
                disabled={!manualCarData.brand}
              >
                <option value="">{isRTL ? 'اختر الموديل' : 'Select Model'}</option>
                {manualCarData.brand && carModelsByBrand[manualCarData.brand]?.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <Label className="text-base font-semibold">{isRTL ? 'سنة الموديل' : 'Model Year'}</Label>
              <Input
                type="number"
                className="w-full h-12 rounded-xl mt-2 text-base text-center font-semibold"
                value={manualCarData.year}
                onChange={(e) => setManualCarData({ ...manualCarData, year: e.target.value })}
                placeholder={isRTL ? '2026' : '2026'}
                min="1990"
                max="2030"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl"
              onClick={() => setManualCarEntryOpen(false)}
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              className="flex-1 h-12 rounded-xl sky-gradient text-white"
              onClick={handleManualCarAnalysis}
              disabled={!manualCarData.brand || !manualCarData.model}
            >
              <Sparkles className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'تحليل السيارة' : 'Analyze Car'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Blue Gradient Divider Line before Footer */}
      <div className="w-full py-2">
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>

      <footer className="mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-5 h-5 flex items-center justify-center rounded sky-gradient">
                <Link className="w-3 h-3 text-white" />
              </div>
              <span>Car Link - {t.subtitle}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{t.poweredByAI}</span>
              <span>•</span>
              <span>© 2026 Car Link</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
