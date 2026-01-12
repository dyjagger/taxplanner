import type { TaxBracket, FederalTaxData } from '../types';

export function calculateFederalTax(taxableIncome: number, federalData: FederalTaxData): number {
  if (taxableIncome <= 0) return 0;
  
  let tax = 0;
  let previousMax = 0;
  
  for (const bracket of federalData.brackets) {
    if (taxableIncome <= previousMax) break;
    
    const taxableInBracket = Math.min(taxableIncome, bracket.max) - previousMax;
    if (taxableInBracket > 0) {
      tax += taxableInBracket * bracket.rate;
    }
    previousMax = bracket.max;
  }
  
  return Math.max(0, tax);
}

export function calculateBasicPersonalAmountCredit(
  federalData: FederalTaxData
): number {
  return federalData.basicPersonalAmount * federalData.brackets[0].rate;
}

export function calculateFederalTaxPayable(
  taxableIncome: number,
  federalData: FederalTaxData,
  nonRefundableCredits: number = 0
): number {
  const grossTax = calculateFederalTax(taxableIncome, federalData);
  const bpaCredit = calculateBasicPersonalAmountCredit(federalData);
  const totalCredits = bpaCredit + nonRefundableCredits;
  
  return Math.max(0, grossTax - totalCredits);
}

export function getFederalMarginalRate(
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

export function calculateCPPContribution(
  pensionableEarnings: number,
  cppData: FederalTaxData['cpp'],
  isSelfEmployed: boolean = false
): number {
  const earnings = Math.min(pensionableEarnings, cppData.maxPensionableEarnings);
  const contributoryEarnings = Math.max(0, earnings - cppData.exemption);
  const rate = isSelfEmployed ? cppData.rate * 2 : cppData.rate;
  const maxContribution = isSelfEmployed ? cppData.maxContribution * 2 : cppData.maxContribution;
  
  return Math.min(contributoryEarnings * rate, maxContribution);
}

export function calculateEIPremium(
  insurableEarnings: number,
  eiData: FederalTaxData['ei'],
  isSelfEmployed: boolean = false
): number {
  if (isSelfEmployed) return 0;
  
  const earnings = Math.min(insurableEarnings, eiData.maxInsurableEarnings);
  return Math.min(earnings * eiData.rate, eiData.maxPremium);
}
