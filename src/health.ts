import { createServer, Server } from 'http';
import type { BaseInteractionContext } from '@went.tf/discord-bot-framework/interactions';
import type { Client } from 'discord.js';

// Minimal liveness/readiness endpoint for container orchestration: 200 once the Discord gateway connection is ready.
export const startHealthServer = (client: Client, port: number, logger: BaseInteractionContext['logger']): Server => {
  const server = createServer((req, res) => {
    if (req.url === '/health' || req.url === '/status') {
      const ready = client.isReady();
      res.writeHead(ready ? 200 : 503, { 'content-type': 'text/plain' });
      res.end(ready ? 'ok\n' : 'not ready\n');
      return;
    }
    res.writeHead(404);
    res.end();
  });
  server.listen(port, () => logger.log(`Health endpoint listening on :${port}`));
  return server;
};
