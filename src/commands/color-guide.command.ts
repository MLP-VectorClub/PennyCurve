import axios from 'axios';
import { BotCommand } from '../bot-interaction-types.js';
import { env } from '../env.js';

enum OptionName {
  QUERY = 'name',
  GUIDE = 'guide',
}

enum GuideNames {
  FRIENDSHIP_IS_MAGIC = 'pony',
  EQUESTRIA_GIRLS = 'eqg',
}

/** The smallest page size the API accepts, only the first result is used */
const SEARCH_PAGE_SIZE = 7;

type AppearanceSearchResponse = { appearances: Array<{ id: number; label: string; guide: string | null }> };

const responseTypeGuard = (data: unknown): data is AppearanceSearchResponse => typeof data === 'object'
  && data !== null
  && 'appearances' in data
  && Array.isArray((data as { appearances: unknown }).appearances);

export const colorGuideCommand: BotCommand<'cg'> = {
  name: 'cg',
  async handle(interaction) {
    const query = interaction.options.getString(OptionName.QUERY, true);
    const guideName = interaction.options.getString(OptionName.GUIDE) || GuideNames.FRIENDSHIP_IS_MAGIC;

    const { data, status } = await axios.get('/appearances', {
      responseType: 'json',
      baseURL: env.BACKEND_BASE_URL,
      params: { guide: guideName, q: query, size: SEARCH_PAGE_SIZE },
    });

    if (status !== 200 || !responseTypeGuard(data)) throw new Error(`Color Guide search failed (status ${status}): ${JSON.stringify(data)}`);

    const [appearance] = data.appearances;
    if (!appearance) {
      await interaction.reply({
        content: `No appearance matching \`${query}\` was found in that guide.`,
        ephemeral: true,
      });
      return;
    }

    // The site redirects to the canonical URL, which also contains the label
    await interaction.reply(`${env.FRONTEND_BASE_URL}cg/${guideName}/v/${appearance.id}`);
  },
};
