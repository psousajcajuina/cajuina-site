import path from 'path';
import { visit, SKIP } from 'unist-util-visit';
import {
  createMarkdownProcessor,
  type RemarkPlugin,
  type MarkdownProcessor,
} from '@astrojs/markdown-remark';

interface ShortcodeMatch {
  type: 'opening' | 'closing';
  name: string;
  params?: string;
  fullMatch: string;
  index: number;
}

type ParentNode = {
  children: any[];
  [key: string]: unknown;
};

interface ShortcodeReplacement {
  parent: ParentNode;
  startIndex: number;
  endIndex: number;
  combinedText: string;
}

interface ResolvedReplacement extends ShortcodeReplacement {
  processed: string;
}

let markdownProcessorPromise: Promise<MarkdownProcessor> | null = null;

async function getMarkdownProcessor(): Promise<MarkdownProcessor> {
  if (!markdownProcessorPromise) {
    markdownProcessorPromise = createMarkdownProcessor();
  }
  return markdownProcessorPromise;
}

interface RenderMarkdownOptions {
  rewriteAssets?: boolean;
}

async function renderMarkdownBase(
  markdown: string,
  filePath?: string,
  options: RenderMarkdownOptions = {}
): Promise<string> {
  const trimmed = markdown.trim();
  if (!trimmed) return '';

  const { rewriteAssets = true } = options;
  const processor = await getMarkdownProcessor();
  const { code } = await processor.render(trimmed);
  const html = rewriteAssets ? rewriteAssetUrls(code, filePath) : code;
  return ensureLazyLoadedImages(html).trim();
}

async function renderMarkdownBlock(
  text: string,
  processNested: (input: string) => Promise<string>,
  filePath?: string,
  options: RenderMarkdownOptions = {}
): Promise<string> {
  const processed = await processNested(text);
  if (!processed.trim()) return '';

  const html = await renderMarkdownBase(processed, filePath, options);
  if (!html) return '';

  return unwrapParagraphsAroundMedia(html);
}

async function renderInlineMarkdown(
  text: string,
  filePath?: string
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return '';

  const html = await renderMarkdownBase(trimmed, filePath);
  if (!html) return '';

  return stripOuterParagraph(html).replace(/\n/g, '<br>');
}

function buildInstagramEmbedUrl(input: string): string | null {
  if (!input) return null;

  let normalized = input.trim();
  if (!normalized) return null;

  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized.replace(/^\/+/, '')}`;
  }

  try {
    const url = new URL(normalized);
    if (!url.hostname.includes('instagram.com')) {
      return null;
    }

    url.search = '';
    url.hash = '';

    if (!url.pathname.endsWith('/')) {
      url.pathname += '/';
    }

    const segments = url.pathname.split('/').filter(Boolean);
    if (segments.length < 2) {
      return null;
    }

    const resource = segments[0];
    const identifier = segments[1];
    const supported = ['p', 'reel', 'tv'];
    if (!supported.includes(resource)) {
      return null;
    }

    return `${url.origin}/${resource}/${identifier}/embed/captioned/`;
  } catch (error) {
    return null;
  }
}

function rewriteAssetUrls(html: string, filePath?: string): string {
  if (!filePath) return html;

  const updateSrcAttribute = (input: string, attr: 'src' | 'poster'): string =>
    input.replace(
      new RegExp(`(<[^>]+?${attr}=")(.*?)"`, 'gi'),
      (_match: string, prefix: string, url: string) => {
        const resolved = resolveAssetUrl(url, filePath);
        return `${prefix}${resolved}"`;
      }
    );

  let output = updateSrcAttribute(html, 'src');
  output = updateSrcAttribute(output, 'poster');

  output = output.replace(
    /(<source[^>]+?srcset=")(.*?)"/gi,
    (_match: string, prefix: string, value: string) => {
      const rewritten = value
        .split(',')
        .map((entry: string) => {
          const trimmedEntry = entry.trim();
          if (!trimmedEntry) return trimmedEntry;
          const parts = trimmedEntry.split(/\s+/);
          const [candidate, ...rest] = parts;
          const resolved = resolveAssetUrl(candidate || '', filePath);
          return [resolved, ...rest].join(' ');
        })
        .join(', ');

      return `${prefix}${rewritten}"`;
    }
  );

  return output;
}

function ensureLazyLoadedImages(html: string): string {
  return html.replace(/<img\b(?![^>]*\bloading=)/gi, '<img loading="lazy" ');
}

function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function stripOuterParagraph(html: string): string {
  const trimmed = html.trim();
  if (!trimmed) return trimmed;

  const match = trimmed.match(/^<p[^>]*>([\s\S]*?)<\/p>$/i);
  if (!match) return trimmed;

  return match[1].trim();
}

async function processListShortcodes(
  content: string,
  filePath?: string
): Promise<string> {
  const regex =
    /\[\[\s*list(?::([^\]]*))?\s*\]\]([\s\S]*?)\[\[\s*\/\s*list\s*\]\]/gi;

  let result = content;
  const matches: Array<{
    fullMatch: string;
    index: number;
    styleParam: string;
    inner: string;
  }> = [];

  let match: RegExpExecArray | null;
  while ((match = regex.exec(result)) !== null) {
    matches.push({
      fullMatch: match[0],
      index: match.index,
      styleParam: (match[1] || '').trim(),
      inner: match[2],
    });
  }

  // Processa em ordem reversa
  for (let i = matches.length - 1; i >= 0; i--) {
    const { fullMatch, index, styleParam, inner } = matches[i];

    const styleClass = getListStyleClass(styleParam);

    let html = `<ul class="list-block ${styleClass}">`;
    let prevLevel = 0;

    const lines = inner.split('\n');

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      const slashMatch = line.match(/^(\/\/+)\s+(.*)$/);
      if (!slashMatch) continue;

      const slashes = slashMatch[1].length;
      const text = slashMatch[2];
      const newLevel = Math.floor(slashes / 2);

      // Abre sublistas
      while (prevLevel < newLevel) {
        html += `<ul class="${styleClass}">`;
        prevLevel++;
      }

      // Fecha sublistas e items
      while (prevLevel > newLevel) {
        html += '</li></ul>';
        prevLevel--;
      }

      // Fecha item anterior do mesmo nível (exceto no primeiro)
      if (prevLevel === newLevel && prevLevel > 0) {
        html += '</li>';
      }

      // Processa conteúdo do item
      let itemHtml = await processInlineShortcodesInText(text, filePath);
      itemHtml = await renderInlineMarkdown(itemHtml, filePath);

      html += `<li>${itemHtml}`;
    }

    // Fecha todas as tags abertas
    while (prevLevel > 0) {
      html += '</li></ul>';
      prevLevel--;
    }

    html += '</li></ul>';

    result =
      result.slice(0, index) + html + result.slice(index + fullMatch.length);
  }

  return result;
}

function getListStyleClass(param: string): string {
  switch (param) {
    case '>':
      return 'list-style-arrow';
    case '-':
      return 'list-style-dash';
    case '•':
    case 'disc':
      return 'list-style-disc';
    case '○':
    case 'circle':
      return 'list-style-circle';
    case '▪':
    case 'square':
      return 'list-style-square';
    default:
      return 'list-style-disc';
  }
}

async function processInlineShortcodesInText(
  text: string,
  filePath?: string
): Promise<string> {
  let output = text;

  output = output.replace(
    /\[\[\s*youtube:(.*?)\s*\]\]/gi,
    (_match: string, rawId: string) => {
      const videoId = String(rawId || '').trim();
      if (!videoId) return _match;
      return `<div class="youtube-embed"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    }
  );

  output = output.replace(
    /\[\[\s*instagram:(.*?)\s*\]\]/gi,
    (_match: string, rawUrl: string) => {
      const permalink = String(rawUrl || '').trim();
      if (!permalink) return _match;
      const embedUrl = buildInstagramEmbedUrl(permalink);
      if (!embedUrl) return _match;
      const escapedUrl = escapeHtmlAttribute(embedUrl);
      return `<div class="instagram-embed"><iframe src="${escapedUrl}" loading="lazy" allowtransparency="true" allowfullscreen="true" frameborder="0" scrolling="no"></iframe></div>`;
    }
  );

  return output;
}

function normalizeShortcodeSyntax(text: string): string {
  return text
    .replace(/\[\[\s+/g, '[[')
    .replace(/\s+\]\]/g, ']]')
    .replace(/\[\s+\/\s+/g, '[/')
    .replace(/\[\s*(col[12])\s*\]/gi, (_m, name) => `[${name}]`)
    .replace(/\[\s*\/\s*(col[12])\s*\]/gi, (_m, name) => `[/${name}]`);
}

function sanitizeTwoColumnsBlocks(text: string): string {
  const blockRegex =
    /\[\[\s*two-columns[^\]]*\]\][\s\S]*?\[\[\s*\/\s*two-columns\s*\]\]/gi;

  return text.replace(blockRegex, (block: string) => {
    let sanitized = block;
    sanitized = sanitized.replace(/\r\n/g, '\n');
    sanitized = sanitized.replace(/(\]\]|\])\s*\n+\s*(?=\[)/g, '$1');
    sanitized = sanitized.replace(/\[(\s+)/g, '[');
    sanitized = sanitized.replace(/(\s+)\]/g, ']');
    sanitized = sanitized.replace(
      /\[col([12])\]\s*\n+/gi,
      (_m: string, col: string) => `[col${col}]`
    );
    sanitized = sanitized.replace(
      /\n+\s*\[\/col([12])\]/gi,
      (_m: string, col: string) => `[/col${col}]`
    );
    return sanitized;
  });
}

function extractNodeText(node: any): string {
  if (!node) return '';
  if (node.type === 'text') {
    return String(node.value ?? '');
  }
  if (node.type === 'paragraph') {
    return extractParagraphText(node);
  }
  return '';
}

function extractParagraphText(node: any): string {
  if (!node || !Array.isArray(node.children)) return '';

  return node.children
    .map((child: any) => {
      switch (child.type) {
        case 'text':
          return child.value || '';
        case 'strong':
          return `**${extractParagraphText(child)}**`;
        case 'emphasis':
          return `*${extractParagraphText(child)}*`;
        case 'link': {
          const url = child.url || '';
          return `[${extractParagraphText(child)}](${url})`;
        }
        case 'image': {
          const alt = child.alt || '';
          const title = child.title ? ` "${child.title}"` : '';
          return `![${alt}](${child.url || ''}${title})`;
        }
        default:
          return child.children ? extractParagraphText(child) : '';
      }
    })
    .join('');
}

function collectShortcodeRange(
  parent: ParentNode,
  startIndex: number
): { combinedText: string; endIndex: number } {
  let combined = '';
  let endIndex = startIndex;
  let balanced = false;
  let previousChild: any = null;

  for (let i = startIndex; i < parent.children.length; i++) {
    const child = parent.children[i];
    const fragment = extractNodeText(child);

    if (fragment) {
      // MUDANÇA CRÍTICA: Preserva quebras de linha originais
      if (combined && previousChild) {
        combined += '\n';
      }
      combined += fragment;
    }

    previousChild = child;

    if (combined && hasBalancedShortcodes(combined)) {
      endIndex = i;
      balanced = true;
      break;
    }
  }

  if (!balanced) {
    return {
      combinedText: extractNodeText(parent.children[startIndex]),
      endIndex: startIndex,
    };
  }

  return { combinedText: combined, endIndex };
}

function parseShortcodes(text: string): ShortcodeMatch[] {
  const regex = /\[\[\s*([^\]]+?)\s*\]\]/g;
  const matches: ShortcodeMatch[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const fullMatch = match[0];
    const rawContent = match[1]?.trim() ?? '';

    if (!rawContent) continue;

    const isClosing = rawContent.startsWith('/');

    if (isClosing) {
      const name = rawContent.slice(1).trim();
      matches.push({
        type: 'closing',
        name,
        fullMatch,
        index: match.index,
      });
      continue;
    }

    const [namePart, ...paramsParts] = rawContent.split(':');
    const name = namePart.trim();
    const params = paramsParts.join(':').trim() || undefined;

    matches.push({
      type: 'opening',
      name,
      params,
      fullMatch,
      index: match.index,
    });
  }

  return matches;
}

function hasBalancedShortcodes(text: string): boolean {
  const normalized = normalizeShortcodeSyntax(text);
  const tokens = parseShortcodes(normalized);

  if (tokens.length === 0) return false;

  const stack: ShortcodeMatch[] = [];
  let sawClosing = false;

  for (const token of tokens) {
    if (token.type === 'opening') {
      stack.push(token);
      continue;
    }

    sawClosing = true;
    let matched = false;

    for (let i = stack.length - 1; i >= 0; i--) {
      if (stack[i].name === token.name) {
        stack.splice(i, 1);
        matched = true;
        break;
      }
    }

    if (!matched) return false;
  }

  return sawClosing && stack.length === 0;
}

function containsShortcode(text: string): boolean {
  return /\[\[.+?\]\]/.test(text);
}

async function transformShortcodes(
  raw: string,
  filePath?: string
): Promise<string> {
  const normalized = normalizeShortcodeSyntax(raw);
  const sanitizedBlocks = sanitizeTwoColumnsBlocks(normalized);

  // Processa listas ANTES de tudo
  const listsProcessed = await processListShortcodes(sanitizedBlocks, filePath);

  const inlineHandled = processInlineShortcodes(listsProcessed, filePath);
  return processShortcodesRecursive(inlineHandled, filePath);
}

function processInlineShortcodes(text: string, filePath?: string): string {
  let output = text;

  output = output.replace(
    /\[\[\s*youtube:(.*?)\s*\]\]/gi,
    (_match: string, rawId: string) => {
      const videoId = String(rawId || '').trim();
      if (!videoId) return _match;
      return `<div class="youtube-embed"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    }
  );

  output = output.replace(
    /\[\[\s*instagram:(.*?)\s*\]\]/gi,
    (_match: string, rawUrl: string) => {
      const permalink = String(rawUrl || '').trim();
      if (!permalink) return _match;
      const embedUrl = buildInstagramEmbedUrl(permalink);
      if (!embedUrl) return _match;
      const escapedUrl = escapeHtmlAttribute(embedUrl);
      return `<div class="instagram-embed"><iframe src="${escapedUrl}" loading="lazy" allowtransparency="true" allowfullscreen="true" frameborder="0" scrolling="no"></iframe></div>`;
    }
  );

  return output;
}

async function processShortcodesRecursive(
  source: string,
  filePath?: string
): Promise<string> {
  const text = normalizeShortcodeSyntax(source);
  const tokens = parseShortcodes(text);

  if (tokens.length === 0) return text;

  let result = '';
  let cursor = 0;
  const stack: Array<{ shortcode: ShortcodeMatch; contentStart: number }> = [];

  for (const token of tokens) {
    if (token.type === 'opening') {
      if (stack.length === 0 && token.index > cursor) {
        result += text.slice(cursor, token.index);
      }

      stack.push({
        shortcode: token,
        contentStart: token.index + token.fullMatch.length,
      });

      cursor = token.index + token.fullMatch.length;
      continue;
    }

    if (token.type === 'closing') {
      let openerIndex = -1;
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].shortcode.name === token.name) {
          openerIndex = i;
          break;
        }
      }

      if (openerIndex === -1) continue;

      const { shortcode: opening, contentStart } = stack[openerIndex];
      const inner = text.slice(contentStart, token.index);
      const processedInner = await processShortcodesRecursive(inner, filePath);

      if (openerIndex === 0) {
        result += await generateHTML(
          opening.name,
          opening.params,
          processedInner,
          (nested) => processShortcodesRecursive(nested, filePath),
          filePath
        );
      }

      stack.splice(openerIndex, 1);
      cursor = token.index + token.fullMatch.length;
    }
  }

  if (stack.length === 0 && cursor < text.length) {
    result += text.slice(cursor);
  }

  return result || text;
}

async function generateHTML(
  name: string,
  params: string | undefined,
  content: string,
  processNested: (text: string) => Promise<string>,
  filePath?: string
): Promise<string> {
  switch (name) {
    case 'link': {
      if (!params) return content;
      const [urlRaw, targetRaw] = params.split('|').map((item) => item.trim());
      const href = urlRaw || '#';
      const targetAttr =
        targetRaw === '_blank'
          ? ' target="_blank" rel="noopener noreferrer"'
          : '';
      const inner = await renderInlineMarkdown(content, filePath);
      return `<a href="${href}"${targetAttr} class="text-blue-600 hover:text-blue-800 underline">${inner}</a>`;
    }

    case 'two-columns': {
      const ratio = (params || '50/50').replace(/\s+/g, '');
      const [leftRaw, rightRaw] = ratio.split('/');
      const left = leftRaw || '50';
      const right = rightRaw || '50';

      const col1Match = content.match(/\[col1\]([\s\S]*?)\[\/col1\]/i);
      const col2Match = content.match(/\[col2\]([\s\S]*?)\[\/col2\]/i);

      const col1Raw = col1Match ? col1Match[1].trim() : '';
      const col2Raw = col2Match ? col2Match[1].trim() : '';

      const col1Content = await renderMarkdownBlock(
        col1Raw,
        processNested,
        filePath,
        { rewriteAssets: false }
      );
      const col2Content = await renderMarkdownBlock(
        col2Raw,
        processNested,
        filePath,
        { rewriteAssets: false }
      );

      return `<div class="layout-two-columns" style="--col1:${left}%;--col2:${right}%"><div class="layout-column-1">${col1Content}</div><div class="layout-column-2">${col2Content}</div></div>`;
    }

    case 'image-left':
    case 'image-right': {
      const [urlRaw, altRaw] = (params || '')
        .split('|')
        .map((item) => item.trim());
      const alt = altRaw || '';
      const url = urlRaw || '';
      const position = name === 'image-left' ? 'left' : 'right';
      const inner = await renderMarkdownBlock(content, processNested, filePath);

      return `<div class="layout-image-${position}"><div class="layout-image-container"><img src="${url}" alt="${alt}" loading="lazy" class="w-full" /></div><div class="layout-text-content">${inner}</div></div>`;
    }

    case 'card': {
      const inner = await renderMarkdownBlock(content, processNested, filePath);
      return `<div class="layout-card">${inner}</div>`;
    }

    case 'list': {
      // Se cair aqui, já foi processado antes
      return content;
    }

    default:
      return content;
  }
}

function unwrapParagraphsAroundMedia(html: string): string {
  return html
    .replace(
      /<p>\s*(<(?:img|picture|video|iframe)[^>]*?\/?>(?:\s*<source[^>]*?\/?>)*)\s*<\/p>/gi,
      '$1'
    )
    .replace(/<p>\s*(<figure[^>]*>[\s\S]*?<\/figure>)\s*<\/p>/gi, '$1');
}

function resolveAssetUrl(url: string, filePath?: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith('data:')) {
    return trimmed;
  }

  if (!filePath) return trimmed;

  const projectRoot = process.cwd();
  const srcDir = path.join(projectRoot, 'src');
  const fileDir = path.dirname(filePath);

  const toRelativeFromFile = (target: string) => {
    const relative = path.relative(fileDir, target).replace(/\\/g, '/');
    return relative || './';
  };

  if (trimmed.startsWith('/src/')) {
    const assetPath = trimmed.replace(/^\/src\//, '');
    const target = path.join(srcDir, assetPath);
    return toRelativeFromFile(target);
  }

  if (trimmed.startsWith('@/')) {
    const assetPath = trimmed.replace(/^@\/?/, '');
    const target = path.join(srcDir, assetPath);
    return toRelativeFromFile(target);
  }

  if (trimmed.startsWith('./') || trimmed.startsWith('../')) {
    const target = path.resolve(fileDir, trimmed);
    return toRelativeFromFile(target);
  }

  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  const target = path.resolve(fileDir, trimmed);
  return toRelativeFromFile(target);
}

export const remarkShortcodes: RemarkPlugin = () => {
  return async (tree: any, file: any) => {
    const filePath =
      typeof file?.history?.[0] === 'string' ? file.history[0] : undefined;

    const replacements: ShortcodeReplacement[] = [];

    visit(
      tree,
      (node: any, index: number | undefined, parent: ParentNode | null) => {
        if (!parent || typeof index !== 'number') return;
        if (node.type !== 'text' && node.type !== 'paragraph') return;

        const initialText =
          node.type === 'text'
            ? String(node.value ?? '')
            : extractParagraphText(node);

        if (!containsShortcode(initialText)) return;

        const { combinedText, endIndex } = collectShortcodeRange(parent, index);
        replacements.push({
          parent,
          startIndex: index,
          endIndex,
          combinedText,
        });

        return SKIP;
      }
    );

    if (replacements.length === 0) return;

    const resolved: ResolvedReplacement[] = await Promise.all(
      replacements.map(async (item) => {
        const processed = await transformShortcodes(
          item.combinedText,
          filePath
        );
        return { ...item, processed };
      })
    );

    const grouped = new Map<ParentNode, ResolvedReplacement[]>();

    for (const item of resolved) {
      if (item.processed === item.combinedText) continue;

      const existing = grouped.get(item.parent);
      if (existing) {
        existing.push(item);
      } else {
        grouped.set(item.parent, [item]);
      }
    }

    for (const list of grouped.values()) {
      list.sort((a, b) => b.startIndex - a.startIndex);

      for (const { parent, startIndex, endIndex, processed } of list) {
        parent.children.splice(startIndex, endIndex - startIndex + 1, {
          type: 'html',
          value: processed,
        });
      }
    }
  };
};
