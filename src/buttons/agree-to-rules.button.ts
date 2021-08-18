import { MessageButton } from 'discord.js';
import { BotButton } from '../bot-interaction-types.js';
import { EmojiCharacters } from '../constants/emoji-characters.js';
import {
  findServerMember,
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
    const serverMember = findServerMember(interaction);
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

    await serverMember.roles.add(informedRole, 'Agreed to the rules');

    const casualChannel = findServerTextChannelByName(server, ServerChannelName.CASUAL);

    await interaction.reply({
      content: `Welcome to the server! I let the others know that you've joined in the ${casualChannel} channel.`,
      ephemeral: true,
    });

    await casualChannel.send(`Please welcome ${serverMember.user} to our server!`);
  },
};
