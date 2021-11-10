import { BotCommand } from '../bot-interaction-types.js';
import { fixedReplyCommandFactory } from '../utils/fixed-reply-command-factory.js';

export const rektCommand: BotCommand = fixedReplyCommandFactory(
  'Replies with a YouTube link to the MLG Air Horn sound effect',
  '**REKT** https://www.youtube.com/watch?v=tfyqk26MqdE',
);
