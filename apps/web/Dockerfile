# apps/web/Dockerfile
FROM node:24-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json apps/web/package.json
RUN pnpm install --frozen-lockfile --filter @nestrr/web...

FROM deps AS build
COPY . .
RUN pnpm --filter @nestrr/web build

FROM node:24-alpine AS runtime
WORKDIR /app
RUN corepack enable
ENV NODE_ENV=production
ENV PORT=5173
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json apps/web/package.json
RUN pnpm install --prod --frozen-lockfile --filter @nestrr/web...
COPY --from=build /app/apps/web/build apps/web/build
EXPOSE 5173
CMD ["pnpm", "--filter", "@nestrr/web", "start"]