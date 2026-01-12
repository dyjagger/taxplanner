import { create } from 'zustand';
import type { TaxData } from '../lib/types';
import { fetchTaxData, getCacheAge } from '../lib/taxData/fetcher';

interface TaxDataState {
  data: TaxData | null;
  loading: boolean;
  error: string | null;
  dataAge: number;
  loadTaxData: (year: number) => Promise<void>;
  refreshTaxData: (year: number) => Promise<void>;
}

export const useTaxDataStore = create<TaxDataState>()((set) => ({
  data: null,
  loading: false,
  error: null,
  dataAge: 0,
  
  loadTaxData: async (year) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchTaxData(year);
      const dataAge = getCacheAge(year);
      set({ data, loading: false, dataAge });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load tax data',
        loading: false,
      });
    }
  },
  
  refreshTaxData: async (year) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchTaxData(year);
      const dataAge = getCacheAge(year);
      set({ data, loading: false, dataAge });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to refresh tax data',
        loading: false,
      });
    }
  },
}));
