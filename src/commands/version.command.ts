import { BotCommand } from '../bot-interaction-types.js';
import { getGitData } from '../utils/get-git-data.js';
import { MessageTimestamp, MessageTimestampFormat } from '../utils/time.js';

export const versionCommand: BotCommand = {
  definition: {
    description: 'Returns the currently running bot version with a link to the code changes',
  },
  async handle(interaction) {
    const { hash, timeAgo } = await getGitData();
    await interaction.reply(`Bot is running version \`${hash}\` created ${MessageTimestamp.fromTimestamp(timeAgo, MessageTimestampFormat.RELATIVE)}\nView commit on GitHub: <https://github.com/MLP-VectorClub/PennyCurve/commit/${hash}>`);
  },
};
