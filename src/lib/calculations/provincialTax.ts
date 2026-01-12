import type { TaxBracket, ProvincialTaxData } from '../types';

export function calculateProvincialTax(
  taxableIncome: number,
  provincialData: ProvincialTaxData
): number {
  if (taxableIncome <= 0) return 0;
  
  let tax = 0;
  let previousMax = 0;
  
  for (const bracket of provincialData.brackets) {
    if (taxableIncome <= previousMax) break;
    
    const taxableInBracket = Math.min(taxableIncome, bracket.max) - previousMax;
    if (taxableInBracket > 0) {
      tax += taxableInBracket * bracket.rate;
    }
    previousMax = bracket.max;
  }
  
  if (provincialData.surtax) {
    const { threshold1, rate1, threshold2, rate2 } = provincialData.surtax;
    if (tax > threshold2) {
      tax += (tax - threshold2) * rate2 + (threshold2 - threshold1) * rate1;
    } else if (tax > threshold1) {
      tax += (tax - threshold1) * rate1;
    }
  }
  
  return Math.max(0, tax);
}

export function calculateProvincialBasicPersonalAmountCredit(
  provincialData: ProvincialTaxData
): number {
  return provincialData.basicPersonalAmount * provincialData.brackets[0].rate;
}

export function calculateProvincialTaxPayable(
  taxableIncome: number,
  provincialData: ProvincialTaxData,
  nonRefundableCredits: number = 0
): number {
  const grossTax = calculateProvincialTax(taxableIncome, provincialData);
  const bpaCredit = calculateProvincialBasicPersonalAmountCredit(provincialData);
  const totalCredits = bpaCredit + nonRefundableCredits;
  
  return Math.max(0, grossTax - totalCredits);
}

export function getProvincialMarginalRate(
  taxableIncome: number,
  brackets: TaxBracket[]
): number {
  for (const bracket of brackets) {
    if (taxableIncome <= bracket.max) {
      return bracket.rate;
    }
  }
  return brackets[brackets.length - 1].rate;
}

export function getCombinedMarginalRate(
  taxableIncome: number,
  federalBrackets: TaxBracket[],
  provincialBrackets: TaxBracket[]
): number {
  let federalRate = 0;
  let provincialRate = 0;
  
  for (const bracket of federalBrackets) {
    if (taxableIncome <= bracket.max) {
      federalRate = bracket.rate;
      break;
    }
    federalRate = bracket.rate;
  }
  
  for (const bracket of provincialBrackets) {
    if (taxableIncome <= bracket.max) {
      provincialRate = bracket.rate;
      break;
    }
    provincialRate = bracket.rate;
  }
  
  return federalRate + provincialRate;
}
