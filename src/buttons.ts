import { ButtonBuilder, ButtonInteraction } from 'discord.js';
import { BotButton } from './bot-interaction-types.js';
import { agreeToRulesButton } from './buttons/agree-to-rules.button.js';
import { nickFormatButton } from './buttons/nick-format-button.js';
import { removeButton } from './buttons/remove-button.js';
import { retryButton } from './buttons/retry.button.js';
import { BotButtonId } from './constants/bot-button-id.js';

export const buttonMap: Record<BotButtonId, BotButton> = {
  [BotButtonId.AGREE_TO_RULES]: agreeToRulesButton,
  [BotButtonId.DELETE]: removeButton,
  [BotButtonId.NICK_FORMAT_BRACKETS]: nickFormatButton,
  [BotButtonId.NICK_FORMAT_PIPE]: nickFormatButton,
  [BotButtonId.NICK_FORMAT_RESET]: nickFormatButton,
  [BotButtonId.RETRY]: retryButton,
};

export const buttonIds = (Object.keys(buttonMap) as BotButtonId[]);

export const isKnownButton = (customId: string): customId is BotButtonId => customId in buttonMap;

export const isKnownButtonInteraction = (interaction: ButtonInteraction): interaction is ButtonInteraction & { customId: BotButtonId } => isKnownButton(interaction.customId);

export const makeButton = (customId: BotButtonId): ButtonBuilder => (
  buttonMap[customId].factory().setCustomId(customId)
);
