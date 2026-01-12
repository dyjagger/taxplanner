import type { TaxData } from '../types';
import { getFallbackTaxData } from './fallback';

const CACHE_KEY_PREFIX = 'canadian-tax-data';
const CACHE_MAX_AGE_DAYS = 30;

export async function fetchTaxData(year: number): Promise<TaxData> {
  try {
    const cachedData = getCachedTaxData(year);
    if (cachedData && isCacheFresh(year)) {
      return cachedData;
    }
  } catch (error) {
    console.warn('Failed to load cached data:', error);
  }

  console.info('Using fallback tax data for year:', year);
  const fallbackData = getFallbackTaxData(year);
  cacheTaxData(fallbackData);
  return fallbackData;
}

function getCachedTaxData(year: number): TaxData | null {
  const cacheKey = `${CACHE_KEY_PREFIX}-${year}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (!cached) return null;
  
  try {
    return JSON.parse(cached);
  } catch {
    return null;
  }
}

function cacheTaxData(data: TaxData): void {
  const cacheKey = `${CACHE_KEY_PREFIX}-${data.year}`;
  localStorage.setItem(cacheKey, JSON.stringify(data));
  localStorage.setItem(`${cacheKey}-timestamp`, Date.now().toString());
}

function isCacheFresh(year: number): boolean {
  const cacheKey = `${CACHE_KEY_PREFIX}-${year}`;
  const timestamp = localStorage.getItem(`${cacheKey}-timestamp`);
  
  if (!timestamp) return false;
  
  const age = Date.now() - parseInt(timestamp);
  const maxAge = CACHE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  
  return age < maxAge;
}

export function getCacheAge(year: number): number {
  const cacheKey = `${CACHE_KEY_PREFIX}-${year}`;
  const timestamp = localStorage.getItem(`${cacheKey}-timestamp`);
  
  if (!timestamp) return Infinity;
  
  const age = Date.now() - parseInt(timestamp);
  return Math.floor(age / (1000 * 60 * 60 * 24));
}

export function clearTaxDataCache(year?: number): void {
  if (year) {
    const cacheKey = `${CACHE_KEY_PREFIX}-${year}`;
    localStorage.removeItem(cacheKey);
    localStorage.removeItem(`${cacheKey}-timestamp`);
  } else {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_KEY_PREFIX));
    keys.forEach(k => localStorage.removeItem(k));
  }
}
