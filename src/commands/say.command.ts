import { ChannelType, GuildChannel, MessageFlags } from 'discord.js';
import { BotCommand } from '../bot-interaction-types.js';
import { EmojiCharacters } from '../constants/emoji-characters.js';

enum OptionName {
  CHANNEL = 'channel',
  MESSAGE = 'message',
}

export const sayCommand: BotCommand<'say'> = {
  name: 'say',
  async handle(interaction) {
    const channel = interaction.options.getChannel(OptionName.CHANNEL, true);
    const rawMessage = interaction.options.getString(OptionName.MESSAGE, true);

    const actualMessage = rawMessage.trim();
    if (actualMessage.length === 0) {
      await interaction.reply({
        content: 'The provided message cannot be empty',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (!(channel instanceof GuildChannel)) {
      throw new Error('Expected `channel` to be an instance of GuildChannel');
    }

    if (channel.type !== ChannelType.GuildText) {
      await interaction.reply({
        content: 'The provided channel is not a text channel',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await channel.send({ content: actualMessage });
    await interaction.reply({
      content: `${EmojiCharacters.WHITE_HEAVY_CHECK_MARK} Message sent to ${channel}`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
