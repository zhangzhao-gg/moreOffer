import { create } from 'zustand';
import { OfferData, AppState } from '../types';
import { ApiService } from '../services/api';

interface AppStore extends AppState {
  // Actions
  setCurrentView: (view: 'form' | 'dashboard') => void;
  updateFormData: (data: Partial<OfferData>) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  submitForm: (data: OfferData) => Promise<void>;
  resetForm: () => void;
  setSubmittedData: (data: OfferData | null) => void;
}

const initialFormData: OfferData = {
  offerCount: 0,
  salaryRange: '',
  industry: ''
};

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  currentView: 'form',
  formData: initialFormData,
  isSubmitting: false,
  submittedData: null,

  // Actions
  setCurrentView: (view) => set({ currentView: view }),

  updateFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),

  setSubmitting: (isSubmitting) => set({ isSubmitting }),

  submitForm: async (data) => {
    set({ isSubmitting: true });
    
    try {
      const result = await ApiService.submitOfferData(data);
      set({ 
        submittedData: data,
        currentView: 'dashboard',
        isSubmitting: false 
      });
    } catch (error) {
      console.error('提交错误:', error);
      set({ isSubmitting: false });
      throw error;
    }
  },

  resetForm: () => set({
    formData: initialFormData,
    currentView: 'form',
    submittedData: null
  }),

  setSubmittedData: (data) => set({ submittedData: data })
}));
