import { Pathnames } from 'next-intl/navigation';

/*
en: English
ru: Russian
es: Spanish
fr: French
de: German
sv: Swedish
no: Norwegian
nl: Dutch
pl: Polish
*/
export const locales = ['en', 'ru', 'es', 'fr', 'de', 'sv', 'no', 'nl', 'pl'] as const;

export const pathnames = {
  '/': '/',
  '/category/[categoryName]/[page]': '/category/[categoryName]/[page]',
  '/news/[link]': '/news/[link]',
  '/catalog-telegram': '/catalog-telegram',
  '/courses': {
    en: '/courses-in-spanish',
    ru: '/kursy-v-ispanii',
    es: '/cursos-en-espana',
    fr: '/cours-en-espagne',
    de: '/kurse-in-spanien',
    sv: '/kurser-i-spanien',
    no: '/kurs-i-spania',
    nl: '/cursussen-in-spanje',
    pl: '/kursy-w-hiszpanii',
  },
  '/property-catalog': '/property-catalog'
} satisfies Pathnames<typeof locales>;

// Use the default: `always`
export const localePrefix = undefined;

export type AppPathnames = keyof typeof pathnames;