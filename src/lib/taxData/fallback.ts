import type { TaxData } from '../types';

export const FALLBACK_TAX_DATA_2024: TaxData = {
  year: 2024,
  federal: {
    brackets: [
      { min: 0, max: 55867, rate: 0.15 },
      { min: 55867, max: 111733, rate: 0.205 },
      { min: 111733, max: 173205, rate: 0.26 },
      { min: 173205, max: 246752, rate: 0.29 },
      { min: 246752, max: Infinity, rate: 0.33 },
    ],
    basicPersonalAmount: 15705,
    cpp: {
      maxPensionableEarnings: 68500,
      rate: 0.0595,
      exemption: 3500,
      maxContribution: 3867.50,
    },
    ei: {
      maxInsurableEarnings: 63200,
      rate: 0.0166,
      maxPremium: 1049.12,
    },
  },
  provinces: {
    AB: {
      brackets: [
        { min: 0, max: 148269, rate: 0.10 },
        { min: 148269, max: 177922, rate: 0.12 },
        { min: 177922, max: 237230, rate: 0.13 },
        { min: 237230, max: 355845, rate: 0.14 },
        { min: 355845, max: Infinity, rate: 0.15 },
      ],
      basicPersonalAmount: 21003,
    },
    BC: {
      brackets: [
        { min: 0, max: 47937, rate: 0.0506 },
        { min: 47937, max: 95875, rate: 0.077 },
        { min: 95875, max: 110076, rate: 0.105 },
        { min: 110076, max: 133664, rate: 0.1229 },
        { min: 133664, max: 181232, rate: 0.147 },
        { min: 181232, max: 252752, rate: 0.168 },
        { min: 252752, max: Infinity, rate: 0.205 },
      ],
      basicPersonalAmount: 12580,
    },
    MB: {
      brackets: [
        { min: 0, max: 47000, rate: 0.108 },
        { min: 47000, max: 100000, rate: 0.1275 },
        { min: 100000, max: Infinity, rate: 0.174 },
      ],
      basicPersonalAmount: 15780,
    },
    NB: {
      brackets: [
        { min: 0, max: 49958, rate: 0.094 },
        { min: 49958, max: 99916, rate: 0.14 },
        { min: 99916, max: 185064, rate: 0.16 },
        { min: 185064, max: Infinity, rate: 0.195 },
      ],
      basicPersonalAmount: 13044,
    },
    NL: {
      brackets: [
        { min: 0, max: 43198, rate: 0.087 },
        { min: 43198, max: 86395, rate: 0.145 },
        { min: 86395, max: 154244, rate: 0.158 },
        { min: 154244, max: 215943, rate: 0.178 },
        { min: 215943, max: 275870, rate: 0.198 },
        { min: 275870, max: 551739, rate: 0.208 },
        { min: 551739, max: 1103478, rate: 0.213 },
        { min: 1103478, max: Infinity, rate: 0.218 },
      ],
      basicPersonalAmount: 10818,
    },
    NS: {
      brackets: [
        { min: 0, max: 29590, rate: 0.0879 },
        { min: 29590, max: 59180, rate: 0.1495 },
        { min: 59180, max: 93000, rate: 0.1667 },
        { min: 93000, max: 150000, rate: 0.175 },
        { min: 150000, max: Infinity, rate: 0.21 },
      ],
      basicPersonalAmount: 8481,
    },
    NT: {
      brackets: [
        { min: 0, max: 50597, rate: 0.059 },
        { min: 50597, max: 101198, rate: 0.086 },
        { min: 101198, max: 164525, rate: 0.122 },
        { min: 164525, max: Infinity, rate: 0.1405 },
      ],
      basicPersonalAmount: 17373,
    },
    NU: {
      brackets: [
        { min: 0, max: 53268, rate: 0.04 },
        { min: 53268, max: 106537, rate: 0.07 },
        { min: 106537, max: 173205, rate: 0.09 },
        { min: 173205, max: Infinity, rate: 0.115 },
      ],
      basicPersonalAmount: 18767,
    },
    ON: {
      brackets: [
        { min: 0, max: 51446, rate: 0.0505 },
        { min: 51446, max: 102894, rate: 0.0915 },
        { min: 102894, max: 150000, rate: 0.1116 },
        { min: 150000, max: 220000, rate: 0.1216 },
        { min: 220000, max: Infinity, rate: 0.1316 },
      ],
      basicPersonalAmount: 12399,
      surtax: {
        threshold1: 5554,
        rate1: 0.20,
        threshold2: 7108,
        rate2: 0.36,
      },
    },
    PE: {
      brackets: [
        { min: 0, max: 32656, rate: 0.0965 },
        { min: 32656, max: 64313, rate: 0.1363 },
        { min: 64313, max: 105000, rate: 0.1665 },
        { min: 105000, max: 140000, rate: 0.18 },
        { min: 140000, max: Infinity, rate: 0.1875 },
      ],
      basicPersonalAmount: 13500,
    },
    QC: {
      brackets: [
        { min: 0, max: 51780, rate: 0.14 },
        { min: 51780, max: 103545, rate: 0.19 },
        { min: 103545, max: 126000, rate: 0.24 },
        { min: 126000, max: Infinity, rate: 0.2575 },
      ],
      basicPersonalAmount: 18056,
    },
    SK: {
      brackets: [
        { min: 0, max: 52057, rate: 0.105 },
        { min: 52057, max: 148734, rate: 0.125 },
        { min: 148734, max: Infinity, rate: 0.145 },
      ],
      basicPersonalAmount: 18491,
    },
    YT: {
      brackets: [
        { min: 0, max: 55867, rate: 0.064 },
        { min: 55867, max: 111733, rate: 0.09 },
        { min: 111733, max: 173205, rate: 0.109 },
        { min: 173205, max: 500000, rate: 0.128 },
        { min: 500000, max: Infinity, rate: 0.15 },
      ],
      basicPersonalAmount: 15705,
    },
  },
  rrsp: {
    maxContribution: 31560,
    percentageLimit: 0.18,
  },
  mileageRates: {
    first5000km: 0.70,
    after5000km: 0.64,
  },
  lastUpdated: '2024-01-15',
  source: 'CRA Official - Fallback Data',
};

export const FALLBACK_TAX_DATA_2025: TaxData = {
  ...FALLBACK_TAX_DATA_2024,
  year: 2025,
  federal: {
    brackets: [
      { min: 0, max: 57375, rate: 0.15 },
      { min: 57375, max: 114750, rate: 0.205 },
      { min: 114750, max: 177882, rate: 0.26 },
      { min: 177882, max: 253414, rate: 0.29 },
      { min: 253414, max: Infinity, rate: 0.33 },
    ],
    basicPersonalAmount: 16129,
    cpp: {
      maxPensionableEarnings: 71300,
      rate: 0.0595,
      exemption: 3500,
      maxContribution: 4034.10,
    },
    ei: {
      maxInsurableEarnings: 65700,
      rate: 0.0164,
      maxPremium: 1077.48,
    },
  },
  rrsp: {
    maxContribution: 32490,
    percentageLimit: 0.18,
  },
  lastUpdated: '2025-01-01',
};

export function getFallbackTaxData(year: number): TaxData {
  if (year >= 2025) return FALLBACK_TAX_DATA_2025;
  return FALLBACK_TAX_DATA_2024;
}
