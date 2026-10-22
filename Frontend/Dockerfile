# syntax=docker/dockerfile:1
# Next.js standalone image. Requires `output: 'standalone'` in next.config.ts.
# Build from this folder: docker build -t kolavo-web Frontend

ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps
# pnpm-workspace.yaml carries the build-script allow list (pnpm 12 blocks unlisted scripts).
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# HUSKY=0: git hooks are a developer convenience; the image has no git repository.
ENV HUSKY=0
RUN npm install -g pnpm@$(node -p "require('./package.json').packageManager.split('@')[1]") \
  && pnpm install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Runtime config (API_BASE_URL, APP_URL) is not available, and must not be baked in, during the build.
ENV SKIP_ENV_VALIDATION=1 NEXT_TELEMETRY_DISABLED=1
RUN npx next build

FROM base AS runner
# API_MOCKING stays false in every deployed environment.
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0 API_MOCKING=false
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs
COPY --from=build --chown=nextjs:nodejs /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
