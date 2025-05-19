import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { ChannelType, GuildChannel } from 'discord.js';
import { BotCommand } from '../bot-interaction-types.js';
import { EmojiCharacters } from '../constants/emoji-characters.js';

enum OptionName {
  CHANNEL = 'channel',
  MESSAGE = 'message',
}

export const sayCommand: BotCommand = {
  definition: {
    description: 'Send a message to the specified channel as the bot.',
    default_permission: false,
    options: [
      {
        name: OptionName.CHANNEL,
        description: 'The channel in which to send the message',
        type: ApplicationCommandOptionType.Channel,
        required: true,
      },
      {
        name: OptionName.MESSAGE,
        description: 'The message to send',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  async handle(interaction) {
    const channel = interaction.options.getChannel(OptionName.CHANNEL, true);
    const rawMessage = interaction.options.getString(OptionName.MESSAGE, true);

    const actualMessage = rawMessage.trim();
    if (actualMessage.length === 0) {
      await interaction.reply({
        content: 'The provided message cannot be empty',
        ephemeral: true,
      });
      return;
    }

    if (!(channel instanceof GuildChannel)) {
      throw new Error('Expected `channel` to be an instance of GuildChannel');
    }

    if (channel.type !== ChannelType.GuildText) {
      await interaction.reply({
        content: 'The provided channel is not a text channel',
        ephemeral: true,
      });
      return;
    }

    await channel.send({ content: actualMessage });
    await interaction.reply({
      content: `${EmojiCharacters.WHITE_HEAVY_CHECK_MARK} Message sent to ${channel}`,
      ephemeral: true,
    });
  },
};
