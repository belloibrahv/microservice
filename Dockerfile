# Stage 1: Base image
FROM node:22-alpine AS base

# Install pnpm
RUN npm install -g pnpm@11.17.0

# Stage 2: Install dependencies
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy dependency definition files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 3: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set env variables for production build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Run Next.js build
RUN pnpm build

# Stage 4: Production runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy built standalone bundle, static assets, and public assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Set dynamic port (Render injects PORT, default to 3000 if not set)
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
