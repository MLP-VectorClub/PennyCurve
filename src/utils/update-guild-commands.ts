import { REST } from '@discordjs/rest';
import { RESTPutAPIApplicationGuildCommandsResult, Routes } from 'discord-api-types/v10';
import { commands } from '../commands.js';
import { env } from '../env.js';

const rest = new REST({
  version: '9',
  userAgentAppendix: env.UA_STRING,
}).setToken(env.DISCORD_BOT_TOKEN);

export const updateGuildCommands = async (clientId = env.DISCORD_CLIENT_ID, serverId = env.SERVER_ID): Promise<void> => {
  try {
    console.log(`Started refreshing application (/) commands (SERVER_ID=${serverId})`);

    const putCommands = await rest.put(
      Routes.applicationGuildCommands(clientId, serverId),
      { body: commands },
    ) as RESTPutAPIApplicationGuildCommandsResult;

    await Promise.all(putCommands);

    console.log(`Successfully reloaded application (/) commands (SERVER_ID=${serverId})`);
  } catch (error) {
    console.log(`Failed to reloaded application (/) commands (SERVER_ID=${serverId})`);
    console.error(error);
    process.exit(1);
  }
};
