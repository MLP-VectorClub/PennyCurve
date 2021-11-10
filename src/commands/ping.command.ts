import { BotCommand } from '../bot-interaction-types.js';
import { fixedReplyCommandFactory } from '../utils/fixed-reply-command-factory.js';

export const pingCommand: BotCommand = fixedReplyCommandFactory('Replies with Pong!', 'Pong!', true);
