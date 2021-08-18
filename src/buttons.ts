import type { MessageButton } from 'discord.js';
import { ButtonInteraction } from 'discord.js';
import { BotButton } from './bot-interaction-types.js';
import { BotButtonId } from './constants/bot-button-id.js';
import { agreeToRulesButton } from './buttons/agree-to-rules.button.js';
import { removeButton } from './buttons/remove-button.js';
import { retryButton } from './buttons/retry.button.js';

export const buttonMap: Record<BotButtonId, BotButton> = {
  [BotButtonId.AGREE_TO_RULES]: agreeToRulesButton,
  [BotButtonId.DELETE]: removeButton,
  [BotButtonId.RETRY]: retryButton,
};

export const buttonIds = (Object.keys(buttonMap) as BotButtonId[]);

export const isKnownButton = (customId: string): customId is BotButtonId => customId in buttonMap;

export const isKnownButtonInteraction = (interaction: ButtonInteraction): interaction is ButtonInteraction & { customId: BotButtonId } => isKnownButton(interaction.customId);

export const makeButton = (customId: BotButtonId): MessageButton => (
  buttonMap[customId].factory().setCustomId(customId)
);
