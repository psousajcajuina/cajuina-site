# Cajuína Site

Site da Cajuína construído com Astro SSG e TinaCMS para gerenciamento de conteúdo.

## 🏗️ Estrutura do Projeto

```text
├── api/                   # API do TinaCMS backend
│   └── tina/             # Configurações do TinaCMS backend
├── src/                   # Código fonte do Astro
│   ├── components/       # Componentes Astro e React
│   ├── content/          # Conteúdo gerenciado pelo TinaCMS
│   ├── layouts/          # Layouts do Astro
│   ├── pages/            # Páginas do site (rotas)
│   └── styles/           # Estilos globais
├── tina/                  # Configuração do TinaCMS
│   ├── collections/      # Definições das coleções
│   ├── components/       # Componentes customizados do admin
│   └── config.ts         # Configuração principal do Tina
├── public/               # Arquivos estáticos
├── astro-tina-directive/ # Diretiva customizada do Astro para Tina
├── env.ts                # Configurações de ambiente
├── consts.ts             # Constantes do projeto
├── astro.config.mjs      # Configuração do Astro
├── package.json          # Dependências e scripts
└── tsconfig.json         # Configuração TypeScript
```

## 🚀 Comandos Disponíveis

Todos os comandos devem ser executados na raiz do projeto:

### Desenvolvimento
| Comando                    | Ação                                           |
| :------------------------ | :--------------------------------------------- |
| `pnpm install`            | Instala todas as dependências                  |
| `pnpm dev`                | Inicia desenvolvimento com TinaCMS            |

### Build e Produção
| Comando                   | Ação                                           |
| :------------------------ | :--------------------------------------------- |
| `pnpm build`              | Build do TinaCMS e do site Astro              |
| `pnpm preview`            | Preview do build de produção                  |

### Utilitários
| Comando                   | Ação                                           |
| :------------------------ | :--------------------------------------------- |
| `pnpm type-check`         | Verifica tipos TypeScript                     |
| `pnpm astro`              | Executa comandos do Astro CLI                 |

## 🔧 Configuração

### Environment Variables

1. Copie o arquivo `.env.example` para `.env`
2. Configure as variáveis necessárias:

```bash
cp .env.example .env
```

### Variáveis Importantes

- `TINA_PUBLIC_IS_LOCAL=true` - Modo de desenvolvimento local
- `MONGODB_URI` - String de conexão MongoDB (para produção)
- `GITHUB_*` - Configurações do GitHub (para produção)

## 📁 Apps

### Frontend (`apps/frontend`)
- Site Astro com TinaCMS
- Configuração em `apps/frontend/tina/config.ts`
- Build output: `dist/`

### Backend (`apps/backend`)
- Database client do TinaCMS
- Configuração de providers (GitHub, MongoDB)
- APIs para autenticação

## 🔧 TypeScript

O monorepo está configurado com:
- Path mapping para módulos compartilhados (`@env`, `@consts`, `@tina`)
- Configuração composite para builds eficientes
- Type checking automatizado

## 📦 Workspaces

Configurado com pnpm workspaces para:
- Compartilhamento de dependências
- Builds paralelos
- Type checking coordenado

## 🚀 Deploy

### Frontend
O frontend pode ser deployado em qualquer plataforma que suporte Astro:
- Vercel
- Netlify 
- AWS Amplify

### Backend
O backend deve ser deployado com as seguintes variáveis configuradas:
- `TINA_PUBLIC_IS_LOCAL=false`
- Todas as variáveis de produção do `.env.example`

## 📖 Documentação

- [Astro Documentation](https://docs.astro.build)
- [TinaCMS Documentation](https://tina.io/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)

## ✅ Setup Completo

O monorepo foi configurado com:

### ✅ Problemas Resolvidos
- ❌ Erros de TypeScript nos imports (`@env`, `@consts`, `@tina`)
- ❌ Configuração de paths inválidos  
- ❌ Dependências mal organizadas
- ❌ Scripts de build inconsistentes

### ✅ Configurações Implementadas
- ✅ TypeScript configurado com composite projects
- ✅ Path mapping para módulos compartilhados
- ✅ pnpm workspaces configurado
- ✅ Scripts de desenvolvimento e build
- ✅ Type checking automático
- ✅ Estrutura de monorepo organizada

### 🔄 Para usar:
```bash
# Instalar dependências
pnpm install

# Desenvolvimento (apenas frontend funcional)
pnpm dev:frontend

# Type checking
pnpm type-check

# Build
pnpm build
```

O projeto está pronto para desenvolvimento! 🎉