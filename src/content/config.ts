import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

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

// --- BLOG ---
const post = defineCollection({
  loader: glob({ base: "./src/data/post", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      layout: z.literal("posts").optional(),
      publishDate: z.coerce.date(),
      updateDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),

      title: z.string(),
      description: z.string().optional(),
      image: image().optional(),
      
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
      author: z.string().optional(),

      metadata: metadataDefinition(),
    }),
});

// --- PRODUCTS ---
const product = defineCollection({
  loader: glob({ base: "./src/data/product", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      layout: z.literal("products").optional(),
      title: z.string(),
      slug: z.string(),
      image: image(),
      description: z.string().optional(),
    }),
});

// --- EXPORT COLLECTIONS ---
export const collections = { post, product };
