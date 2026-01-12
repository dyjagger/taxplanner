import { Menu, X, Leaf, HelpCircle } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { PROVINCE_LIST, TAX_YEARS } from '../../lib/constants/provinces';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onHelpClick?: () => void;
}

export function Header({ sidebarOpen, setSidebarOpen, onHelpClick }: HeaderProps) {
  const { profile, setTaxYear, setProvince } = useUserStore();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
              Canadian Tax Planner
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="taxYear" className="text-sm text-gray-600 hidden sm:block">
              Tax Year:
            </label>
            <select
              id="taxYear"
              value={profile.taxYear}
              onChange={(e) => setTaxYear(Number(e.target.value))}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {TAX_YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="province" className="text-sm text-gray-600 hidden sm:block">
              Province:
            </label>
            <select
              id="province"
              value={profile.province}
              onChange={(e) => setProvince(e.target.value as typeof profile.province)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {PROVINCE_LIST.map((prov) => (
                <option key={prov.code} value={prov.code}>
                  {prov.code}
                </option>
              ))}
            </select>
          </div>

          {onHelpClick && (
            <button
              onClick={onHelpClick}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
              title="Show tutorial"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Help</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
