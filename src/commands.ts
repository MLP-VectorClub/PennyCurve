import { RESTPostAPIApplicationGuildCommandsJSONBody as ApplicationGuildCommand } from 'discord-api-types/rest/v9/interactions.js';
import { pingCommand } from './commands/ping.command.js';
import { BotCommand, BotCommandName } from './bot-interaction-types.js';
import { updateRulesCommand } from './commands/update-rules.command.js';

export const commandMap: Record<BotCommandName, BotCommand> = {
  [BotCommandName.PING]: pingCommand,
  [BotCommandName.UPDATE_RULES]: updateRulesCommand,
};

export const commandNames = (Object.keys(commandMap) as BotCommandName[]);

export const commands: ApplicationGuildCommand[] = commandNames.map((commandName) => ({
  ...commandMap[commandName].definition,
  name: commandName,
}));

export const isKnownCommand = (commandName: string): commandName is BotCommandName => commandName in commandMap;
