FROM node:22-alpine AS base

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

FROM base AS development
COPY . .
EXPOSE 8000
CMD ["pnpm", "run", "start:dev"]

# Build stage
FROM base AS build

COPY . .

RUN pnpm run build

FROM node:22-alpine AS production

RUN npm install -g pnpm

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod

COPY --from=build --chown=nestjs:nodejs /app/dist ./dist

RUN mkdir -p /app/logs && chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 8000

CMD ["node", "dist/main"]