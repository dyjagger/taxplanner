import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProvinceCode, UserProfile } from '../lib/types';

interface UserState {
  profile: UserProfile;
  setTaxYear: (year: number) => void;
  setProvince: (province: ProvinceCode) => void;
  setName: (name: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  resetProfile: () => void;
}

const defaultProfile: UserProfile = {
  taxYear: 2024,
  province: 'ON',
  name: '',
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      
      setTaxYear: (year) =>
        set((state) => ({
          profile: { ...state.profile, taxYear: year },
        })),
      
      setProvince: (province) =>
        set((state) => ({
          profile: { ...state.profile, province },
        })),
      
      setName: (name) =>
        set((state) => ({
          profile: { ...state.profile, name },
        })),
      
      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),
      
      resetProfile: () => set({ profile: defaultProfile }),
    }),
    {
      name: 'canadian-tax-user',
    }
  )
);
