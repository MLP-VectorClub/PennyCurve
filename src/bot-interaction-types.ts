import { NamedChatInputCommand, NamedComponent } from '@went.tf/discord-bot-framework/interactions';
import { ButtonBuilder } from 'discord.js';
import { BotButtonId } from './constants/bot-button-id.js';
import { InteractionHandlerContext } from './types/interaction-handler.context.js';

/** The command's wire definition (description, options, …) lives in `commands.json` */
export type BotCommand<Name extends string> = NamedChatInputCommand<InteractionHandlerContext, Name>;

export type BotButton<Id extends BotButtonId> = NamedComponent<InteractionHandlerContext, Id> & {
  factory: () => ButtonBuilder;
};
