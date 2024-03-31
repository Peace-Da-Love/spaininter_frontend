import {Pathnames} from 'next-intl/navigation';

export const locales = ['en', 'ru'];

export const pathnames = {
  '/': '/',
  '/category/[categoryName]/[page]': '/category/[categoryName]/[page]',
  '/news/[link]': '/news/[link]',


} satisfies Pathnames<typeof locales>;

// Use the default: `always`
export const localePrefix = undefined;

export type AppPathnames = keyof typeof pathnames;