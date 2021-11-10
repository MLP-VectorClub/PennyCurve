import {
  Guild, GuildChannel, MessageButton, User,
} from 'discord.js';
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

export const welcomeUser = async (user: User, server: Guild): Promise<GuildChannel & { name: ServerChannelName.CASUAL }> => {
  const casualChannel = findServerTextChannelByName(server, ServerChannelName.CASUAL);
  await casualChannel.send(`Please welcome ${user} to our server!`);
  return casualChannel;
};

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

    const casualChannel = await welcomeUser(serverMember.user, server);

    await interaction.reply({
      content: `Welcome to the server! I let the others know that you've joined in the ${casualChannel} channel.`,
      ephemeral: true,
    });
  },
};
