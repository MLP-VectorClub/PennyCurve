import { buildApplicationCommandsBody, createCommandRegistrar } from '@went.tf/discord-bot-framework/commands';
import { CommandsFile, parseCommandsFile, registerFrameworkSchemas, resolveCommandsSchemaRefs } from '@went.tf/discord-bot-framework/commands/schema';
import { NestableLogger } from '@went.tf/discord-bot-framework/logger';
import { REST } from '@discordjs/rest';
import { Ajv } from 'ajv';
import commandsData from '../commands.json' with { type: 'json' };
import commandsSchemaRaw from '../commands.schema.json' with { type: 'json' };
import { chatInputCommandRegistry } from '../commands.js';
import { env } from '../env.js';

const rest = new REST({
  userAgentAppendix: env.UA_STRING,
}).setToken(env.DISCORD_BOT_TOKEN);

// Rewrites the relative-path $refs in commands.schema.json (which point into node_modules so editors can
// resolve them) to each fragment's real ajv-resolvable identity
const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
registerFrameworkSchemas(ajv);
const validateCommandsFile = ajv.compile(resolveCommandsSchemaRefs(commandsSchemaRaw));

export const updateGuildCommands = async (logger: NestableLogger, serverId = env.SERVER_ID): Promise<void> => {
  const registrar = createCommandRegistrar({ rest, applicationId: env.DISCORD_CLIENT_ID, logger });
  const commandsFile = parseCommandsFile<CommandsFile>(commandsData, { validate: validateCommandsFile });
  const body = buildApplicationCommandsBody(commandsFile, { chatInput: chatInputCommandRegistry });

  logger.log(`Refreshing application (/) commands (SERVER_ID=${serverId})`);
  await registrar.updateGuildCommands(serverId, body);
  logger.log(`Successfully reloaded application (/) commands (SERVER_ID=${serverId})`);
};
