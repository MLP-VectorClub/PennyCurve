import { RESTPostAPIApplicationGuildCommandsJSONBody as ApplicationGuildCommand } from 'discord-api-types/rest/v9/interactions.js';
import { CommandInteraction } from 'discord.js';
import { pingCommand } from './commands/ping.command.js';
import { BotCommand, BotCommandName } from './bot-interaction-types.js';
import { updateRulesCommand } from './commands/update-rules.command.js';
import { ageCommand } from './commands/age.command.js';
import { casualCommand } from './commands/casual.command.js';
import { colorGuideCommand } from './commands/color-guide.command.js';
import { derpibooruCommand } from './commands/derpibooru.command.js';
import { roleCommand } from './commands/role.command.js';

export const commandMap: Record<BotCommandName, BotCommand> = {
  [BotCommandName.PING]: pingCommand,
  [BotCommandName.UPDATE_RULES]: updateRulesCommand,
  [BotCommandName.AGE]: ageCommand,
  [BotCommandName.CASUAL]: casualCommand,
  [BotCommandName.COLOR_GUIDE]: colorGuideCommand,
  [BotCommandName.DERPIBOORU]: derpibooruCommand,
  [BotCommandName.ROLE]: roleCommand,
};

export const commandNames = (Object.keys(commandMap) as BotCommandName[]);

export const commands: ApplicationGuildCommand[] = commandNames.map((commandName) => ({
  ...commandMap[commandName].definition,
  name: commandName,
}));

export const isKnownCommand = (commandName: string): commandName is BotCommandName => commandName in commandMap;

export const isKnownCommandInteraction = (interaction: CommandInteraction): interaction is CommandInteraction & { commandName: BotCommandName } => isKnownCommand(interaction.commandName);
