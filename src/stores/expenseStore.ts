import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ExpenseEntry, ExpenseCategory } from '../lib/types';
import { EXPENSE_CATEGORY_MAP } from '../lib/constants/expenseCategories';

interface ExpenseState {
  entries: ExpenseEntry[];
  addEntry: (entry: Omit<ExpenseEntry, 'id'>) => void;
  updateEntry: (id: string, updates: Partial<ExpenseEntry>) => void;
  removeEntry: (id: string) => void;
  clearEntries: () => void;
  getTotalExpenses: () => number;
  getDeductibleExpenses: () => number;
  getExpensesByCategory: () => Record<ExpenseCategory, number>;
}

export const useExpenseStore = create<ExpenseState>()(
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
      
      getTotalExpenses: () =>
        get().entries.reduce((sum, e) => sum + e.amount, 0),
      
      getDeductibleExpenses: () =>
        get().entries.reduce((sum, e) => {
          const categoryInfo = EXPENSE_CATEGORY_MAP[e.category];
          const deductionRate = categoryInfo?.deductionRate ?? 1;
          return sum + e.amount * deductionRate;
        }, 0),
      
      getExpensesByCategory: () => {
        const byCategory = {} as Record<ExpenseCategory, number>;
        for (const entry of get().entries) {
          byCategory[entry.category] = (byCategory[entry.category] || 0) + entry.amount;
        }
        return byCategory;
      },
    }),
    {
      name: 'canadian-tax-expenses',
    }
  )
);
