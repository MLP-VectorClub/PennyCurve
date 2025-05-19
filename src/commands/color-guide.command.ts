import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import axios from 'axios';
import { BotCommand } from '../bot-interaction-types.js';

enum OptionName {
  QUERY = 'name',
  GUIDE = 'guide',
}

enum GuideNames {
  FRIENDSHIP_IS_MAGIC = 'pony',
  EQUESTRIA_GIRLS = 'eqg',
  PONY_LIFE = 'pl',
}

type AppGotoResponse = { status: false } | { status: true; goto: string };

const responseTypeGuard = (data: AppGotoResponse | unknown): data is AppGotoResponse => {
  const checkBaseType = typeof data === 'object'
    && data !== null
    && 'status' in data
    && typeof (data as { status: unknown }).status === 'boolean';
  if (!checkBaseType) return false;

  const localData = data as ({ status: boolean; goto?: unknown });
  return !localData.status || typeof localData.goto === 'string';
};

export const colorGuideCommand: BotCommand = {
  definition: {
    description: 'This command can be used to quickly find a color guide page using our website\'s search.',
    options: [
      {
        name: OptionName.QUERY,
        description: 'Enter the character or object\'s name. Does not need to be the full name.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: OptionName.GUIDE,
        description: 'name of the guide to search in, defaults to the Friendship is Magic guide',
        type: ApplicationCommandOptionType.String,
        required: false,
        choices: [
          {
            name: 'Friendship is Magic',
            value: GuideNames.FRIENDSHIP_IS_MAGIC,
          },
          {
            name: 'Equestria Girls',
            value: GuideNames.EQUESTRIA_GIRLS,
          },
          {
            name: 'Pony Life',
            value: GuideNames.PONY_LIFE,
          },
        ],
      },
    ],
  },
  async handle(interaction) {
    const query = interaction.options.getString(OptionName.QUERY, true);
    const guideName = interaction.options.getString(OptionName.GUIDE) || GuideNames.FRIENDSHIP_IS_MAGIC;
    const url = `/cg/${guideName}?btnl&json&q=${encodeURIComponent(query)}`;

    const { data } = await axios.get(url, {
      responseType: 'json',
      baseURL: process.env.BACKEND_BASE_URL,
    });

    if (!responseTypeGuard(data)) throw new Error(`Malformed data received from backend: ${JSON.stringify(data)}`);

    if (!data.status) throw new Error(`Color Guide search failed: ${JSON.stringify(data)}`);

    await interaction.reply(process.env.FRONTEND_BASE_URL + (data.goto.substring(1)));
  },
};
