import { GuildMember, MessageButton } from 'discord.js';
import { BotButton } from '../bot-interaction-types.js';
import { EmojiCharacters } from '../constants/emoji-characters.js';
import {
  findServerRoleByName,
  findServerTextChannelByName,
  getServer,
} from '../utils/client-utils.js';
import { ServerRoleName } from '../constants/server-role-name.js';
import { ServerChannelName } from '../constants/server-channel-name.js';

export const agreeToRulesButton: BotButton = {
  factory: () => new MessageButton()
    .setLabel('I have read and agree to the rules')
    .setStyle('SECONDARY')
    .setEmoji(EmojiCharacters.BALLOT_BOX_WITH_CHECK),
  async handle(interaction) {
    const serverMember = interaction.member;

    if (!serverMember) {
      throw new Error('Could not find `member` on interaction');
    }

    if (!(serverMember instanceof GuildMember)) {
      throw new Error('Expected `serverMember` to be an instance of GuildMember');
    }

    const server = getServer(interaction.client);
    const informedRole = findServerRoleByName(server, ServerRoleName.INFORMED);

    const serverMemberHasRole = serverMember.roles.cache.has(informedRole.id);
    if (serverMemberHasRole) {
      await interaction.reply({
        content: `You already have the ${informedRole} role`,
        ephemeral: true,
      });
      return;
    }

    // TODO Handle suspicious names

    await serverMember.roles.add(informedRole);

    const casualChannel = findServerTextChannelByName(server, ServerChannelName.CASUAL);

    await interaction.reply({
      content: `Welcome to the server! I let the others know that you've joined in the ${casualChannel} channel.`,
      ephemeral: true,
    });

    await casualChannel.send(`Please welcome ${serverMember.user} to our server!`);
  },
};
