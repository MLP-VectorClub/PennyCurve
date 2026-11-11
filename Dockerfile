# syntax=docker/dockerfile:1
FROM node:24-bookworm AS build
ENV CI=true
WORKDIR /app
# zlib-sync/bufferutil/utf-8-validate compile here, natively per architecture (build tools are in this image)
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY tsconfig.json ./
COPY src ./src
RUN pnpm run build && pnpm prune --prod

FROM node:24-bookworm-slim
ARG GIT_COMMIT_HASH=unknown
ARG GIT_COMMIT_DATE=1970-01-01T00:00:00Z
ENV NODE_ENV=production \
    NODE_OPTIONS=--use-openssl-ca \
    HEALTH_PORT=8080
WORKDIR /app
COPY --from=build --chown=node:node /app/package.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/build ./build
COPY --chown=node:node assets ./assets
# The framework's getGitData reads this file (full hash on line 1, ISO commit date on line 2) when there is no .git directory
RUN printf '%s\n%s\n' "$GIT_COMMIT_HASH" "$GIT_COMMIT_DATE" > .git-deploy-commit
USER node
EXPOSE 8080
CMD ["node", "build/index.js"]
