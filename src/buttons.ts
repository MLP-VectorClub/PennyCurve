import { createComponentRegistry } from '@went.tf/discord-bot-framework/interactions';
import { ButtonBuilder } from 'discord.js';
import { agreeToRulesButton } from './buttons/agree-to-rules.button.js';
import { createNickFormatButton } from './buttons/nick-format-button.js';
import { removeButton } from './buttons/remove-button.js';
import { retryButton } from './buttons/retry.button.js';
import { BotButtonId } from './constants/bot-button-id.js';

export const componentRegistry = createComponentRegistry([
  agreeToRulesButton,
  removeButton,
  createNickFormatButton(BotButtonId.NICK_FORMAT_BRACKETS),
  createNickFormatButton(BotButtonId.NICK_FORMAT_PIPE),
  createNickFormatButton(BotButtonId.NICK_FORMAT_RESET),
  retryButton,
]);

export const makeButton = (customId: BotButtonId): ButtonBuilder => (
  componentRegistry.byName[customId].factory().setCustomId(customId)
);
