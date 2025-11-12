import { visit } from 'unist-util-visit';
import type { RemarkPlugin } from '@astrojs/markdown-remark';

/**
 * Plugin Remark para processar shortcodes de layout no markdown
 * 
 * Shortcodes suportados:
 * - [[two-columns:70/30]] ... [[/two-columns]]
 * - [[image-left: url]] ... [[/image-left]]
 * - [[image-right: url]] ... [[/image-right]]
 * - [[card]] ... [[/card]]
 * - [[alert:tipo]] ... [[/alert]]
 */

interface ShortcodeMatch {
  type: 'opening' | 'closing';
  name: string;
  params?: string;
  fullMatch: string;
  index: number;
}

export const remarkLayoutShortcodes: RemarkPlugin = () => {
  return function (tree) {
    const nodesToProcess: any[] = [];

    // Coleta todos os nós de texto que precisam ser processados
    visit(tree, 'text', (node: any, index, parent) => {
      if (!parent || index === null || typeof node.value !== 'string') {
        return;
      }

      const text = node.value;
      const shortcodeRegex = /\[\[([^\]]+)\]\]/g;
      
      if (shortcodeRegex.test(text)) {
        nodesToProcess.push({ node, index, parent });
      }
    });

    // Processa cada nó coletado
    nodesToProcess.forEach(({ node, index, parent }) => {
      processTextNode(node, index, parent);
    });
  };
};

function processTextNode(node: any, index: number, parent: any) {
  const text = node.value;
  const shortcodes = parseShortcodes(text);

  if (shortcodes.length === 0) return;

  const newNodes: any[] = [];
  let lastIndex = 0;
  let openStack: ShortcodeMatch[] = [];

  shortcodes.forEach((shortcode, i) => {
    if (shortcode.type === 'opening') {
      // Adiciona texto antes do shortcode
      if (shortcode.index > lastIndex) {
        newNodes.push({
          type: 'text',
          value: text.slice(lastIndex, shortcode.index),
        });
      }

      openStack.push(shortcode);
      lastIndex = shortcode.index + shortcode.fullMatch.length;
    } else if (shortcode.type === 'closing' && openStack.length > 0) {
      const opening = openStack.pop()!;
      
      // Conteúdo entre abertura e fechamento
      const contentStart = lastIndex;
      const contentEnd = shortcode.index;
      const content = text.slice(contentStart, contentEnd);

      // Gera HTML baseado no tipo de shortcode
      const html = generateHTML(opening.name, opening.params, content);
      
      newNodes.push({
        type: 'html',
        value: html,
      });

      lastIndex = shortcode.index + shortcode.fullMatch.length;
    }
  });

  // Adiciona texto restante
  if (lastIndex < text.length) {
    newNodes.push({
      type: 'text',
      value: text.slice(lastIndex),
    });
  }

  // Substitui o nó original pelos novos nós
  if (newNodes.length > 0) {
    parent.children.splice(index, 1, ...newNodes);
  }
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

function generateHTML(name: string, params: string | undefined, content: string): string {
  switch (name) {
    case 'two-columns': {
      const ratio = params || '50/50';
      const [left, right] = ratio.split('/').map(v => v.trim());
      
      // Divide conteúdo por [col1], [col2]
      const col1Match = content.match(/\[col1\]([\s\S]*?)\[\/col1\]/);
      const col2Match = content.match(/\[col2\]([\s\S]*?)\[\/col2\]/);
      
      const col1Content = col1Match ? col1Match[1].trim() : '';
      const col2Content = col2Match ? col2Match[1].trim() : '';
      
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
      const variant = params || 'default';
      return `<div class="layout-card layout-card-${variant}">${content.trim()}</div>`;
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
      
      return `<div class="layout-alert layout-alert-${type}">
  <span class="layout-alert-icon">${icon}</span>
  <div class="layout-alert-content">${content.trim()}</div>
</div>`;
    }

    default:
      return content;
  }
}
