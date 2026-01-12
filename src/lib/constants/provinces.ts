import type { ProvinceCode } from '../types';

export interface ProvinceInfo {
  code: ProvinceCode;
  name: string;
  hstRate?: number;
  gstRate: number;
  pstRate?: number;
}

export const PROVINCES: Record<ProvinceCode, ProvinceInfo> = {
  AB: { code: 'AB', name: 'Alberta', gstRate: 0.05 },
  BC: { code: 'BC', name: 'British Columbia', gstRate: 0.05, pstRate: 0.07 },
  MB: { code: 'MB', name: 'Manitoba', gstRate: 0.05, pstRate: 0.07 },
  NB: { code: 'NB', name: 'New Brunswick', hstRate: 0.15, gstRate: 0.05 },
  NL: { code: 'NL', name: 'Newfoundland and Labrador', hstRate: 0.15, gstRate: 0.05 },
  NS: { code: 'NS', name: 'Nova Scotia', hstRate: 0.15, gstRate: 0.05 },
  NT: { code: 'NT', name: 'Northwest Territories', gstRate: 0.05 },
  NU: { code: 'NU', name: 'Nunavut', gstRate: 0.05 },
  ON: { code: 'ON', name: 'Ontario', hstRate: 0.13, gstRate: 0.05 },
  PE: { code: 'PE', name: 'Prince Edward Island', hstRate: 0.15, gstRate: 0.05 },
  QC: { code: 'QC', name: 'Quebec', gstRate: 0.05, pstRate: 0.09975 },
  SK: { code: 'SK', name: 'Saskatchewan', gstRate: 0.05, pstRate: 0.06 },
  YT: { code: 'YT', name: 'Yukon', gstRate: 0.05 },
};

export const PROVINCE_LIST = Object.values(PROVINCES).sort((a, b) => 
  a.name.localeCompare(b.name)
);

export const TAX_YEARS = [2025, 2024, 2023] as const;
