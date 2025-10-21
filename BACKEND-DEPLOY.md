# Backend TinaCMS - Deploy Guide

## Estrutura de Deploy

### Frontend (SSG - Astro)
- **Hospedagem**: Servidor estático (Netlify, Vercel, ou seu FTP atual)
- **Build**: `pnpm build` gera pasta `dist/`
- **Conteúdo**: HTML/CSS/JS estáticos

### Backend (Node.js - TinaCMS API)
- **Hospedagem**: Servidor Node.js (Railway, Render, DigitalOcean, AWS, etc)
- **Arquivos necessários**:
  - `api/tina.ts`
  - `tina/` (config, database, collections)
  - `package.json` (dependências)
  - `.env` (variáveis de ambiente)

## Configuração de Variáveis de Ambiente

### Frontend (Astro - Build Time)
Adicionar ao seu ambiente de build/deploy:
```bash
# URLs do backend (públicas - serão expostas no browser)
PUBLIC_TINA_GRAPHQL_URL=https://seu-backend.exemplo.com/api/tina/graphql
PUBLIC_TINA_API_URL=https://seu-backend.exemplo.com

# Configurações do site
FRONTEND_SITE_URL=https://cajuinasaogeraldo.com.br
FRONTEND_SITE_TITLE=São Geraldo
FRONTEND_SITE_DESCRIPTION="Descrição do site"
FRONTEND_TINA_IS_LOCAL=false
```

### Backend (Node.js - Runtime)
```bash
# ===== BACKEND - GitHub =====
BACKEND_GITHUB_BRANCH=main
BACKEND_GITHUB_REPO=cajuina-site
BACKEND_GITHUB_OWNER=psousajcajuina
BACKEND_GITHUB_TOKEN=seu_token_github

# ===== BACKEND - Auth =====
BACKEND_NEXTAUTH_SECRET=seu_secret_seguro_aqui_min_32_chars
BACKEND_AUTH_MS_CLIENT_ID=seu_client_id
BACKEND_AUTH_MS_CLIENT_SECRET=seu_client_secret
BACKEND_AUTH_MS_TENANT_ID=seu_tenant_id

# ===== BACKEND - Database (Upstash Redis) =====
BACKEND_UPSTASH_REDIS_URL=https://seu-redis.upstash.io
BACKEND_UPSTASH_REDIS_TOKEN=seu_token_redis

# ===== BACKEND - Server Config =====
BACKEND_PORT=4001
BACKEND_CORS_ORIGINS=https://cajuinasaogeraldo.com.br,https://www.cajuinasaogeraldo.com.br
BACKEND_DEBUG=false

# ===== FRONTEND - Site Info (usado pelo backend para CORS) =====
FRONTEND_SITE_URL=https://cajuinasaogeraldo.com.br

# Node Environment
NODE_ENV=production
```

## Deploy do Backend

### Opção 1: Railway (Recomendado para iniciantes)
```bash
# 1. Instalar Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Criar novo projeto
railway init

# 4. Adicionar variáveis de ambiente no dashboard
# 5. Deploy
railway up
```

### Opção 2: Render
1. Conectar repositório GitHub
2. Configurar:
   - Build Command: `pnpm install`
   - Start Command: `node --loader ts-node/esm api/tina.ts`
3. Adicionar variáveis de ambiente

### Opção 3: DigitalOcean App Platform
1. Criar novo app do GitHub
2. Detectar automaticamente Node.js
3. Configurar variáveis de ambiente
4. Deploy automático

### Opção 4: Servidor próprio (VPS)
```bash
# 1. Instalar Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Instalar PM2
sudo npm install -g pm2 pnpm

# 3. Clonar código do backend
git clone seu-repo
cd seu-repo

# 4. Instalar dependências
pnpm install

# 5. Configurar .env

# 6. Iniciar com PM2
pm2 start api/tina.ts --name tina-backend --interpreter node --interpreter-args "--loader ts-node/esm"
pm2 save
pm2 startup
```

## Fluxo de Trabalho

### Desenvolvimento Local
```bash
# Terminal 1 - Backend + Frontend juntos
pnpm dev
# Acessa: http://localhost:4321
```

### Produção
```bash
# Frontend (gera arquivos estáticos)
pnpm build
# Upload pasta dist/ para servidor estático

# Backend (já rodando no servidor Node)
# Processa requisições do CMS em runtime
```

## Acesso ao CMS em Produção

URL: `https://cajuinasaogeraldo.com.br/admin/index.html`

O CMS carregará no frontend estático, mas fará requests para:
- `https://seu-backend.exemplo.com/api/tina/graphql` (queries)
- `https://seu-backend.exemplo.com/api/tina/auth` (autenticação)

## Verificação

### Testar Backend
```bash
curl https://seu-backend.exemplo.com/api/tina/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ getOptimizedQuery { queryName } }"}'
```

### Testar CORS
```bash
curl -I https://seu-backend.exemplo.com/api/tina/graphql \
  -H "Origin: https://cajuinasaogeraldo.com.br"
```

## Troubleshooting

### CORS Error
- Verificar `ALLOWED_ORIGINS` no backend
- Verificar se frontend usa HTTPS em produção

### GraphQL não responde
- Verificar se backend está rodando
- Verificar logs do servidor
- Testar endpoint direto

### Autenticação falha
- Verificar `NEXTAUTH_SECRET`
- Verificar configuração do Microsoft Entra ID
- Verificar cookies (precisa mesmo domínio ou CORS correto)
