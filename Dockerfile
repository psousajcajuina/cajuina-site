
# --- Builder stage ---------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
# Run the frontend build (Astro)
RUN pnpm run build

ARG SITE_URL
ARG PUBLIC_GOOGLE_MAPS_KEY_PROD
ARG GOOGLE_SITE_VERIFICATION
ARG GOOGLE_ANALYTICS_ID
#
ENV PUBLIC_GOOGLE_MAPS_KEY_PROD=${PUBLIC_GOOGLE_MAPS_KEY_PROD}
ENV SITE_URL=${SITE_URL}
ENV GOOGLE_SITE_VERIFICATION=${GOOGLE_SITE_VERIFICATION}
ENV GOOGLE_ANALYTICS_ID=${GOOGLE_ANALYTICS_ID}
ENV NODE_ENV=production

# --- Final stage (serve static files) -------------------------------------
FROM nginx:alpine AS runner

# Create /app and copy built files
RUN mkdir -p /app
COPY --from=builder /app/dist /app

# Nginx serves from /usr/share/nginx/html by default; copy files there
RUN rm -rf /usr/share/nginx/html/* && cp -r /app/* /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

