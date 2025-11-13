/**
 * Plugin Vite para preprocessar shortcodes em arquivos markdown
 * Roda ANTES do Astro processar o markdown
 */
export function viteShortcodePreprocessor(): any {
  return {
    name: 'shortcode-preprocessor',
    enforce: 'pre', // Roda antes de outros plugins

    transform(code: string, id: string) {
      // Só processa arquivos .md
      if (!id.endsWith('.md')) return null;

      // Processa two-columns
      let processed = code;

      const twoColRegex =
        /\[\[two-columns:([^\]]+)\]\]\s*([\s\S]*?)\s*\[\[\/two-columns\]\]/g;

      processed = processed.replace(
        twoColRegex,
        (_match: string, ratio: string, content: string) => {
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
        }
      );

      if (processed !== code) {
        return {
          code: processed,
          map: null,
        };
      }

      return null;
    },
  };
}
