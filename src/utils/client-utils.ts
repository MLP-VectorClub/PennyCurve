import {
  Client,
  Guild,
  GuildMember,
  Interaction,
  Role,
  TextBasedChannels,
  TextChannel,
} from 'discord.js';
import { env } from '../env.js';
import { ServerChannelName } from '../constants/server-channel-name.js';
import { ServerRoleName } from '../constants/server-role-name.js';

export const getServer = (client: Client, serverId = env.SERVER_ID): Guild => {
  const foundServer = client.guilds.cache.get(serverId);

  if (!foundServer) throw new Error(`Could not find server with ID ${serverId}`);

  return foundServer;
};

export const findServerTextChannelByName = (server: Guild, name: ServerChannelName): TextChannel => {
  const foundChannel = server?.channels.cache
    .find((channel) => channel.name === name);

  if (!foundChannel) throw new Error(`Could not find a channel named ${name}`);
  if (foundChannel.isThread()) throw new Error(`Found thread for name ${name}, expected GuildChannel`);
  if (!foundChannel.isText() || foundChannel.type !== 'GUILD_TEXT') throw new Error(`Found non-text channel for name ${name} (type=${foundChannel.type})`);

  return foundChannel;
};

export const findServerRoleByName = (server: Guild, name: ServerRoleName): Role => {
  const foundRole = server?.roles.cache.find((role) => role.name === name);

  if (!foundRole) throw new Error(`Could not find a role named ${name}`);

  return foundRole;
};

export const isChannelName = (channel: TextBasedChannels | null | undefined, name: ServerChannelName): boolean => Boolean(channel && 'name' in channel && channel.name === name);

export const findServerMember = (interaction: Interaction): GuildMember => {
  const serverMember = interaction.member;

  if (!serverMember) {
    throw new Error('Could not find `member` on interaction');
  }

  if (!(serverMember instanceof GuildMember)) {
    throw new Error('Expected `serverMember` to be an instance of GuildMember');
  }

  return serverMember;
};

export const getServerMemberRole = (member: GuildMember, roleName: ServerRoleName): Role | undefined => (
  member.roles.cache.find((role) => role.name === roleName)
);

export const serverMemberHasRole = (member: GuildMember, role: Role): boolean => (
  member.roles.cache.has(role.id)
);

export const isSameObject = <T extends { id: string }>(member1: Pick<T, 'id'>, member2: Pick<T, 'id'>): boolean => (
  member1.id === member2.id
);
