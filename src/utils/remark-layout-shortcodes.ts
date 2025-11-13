import { visit } from 'unist-util-visit';
import type { RemarkPlugin } from '@astrojs/markdown-remark';

/**
 * Plugin Remark para processar shortcodes de layout no markdown
 *
 * Shortcodes suportados:
 * - [[youtube:videoId]] - Embed de vídeo do YouTube
 * - [[heading:h4|#color]]Texto[[/heading]] - Título com cor customizada
 * - [[image:url|alt|size:align]] - Imagem com configurações
 * - [[link:url|target]]Texto[[/link]] - Link com target customizado
 * - [[two-columns:70/30]] [col1]...[/col1] [col2]...[/col2] [[/two-columns]]
 * - [[image-left: url]] ... [[/image-left]]
 * - [[image-right: url]] ... [[/image-right]]
 * - [[card]] ... [[/card]] ou [[card:highlighted]] ... [[/card]]
 * - [[alert:tipo]] ... [[/alert]] (info, success, warning, error)
 *
 * Suporta aninhamento recursivo de shortcodes.
 */

interface ShortcodeMatch {
  type: 'opening' | 'closing';
  name: string;
  params?: string;
  fullMatch: string;
  index: number;
}

export const remarkLayoutShortcodes: RemarkPlugin = () => {
  return function (tree: any) {
    visit(tree, (node, index, parent) => {
      // Processa nós de texto diretos
      if (
        node.type === 'text' &&
        parent &&
        typeof index === 'number' &&
        /\[\[/.test(node.value)
      ) {
        processTextNode(node, index, parent);
      }

      // Processa parágrafos que podem conter shortcodes multi-linha
      if (node.type === 'paragraph' && parent && typeof index === 'number') {
        const textContent = extractTextFromParagraph(node);
        if (/\[\[/.test(textContent)) {
          processParagraphNode(node, index, parent);
        }
      }
    });
  };
};

// Extrai todo texto de um parágrafo, incluindo nós aninhados
function extractTextFromParagraph(node: any): string {
  if (!node.children) return '';

  let text = '';
  for (const child of node.children) {
    if (child.type === 'text') {
      text += child.value;
    } else if (child.type === 'strong') {
      text += '**' + child.children.map((c: any) => c.value).join('') + '**';
    } else if (child.type === 'emphasis') {
      text += '*' + child.children.map((c: any) => c.value).join('') + '*';
    } else if (child.type === 'image') {
      text += `![${child.alt || ''}](${child.url}${child.title ? ` "${child.title}"` : ''})`;
    } else if (child.children) {
      text += extractTextFromParagraph(child);
    }
  }
  return text;
}

function processTextNode(node: any, index: number, parent: any) {
  const text = node.value;
  const processed = processShortcodesRecursive(text);

  if (processed === text) return;

  // Substitui o nó original por um nó HTML
  parent.children.splice(index, 1, {
    type: 'html',
    value: processed,
  });
}

function processParagraphNode(node: any, index: number, parent: any) {
  // Extrai todo o conteúdo do parágrafo
  const textContent = node.children
    .map((child: any) => {
      if (child.type === 'text') return child.value;
      if (child.type === 'strong')
        return `**${child.children.map((c: any) => c.value).join('')}**`;
      if (child.type === 'emphasis')
        return `*${child.children.map((c: any) => c.value).join('')}*`;
      if (child.type === 'image') return `![${child.alt || ''}](${child.url})`;
      return '';
    })
    .join('');

  const processed = processShortcodesRecursive(textContent);

  if (processed === textContent) return;

  // Substitui o parágrafo por HTML
  parent.children.splice(index, 1, {
    type: 'html',
    value: processed,
  });
}

function processShortcodesRecursive(text: string): string {
  const shortcodes = parseShortcodes(text);

  if (shortcodes.length === 0) return text;

  let result = '';
  let lastIndex = 0;
  const stack: Array<{ shortcode: ShortcodeMatch; contentStart: number }> = [];

  for (let i = 0; i < shortcodes.length; i++) {
    const shortcode = shortcodes[i];

    if (shortcode.type === 'opening') {
      // Adiciona texto antes do shortcode de abertura
      if (stack.length === 0 && shortcode.index > lastIndex) {
        result += text.slice(lastIndex, shortcode.index);
      }

      // Empilha o shortcode de abertura
      stack.push({
        shortcode,
        contentStart: shortcode.index + shortcode.fullMatch.length,
      });

      lastIndex = shortcode.index + shortcode.fullMatch.length;
    } else if (shortcode.type === 'closing' && stack.length > 0) {
      // Encontra o shortcode de abertura correspondente
      let matchingIndex = -1;
      for (let j = stack.length - 1; j >= 0; j--) {
        if (stack[j].shortcode.name === shortcode.name) {
          matchingIndex = j;
          break;
        }
      }

      if (matchingIndex !== -1) {
        const { shortcode: opening, contentStart } = stack[matchingIndex];

        // Extrai conteúdo entre abertura e fechamento
        const rawContent = text.slice(contentStart, shortcode.index);

        // Processa shortcodes aninhados recursivamente
        const processedContent = processShortcodesRecursive(rawContent);

        // Se estamos no nível superior, adiciona ao resultado
        if (matchingIndex === 0) {
          const html = generateHTML(
            opening.name,
            opening.params,
            processedContent,
            processShortcodesRecursive
          );
          result += html;
        }

        // Remove da pilha
        stack.splice(matchingIndex, 1);

        lastIndex = shortcode.index + shortcode.fullMatch.length;
      }
    }
  }

  // Adiciona texto restante
  if (stack.length === 0 && lastIndex < text.length) {
    result += text.slice(lastIndex);
  }

  return result || text;
}

function parseShortcodes(text: string): ShortcodeMatch[] {
  const regex = /\[\[([^\]]+)\]\]/g;
  const matches: ShortcodeMatch[] = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const fullMatch = match[0];
    const content = match[1];
    const isClosing = content.startsWith('/');

    if (isClosing) {
      matches.push({
        type: 'closing',
        name: content.slice(1).trim(),
        fullMatch,
        index: match.index,
      });
    } else {
      const [name, ...paramsParts] = content.split(':');
      matches.push({
        type: 'opening',
        name: name.trim(),
        params: paramsParts.join(':').trim() || undefined,
        fullMatch,
        index: match.index,
      });
    }
  }

  return matches;
}

function generateHTML(
  name: string,
  params: string | undefined,
  content: string,
  processNested: (text: string) => string
): string {
  switch (name) {
    case 'youtube': {
      const videoId = params || '';
      return `<div class="youtube-embed">
  <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>`;
    }

    case 'heading': {
      if (!params) return content;
      const [level, color] = params.split('|').map((p) => p.trim());
      const headingLevel = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(level)
        ? level
        : 'h4';
      const safeColor = color || '#D98338';
      return `<${headingLevel} style="color:${safeColor};">${content}</${headingLevel}>`;
    }

    case 'image': {
      if (!params) return '';
      const parts = params.split('|').map((p) => p.trim());
      const url = parts[0] || '';
      const alt = parts[1] || 'Imagem';
      const [width, align] = (parts[2] || 'medium:center').split(':');

      const widthMap: Record<string, string> = {
        small: 'max-w-xs',
        medium: 'max-w-md',
        large: 'max-w-2xl',
        full: 'max-w-full',
      };
      const alignMap: Record<string, string> = {
        center: 'mx-auto',
        left: 'mr-auto',
        right: 'ml-auto',
      };

      const widthClass = widthMap[width] || 'max-w-md';
      const alignClass = alignMap[align] || 'mx-auto';

      return `<div class="my-4"><img src="${url}" alt="${alt}" loading="lazy" class="${widthClass} ${alignClass} rounded-lg shadow-md" /></div>`;
    }

    case 'link': {
      if (!params) return content;
      const [url, target] = params.split('|').map((p) => p.trim());
      const targetAttr =
        target === '_blank' ? 'target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${url}" ${targetAttr} class="text-blue-600 hover:text-blue-800 underline">${content}</a>`;
    }

    case 'two-columns': {
      const ratio = params || '50/50';
      const [left, right] = ratio.split('/').map((v) => v.trim());

      // Divide conteúdo por [col1], [col2]
      const col1Match = content.match(/\[col1\]([\s\S]*?)\[\/col1\]/);
      const col2Match = content.match(/\[col2\]([\s\S]*?)\[\/col2\]/);

      const col1Raw = col1Match ? col1Match[1].trim() : '';
      const col2Raw = col2Match ? col2Match[1].trim() : '';

      // Processa markdown básico (parágrafos, negrito, itálico)
      const processMarkdown = (text: string) => {
        if (!text) return '';

        // Processa shortcodes aninhados primeiro
        let processed = processNested(text);

        // Converte quebras de linha duplas em parágrafos
        processed = processed
          .split(/\n\n+/)
          .filter((p) => p.trim())
          .map((p) => `<p>${p.trim()}</p>`)
          .join('\n');

        // Processa markdown inline
        processed = processed
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/\*([^*]+)\*/g, '<em>$1</em>')
          .replace(/\n/g, '<br>');

        return processed;
      };

      const col1Content = processMarkdown(col1Raw);
      const col2Content = processMarkdown(col2Raw);

      return `<div class="layout-two-columns" style="--col1:${left}%;--col2:${right}%;">
  <div class="layout-column-1">${col1Content}</div>
  <div class="layout-column-2">${col2Content}</div>
</div>`;
    }

    case 'image-left':
    case 'image-right': {
      const imageUrl = params || '';
      const position = name === 'image-left' ? 'left' : 'right';

      return `<div class="layout-image-${position}">
  <div class="layout-image-container">
    <img src="${imageUrl}" alt="" loading="lazy" />
  </div>
  <div class="layout-text-content">${content.trim()}</div>
</div>`;
    }

    case 'card': {
      const variant = params ? params : '';
      const cardClass = variant ? `layout-card-${variant}` : '';

      // Processa markdown no conteúdo do card
      const processedContent = content
        .split(/\n\n+/)
        .filter((p) => p.trim())
        .map((p) => `<p>${p.trim()}</p>`)
        .join('\n')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');

      return `<div class="layout-card ${cardClass}">${processedContent}</div>`;
    }

    case 'alert': {
      const type = params || 'info';
      const icons: Record<string, string> = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌',
      };
      const icon = icons[type] || icons.info;

      // Processa markdown no conteúdo do alert
      const processedContent = content
        .split(/\n\n+/)
        .filter((p) => p.trim())
        .map((p) => `<p>${p.trim()}</p>`)
        .join('\n')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');

      return `<div class="layout-alert layout-alert-${type}">
  <span class="layout-alert-icon">${icon}</span>
  <div class="layout-alert-content">${processedContent}</div>
</div>`;
    }

    default:
      return content;
  }
}
