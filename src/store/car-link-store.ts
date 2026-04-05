import { create } from 'zustand';
import type { Vehicle, FinancingCalculation, ChatMessage, ComparisonVehicle, ViewState, AnalysisMode } from '@/types';

interface CarLinkState {
  // Current vehicle being analyzed
  currentVehicle: Vehicle | null;
  viewState: ViewState;
  analysisMode: AnalysisMode;
  
  // Comparison
  comparisonVehicles: ComparisonVehicle[];
  
  // Chat
  chatMessages: ChatMessage[];
  chatLoading: boolean;
  
  // Financing
  financingParams: {
    downPayment: number;
    loanTerm: number;
    interestRate: number;
    salary: number;
    selectedBank: string | null;
  };
  financingResult: FinancingCalculation | null;
  bankOffers: any[];
  salaryEligibility: {
    isEligible: boolean;
    maxMonthlyPayment: number;
    recommendedDownPayment: number;
    debtToIncomeRatio: number;
  } | null;
  
  // Actions
  setCurrentVehicle: (vehicle: Vehicle | null) => void;
  setViewState: (state: ViewState) => void;
  setAnalysisMode: (mode: AnalysisMode) => void;
  
  addComparisonVehicle: (vehicle: Vehicle) => void;
  removeComparisonVehicle: (vehicleId: string) => void;
  clearComparison: () => void;
  
  addChatMessage: (message: ChatMessage) => void;
  setChatLoading: (loading: boolean) => void;
  clearChat: () => void;
  
  setFinancingParams: (params: Partial<CarLinkState['financingParams']>) => void;
  setFinancingResult: (result: FinancingCalculation | null) => void;
  setBankOffers: (offers: any[]) => void;
  setSalaryEligibility: (eligibility: CarLinkState['salaryEligibility']) => void;
  
  reset: () => void;
}

const initialState = {
  currentVehicle: null,
  viewState: 'input' as ViewState,
  analysisMode: 'link' as AnalysisMode,
  comparisonVehicles: [] as ComparisonVehicle[],
  chatMessages: [] as ChatMessage[],
  chatLoading: false,
  financingParams: {
    downPayment: 20,
    loanTerm: 60,
    interestRate: 5.5,
    salary: 0,
    selectedBank: null,
  },
  financingResult: null,
  bankOffers: [] as any[],
  salaryEligibility: null,
};

export const useCarLinkStore = create<CarLinkState>((set) => ({
  ...initialState,
  
  setCurrentVehicle: (vehicle) => set({ currentVehicle: vehicle }),
  setViewState: (state) => set({ viewState: state }),
  setAnalysisMode: (mode) => set({ analysisMode: mode }),
  
  addComparisonVehicle: (vehicle) => set((state) => {
    if (state.comparisonVehicles.length >= 4) return state;
    if (state.comparisonVehicles.some(v => v.vehicle.id === vehicle.id)) return state;
    return {
      comparisonVehicles: [...state.comparisonVehicles, { vehicle }],
    };
  }),
  
  removeComparisonVehicle: (vehicleId) => set((state) => ({
    comparisonVehicles: state.comparisonVehicles.filter(v => v.vehicle.id !== vehicleId),
  })),
  
  clearComparison: () => set({ comparisonVehicles: [] }),
  
  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, message],
  })),
  
  setChatLoading: (loading) => set({ chatLoading: loading }),
  
  clearChat: () => set({ chatMessages: [] }),
  
  setFinancingParams: (params) => set((state) => ({
    financingParams: { ...state.financingParams, ...params },
  })),
  
  setFinancingResult: (result) => set({ financingResult: result }),
  
  setBankOffers: (offers) => set({ bankOffers: offers }),
  
  setSalaryEligibility: (eligibility) => set({ salaryEligibility: eligibility }),
  
  reset: () => set(initialState),
}));
