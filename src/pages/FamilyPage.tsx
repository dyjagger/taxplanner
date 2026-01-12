import { useState } from 'react';
import { Plus, Trash2, Users, Baby, Heart } from 'lucide-react';
import type { FamilyMember } from '../lib/types';

export function FamilyPage() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    relationship: 'spouse' as FamilyMember['relationship'],
    dateOfBirth: '',
    income: '',
    hasDisability: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: FamilyMember = {
      id: crypto.randomUUID(),
      name: formData.name,
      relationship: formData.relationship,
      dateOfBirth: formData.dateOfBirth,
      income: parseFloat(formData.income) || 0,
      hasDisability: formData.hasDisability,
    };
    setMembers([...members, newMember]);
    setFormData({ name: '', relationship: 'spouse', dateOfBirth: '', income: '', hasDisability: false });
    setIsAdding(false);
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount);

  const spouse = members.find(m => m.relationship === 'spouse');
  const children = members.filter(m => m.relationship === 'child');

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const eligibleForCCB = children.filter(c => {
    const age = calculateAge(c.dateOfBirth);
    return age < 18;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Family Information</h1>
          <p className="text-gray-600 mt-1">Add family members for tax optimization</p>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Add Family Member
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-blue-50 border-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Heart className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Spouse</p>
              <p className="text-xl font-bold text-gray-900">{spouse ? spouse.name : 'Not added'}</p>
            </div>
          </div>
        </div>
        <div className="card bg-green-50 border-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Baby className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Children</p>
              <p className="text-xl font-bold text-gray-900">{children.length}</p>
            </div>
          </div>
        </div>
        <div className="card bg-purple-50 border-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">CCB Eligible</p>
              <p className="text-xl font-bold text-gray-900">{eligibleForCCB.length}</p>
            </div>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Add Family Member</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full name"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label">Relationship</label>
                <select
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value as FamilyMember['relationship'] })}
                  className="input-field"
                >
                  <option value="spouse">Spouse/Common-law Partner</option>
                  <option value="child">Child</option>
                  <option value="dependent">Other Dependent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label">Annual Income ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.income}
                  onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                  placeholder="0.00"
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasDisability"
                checked={formData.hasDisability}
                onChange={(e) => setFormData({ ...formData, hasDisability: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300"
              />
              <label htmlFor="hasDisability" className="text-sm text-gray-700">
                Has disability (eligible for DTC)
              </label>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary">Add Member</button>
              <button type="button" onClick={() => setIsAdding(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Family Members</h2>
        {members.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users size={48} className="mx-auto mb-3 opacity-50" />
            <p>No family members added yet</p>
            <p className="text-sm">Add spouse, children, or dependents for tax benefits</p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => {
              const age = calculateAge(member.dateOfBirth);
              const Icon = member.relationship === 'spouse' ? Heart : member.relationship === 'child' ? Baby : Users;
              return (
                <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <Icon size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">
                        {member.relationship.charAt(0).toUpperCase() + member.relationship.slice(1)} • Age {age}
                        {member.hasDisability && ' • DTC Eligible'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {member.income ? (
                      <span className="text-sm text-gray-600">Income: {formatCurrency(member.income)}</span>
                    ) : null}
                    <button
                      onClick={() => removeMember(member.id)}
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

      {eligibleForCCB.length > 0 && (
        <div className="card bg-green-50 border-green-200">
          <h3 className="font-semibold text-gray-900 mb-2">Canada Child Benefit (CCB)</h3>
          <p className="text-sm text-gray-700 mb-3">
            You have {eligibleForCCB.length} child(ren) potentially eligible for CCB.
          </p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Maximum benefit: $7,437/year per child under 6</li>
            <li>• Maximum benefit: $6,275/year per child 6-17</li>
            <li>• Benefits are reduced based on family net income</li>
          </ul>
        </div>
      )}
    </div>
  );
}
