import { fixedReplyCommandFactory } from '@went.tf/discord-bot-framework/commands';
import { BotCommand } from '../bot-interaction-types.js';
import { InteractionHandlerContext } from '../types/interaction-handler.context.js';

export const pingCommand: BotCommand<'ping'> = {
  name: 'ping',
  ...fixedReplyCommandFactory<InteractionHandlerContext>('Pong!', true),
};
