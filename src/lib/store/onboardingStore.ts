import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FloraInclinacao, SubscriptionPlan } from '@/types/flora';

interface OnboardingState {
  firstName: string;
  birthDate: string;
  avatarUrl: string;
  colorSymbol: string;
  username: string;
  personalityData: any;
  cultureTags: string[];
  intention: FloraInclinacao;
  privacyLevel: 'private' | 'friends' | 'public';
  plan: SubscriptionPlan;
  
  updateField: (field: keyof Omit<OnboardingState, 'updateField' | 'clearStore'>, value: any) => void;
  clearStore: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      firstName: '',
      birthDate: '',
      avatarUrl: '',
      colorSymbol: '#1B3A2E',
      username: '',
      personalityData: {},
      cultureTags: [],
      intention: 'INTROSPECTIVA',
      privacyLevel: 'private',
      plan: 'free',
      updateField: (field, value) => set((state) => ({ ...state, [field]: value })),
      clearStore: () => set({ firstName: '', birthDate: '', username: '', plan: 'free' }),
    }),
    { name: 'iris-onboarding-storage' }
  )
);