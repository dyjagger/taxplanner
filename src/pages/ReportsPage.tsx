import { FileText, Download, PieChart, BarChart3 } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useIncomeStore } from '../stores/incomeStore';
import { useExpenseStore } from '../stores/expenseStore';
import { useUserStore } from '../stores/userStore';
import { EXPENSE_CATEGORY_MAP } from '../lib/constants/expenseCategories';
import { PROVINCES } from '../lib/constants/provinces';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export function ReportsPage() {
  const { profile } = useUserStore();
  const { entries: incomeEntries, getTotalIncome, getTotalTaxWithheld } = useIncomeStore();
  const { entries: expenseEntries, getTotalExpenses, getDeductibleExpenses } = useExpenseStore();

  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const deductibleExpenses = getDeductibleExpenses();
  const taxableIncome = Math.max(0, totalIncome - deductibleExpenses);
  const taxWithheld = getTotalTaxWithheld();

  const provinceName = PROVINCES[profile.province]?.name || profile.province;

  const incomeByType = incomeEntries.reduce((acc, entry) => {
    const type = entry.type;
    acc[type] = (acc[type] || 0) + entry.amount;
    return acc;
  }, {} as Record<string, number>);

  const expensesByCategory = expenseEntries.reduce((acc, entry) => {
    const catInfo = EXPENSE_CATEGORY_MAP[entry.category];
    const name = catInfo?.name || entry.category;
    acc[name] = (acc[name] || 0) + entry.amount;
    return acc;
  }, {} as Record<string, number>);

  const incomeChartData = Object.entries(incomeByType).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' '),
    value,
  }));

  const expenseChartData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount);

  const handleExportCSV = () => {
    const headers = ['Type', 'Description', 'Amount', 'Date'];
    const incomeRows = incomeEntries.map(e => ['Income', e.description, e.amount, '']);
    const expenseRows = expenseEntries.map(e => ['Expense', e.description, e.amount, e.date]);
    
    const csvContent = [
      headers.join(','),
      ...incomeRows.map(r => r.join(',')),
      ...expenseRows.map(r => r.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-data-${profile.taxYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const data = {
      taxYear: profile.taxYear,
      province: profile.province,
      income: incomeEntries,
      expenses: expenseEntries,
      summary: {
        totalIncome,
        totalExpenses,
        deductibleExpenses,
        taxableIncome,
        taxWithheld,
      },
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-data-${profile.taxYear}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">
            Tax summary and exports for {profile.taxYear} - {provinceName}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="btn-secondary flex items-center gap-2">
            <Download size={18} />
            Export CSV
          </button>
          <button onClick={handleExportJSON} className="btn-primary flex items-center gap-2">
            <Download size={18} />
            Export JSON
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText size={20} />
          Tax Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Income</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Deductible Expenses</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(deductibleExpenses)}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Taxable Income</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(taxableIncome)}</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600">Tax Withheld</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(taxWithheld)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieChart size={20} />
            Income Breakdown
          </h2>
          {incomeChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={incomeChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {incomeChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </RechartsPie>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No income data to display
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 size={20} />
            Expense Breakdown
          </h2>
          {expenseChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={expenseChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {expenseChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </RechartsPie>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No expense data to display
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">T2125 Summary (Business Income)</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Line</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Description</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-2 text-gray-600">8299</td>
                <td className="py-3 px-2">Gross Business Income</td>
                <td className="py-3 px-2 text-right font-medium">{formatCurrency(totalIncome)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-2 text-gray-600">9368</td>
                <td className="py-3 px-2">Total Business Expenses</td>
                <td className="py-3 px-2 text-right font-medium">{formatCurrency(deductibleExpenses)}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-3 px-2 text-gray-600 font-medium">9369</td>
                <td className="py-3 px-2 font-medium">Net Business Income</td>
                <td className="py-3 px-2 text-right font-bold text-lg">{formatCurrency(taxableIncome)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <FileText className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-gray-900">PDF Generation</h3>
            <p className="text-sm text-gray-700 mt-1">
              Full T2125 PDF generation and Schedule 1 preview will be available in a future update.
              For now, use the CSV/JSON export to import data into tax preparation software.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
