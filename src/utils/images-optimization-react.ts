/**
 * Image optimization utilities for React components
 * This file contains pure functions that don't depend on Astro server-side APIs
 * Safe to use in client-side React components
 */

import type { ImageLayout } from '@/types';
import { transformUrl, parseUrl } from 'unpic';

export interface ImageProps {
  src?: string | null;
  width?: string | number | null;
  height?: string | number | null;
  alt?: string | null;
  loading?: 'eager' | 'lazy' | null;
  decoding?: 'sync' | 'async' | 'auto' | null;
  style?: string;
  srcset?: string | null;
  sizes?: string | null;
  fetchpriority?: 'high' | 'low' | 'auto' | null;
  inferSize?: boolean;

  layout?: ImageLayout;
  widths?: number[] | null;
  aspectRatio?: string | number | null;
  objectPosition?: string;

  format?: string;
}

/* ******* */
const config = {
  // FIXME: Use this when image.width is minor than deviceSizes
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

  deviceSizes: [
    640, // older and lower-end phones
    750, // iPhone 6-8
    828, // iPhone XR/11
    960, // older horizontal phones
    1080, // iPhone 6-8 Plus
    1280, // 720p
    1668, // Various iPads
    1920, // 1080p
    2048, // QXGA
    // 2560, // WQXGA
    // 3200, // QHD+
    // 3840, // 4K
    // 4480, // 4.5K
    // 5120, // 5K
    // 6016, // 6K
  ],

  formats: ['image/webp'],
};

const parseAspectRatio = (
  aspectRatio: number | string | null | undefined
): number | undefined => {
  if (typeof aspectRatio === 'number') return aspectRatio;

  if (typeof aspectRatio === 'string') {
    const match = aspectRatio.match(/(\d+)\s*[/:]\s*(\d+)/);

    if (match) {
      const [, num, den] = match.map(Number);
      if (den && !isNaN(num)) return num / den;
    } else {
      const numericValue = parseFloat(aspectRatio);
      if (!isNaN(numericValue)) return numericValue;
    }
  }

  return undefined;
};

/**
 * Gets the `sizes` attribute for an image, based on the layout and width
 */
export const getSizes = (
  width?: number,
  layout?: ImageLayout
): string | undefined => {
  if (!width || !layout) {
    return undefined;
  }
  switch (layout) {
    // If screen is wider than the max size, image width is the max size,
    // otherwise it's the width of the screen
    case `constrained`:
      return `(min-width: ${width}px) ${width}px, 100vw`;

    // Image is always the same width, whatever the size of the screen
    case `fixed`:
      return `${width}px`;

    // Image is always the width of the screen
    case `fullWidth`:
      return `100vw`;

    default:
      return undefined;
  }
};

const pixelate = (value?: number) =>
  value || value === 0 ? `${value}px` : undefined;

export const getImageStyles = ({
  width,
  height,
  aspectRatio,
  layout,
  objectFit = 'cover',
  objectPosition = 'center',
  background,
}: {
  width?: number;
  height?: number;
  aspectRatio?: string | number;
  objectFit?: string;
  objectPosition?: string;
  layout?: string;
  background?: string;
}): React.CSSProperties => {
  const parsedAspectRatio = parseAspectRatio(aspectRatio);
  const styleEntries: Array<[prop: string, value: string | undefined]> = [
    ['objectFit', objectFit],
    ['objectPosition', objectPosition],
  ];

  // If background is a URL, set it to cover the image and not repeat
  if (
    background?.startsWith('https:') ||
    background?.startsWith('http:') ||
    background?.startsWith('data:')
  ) {
    styleEntries.push(['backgroundImage', `url(${background})`]);
    styleEntries.push(['backgroundSize', 'cover']);
    styleEntries.push(['backgroundRepeat', 'no-repeat']);
  } else if (background) {
    styleEntries.push(['background', background]);
  }

  if (layout === 'fixed') {
    styleEntries.push(['width', pixelate(width)]);
    styleEntries.push(['height', pixelate(height)]);
    styleEntries.push(['objectPosition', 'top left']);
  }
  if (layout === 'constrained') {
    styleEntries.push(['maxWidth', pixelate(width)]);
    styleEntries.push(['maxHeight', pixelate(height)]);
    styleEntries.push([
      'aspectRatio',
      parsedAspectRatio ? `${parsedAspectRatio}` : undefined,
    ]);
    styleEntries.push(['width', '100%']);
  }
  if (layout === 'fullWidth') {
    styleEntries.push(['width', '100%']);
    styleEntries.push([
      'aspectRatio',
      parsedAspectRatio ? `${parsedAspectRatio}` : undefined,
    ]);
    styleEntries.push(['height', pixelate(height)]);
  }
  if (layout === 'responsive') {
    styleEntries.push(['width', '100%']);
    styleEntries.push(['height', 'auto']);
    styleEntries.push([
      'aspectRatio',
      parsedAspectRatio ? `${parsedAspectRatio}` : undefined,
    ]);
  }
  if (layout === 'contained') {
    styleEntries.push(['maxWidth', '100%']);
    styleEntries.push(['maxHeight', '100%']);
    styleEntries.push(['objectFit', 'contain']);
    styleEntries.push([
      'aspectRatio',
      parsedAspectRatio ? `${parsedAspectRatio}` : undefined,
    ]);
  }
  if (layout === 'cover') {
    styleEntries.push(['maxWidth', '100%']);
    styleEntries.push(['maxHeight', '100%']);
  }

  return Object.fromEntries(
    styleEntries.filter(([, value]) => value)
  ) as React.CSSProperties;
};

export const getBreakpoints = ({
  width,
  breakpoints,
  layout,
}: {
  width?: number;
  breakpoints?: number[];
  layout: ImageLayout;
}): number[] => {
  if (
    layout === 'fullWidth' ||
    layout === 'cover' ||
    layout === 'responsive' ||
    layout === 'contained'
  ) {
    return breakpoints || config.deviceSizes;
  }
  if (!width) {
    return [];
  }
  const doubleWidth = width * 2;
  if (layout === 'fixed') {
    return [width, doubleWidth];
  }
  if (layout === 'constrained') {
    return [
      // Always include the image at 1x and 2x the specified width
      width,
      doubleWidth,
      // Filter out any resolutions that are larger than the double-res image
      ...(breakpoints || config.deviceSizes).filter((w) => w < doubleWidth),
    ];
  }

  return [];
};

const computeHeight = (width: number, aspectRatio: number) => {
  return Math.floor(width / aspectRatio);
};

/**
 * Check if an image URL is compatible with unpic (CDN image service)
 */
export const isUnpicCompatible = (image: string) => {
  return typeof parseUrl(image) !== 'undefined';
};

/**
 * Optimizes images from CDN services using unpic
 * Works with Cloudinary, Imgix, Contentful, and many other CDNs
 * This is safe to use client-side as it only transforms URLs
 */
export const unpicOptimizer = async (
  image: string,
  breakpoints: number[],
  width?: number,
  height?: number,
  format?: string
): Promise<Array<{ src: string; width: number; height?: number }>> => {
  if (!image || typeof image !== 'string') {
    return [];
  }

  const urlParsed = parseUrl(image);
  if (!urlParsed) {
    return [];
  }

  return Promise.all(
    breakpoints.map(async (w: number) => {
      const _height =
        width && height ? computeHeight(w, width / height) : height;
      const url =
        transformUrl({
          url: image,
          width: w,
          height: _height,
          cdn: urlParsed.cdn,
          ...(format ? { format: format } : {}),
        }) || image;
      return {
        src: String(url),
        width: w,
        height: _height,
      };
    })
  );
};
