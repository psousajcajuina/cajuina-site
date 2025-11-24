import { defineCollection, z } from 'astro:content';
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

// --- CATEGORIES ---
const category = defineCollection({
  loader: glob({ base: './src/data/category', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

// --- NEWS ---
const news = defineCollection({
  loader: glob({ base: './src/data/news', pattern: '**/*.{md,mdx}' }),
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
      id: z.number(),
      title: z.string(),
      slug: z.string(),
      normalImage: image(),
      hoverImage: image().optional(),
      details: z.object({
        name: z.string(),
        image: image(),
        nutritionalInfo: image(),
      }),
      ingredients: z.string().optional(),
    }),
});

// --- BANNER PRINCIPAL ---
const banner = defineCollection({
  loader: glob({ base: './src/data/banner', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      description: z.string().optional(),

      image: image(),
      imageMobile: image().optional(),

      cta: z.string().nullish().optional(),
      // cta: z
      //   .object({
      //     text: z.string(),
      //     url: z.string(),
      //     variant: z
      //       .enum(['primary', 'secondary', 'outline'])
      //       .default('primary'),
      //   })
      //   .nullish()
      //   .optional(),

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

// --- MIDDLE BANNER ---
const middleBanner = defineCollection({
  loader: glob({ base: './src/data/middle-banner', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      image: image(),
      imageMobile: image().optional(),
      active: z.boolean().default(true),
    }),
});

// --- DISTRIBUIDORES ---
const distribuidor = defineCollection({
  loader: glob({ base: './src/data/distribuidor', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    nome: z.string(),
    endereco: z.string(),
    telefone: z.string(),
    lat: z.number(),
    lng: z.number(),
    active: z.boolean().default(true),
  }),
});

// --- PAGES ---
const pages = defineCollection({
  loader: glob({ base: './src/data/pages', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    draft: z.boolean().default(true),
    layout: z.string(),
    body: z.string().optional(),
    description: z.string().optional(),
    metadata: metadataDefinition(),
  }),
});

// --- EXPORT COLLECTIONS ---
export const collections = {
  post: news,
  product,
  tag,
  category,
  banner,
  middleBanner,
  distribuidor,
  pages,
};
