import { useState } from 'react';
import { Plus, Trash2, Edit2, DollarSign } from 'lucide-react';
import { useIncomeStore } from '../stores/incomeStore';
import type { IncomeEntry } from '../lib/types';

const incomeTypes = [
  { value: 'employment', label: 'Employment (T4)' },
  { value: 'self-employment', label: 'Self-Employment' },
  { value: 'investment', label: 'Investment (T5/T3)' },
  { value: 'other', label: 'Other Income' },
] as const;

export function IncomePage() {
  const { entries, addEntry, updateEntry, removeEntry, getTotalIncome, getTotalTaxWithheld } = useIncomeStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: 'employment' as IncomeEntry['type'],
    description: '',
    amount: '',
    taxWithheld: '',
    slipType: '',
  });

  const resetForm = () => {
    setFormData({
      type: 'employment',
      description: '',
      amount: '',
      taxWithheld: '',
      slipType: '',
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry = {
      type: formData.type,
      description: formData.description,
      amount: parseFloat(formData.amount) || 0,
      taxWithheld: parseFloat(formData.taxWithheld) || 0,
      slipType: formData.slipType,
    };

    if (editingId) {
      updateEntry(editingId, entry);
    } else {
      addEntry(entry);
    }
    resetForm();
  };

  const handleEdit = (entry: IncomeEntry) => {
    setFormData({
      type: entry.type,
      description: entry.description,
      amount: entry.amount.toString(),
      taxWithheld: entry.taxWithheld?.toString() || '',
      slipType: entry.slipType || '',
    });
    setEditingId(entry.id);
    setIsAdding(true);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Income</h1>
          <p className="text-gray-600 mt-1">Track all sources of income for your tax return</p>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Add Income
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card bg-blue-50 border-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(getTotalIncome())}</p>
            </div>
          </div>
        </div>
        <div className="card bg-green-50 border-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tax Withheld</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(getTotalTaxWithheld())}</p>
            </div>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Income Entry' : 'Add Income Entry'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Income Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as IncomeEntry['type'] })}
                  className="input-field"
                >
                  {incomeTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Slip Type (optional)</label>
                <input
                  type="text"
                  value={formData.slipType}
                  onChange={(e) => setFormData({ ...formData, slipType: e.target.value })}
                  placeholder="e.g., T4, T5, T3"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="label">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Employer name, investment account"
                className="input-field"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <label className="label">Tax Withheld ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.taxWithheld}
                  onChange={(e) => setFormData({ ...formData, taxWithheld: e.target.value })}
                  placeholder="0.00"
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update' : 'Add'} Income
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Income Entries</h2>
        {entries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <DollarSign size={48} className="mx-auto mb-3 opacity-50" />
            <p>No income entries yet</p>
            <p className="text-sm">Click "Add Income" to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Type</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Description</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Amount</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Tax Withheld</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {entry.slipType || entry.type}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-900">{entry.description}</td>
                    <td className="py-3 px-2 text-right font-medium">{formatCurrency(entry.amount)}</td>
                    <td className="py-3 px-2 text-right text-green-600">
                      {entry.taxWithheld ? formatCurrency(entry.taxWithheld) : '-'}
                    </td>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
