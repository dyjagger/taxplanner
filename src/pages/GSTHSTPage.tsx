import { useState } from 'react';
import { Calculator, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import { PROVINCES } from '../lib/constants/provinces';

export function GSTHSTPage() {
  const { profile } = useUserStore();
  const [isRegistered, setIsRegistered] = useState(false);
  const [revenues, setRevenues] = useState('');
  const [gstCollected, setGstCollected] = useState('');
  const [itcsClaimed, setItcsClaimed] = useState('');

  const provinceInfo = PROVINCES[profile.province];
  const taxRate = provinceInfo?.hstRate || provinceInfo?.gstRate || 0.05;
  const taxName = provinceInfo?.hstRate ? 'HST' : 'GST';

  const revenueAmount = parseFloat(revenues) || 0;
  const gstAmount = parseFloat(gstCollected) || 0;
  const itcsAmount = parseFloat(itcsClaimed) || 0;
  const netOwing = gstAmount - itcsAmount;

  const isNearThreshold = revenueAmount >= 25000 && revenueAmount < 30000;
  const isOverThreshold = revenueAmount >= 30000;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount);

  const formatPercent = (rate: number) => `${(rate * 100).toFixed(2)}%`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{taxName} Management</h1>
        <p className="text-gray-600 mt-1">
          Track {taxName} for your sole proprietorship in {provinceInfo?.name || profile.province}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-blue-50 border-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(revenueAmount)}</p>
            </div>
          </div>
        </div>
        <div className="card bg-green-50 border-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">{taxName} Collected</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(gstAmount)}</p>
            </div>
          </div>
        </div>
        <div className="card bg-purple-50 border-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calculator className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">ITCs Claimed</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(itcsAmount)}</p>
            </div>
          </div>
        </div>
        <div className={`card border-0 ${netOwing >= 0 ? 'bg-red-50' : 'bg-green-50'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${netOwing >= 0 ? 'bg-red-100' : 'bg-green-100'}`}>
              <DollarSign className={netOwing >= 0 ? 'text-red-600' : 'text-green-600'} size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">{netOwing >= 0 ? 'Net Owing' : 'Net Refund'}</p>
              <p className={`text-xl font-bold ${netOwing >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(Math.abs(netOwing))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isNearThreshold && !isRegistered && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-medium text-amber-800">Approaching $30,000 Threshold</p>
            <p className="text-sm text-amber-700 mt-1">
              You're approaching the $30,000 revenue threshold. Once you exceed this amount in any 
              calendar quarter or over four consecutive quarters, you must register for {taxName}.
            </p>
          </div>
        </div>
      )}

      {isOverThreshold && !isRegistered && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-medium text-red-800">Registration Required</p>
            <p className="text-sm text-red-700 mt-1">
              Your revenue exceeds $30,000. You are required to register for {taxName} and 
              charge {formatPercent(taxRate)} on your taxable supplies.
            </p>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">{taxName} Registration Status</h2>
        <div className="flex items-center gap-4 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={!isRegistered}
              onChange={() => setIsRegistered(false)}
              className="w-4 h-4"
            />
            <span>Not Registered (Small Supplier)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={isRegistered}
              onChange={() => setIsRegistered(true)}
              className="w-4 h-4"
            />
            <span>Registered for {taxName}</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Total Revenue (This Year)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={revenues}
              onChange={(e) => setRevenues(e.target.value)}
              placeholder="0.00"
              className="input-field"
            />
          </div>
          {isRegistered && (
            <>
              <div>
                <label className="label">{taxName} Collected</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={gstCollected}
                  onChange={(e) => setGstCollected(e.target.value)}
                  placeholder="0.00"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Input Tax Credits (ITCs)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={itcsClaimed}
                  onChange={(e) => setItcsClaimed(e.target.value)}
                  placeholder="0.00"
                  className="input-field"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Quick Method Calculator</h2>
          <p className="text-sm text-gray-600 mb-4">
            The Quick Method simplifies {taxName} calculations for eligible small businesses.
          </p>
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Revenue (including {taxName})</span>
              <span className="font-medium">{formatCurrency(revenueAmount * (1 + taxRate))}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Quick Method Rate (approx.)</span>
              <span className="font-medium">3.6% - 8.8%</span>
            </div>
            <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-600">Estimated Remittance (at 5%)</span>
              <span className="font-medium text-blue-600">
                {formatCurrency(revenueAmount * (1 + taxRate) * 0.05)}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Remittance Schedule</h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Annual Filing</p>
              <p className="text-sm text-gray-600">Revenue under $1.5M - File once per year</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Quarterly Filing</p>
              <p className="text-sm text-gray-600">Revenue $1.5M - $6M - File every 3 months</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Monthly Filing</p>
              <p className="text-sm text-gray-600">Revenue over $6M - File every month</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-2">{taxName} Rate for {provinceInfo?.name}</h3>
        <p className="text-gray-700">
          Current rate: <strong>{formatPercent(taxRate)}</strong>
          {provinceInfo?.hstRate && ' (HST - combined federal and provincial)'}
          {provinceInfo?.pstRate && ` (GST ${formatPercent(provinceInfo.gstRate)} + PST ${formatPercent(provinceInfo.pstRate)})`}
        </p>
      </div>
    </div>
  );
}
