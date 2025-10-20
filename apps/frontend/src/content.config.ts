import { defineCollection, z } from "astro:content";
import client from "../tina/__generated__/client";
// import { glob } from "astro/loaders";

// --- BLOG ---
const blog = defineCollection({
  loader: async () => {
    const postsResponse = await client.queries.blogConnection();
    return postsResponse.data.blogConnection.edges
      ?.filter((post) => !!post?.node?._sys.relativePath)
      .map((post) => {
        const node = post!.node!;
        return {
          ...node,
          description:node.description || "",
          coverImage: node.coverImage || "",
          tags: node.tags || [],
          id: node._sys.relativePath.replace(/\.md?$/, ""), // Generate clean URLs
          tinaInfo: node._sys, 
        };
      }) || [];
  },
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      description: z.string().optional(),
      coverImage: image().optional(),
      publishedAt: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      categoria: z.enum(["notice", "post"]).default("post"),
    }),
});

// --- PRODUCTS ---
const products = defineCollection({
  // loader: glob({ base: "./src/content/products", pattern: "**/*.{md,mdx}" }),
   loader: async () => {
    const postsResponse = await client.queries.productsConnection();
    return postsResponse.data.productsConnection.edges
      ?.filter((product) => !!product?.node?._sys.relativePath)
      .map((post) => {
        const node = post!.node!;
        return {
          ...node,
          id: node._sys.relativePath.replace(/\.md?$/, ""), // Generate clean URLs
          tinaInfo: node._sys, 
        };
      }) || [];
  },
  schema: ({ image }) =>
    z.object({
      layout: z.literal("products").optional(),
      name: z.string(),
      slug: z.string(),
      image: image(),
      description: z.string().optional(),
    }),
});

const page = defineCollection({
  loader: async () => {
    const postsResponse = await client.queries.pageConnection();

    // Map Tina posts to the correct format for Astro
    return postsResponse.data.pageConnection.edges
      ?.filter((p) => !!p)
      .map((p) => {
        const node = p!.node!;

        return {
          ...node,
          id: node?._sys.relativePath.replace(/\.md?$/, ""), // Generate clean URLs
          tinaInfo: node?._sys, // Include Tina system info if needed
        };
      }) || [];
  },
  schema: z.object({
    tinaInfo: z.object({
      filename: z.string(),
      basename: z.string(),
      path: z.string(),
      relativePath: z.string(),
    }),
    seoTitle: z.string(),
    body: z.any(),
  }),
})

// --- EXPORT COLLECTIONS ---
export const collections = { blog, products, page };
