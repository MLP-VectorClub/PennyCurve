import { ButtonBuilder, ButtonStyle } from 'discord.js';
import { BotButton } from '../bot-interaction-types.js';
import { BotButtonId } from '../constants/bot-button-id.js';
import { findServerMember } from '../utils/client-utils.js';
import { getNicknameInFormat, getNicknameParts, NicknameFormat } from '../utils/nicknames.js';

export const nickFormatButton: BotButton = {
  factory: () => new ButtonBuilder().setStyle(ButtonStyle.Secondary),
  async handle(interaction) {
    const serverMember = findServerMember(interaction);

    if (!serverMember.nickname) {
      await interaction.reply({
        ephemeral: true,
        content: 'You do not have a nickname on our server.',
      });
      return;
    }

    const oldNick = serverMember.nickname;
    const parts = getNicknameParts(oldNick);
    let newNick;
    switch (interaction.customId) {
      case BotButtonId.NICK_FORMAT_RESET:
        newNick = getNicknameInFormat(parts, NicknameFormat.UNKNOWN);
        break;
      case BotButtonId.NICK_FORMAT_PIPE:
        newNick = getNicknameInFormat(parts, NicknameFormat.PIPE);
        break;
      case BotButtonId.NICK_FORMAT_BRACKETS:
        newNick = getNicknameInFormat(parts, NicknameFormat.BRACKETS);
        break;
      default:
        throw new Error(`Unhandled nick format button ${interaction.customId}`);
    }

    if (newNick === oldNick) {
      await interaction.reply({
        ephemeral: true,
        content: 'Your nick is already in the requested format',
      });
      return;
    }

    await serverMember.setNickname(newNick);

    await interaction.reply({
      ephemeral: true,
      content: 'Your nickname has been updated successfully',
    });
  },
};
