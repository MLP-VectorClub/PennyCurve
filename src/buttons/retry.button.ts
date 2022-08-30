import { ButtonBuilder, ButtonStyle } from 'discord.js';
import { BotButton } from '../bot-interaction-types.js';
import { EmojiCharacters } from '../constants/emoji-characters.js';

export const retryButton: BotButton = {
  factory: () => new ButtonBuilder()
    .setLabel('Retry')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji(EmojiCharacters.COUNTERCLOCKWISE_ARROWS_BUTTON)
    .setDisabled(true),
  async handle(interaction) {
    const originalMessage = interaction.message;
    if (!originalMessage) {
      await interaction.reply({
        content: 'Original message could not be found',
        ephemeral: true,
      });
      return;
    }

    console.log(originalMessage);

    throw new Error('Not implemented');
  },
};
