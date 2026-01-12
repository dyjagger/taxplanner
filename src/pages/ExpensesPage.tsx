import { useState } from 'react';
import { Plus, Trash2, Edit2, Receipt, Filter } from 'lucide-react';
import { useExpenseStore } from '../stores/expenseStore';
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_MAP } from '../lib/constants/expenseCategories';
import type { ExpenseEntry, ExpenseCategory } from '../lib/types';

export function ExpensesPage() {
  const { entries, addEntry, updateEntry, removeEntry, getTotalExpenses, getDeductibleExpenses } = useExpenseStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | 'all'>('all');

  const [formData, setFormData] = useState({
    category: 'office' as ExpenseCategory,
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  const resetForm = () => {
    setFormData({
      category: 'office',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry = {
      category: formData.category,
      description: formData.description,
      amount: parseFloat(formData.amount) || 0,
      date: formData.date,
    };

    if (editingId) {
      updateEntry(editingId, entry);
    } else {
      addEntry(entry);
    }
    resetForm();
  };

  const handleEdit = (entry: ExpenseEntry) => {
    setFormData({
      category: entry.category,
      description: entry.description,
      amount: entry.amount.toString(),
      date: entry.date,
    });
    setEditingId(entry.id);
    setIsAdding(true);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount);

  const filteredEntries = filterCategory === 'all' 
    ? entries 
    : entries.filter(e => e.category === filterCategory);

  const expensesByCategory = entries.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + entry.amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Expenses</h1>
          <p className="text-gray-600 mt-1">Track T2125 deductible business expenses</p>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Add Expense
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card bg-green-50 border-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Receipt className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(getTotalExpenses())}</p>
            </div>
          </div>
        </div>
        <div className="card bg-blue-50 border-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Receipt className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Deductible Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(getDeductibleExpenses())}</p>
            </div>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Expense' : 'Add Expense'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
                  className="input-field"
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} {cat.deductionRate < 1 ? `(${cat.deductionRate * 100}% deductible)` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Office supplies from Staples"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="label">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="input-field"
                required
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update' : 'Add'} Expense
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold">Expense Entries</h2>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as ExpenseCategory | 'all')}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Categories</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Receipt size={48} className="mx-auto mb-3 opacity-50" />
            <p>No expense entries yet</p>
            <p className="text-sm">Click "Add Expense" to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Category</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Description</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Amount</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Deductible</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => {
                  const categoryInfo = EXPENSE_CATEGORY_MAP[entry.category];
                  const deductible = entry.amount * (categoryInfo?.deductionRate || 1);
                  return (
                    <tr key={entry.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-2 text-gray-600 text-sm">{entry.date}</td>
                      <td className="py-3 px-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {categoryInfo?.name || entry.category}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-900">{entry.description}</td>
                      <td className="py-3 px-2 text-right font-medium">{formatCurrency(entry.amount)}</td>
                      <td className="py-3 px-2 text-right text-green-600">{formatCurrency(deductible)}</td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(entry)}
                            className="p-1 text-gray-500 hover:text-primary-600"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => removeEntry(entry.id)}
                            className="p-1 text-gray-500 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {Object.keys(expensesByCategory).length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Expenses by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(expensesByCategory).map(([category, amount]) => {
              const categoryInfo = EXPENSE_CATEGORY_MAP[category as ExpenseCategory];
              return (
                <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{categoryInfo?.name || category}</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
