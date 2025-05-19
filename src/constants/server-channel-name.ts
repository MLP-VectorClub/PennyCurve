import { ChannelMention } from 'discord.js';

export enum ServerChannelName {
  CASUAL = 'casual',
  GAMES = 'games',
  SUPPORT = 'club-helpdesk',
  VECTORS = 'vectors',
  SPOILERS = 'spoilers',
  SUPER_SPOILERS = 'superspoilers',
  ANNOUNCEMENTS = 'announcements',
  NSFW = 'nsfw',
  STAFF_CHAT = 'staffchat',
  BOT_SANDBOX = 'bot-sandbox',
  WELCOME = 'welcome',
}

export type ChannelMentionMap = Partial<Record<ServerChannelName, ChannelMention>>;

const serverChannelNames = new Set<string>(Object.keys(ServerChannelName)
  .map((key) => ServerChannelName[key as keyof typeof ServerChannelName]));

export const isServerChannelKey = (value: string): value is keyof typeof ServerChannelName => value in ServerChannelName;

export const isServerChannelName = (value: string): value is ServerChannelName => serverChannelNames.has(value);
