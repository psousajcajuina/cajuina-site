import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// --- BLOG ---
const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      layout: z.literal("blog"),
      title: z.string(),
      slug: z.string(),
      description: z.string().optional(),
      coverImage: image(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      categoria: z.enum(["notice", "post"]).default("post"),
      // body: z.string(),
      // Prev/Next
      prev_post_title: z.string().optional(),
      prev_post_slug: z.string().optional(),
      next_post_title: z.string().optional(),
      next_post_slug: z.string().optional(),
    }),
});

// --- PRODUCTS ---
const products = defineCollection({
  loader: glob({ base: "./src/content/products", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      layout: z.literal("products"),
      title: z.string(),
      slug: z.string(),
      image: image(),
      description: z.string().optional(),
    }),
});

// --- EXPORT COLLECTIONS ---
export const collections = { blog, products };
