import type { TaxData, ProvinceCode } from '../types';
import { calculateFederalTaxPayable } from './federalTax';
import { calculateProvincialTaxPayable } from './provincialTax';
import { getCombinedMarginalRate } from './provincialTax';

export interface RRSPScenario {
  contribution: number;
  adjustedIncome: number;
  federalTax: number;
  provincialTax: number;
  totalTax: number;
  taxSavings: number;
  marginalRate: number;
  effectiveRate: number;
}

export interface RRSPOptimizationResult {
  currentTax: number;
  currentMarginalRate: number;
  scenarios: RRSPScenario[];
  optimalContribution: number;
  optimalSavings: number;
  recommendation: string;
}

export function calculateRRSPOptimization(
  grossIncome: number,
  contributionRoom: number,
  province: ProvinceCode,
  taxData: TaxData
): RRSPOptimizationResult {
  const federalData = taxData.federal;
  const provincialData = taxData.provinces[province];
  
  if (!provincialData) {
    throw new Error(`No tax data for province: ${province}`);
  }
  
  const currentFederalTax = calculateFederalTaxPayable(grossIncome, federalData);
  const currentProvincialTax = calculateProvincialTaxPayable(grossIncome, provincialData);
  const currentTax = currentFederalTax + currentProvincialTax;
  const currentMarginalRate = getCombinedMarginalRate(
    grossIncome,
    federalData.brackets,
    provincialData.brackets
  );
  
  const scenarios: RRSPScenario[] = [];
  const maxContribution = Math.min(contributionRoom, grossIncome * 0.9);
  const step = Math.max(1000, Math.floor(maxContribution / 20));
  
  for (let contribution = 0; contribution <= maxContribution; contribution += step) {
    const adjustedIncome = grossIncome - contribution;
    const federalTax = calculateFederalTaxPayable(adjustedIncome, federalData);
    const provincialTax = calculateProvincialTaxPayable(adjustedIncome, provincialData);
    const totalTax = federalTax + provincialTax;
    const taxSavings = currentTax - totalTax;
    const marginalRate = getCombinedMarginalRate(
      adjustedIncome,
      federalData.brackets,
      provincialData.brackets
    );
    const effectiveRate = adjustedIncome > 0 ? totalTax / adjustedIncome : 0;
    
    scenarios.push({
      contribution,
      adjustedIncome,
      federalTax,
      provincialTax,
      totalTax,
      taxSavings,
      marginalRate,
      effectiveRate,
    });
  }
  
  if (maxContribution > 0 && scenarios[scenarios.length - 1]?.contribution !== maxContribution) {
    const adjustedIncome = grossIncome - maxContribution;
    const federalTax = calculateFederalTaxPayable(adjustedIncome, federalData);
    const provincialTax = calculateProvincialTaxPayable(adjustedIncome, provincialData);
    const totalTax = federalTax + provincialTax;
    const taxSavings = currentTax - totalTax;
    const marginalRate = getCombinedMarginalRate(
      adjustedIncome,
      federalData.brackets,
      provincialData.brackets
    );
    const effectiveRate = adjustedIncome > 0 ? totalTax / adjustedIncome : 0;
    
    scenarios.push({
      contribution: maxContribution,
      adjustedIncome,
      federalTax,
      provincialTax,
      totalTax,
      taxSavings,
      marginalRate,
      effectiveRate,
    });
  }
  
  let optimalScenario = scenarios[0];
  
  for (let i = 1; i < scenarios.length; i++) {
    const scenario = scenarios[i];
    const prevScenario = scenarios[i - 1];
    const additionalContribution = scenario.contribution - prevScenario.contribution;
    const additionalSavings = scenario.taxSavings - prevScenario.taxSavings;
    const savingsPerDollar = additionalContribution > 0 ? additionalSavings / additionalContribution : 0;
    
    if (savingsPerDollar >= currentMarginalRate * 0.9) {
      optimalScenario = scenario;
    }
  }
  
  const recommendation = generateRecommendation(
    optimalScenario,
    currentMarginalRate,
    contributionRoom
  );
  
  return {
    currentTax,
    currentMarginalRate,
    scenarios,
    optimalContribution: optimalScenario.contribution,
    optimalSavings: optimalScenario.taxSavings,
    recommendation,
  };
}

function generateRecommendation(
  optimal: RRSPScenario,
  currentRate: number,
  room: number
): string {
  if (optimal.contribution === 0) {
    return 'Based on your income, RRSP contributions may not provide significant tax benefits this year.';
  }
  
  const savingsPercent = ((optimal.taxSavings / optimal.contribution) * 100).toFixed(1);
  const rateChange = ((currentRate - optimal.marginalRate) * 100).toFixed(1);
  
  if (optimal.marginalRate < currentRate) {
    return `Contribute $${optimal.contribution.toLocaleString()} to reduce your marginal rate by ${rateChange}%. ` +
      `Estimated tax savings: $${optimal.taxSavings.toLocaleString()} (${savingsPercent}% return). ` +
      `Remaining room: $${(room - optimal.contribution).toLocaleString()}.`;
  }
  
  return `Consider contributing $${optimal.contribution.toLocaleString()} for estimated tax savings of ` +
    `$${optimal.taxSavings.toLocaleString()} (${savingsPercent}% return).`;
}

export function calculateTaxSavingsForContribution(
  grossIncome: number,
  contribution: number,
  province: ProvinceCode,
  taxData: TaxData
): number {
  const federalData = taxData.federal;
  const provincialData = taxData.provinces[province];
  
  if (!provincialData) return 0;
  
  const currentFederalTax = calculateFederalTaxPayable(grossIncome, federalData);
  const currentProvincialTax = calculateProvincialTaxPayable(grossIncome, provincialData);
  const currentTax = currentFederalTax + currentProvincialTax;
  
  const adjustedIncome = grossIncome - contribution;
  const newFederalTax = calculateFederalTaxPayable(adjustedIncome, federalData);
  const newProvincialTax = calculateProvincialTaxPayable(adjustedIncome, provincialData);
  const newTax = newFederalTax + newProvincialTax;
  
  return currentTax - newTax;
}
