import { BotCommand } from '../bot-interaction-types.js';
import { fixedReplyCommandFactory } from '../utils/fixed-reply-command-factory.js';

export const niceCommand: BotCommand = fixedReplyCommandFactory(
  'Replies with a YouTube link to JoJo saying "Nice!"',
  'https://youtube.com/watch?v=ffQmb-cNFuk',
);
