import { getMinutes } from 'date-fns';
import { ChannelType } from 'discord.js';
import { BotCommand } from '../bot-interaction-types.js';
import { ServerChannelName } from '../constants/server-channel-name.js';
import { env } from '../env.js';
import { findServerTextChannelByName, getServer } from '../utils/client-utils.js';
import { EmojiCharacters } from '../constants/emoji-characters.js';

const possibleImages = [
  'mountain', // Original by DJDavid98
  'coco', // Coco & Rarity by Pirill
  'abcm', // Applebloom's new CM by Drakizora
  'abfall', // Applebloom falling by Drakizora
  'abfloat', // CMs floating around Applebloom by Drakizora
] as const;

const imageSizes: Record<typeof possibleImages[number], [number, number]> = {
  abcm: [1600, 897],
  abfall: [1248, 1197],
  abfloat: [981, 445],
  coco: [799, 447],
  mountain: [1920, 1080],
};

export const casualCommand: BotCommand = {
  definition: {
    description: `Politely asks everyone in the room to move to the #${ServerChannelName.CASUAL} channel (does nothing in said channel)`,
  },
  async handle(interaction) {
    const { channel } = interaction;
    if (!channel || channel.type !== ChannelType.GuildText || !('name' in channel) || channel.name === ServerChannelName.CASUAL) {
      await interaction.reply({
        content: 'This command cannot be used in this channel.',
        ephemeral: true,
      });
    }

    const server = getServer(interaction.client);
    const casualChannel = findServerTextChannelByName(server, ServerChannelName.CASUAL);

    const randomImageName = possibleImages[getMinutes(new Date()) % possibleImages.length];
    const url = `${env.FRONTEND_BASE_URL}img/discord/casual/${randomImageName}.png`;
    const [width, height] = imageSizes[randomImageName];

    await interaction.reply({
      embeds: [{
        description: `**${EmojiCharacters.KEY_CAP_NUMBER_SIGN} Please continue this discussion in ${casualChannel}**\n\n${EmojiCharacters.INFORMATION_SOURCE} **Rule #3:** Kindly try to keep topics in their respective channels.`,
        image: {
          url,
          width,
          height,
        },
      }],
    });
  },
};
