import { boolFromString, defineEnv } from '@went.tf/discord-bot-framework/env';
import { z } from 'zod';

export const env = defineEnv({
  BACKEND_BASE_URL: z.string(),
  BOT_OWNER_ID: z.string(),
  DISCORD_BOT_TOKEN: z.string(),
  DISCORD_CLIENT_ID: z.string(),
  FRONTEND_BASE_URL: z.string(),
  INVITE_LINK: z.string(),
  LOCAL: boolFromString().default(false),
  SERVER_ID: z.string(),
  UA_STRING: z.string(),
  WS_SERVER_KEY: z.string(),
});
