import { ButtonBuilder, ButtonStyle } from 'discord.js';
import { BotButton } from '../bot-interaction-types.js';
import { EmojiCharacters } from '../constants/emoji-characters.js';

export const removeButton: BotButton = {
  factory: () => new ButtonBuilder()
    .setLabel('Remove')
    .setStyle(ButtonStyle.Danger)
    .setEmoji(EmojiCharacters.WASTEBASKET),
  async handle(interaction) {
    const originalMessage = interaction.message;
    if (!originalMessage) {
      await interaction.reply({
        content: 'Original message could not be found',
        ephemeral: true,
      });
      return;
    }

    if (!('deletable' in originalMessage) || !originalMessage.deletable) {
      await interaction.reply({
        content: 'Original message cannot be deleted',
        ephemeral: true,
      });
      return;
    }

    await originalMessage.delete();
  },
};
