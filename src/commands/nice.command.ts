import { fixedReplyCommandFactory } from '@went.tf/discord-bot-framework/commands';
import { BotCommand } from '../bot-interaction-types.js';
import { InteractionHandlerContext } from '../types/interaction-handler.context.js';

export const niceCommand: BotCommand<'nice'> = {
  name: 'nice',
  ...fixedReplyCommandFactory<InteractionHandlerContext>('https://youtube.com/watch?v=ffQmb-cNFuk'),
};
