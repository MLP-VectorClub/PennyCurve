import { fixedReplyCommandFactory } from '@went.tf/discord-bot-framework/commands';
import { BotCommand } from '../bot-interaction-types.js';
import { InteractionHandlerContext } from '../types/interaction-handler.context.js';

export const rektCommand: BotCommand<'rekt'> = {
  name: 'rekt',
  ...fixedReplyCommandFactory<InteractionHandlerContext>('**REKT** https://www.youtube.com/watch?v=tfyqk26MqdE'),
};
