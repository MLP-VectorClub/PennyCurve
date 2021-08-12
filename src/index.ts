import { createClient } from './create-client.js';
import { updateGuildCommands } from './utils/update-guild-commands.js';

// This file is the main entry point which starts the bot

(async () => {
  await updateGuildCommands();

  await createClient();
})();
