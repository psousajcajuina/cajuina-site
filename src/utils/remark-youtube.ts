import { visit } from 'unist-util-visit';
import type { RemarkPlugin } from '@astrojs/markdown-remark';

/**
 * Plugin Remark para processar shortcodes do YouTube no formato [[youtube:VIDEO_ID]]
 * e transformá-los em iframes embeddados responsivos.
 * 
 * Uso: [[youtube:dQw4w9WgXcQ]]
 * Resultado: <div class="youtube-embed"><iframe src="..."></iframe></div>
 */
export const remarkYouTubePlugin: RemarkPlugin = () => {
  return function (tree) {
    visit(tree, 'text', (node: any, index, parent) => {
      if (!parent || index === null || typeof node.value !== 'string') {
        return;
      }

      const regex = /\[\[youtube:([a-zA-Z0-9_-]+)\]\]/g;
      const matches = [...node.value.matchAll(regex)];

      if (matches.length === 0) {
        return;
      }

      const newNodes: any[] = [];
      let lastIndex = 0;

      matches.forEach((match) => {
        const videoId = match[1];
        const matchIndex = match.index!;

        // Adiciona texto antes do match (se houver)
        if (matchIndex > lastIndex) {
          newNodes.push({
            type: 'text',
            value: node.value.slice(lastIndex, matchIndex),
          });
        }

        // Adiciona o iframe do YouTube
        newNodes.push({
          type: 'html',
          value: `<div class="youtube-embed">
  <iframe 
    src="https://www.youtube.com/embed/${videoId}" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    referrerpolicy="strict-origin-when-cross-origin" 
    allowfullscreen
  ></iframe>
</div>`,
        });

        lastIndex = matchIndex + match[0].length;
      });

      // Adiciona texto restante após o último match (se houver)
      if (lastIndex < node.value.length) {
        newNodes.push({
          type: 'text',
          value: node.value.slice(lastIndex),
        });
      }

      // Substitui o nó de texto original pelos novos nós
      parent.children.splice(index, 1, ...newNodes);
    });
  };
};
