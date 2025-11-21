import slugify from 'limax';
import { SITE, APP_BLOG } from 'astrowind:config';
import { trim } from '@/utils/utils';

// ==================== TYPES ====================

type PermalinkType =
  | 'home'
  | 'blog'
  | 'asset'
  | 'category'
  | 'tag'
  | 'post'
  | 'page';

type PermalinkHref = {
  type?: PermalinkType;
  url?: string;
};

type Permalinks = {
  href?: string | PermalinkHref;
  [key: string]: unknown;
};

type PermalinksInput = Permalinks | Permalinks[];

// ==================== UTILITY FUNCTIONS ====================

export const trimSlash = (s: string): string => trim(trim(s, '/'));

export const cleanSlug = (text = ''): string =>
  trimSlash(text)
    .split('/')
    .map((slug) => slugify(slug))
    .join('/');

const createPath = (...params: string[]): string => {
  const paths = params
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');
  return '/' + paths + (SITE.trailingSlash && paths ? '/' : '');
};

const definitivePermalink = (permalink: string): string =>
  createPath(BASE_PATHNAME, permalink);

const isExternalOrSpecialUrl = (slug: string): boolean => {
  const specialPrefixes = ['https://', 'http://', '://', '#', 'javascript:'];
  return specialPrefixes.some((prefix) => slug.startsWith(prefix));
};

// ==================== CONSTANTS ====================

const BASE_PATHNAME = SITE.base || '/';

export const BLOG_BASE = cleanSlug(APP_BLOG?.list?.pathname);
export const CATEGORY_BASE = cleanSlug(APP_BLOG?.category?.pathname);
export const TAG_BASE = cleanSlug(APP_BLOG?.tag?.pathname) || 'tag';
export const POST_PERMALINK_PATTERN = trimSlash(
  APP_BLOG?.post?.permalink || `${BLOG_BASE}/%slug%`
);

// ==================== PERMALINK GENERATORS ====================

export const getHomePermalink = (): string => getPermalink('/');

export const getBlogPermalink = (): string => getPermalink(BLOG_BASE);

export const getAsset = (path: string): string =>
  '/' +
  [BASE_PATHNAME, path]
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');

export const getCanonical = (path = ''): string | URL => {
  const url = String(new URL(path, SITE.site));

  if (SITE.trailingSlash === false && path && url.endsWith('/')) {
    return url.slice(0, -1);
  }

  if (SITE.trailingSlash === true && path && !url.endsWith('/')) {
    return url + '/';
  }

  return url;
};

export const getPermalink = (
  slug = '',
  type: PermalinkType | string = 'page'
): string => {
  if (isExternalOrSpecialUrl(slug)) {
    return slug;
  }

  let permalink: string;

  switch (type) {
    case 'home':
      permalink = getHomePermalink();
      break;

    case 'blog':
      permalink = getBlogPermalink();
      break;

    case 'asset':
      permalink = getAsset(slug);
      break;

    case 'category':
      permalink = createPath(CATEGORY_BASE, trimSlash(slug));
      break;

    case 'tag':
      permalink = createPath(TAG_BASE, trimSlash(slug));
      break;

    case 'post':
      permalink = createPath(trimSlash(slug));
      break;

    case 'page':
    default:
      permalink = createPath(slug);
      break;
  }

  return definitivePermalink(permalink);
};

// ==================== PERMALINK APPLICATION ====================

const processHrefValue = (
  hrefValue: string | PermalinkHref
): string | undefined => {
  if (typeof hrefValue === 'string') {
    return getPermalink(hrefValue);
  }

  if (typeof hrefValue === 'object' && hrefValue !== null) {
    const { type, url } = hrefValue;

    if (type === 'home') return getHomePermalink();
    if (type === 'blog') return getBlogPermalink();
    if (type === 'asset' && url) return getAsset(url);
    if (url) return getPermalink(url, type);
  }

  return undefined;
};

export const applyGetPermalinks = (
  menu: PermalinksInput = {}
): PermalinksInput => {
  // Handle arrays
  if (Array.isArray(menu)) {
    return menu.map((item) => applyGetPermalinks(item) as Permalinks);
  }

  // Handle objects
  if (typeof menu === 'object' && menu !== null) {
    const result: Permalinks = {};

    for (const key in menu) {
      if (key === 'href') {
        const hrefValue = menu[key] as string | PermalinkHref | undefined;
        if (hrefValue) {
          const processed = processHrefValue(hrefValue);
          if (processed) result[key] = processed;
        }
      } else {
        result[key] = applyGetPermalinks(menu[key] as PermalinksInput);
      }
    }

    return result;
  }

  return menu;
};
