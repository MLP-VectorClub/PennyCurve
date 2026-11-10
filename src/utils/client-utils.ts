import { findServerMember as findServerMemberOfInteraction, getServer as getServerById } from '@went.tf/discord-bot-framework/utils';
import { Client, Guild, GuildMember, Interaction, MessageComponentInteraction } from 'discord.js';
import { env } from '../env.js';

export {
  findServerRoleByName,
  findServerTextChannelByName,
  getServerMemberRole,
  isChannelName,
  isSameObject,
  serverMemberHasRole,
} from '@went.tf/discord-bot-framework/utils';

/** Finds the club's server, using `SERVER_ID` unless another ID is given */
export const getServer = (client: Client, serverId = env.SERVER_ID): Guild => getServerById(client, serverId);

/**
 * The framework types this against the `Interaction` union, which has no member for the generic
 * `MessageComponentInteraction` that component handlers receive (although it is one at runtime).
 */
export const findServerMember = (interaction: Interaction | MessageComponentInteraction): GuildMember => (
  findServerMemberOfInteraction(interaction as Interaction)
);
