FROM node:20-alpine AS builder

WORKDIR /app

# Copia package.json e lockfile para instalar dependências
COPY package.json pnpm-lock.yaml ./

# Instala pnpm e todas as dependências (incluindo dev para build)
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copia o código fonte
COPY . .

# Compila o TypeScript
RUN pnpm build

# Estágio de produção
FROM node:20-alpine

WORKDIR /app

# Copia package.json e lockfile
COPY package.json pnpm-lock.yaml ./

# Instala apenas dependências de produção
RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod

# Copia os arquivos compilados do estágio anterior
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "./dist/server.js"]