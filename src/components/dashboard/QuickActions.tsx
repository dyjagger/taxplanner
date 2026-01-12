import { Link } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  Calculator, 
  Download,
  PiggyBank,
  Receipt
} from 'lucide-react';

const actions = [
  { icon: Plus, label: 'Add Income', link: '/income', color: 'text-blue-600 bg-blue-50' },
  { icon: Receipt, label: 'Add Expense', link: '/expenses', color: 'text-green-600 bg-green-50' },
  { icon: PiggyBank, label: 'RRSP Calculator', link: '/rrsp', color: 'text-purple-600 bg-purple-50' },
  { icon: Calculator, label: 'Tax Estimate', link: '/reports', color: 'text-orange-600 bg-orange-50' },
  { icon: FileText, label: 'Generate T2125', link: '/reports', color: 'text-red-600 bg-red-50' },
  { icon: Download, label: 'Export Data', link: '/reports', color: 'text-gray-600 bg-gray-50' },
];

export function QuickActions() {
  return (
    <div className="card h-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="space-y-2">
        {actions.map((action) => (
          <Link
            key={action.label}
            to={action.link}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`p-2 rounded-lg ${action.color}`}>
              <action.icon size={18} />
            </div>
            <span className="font-medium text-gray-700">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
