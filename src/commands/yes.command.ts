import { fixedReplyCommandFactory } from '@went.tf/discord-bot-framework/commands';
import { BotCommand } from '../bot-interaction-types.js';
import { InteractionHandlerContext } from '../types/interaction-handler.context.js';

export const yesCommand: BotCommand<'yes'> = {
  name: 'yes',
  ...fixedReplyCommandFactory<InteractionHandlerContext>('https://www.youtube.com/watch?v=P3ALwKeSEYs'),
};
