
# --- Builder stage ---------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
# Run the frontend build (Astro)
RUN pnpm run build

ARG SITE_URL
ENV SITE_URL=${SITE_URL}

# --- Final stage (serve static files) -------------------------------------
FROM nginx:alpine AS runner

# Create /app and copy built files
RUN mkdir -p /app
COPY --from=builder /app/dist /app

# Nginx serves from /usr/share/nginx/html by default; copy files there
RUN rm -rf /usr/share/nginx/html/* && cp -r /app/* /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

