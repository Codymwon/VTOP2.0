# Multi-stage Dockerfile for VTOP 2.0 Full-Stack Application
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Install root dependencies and build frontend
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2. Install server dependencies and build backend
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./
RUN npx prisma generate
RUN npm run build

# 3. Production runner stage
FROM node:20-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copy built frontend assets
COPY --from=builder /app/dist ./dist

# Copy built backend assets
WORKDIR /app/server
COPY --from=builder /app/server/package*.json ./
COPY --from=builder /app/server/node_modules ./node_modules
COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/prisma ./prisma

# Generate Prisma client for runner environment
RUN npx prisma generate

EXPOSE 8080

# Push database schema, seed initial accounts, and boot server
CMD ["sh", "-c", "npx prisma db push && node prisma/seed.js && node dist/index.js"]
