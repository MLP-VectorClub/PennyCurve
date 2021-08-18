import { BotCommand } from '../bot-interaction-types.js';

export const pingCommand: BotCommand = {
  definition: {
    description: 'Replies with Pong!',
  },
  async handle(interaction) {
    await interaction.reply({
      content: 'Pong!',
      ephemeral: true,
    });
  },
};
