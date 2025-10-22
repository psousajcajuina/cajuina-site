FROM node:20-alpine

WORKDIR /app

# Copia package.json e lockfile para instalar dependências
COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod

COPY . .

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "./standalone.js"]
