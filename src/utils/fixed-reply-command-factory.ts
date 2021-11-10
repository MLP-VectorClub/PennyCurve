import { BotCommand } from '../bot-interaction-types.js';

export const fixedReplyCommandFactory = (description: string, content: string, ephemeral = false): BotCommand => ({
  definition: {
    description,
  },
  async handle(interaction) {
    await interaction.reply({
      content,
      ephemeral,
    });
  },
});
