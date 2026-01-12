import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IncomeEntry } from '../lib/types';

interface IncomeState {
  entries: IncomeEntry[];
  addEntry: (entry: Omit<IncomeEntry, 'id'>) => void;
  updateEntry: (id: string, updates: Partial<IncomeEntry>) => void;
  removeEntry: (id: string) => void;
  clearEntries: () => void;
  getTotalIncome: () => number;
  getTotalTaxWithheld: () => number;
}

export const useIncomeStore = create<IncomeState>()(
  persist(
    (set, get) => ({
      entries: [],
      
      addEntry: (entry) =>
        set((state) => ({
          entries: [
            ...state.entries,
            { ...entry, id: crypto.randomUUID() },
          ],
        })),
      
      updateEntry: (id, updates) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),
      
      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),
      
      clearEntries: () => set({ entries: [] }),
      
      getTotalIncome: () =>
        get().entries.reduce((sum, e) => sum + e.amount, 0),
      
      getTotalTaxWithheld: () =>
        get().entries.reduce((sum, e) => sum + (e.taxWithheld || 0), 0),
    }),
    {
      name: 'canadian-tax-income',
    }
  )
);
