# Multi-stage production build for HimoyaAI
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source files
COPY . .

# Build production bundle
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copy package manifests and production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy backend server, libraries, data and static dist from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/data ./data

# Security: Non-root user execution
USER node

EXPOSE 3001

CMD ["node", "server/index.js"]
