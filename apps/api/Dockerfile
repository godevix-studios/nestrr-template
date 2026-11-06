# apps/api/Dockerfile
FROM node:24.22.2-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json apps/api/package.json
RUN pnpm install --frozen-lockfile --filter @nestrr/api...

FROM deps AS build
COPY . .
RUN pnpm --filter @nestrr/api build:no-tests

FROM node:24.22.2-alpine AS runtime
WORKDIR /app
RUN corepack enable
ENV NODE_ENV=production
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json apps/api/package.json
RUN pnpm install --prod --frozen-lockfile --filter @nestrr/api...
COPY --from=build /app/apps/api/dist apps/api/dist
EXPOSE 3000
CMD ["pnpm", "--filter", "@nestrr/api", "start:prod"]