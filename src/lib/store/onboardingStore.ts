import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FloraInclinacao } from '@/types/flora';

interface OnboardingState {
  ownerUserId: string;

  firstName: string;
  socialName: string;
  cpf: string;
  birthDate: string;
  avatarUrl: string;
  coverUrl: string;
  colorSymbol: string;
  username: string;

  personalityData: any;
  cultureTags: string[];
  cultureData: any;
  integrationPreferences: string[];
  integrationData: any;
  intention: FloraInclinacao;
  intentionData: any;
  privacyLevel: 'private' | 'friends' | 'public';
  privacyData: any;
  accessibilityData: any;
  usLifeInviteData: any;
  plan: string;
  planData: any;

  updateField: (
    field: keyof Omit<OnboardingState, 'updateField' | 'clearStore'>,
    value: any
  ) => void;

  clearStore: () => void;
}

const initialState = {
  ownerUserId: '',

  firstName: '',
  socialName: '',
  cpf: '',
  birthDate: '',
  avatarUrl: '',
  coverUrl: '',
  colorSymbol: '#1B3A2E',
  username: '',

  personalityData: {},
  cultureTags: [],
  cultureData: {},
  integrationPreferences: [],
  integrationData: {},
  intention: 'INTROSPECTIVA' as FloraInclinacao,
  intentionData: {},
  privacyLevel: 'private' as const,
  privacyData: {},
  accessibilityData: {},
  usLifeInviteData: {},
  plan: 'free',
  planData: {},
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,

      updateField: (field, value) =>
        set((state) => ({
          ...state,
          [field]: value,
        })),

      clearStore: () => set({ ...initialState }),
    }),
    {
      name: 'iris-onboarding-storage',
      version: 2,
    }
  )
);
