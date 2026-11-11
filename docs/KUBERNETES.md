# Running in the Kubernetes cluster

- Image: `ghcr.io/mlp-vectorclub/pennycurve` (multi-arch amd64+arm64, tags `sha-<7 hex>` only), built by `.github/workflows/images.yml`.
- Single process, `node build/index.js`, runs as the non-root `node` user, logs to stdout/stderr. No volumes, no database, no Valkey.
- **Must never run twice**: a second instance would answer every Discord interaction twice. Use `replicas: 1` with `strategy: Recreate`.
- Port 8080 (`HEALTH_PORT`): `GET /health` returns 200 once the Discord gateway is ready, 503 before. No other HTTP is served.
- Env vars (values in a Secret, none in git): `DISCORD_BOT_TOKEN`, `DISCORD_CLIENT_ID`, `SERVER_ID`, `BOT_OWNER_ID`, `INVITE_LINK`, `WS_SERVER_KEY`,
  `BACKEND_BASE_URL`, `FRONTEND_BASE_URL`, `UA_STRING`. Optional: `HEALTH_PORT` (set in the image), `LOCAL`.
- Version info (`/version`, bot activity) comes from `/app/.git-deploy-commit`, written at build time from the commit.
- Slash commands are re-registered on every start (`updateGuildCommands`), no separate step.
- Outbound only: Discord, the Luna API (`BACKEND_BASE_URL`), Derpibooru/Philomena. No DeviantArt API calls (only static deviantart.com links in replies).
