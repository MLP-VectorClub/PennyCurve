import { BotCommand } from '../bot-interaction-types.js';
import { getServer } from '../utils/client-utils.js';
import { MessageTimestamp, MessageTimestampFormat } from '../utils/time.js';

export const ageCommand: BotCommand = {
  definition: {
    description: 'Tells you the age of the server',
  },
  async handle(interaction) {
    const server = getServer(interaction.client);
    const ts = new MessageTimestamp(server.createdAt);
    await interaction.reply(`The ${server.name} Discord server was created on ${ts.toString(MessageTimestampFormat.LONG_DATE)} at ${ts.toString(MessageTimestampFormat.LONG_TIME)} (${ts.toString(MessageTimestampFormat.RELATIVE)})`);
  },
};
