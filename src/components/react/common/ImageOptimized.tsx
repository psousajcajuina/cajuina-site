import { useMemo, useEffect, useState } from 'react';
import type { HTMLAttributes } from 'react';
import {
  getSizes,
  getBreakpoints,
  getImageStyles,
  isUnpicCompatible,
  unpicOptimizer,
} from '@/utils/images-optimization-react';
import type { ImageLayout } from '@/types';

interface ImageOptimizedProps
  extends Omit<HTMLAttributes<HTMLImageElement>, 'src' | 'style'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  sizes?: string;
  className?: string;
  layout?: ImageLayout;
  objectFit?: string;
  objectPosition?: string;
  aspectRatio?: string | number;
}

/**
 * Encodes spaces and special characters in URLs for srcset
 * srcset format requires URLs with spaces to be encoded
 */
const encodeSrcSetUrl = (url: string): string => {
  // Only encode spaces to prevent srcset parsing issues
  // Other characters are typically already encoded or safe
  return url.replace(/ /g, '%20');
};

export default function ImageOptimized({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  fetchPriority = 'auto',
  sizes: customSizes,
  className = '',
  layout = 'constrained',
  objectFit = 'cover',
  objectPosition = 'center',
  aspectRatio,
  ...rest
}: ImageOptimizedProps) {
  const [srcSet, setSrcSet] = useState<string | undefined>(undefined);

  const baseConfig = useMemo(() => {
    if (!src) return null;

    const autoSizes = customSizes || getSizes(width, layout);
    const breakpoints = getBreakpoints({ width, layout });

    const styles = getImageStyles({
      width,
      height,
      aspectRatio,
      layout,
      objectFit,
      objectPosition,
    });

    return {
      src,
      sizes: autoSizes,
      width,
      height,
      style: styles,
      breakpoints,
    };
  }, [
    src,
    width,
    height,
    layout,
    aspectRatio,
    objectFit,
    objectPosition,
    customSizes,
  ]);

  // Try to use unpic optimizer for CDN images
  useEffect(() => {
    if (!baseConfig || !src) return;

    const optimize = async () => {
      // Check if the image is from a supported CDN
      if (isUnpicCompatible(src)) {
        try {
          const optimized = await unpicOptimizer(
            src,
            baseConfig.breakpoints,
            width,
            height
          );

          if (optimized.length > 0) {
            const generatedSrcSet = optimized
              .map(({ src, width }) => `${encodeSrcSetUrl(src)} ${width}w`)
              .join(', ');
            setSrcSet(generatedSrcSet);
            return;
          }
        } catch (error) {
          console.warn('Failed to optimize image with unpic:', error);
        }
      }

      // Fallback: generate basic srcSet without CDN optimization
      if (baseConfig.breakpoints.length > 0) {
        const fallbackSrcSet = baseConfig.breakpoints
          .map((w: number) => `${encodeSrcSetUrl(src)} ${w}w`)
          .join(', ');
        setSrcSet(fallbackSrcSet);
      }
    };

    optimize();
  }, [src, width, height, baseConfig]);

  if (!baseConfig) return null;

  return (
    <img
      src={encodeSrcSetUrl(baseConfig.src)}
      alt={alt}
      width={baseConfig.width}
      height={baseConfig.height}
      srcSet={srcSet}
      sizes={baseConfig.sizes}
      loading={loading}
      fetchPriority={fetchPriority}
      className={className}
      style={baseConfig.style}
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
      {...rest}
    />
  );
}
