import {
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import {
  AutocompleteInteraction,
  ButtonBuilder,
  ButtonInteraction,
  ChatInputCommandInteraction,
  Interaction,
} from 'discord.js';
import { BotButtonId } from './constants/bot-button-id.js';
import { ServerRoleName } from './constants/server-role-name.js';

export enum BotCommandName {
  AGE = 'age',
  CASUAL = 'casual',
  COLOR_GUIDE = 'cg',
  DERPIBOORU = 'db',
  FIX_NICK = 'fixnick',
  JOINED = 'joined',
  NICE = 'nice',
  PING = 'ping',
  REKT = 'rekt',
  ROLE = 'role',
  SAY = 'say',
  TUTORIAL = 'tut',
  UPDATE_RULES = 'update-rules',
  VERSION = 'version',
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

export type BotCommandDefinition = Omit<RESTPostAPIChatInputApplicationCommandsJSONBody, 'name' | 'type'>;

export type InteractionHandler<T extends Interaction> = (interaction: T) => void | Promise<void>;

export interface BotCommand {
  definition: BotCommandDefinition;
  handle: InteractionHandler<ChatInputCommandInteraction & { commandName: BotCommandName }>;
  autocomplete?: InteractionHandler<AutocompleteInteraction & { commandName: BotCommandName }>;
}

export interface BotButton {
  factory: () => ButtonBuilder;
  handle: InteractionHandler<ButtonInteraction & { customId: BotButtonId }>;
}
