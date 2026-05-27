import { formatTon } from './ton-converter';

export const PROPERTY_CURRENCIES = ['EUR', 'USD', 'RUB', 'TON'] as const;

export type PropertyDisplayCurrency = (typeof PROPERTY_CURRENCIES)[number];

export type PropertyCurrencyRates = {
  USD: number;
  RUB: number;
  TON: number;
};

export const PROPERTY_CURRENCY_SYMBOLS: Record<PropertyDisplayCurrency, string> = {
  EUR: '€',
  USD: '$',
  RUB: '₽',
  TON: 'TON',
};

const FALLBACK_PROPERTY_CURRENCY_RATES: PropertyCurrencyRates = {
  USD: 1.16,
  RUB: 84,
  TON: 1 / 5.5,
};

const CACHE_DURATION = 30 * 60 * 1000;

let ratesCache: { rates: Pick<PropertyCurrencyRates, 'USD' | 'RUB'>; timestamp: number } | null = null;

export function getNextPropertyCurrency(
  currency: PropertyDisplayCurrency
): PropertyDisplayCurrency {
  const index = PROPERTY_CURRENCIES.indexOf(currency);
  return PROPERTY_CURRENCIES[(index + 1) % PROPERTY_CURRENCIES.length];
}

export async function fetchPropertyCurrencyRates(
  tonRate: number
): Promise<PropertyCurrencyRates> {
  const now = Date.now();
  const ton = Number.isFinite(tonRate) && tonRate > 0
    ? 1 / tonRate
    : FALLBACK_PROPERTY_CURRENCY_RATES.TON;

  if (ratesCache && now - ratesCache.timestamp < CACHE_DURATION) {
    return { ...ratesCache.rates, TON: ton };
  }

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/EUR', {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = (await res.json()) as {
      rates?: {
        USD?: number;
        RUB?: number;
      };
    };

    const USD = json.rates?.USD;
    const RUB = json.rates?.RUB;

    if (!USD || !RUB || USD <= 0 || RUB <= 0) {
      throw new Error('Invalid exchange rates');
    }

    ratesCache = {
      rates: { USD, RUB },
      timestamp: now,
    };

    return { USD, RUB, TON: ton };
  } catch (error) {
    console.warn('[PropertyCurrency] Failed to fetch exchange rates:', error);
    return { ...FALLBACK_PROPERTY_CURRENCY_RATES, TON: ton };
  }
}

export function formatPropertyPrice(params: {
  price: number;
  priceTon?: number;
  displayCurrency?: PropertyDisplayCurrency;
  rates?: Partial<PropertyCurrencyRates>;
}): string {
  const { price, priceTon, displayCurrency = 'EUR', rates } = params;
  const safePrice = Number.isFinite(Number(price)) ? Number(price) : 0;

  if (displayCurrency === 'TON') {
    const tonPrice = typeof priceTon === 'number' && Number.isFinite(priceTon)
      ? priceTon
      : safePrice * (rates?.TON ?? FALLBACK_PROPERTY_CURRENCY_RATES.TON);

    return formatTon(tonPrice);
  }

  const amount = displayCurrency === 'USD'
    ? safePrice * (rates?.USD ?? FALLBACK_PROPERTY_CURRENCY_RATES.USD)
    : displayCurrency === 'RUB'
      ? safePrice * (rates?.RUB ?? FALLBACK_PROPERTY_CURRENCY_RATES.RUB)
      : safePrice;

  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: displayCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
