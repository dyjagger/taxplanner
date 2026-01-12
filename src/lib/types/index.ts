import { z } from 'zod';

export const ProvinceCode = z.enum([
  'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'
]);
export type ProvinceCode = z.infer<typeof ProvinceCode>;

export const TaxBracketSchema = z.object({
  min: z.number(),
  max: z.number(),
  rate: z.number().min(0).max(1),
});
export type TaxBracket = z.infer<typeof TaxBracketSchema>;

export const FederalTaxDataSchema = z.object({
  brackets: z.array(TaxBracketSchema),
  basicPersonalAmount: z.number(),
  cpp: z.object({
    maxPensionableEarnings: z.number(),
    rate: z.number(),
    exemption: z.number(),
    maxContribution: z.number(),
  }),
  ei: z.object({
    maxInsurableEarnings: z.number(),
    rate: z.number(),
    maxPremium: z.number(),
  }),
});
export type FederalTaxData = z.infer<typeof FederalTaxDataSchema>;

export const ProvincialTaxDataSchema = z.object({
  brackets: z.array(TaxBracketSchema),
  basicPersonalAmount: z.number(),
  surtax: z.optional(z.object({
    threshold1: z.number(),
    rate1: z.number(),
    threshold2: z.number(),
    rate2: z.number(),
  })),
});
export type ProvincialTaxData = z.infer<typeof ProvincialTaxDataSchema>;

export const TaxDataSchema = z.object({
  year: z.number(),
  federal: FederalTaxDataSchema,
  provinces: z.record(ProvinceCode, ProvincialTaxDataSchema),
  rrsp: z.object({
    maxContribution: z.number(),
    percentageLimit: z.number(),
  }),
  mileageRates: z.object({
    first5000km: z.number(),
    after5000km: z.number(),
  }),
  lastUpdated: z.string(),
  source: z.string(),
});
export type TaxData = z.infer<typeof TaxDataSchema>;

export interface IncomeEntry {
  id: string;
  type: 'employment' | 'self-employment' | 'investment' | 'other';
  description: string;
  amount: number;
  taxWithheld?: number;
  slipType?: string;
}

export interface ExpenseEntry {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  receiptId?: string;
}

export type ExpenseCategory =
  | 'advertising'
  | 'meals_entertainment'
  | 'vehicle'
  | 'business_tax'
  | 'insurance'
  | 'interest_bank'
  | 'office'
  | 'supplies'
  | 'professional_fees'
  | 'telephone_utilities'
  | 'travel'
  | 'rent'
  | 'salaries'
  | 'property_tax'
  | 'home_office'
  | 'other';

export interface RRSPData {
  contributionRoom: number;
  contributionsMade: number;
  previousYearUnused: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'spouse' | 'child' | 'dependent';
  dateOfBirth: string;
  income?: number;
  hasDisability?: boolean;
}

export interface TaxCredit {
  id: string;
  type: string;
  amount: number;
  description: string;
}

export interface UserProfile {
  taxYear: number;
  province: ProvinceCode;
  name: string;
  sin?: string;
  dateOfBirth?: string;
}

export interface TaxSummary {
  totalIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  federalTax: number;
  provincialTax: number;
  totalTax: number;
  cppContributions: number;
  eiPremiums: number;
  taxWithheld: number;
  balanceOwing: number;
  marginalRate: number;
  effectiveRate: number;
}

export interface GSTHSTData {
  isRegistered: boolean;
  businessNumber?: string;
  reportingPeriod: 'annual' | 'quarterly' | 'monthly';
  revenues: number;
  gstCollected: number;
  itcsClaimed: number;
}
