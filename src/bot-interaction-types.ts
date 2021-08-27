import type { RESTPostAPIApplicationGuildCommandsJSONBody } from 'discord-api-types/rest/v9';
import type { CommandInteraction, MessageButton } from 'discord.js';
import { ButtonInteraction, Interaction } from 'discord.js';
import { ServerRoleName } from './constants/server-role-name.js';
import { BotButtonId } from './constants/bot-button-id.js';

export enum BotCommandName {
  AGE = 'age',
  CASUAL = 'casual',
  COLOR_GUIDE = 'cg',
  DERPIBOORU = 'db',
  NICE = 'nice',
  PING = 'ping',
  REKT = 'rekt',
  ROLE = 'role',
  SAY = 'say',
  UPDATE_RULES = 'update-rules',
  WELCOME = 'welcome',
  YES = 'yes',
}

export interface BotCommandPermission {
  /**
   * `true` signifies the bot owner
   */
  target: ServerRoleName | true;
  revoke?: true;
}

export type BotCommandDefinition = Omit<RESTPostAPIApplicationGuildCommandsJSONBody, 'name'>;

export type InteractionHandler<T extends Interaction> = (interaction: T) => void | Promise<void>;

export interface BotCommand {
  definition: BotCommandDefinition;
  handle: InteractionHandler<CommandInteraction & { commandName: BotCommandName }>;
  permissions?: BotCommandPermission[];
}

export interface BotButton {
  factory: () => MessageButton;
  handle: InteractionHandler<ButtonInteraction & { customId: BotButtonId }>;
}
