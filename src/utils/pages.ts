import type { Page } from '@/types';
import { getCollection, render, type CollectionEntry } from 'astro:content';
import {
  cleanSlug,
  trimSlash,
  BLOG_BASE,
  POST_PERMALINK_PATTERN,
  CATEGORY_BASE,
  TAG_BASE,
} from './permalinks';

let _pages: Array<Page> | null = null;

const load = async function (): Promise<Array<Page>> {
  const pages = await getCollection('pages');
  const normalizedPosts = pages.map(
    async (page) => await getNormalizedPage(page)
  );

  const results = (await Promise.all(normalizedPosts)).filter(
    (page) => !page.draft
  );

  return results;
};

const generatePermalink = async ({
  id,
  slug,
}: {
  id: string;
  slug: string;
}) => {
  const permalink = POST_PERMALINK_PATTERN.replace('%slug%', slug).replace(
    '%id%',
    id
  );

  return permalink
    .split('/')
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');
};

const getNormalizedPage = async (
  page: CollectionEntry<'pages'>
): Promise<Page> => {
  const { id, data } = page;
  const { Content, remarkPluginFrontmatter } = await render(page);

  const { title, draft = false, metadata = {} } = data;

  const slug = cleanSlug(id); // cleanSlug(rawSlug.split('/').pop());

  return {
    id: id,
    slug: slug,
    description: page.data.description,
    permalink: await generatePermalink({
      id,
      slug,
    }),
    title: title,
    draft: draft,
    metadata,
    Content: Content,
    body: Content,
  };
};

export const fetchPages = async (): Promise<Array<Page>> => {
  if (!_pages) {
    _pages = await load();
  }

  return _pages;
};

export const getStaticPathspages = async () => {
  return (await fetchPages()).flatMap((page) => ({
    params: {
      page: page.permalink,
    },
    props: { page: page },
  }));
};
