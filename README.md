# Cajuína Site - Monorepo

Site da Cajuína com TinaCMS configurado em monorepo usando pnpm workspaces.

## 🏗️ Estrutura do Monorepo

```text
├── apps/
│   ├── frontend/          # Site Astro com TinaCMS
│   └── backend/           # Configuração do banco de dados Tina
├── env.ts                 # Configurações de ambiente compartilhadas
├── consts.ts             # Constantes compartilhadas
├── package.json          # Scripts do monorepo
├── pnpm-workspace.yaml   # Configuração do workspace
└── tsconfig.json         # Configuração TypeScript raiz
```

## 🚀 Comandos Disponíveis

Todos os comandos devem ser executados na raiz do projeto:

### Desenvolvimento
| Comando                    | Ação                                           |
| :------------------------ | :--------------------------------------------- |
| `pnpm install`            | Instala todas as dependências                  |
| `pnpm dev`                | Inicia desenvolvimento paralelo               |
| `pnpm dev:frontend`       | Inicia apenas o frontend                      |
| `pnpm dev:backend`        | Inicia apenas o backend                       |

### Build e Produção
| Comando                   | Ação                                           |
| :------------------------ | :--------------------------------------------- |
| `pnpm build`              | Build de todos os projetos                    |
| `pnpm build:frontend`     | Build apenas do frontend                      |
| `pnpm build:backend`      | Build apenas do backend                       |

### Utilitários
| Comando                   | Ação                                           |
| :------------------------ | :--------------------------------------------- |
| `pnpm type-check`         | Verifica tipos em todos os projetos          |
| `pnpm lint`               | Executa linting em todos os projetos         |

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