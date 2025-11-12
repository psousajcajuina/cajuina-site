---
title: 'Guia para Editores - Cajuína São Geraldo'
layout: '@/layouts/MarkdownLayout.astro'
robots: 'noindex, nofollow'
---
# Guia para Editores - Cajuína São Geraldo

## � Ferramenta Rápida: Bookmarklet YouTube

**A maneira mais fácil de adicionar vídeos do YouTube!**

### O que é?

Um bookmarklet é um "favorito inteligente" que converte automaticamente URLs do YouTube em shortcodes. Em vez de copiar e colar IDs manualmente, você:

1. Clica no favorito
2. Cola a URL do YouTube
3. O shortcode `[[youtube:ID]]` é copiado automaticamente
4. Cola no editor com `Ctrl+V`

### 📥 Como Instalar

**[👉 CLIQUE AQUI PARA INSTALAR A FERRAMENTA](/admin/youtube-helper)**

Acesse a página de instalação e arraste o botão para seus favoritos. Leva menos de 30 segundos!

**Ou acesse diretamente:**
```
http://seu-site.com/admin/youtube-helper
```

### 🎯 Como Usar

**Método Rápido (com bookmarklet):**

1. No YouTube, encontre o vídeo que deseja adicionar
2. Copie a URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
3. No CMS, clique no bookmarklet "YouTube → Shortcode" nos seus favoritos
4. Cole a URL quando solicitado
5. O shortcode `[[youtube:dQw4w9WgXcQ]]` é copiado automaticamente
6. Cole no editor markdown com `Ctrl+V`

**Pronto! 🎉**

---

## �📝 Como Adicionar Vídeos do YouTube nos Posts

O CMS agora suporta a incorporação de vídeos do YouTube diretamente no conteúdo dos posts usando uma sintaxe simples.

### Sintaxe

```markdown
[[youtube:VIDEO_ID]]
```

### Como Obter o ID do Vídeo (Método Manual)

**💡 Dica:** Use o bookmarklet para fazer isso automaticamente!

O ID do vídeo é a parte final da URL do YouTube:

**Exemplo 1:**
- URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- ID: `dQw4w9WgXcQ`

**Exemplo 2:**
- URL: `https://youtu.be/9bZkp7q19f0`
- ID: `9bZkp7q19f0`

### Passo a Passo

1. Acesse o vídeo no YouTube que deseja incorporar
2. Copie a URL do vídeo da barra de endereços
3. Extraia o ID (última parte após `watch?v=` ou após `youtu.be/`)
4. No editor de posts, use a sintaxe: `[[youtube:SEU_ID_AQUI]]`

### Exemplos Práticos

**Incorporar um vídeo:**
```markdown
Confira o vídeo da campanha:

[[youtube:dQw4w9WgXcQ]]

Este foi um grande sucesso!
```

**Múltiplos vídeos no mesmo post:**
```markdown
## Vídeo 1 - Lançamento

[[youtube:abc123def]]

## Vídeo 2 - Making Of

[[youtube:xyz789ghi]]
```

### ✅ Boas Práticas

- Os vídeos são automaticamente responsivos (se ajustam ao tamanho da tela)
- Adicione contexto antes e depois do vídeo para melhor experiência do leitor
- Use IDs válidos do YouTube (11 caracteres, letras, números, _ e -)
- Evite adicionar muitos vídeos em um único post (máximo 3-4 recomendado)

### ❌ Erros Comuns

**Não funciona:**
```markdown
[[youtube:https://www.youtube.com/watch?v=dQw4w9WgXcQ]]  ❌ (URL completa)
[[youtube: dQw4w9WgXcQ]]                                  ❌ (espaço após :)
[[yt:dQw4w9WgXcQ]]                                        ❌ (abreviação incorreta)
```

**Funciona:**
```markdown
[[youtube:dQw4w9WgXcQ]]  ✅
```

### 🎨 Aparência

Os vídeos incorporados terão:
- Proporção 16:9 (padrão YouTube)
- Bordas arredondadas
- Sombra suave
- Margem superior e inferior automática
- Largura 100% responsiva

### 🆘 Suporte

Se tiver dúvidas ou problemas:
1. **Use o bookmarklet** - é a forma mais fácil e evita erros
2. Verifique se o ID está correto (teste abrindo `https://youtube.com/watch?v=SEU_ID`)
3. Certifique-se de usar colchetes duplos `[[` e `]]`
4. Não adicione espaços desnecessários
5. Teste a conversão na [página da ferramenta](/admin/youtube-helper) antes de usar
6. Entre em contato com o time de desenvolvimento se persistir

### 🔧 Solução de Problemas

**O vídeo não aparece no site:**
- Aguarde alguns minutos após salvar o post
- Limpe o cache do navegador (`Ctrl+Shift+R`)
- Verifique se o ID do vídeo está correto

**O bookmarklet não funciona:**
- Certifique-se de ter arrastado o botão para os favoritos (não clicado)
- Teste se a barra de favoritos está visível (`Ctrl+Shift+B`)
- Alguns navegadores podem bloquear - tente em outro navegador
- Use o método manual como alternativa

**Erro "URL inválida":**
- Certifique-se de estar usando uma URL do YouTube válida
- Formatos aceitos: `youtube.com/watch?v=`, `youtu.be/`, `youtube.com/embed/`
- Não use URLs de playlists ou canais

---

**Última atualização:** 12 de Novembro de 2025
