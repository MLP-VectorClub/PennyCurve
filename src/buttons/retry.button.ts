import { ButtonBuilder, ButtonStyle, MessageFlags } from 'discord.js';
import { BotButton } from '../bot-interaction-types.js';
import { BotButtonId } from '../constants/bot-button-id.js';
import { EmojiCharacters } from '../constants/emoji-characters.js';

export const retryButton: BotButton<BotButtonId.RETRY> = {
  id: BotButtonId.RETRY,
  factory: () => new ButtonBuilder()
    .setLabel('Retry')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji(EmojiCharacters.COUNTERCLOCKWISE_ARROWS_BUTTON)
    .setDisabled(true),
  async handle(interaction, { logger }) {
    const originalMessage = interaction.message;
    if (!originalMessage) {
      await interaction.reply({
        content: 'Original message could not be found',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    logger.log('Retry requested for message', originalMessage.id);

    throw new Error('Not implemented');
  },
};
