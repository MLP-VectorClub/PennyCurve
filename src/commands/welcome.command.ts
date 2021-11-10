import { GuildMember } from 'discord.js';
import { ApplicationCommandOptionType } from 'discord-api-types';
import { BotCommand } from '../bot-interaction-types.js';
import { ServerRoleName } from '../constants/server-role-name.js';
import { getServer } from '../utils/client-utils.js';
import { welcomeUser } from '../buttons/agree-to-rules.button.js';

enum OptionName {
  MEMBER = 'member',
}

export const welcomeCommand: BotCommand = {
  definition: {
    description: 'Welcomes the specified user as the bot',
    options: [
      {
        name: OptionName.MEMBER,
        description: 'The name of the user to welcome',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
  },
  permissions: [{
    target: ServerRoleName.STAFF,
  }],
  async handle(interaction) {
    const memberOptionValue = interaction.options.getMember(OptionName.MEMBER, true);
    if (!(memberOptionValue instanceof GuildMember)) {
      throw new Error('Expected `memberOptionValue` to be an instance of GuildMember');
    }

    const userToWelcome = memberOptionValue.user;
    const casualChannel = await welcomeUser(userToWelcome, getServer(interaction.client));

    await interaction.reply({
      content: `Welcome message for ${userToWelcome} has been re-sent to ${casualChannel}`,
      ephemeral: true,
    });
  },
};
