import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const metadataDefinition = () => {
  return z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),

      canonical: z.string().url().optional(),

      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),

      description: z.string().optional(),

      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),

      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();
};

// --- TAGS ---
const tag = defineCollection({
  loader: glob({ base: './src/data/tag', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

// --- BLOG ---
const post = defineCollection({
  loader: glob({ base: './src/data/post', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      layout: z.literal('posts').optional(),
      publishDate: z.coerce.date(),
      updateDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),

      title: z.string(),
      excerpt: z.string().optional(),
      image: image().optional(),

      category: z.string().optional(),
      tags: z.array(z.any()).optional(), // ← CORRIGIDO
      author: z.string().optional(),

      metadata: metadataDefinition(),
    }),
});

// --- PRODUCTS ---
const product = defineCollection({
  loader: glob({ base: './src/data/product', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      layout: z.literal('products').optional(),
      title: z.string(),
      slug: z.string(),
      image: image(),
      description: z.string().optional(),
    }),
});

const banner = defineCollection({
  loader: glob({ base: './src/data/banner', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string().optional(),

    image: z.string(),
    imageMobile: z.string().optional(),

    cta: z
      .object({
        text: z.string(),
        url: z.string(),
        variant: z.enum(['primary', 'secondary', 'outline']).default('primary'),
      })
      .nullish()
      .optional(),

    textPosition: z.enum(['left', 'center', 'right']).default('center'),
    textAlign: z.enum(['top', 'middle', 'bottom']).default('middle'),
    overlay: z.boolean().default(true),

    order: z.number().default(0),
    active: z.boolean().default(true),
    publishDate: z.coerce.date().optional(),
    expireDate: z
      .string()
      .nullable()
      .transform((val) => (val ? new Date(val) : null))
      .optional(),
  }),
});

// --- EXPORT COLLECTIONS ---
export const collections = { post, product, tag, banner };
