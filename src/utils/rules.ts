import { promises as fs } from 'fs';
import { join } from 'path';
import { ChannelMention, Client } from 'discord.js';
import {
  ChannelMentionMap,
  isServerChannelKey,
  ServerChannelName,
} from '../constants/server-channel-name.js';
import { findServerTextChannelByName, getServer } from './client-utils.js';
import { env } from '../env.js';

export const channelRegex = /#([A-Z_]+)/g;

export const getRulesText = async (): Promise<string> => (await fs.readFile(join(process.cwd(), 'assets', 'rules.txt'))).toString();

export const processRulesText = (rulesText: string, channelMentionMap: ChannelMentionMap, botUserMention: string): string => rulesText
  .replace(channelRegex, (_, n) => (isServerChannelKey(n) && channelMentionMap[ServerChannelName[n]]) || n.toLowerCase())
  .replace(/@me/g, botUserMention)
  .replace(/{{([A-Z_]+)}}/g, (match, key) => {
    if (!(key in env)) throw new Error(`There is no environment variable defined with the name "${key}"`);
    const value = env[key as keyof typeof env];
    if (typeof value !== 'string') throw new Error(`The "${key}" environment variable must be a string`);
    return value;
  });

export const compileRulesText = async (client: Client<true>): Promise<string> => {
  const rulesText = await getRulesText();

  const botUserMention = client.user.toString();
  let channelMentionMap: Partial<Record<ServerChannelName, ChannelMention>> = {};

  const foundChannelNames = rulesText.match(channelRegex);
  if (foundChannelNames) {
    const normalizedChannelNames: (keyof typeof ServerChannelName)[] = foundChannelNames.map((match) => match.substring(1))
      .filter(isServerChannelKey);
    const server = getServer(client);
    const channelMentions = normalizedChannelNames
      .map((channelName) => findServerTextChannelByName(server, ServerChannelName[channelName])
        .toString());

    channelMentionMap = normalizedChannelNames.reduce((map, normalizedName, index) => {
      const channelMention = channelMentions[index];
      if (channelMention) {
        return {
          ...map,
          [ServerChannelName[normalizedName]]: channelMention,
        };
      }
      return map;
    }, {} as typeof channelMentionMap);
  }

  return processRulesText(rulesText, channelMentionMap, botUserMention);
};
