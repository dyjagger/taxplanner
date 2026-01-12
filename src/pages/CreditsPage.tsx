import { useState } from 'react';
import { Plus, Trash2, Gift, Heart, GraduationCap, Home } from 'lucide-react';

interface TaxCredit {
  id: string;
  type: string;
  description: string;
  amount: number;
}

const creditTypes = [
  { value: 'medical', label: 'Medical Expenses', icon: Heart },
  { value: 'charitable', label: 'Charitable Donations', icon: Gift },
  { value: 'tuition', label: 'Tuition (T2202)', icon: GraduationCap },
  { value: 'home_accessibility', label: 'Home Accessibility', icon: Home },
  { value: 'disability', label: 'Disability Tax Credit', icon: Heart },
  { value: 'other', label: 'Other Credits', icon: Gift },
];

export function CreditsPage() {
  const [credits, setCredits] = useState<TaxCredit[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    type: 'medical',
    description: '',
    amount: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCredit: TaxCredit = {
      id: crypto.randomUUID(),
      type: formData.type,
      description: formData.description,
      amount: parseFloat(formData.amount) || 0,
    };
    setCredits([...credits, newCredit]);
    setFormData({ type: 'medical', description: '', amount: '' });
    setIsAdding(false);
  };

  const removeCredit = (id: string) => {
    setCredits(credits.filter(c => c.id !== id));
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount);

  const totalCredits = credits.reduce((sum, c) => sum + c.amount, 0);

  const medicalExpenses = credits.filter(c => c.type === 'medical').reduce((sum, c) => sum + c.amount, 0);
  const donations = credits.filter(c => c.type === 'charitable').reduce((sum, c) => sum + c.amount, 0);

  const estimatedMedicalCredit = Math.max(0, medicalExpenses * 0.15);
  const estimatedDonationCredit = donations > 200 
    ? (200 * 0.15) + ((donations - 200) * 0.29)
    : donations * 0.15;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax Credits</h1>
          <p className="text-gray-600 mt-1">Track non-refundable tax credits</p>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Add Credit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-purple-50 border-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Gift className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Claimed</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCredits)}</p>
            </div>
          </div>
        </div>
        <div className="card bg-red-50 border-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Medical Credit Est.</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(estimatedMedicalCredit)}</p>
            </div>
          </div>
        </div>
        <div className="card bg-green-50 border-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Gift className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Donation Credit Est.</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(estimatedDonationCredit)}</p>
            </div>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Add Tax Credit</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Credit Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input-field"
              >
                {creditTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Prescription medications, Charity name"
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
              <button type="submit" className="btn-primary">Add Credit</button>
              <button type="button" onClick={() => setIsAdding(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Credit Entries</h2>
        {credits.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Gift size={48} className="mx-auto mb-3 opacity-50" />
            <p>No tax credits added yet</p>
            <p className="text-sm">Add medical expenses, donations, tuition, and more</p>
          </div>
        ) : (
          <div className="space-y-3">
            {credits.map((credit) => {
              const typeInfo = creditTypes.find(t => t.value === credit.type);
              const Icon = typeInfo?.icon || Gift;
              return (
                <div key={credit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <Icon size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{credit.description}</p>
                      <p className="text-sm text-gray-500">{typeInfo?.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{formatCurrency(credit.amount)}</span>
                    <button
                      onClick={() => removeCredit(credit.id)}
                      className="p-1 text-gray-500 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-2">Credit Calculation Notes</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• <strong>Medical:</strong> 15% of expenses exceeding 3% of net income or $2,635 (whichever is less)</li>
          <li>• <strong>Donations:</strong> 15% on first $200, 29% on amounts over $200</li>
          <li>• <strong>Tuition:</strong> 15% of eligible tuition fees</li>
          <li>• <strong>Home Accessibility:</strong> 15% of expenses up to $20,000</li>
        </ul>
      </div>
    </div>
  );
}
