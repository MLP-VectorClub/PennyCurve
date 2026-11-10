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

export const colorGuideCommand: BotCommand<'cg'> = {
  name: 'cg',
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
