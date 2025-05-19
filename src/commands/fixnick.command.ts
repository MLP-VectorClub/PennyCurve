import { ActionRowBuilder, ButtonBuilder } from 'discord.js';
import { BotCommand } from '../bot-interaction-types.js';
import { makeButton } from '../buttons.js';
import { BotButtonId } from '../constants/bot-button-id.js';
import { findServerMember } from '../utils/client-utils.js';
import { getNicknameInFormat, getNicknameParts, NicknameFormat } from '../utils/nicknames.js';

export const fixNickCommand: BotCommand = {
  definition: {
    description: 'Change how your DeviantArt username is displayed alongside your Discord name',
    default_permission: false,
  },
  async handle(interaction) {
    const serverMember = findServerMember(interaction);

    if (!serverMember.nickname) {
      await interaction.reply({
        ephemeral: true,
        content: 'You do not have a nickname on our server.',
      });
      return;
    }

    const currentNick = serverMember.nickname;
    const parts = getNicknameParts(currentNick);

    if (parts.daName === null) {
      await interaction.reply({
        ephemeral: true,
        content: 'Your nickname does not match a recognized format, so this command cannot change it',
      });
      return;
    }

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      makeButton(BotButtonId.NICK_FORMAT_RESET)
        .setLabel(getNicknameInFormat(parts, NicknameFormat.UNKNOWN)),
      makeButton(BotButtonId.NICK_FORMAT_BRACKETS)
        .setLabel(getNicknameInFormat(parts, NicknameFormat.BRACKETS)),
      makeButton(BotButtonId.NICK_FORMAT_PIPE)
        .setLabel(getNicknameInFormat(parts, NicknameFormat.PIPE)),
    );

    await interaction.reply({
      ephemeral: true,
      content: 'Please choose your desired nickname format using the buttons below.',
      components: [row],
    });
  },
};
