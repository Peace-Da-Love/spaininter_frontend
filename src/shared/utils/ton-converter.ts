/**
 * TON <-> EUR converter with caching and safe fallbacks.
 * Designed for production use in Next.js apps.
 */

interface ExchangeRateCache {
  tonToEur: number;
  timestamp: number;
}

let rateCache: ExchangeRateCache | null = null;

// Cache lifetime: 30 minutes
const CACHE_DURATION = 30 * 60 * 1000;

// Fallback TON price (EUR per TON)
const FALLBACK_TON_EUR_RATE = 5.5;

/**
 * Fetch TON price in EUR using CoinGecko API.
 * @returns number — price of 1 TON in EUR
 */
async function fetchTonExchangeRate(): Promise<number> {
  const now = Date.now();

  // Return cached value if valid
  if (rateCache && now - rateCache.timestamp < CACHE_DURATION) {
    return rateCache.tonToEur;
  }

  try {
    const url =
      'https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=eur';
    const isServer = typeof window === 'undefined';
    const res = await fetch(url, isServer
      ? {
          cache: 'no-store',
          headers: { 'x-cg-demo-api-key': '1' },
        }
      : {
          cache: 'no-store',
        }
    );

    if (!res.ok) {
      console.warn(`[TON Converter] API error ${res.status}`);
      throw new Error(`HTTP ${res.status}`);
    }

    const json = (await res.json()) as {
      'the-open-network'?: { eur?: number };
    };

    const tonToEur = json['the-open-network']?.eur;

    if (!tonToEur || tonToEur <= 0) {
      console.warn('[TON Converter] Empty or invalid exchange rate.');
      throw new Error('Invalid rate');
    }

    // update cache
    rateCache = { tonToEur, timestamp: now };

    return tonToEur;
  } catch (err) {
    console.warn('[TON Converter] Fetch failed, using fallback:', err);

    // fallback NOT cached → there will be a later attempt to refresh
    return FALLBACK_TON_EUR_RATE;
  }
}

/**
 * Convert EUR → TON.
 */
export async function convertEurToTon(eurAmount: number): Promise<number> {
  if (!Number.isFinite(eurAmount) || eurAmount <= 0) return 0;

  const tonPrice = await fetchTonExchangeRate();
  return Math.round(eurAmount / tonPrice);
}

/**
 * Convert TON → EUR.
 */
export async function convertTonToEur(tonAmount: number): Promise<number> {
  if (!Number.isFinite(tonAmount) || tonAmount <= 0) return 0;

  const tonPrice = await fetchTonExchangeRate();
  return tonAmount * tonPrice;
}

/**
 * Synchronous formatter for TON amounts.
 */
export function formatTon(ton: number): string {
  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0,
  }).format(Math.round(ton));
}

// Backward-compatible alias
export const tonPriceFormatter = formatTon;

/**
 * Get cached TON/EUR rate without awaiting API.
 * Returns fallback if cache empty.
 */
export function getCachedTonRate(): number {
  return rateCache?.tonToEur ?? FALLBACK_TON_EUR_RATE;
}

/**
 * Preload the exchange rate on app startup (optional).
 */
export async function preloadTonRate(): Promise<void> {
  try {
    await fetchTonExchangeRate();
  } catch {
    /** ignore */
  }
}
