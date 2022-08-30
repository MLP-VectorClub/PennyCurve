import { ApplicationCommandOptionType } from 'discord-api-types/v10';
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

enum OrderOptions {
  DESCENDING = 'desc',
  ASCENDING = 'asc',
}

enum SortOptions {
  ID = 'id',
  UPDATED_AT = 'updated_at',
  FIRST_SEEN_AT = 'first_seen_at',
  ASPECT_RATIO = 'aspect_ratio',
  FAVORITES = 'faves',
  UPVOTES = 'upvotes',
  DOWNVOTES = 'downvotes',
  SCORE = 'score',
  WILSON_SCORE = 'wilson_score',
  RELEVANCE = '_score',
  WIDTH = 'width',
  HEIGHT = 'height',
  COMMENTS = 'comment_count',
  TAG_COUNT = 'tag_count',
  PIXELS = 'pixels',
  SIZE = 'size',
  DURATION = 'duration',
  RANDOM = 'random',
}

const responseTypeGuard = (resp: unknown): resp is { images: PhilomenaImageResponse[] } => typeof resp === 'object' && resp !== null && 'images' in resp && Array.isArray((resp as { images?: [] }).images);

export const derpibooruCommand: BotCommand = {
  definition: {
    description: `Searches Derpibooru and returns the first result. Default filter is applied outside #${ServerChannelName.NSFW}`,
    options: [
      {
        name: OptionName.QUERY,
        description: 'Search query (same syntax is used for searching as on the site itself)',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: OptionName.ORDER,
        description: `Ordering of the search results (default: \`${OrderOptions.DESCENDING}\`)`,
        type: ApplicationCommandOptionType.String,
        required: false,
        choices: [
          {
            name: 'Descending',
            value: OrderOptions.DESCENDING,
          },
          {
            name: 'Ascending',
            value: OrderOptions.ASCENDING,
          },
        ],
      },
      {
        name: OptionName.SORT,
        description: `Same as "Sort by" on the actual site (default: \`${SortOptions.ID}\`)`,
        type: ApplicationCommandOptionType.String,
        required: false,
        choices: [
          { name: 'image ID', value: SortOptions.ID },
          { name: 'last modification date', value: SortOptions.UPDATED_AT },
          { name: 'initial post date', value: SortOptions.FIRST_SEEN_AT },
          { name: 'aspect ratio', value: SortOptions.ASPECT_RATIO },
          { name: 'fave count', value: SortOptions.FAVORITES },
          { name: 'upvotes', value: SortOptions.UPVOTES },
          { name: 'downvotes', value: SortOptions.DOWNVOTES },
          { name: 'score', value: SortOptions.SCORE },
          { name: 'Wilson score', value: SortOptions.WILSON_SCORE },
          { name: 'relevance', value: SortOptions.RELEVANCE },
          { name: 'width', value: SortOptions.WIDTH },
          { name: 'height', value: SortOptions.HEIGHT },
          { name: 'comments', value: SortOptions.COMMENTS },
          { name: 'tag count', value: SortOptions.TAG_COUNT },
          { name: 'pixels', value: SortOptions.PIXELS },
          { name: 'file size', value: SortOptions.SIZE },
          { name: 'duration', value: SortOptions.DURATION },
          { name: 'Random!', value: SortOptions.RANDOM },
        ],
      },
      {
        name: OptionName.AS_LINK,
        description: 'When true, simply returns the link to the search page instead of embedding the first result',
        type: ApplicationCommandOptionType.Boolean,
        required: false,
      },
      {
        name: OptionName.BRIEF,
        description: 'When specified, details like the description, uploader and counters will not be shown in the embed',
        type: ApplicationCommandOptionType.Boolean,
        required: false,
      },
    ],
  },
  async handle(interaction) {
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

    console.info(`Derpi search: ${url}`);
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

    await respondWithDerpibooruImage(interaction, data.images[0], briefEmbed);
  },
};
