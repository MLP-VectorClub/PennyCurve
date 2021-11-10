import {
  BaseCommandInteraction,
  BaseGuildTextChannel, Collection, CommandInteractionOption, Message, User,
} from 'discord.js';
import { Snowflake } from 'discord-api-types';
import { condenseStringArray } from './strings.js';
import { queueLazyPromises } from './promises.js';

export async function sendMessageSlices(channel: BaseGuildTextChannel, message: string): Promise<void> {
  const messageSlices = condenseStringArray(message.split(/\n\n/g), 2000, '\n\n');

  await queueLazyPromises(messageSlices.map((slice) => () => channel.send(slice)));
}

export async function loadAllMessages(channel: BaseGuildTextChannel): Promise<Collection<Snowflake, Message>> {
  let beforeId: string | undefined;
  let done = false;
  let allMessages: Collection<Snowflake, Message> = new Collection();
  while (!done) {
    // eslint-disable-next-line no-await-in-loop
    const messages = await channel.messages.fetch({
      limit: 10,
      before: beforeId || undefined,
    });

    if (messages.size > 0) {
      beforeId = messages.lastKey();
      allMessages = allMessages.concat(messages);
    } else {
      done = true;
    }
  }

  if (typeof allMessages === 'undefined') throw new Error('Expected `allMessages` to be defined');

  return allMessages;
}

export const getUserIdentifier = (user: User): `${string}#${string} (${string})` => `${user.username}#${user.discriminator} (${user.id})`;

export const stringifyChannelName = (channel: BaseCommandInteraction['channel']): string => {
  if (channel) {
    if (channel.isText() && 'name' in channel) {
      return `#${channel.name}`;
    }

    return channel.toString();
  }

  return '(unknown channel)';
};

export const stringifyOptionsData = (data: readonly CommandInteractionOption[]): string => data.map((option): string => {
  const optionName = option.name;
  let optionValue = option.value;
  // eslint-disable-next-line default-case
  switch (option.type) {
    case 'CHANNEL':
      if (option.channel) optionValue = `${option.channel.type === 'GUILD_TEXT' ? '#' : ''}${option.channel.name}`;
      break;
    case 'USER':
      if (option.user) optionValue = getUserIdentifier(option.user);
      break;
    case 'ROLE':
      if (option.role) optionValue = `@${option.role.name}`;
      break;
  }
  return `(${optionName}:${optionValue})`;
}).join(' ');
