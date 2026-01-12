import { useState, useMemo } from 'react';
import { PiggyBank, TrendingUp, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useUserStore } from '../stores/userStore';
import { useIncomeStore } from '../stores/incomeStore';
import { useExpenseStore } from '../stores/expenseStore';
import { useRRSPStore } from '../stores/rrspStore';
import { useTaxDataStore } from '../stores/taxDataStore';
import { calculateRRSPOptimization } from '../lib/calculations/rrspOptimization';
import { PROVINCES } from '../lib/constants/provinces';

export function RRSPPage() {
  const { profile } = useUserStore();
  const { getTotalIncome } = useIncomeStore();
  const { getDeductibleExpenses } = useExpenseStore();
  const { data: rrspData, setContributionRoom, setContributionsMade, getRemainingRoom } = useRRSPStore();
  const { data: taxData } = useTaxDataStore();

  const [contributionRoom, setContributionRoomInput] = useState(rrspData.contributionRoom.toString());
  const [contributionsMade, setContributionsMadeInput] = useState(rrspData.contributionsMade.toString());
  const [simulatedContribution, setSimulatedContribution] = useState(0);

  const grossIncome = getTotalIncome();
  const deductions = getDeductibleExpenses();
  const taxableIncome = Math.max(0, grossIncome - deductions);
  const remainingRoom = getRemainingRoom();

  const optimization = useMemo(() => {
    if (!taxData || taxableIncome <= 0 || remainingRoom <= 0) return null;
    try {
      return calculateRRSPOptimization(
        taxableIncome,
        remainingRoom,
        profile.province,
        taxData
      );
    } catch (error) {
      console.error('RRSP optimization error:', error);
      return null;
    }
  }, [taxData, taxableIncome, remainingRoom, profile.province]);

  const handleUpdateRoom = () => {
    const room = parseFloat(contributionRoom) || 0;
    const made = parseFloat(contributionsMade) || 0;
    setContributionRoom(room);
    setContributionsMade(made);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount);

  const formatPercent = (rate: number) => `${(rate * 100).toFixed(1)}%`;

  const provinceName = PROVINCES[profile.province]?.name || profile.province;

  const bracketChartData = useMemo(() => {
    if (!taxData) return [];
    const federalBrackets = taxData.federal.brackets;
    const provincialBrackets = taxData.provinces[profile.province]?.brackets || [];
    
    return federalBrackets.slice(0, 5).map((bracket, i) => {
      const provBracket = provincialBrackets[i] || provincialBrackets[provincialBrackets.length - 1];
      return {
        name: bracket.max === Infinity ? `$${(bracket.min / 1000).toFixed(0)}k+` : `$${(bracket.max / 1000).toFixed(0)}k`,
        federal: bracket.rate * 100,
        provincial: (provBracket?.rate || 0) * 100,
        combined: (bracket.rate + (provBracket?.rate || 0)) * 100,
        isCurrentBracket: taxableIncome > (federalBrackets[i - 1]?.max || 0) && taxableIncome <= bracket.max,
      };
    });
  }, [taxData, profile.province, taxableIncome]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">RRSP Optimizer</h1>
        <p className="text-gray-600 mt-1">
          Find your optimal RRSP contribution for {profile.taxYear} in {provinceName}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-purple-50 border-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <PiggyBank className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Remaining Room</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(remainingRoom)}</p>
            </div>
          </div>
        </div>
        <div className="card bg-blue-50 border-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Marginal Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {optimization ? formatPercent(optimization.currentMarginalRate) : '-'}
              </p>
            </div>
          </div>
        </div>
        <div className="card bg-green-50 border-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Optimal Savings</p>
              <p className="text-2xl font-bold text-gray-900">
                {optimization ? formatCurrency(optimization.optimalSavings) : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Your RRSP Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Contribution Room (from NOA)</label>
            <input
              type="number"
              value={contributionRoom}
              onChange={(e) => setContributionRoomInput(e.target.value)}
              className="input-field"
              placeholder="Enter your RRSP room"
            />
          </div>
          <div>
            <label className="label">Contributions Made This Year</label>
            <input
              type="number"
              value={contributionsMade}
              onChange={(e) => setContributionsMadeInput(e.target.value)}
              className="input-field"
              placeholder="0"
            />
          </div>
          <div className="flex items-end">
            <button onClick={handleUpdateRoom} className="btn-primary w-full">
              Update
            </button>
          </div>
        </div>
      </div>

      {optimization && (
        <div className="card bg-gradient-to-r from-primary-50 to-purple-50 border-primary-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Info className="text-primary-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Recommendation</h3>
              <p className="text-gray-700 mt-1">{optimization.recommendation}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Tax Bracket Visualization</h2>
          {bracketChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bracketChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                <Bar dataKey="federal" name="Federal" stackId="a" fill="#3b82f6" />
                <Bar dataKey="provincial" name="Provincial" stackId="a" fill="#8b5cf6">
                  {bracketChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.isCurrentBracket ? '#22c55e' : '#8b5cf6'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Add income to see tax bracket visualization
            </div>
          )}
          <p className="text-sm text-gray-600 mt-2 text-center">
            Green bar indicates your current tax bracket
          </p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Tax Savings by Contribution</h2>
          {optimization && optimization.scenarios.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={optimization.scenarios}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="contribution" 
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `Contribution: ${formatCurrency(label)}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="taxSavings" 
                  name="Tax Savings"
                  stroke="#22c55e" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Enter your RRSP room to see savings projections
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Contribution Simulator</h2>
        <div className="space-y-4">
          <div>
            <label className="label">
              Simulated Contribution: {formatCurrency(simulatedContribution)}
            </label>
            <input
              type="range"
              min="0"
              max={remainingRoom}
              step="100"
              value={simulatedContribution}
              onChange={(e) => setSimulatedContribution(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>$0</span>
              <span>{formatCurrency(remainingRoom)}</span>
            </div>
          </div>

          {optimization && simulatedContribution > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">New Taxable Income</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(taxableIncome - simulatedContribution)}
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Estimated Tax Savings</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(simulatedContribution * optimization.currentMarginalRate)}
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Net Cost</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(simulatedContribution * (1 - optimization.currentMarginalRate))}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
