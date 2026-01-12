import type { ExpenseCategory } from '../types';

export interface ExpenseCategoryInfo {
  id: ExpenseCategory;
  name: string;
  description: string;
  t2125Line?: string;
  deductionRate: number;
}

export const EXPENSE_CATEGORIES: ExpenseCategoryInfo[] = [
  {
    id: 'advertising',
    name: 'Advertising',
    description: 'Advertising and promotion costs',
    t2125Line: '8521',
    deductionRate: 1,
  },
  {
    id: 'meals_entertainment',
    name: 'Meals & Entertainment',
    description: 'Business meals and entertainment (50% deductible)',
    t2125Line: '8523',
    deductionRate: 0.5,
  },
  {
    id: 'vehicle',
    name: 'Motor Vehicle Expenses',
    description: 'Gas, insurance, repairs, parking for business use',
    t2125Line: '9281',
    deductionRate: 1,
  },
  {
    id: 'business_tax',
    name: 'Business Tax, Fees, Licences',
    description: 'Business taxes, licences, memberships',
    t2125Line: '8760',
    deductionRate: 1,
  },
  {
    id: 'insurance',
    name: 'Insurance',
    description: 'Business insurance premiums',
    t2125Line: '8690',
    deductionRate: 1,
  },
  {
    id: 'interest_bank',
    name: 'Interest & Bank Charges',
    description: 'Interest on business loans, bank fees',
    t2125Line: '8710',
    deductionRate: 1,
  },
  {
    id: 'office',
    name: 'Office Expenses',
    description: 'Office supplies, postage, stationery',
    t2125Line: '8810',
    deductionRate: 1,
  },
  {
    id: 'supplies',
    name: 'Supplies',
    description: 'Materials and supplies used in business',
    t2125Line: '8811',
    deductionRate: 1,
  },
  {
    id: 'professional_fees',
    name: 'Professional Fees',
    description: 'Legal, accounting, consulting fees',
    t2125Line: '8860',
    deductionRate: 1,
  },
  {
    id: 'telephone_utilities',
    name: 'Telephone & Utilities',
    description: 'Phone, internet, electricity for business',
    t2125Line: '8220',
    deductionRate: 1,
  },
  {
    id: 'travel',
    name: 'Travel',
    description: 'Business travel expenses',
    t2125Line: '9200',
    deductionRate: 1,
  },
  {
    id: 'rent',
    name: 'Rent',
    description: 'Rent for business premises',
    t2125Line: '8910',
    deductionRate: 1,
  },
  {
    id: 'salaries',
    name: 'Salaries, Wages, Benefits',
    description: 'Employee compensation',
    t2125Line: '9060',
    deductionRate: 1,
  },
  {
    id: 'property_tax',
    name: 'Property Taxes',
    description: 'Property taxes on business property',
    t2125Line: '9180',
    deductionRate: 1,
  },
  {
    id: 'home_office',
    name: 'Business-use-of-home Expenses',
    description: 'Home office expenses',
    t2125Line: '9945',
    deductionRate: 1,
  },
  {
    id: 'other',
    name: 'Other Expenses',
    description: 'Other deductible business expenses',
    t2125Line: '9270',
    deductionRate: 1,
  },
];

export const EXPENSE_CATEGORY_MAP = EXPENSE_CATEGORIES.reduce(
  (acc, cat) => ({ ...acc, [cat.id]: cat }),
  {} as Record<ExpenseCategory, ExpenseCategoryInfo>
);
