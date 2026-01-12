import { useState } from 'react';
import { X, DollarSign, Plus } from 'lucide-react';
import { useIncomeStore } from '../../stores/incomeStore';
import { useExpenseStore } from '../../stores/expenseStore';
import { EXPENSE_CATEGORIES } from '../../lib/constants/expenseCategories';
import type { IncomeEntry, ExpenseCategory } from '../../lib/types';

type QuickAddType = 'income' | 'expense';
type IncomeTypeOption = IncomeEntry['type'];

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: QuickAddType;
}

const INCOME_TYPES: { value: IncomeTypeOption; label: string }[] = [
  { value: 'employment', label: 'T4 - Employment' },
  { value: 'investment', label: 'T5 - Investment' },
  { value: 'self-employment', label: 'Self-Employment' },
  { value: 'other', label: 'Other Income' },
];

export function QuickAddModal({ isOpen, onClose, type }: QuickAddModalProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [incomeType, setIncomeType] = useState<IncomeTypeOption>('employment');
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('office');
  const [taxWithheld, setTaxWithheld] = useState('');

  const { addEntry: addIncome } = useIncomeStore();
  const { addEntry: addExpense } = useExpenseStore();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description) return;

    if (type === 'income') {
      addIncome({
        type: incomeType,
        description,
        amount: parseFloat(amount),
        taxWithheld: taxWithheld ? parseFloat(taxWithheld) : 0,
      });
    } else {
      addExpense({
        category: expenseCategory,
        description,
        amount: parseFloat(amount),
        date: new Date().toISOString().split('T')[0],
      });
    }

    setAmount('');
    setDescription('');
    setTaxWithheld('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              type === 'income' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <DollarSign className={`w-5 h-5 ${
                type === 'income' ? 'text-green-600' : 'text-red-600'
              }`} />
            </div>
            <h2 className="text-lg font-semibold">
              Quick Add {type === 'income' ? 'Income' : 'Expense'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="label">
              {type === 'income' ? 'Income Type' : 'Category'}
            </label>
            {type === 'income' ? (
              <select
                value={incomeType}
                onChange={(e) => setIncomeType(e.target.value as IncomeTypeOption)}
                className="input-field"
              >
                {INCOME_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            ) : (
              <select
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value as ExpenseCategory)}
                className="input-field"
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="label">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={type === 'income' ? 'e.g., Employer Name' : 'e.g., Office supplies'}
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Amount ($)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="input-field"
                required
              />
            </div>
            
            {type === 'income' && (
              <div>
                <label className="label">Tax Withheld ($)</label>
                <input
                  type="number"
                  value={taxWithheld}
                  onChange={(e) => setTaxWithheld(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="input-field"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Add {type === 'income' ? 'Income' : 'Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
