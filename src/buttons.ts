import type { MessageButton } from 'discord.js';
import { BotButton } from './bot-interaction-types.js';
import { ServerButtonId } from './constants/server-button-id.js';
import { agreeToRulesButton } from './buttons/agree-to-rules-button.js';

export const buttonMap: Record<ServerButtonId, BotButton> = {
  [ServerButtonId.AGREE_TO_RULES]: agreeToRulesButton,
};

export const buttonIds = (Object.keys(buttonMap) as ServerButtonId[]);

export const isKnownButton = (customId: string): customId is ServerButtonId => customId in buttonMap;

export const makeButton = (customId: ServerButtonId): MessageButton => (
  buttonMap[customId].factory()
    .setCustomId(customId)
);
