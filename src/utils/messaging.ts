import { BaseGuildTextChannel, Collection, Message } from 'discord.js';
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
