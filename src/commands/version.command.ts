import { BotCommand } from '../bot-interaction-types.js';
import { getGitData } from '@went.tf/discord-bot-framework/utils';
import { MessageTimestamp, MessageTimestampFormat } from '../utils/time.js';

export const versionCommand: BotCommand<'version'> = {
  name: 'version',
  async handle(interaction, context) {
    const data = await getGitData(context).catch((e) => {
      context.logger.error('Could not determine bot version', e);
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
