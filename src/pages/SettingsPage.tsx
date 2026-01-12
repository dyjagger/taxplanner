import { useState } from 'react';
import { Settings, Trash2, Download, RefreshCw } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import { useIncomeStore } from '../stores/incomeStore';
import { useExpenseStore } from '../stores/expenseStore';
import { useRRSPStore } from '../stores/rrspStore';
import { useTaxDataStore } from '../stores/taxDataStore';
import { clearTaxDataCache } from '../lib/taxData/fetcher';
import { PROVINCE_LIST, TAX_YEARS } from '../lib/constants/provinces';

export function SettingsPage() {
  const { profile, updateProfile, resetProfile } = useUserStore();
  const { clearEntries: clearIncome } = useIncomeStore();
  const { clearEntries: clearExpenses } = useExpenseStore();
  const { reset: resetRRSP } = useRRSPStore();
  const { refreshTaxData, loading } = useTaxDataStore();

  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [name, setName] = useState(profile.name);

  const handleSaveProfile = () => {
    updateProfile({ name });
  };

  const handleClearAllData = () => {
    clearIncome();
    clearExpenses();
    resetRRSP();
    resetProfile();
    clearTaxDataCache();
    setShowConfirmClear(false);
  };

  const handleRefreshTaxData = () => {
    clearTaxDataCache(profile.taxYear);
    refreshTaxData(profile.taxYear);
  };

  const handleExportAllData = () => {
    const allData = {
      profile,
      income: JSON.parse(localStorage.getItem('canadian-tax-income') || '{}'),
      expenses: JSON.parse(localStorage.getItem('canadian-tax-expenses') || '{}'),
      rrsp: JSON.parse(localStorage.getItem('canadian-tax-rrsp') || '{}'),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `canadian-tax-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your preferences and data</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings size={20} />
          Profile Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="label">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="input-field max-w-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="label">Default Tax Year</label>
              <select
                value={profile.taxYear}
                onChange={(e) => updateProfile({ taxYear: Number(e.target.value) })}
                className="input-field"
              >
                {TAX_YEARS.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Default Province</label>
              <select
                value={profile.province}
                onChange={(e) => updateProfile({ province: e.target.value as typeof profile.province })}
                className="input-field"
              >
                {PROVINCE_LIST.map((prov) => (
                  <option key={prov.code} value={prov.code}>{prov.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button onClick={handleSaveProfile} className="btn-primary">
            Save Profile
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <RefreshCw size={20} />
          Tax Data
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Tax rates and brackets are cached locally. Refresh to check for updates.
        </p>
        <button
          onClick={handleRefreshTaxData}
          disabled={loading}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Refreshing...' : 'Refresh Tax Data'}
        </button>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Download size={20} />
          Data Management
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Export all your data for backup or transfer to another device.
            </p>
            <button onClick={handleExportAllData} className="btn-secondary flex items-center gap-2">
              <Download size={16} />
              Export All Data
            </button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">
              All data is stored locally in your browser. Clearing browser data will remove it.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Data is stored securely on your device only
            </div>
          </div>
        </div>
      </div>

      <div className="card border-red-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-600">
          <Trash2 size={20} />
          Danger Zone
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          This will permanently delete all your income, expense, and RRSP data. This action cannot be undone.
        </p>
        
        {showConfirmClear ? (
          <div className="flex items-center gap-3">
            <button
              onClick={handleClearAllData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Yes, Delete Everything
            </button>
            <button
              onClick={() => setShowConfirmClear(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmClear(true)}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium"
          >
            Clear All Data
          </button>
        )}
      </div>

      <div className="card bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-2">About This App</h3>
        <p className="text-sm text-gray-700">
          Canadian Tax Planner is a client-side application. All your data is stored locally in your 
          browser and never sent to any server. Tax calculations are estimates based on CRA published 
          rates and should be verified with professional tax software.
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Version 1.0.0 • Built with React + TypeScript
        </p>
      </div>
    </div>
  );
}
