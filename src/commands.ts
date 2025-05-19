import {
  RESTPostAPIApplicationGuildCommandsJSONBody as ApplicationGuildCommand,
} from 'discord-api-types/rest/v10';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { ChatInputCommandInteraction } from 'discord.js';
import { BotCommand, BotCommandName } from './bot-interaction-types.js';
import { ageCommand } from './commands/age.command.js';
import { casualCommand } from './commands/casual.command.js';
import { colorGuideCommand } from './commands/color-guide.command.js';
import { derpibooruCommand } from './commands/derpibooru.command.js';
import { fixNickCommand } from './commands/fixnick.command.js';
import { joinedCommand } from './commands/joined.command.js';
import { niceCommand } from './commands/nice.command.js';
import { pingCommand } from './commands/ping.command.js';
import { rektCommand } from './commands/rekt.command.js';
import { roleCommand } from './commands/role.command.js';
import { sayCommand } from './commands/say.command.js';
import { tutorialCommand } from './commands/tutorial.command.js';
import { updateRulesCommand } from './commands/update-rules.command.js';
import { versionCommand } from './commands/version.command.js';
import { welcomeCommand } from './commands/welcome.command.js';
import { yesCommand } from './commands/yes.command.js';

export const commandMap: Record<BotCommandName, BotCommand> = {
  [BotCommandName.AGE]: ageCommand,
  [BotCommandName.CASUAL]: casualCommand,
  [BotCommandName.COLOR_GUIDE]: colorGuideCommand,
  [BotCommandName.DERPIBOORU]: derpibooruCommand,
  [BotCommandName.FIX_NICK]: fixNickCommand,
  [BotCommandName.JOINED]: joinedCommand,
  [BotCommandName.NICE]: niceCommand,
  [BotCommandName.PING]: pingCommand,
  [BotCommandName.REKT]: rektCommand,
  [BotCommandName.ROLE]: roleCommand,
  [BotCommandName.SAY]: sayCommand,
  [BotCommandName.TUTORIAL]: tutorialCommand,
  [BotCommandName.UPDATE_RULES]: updateRulesCommand,
  [BotCommandName.VERSION]: versionCommand,
  [BotCommandName.WELCOME]: welcomeCommand,
  [BotCommandName.YES]: yesCommand,
};

export const commandNames = (Object.keys(commandMap) as BotCommandName[]);

export const commands: ApplicationGuildCommand[] = commandNames.map((commandName) => ({
  ...commandMap[commandName].definition,
  name: commandName,
  type: ApplicationCommandType.ChatInput,
}));

export const isKnownCommand = (commandName: string): commandName is BotCommandName => commandName in commandMap;

export const isKnownCommandInteraction = <InteractionType extends ChatInputCommandInteraction>(interaction: InteractionType): interaction is InteractionType & { commandName: BotCommandName } => isKnownCommand(interaction.commandName);
