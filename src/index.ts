import { Logger } from '@went.tf/discord-bot-framework/logger';
import axios from 'axios';
import { env } from './env.js';
import { validateStatus } from './utils/requests.js';
import { createClient } from './utils/create-client.js';
import { updateGuildCommands } from './utils/update-guild-commands.js';

// This file is the main entry point which starts the bot

axios.defaults.headers.common['user-agent'] = env.UA_STRING;
axios.defaults.validateStatus = validateStatus;

(async () => {
  const logger = new Logger('PennyCurve');
  await updateGuildCommands(logger);

  await createClient({ logger });
})().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
