# Guia para Editores - Cajuína São Geraldo

## 📝 Como Adicionar Vídeos do YouTube nos Posts

O CMS agora suporta a incorporação de vídeos do YouTube diretamente no conteúdo dos posts usando uma sintaxe simples.

### Sintaxe

```markdown
[[youtube:VIDEO_ID]]
```

### Como Obter o ID do Vídeo

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
1. Verifique se o ID está correto (teste abrindo `https://youtube.com/watch?v=SEU_ID`)
2. Certifique-se de usar colchetes duplos `[[` e `]]`
3. Não adicione espaços desnecessários
4. Entre em contato com o time de desenvolvimento se persistir

---

**Última atualização:** 12 de Novembro de 2025
