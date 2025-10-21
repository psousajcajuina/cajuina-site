# 🎯 Próximos Passos - Cajuína Site

## ✅ Migração Concluída

A transformação de monorepo para single repository foi concluída com sucesso!

## 🧪 Testando a Nova Estrutura

### 1. Teste de Desenvolvimento
```bash
cd /home/psousaj/projects/cajuina-site
pnpm dev
```

**O que deve acontecer:**
- TinaCMS deve iniciar e compilar
- Astro dev server deve iniciar
- Admin acessível em: `http://localhost:4321/admin`
- Site acessível em: `http://localhost:4321`

### 2. Teste de Build
```bash
pnpm build
```

**O que deve acontecer:**
- TinaCMS build executa primeiro
- Astro build executa depois
- Arquivos gerados em `/dist`

### 3. Teste de Preview
```bash
pnpm preview
```

**O que deve acontecer:**
- Server de preview inicia
- Site estático disponível para teste

## 🔍 Checklist de Verificação

- [ ] `pnpm install` executado com sucesso
- [ ] `pnpm dev` inicia sem erros
- [ ] Admin TinaCMS carrega corretamente
- [ ] Páginas do site carregam
- [ ] `pnpm build` completa sem erros
- [ ] Type checking funciona: `pnpm type-check`

## 🐛 Possíveis Problemas e Soluções

### Problema: Erros de módulo não encontrado
**Solução:**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Problema: TinaCMS não inicia
**Solução:**
1. Verificar variáveis `.env`
2. Verificar se `TINA_PUBLIC_IS_LOCAL=true`
3. Rodar: `pnpm tinacms build`

### Problema: TypeScript errors
**Solução:**
1. Verificar `tsconfig.json`
2. Executar: `pnpm type-check`
3. Restart VS Code

## 📋 Comandos Úteis

```bash
# Desenvolvimento
pnpm dev                     # Inicia dev server

# Build
pnpm build                   # Build de produção
pnpm preview                 # Preview do build

# Qualidade
pnpm type-check              # Verifica tipos

# Astro CLI
pnpm astro --help            # Lista comandos Astro
pnpm astro add [integration] # Adiciona integração
pnpm astro check             # Verifica projeto

# TinaCMS
pnpm tinacms dev             # Dev mode do Tina
pnpm tinacms build           # Build do Tina
pnpm tinacms audit           # Audit do schema
```

## 🔧 Configurações Importantes

### .env (Local Development)
```env
TINA_PUBLIC_IS_LOCAL=true
GITHUB_BRANCH=cms/push
GITHUB_REPO=cajuina-site
GITHUB_OWNER=psousajcajuina
SITE_URL=http://localhost:4321
```

### .env (Production)
```env
TINA_PUBLIC_IS_LOCAL=false
GITHUB_PERSONAL_ACCESS_TOKEN=seu_token
NEXTAUTH_SECRET=seu_secret
MONGODB_URI=sua_connection_string
```

## 📁 Estrutura de Pastas Importante

```
cajuina-site/
├── src/
│   ├── content/          # ← Conteúdo gerenciado pelo Tina
│   ├── pages/            # ← Rotas do Astro
│   └── components/       # ← Componentes
├── api/tina/             # ← Backend TinaCMS
├── tina/
│   ├── config.ts         # ← Configuração principal
│   └── collections/      # ← Schemas das coleções
└── public/               # ← Assets estáticos
```

## 🎨 Personalizações

### Adicionar Nova Coleção
1. Criar arquivo em `tina/collections/`
2. Importar em `tina/config.ts`
3. Executar `pnpm dev` para atualizar schema

### Adicionar Nova Página
1. Criar arquivo em `src/pages/`
2. Usar componentes de `src/components/`
3. Página disponível automaticamente

### Modificar Estilos
1. Estilos globais: `src/styles/global.css`
2. Tailwind config: `tailwindcss` no `package.json`
3. Componentes: inline ou CSS modules

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
pnpm i -g vercel

# Deploy
vercel
```

**Configuração Vercel:**
- Build Command: `pnpm build`
- Output Directory: `dist`
- Install Command: `pnpm install`

### Netlify
**Configuração:**
- Build command: `pnpm build`
- Publish directory: `dist`
- Functions directory: (vazio)

## 📞 Suporte

Se encontrar problemas:
1. Verificar logs no terminal
2. Consultar `MIGRATION.md` para detalhes técnicos
3. Verificar documentação oficial:
   - [Astro Docs](https://docs.astro.build)
   - [TinaCMS Docs](https://tina.io/docs)

---

**Boa sorte com o projeto! 🎉**
