import type { RemarkPlugin } from '@astrojs/markdown-remark';

/**
 * Plugin que preprocessa shortcodes ANTES do markdown ser parseado
 * Converte shortcodes diretamente para HTML preservando o conteúdo
 */

export const preprocessShortcodes: RemarkPlugin = () => {
  return function (tree: any, file: any) {
    // Acessa o valor original do markdown antes do parse
    const originalMarkdown = file.value;

    if (typeof originalMarkdown === 'string' && /\[\[/.test(originalMarkdown)) {
      const processed = processShortcodes(originalMarkdown);

      if (processed !== originalMarkdown) {
        // Substitui o valor do arquivo
        file.value = processed;
      }
    }
  };
};

function processShortcodes(markdown: string): string {
  // Processa two-columns
  const twoColRegex =
    /\[\[two-columns:([^\]]+)\]\]\s*([\s\S]*?)\s*\[\[\/two-columns\]\]/g;

  markdown = markdown.replace(twoColRegex, (match, ratio, content) => {
    const [left, right] = ratio.split('/').map((v: string) => v.trim());

    // Extrai col1 e col2
    const col1Match = content.match(/\[col1\]([\s\S]*?)\[\/col1\]/);
    const col2Match = content.match(/\[col2\]([\s\S]*?)\[\/col2\]/);

    const col1 = col1Match ? col1Match[1].trim() : '';
    const col2 = col2Match ? col2Match[1].trim() : '';

    return `<div class="layout-two-columns" style="--col1:${left}%;--col2:${right}%;">
<div class="layout-column-1">

${col1}

</div>
<div class="layout-column-2">

${col2}

</div>
</div>`;
  });

  return markdown;
}
