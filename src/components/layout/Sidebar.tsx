import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  DollarSign,
  Receipt,
  PiggyBank,
  Gift,
  Users,
  Calculator,
  FileText,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/income', icon: DollarSign, label: 'Income' },
  { to: '/expenses', icon: Receipt, label: 'Expenses' },
  { to: '/rrsp', icon: PiggyBank, label: 'RRSP Optimizer' },
  { to: '/credits', icon: Gift, label: 'Tax Credits' },
  { to: '/family', icon: Users, label: 'Family' },
  { to: '/gst-hst', icon: Calculator, label: 'GST/HST' },
  { to: '/reports', icon: FileText, label: 'Reports' },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full pt-16 lg:pt-4">
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-3 border-t border-gray-200">
            <NavLink
              to="/settings"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Settings size={20} />
              Settings
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
}
