import { BotCommand } from '../bot-interaction-types.js';
import { fixedReplyCommandFactory } from '../utils/fixed-reply-command-factory.js';

export const yesCommand: BotCommand = fixedReplyCommandFactory(
  'Replies with a YouTube link to Mr. Bison saying "Yes" repeatedly',
  'https://www.youtube.com/watch?v=P3ALwKeSEYs',
);
