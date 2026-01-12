import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RRSPData } from '../lib/types';

interface RRSPState {
  data: RRSPData;
  setContributionRoom: (room: number) => void;
  setContributionsMade: (amount: number) => void;
  addContribution: (amount: number) => void;
  setPreviousYearUnused: (amount: number) => void;
  getRemainingRoom: () => number;
  reset: () => void;
}

const defaultData: RRSPData = {
  contributionRoom: 0,
  contributionsMade: 0,
  previousYearUnused: 0,
};

export const useRRSPStore = create<RRSPState>()(
  persist(
    (set, get) => ({
      data: defaultData,
      
      setContributionRoom: (room) =>
        set((state) => ({
          data: { ...state.data, contributionRoom: room },
        })),
      
      setContributionsMade: (amount) =>
        set((state) => ({
          data: { ...state.data, contributionsMade: amount },
        })),
      
      addContribution: (amount) =>
        set((state) => ({
          data: {
            ...state.data,
            contributionsMade: state.data.contributionsMade + amount,
          },
        })),
      
      setPreviousYearUnused: (amount) =>
        set((state) => ({
          data: { ...state.data, previousYearUnused: amount },
        })),
      
      getRemainingRoom: () => {
        const { contributionRoom, contributionsMade, previousYearUnused } = get().data;
        return contributionRoom + previousYearUnused - contributionsMade;
      },
      
      reset: () => set({ data: defaultData }),
    }),
    {
      name: 'canadian-tax-rrsp',
    }
  )
);
