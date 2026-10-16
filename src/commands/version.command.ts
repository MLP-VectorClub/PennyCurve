import { BotCommand } from '../bot-interaction-types.js';
import { getGitData } from '../utils/get-git-data.js';
import { MessageTimestamp, MessageTimestampFormat } from '../utils/time.js';

export const versionCommand: BotCommand = {
  definition: {
    description: 'Returns the currently running bot version with a link to the code changes',
  },
  async handle(interaction) {
    const data = await getGitData().catch((e) => {
      console.error('Could not determine bot version', e);
      return null;
    });
    if (!data) {
      await interaction.reply('Bot is running an unknown version');
      return;
    }
    const { hash, timeAgo } = data;
    await interaction.reply(`Bot is running version \`${hash}\` created ${MessageTimestamp.fromTimestamp(timeAgo, MessageTimestampFormat.RELATIVE)}\nView commit on GitHub: <https://github.com/MLP-VectorClub/PennyCurve/commit/${hash}>`);
  },
};
