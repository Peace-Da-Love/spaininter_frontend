export function isTmaPath(pathname: string): boolean {
  return /^\/[a-z]{2}\/tma(?:\/|$)/.test(pathname);
}

function isExternalHref(href: string): boolean {
  return /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(href);
}

function isServiceHref(href: string): boolean {
  return href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:');
}

export function getChannelBasePath(pathname: string, locale: string): string {
  return isTmaPath(pathname) ? `/${locale}/tma` : `/${locale}`;
}

export function buildChannelPath(
  pathname: string,
  locale: string,
  target: string
): string {
  const normalized = target.startsWith('/') ? target : `/${target}`;
  if (normalized === '/') {
    return getChannelBasePath(pathname, locale);
  }
  return `${getChannelBasePath(pathname, locale)}${normalized}`;
}

export function buildChannelHref(
  currentPathname: string,
  locale: string,
  href: string
): string {
  if (!href || isExternalHref(href) || isServiceHref(href)) {
    return href;
  }

  const normalized = href.startsWith('/') ? href : `/${href}`;

  if (!isTmaPath(currentPathname)) {
    return normalized;
  }

  const localePrefix = `/${locale}`;
  const localeTmaPrefix = `/${locale}/tma`;

  if (normalized === localePrefix || normalized === `${localePrefix}/`) {
    return localeTmaPrefix;
  }

  if (normalized === localeTmaPrefix || normalized.startsWith(`${localeTmaPrefix}/`)) {
    return normalized;
  }

  if (normalized.startsWith(`${localePrefix}/`)) {
    return `${localeTmaPrefix}${normalized.slice(localePrefix.length)}`;
  }

  if (normalized === '/') {
    return localeTmaPrefix;
  }

  return buildChannelPath(currentPathname, locale, normalized);
}
