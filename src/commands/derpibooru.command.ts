import axios from 'axios';
import { BotCommand } from '../bot-interaction-types.js';
import { ServerChannelName } from '../constants/server-channel-name.js';
import { findServerTextChannelByName, getServer, isChannelName } from '../utils/client-utils.js';
import { PhilomenaImageResponse } from '../types/philomena-api.js';
import { respondWithDerpibooruImage } from '../utils/shared-handlers.js';

enum OptionName {
  QUERY = 'query',
  ORDER = 'order',
  SORT = 'sort',
  AS_LINK = 'as-link',
  BRIEF = 'brief',
}

const responseTypeGuard = (resp: unknown): resp is { images: PhilomenaImageResponse[] } => typeof resp === 'object' && resp !== null && 'images' in resp && Array.isArray((resp as { images?: [] }).images);

export const derpibooruCommand: BotCommand<'db'> = {
  name: 'db',
  async handle(interaction, { logger }) {
    const { channel, options } = interaction;
    const query = options.getString(OptionName.QUERY, true);
    const inNSFW = isChannelName(channel, ServerChannelName.NSFW);
    const returnAsLink = options.getBoolean(OptionName.AS_LINK, false) ?? false;
    const briefEmbed = options.getBoolean(OptionName.BRIEF, false) ?? false;
    const order = options.getString(OptionName.ORDER, false);
    const sort = options.getString(OptionName.SORT, false);

    const parameters = [`q=${encodeURIComponent(query)}`];
    if (typeof order !== 'undefined') parameters.push(`sd=${order}`);
    if (typeof sort !== 'undefined') parameters.push(`sf=${sort}`);
    if (!returnAsLink) {
      if (inNSFW) parameters.push('filter_id=56027');
      parameters.push('per_page=1');
    }

    const url = `https://derpibooru.org/api/v1/json/search/images?${parameters.join('&')}`;

    if (returnAsLink) {
      await interaction.reply(url.replace('/api/v1/json/search/images', '/search'));
      return;
    }

    logger.log(`Derpi search: ${url}`);
    const { data } = await axios.get(url, { responseType: 'json' });

    if (!responseTypeGuard(data)) throw new Error(`Malformed data received from Derpibooru: ${JSON.stringify(data)}`);

    if (data.images.length < 1) {
      const server = getServer(interaction.client);
      const nsfwChannel = findServerTextChannelByName(server, ServerChannelName.NSFW);
      const responseText = ['Derpibooru search returned no results.'];
      if (/(questionable|explicit|grimdark|grotesque)/.test(query) && !inNSFW) {
        responseText.push(`Searching for system tags other than \`safe\` and \`suggestive\` is unlikely to produce any results outside the ${nsfwChannel} channel.`);
      }
      if (!/(artist|oc):/.test(query)) {
        responseText.push('Don\'t forget that artist and OC tags need to be prefixed with `artist:` and `oc:` respectively.');
      }
      await interaction.reply(responseText.join(' '));
      return;
    }

    await respondWithDerpibooruImage(interaction, logger, data.images[0], briefEmbed);
  },
};
