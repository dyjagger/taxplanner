import { useState } from 'react';
import { 
  DollarSign, 
  TrendingDown, 
  Calculator, 
  PiggyBank,
  ArrowRight,
  RefreshCw,
  Plus,
  Receipt
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';
import { useIncomeStore } from '../../stores/incomeStore';
import { useExpenseStore } from '../../stores/expenseStore';
import { useRRSPStore } from '../../stores/rrspStore';
import { useTaxDataStore } from '../../stores/taxDataStore';
import { TaxSummaryCard } from './TaxSummaryCard';
import { QuickActions } from './QuickActions';
import { PROVINCES } from '../../lib/constants/provinces';
import { QuickAddModal } from '../ui/QuickAddModal';

export function DashboardHome() {
  const [quickAddType, setQuickAddType] = useState<'income' | 'expense' | null>(null);
  const { profile } = useUserStore();
  const { getTotalIncome, getTotalTaxWithheld } = useIncomeStore();
  const { getDeductibleExpenses } = useExpenseStore();
  const { getRemainingRoom } = useRRSPStore();
  const { data: taxData, loading, refreshTaxData, dataAge } = useTaxDataStore();

  const totalIncome = getTotalIncome();
  const totalDeductions = getDeductibleExpenses();
  const taxableIncome = Math.max(0, totalIncome - totalDeductions);
  const rrspRoom = getRemainingRoom();
  const taxWithheld = getTotalTaxWithheld();

  const provinceName = PROVINCES[profile.province]?.name || profile.province;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tax Dashboard - {profile.taxYear}
          </h1>
          <p className="text-gray-600 mt-1">
            {provinceName} • Overview of your tax situation
          </p>
        </div>
        
        <button
          onClick={() => refreshTaxData(profile.taxYear)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Updating...' : 'Refresh Tax Data'}
        </button>
      </div>

      {dataAge > 180 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <span className="text-amber-600 text-xl">⚠️</span>
          <div>
            <p className="font-medium text-amber-800">Tax data may be outdated</p>
            <p className="text-sm text-amber-700">
              Your tax data is {dataAge} days old. Consider refreshing to ensure accuracy.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TaxSummaryCard
          title="Total Income"
          value={totalIncome}
          icon={DollarSign}
          color="blue"
          link="/income"
        />
        <TaxSummaryCard
          title="Total Deductions"
          value={totalDeductions}
          icon={TrendingDown}
          color="green"
          link="/expenses"
        />
        <TaxSummaryCard
          title="Taxable Income"
          value={taxableIncome}
          icon={Calculator}
          color="purple"
        />
        <TaxSummaryCard
          title="RRSP Room"
          value={rrspRoom}
          icon={PiggyBank}
          color="orange"
          link="/rrsp"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Tax Estimate Summary
            </h2>
            
            {taxData ? (
              <TaxEstimateSummary
                taxableIncome={taxableIncome}
                taxWithheld={taxWithheld}
                taxData={taxData}
                province={profile.province}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                {loading ? 'Loading tax data...' : 'No tax data available'}
              </div>
            )}
          </div>
        </div>

        <div>
          <QuickActions />
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Getting Started</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GettingStartedStep
            step={1}
            title="Add Income"
            description="Enter your T4, T5, and other income slips"
            link="/income"
            completed={totalIncome > 0}
          />
          <GettingStartedStep
            step={2}
            title="Track Expenses"
            description="Log business expenses for deductions"
            link="/expenses"
            completed={totalDeductions > 0}
          />
          <GettingStartedStep
            step={3}
            title="Optimize RRSP"
            description="Find your optimal RRSP contribution"
            link="/rrsp"
            completed={false}
          />
          <GettingStartedStep
            step={4}
            title="Generate Reports"
            description="Export T2125 and tax summaries"
            link="/reports"
            completed={false}
          />
        </div>
      </div>

      {/* Floating Quick Add Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button
          onClick={() => setQuickAddType('expense')}
          className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all hover:scale-105"
          title="Quick add expense"
        >
          <Receipt className="w-5 h-5" />
          <span className="hidden sm:inline">Add Expense</span>
        </button>
        <button
          onClick={() => setQuickAddType('income')}
          className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all hover:scale-105"
          title="Quick add income"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add Income</span>
        </button>
      </div>

      {/* Quick Add Modal */}
      {quickAddType && (
        <QuickAddModal
          isOpen={!!quickAddType}
          onClose={() => setQuickAddType(null)}
          type={quickAddType}
        />
      )}
    </div>
  );
}

interface TaxEstimateSummaryProps {
  taxableIncome: number;
  taxWithheld: number;
  taxData: any;
  province: string;
}

function TaxEstimateSummary({ taxableIncome, taxWithheld, taxData, province }: TaxEstimateSummaryProps) {
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount);

  const federalTax = calculateSimpleTax(taxableIncome, taxData.federal.brackets);
  const provincialData = taxData.provinces[province];
  const provincialTax = provincialData 
    ? calculateSimpleTax(taxableIncome, provincialData.brackets)
    : 0;
  
  const federalBPA = taxData.federal.basicPersonalAmount * taxData.federal.brackets[0].rate;
  const provincialBPA = provincialData 
    ? provincialData.basicPersonalAmount * provincialData.brackets[0].rate
    : 0;

  const netFederalTax = Math.max(0, federalTax - federalBPA);
  const netProvincialTax = Math.max(0, provincialTax - provincialBPA);
  const totalTax = netFederalTax + netProvincialTax;
  const balanceOwing = totalTax - taxWithheld;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Federal Tax</p>
          <p className="text-xl font-semibold text-gray-900">{formatCurrency(netFederalTax)}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Provincial Tax</p>
          <p className="text-xl font-semibold text-gray-900">{formatCurrency(netProvincialTax)}</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Total Tax</span>
          <span className="font-semibold">{formatCurrency(totalTax)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Tax Withheld</span>
          <span className="font-semibold text-green-600">-{formatCurrency(taxWithheld)}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="font-medium text-gray-900">
            {balanceOwing >= 0 ? 'Balance Owing' : 'Estimated Refund'}
          </span>
          <span className={`text-xl font-bold ${balanceOwing >= 0 ? 'text-red-600' : 'text-green-600'}`}>
            {formatCurrency(Math.abs(balanceOwing))}
          </span>
        </div>
      </div>

      {taxableIncome > 0 && (
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600">
            Effective Tax Rate: <span className="font-medium">{((totalTax / taxableIncome) * 100).toFixed(1)}%</span>
          </p>
        </div>
      )}
    </div>
  );
}

function calculateSimpleTax(income: number, brackets: Array<{ min: number; max: number; rate: number }>) {
  let tax = 0;
  let previousMax = 0;

  for (const bracket of brackets) {
    if (income <= previousMax) break;
    const taxableInBracket = Math.min(income, bracket.max) - previousMax;
    if (taxableInBracket > 0) {
      tax += taxableInBracket * bracket.rate;
    }
    previousMax = bracket.max;
  }

  return tax;
}

interface GettingStartedStepProps {
  step: number;
  title: string;
  description: string;
  link: string;
  completed: boolean;
}

function GettingStartedStep({ step, title, description, link, completed }: GettingStartedStepProps) {
  return (
    <Link
      to={link}
      className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
        completed 
          ? 'border-green-200 bg-green-50' 
          : 'border-gray-200 hover:border-primary-300'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          completed 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-200 text-gray-600'
        }`}>
          {completed ? '✓' : step}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        <ArrowRight size={16} className="text-gray-400 mt-1" />
      </div>
    </Link>
  );
}
