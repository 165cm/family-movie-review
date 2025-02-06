# Dockerfile
# Use Node.js LTS version
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# ビルド時の環境変数を定義
ARG NOTION_API_KEY
ARG NOTION_DATABASE_ID
ARG NEXT_PUBLIC_BASE_URL

# 環境変数を設定
ENV NOTION_API_KEY=$NOTION_API_KEY
ENV NOTION_DATABASE_ID=$NOTION_DATABASE_ID
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Build application
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

# 本番環境用の環境変数を引き継ぐ
ARG NOTION_API_KEY
ARG NOTION_DATABASE_ID
ARG NEXT_PUBLIC_BASE_URL

ENV NOTION_API_KEY=$NOTION_API_KEY
ENV NOTION_DATABASE_ID=$NOTION_DATABASE_ID
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NODE_ENV=production
ENV PORT=8080

# Copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]