export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year?: number;
  trim?: string;
  price?: number;
  currency: string;
  
  // Specifications
  engine?: string;
  engineCode?: string;
  horsepower?: number;
  torque?: number;
  fuelType?: string;
  fuelConsumption?: number;
  transmission?: string;
  gears?: number;
  drivetrain?: string;
  acceleration?: number;
  topSpeed?: number;
  
  // Dimensions
  length?: number;
  width?: number;
  height?: number;
  wheelbase?: number;
  weight?: number;
  groundClearance?: number;
  
  // Capacity
  seats?: number;
  doors?: number;
  trunkCapacity?: number;
  fuelTankCapacity?: number;
  
  // Wheels & Tires
  wheelSize?: number;
  tireSize?: string;
  
  // Warranty
  warrantyYears?: number;
  warrantyKm?: number;
  
  // Features
  safetyFeatures?: string[];
  techFeatures?: string[];
  comfortFeatures?: string[];
  exteriorFeatures?: string[];
  
  // Source info
  sourceUrl?: string;
  sourceImage?: string;
  
  // Market analysis
  marketPrice?: number;
  priceStatus?: 'good' | 'average' | 'overpriced';
  
  // Financing
  monthlyPayment?: number;
  
  // Additional info
  mileage?: number;
  condition?: 'new' | 'used';
  color?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface FinancingOffer {
  id: string;
  bankName: string;
  bankLogo?: string;
  interestRate: number;
  minDownPayment: number;
  maxLoanTerm: number;
  minLoanAmount?: number;
  maxLoanAmount?: number;
  fees?: number;
  isActive: boolean;
}

export interface FinancingCalculation {
  vehiclePrice: number;
  downPayment: number;
  loanTerm: number;
  interestRate: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ComparisonVehicle {
  vehicle: Vehicle;
  financing?: FinancingCalculation;
}

export type AnalysisMode = 'link' | 'image';

export type ViewState = 'input' | 'analyzing' | 'results' | 'services';

export interface CarService {
  id: string;
  icon: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  color: string;
}
