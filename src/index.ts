import axios from 'axios';
import { createClient } from './create-client.js';
import { updateGuildCommands } from './utils/update-guild-commands.js';
import { env } from './env.js';
import { validateStatus } from './utils/requests.js';

// This file is the main entry point which starts the bot

axios.defaults.headers.common['user-agent'] = env.UA_STRING;
axios.defaults.validateStatus = validateStatus;

(async () => {
  await updateGuildCommands();

  await createClient();
})();
