import { config } from 'dotenv';

config();

const {
  BACKEND_BASE_URL,
  BOT_OWNER_ID,
  DISCORD_BOT_TOKEN,
  DISCORD_CLIENT_ID,
  FRONTEND_BASE_URL,
  INVITE_LINK,
  LOCAL,
  SERVER_ID,
  UA_STRING,
  WS_SERVER_KEY,
} = process.env;

export const env = (() => {
  const values = {
    BACKEND_BASE_URL,
    BOT_OWNER_ID,
    DISCORD_BOT_TOKEN,
    DISCORD_CLIENT_ID,
    FRONTEND_BASE_URL,
    INVITE_LINK,
    LOCAL: typeof LOCAL !== 'undefined' && LOCAL === 'true',
    SERVER_ID,
    UA_STRING,
    WS_SERVER_KEY,
  };

  type Values = typeof values;

  Object.keys(values)
    .forEach((key) => {
      if (typeof values[key as keyof Values] !== 'undefined') return;

      throw new Error(`${key} environment variable not set`);
    });

  return values as { [Key in keyof Values]: Exclude<Values[Key], undefined> };
})();
