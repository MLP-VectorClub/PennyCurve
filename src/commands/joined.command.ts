import { BotCommand } from '../bot-interaction-types.js';
import { findServerMember } from '../utils/client-utils.js';
import { MessageTimestamp, MessageTimestampFormat } from '../utils/time.js';

export const joinedCommand: BotCommand = {
  definition: {
    description: 'Tells you when you joined the server',
  },
  async handle(interaction) {
    const member = findServerMember(interaction);

    if (!member.joinedAt) {
      throw new Error('Expected joined date on member, but got falsy value');
    }

    const ts = new MessageTimestamp(member.joinedAt);
    await interaction.reply(`You joined this server on ${ts.toString(MessageTimestampFormat.LONG_DATE)} at ${ts.toString(MessageTimestampFormat.LONG_TIME)} (${ts.toString(MessageTimestampFormat.RELATIVE)})`);
  },
};
